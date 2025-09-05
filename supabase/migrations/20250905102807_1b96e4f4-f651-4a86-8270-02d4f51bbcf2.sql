-- Create psych consent records for admin users so they can access psych tests
-- Use the same UUIDs as in the authenticate_admin function
INSERT INTO public.psych_consent (
  user_id,
  consented_at,
  share_profile,
  data_retention_years
) VALUES 
(
  '00000000-0000-0000-0000-000000000001'::uuid,
  now(),
  true,
  10
),
(
  '00000000-0000-0000-0000-000000000002'::uuid,
  now(),
  true,
  10
) ON CONFLICT (user_id) DO UPDATE SET
  consented_at = EXCLUDED.consented_at,
  share_profile = EXCLUDED.share_profile;

-- Update RLS policies to allow admin access to psych system
-- Add admin policies for psych_sessions
DROP POLICY IF EXISTS "admins can access all sessions" ON public.psych_sessions;
CREATE POLICY "admins can access all sessions"
ON public.psych_sessions
FOR ALL
USING (
  user_id IN ('00000000-0000-0000-0000-000000000001'::uuid, '00000000-0000-0000-0000-000000000002'::uuid)
);

-- Add admin policies for psych_responses
DROP POLICY IF EXISTS "admins can access all responses" ON public.psych_responses;
CREATE POLICY "admins can access all responses"
ON public.psych_responses
FOR ALL
USING (
  user_id IN ('00000000-0000-0000-0000-000000000001'::uuid, '00000000-0000-0000-0000-000000000002'::uuid)
);

-- Add admin policies for psych_scores
DROP POLICY IF EXISTS "admins can access all scores" ON public.psych_scores;
CREATE POLICY "admins can access all scores"
ON public.psych_scores
FOR SELECT
USING (
  user_id IN ('00000000-0000-0000-0000-000000000001'::uuid, '00000000-0000-0000-0000-000000000002'::uuid)
);