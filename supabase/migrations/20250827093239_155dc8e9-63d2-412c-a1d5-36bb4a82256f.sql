-- Ensure RLS is enabled and enforce self-only access for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Remove any overly permissive public-read policy if it exists
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

-- Recreate a strict SELECT policy (idempotent)
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
USING ((select auth.uid()) = user_id);

-- Keep existing INSERT/UPDATE policies as-is (assumed already present per schema)
-- Optionally, force RLS to be applied strictly
ALTER TABLE public.profiles FORCE ROW LEVEL SECURITY;