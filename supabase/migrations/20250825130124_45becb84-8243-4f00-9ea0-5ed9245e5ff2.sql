-- Fix the role constraint to include all roles
ALTER TABLE public.profiles 
DROP CONSTRAINT IF EXISTS profiles_role_check;

ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_role_check 
CHECK (role IN ('broker', 'operator', 'crew', 'admin'));

-- Delete the invalid demo profiles that failed to insert
DELETE FROM public.profiles WHERE email IN (
  'broker@stratusconnect.com',
  'operator@stratusconnect.com', 
  'crew@stratusconnect.com',
  'admin@stratusconnect.com'
);