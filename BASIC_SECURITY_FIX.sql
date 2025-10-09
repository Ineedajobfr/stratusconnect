-- ================================================================
-- 🔒 BASIC SECURITY FIX - MINIMAL RLS ENABLEMENT
-- ================================================================
-- This version only enables RLS on tables that exist
-- No policies, no indexes, no complex operations
-- ================================================================

-- 1. ENABLE RLS ON EXISTING TABLES
-- ================================================================
ALTER TABLE IF EXISTS public.quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.hourly_rate_baseline ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.airports ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.operators ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.profiles ENABLE ROW LEVEL SECURITY;

-- 2. CREATE EXTENSIONS SCHEMA
-- ================================================================
CREATE SCHEMA IF NOT EXISTS extensions;

-- 3. FIX API.USERS VIEW
-- ================================================================
DROP VIEW IF EXISTS api.users CASCADE;

CREATE SCHEMA IF NOT EXISTS api;

CREATE OR REPLACE VIEW api.users
WITH (security_invoker = true)
AS SELECT id, email, created_at, updated_at, last_sign_in_at
FROM auth.users
WHERE id = auth.uid();

GRANT SELECT ON api.users TO authenticated;

-- 4. GRANT PERMISSIONS
-- ================================================================
GRANT USAGE ON SCHEMA extensions TO authenticated, anon;

-- 5. SHOW WHAT TABLES EXIST
-- ================================================================
SELECT 'Tables in public schema:' as info;
SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename NOT LIKE 'pg_%' ORDER BY tablename;

-- 6. SHOW RLS STATUS
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
