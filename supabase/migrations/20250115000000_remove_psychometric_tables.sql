-- Remove psychometric testing system
-- This migration removes all psychometric testing tables and data

-- Drop tables in reverse dependency order
DROP TABLE IF EXISTS public.psych_responses CASCADE;
DROP TABLE IF EXISTS public.psych_consent CASCADE;
DROP TABLE IF EXISTS public.psych_sessions CASCADE;
DROP TABLE IF EXISTS public.psych_items CASCADE;
DROP TABLE IF EXISTS public.psych_modules CASCADE;
DROP TABLE IF EXISTS public.psych_tests CASCADE;

-- Remove any psychometric-related policies
DROP POLICY IF EXISTS "consent self insert" ON public.psych_consent;
DROP POLICY IF EXISTS "consent self update" ON public.psych_consent;
DROP POLICY IF EXISTS "consent self read" ON public.psych_consent;

-- Remove any psychometric-related functions
DROP FUNCTION IF EXISTS public.psych_finalize_session(uuid);
DROP FUNCTION IF EXISTS public.psych_score_responses(uuid);

-- Clean up any audit logs related to psychometric testing
DELETE FROM public.audit_logs 
WHERE action IN (
  'psych_test_started',
  'psych_test_completed', 
  'psych_test_abandoned',
  'psych_consent_updated',
  'psych_profile_shared',
  'psych_profile_private'
);

-- Remove any storage buckets related to psychometric data
-- Note: This would need to be done through the Supabase dashboard or API
-- as storage buckets cannot be dropped via SQL

-- Add comment for tracking
COMMENT ON SCHEMA public IS 'Psychometric testing system removed for compliance - no personal profiling data collected';
