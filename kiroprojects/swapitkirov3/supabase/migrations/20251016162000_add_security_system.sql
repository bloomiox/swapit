-- Add security events and audit logging system
-- This migration creates tables and functions for security monitoring

-- Create security_events table for tracking security incidents
CREATE TABLE IF NOT EXISTS security_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type VARCHAR(50) NOT NULL CHECK (event_type IN (
        'login_attempt', 'failed_login', 'suspicious_activity', 
        'data_breach', 'policy_violation', 'account_lockout',
        'password_reset', 'admin_access', 'unauthorized_access'
    )),
    severity VARCHAR(20) NOT NULL DEFAULT 'low' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    user_email VARCHAR(255),
    ip_address INET,
    user_agent TEXT,
    metadata JSONB DEFAULT '{}',
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'investigating', 'resolved', 'dismissed')),
    resolved_by UUID REFERENCES users(id) ON DELETE SET NULL,
    resolved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create audit_logs table for tracking all system changes
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    table_name VARCHAR(100) NOT NULL,
    record_id UUID,
    action VARCHAR(20) NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')),
    old_values JSONB,
    new_values JSONB,
    changed_fields TEXT[],
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    user_email VARCHAR(255),
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create security_settings table for configurable security policies
CREATE TABLE IF NOT EXISTS security_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value JSONB NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default security settings
INSERT INTO security_settings (setting_key, setting_value, description) VALUES
('max_login_attempts', '5', 'Maximum failed login attempts before account lockout'),
('lockout_duration_minutes', '30', 'Account lockout duration in minutes'),
('password_min_length', '8', 'Minimum password length requirement'),
('session_timeout_hours', '24', 'Session timeout in hours'),
('require_2fa_admin', 'true', 'Require 2FA for admin accounts'),
('rate_limit_requests_per_minute', '60', 'API rate limit per minute per user'),
('suspicious_activity_threshold', '10', 'Threshold for flagging suspicious activity')
ON CONFLICT (setting_key) DO NOTHING;

-- Function to log security events
CREATE OR REPLACE FUNCTION log_security_event(
    p_event_type VARCHAR(50),
    p_severity VARCHAR(20),
    p_title VARCHAR(255),
    p_description TEXT DEFAULT NULL,
    p_user_id UUID DEFAULT NULL,
    p_user_email VARCHAR(255) DEFAULT NULL,
    p_ip_address INET DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL,
    p_metadata JSONB DEFAULT '{}'
)
RETURNS UUID AS $$
DECLARE
    event_id UUID;
BEGIN
    INSERT INTO security_events (
        event_type, severity, title, description, user_id, 
        user_email, ip_address, user_agent, metadata
    ) VALUES (
        p_event_type, p_severity, p_title, p_description, p_user_id,
        p_user_email, p_ip_address, p_user_agent, p_metadata
    ) RETURNING id INTO event_id;
    
    -- Notify admins of high/critical security events
    IF p_severity IN ('high', 'critical') THEN
        INSERT INTO notifications (user_id, type, title, message, data)
        SELECT 
            u.id,
            'admin_security',
            'Security Alert: ' || p_title,
            p_description,
            jsonb_build_object(
                'event_id', event_id,
                'severity', p_severity,
                'event_type', p_event_type
            )
        FROM users u 
        WHERE u.is_admin = true OR u.role = 'admin';
    END IF;
    
    RETURN event_id;
END;
$$ LANGUAGE plpgsql;

-- Function to get security dashboard stats
CREATE OR REPLACE FUNCTION get_security_dashboard_stats()
RETURNS JSONB AS $$
DECLARE
    result JSONB;
