-- Remove redundant SELECT policy that could be misinterpreted as permissive
DROP POLICY IF EXISTS "Authenticated users can view basic public profile info" ON public.profiles;