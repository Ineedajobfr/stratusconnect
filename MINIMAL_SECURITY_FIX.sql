-- ================================================================
-- 🔒 MINIMAL SECURITY FIX - ONLY FIX EXISTING TABLES
-- ================================================================
-- This version only enables RLS on tables that actually exist
-- and creates basic policies without referencing missing tables
-- ================================================================

-- 1. ENABLE RLS ON EXISTING TABLES ONLY
-- ================================================================
-- Enable RLS on tables that definitely exist
ALTER TABLE IF EXISTS public.quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.hourly_rate_baseline ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.airports ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.operators ENABLE ROW LEVEL SECURITY;

-- 2. CREATE BASIC RLS POLICIES FOR QUOTES (SAFE VERSION)
-- ================================================================
DROP POLICY IF EXISTS "Users can view quotes for their RFQs" ON public.quotes;
DROP POLICY IF EXISTS "Operators can view quotes they submitted" ON public.quotes;
DROP POLICY IF EXISTS "Operators can create quotes" ON public.quotes;
DROP POLICY IF EXISTS "Operators can update their own quotes" ON public.quotes;
DROP POLICY IF EXISTS "Admins can view all quotes" ON public.quotes;

-- Simple policy: Users can view quotes they created or that reference them
CREATE POLICY "Users can view their own quotes"
  ON public.quotes FOR SELECT
  USING (operator_id = auth.uid());

CREATE POLICY "Operators can create quotes"
  ON public.quotes FOR INSERT
  WITH CHECK (operator_id = auth.uid());

CREATE POLICY "Operators can update their own quotes"
  ON public.quotes FOR UPDATE
  USING (operator_id = auth.uid());

-- 3. CREATE BASIC RLS POLICIES FOR SIGNALS
-- ================================================================
DROP POLICY IF EXISTS "Users can view their own signals" ON public.signals;
DROP POLICY IF EXISTS "Users can create their own signals" ON public.signals;
DROP POLICY IF EXISTS "Users can update their own signals" ON public.signals;

CREATE POLICY "Users can view their own signals"
  ON public.signals FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create their own signals"
  ON public.signals FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own signals"
  ON public.signals FOR UPDATE USING (user_id = auth.uid());

-- 4. CREATE BASIC RLS POLICIES FOR PUBLIC DATA TABLES
-- ================================================================
-- Hourly rate baselines - everyone can read, no one can modify for now
DROP POLICY IF EXISTS "Everyone can view hourly rate baselines" ON public.hourly_rate_baseline;

CREATE POLICY "Everyone can view hourly rate baselines"
  ON public.hourly_rate_baseline FOR SELECT USING (true);

-- Airports - everyone can read, no one can modify for now
DROP POLICY IF EXISTS "Everyone can view airports" ON public.airports;

CREATE POLICY "Everyone can view airports"
  ON public.airports FOR SELECT USING (true);

-- Operators - everyone can read, operators can manage their own
DROP POLICY IF EXISTS "Everyone can view operators" ON public.operators;
DROP POLICY IF EXISTS "Operators can update their own profile" ON public.operators;
DROP POLICY IF EXISTS "Operators can create their own profile" ON public.operators;

CREATE POLICY "Everyone can view operators"
  ON public.operators FOR SELECT USING (true);

CREATE POLICY "Operators can update their own profile"
  ON public.operators FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Operators can create their own profile"
  ON public.operators FOR INSERT WITH CHECK (user_id = auth.uid());

-- 5. CREATE EXTENSIONS SCHEMA (SAFE)
-- ================================================================
CREATE SCHEMA IF NOT EXISTS extensions;

-- 6. FIX API.USERS VIEW (REMOVE SECURITY DEFINER)
-- ================================================================
DROP VIEW IF EXISTS api.users CASCADE;

CREATE SCHEMA IF NOT EXISTS api;

CREATE OR REPLACE VIEW api.users
WITH (security_invoker = true)
AS SELECT id, email, created_at, updated_at, last_sign_in_at
FROM auth.users
WHERE id = auth.uid();

GRANT SELECT ON api.users TO authenticated;

-- 7. ADD BASIC INDEXES (SAFE)
-- ================================================================
CREATE INDEX IF NOT EXISTS idx_quotes_operator_id ON public.quotes(operator_id);
CREATE INDEX IF NOT EXISTS idx_signals_user_id ON public.signals(user_id);
CREATE INDEX IF NOT EXISTS idx_operators_user_id ON public.operators(user_id);

-- 8. GRANT PERMISSIONS
-- ================================================================
GRANT USAGE ON SCHEMA extensions TO authenticated, anon;

-- 9. VERIFY WHAT TABLES ACTUALLY EXIST
-- ================================================================
DO $$ 
DECLARE
  table_list TEXT[] := ARRAY[]::TEXT[];
BEGIN
  SELECT array_agg(tablename ORDER BY tablename)
  INTO table_list
  FROM pg_tables
  WHERE schemaname = 'public'
  AND tablename NOT LIKE 'pg_%';
  
  RAISE NOTICE 'Tables found in public schema: %', array_to_string(table_list, ', ');
END $$;

-- 10. SUCCESS MESSAGE
-- ================================================================
DO $$ BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '🎉 MINIMAL SECURITY FIXES COMPLETED!';
  RAISE NOTICE '====================================';
  RAISE NOTICE '✅ RLS enabled on existing tables';
  RAISE NOTICE '✅ Basic RLS policies created';
  RAISE NOTICE '✅ api.users view fixed (SECURITY INVOKER)';
  RAISE NOTICE '✅ Basic indexes added';
  RAISE NOTICE '✅ Extensions schema created';
  RAISE NOTICE '';
  RAISE NOTICE '⚠️  MANUAL ACTIONS STILL REQUIRED:';
  RAISE NOTICE '1. Dashboard → Authentication → Providers → Email';
  RAISE NOTICE '   Set OTP Expiry to 3600 (or 1800 for 30 min)';
  RAISE NOTICE '2. Dashboard → Authentication → Policies';
  RAISE NOTICE '   Enable "Check against HaveIBeenPwned"';
  RAISE NOTICE '';
  RAISE NOTICE '📝 This fixed the tables that exist. Check the output';
  RAISE NOTICE '   above to see which tables were found.';
  RAISE NOTICE '';
END $$;
