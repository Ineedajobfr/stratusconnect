-- Fix the database trigger and create admin user
-- Run this in Supabase SQL Editor

-- First, let's see what triggers exist
SELECT trigger_name, event_manipulation, action_statement 
FROM information_schema.triggers 
WHERE event_object_table = 'users';

-- Check the users table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'users' AND table_schema = 'public'
ORDER BY ordinal_position;

-- Drop the problematic trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Drop the problematic function
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create a new, fixed trigger function that handles username properly
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (
    id,
    email,
    username,
    full_name,
    role,
    verification_status,
    created_at,
    updated_at
  ) VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'user'),
    COALESCE(NEW.raw_user_meta_data->>'verification_status', 'pending')
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    username = COALESCE(EXCLUDED.username, users.username),
    full_name = COALESCE(EXCLUDED.full_name, users.full_name),
    role = COALESCE(EXCLUDED.role, users.role),
    verification_status = COALESCE(EXCLUDED.verification_status, users.verification_status),
    updated_at = NOW();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Now delete any existing admin user
DELETE FROM auth.users WHERE email = 'stratuscharters@gmail.com';
DELETE FROM public.users WHERE email = 'stratuscharters@gmail.com';

-- Create the admin user with proper username in metadata
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
  crypt('admin123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{"full_name": "StratusConnect Admin", "role": "admin", "username": "admin", "verification_status": "approved"}',
  false,
  'authenticated'
);

-- Verify the admin user was created successfully
SELECT 
    u.id,
    u.email,
    u.email_confirmed_at,
    u.raw_user_meta_data,
    pub.username,
    pub.full_name,
    pub.role,
    pub.verification_status
FROM auth.users u
LEFT JOIN public.users pub ON u.id = pub.id
WHERE u.email = 'stratuscharters@gmail.com';

-- Show success message
SELECT 'Admin user created successfully!' as status;

