-- Fix missing RLS policies for user registration

-- Add RLS policy for security_settings (currently has no policies)
CREATE POLICY "Admin can manage security settings" 
ON public.security_settings 
FOR ALL 
USING (auth.uid() IN (
  SELECT user_id FROM public.profiles 
  WHERE platform_role = 'admin'
));

-- Ensure profiles table has proper policies for user registration
CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create users table if it doesn't exist for custom registration flow
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT auth.uid(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  company_name TEXT,
  role TEXT NOT NULL DEFAULT 'broker',
  verification_status TEXT NOT NULL DEFAULT 'pending',
  password_hash TEXT,
  username TEXT UNIQUE,
  access_code_hash TEXT,
  email_verification_token TEXT,
  email_verification_expires_at TIMESTAMPTZ,
  failed_login_attempts INTEGER DEFAULT 0,
  account_locked_until TIMESTAMPTZ,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on users table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Add RLS policies for users table
CREATE POLICY "Users can view their own data" 
ON public.users 
FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update their own data" 
ON public.users 
FOR UPDATE 
USING (auth.uid() = id);

-- Create trigger to sync auth.users with public.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, role, verification_status)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'broker'),
    COALESCE(NEW.raw_user_meta_data->>'verification_status', 'pending')
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, users.full_name),
    role = COALESCE(EXCLUDED.role, users.role),
    verification_status = COALESCE(EXCLUDED.verification_status, users.verification_status),
    updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;