BEGIN
    SELECT jsonb_build_object(
        'active_threats', (
            SELECT COUNT(*) FROM security_events 
            WHERE status = 'active' AND severity IN ('high', 'critical')
        ),
        'investigating', (
            SELECT COUNT(*) FROM security_events 
            WHERE status = 'investigating'
        ),
        'resolved_today', (
            SELECT COUNT(*) FROM security_events 
            WHERE status = 'resolved' 
            AND DATE(resolved_at) = CURRENT_DATE
        ),
        'critical_events', (
            SELECT COUNT(*) FROM security_events 
            WHERE severity = 'critical' 
            AND created_at >= CURRENT_DATE - INTERVAL '30 days'
        ),
        'failed_logins_24h', (
            SELECT COUNT(*) FROM security_events 
            WHERE event_type = 'failed_login' 
            AND created_at >= NOW() - INTERVAL '24 hours'
        ),
        'suspicious_activities_7d', (
            SELECT COUNT(*) FROM security_events 
            WHERE event_type = 'suspicious_activity' 
            AND created_at >= CURRENT_DATE - INTERVAL '7 days'
        ),
        'blocked_ips', (
            SELECT COUNT(DISTINCT ip_address) FROM security_events 
            WHERE event_type = 'account_lockout' 
            AND created_at >= CURRENT_DATE - INTERVAL '30 days'
        ),
        'admin_accesses_today', (
            SELECT COUNT(*) FROM security_events 
            WHERE event_type = 'admin_access' 
            AND DATE(created_at) = CURRENT_DATE
        )
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Function to get recent security events
CREATE OR REPLACE FUNCTION get_recent_security_events(
    p_limit INTEGER DEFAULT 50,
    p_severity VARCHAR(20) DEFAULT 'all'
)
RETURNS TABLE (
    id UUID,
    event_type VARCHAR(50),
    severity VARCHAR(20),
    title VARCHAR(255),
    description TEXT,
    user_email VARCHAR(255),
    ip_address INET,
    status VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        se.id,
        se.event_type,
        se.severity,
        se.title,
        se.description,
        se.user_email,
        se.ip_address,
        se.status,
        se.created_at
    FROM security_events se
    WHERE (p_severity = 'all' OR se.severity = p_severity)
    ORDER BY se.created_at DESC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- Trigger function to log authentication events
CREATE OR REPLACE FUNCTION log_auth_events()
RETURNS TRIGGER AS $$
BEGIN
    -- Log successful logins (when last_sign_in_at is updated)
    IF TG_OP = 'UPDATE' AND OLD.last_sign_in_at IS DISTINCT FROM NEW.last_sign_in_at THEN
        PERFORM log_security_event(
            'login_attempt',
            'low',
            'User login',
            'User successfully logged in',
            NEW.id,
            NEW.email,
            NULL, -- IP would need to be passed from application
            NULL  -- User agent would need to be passed from application
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for auth events (on auth.users table if accessible)
-- Note: This would typically be set up on the auth.users table in a real implementation

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_security_events_type ON security_events(event_type);
CREATE INDEX IF NOT EXISTS idx_security_events_severity ON security_events(severity);
CREATE INDEX IF NOT EXISTS idx_security_events_status ON security_events(status);
CREATE INDEX IF NOT EXISTS idx_security_events_created_at ON security_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_security_events_user_id ON security_events(user_id);
CREATE INDEX IF NOT EXISTS idx_security_events_ip ON security_events(ip_address);

CREATE INDEX IF NOT EXISTS idx_audit_logs_table_name ON audit_logs(table_name);
CREATE INDEX IF NOT EXISTS idx_audit_logs_record_id ON audit_logs(record_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);

-- Add updated_at trigger for security_events
DROP TRIGGER IF EXISTS update_security_events_updated_at ON security_events;
CREATE TRIGGER update_security_events_updated_at 
    BEFORE UPDATE ON security_events 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Add updated_at trigger for security_settings
DROP TRIGGER IF EXISTS update_security_settings_updated_at ON security_settings;
CREATE TRIGGER update_security_settings_updated_at 
    BEFORE UPDATE ON security_settings 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample security events for demonstration
INSERT INTO security_events (event_type, severity, title, description, user_email, ip_address, status) VALUES
('failed_login', 'medium', 'Multiple failed login attempts', 'User attempted to login 5 times with wrong password', 'suspicious@example.com', '192.168.1.100', 'active'),
('suspicious_activity', 'high', 'Unusual item posting pattern', 'User posted 20 items in 5 minutes', 'spammer@example.com', '10.0.0.50', 'investigating'),
('policy_violation', 'low', 'Inappropriate content reported', 'User reported for posting inappropriate item', 'reported@example.com', '172.16.0.25', 'resolved'),
('admin_access', 'medium', 'Admin panel access', 'Administrator accessed admin panel', 'admin@swapit.com', '192.168.1.10', 'resolved'),
('account_lockout', 'high', 'Account temporarily locked', 'Account locked due to suspicious activity', 'locked@example.com', '203.0.113.45', 'active');