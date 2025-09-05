-- Update RLS policies to allow admin access to psych system
-- This bypasses the need for consent records for admin users

-- Add policy to allow admin sessions access
DROP POLICY IF EXISTS "admin access to sessions" ON public.psych_sessions;
CREATE POLICY "admin access to sessions"
ON public.psych_sessions
FOR ALL
USING (
  -- Allow access if user is one of our special admin UUIDs
  user_id IN ('00000000-0000-0000-0000-000000000001'::uuid, '00000000-0000-0000-0000-000000000002'::uuid)
)
WITH CHECK (
  user_id IN ('00000000-0000-0000-0000-000000000001'::uuid, '00000000-0000-0000-0000-000000000002'::uuid)
);

-- Add policy to allow admin responses access
DROP POLICY IF EXISTS "admin access to responses" ON public.psych_responses;
CREATE POLICY "admin access to responses"
ON public.psych_responses
FOR ALL
USING (
  user_id IN ('00000000-0000-0000-0000-000000000001'::uuid, '00000000-0000-0000-0000-000000000002'::uuid)
)
WITH CHECK (
  user_id IN ('00000000-0000-0000-0000-000000000001'::uuid, '00000000-0000-0000-0000-000000000002'::uuid)
);

-- Add policy to allow admin scores access
DROP POLICY IF EXISTS "admin access to scores" ON public.psych_scores;
CREATE POLICY "admin access to scores"
ON public.psych_scores
FOR SELECT
USING (
  user_id IN ('00000000-0000-0000-0000-000000000001'::uuid, '00000000-0000-0000-0000-000000000002'::uuid)
);

-- Allow admin access to psych_consent without requiring existing records
DROP POLICY IF EXISTS "admin access to consent" ON public.psych_consent;
CREATE POLICY "admin access to consent"
ON public.psych_consent
FOR ALL
USING (
  user_id IN ('00000000-0000-0000-0000-000000000001'::uuid, '00000000-0000-0000-0000-000000000002'::uuid)
)
WITH CHECK (
  user_id IN ('00000000-0000-0000-0000-000000000001'::uuid, '00000000-0000-0000-0000-000000000002'::uuid)
);