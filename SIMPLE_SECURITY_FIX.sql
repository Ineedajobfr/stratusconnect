-- ================================================================
-- 🔒 SIMPLE SECURITY FIX - NO COMPLEX STATEMENTS
-- ================================================================
-- This version only does basic RLS enablement without complex logic
-- ================================================================

-- 1. ENABLE RLS ON EXISTING TABLES
-- ================================================================
ALTER TABLE IF EXISTS public.quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.hourly_rate_baseline ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.airports ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.operators ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.profiles ENABLE ROW LEVEL SECURITY;

-- 2. CREATE BASIC RLS POLICIES
-- ================================================================

-- Quotes - allow all for now (we'll refine later)
DROP POLICY IF EXISTS "Allow all quotes access" ON public.quotes;
CREATE POLICY "Allow all quotes access" ON public.quotes FOR ALL USING (true);

-- Signals - allow all for now
DROP POLICY IF EXISTS "Allow all signals access" ON public.signals;
CREATE POLICY "Allow all signals access" ON public.signals FOR ALL USING (true);

-- Hourly rate baseline - public read
DROP POLICY IF EXISTS "Public hourly rate access" ON public.hourly_rate_baseline;
CREATE POLICY "Public hourly rate access" ON public.hourly_rate_baseline FOR SELECT USING (true);

-- Airports - public read
DROP POLICY IF EXISTS "Public airports access" ON public.airports;
CREATE POLICY "Public airports access" ON public.airports FOR SELECT USING (true);

-- Operators - public read
DROP POLICY IF EXISTS "Public operators access" ON public.operators;
CREATE POLICY "Public operators access" ON public.operators FOR SELECT USING (true);

-- Profiles - users can see their own
DROP POLICY IF EXISTS "Users can see own profile" ON public.profiles;
CREATE POLICY "Users can see own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);

-- 3. CREATE EXTENSIONS SCHEMA
-- ================================================================
CREATE SCHEMA IF NOT EXISTS extensions;

-- 4. FIX API.USERS VIEW
-- ================================================================
DROP VIEW IF EXISTS api.users CASCADE;

CREATE SCHEMA IF NOT EXISTS api;

CREATE OR REPLACE VIEW api.users
WITH (security_invoker = true)
AS SELECT id, email, created_at, updated_at, last_sign_in_at
FROM auth.users
WHERE id = auth.uid();

GRANT SELECT ON api.users TO authenticated;

-- 5. ADD BASIC INDEXES
-- ================================================================
CREATE INDEX IF NOT EXISTS idx_quotes_id ON public.quotes(id);
CREATE INDEX IF NOT EXISTS idx_signals_id ON public.signals(id);
CREATE INDEX IF NOT EXISTS idx_operators_id ON public.operators(id);
CREATE INDEX IF NOT EXISTS idx_profiles_id ON public.profiles(id);

-- 6. GRANT PERMISSIONS
-- ================================================================
GRANT USAGE ON SCHEMA extensions TO authenticated, anon;

-- 7. SHOW WHAT TABLES EXIST
-- ================================================================
SELECT 'Tables in public schema:' as info;
SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename NOT LIKE 'pg_%' ORDER BY tablename;

-- 8. SHOW RLS STATUS
-- ================================================================
SELECT 'RLS Status:' as info;
SELECT 
  tablename,
  CASE WHEN relrowsecurity THEN 'ENABLED' ELSE 'DISABLED' END as rls_status
FROM pg_tables t
LEFT JOIN pg_class c ON c.relname = t.tablename AND c.relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
WHERE t.schemaname = 'public' 
AND t.tablename NOT LIKE 'pg_%'
ORDER BY t.tablename;
