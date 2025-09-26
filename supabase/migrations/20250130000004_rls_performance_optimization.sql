-- RLS Performance Optimization Migration
-- Optimizes all RLS policies for better performance

-- 1. OPTIMIZE EXISTING RLS POLICIES
-- Replace all auth.uid() calls with (select auth.uid()) for better performance

-- Update companies RLS policies
DROP POLICY IF EXISTS "companies_select_own" ON public.companies;
DROP POLICY IF EXISTS "companies_update_own" ON public.companies;
DROP POLICY IF EXISTS "companies_insert_own" ON public.companies;

CREATE POLICY "companies_select_own" ON public.companies
    FOR SELECT USING (
        id = (SELECT company_id FROM public.profiles WHERE user_id = (select auth.uid()))
        OR
        EXISTS (SELECT 1 FROM public.profiles WHERE user_id = (select auth.uid()) AND platform_role = 'admin')
    );

CREATE POLICY "companies_update_own" ON public.companies
    FOR UPDATE USING (
        id = (SELECT company_id FROM public.profiles WHERE user_id = (select auth.uid()))
        OR
        EXISTS (SELECT 1 FROM public.profiles WHERE user_id = (select auth.uid()) AND platform_role = 'admin')
    );

CREATE POLICY "companies_insert_own" ON public.companies
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM public.profiles WHERE user_id = (select auth.uid()) AND platform_role IN ('admin', 'operator'))
    );

-- Update profiles RLS policies
DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;

CREATE POLICY "profiles_select_own" ON public.profiles
    FOR SELECT USING (
        user_id = (select auth.uid())
        OR
        EXISTS (SELECT 1 FROM public.profiles p WHERE p.user_id = (select auth.uid()) AND p.platform_role = 'admin')
        OR
        company_id = (SELECT company_id FROM public.profiles WHERE user_id = (select auth.uid()))
    );

CREATE POLICY "profiles_update_own" ON public.profiles
    FOR UPDATE USING (
        user_id = (select auth.uid())
        OR
        EXISTS (SELECT 1 FROM public.profiles p WHERE p.user_id = (select auth.uid()) AND p.platform_role = 'admin')
    );

CREATE POLICY "profiles_insert_own" ON public.profiles
    FOR INSERT WITH CHECK (user_id = (select auth.uid()));

-- Update requests RLS policies
DROP POLICY IF EXISTS "requests_select_broker" ON public.requests;
DROP POLICY IF EXISTS "requests_insert_broker" ON public.requests;
DROP POLICY IF EXISTS "requests_update_broker" ON public.requests;

CREATE POLICY "requests_select_broker" ON public.requests
    FOR SELECT USING (
        broker_company_id = (SELECT company_id FROM public.profiles WHERE user_id = (select auth.uid()))
        OR
        EXISTS (SELECT 1 FROM public.profiles WHERE user_id = (select auth.uid()) AND platform_role = 'admin')
    );

CREATE POLICY "requests_insert_broker" ON public.requests
    FOR INSERT WITH CHECK (
        broker_company_id = (SELECT company_id FROM public.profiles WHERE user_id = (select auth.uid()))
        AND created_by = (select auth.uid())
    );

CREATE POLICY "requests_update_broker" ON public.requests
    FOR UPDATE USING (
        broker_company_id = (SELECT company_id FROM public.profiles WHERE user_id = (select auth.uid()))
        OR
        EXISTS (SELECT 1 FROM public.profiles WHERE user_id = (select auth.uid()) AND platform_role = 'admin')
    );

-- Update quotes RLS policies
DROP POLICY IF EXISTS "quotes_select_operator" ON public.quotes;
DROP POLICY IF EXISTS "quotes_insert_operator" ON public.quotes;
DROP POLICY IF EXISTS "quotes_update_operator" ON public.quotes;

CREATE POLICY "quotes_select_operator" ON public.quotes
    FOR SELECT USING (
        operator_company_id = (SELECT company_id FROM public.profiles WHERE user_id = (select auth.uid()))
        OR
        EXISTS (SELECT 1 FROM public.profiles WHERE user_id = (select auth.uid()) AND platform_role = 'admin')
        OR
        EXISTS (
            SELECT 1 FROM public.requests r
            WHERE r.id = quotes.request_id
            AND r.broker_company_id = (SELECT company_id FROM public.profiles WHERE user_id = (select auth.uid()))
        )
    );

CREATE POLICY "quotes_insert_operator" ON public.quotes
    FOR INSERT WITH CHECK (
        operator_company_id = (SELECT company_id FROM public.profiles WHERE user_id = (select auth.uid()))
        AND created_by = (select auth.uid())
    );

CREATE POLICY "quotes_update_operator" ON public.quotes
    FOR UPDATE USING (
        operator_company_id = (SELECT company_id FROM public.profiles WHERE user_id = (select auth.uid()))
        OR
        EXISTS (SELECT 1 FROM public.profiles WHERE user_id = (select auth.uid()) AND platform_role = 'admin')
    );

