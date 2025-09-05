-- Create production authentication system handling existing tables
-- Check and create only what doesn't exist

-- First, handle the profiles table migration to new users table
DO $$
BEGIN
  -- Check if new users table exists, if not create it
  IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'users') THEN
    CREATE TABLE public.users (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      created_at timestamp with time zone NOT NULL DEFAULT now(),
      updated_at timestamp with time zone NOT NULL DEFAULT now(),
      username text UNIQUE NOT NULL,
      access_code_hash text NOT NULL,
      email text UNIQUE NOT NULL,
      password_hash text NOT NULL,
      role text NOT NULL CHECK (role IN ('broker', 'operator', 'pilot', 'crew', 'admin')),
      verification_status text NOT NULL DEFAULT 'pending' CHECK (verification_status IN ('pending', 'approved', 'rejected')),
      last_login_at timestamp with time zone,
      failed_login_count integer NOT NULL DEFAULT 0,
      is_active boolean NOT NULL DEFAULT true,
      full_name text,
      company_name text,
      email_verified boolean NOT NULL DEFAULT false,
      email_verification_token text,
      email_verification_expires_at timestamp with time zone,
      password_reset_token text,
      password_reset_expires_at timestamp with time zone,
      locked_until timestamp with time zone
    );
    
    -- Enable RLS
    ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
    
    -- Create indexes
    CREATE INDEX idx_users_email ON public.users(email);
    CREATE INDEX idx_users_username ON public.users(username);
    CREATE INDEX idx_users_role ON public.users(role);
    CREATE INDEX idx_users_verification_status ON public.users(verification_status);
  END IF;
END $$;

-- Create admin invite codes table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'admin_invite_codes') THEN
    CREATE TABLE public.admin_invite_codes (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      code text UNIQUE NOT NULL,
      created_by uuid REFERENCES public.users(id) NOT NULL,
      used_by uuid REFERENCES public.users(id),
      expires_at timestamp with time zone NOT NULL,
      used_at timestamp with time zone,
      created_at timestamp with time zone NOT NULL DEFAULT now()
    );
    
    ALTER TABLE public.admin_invite_codes ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Create sessions table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_sessions') THEN
    CREATE TABLE public.user_sessions (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
      session_token text UNIQUE NOT NULL,
      expires_at timestamp with time zone NOT NULL,
      ip_address text,
      user_agent text,
      created_at timestamp with time zone NOT NULL DEFAULT now(),
      last_activity timestamp with time zone NOT NULL DEFAULT now()
    );
    
    ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;
    
    -- Create indexes
    CREATE INDEX idx_user_sessions_token ON public.user_sessions(session_token);
    CREATE INDEX idx_user_sessions_user_id ON public.user_sessions(user_id);
    CREATE INDEX idx_user_sessions_expires_at ON public.user_sessions(expires_at);
  END IF;
END $$;

-- Update audit_logs table if columns don't exist
DO $$
BEGIN
  -- Add missing columns to existing audit_logs table
  IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'audit_logs' AND column_name = 'ip_address') THEN
    ALTER TABLE public.audit_logs ADD COLUMN ip_address text;
  END IF;
  
  IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'audit_logs' AND column_name = 'user_agent') THEN
    ALTER TABLE public.audit_logs ADD COLUMN user_agent text;
  END IF;
END $$;

-- Drop and recreate RLS policies for users table
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
DROP POLICY IF EXISTS "Admins can update all users" ON public.users;

-- Create RLS policies for users table
CREATE POLICY "Users can view their own profile"
ON public.users
FOR SELECT
USING (id = (current_setting('app.current_user_id', true))::uuid);

CREATE POLICY "Users can update their own profile"
ON public.users
FOR UPDATE
USING (id = (current_setting('app.current_user_id', true))::uuid);

CREATE POLICY "Admins can view all users"
ON public.users
FOR SELECT
USING (EXISTS (
    SELECT 1 FROM public.users u 
    WHERE u.id = (current_setting('app.current_user_id', true))::uuid 
    AND u.role = 'admin' 
    AND u.is_active = true
));

CREATE POLICY "Admins can update all users"
ON public.users
FOR UPDATE
USING (EXISTS (
    SELECT 1 FROM public.users u 
    WHERE u.id = (current_setting('app.current_user_id', true))::uuid 
    AND u.role = 'admin' 
    AND u.is_active = true
));

-- Create RLS policies for admin invite codes
DROP POLICY IF EXISTS "Admins can manage invite codes" ON public.admin_invite_codes;
CREATE POLICY "Admins can manage invite codes"
ON public.admin_invite_codes
FOR ALL
USING (EXISTS (
    SELECT 1 FROM public.users u 
    WHERE u.id = (current_setting('app.current_user_id', true))::uuid 
    AND u.role = 'admin' 
    AND u.is_active = true
));

-- Create RLS policies for user sessions
DROP POLICY IF EXISTS "Users can view their own sessions" ON public.user_sessions;
DROP POLICY IF EXISTS "System can manage sessions" ON public.user_sessions;

CREATE POLICY "Users can view their own sessions"
ON public.user_sessions
FOR SELECT
USING (user_id = (current_setting('app.current_user_id', true))::uuid);

CREATE POLICY "System can manage sessions"
ON public.user_sessions
FOR ALL
USING (true);

-- Helper functions for username and access code generation
CREATE OR REPLACE FUNCTION public.generate_unique_username()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    new_username text;
    chars text[] := ARRAY['A','B','C','D','E','F','G','H','J','K','L','M','N','P','Q','R','S','T','U','V','W','X','Y','Z'];
    nums text[] := ARRAY['0','1','2','3','4','5','6','7','8','9'];
    counter integer := 0;
BEGIN
    LOOP
        -- Generate 3 letters + 5 numbers pattern
        new_username := 
            chars[floor(random() * array_length(chars, 1) + 1)] ||
            chars[floor(random() * array_length(chars, 1) + 1)] ||
            chars[floor(random() * array_length(chars, 1) + 1)] ||
            nums[floor(random() * array_length(nums, 1) + 1)] ||
            nums[floor(random() * array_length(nums, 1) + 1)] ||
            nums[floor(random() * array_length(nums, 1) + 1)] ||
            nums[floor(random() * array_length(nums, 1) + 1)] ||
            nums[floor(random() * array_length(nums, 1) + 1)];
        
        -- Check if username is unique
        IF NOT EXISTS (SELECT 1 FROM public.users WHERE username = new_username) THEN
            RETURN new_username;
        END IF;
        
        counter := counter + 1;
        IF counter > 100 THEN
            RAISE EXCEPTION 'Could not generate unique username after 100 attempts';
        END IF;
    END LOOP;
END;
$$;

CREATE OR REPLACE FUNCTION public.generate_access_code()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    chars text[] := ARRAY['A','B','C','D','E','F','G','H','J','K','L','M','N','P','Q','R','S','T','U','V','W','X','Y','Z','a','b','c','d','e','f','g','h','j','k','m','n','p','q','r','s','t','u','v','w','x','y','z','2','3','4','5','6','7','8','9'];
    result text := '';
    i integer;
BEGIN
    FOR i IN 1..12 LOOP
        result := result || chars[floor(random() * array_length(chars, 1) + 1)];
    END LOOP;
    RETURN result;
END;
$$;

-- Add updated_at trigger for users table
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();