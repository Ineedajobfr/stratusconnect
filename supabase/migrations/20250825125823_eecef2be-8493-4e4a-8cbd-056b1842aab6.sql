-- First, let's check if we need to update the existing profiles table structure
-- The profiles table exists but we need to ensure it has proper role handling

-- Update the profiles table to have better role constraints
ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_role_check 
CHECK (role IN ('broker', 'operator', 'crew', 'admin'));

-- Create demo user function that will be called after we set up users
CREATE OR REPLACE FUNCTION public.create_demo_profiles()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- We'll insert demo profiles after creating the auth users
  -- This function will be used to set up demo data
  RETURN;
END;
$$;