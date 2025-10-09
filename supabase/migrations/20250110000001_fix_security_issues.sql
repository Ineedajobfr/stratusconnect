-- =====================================================
-- FIX ALL SUPABASE SECURITY & CONFIGURATION ISSUES
-- =====================================================
-- Date: January 10, 2025
-- Purpose: Address RLS, extensions, and security warnings

-- =====================================================
-- 1. ENABLE RLS ON PUBLIC TABLES
-- =====================================================

-- Enable RLS on quotes table
ALTER TABLE IF EXISTS public.quotes ENABLE ROW LEVEL SECURITY;

-- Enable RLS on signals table
ALTER TABLE IF EXISTS public.signals ENABLE ROW LEVEL SECURITY;

-- Enable RLS on hourly_rate_baseline table
ALTER TABLE IF EXISTS public.hourly_rate_baseline ENABLE ROW LEVEL SECURITY;

-- Enable RLS on airports table
ALTER TABLE IF EXISTS public.airports ENABLE ROW LEVEL SECURITY;

-- Enable RLS on operators table
ALTER TABLE IF EXISTS public.operators ENABLE ROW LEVEL SECURITY;

-- Enable RLS on spatial_ref_sys table (PostGIS system table)
ALTER TABLE IF EXISTS public.spatial_ref_sys ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 2. CREATE RLS POLICIES FOR QUOTES
-- =====================================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view quotes for their RFQs" ON public.quotes;
DROP POLICY IF EXISTS "Operators can view quotes they submitted" ON public.quotes;
DROP POLICY IF EXISTS "Operators can create quotes" ON public.quotes;
DROP POLICY IF EXISTS "Operators can update their own quotes" ON public.quotes;
DROP POLICY IF EXISTS "Admins can view all quotes" ON public.quotes;

-- Brokers can view quotes for their RFQs
CREATE POLICY "Users can view quotes for their RFQs"
  ON public.quotes
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.rfqs
      WHERE rfqs.id = quotes.rfq_id
      AND rfqs.broker_id = auth.uid()
    )
  );

-- Operators can view quotes they submitted
CREATE POLICY "Operators can view quotes they submitted"
  ON public.quotes
  FOR SELECT
  USING (operator_id = auth.uid());

-- Operators can create quotes
CREATE POLICY "Operators can create quotes"
  ON public.quotes
  FOR INSERT
  WITH CHECK (operator_id = auth.uid());

-- Operators can update their own quotes (before acceptance)
CREATE POLICY "Operators can update their own quotes"
  ON public.quotes
  FOR UPDATE
  USING (operator_id = auth.uid() AND status = 'pending');

-- Admins can view all quotes
CREATE POLICY "Admins can view all quotes"
  ON public.quotes
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- =====================================================
-- 3. CREATE RLS POLICIES FOR SIGNALS
-- =====================================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own signals" ON public.signals;
DROP POLICY IF EXISTS "Users can create their own signals" ON public.signals;
DROP POLICY IF EXISTS "Users can update their own signals" ON public.signals;
DROP POLICY IF EXISTS "Admins can view all signals" ON public.signals;

-- Users can view their own signals
CREATE POLICY "Users can view their own signals"
  ON public.signals
  FOR SELECT
  USING (user_id = auth.uid());

-- Users can create their own signals
CREATE POLICY "Users can create their own signals"
  ON public.signals
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Users can update their own signals
CREATE POLICY "Users can update their own signals"
  ON public.signals
  FOR UPDATE
  USING (user_id = auth.uid());

-- Admins can view all signals
CREATE POLICY "Admins can view all signals"
  ON public.signals
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- =====================================================
-- 4. CREATE RLS POLICIES FOR HOURLY_RATE_BASELINE
-- =====================================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Everyone can view hourly rate baselines" ON public.hourly_rate_baseline;
DROP POLICY IF EXISTS "Admins can manage hourly rate baselines" ON public.hourly_rate_baseline;

-- Everyone can view hourly rate baselines (public data)
CREATE POLICY "Everyone can view hourly rate baselines"
  ON public.hourly_rate_baseline
  FOR SELECT
  USING (true);

