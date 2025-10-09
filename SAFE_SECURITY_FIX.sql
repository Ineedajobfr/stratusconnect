-- ================================================================
-- 🔒 SAFE SECURITY FIX - SKIP PROBLEMATIC TABLES
-- ================================================================
-- This version skips spatial_ref_sys (PostGIS system table)
-- and focuses on YOUR application tables only
-- ================================================================

-- 1. ENABLE RLS ON YOUR APPLICATION TABLES ONLY
-- ================================================================
ALTER TABLE IF EXISTS public.quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.hourly_rate_baseline ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.airports ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.operators ENABLE ROW LEVEL SECURITY;

-- Note: Skipping spatial_ref_sys (PostGIS system table - not owned by you)

-- 2. CREATE RLS POLICIES FOR QUOTES
-- ================================================================
DROP POLICY IF EXISTS "Users can view quotes for their RFQs" ON public.quotes;
DROP POLICY IF EXISTS "Operators can view quotes they submitted" ON public.quotes;
DROP POLICY IF EXISTS "Operators can create quotes" ON public.quotes;
DROP POLICY IF EXISTS "Operators can update their own quotes" ON public.quotes;
DROP POLICY IF EXISTS "Admins can view all quotes" ON public.quotes;

CREATE POLICY "Users can view quotes for their RFQs"
  ON public.quotes FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.rfqs
    WHERE rfqs.id = quotes.rfq_id AND rfqs.broker_id = auth.uid()
  ));

CREATE POLICY "Operators can view quotes they submitted"
  ON public.quotes FOR SELECT
  USING (operator_id = auth.uid());

CREATE POLICY "Operators can create quotes"
  ON public.quotes FOR INSERT
  WITH CHECK (operator_id = auth.uid());

CREATE POLICY "Operators can update their own quotes"
  ON public.quotes FOR UPDATE
  USING (operator_id = auth.uid() AND status = 'pending');

CREATE POLICY "Admins can view all quotes"
  ON public.quotes FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  ));

-- 3. CREATE RLS POLICIES FOR SIGNALS
-- ================================================================
DROP POLICY IF EXISTS "Users can view their own signals" ON public.signals;
DROP POLICY IF EXISTS "Users can create their own signals" ON public.signals;
DROP POLICY IF EXISTS "Users can update their own signals" ON public.signals;
DROP POLICY IF EXISTS "Admins can view all signals" ON public.signals;

CREATE POLICY "Users can view their own signals"
  ON public.signals FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create their own signals"
  ON public.signals FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own signals"
  ON public.signals FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Admins can view all signals"
  ON public.signals FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  ));

-- 4. CREATE RLS POLICIES FOR PUBLIC DATA TABLES
-- ================================================================
DROP POLICY IF EXISTS "Everyone can view hourly rate baselines" ON public.hourly_rate_baseline;
DROP POLICY IF EXISTS "Admins can manage hourly rate baselines" ON public.hourly_rate_baseline;

CREATE POLICY "Everyone can view hourly rate baselines"
  ON public.hourly_rate_baseline FOR SELECT USING (true);

CREATE POLICY "Admins can manage hourly rate baselines"
  ON public.hourly_rate_baseline FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  ));

DROP POLICY IF EXISTS "Everyone can view airports" ON public.airports;
DROP POLICY IF EXISTS "Admins can manage airports" ON public.airports;

CREATE POLICY "Everyone can view airports"
  ON public.airports FOR SELECT USING (true);

CREATE POLICY "Admins can manage airports"
  ON public.airports FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  ));

DROP POLICY IF EXISTS "Everyone can view operators" ON public.operators;
DROP POLICY IF EXISTS "Operators can update their own profile" ON public.operators;
DROP POLICY IF EXISTS "Operators can create their own profile" ON public.operators;
DROP POLICY IF EXISTS "Admins can manage all operators" ON public.operators;

CREATE POLICY "Everyone can view operators"
  ON public.operators FOR SELECT USING (true);

CREATE POLICY "Operators can update their own profile"
  ON public.operators FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Operators can create their own profile"
  ON public.operators FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can manage all operators"
  ON public.operators FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  ));

-- 5. CREATE EXTENSIONS SCHEMA (SAFE)
-- ================================================================
CREATE SCHEMA IF NOT EXISTS extensions;

-- Note: We'll skip moving extensions as they might be system-managed

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

-- 7. ADD PERFORMANCE INDEXES
-- ================================================================
CREATE INDEX IF NOT EXISTS idx_quotes_rfq_id ON public.quotes(rfq_id);
CREATE INDEX IF NOT EXISTS idx_quotes_operator_id ON public.quotes(operator_id);
CREATE INDEX IF NOT EXISTS idx_quotes_status ON public.quotes(status);
CREATE INDEX IF NOT EXISTS idx_signals_user_id ON public.signals(user_id);
CREATE INDEX IF NOT EXISTS idx_operators_user_id ON public.operators(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- 8. GRANT PERMISSIONS
-- ================================================================
GRANT USAGE ON SCHEMA extensions TO authenticated, anon;

-- 9. VERIFY RLS IS ENABLED (ON YOUR TABLES ONLY)
-- ================================================================
DO $$ 
DECLARE
  missing_rls TEXT[] := ARRAY[]::TEXT[];
BEGIN
  SELECT array_agg(tablename)
  INTO missing_rls
  FROM pg_tables
  WHERE schemaname = 'public'
  AND tablename IN ('quotes', 'signals', 'hourly_rate_baseline', 'airports', 'operators')
  AND NOT EXISTS (
    SELECT 1 FROM pg_class c
    WHERE c.relname = pg_tables.tablename
    AND c.relrowsecurity = true
    AND c.relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
  );
  
  IF array_length(missing_rls, 1) > 0 THEN
    RAISE WARNING 'Tables still missing RLS: %', array_to_string(missing_rls, ', ');
  ELSE
    RAISE NOTICE '✅ All YOUR application tables have RLS enabled!';
  END IF;
END $$;

-- 10. SUCCESS MESSAGE
-- ================================================================
DO $$ BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '🎉 SAFE SECURITY FIXES COMPLETED!';
  RAISE NOTICE '====================================';
  RAISE NOTICE '✅ RLS enabled on 5 application tables';
  RAISE NOTICE '✅ RLS policies created';
  RAISE NOTICE '✅ api.users view fixed (SECURITY INVOKER)';
  RAISE NOTICE '✅ Performance indexes added';
  RAISE NOTICE '';
  RAISE NOTICE '⚠️  SKIPPED (System tables):';
  RAISE NOTICE '   - spatial_ref_sys (PostGIS system table)';
  RAISE NOTICE '   - Extension moves (may be system-managed)';
  RAISE NOTICE '';
  RAISE NOTICE '⚠️  MANUAL ACTIONS STILL REQUIRED:';
  RAISE NOTICE '1. Dashboard → Authentication → Providers → Email';
  RAISE NOTICE '   Set OTP Expiry to 3600 (or 1800 for 30 min)';
  RAISE NOTICE '2. Dashboard → Authentication → Policies';
  RAISE NOTICE '   Enable "Check against HaveIBeenPwned"';
  RAISE NOTICE '';
END $$;
