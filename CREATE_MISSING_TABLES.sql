-- CREATE MISSING TABLES FOR TERMINALS
-- Create tables that are referenced but don't exist

-- ============================================================================
-- CREATE MISSING TABLES
-- ============================================================================

-- Create transactions table (if it doesn't exist)
CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    transaction_type VARCHAR(50) NOT NULL, -- 'payment', 'refund', 'commission', etc.
    status VARCHAR(20) DEFAULT 'pending',
    description TEXT,
    reference_id VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_login_history table (if it doesn't exist)
CREATE TABLE IF NOT EXISTS public.user_login_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    login_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ip_address INET,
    user_agent TEXT,
    login_method VARCHAR(50), -- 'email', 'google', 'microsoft', etc.
    success BOOLEAN DEFAULT true,
    failure_reason TEXT
);

-- Create admin_audit_log table (if it doesn't exist)
CREATE TABLE IF NOT EXISTS public.admin_audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    action VARCHAR(100) NOT NULL,
    target_type VARCHAR(50), -- 'user', 'transaction', 'system', etc.
    target_id UUID,
    details JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_profiles table (if it doesn't exist) - this might be the profiles table
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name VARCHAR(255),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    role VARCHAR(50) DEFAULT 'broker',
    verification_status VARCHAR(20) DEFAULT 'pending',
    company_name VARCHAR(255),
    phone VARCHAR(20),
    avatar_url TEXT,
    bio TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- CREATE INDEXES FOR PERFORMANCE
-- ============================================================================

-- Indexes for transactions
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON public.transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON public.transactions(created_at);

-- Indexes for user_login_history
CREATE INDEX IF NOT EXISTS idx_user_login_history_user_id ON public.user_login_history(user_id);
CREATE INDEX IF NOT EXISTS idx_user_login_history_login_time ON public.user_login_history(login_time);

-- Indexes for admin_audit_log
CREATE INDEX IF NOT EXISTS idx_admin_audit_log_admin_user_id ON public.admin_audit_log(admin_user_id);
CREATE INDEX IF NOT EXISTS idx_admin_audit_log_created_at ON public.admin_audit_log(created_at);

-- Indexes for user_profiles
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON public.user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON public.user_profiles(role);
CREATE INDEX IF NOT EXISTS idx_user_profiles_verification_status ON public.user_profiles(verification_status);

-- ============================================================================
-- SET UP ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_login_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for transactions
CREATE POLICY "Users can view their own transactions" ON public.transactions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own transactions" ON public.transactions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for user_login_history
CREATE POLICY "Users can view their own login history" ON public.user_login_history
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert login history" ON public.user_login_history
    FOR INSERT WITH CHECK (true);

-- RLS Policies for admin_audit_log
CREATE POLICY "Admins can view audit log" ON public.admin_audit_log
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() 
            AND role = 'admin'
        )
    );

-- RLS Policies for user_profiles
CREATE POLICY "Users can view their own profile" ON public.user_profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON public.user_profiles
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" ON public.user_profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- INSERT SAMPLE DATA (Optional)
-- ============================================================================

-- Insert sample transaction for test users
INSERT INTO public.transactions (user_id, amount, currency, transaction_type, status, description)
SELECT 
    u.id,
    1000.00,
    'USD',
    'payment',
    'completed',
    'Sample transaction for testing'
FROM public.users u 
WHERE u.email IN ('broker@test.com', 'operator@test.com', 'pilot@test.com', 'crew@test.com')
ON CONFLICT DO NOTHING;

-- Insert sample login history
INSERT INTO public.user_login_history (user_id, login_time, ip_address, login_method, success)
SELECT 
    u.id,
    NOW() - INTERVAL '1 hour',
    '127.0.0.1'::inet,
    'email',
    true
FROM public.users u 
WHERE u.email IN ('broker@test.com', 'operator@test.com', 'pilot@test.com', 'crew@test.com')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- VERIFY CREATION
-- ============================================================================

SELECT 
    'Tables Created Successfully' as status,
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
    AND table_name IN ('transactions', 'user_login_history', 'admin_audit_log', 'user_profiles')
ORDER BY table_name;

-- ============================================================================
-- SUCCESS MESSAGE
-- ============================================================================

DO $$
BEGIN
    RAISE NOTICE '✅ MISSING TABLES CREATED!';
    RAISE NOTICE '📊 Created: transactions, user_login_history, admin_audit_log, user_profiles';
    RAISE NOTICE '🔒 RLS policies enabled for security';
    RAISE NOTICE '📈 Indexes created for performance';
    RAISE NOTICE '🎯 Terminals should now work without 404 errors!';
END $$;