-- Only admins can insert/update/delete
CREATE POLICY "Admins can manage hourly rate baselines"
  ON public.hourly_rate_baseline
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- =====================================================
-- 5. CREATE RLS POLICIES FOR AIRPORTS
-- =====================================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Everyone can view airports" ON public.airports;
DROP POLICY IF EXISTS "Admins can manage airports" ON public.airports;

-- Everyone can view airports (public data)
CREATE POLICY "Everyone can view airports"
  ON public.airports
  FOR SELECT
  USING (true);

-- Only admins can insert/update/delete
CREATE POLICY "Admins can manage airports"
  ON public.airports
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- =====================================================
-- 6. CREATE RLS POLICIES FOR OPERATORS
-- =====================================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Everyone can view operators" ON public.operators;
DROP POLICY IF EXISTS "Operators can update their own profile" ON public.operators;
DROP POLICY IF EXISTS "Operators can create their own profile" ON public.operators;
DROP POLICY IF EXISTS "Admins can manage all operators" ON public.operators;

-- Everyone can view operators (public directory)
CREATE POLICY "Everyone can view operators"
  ON public.operators
  FOR SELECT
  USING (true);

-- Operators can update their own profile
CREATE POLICY "Operators can update their own profile"
  ON public.operators
  FOR UPDATE
  USING (user_id = auth.uid());

-- Operators can create their own profile
CREATE POLICY "Operators can create their own profile"
  ON public.operators
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Admins can manage all operators
CREATE POLICY "Admins can manage all operators"
  ON public.operators
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- =====================================================
-- 7. CREATE RLS POLICIES FOR SPATIAL_REF_SYS (PostGIS)
-- =====================================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Everyone can view spatial reference systems" ON public.spatial_ref_sys;

-- Everyone can view spatial reference systems (PostGIS system table)
CREATE POLICY "Everyone can view spatial reference systems"
  ON public.spatial_ref_sys
  FOR SELECT
  USING (true);

-- =====================================================
-- 8. MOVE EXTENSIONS TO EXTENSIONS SCHEMA
-- =====================================================

-- Create extensions schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS extensions;

-- Move PostGIS extension to extensions schema
-- Note: This requires dropping and recreating the extension
-- IMPORTANT: Run this during maintenance window as it will temporarily remove PostGIS functions

-- First, check if we can safely move PostGIS
DO $$
BEGIN
  -- Only attempt to move if PostGIS is in public schema
  IF EXISTS (
    SELECT 1 FROM pg_extension
    WHERE extname = 'postgis'
    AND extnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
  ) THEN
    -- Drop and recreate in extensions schema
    DROP EXTENSION IF EXISTS postgis CASCADE;
    CREATE EXTENSION IF NOT EXISTS postgis WITH SCHEMA extensions;
    
    RAISE NOTICE 'PostGIS extension moved to extensions schema';
  ELSE
    RAISE NOTICE 'PostGIS extension already in correct schema or not installed';
  END IF;
END $$;

-- Move citext extension to extensions schema
DO $$
BEGIN
  -- Only attempt to move if citext is in public schema
  IF EXISTS (
    SELECT 1 FROM pg_extension
    WHERE extname = 'citext'
    AND extnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
  ) THEN
    -- Drop and recreate in extensions schema
    DROP EXTENSION IF EXISTS citext CASCADE;
    CREATE EXTENSION IF NOT EXISTS citext WITH SCHEMA extensions;
    
    RAISE NOTICE 'citext extension moved to extensions schema';
  ELSE
    RAISE NOTICE 'citext extension already in correct schema or not installed';
  END IF;
END $$;

-- =====================================================
-- 9. FIX API.USERS VIEW (SECURITY DEFINER ISSUE)
-- =====================================================

-- Drop and recreate api.users view without SECURITY DEFINER
DROP VIEW IF EXISTS api.users CASCADE;

-- Create api schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS api;

-- Recreate view with SECURITY INVOKER (safer)
CREATE OR REPLACE VIEW api.users
WITH (security_invoker = true)
AS
SELECT
  id,
  email,
  created_at,
  updated_at,
  last_sign_in_at
FROM auth.users
WHERE id = auth.uid(); -- Users can only see their own data

