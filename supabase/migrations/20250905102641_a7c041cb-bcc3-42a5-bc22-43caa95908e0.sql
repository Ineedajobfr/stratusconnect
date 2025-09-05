-- Add 'admin' to the allowed platform_role values
ALTER TABLE public.profiles 
DROP CONSTRAINT profiles_platform_role_check;

ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_platform_role_check 
CHECK (platform_role = ANY (ARRAY['broker'::text, 'operator'::text, 'pilot'::text, 'crew'::text, 'admin'::text]));

-- Now create admin profiles for the owner emails
INSERT INTO public.profiles (
  user_id,
  username,
  display_name,
  platform_role,
  country
) VALUES 
(
  '00000000-0000-0000-0000-000000000001'::uuid,
  'ADMIN001',
  'Stratus Charters Admin',
  'admin',
  'US'
),
(
  '00000000-0000-0000-0000-000000000002'::uuid,
  'ADMIN002', 
  'Lord Broctree Admin',
  'admin',
  'US'
) ON CONFLICT (user_id) DO UPDATE SET
  platform_role = EXCLUDED.platform_role,
  display_name = EXCLUDED.display_name;

-- Create a function to handle admin authentication
CREATE OR REPLACE FUNCTION public.authenticate_admin(
  email_input text,
  password_input text
) RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  admin_user_id uuid;
  admin_profile record;
  result jsonb;
BEGIN
  -- Check if this is an admin email with the correct password
  IF email_input = 'stratuscharters@gmail.com' AND password_input = 'G7!qZ$9rX2^m@F1k&V4w*L8p#C6tJ0u' THEN
    admin_user_id := '00000000-0000-0000-0000-000000000001'::uuid;
  ELSIF email_input = 'lordbroctree1@gmail.com' AND password_input = 'G7!qZ$9rX2^m@F1k&V4w*L8p#C6tJ0u' THEN
    admin_user_id := '00000000-0000-0000-0000-000000000002'::uuid;
  ELSE
    RETURN jsonb_build_object('success', false, 'error', 'Invalid credentials');
  END IF;

  -- Get the admin profile
  SELECT * INTO admin_profile
  FROM public.profiles 
  WHERE user_id = admin_user_id;

  -- Return admin user data
  result := jsonb_build_object(
    'success', true,
    'user', jsonb_build_object(
      'id', admin_user_id,
      'email', email_input,
      'role', 'admin',
      'username', admin_profile.username,
      'display_name', admin_profile.display_name,
      'platform_role', admin_profile.platform_role,
      'verificationStatus', 'approved',
      'isAdmin', true
    )
  );

  RETURN result;
END;
$$;

-- Create a function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_platform_admin(user_id_input uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.profiles 
    WHERE user_id = user_id_input 
    AND platform_role = 'admin'
  );
$$;