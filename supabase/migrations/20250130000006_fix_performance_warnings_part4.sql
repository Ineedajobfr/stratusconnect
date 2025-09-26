-- Fix Performance Warnings - Part 4
-- RLS Performance Optimization and Function Fixes

-- 1. Fix RLS Performance Issues
-- Replace all auth.uid() calls with (select auth.uid()) for better performance
-- This prevents re-evaluation for each row

-- Update profiles table RLS policies
DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;

CREATE POLICY "profiles_select_own" ON public.profiles
  FOR SELECT USING ((select auth.uid()) = user_id);

CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE USING ((select auth.uid()) = user_id);

CREATE POLICY "profiles_insert_own" ON public.profiles
  FOR INSERT WITH CHECK ((select auth.uid()) = user_id);

-- Update companies table RLS policies
DROP POLICY IF EXISTS "companies_select_own" ON public.companies;
DROP POLICY IF EXISTS "companies_update_own" ON public.companies;
DROP POLICY IF EXISTS "companies_insert_own" ON public.companies;

CREATE POLICY "companies_select_own" ON public.companies
  FOR SELECT USING (
    (select auth.uid()) IN (
      SELECT user_id FROM public.profiles 
      WHERE company_id = companies.id
    ) OR
    is_admin()
  );

CREATE POLICY "companies_update_own" ON public.companies
  FOR UPDATE USING (
    (select auth.uid()) IN (
      SELECT user_id FROM public.profiles 
      WHERE company_id = companies.id AND platform_role IN ('admin', 'operator')
    ) OR
    is_admin()
  );

CREATE POLICY "companies_insert_own" ON public.companies
  FOR INSERT WITH CHECK (
    (select auth.uid()) IN (
      SELECT user_id FROM public.profiles 
      WHERE platform_role IN ('admin', 'operator')
    ) OR
    is_admin()
  );

-- Update users table RLS policies
DROP POLICY IF EXISTS "users_select_company" ON public.users;
DROP POLICY IF EXISTS "users_update_own" ON public.users;
DROP POLICY IF EXISTS "users_insert_admin" ON public.users;

CREATE POLICY "users_select_company" ON public.users
  FOR SELECT USING (
    company_id = get_user_company_id() OR is_admin()
  );

CREATE POLICY "users_update_own" ON public.users
  FOR UPDATE USING (
    id = (select auth.uid()) OR is_admin()
  );

CREATE POLICY "users_insert_admin" ON public.users
  FOR INSERT WITH CHECK (is_admin());

-- Update requests table RLS policies
DROP POLICY IF EXISTS "requests_select_broker" ON public.requests;
DROP POLICY IF EXISTS "requests_insert_broker" ON public.requests;
DROP POLICY IF EXISTS "requests_update_broker" ON public.requests;

CREATE POLICY "requests_select_broker" ON public.requests
  FOR SELECT USING (
    broker_company_id = get_user_company_id() OR is_admin()
  );

CREATE POLICY "requests_insert_broker" ON public.requests
  FOR INSERT WITH CHECK (
    broker_company_id = get_user_company_id() OR is_admin()
  );

CREATE POLICY "requests_update_broker" ON public.requests
  FOR UPDATE USING (
    broker_company_id = get_user_company_id() OR is_admin()
  );

-- Update quotes table RLS policies
DROP POLICY IF EXISTS "quotes_select_operator" ON public.quotes;
DROP POLICY IF EXISTS "quotes_insert_operator" ON public.quotes;
DROP POLICY IF EXISTS "quotes_update_operator" ON public.quotes;

CREATE POLICY "quotes_select_operator" ON public.quotes
  FOR SELECT USING (
    operator_company_id = get_user_company_id() OR is_admin()
  );

CREATE POLICY "quotes_insert_operator" ON public.quotes
  FOR INSERT WITH CHECK (
    operator_company_id = get_user_company_id() OR is_admin()
  );

CREATE POLICY "quotes_update_operator" ON public.quotes
  FOR UPDATE USING (
    operator_company_id = get_user_company_id() OR is_admin()
  );

-- Update bookings table RLS policies
DROP POLICY IF EXISTS "bookings_select_parties" ON public.bookings;
DROP POLICY IF EXISTS "bookings_insert_admin" ON public.bookings;
DROP POLICY IF EXISTS "bookings_update_parties" ON public.bookings;

CREATE POLICY "bookings_select_parties" ON public.bookings
  FOR SELECT USING (
    broker_company_id = get_user_company_id() OR 
    operator_company_id = get_user_company_id() OR 
    is_admin()
  );

CREATE POLICY "bookings_insert_admin" ON public.bookings
  FOR INSERT WITH CHECK (is_admin());

CREATE POLICY "bookings_update_parties" ON public.bookings
  FOR UPDATE USING (
    broker_company_id = get_user_company_id() OR 
    operator_company_id = get_user_company_id() OR 
    is_admin()
  );

-- 2. Fix Helper Functions for Better Performance
CREATE OR REPLACE FUNCTION get_user_company_id()
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
BEGIN
    RETURN (
        SELECT company_id 
        FROM users 
        WHERE id = (select auth.uid())
    );
END;
$$;

CREATE OR REPLACE FUNCTION get_user_role()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
BEGIN
    RETURN (
        SELECT role 
        FROM users 
        WHERE id = (select auth.uid())
    );
END;
$$;

CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
BEGIN
    RETURN get_user_role() = 'admin';
END;
$$;

-- 3. Create Statistics for Better Query Planning
ANALYZE public.companies;
ANALYZE public.users;
ANALYZE public.requests;
ANALYZE public.quotes;
ANALYZE public.bookings;
ANALYZE public.job_posts;
ANALYZE public.job_applications;
ANALYZE public.contracts;
ANALYZE public.receipts;
ANALYZE public.document_storage;
ANALYZE public.community_forums;
ANALYZE public.forum_posts;
ANALYZE public.saved_crews;
ANALYZE public.user_monitoring;
ANALYZE public.security_audit_log;
ANALYZE public.contract_audit_trail;