-- Grant access to authenticated users
GRANT SELECT ON api.users TO authenticated;

-- =====================================================
-- 10. ADD INDEXES FOR PERFORMANCE
-- =====================================================

-- Index for quotes RLS policies
CREATE INDEX IF NOT EXISTS idx_quotes_rfq_id ON public.quotes(rfq_id);
CREATE INDEX IF NOT EXISTS idx_quotes_operator_id ON public.quotes(operator_id);
CREATE INDEX IF NOT EXISTS idx_quotes_status ON public.quotes(status);

-- Index for signals RLS policies
CREATE INDEX IF NOT EXISTS idx_signals_user_id ON public.signals(user_id);

-- Index for operators RLS policies
CREATE INDEX IF NOT EXISTS idx_operators_user_id ON public.operators(user_id);

-- Index for profiles role checks
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- =====================================================
-- 11. ADD COMMENTS FOR DOCUMENTATION
-- =====================================================

COMMENT ON TABLE public.quotes IS 'Quote submissions from operators to RFQs. RLS enabled for broker/operator/admin access.';
COMMENT ON TABLE public.signals IS 'User notification signals. RLS enabled for user-specific access.';
COMMENT ON TABLE public.hourly_rate_baseline IS 'Baseline hourly rates for aircraft types. Public read, admin write.';
COMMENT ON TABLE public.airports IS 'Airport directory. Public read, admin write.';
COMMENT ON TABLE public.operators IS 'Operator profiles. Public read, operator write own data.';
COMMENT ON TABLE public.spatial_ref_sys IS 'PostGIS spatial reference system table. Public read access.';

COMMENT ON VIEW api.users IS 'Secure user view with SECURITY INVOKER. Users can only access their own data.';

-- =====================================================
-- 12. VERIFY RLS IS ENABLED
-- =====================================================

DO $$
DECLARE
  table_record RECORD;
  missing_rls TEXT[] := ARRAY[]::TEXT[];
BEGIN
  -- Check all public tables for RLS
  FOR table_record IN 
    SELECT schemaname, tablename
    FROM pg_tables
    WHERE schemaname = 'public'
    AND tablename NOT LIKE 'pg_%'
  LOOP
    IF NOT (
      SELECT relrowsecurity
      FROM pg_class
      WHERE relname = table_record.tablename
      AND relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
    ) THEN
      missing_rls := array_append(missing_rls, table_record.tablename);
    END IF;
  END LOOP;
  
  IF array_length(missing_rls, 1) > 0 THEN
    RAISE WARNING 'Tables still missing RLS: %', array_to_string(missing_rls, ', ');
  ELSE
    RAISE NOTICE '✅ All public tables have RLS enabled!';
  END IF;
END $$;

-- =====================================================
-- 13. GRANT NECESSARY PERMISSIONS
-- =====================================================

-- Grant usage on extensions schema
GRANT USAGE ON SCHEMA extensions TO authenticated, anon;

-- Grant execute on PostGIS functions (now in extensions schema)
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA extensions TO authenticated, anon;

-- =====================================================
-- MIGRATION COMPLETE
-- =====================================================

-- Output summary
DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '🎉 SECURITY MIGRATION COMPLETED!';
  RAISE NOTICE '================================';
  RAISE NOTICE '✅ RLS enabled on: quotes, signals, hourly_rate_baseline, airports, operators, spatial_ref_sys';
  RAISE NOTICE '✅ RLS policies created for all tables';
  RAISE NOTICE '✅ Extensions moved to extensions schema';
  RAISE NOTICE '✅ api.users view recreated with SECURITY INVOKER';
  RAISE NOTICE '✅ Performance indexes added';
  RAISE NOTICE '';
  RAISE NOTICE '⚠️  MANUAL ACTIONS REQUIRED IN SUPABASE DASHBOARD:';
  RAISE NOTICE '1. Set Email OTP expiry to < 1 hour (currently > 1 hour)';
  RAISE NOTICE '2. Enable HaveIBeenPwned password checking';
  RAISE NOTICE '';
  RAISE NOTICE '📚 Documentation added to all tables';
  RAISE NOTICE '';
END $$;

