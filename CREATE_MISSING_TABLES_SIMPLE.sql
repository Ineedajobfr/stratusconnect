-- CREATE MISSING TABLES - SIMPLE VERSION
-- Creates only the essential tables that are causing 404 errors

-- ============================================================================
-- CREATE ESSENTIAL MISSING TABLES
-- ============================================================================

-- Create transactions table (if it doesn't exist)
CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    currency VARCHAR(3) DEFAULT 'USD',
    transaction_type VARCHAR(50) NOT NULL DEFAULT 'payment',
    status VARCHAR(20) DEFAULT 'pending',
    description TEXT DEFAULT 'Sample transaction',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_login_history table (if it doesn't exist)
CREATE TABLE IF NOT EXISTS public.user_login_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    login_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ip_address VARCHAR(45) DEFAULT '127.0.0.1',
    login_method VARCHAR(50) DEFAULT 'email',
    success BOOLEAN DEFAULT true
);

-- Create admin_audit_log table (if it doesn't exist)
CREATE TABLE IF NOT EXISTS public.admin_audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_user_id UUID,
    action VARCHAR(100) NOT NULL DEFAULT 'system_action',
    target_type VARCHAR(50) DEFAULT 'user',
    target_id UUID,
    details TEXT DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- CREATE BASIC INDEXES
-- ============================================================================

-- Indexes for transactions
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON public.transactions(status);

-- Indexes for user_login_history
CREATE INDEX IF NOT EXISTS idx_user_login_history_user_id ON public.user_login_history(user_id);

-- Indexes for admin_audit_log
CREATE INDEX IF NOT EXISTS idx_admin_audit_log_admin_user_id ON public.admin_audit_log(admin_user_id);

-- ============================================================================
-- INSERT SAMPLE DATA
-- ============================================================================

-- Insert sample transaction
INSERT INTO public.transactions (user_id, amount, description)
SELECT 
    gen_random_uuid(),
    1000.00,
    'Sample transaction for testing'
WHERE NOT EXISTS (SELECT 1 FROM public.transactions LIMIT 1);

-- Insert sample login history
INSERT INTO public.user_login_history (user_id, login_time, login_method)
SELECT 
    gen_random_uuid(),
    NOW() - INTERVAL '1 hour',
    'email'
WHERE NOT EXISTS (SELECT 1 FROM public.user_login_history LIMIT 1);

-- Insert sample audit log
INSERT INTO public.admin_audit_log (admin_user_id, action, target_type)
SELECT 
    gen_random_uuid(),
    'system_check',
    'user'
WHERE NOT EXISTS (SELECT 1 FROM public.admin_audit_log LIMIT 1);

-- ============================================================================
-- VERIFY CREATION
-- ============================================================================

SELECT 
    'Tables Created Successfully' as status,
    table_name
FROM information_schema.tables 
WHERE table_schema = 'public' 
    AND table_name IN ('transactions', 'user_login_history', 'admin_audit_log')
ORDER BY table_name;

-- ============================================================================
-- SUCCESS MESSAGE
-- ============================================================================

DO $$
BEGIN
    RAISE NOTICE '✅ ESSENTIAL TABLES CREATED!';
    RAISE NOTICE '📊 Created: transactions, user_login_history, admin_audit_log';
    RAISE NOTICE '🎯 Terminals should now work without 404 errors!';
END $$;
