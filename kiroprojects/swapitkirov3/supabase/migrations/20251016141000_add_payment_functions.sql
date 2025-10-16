-- Payment Statistics Function
CREATE OR REPLACE FUNCTION get_payment_stats(days INTEGER DEFAULT 30)
RETURNS TABLE (
    total_revenue BIGINT,
    total_transactions BIGINT,
    successful_payments BIGINT,
    failed_payments BIGINT,
    active_boosts BIGINT,
    average_transaction_value NUMERIC
) AS $$
DECLARE
    date_filter TIMESTAMP WITH TIME ZONE;
BEGIN
    -- Set date filter
    IF days IS NULL THEN
        date_filter := '1900-01-01'::TIMESTAMP WITH TIME ZONE;
    ELSE
        date_filter := NOW() - (days || ' days')::INTERVAL;
    END IF;

    RETURN QUERY
    SELECT 
        COALESCE(SUM(CASE WHEN t.status = 'succeeded' THEN t.amount ELSE 0 END), 0) as total_revenue,
        COUNT(*)::BIGINT as total_transactions,
        COUNT(CASE WHEN t.status = 'succeeded' THEN 1 END)::BIGINT as successful_payments,
        COUNT(CASE WHEN t.status = 'failed' THEN 1 END)::BIGINT as failed_payments,
        (SELECT COUNT(*)::BIGINT FROM boosts WHERE is_active = true AND expires_at > NOW()) as active_boosts,
        COALESCE(AVG(CASE WHEN t.status = 'succeeded' THEN t.amount END), 0) as average_transaction_value
    FROM transactions t
    WHERE t.created_at >= date_filter;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;