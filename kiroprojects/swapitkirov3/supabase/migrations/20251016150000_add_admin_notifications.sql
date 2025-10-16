-- Add admin notification system and enhance reports table
-- This migration adds proper admin notifications for moderation and payments

-- Extend notification types to include admin notifications
ALTER TYPE notification_type ADD VALUE IF NOT EXISTS 'admin_report';
ALTER TYPE notification_type ADD VALUE IF NOT EXISTS 'admin_payment';
ALTER TYPE notification_type ADD VALUE IF NOT EXISTS 'admin_moderation';

-- Enhance user_reports table with more fields
ALTER TABLE user_reports 
ADD COLUMN IF NOT EXISTS reported_item_id UUID REFERENCES items(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS report_type VARCHAR(20) DEFAULT 'user' CHECK (report_type IN ('user', 'item', 'message')),
ADD COLUMN IF NOT EXISTS category VARCHAR(100),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS reviewed_by UUID REFERENCES users(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMP WITH TIME ZONE;

-- Update status column to use proper enum
ALTER TABLE user_reports 
ALTER COLUMN status TYPE VARCHAR(20),
ADD CONSTRAINT user_reports_status_check CHECK (status IN ('pending', 'reviewed', 'resolved', 'dismissed'));

-- Create admin_settings table for admin configuration
CREATE TABLE IF NOT EXISTS admin_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key VARCHAR(100) NOT NULL UNIQUE,
    value JSONB NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default admin settings
INSERT INTO admin_settings (key, value, description) VALUES
('notification_settings', '{"reports": true, "payments": true, "moderation": true}', 'Admin notification preferences'),
('auto_moderation', '{"enabled": false, "threshold": 3}', 'Automatic moderation settings'),
('payment_alerts', '{"failed_payments": true, "refunds": true, "disputes": true}', 'Payment notification settings')
ON CONFLICT (key) DO NOTHING;

-- Function to notify admins of new reports
CREATE OR REPLACE FUNCTION notify_admins_of_report()
RETURNS TRIGGER AS $$
DECLARE
    admin_user RECORD;
    report_title TEXT;
    report_message TEXT;
BEGIN
    -- Create notification title and message based on report type
    IF NEW.report_type = 'user' THEN
        report_title := 'New User Report';
        report_message := format('User reported for: %s', NEW.category);
    ELSIF NEW.report_type = 'item' THEN
        report_title := 'New Item Report';
        report_message := format('Item reported for: %s', NEW.category);
    ELSE
        report_title := 'New Report';
        report_message := format('New %s report: %s', NEW.report_type, NEW.category);
    END IF;

    -- Notify all admin users
    FOR admin_user IN 
        SELECT id FROM users 
        WHERE is_admin = true OR role = 'admin'
    LOOP
        INSERT INTO notifications (
            user_id,
            type,
            title,
            message,
            data
        ) VALUES (
            admin_user.id,
            'admin_report',
            report_title,
            report_message,
            jsonb_build_object(
                'report_id', NEW.id,
                'report_type', NEW.report_type,
                'category', NEW.category,
                'reporter_id', NEW.reporter_id
            )
        );
    END LOOP;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to notify admins of payment issues
CREATE OR REPLACE FUNCTION notify_admins_of_payment_issue()
RETURNS TRIGGER AS $$
DECLARE
    admin_user RECORD;
    payment_title TEXT;
    payment_message TEXT;
BEGIN
    -- Only notify on failed payments or status changes to failed
    IF NEW.status = 'failed' AND (OLD IS NULL OR OLD.status != 'failed') THEN
        payment_title := 'Payment Failed';
        payment_message := format('Payment of %s %s failed for user', NEW.amount, NEW.currency);

        -- Notify all admin users
        FOR admin_user IN 
            SELECT id FROM users 
            WHERE is_admin = true OR role = 'admin'
        LOOP
            INSERT INTO notifications (
                user_id,
                type,
                title,
                message,
                data
            ) VALUES (
                admin_user.id,
                'admin_payment',
                payment_title,
                payment_message,
                jsonb_build_object(
                    'transaction_id', NEW.id,
                    'amount', NEW.amount,
                    'currency', NEW.currency,
                    'user_id', NEW.user_id,
                    'status', NEW.status
                )
            );
        END LOOP;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for admin notifications
DROP TRIGGER IF EXISTS notify_admins_report_trigger ON user_reports;
CREATE TRIGGER notify_admins_report_trigger
    AFTER INSERT ON user_reports
    FOR EACH ROW
    EXECUTE FUNCTION notify_admins_of_report();

DROP TRIGGER IF EXISTS notify_admins_payment_trigger ON transactions;
CREATE TRIGGER notify_admins_payment_trigger
    AFTER INSERT OR UPDATE ON transactions
    FOR EACH ROW
    EXECUTE FUNCTION notify_admins_of_payment_issue();

-- Add updated_at trigger for user_reports
DROP TRIGGER IF EXISTS update_user_reports_updated_at ON user_reports;
CREATE TRIGGER update_user_reports_updated_at 
    BEFORE UPDATE ON user_reports 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Add updated_at trigger for admin_settings
DROP TRIGGER IF EXISTS update_admin_settings_updated_at ON admin_settings;
CREATE TRIGGER update_admin_settings_updated_at 
    BEFORE UPDATE ON admin_settings 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_reports_type ON user_reports(report_type);
CREATE INDEX IF NOT EXISTS idx_user_reports_status ON user_reports(status);
CREATE INDEX IF NOT EXISTS idx_user_reports_created_at ON user_reports(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_settings_key ON admin_settings(key);

-- Function to get admin dashboard stats (replaces hardcoded data)
CREATE OR REPLACE FUNCTION get_admin_dashboard_stats()
RETURNS JSONB AS $$
DECLARE
    stats JSONB;
BEGIN
    SELECT jsonb_build_object(
        'total_users', (SELECT COUNT(*) FROM users),
        'active_users', (SELECT COUNT(*) FROM users WHERE is_active = true),
        'total_items', (SELECT COUNT(*) FROM items),
        'active_items', (SELECT COUNT(*) FROM items WHERE is_available = true),
        'total_swaps', (SELECT COUNT(*) FROM swap_requests),
        'completed_swaps', (SELECT COUNT(*) FROM swap_requests WHERE status = 'completed'),
        'pending_reports', (SELECT COUNT(*) FROM user_reports WHERE status = 'pending'),
        'total_revenue', (
            SELECT COALESCE(SUM(amount), 0) 
            FROM transactions 
            WHERE status = 'completed'
        ),
        'failed_payments', (
            SELECT COUNT(*) 
            FROM transactions 
            WHERE status = 'failed' 
            AND created_at >= NOW() - INTERVAL '30 days'
        ),
        'recent_signups', (
            SELECT COUNT(*) 
            FROM users 
            WHERE created_at >= NOW() - INTERVAL '7 days'
        )
    ) INTO stats;
    
    RETURN stats;
END;
$$ LANGUAGE plpgsql;