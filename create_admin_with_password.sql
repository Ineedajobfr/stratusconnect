-- Create admin user with password authentication
-- Run this in Supabase SQL Editor

-- Insert admin user into auth.users
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  role
) VALUES (
  gen_random_uuid(),
  'stratuscharters@gmail.com',
  crypt('admin123', gen_salt('bf')), -- Password: admin123
  NOW(),
  NOW(),
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{}',
  false,
  'authenticated'
) ON CONFLICT (email) DO UPDATE SET
  encrypted_password = crypt('admin123', gen_salt('bf')),
  updated_at = NOW();

-- Get the user ID for the profile
DO $$
DECLARE
    admin_user_id UUID;
BEGIN
    SELECT id INTO admin_user_id FROM auth.users WHERE email = 'stratuscharters@gmail.com';
    
    -- Insert/update profile
    INSERT INTO public.profiles (
        id,
        email,
        role,
        first_name,
        last_name,
        verification_status,
        created_at,
        updated_at
    ) VALUES (
        admin_user_id,
        'stratuscharters@gmail.com',
        'admin',
        'Stratus',
        'Admin',
        'approved',
        NOW(),
        NOW()
    ) ON CONFLICT (id) DO UPDATE SET
        role = 'admin',
        verification_status = 'approved',
        updated_at = NOW();
END $$;

-- Verify the admin user was created
SELECT 
    u.id,
    u.email,
    u.email_confirmed_at,
    p.role,
    p.verification_status
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE u.email = 'stratuscharters@gmail.com';

