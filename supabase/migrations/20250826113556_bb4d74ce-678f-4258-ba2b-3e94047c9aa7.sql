-- Fix critical security vulnerability: restrict profile access to own profiles only
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

-- Create new secure policy: users can only view their own profile
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING ((select auth.uid()) = user_id);

-- Ensure authenticated users are required for profile access
CREATE POLICY "Authenticated users can view basic public profile info" 
ON public.profiles 
FOR SELECT 
TO authenticated 
USING ((select auth.uid()) = user_id OR user_id IN (
  SELECT user_id FROM public.profiles WHERE user_id = (select auth.uid())
));