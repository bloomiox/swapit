-- Payment System Migration
-- This migration adds comprehensive payment support for Stripe and Payrexx

-- Create payment_providers enum
CREATE TYPE payment_provider AS ENUM ('stripe', 'payrexx');

-- Create payment_status enum
CREATE TYPE payment_status AS ENUM ('pending', 'processing', 'succeeded', 'failed', 'canceled', 'refunded');

-- Create currency enum
CREATE TYPE currency_type AS ENUM ('USD', 'EUR', 'CHF', 'GBP');

-- Create payment_methods table
CREATE TABLE IF NOT EXISTS payment_methods (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    provider payment_provider NOT NULL,
    provider_payment_method_id TEXT NOT NULL, -- Stripe payment method ID or Payrexx equivalent
    type TEXT NOT NULL, -- card, bank_account, etc.
    last_four TEXT,
    brand TEXT, -- visa, mastercard, etc.
    exp_month INTEGER,
    exp_year INTEGER,
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enhance existing transactions table
-- Add new columns to existing transactions table if they don't exist
ALTER TABLE transactions 
ADD COLUMN IF NOT EXISTS provider_transaction_id TEXT,
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS payment_method_id UUID REFERENCES payment_methods(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP WITH TIME ZONE;

-- Update existing columns to match new structure if needed
-- Note: We keep the existing structure mostly intact for compatibility

-- Create boosts table (enhanced)
DROP TABLE IF EXISTS boosts;
CREATE TABLE IF NOT EXISTS boosts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    item_id UUID REFERENCES items(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    transaction_id UUID REFERENCES transactions(id) ON DELETE SET NULL,
    boost_type TEXT NOT NULL DEFAULT 'premium', -- premium, featured, urgent
    duration_days INTEGER NOT NULL DEFAULT 7,
    amount_paid INTEGER NOT NULL, -- Amount in cents
    currency currency_type NOT NULL DEFAULT 'USD',
    starts_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create subscriptions table (for future premium features)
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    provider payment_provider NOT NULL,
    provider_subscription_id TEXT NOT NULL,
    status TEXT NOT NULL, -- active, canceled, past_due, etc.
    plan_name TEXT NOT NULL,
    amount INTEGER NOT NULL, -- Amount in cents
    currency currency_type NOT NULL DEFAULT 'USD',
    billing_cycle TEXT NOT NULL DEFAULT 'monthly', -- monthly, yearly
    current_period_start TIMESTAMP WITH TIME ZONE,
    current_period_end TIMESTAMP WITH TIME ZONE,
    cancel_at_period_end BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create payment_webhooks table (for webhook event tracking)
CREATE TABLE IF NOT EXISTS payment_webhooks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    provider payment_provider NOT NULL,
    event_id TEXT NOT NULL,
    event_type TEXT NOT NULL,
    processed BOOLEAN DEFAULT false,
    data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    processed_at TIMESTAMP WITH TIME ZONE
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_payment_methods_user_id ON payment_methods(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_methods_provider ON payment_methods(provider);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_provider ON transactions(payment_provider);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_provider_transaction_id ON transactions(provider_transaction_id) WHERE provider_transaction_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_boosts_item_id ON boosts(item_id);
CREATE INDEX IF NOT EXISTS idx_boosts_user_id ON boosts(user_id);
CREATE INDEX IF NOT EXISTS idx_boosts_active ON boosts(is_active);
CREATE INDEX IF NOT EXISTS idx_boosts_expires_at ON boosts(expires_at);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_provider ON subscriptions(provider);
CREATE INDEX IF NOT EXISTS idx_payment_webhooks_provider ON payment_webhooks(provider);
CREATE INDEX IF NOT EXISTS idx_payment_webhooks_event_id ON payment_webhooks(event_id);
CREATE INDEX IF NOT EXISTS idx_payment_webhooks_processed ON payment_webhooks(processed);

-- Add RLS policies
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE boosts ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_webhooks ENABLE ROW LEVEL SECURITY;

-- Payment methods policies
CREATE POLICY "Users can view their own payment methods" ON payment_methods
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own payment methods" ON payment_methods
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own payment methods" ON payment_methods
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own payment methods" ON payment_methods
    FOR DELETE USING (auth.uid() = user_id);

-- Transactions policies
CREATE POLICY "Users can view their own transactions" ON transactions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own transactions" ON transactions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Admins can view all transactions
CREATE POLICY "Admins can view all transactions" ON transactions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.is_admin = true
        )
    );

-- Boosts policies
CREATE POLICY "Users can view boosts for their items" ON boosts
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert boosts for their items" ON boosts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Public can view active boosts" ON boosts
    FOR SELECT USING (is_active = true AND expires_at > NOW());

-- Subscriptions policies
CREATE POLICY "Users can view their own subscriptions" ON subscriptions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own subscriptions" ON subscriptions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Webhook policies (admin only)
CREATE POLICY "Only admins can access webhooks" ON payment_webhooks
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.is_admin = true
        )
    );

-- Create functions for boost management
CREATE OR REPLACE FUNCTION activate_boost()
RETURNS TRIGGER AS $$
BEGIN
    -- Set expires_at based on duration_days
    NEW.expires_at = NEW.starts_at + (NEW.duration_days || ' days')::INTERVAL;
    
    -- Ensure only one active boost per item
    UPDATE boosts 
    SET is_active = false 
    WHERE item_id = NEW.item_id 
    AND id != NEW.id 
    AND is_active = true;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_activate_boost ON boosts;
CREATE TRIGGER trigger_activate_boost
    BEFORE INSERT OR UPDATE ON boosts
    FOR EACH ROW
    EXECUTE FUNCTION activate_boost();

-- Create function to expire boosts
CREATE OR REPLACE FUNCTION expire_boosts()
RETURNS void AS $$
BEGIN
    UPDATE boosts 
    SET is_active = false 
    WHERE is_active = true 
    AND expires_at <= NOW();
END;
$$ LANGUAGE plpgsql;

-- Create function to update transaction status
CREATE OR REPLACE FUNCTION update_transaction_status(
    transaction_id UUID,
    new_status payment_status,
    completion_time TIMESTAMP WITH TIME ZONE DEFAULT NOW()
)
RETURNS void AS $$
BEGIN
    UPDATE transactions 
    SET 
        status = new_status,
        updated_at = NOW(),
        completed_at = CASE 
            WHEN new_status IN ('succeeded', 'failed', 'canceled', 'refunded') 
            THEN completion_time 
            ELSE completed_at 
        END
    WHERE id = transaction_id;
    
    -- If transaction succeeded and it's for a boost, activate the boost
    IF new_status = 'succeeded' THEN
        UPDATE boosts 
        SET is_active = true 
        WHERE transaction_id = update_transaction_status.transaction_id;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_payment_methods_updated_at ON payment_methods;
CREATE TRIGGER update_payment_methods_updated_at
    BEFORE UPDATE ON payment_methods
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_transactions_updated_at ON transactions;
CREATE TRIGGER update_transactions_updated_at
    BEFORE UPDATE ON transactions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_boosts_updated_at ON boosts;
CREATE TRIGGER update_boosts_updated_at
    BEFORE UPDATE ON boosts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_subscriptions_updated_at ON subscriptions;
CREATE TRIGGER update_subscriptions_updated_at
    BEFORE UPDATE ON subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();