-- Update bookings RLS policies
DROP POLICY IF EXISTS "bookings_select_parties" ON public.bookings;
DROP POLICY IF EXISTS "bookings_insert_broker" ON public.bookings;
DROP POLICY IF EXISTS "bookings_update_parties" ON public.bookings;

CREATE POLICY "bookings_select_parties" ON public.bookings
    FOR SELECT USING (
        broker_company_id = (SELECT company_id FROM public.profiles WHERE user_id = (select auth.uid()))
        OR
        operator_company_id = (SELECT company_id FROM public.profiles WHERE user_id = (select auth.uid()))
        OR
        EXISTS (SELECT 1 FROM public.profiles WHERE user_id = (select auth.uid()) AND platform_role = 'admin')
    );

CREATE POLICY "bookings_insert_broker" ON public.bookings
    FOR INSERT WITH CHECK (
        broker_company_id = (SELECT company_id FROM public.profiles WHERE user_id = (select auth.uid()))
    );

CREATE POLICY "bookings_update_parties" ON public.bookings
    FOR UPDATE USING (
        broker_company_id = (SELECT company_id FROM public.profiles WHERE user_id = (select auth.uid()))
        OR
        operator_company_id = (SELECT company_id FROM public.profiles WHERE user_id = (select auth.uid()))
        OR
        EXISTS (SELECT 1 FROM public.profiles WHERE user_id = (select auth.uid()) AND platform_role = 'admin')
    );

-- 2. CREATE OPTIMIZED HELPER FUNCTIONS
-- These functions are optimized for better performance

CREATE OR REPLACE FUNCTION public.get_user_company_id_optimized()
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
BEGIN
    RETURN (
        SELECT company_id 
        FROM public.profiles 
        WHERE user_id = (select auth.uid())
        LIMIT 1
    );
END;
$$;

CREATE OR REPLACE FUNCTION public.get_user_role_optimized()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
BEGIN
    RETURN (
        SELECT platform_role 
        FROM public.profiles 
        WHERE user_id = (select auth.uid())
        LIMIT 1
    );
END;
$$;

CREATE OR REPLACE FUNCTION public.is_admin_optimized()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
BEGIN
    RETURN (
        SELECT platform_role = 'admin'
        FROM public.profiles 
        WHERE user_id = (select auth.uid())
        LIMIT 1
    );
END;
$$;

-- 3. CREATE INDEXES FOR RLS OPTIMIZATION
-- These indexes help with RLS policy performance

CREATE INDEX IF NOT EXISTS idx_profiles_user_id_company_id ON public.profiles(user_id, company_id);
CREATE INDEX IF NOT EXISTS idx_profiles_user_id_platform_role ON public.profiles(user_id, platform_role);
CREATE INDEX IF NOT EXISTS idx_profiles_company_id ON public.profiles(company_id);

-- 4. CREATE MATERIALIZED VIEW FOR USER PERMISSIONS
CREATE MATERIALIZED VIEW IF NOT EXISTS public.user_permissions AS
SELECT 
    p.user_id,
    p.company_id,
    p.platform_role,
    c.type as company_type,
    c.approved as company_approved
FROM public.profiles p
LEFT JOIN public.companies c ON p.company_id = c.id;

CREATE UNIQUE INDEX IF NOT EXISTS idx_user_permissions_user_id ON public.user_permissions(user_id);

-- 5. CREATE REFRESH FUNCTION FOR USER PERMISSIONS
CREATE OR REPLACE FUNCTION public.refresh_user_permissions()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY public.user_permissions;
END;
$$;

-- 6. CREATE TRIGGER TO AUTO-REFRESH USER PERMISSIONS
CREATE OR REPLACE FUNCTION public.trigger_refresh_user_permissions()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    PERFORM public.refresh_user_permissions();
    RETURN NULL;
END;
$$;

CREATE TRIGGER refresh_user_permissions_trigger
    AFTER INSERT OR UPDATE OR DELETE ON public.profiles
    FOR EACH STATEMENT
    EXECUTE FUNCTION public.trigger_refresh_user_permissions();

CREATE TRIGGER refresh_user_permissions_companies_trigger
    AFTER INSERT OR UPDATE OR DELETE ON public.companies
    FOR EACH STATEMENT
    EXECUTE FUNCTION public.trigger_refresh_user_permissions();

-- 7. GRANT PERMISSIONS
GRANT SELECT ON public.user_permissions TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_company_id_optimized() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_role_optimized() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin_optimized() TO authenticated;
GRANT EXECUTE ON FUNCTION public.refresh_user_permissions() TO authenticated;

-- 8. CREATE MONITORING VIEW FOR RLS PERFORMANCE
CREATE OR REPLACE VIEW public.rls_performance_monitoring AS
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

GRANT SELECT ON public.rls_performance_monitoring TO authenticated;

-- 9. FINAL OPTIMIZATION: UPDATE STATISTICS
ANALYZE public.profiles;
ANALYZE public.companies;
ANALYZE public.requests;
ANALYZE public.quotes;
ANALYZE public.bookings;
