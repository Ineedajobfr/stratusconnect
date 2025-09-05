-- Create comprehensive production authentication system
-- Remove existing profile structure and create new users table

-- Drop existing profiles table and related triggers/functions
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Create new comprehensive users table
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

-- Create audit logs table
CREATE TABLE public.audit_logs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_user_id uuid REFERENCES public.users(id),
    action text NOT NULL,
    target_type text NOT NULL,
    target_id text NOT NULL,
    before_json jsonb,
    after_json jsonb,
    ip_address text,
    user_agent text,
    created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create admin invite codes table
CREATE TABLE public.admin_invite_codes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    code text UNIQUE NOT NULL,
    created_by uuid REFERENCES public.users(id) NOT NULL,
    used_by uuid REFERENCES public.users(id),
    expires_at timestamp with time zone NOT NULL,
    used_at timestamp with time zone,
    created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create sessions table for secure session management
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

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_invite_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;

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

-- Create RLS policies for audit logs
CREATE POLICY "Admins can view all audit logs"
ON public.audit_logs
FOR SELECT
USING (EXISTS (
    SELECT 1 FROM public.users u 
    WHERE u.id = (current_setting('app.current_user_id', true))::uuid 
    AND u.role = 'admin' 
    AND u.is_active = true
));

CREATE POLICY "System can insert audit logs"
ON public.audit_logs
FOR INSERT
WITH CHECK (true);

-- Create RLS policies for admin invite codes
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
CREATE POLICY "Users can view their own sessions"
ON public.user_sessions
FOR SELECT
USING (user_id = (current_setting('app.current_user_id', true))::uuid);

CREATE POLICY "System can manage sessions"
ON public.user_sessions
FOR ALL
USING (true);

-- Create indexes for performance
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_username ON public.users(username);
CREATE INDEX idx_users_role ON public.users(role);
CREATE INDEX idx_users_verification_status ON public.users(verification_status);
CREATE INDEX idx_audit_logs_actor ON public.audit_logs(actor_user_id);
CREATE INDEX idx_audit_logs_created_at ON public.audit_logs(created_at);
CREATE INDEX idx_user_sessions_token ON public.user_sessions(session_token);
CREATE INDEX idx_user_sessions_user_id ON public.user_sessions(user_id);
CREATE INDEX idx_user_sessions_expires_at ON public.user_sessions(expires_at);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

-- Add updated_at triggers
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

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