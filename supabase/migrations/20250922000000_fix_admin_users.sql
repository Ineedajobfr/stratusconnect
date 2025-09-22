-- Fix Admin Users with Complex Passwords and Full Functionality
-- This migration creates proper admin users that are fully functional and secure

-- Drop any existing admin authentication functions
DROP FUNCTION IF EXISTS public.authenticate_admin(text, text);

-- Create secure admin users with complex passwords
-- Main System Administrator
INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    role,
    aud,
    raw_user_meta_data
) VALUES (
    '10000000-0000-0000-0000-000000000001'::uuid,
    '00000000-0000-0000-0000-000000000000',
    'admin@stratusconnect.org',
    crypt('Str4tu$C0nn3ct_M4st3r_4dm1n_2025!#$', gen_salt('bf')),
    now(),
    now(),
    now(),
    'authenticated',
    'authenticated',
    '{"role": "admin", "full_name": "StratusConnect System Administrator"}'
) ON CONFLICT (email) DO UPDATE SET
    encrypted_password = crypt('Str4tu$C0nn3ct_M4st3r_4dm1n_2025!#$', gen_salt('bf')),
    raw_user_meta_data = '{"role": "admin", "full_name": "StratusConnect System Administrator"}';

-- Secondary Admin (Owner Account)
INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    role,
    aud,
    raw_user_meta_data
) VALUES (
    '10000000-0000-0000-0000-000000000002'::uuid,
    '00000000-0000-0000-0000-000000000000',
    'stratuscharters@gmail.com',
    crypt('Str4tu$Ch4rt3r$_0wn3r_S3cur3_2025!@#$%', gen_salt('bf')),
    now(),
    now(),
    now(),
    'authenticated',
    'authenticated',
    '{"role": "admin", "full_name": "Stratus Charters Owner"}'
) ON CONFLICT (email) DO UPDATE SET
    encrypted_password = crypt('Str4tu$Ch4rt3r$_0wn3r_S3cur3_2025!@#$%', gen_salt('bf')),
    raw_user_meta_data = '{"role": "admin", "full_name": "Stratus Charters Owner"}';

-- Third Admin (Lord Broctree)
INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    role,
    aud,
    raw_user_meta_data
) VALUES (
    '10000000-0000-0000-0000-000000000003'::uuid,
    '00000000-0000-0000-0000-000000000000',
    'lordbroctree1@gmail.com',
    crypt('L0rd_Br0ctr33_4dm1n_M4st3r_2025!@#$%^&', gen_salt('bf')),
    now(),
    now(),
    now(),
    'authenticated',
    'authenticated',
    '{"role": "admin", "full_name": "Lord Broctree Administrator"}'
) ON CONFLICT (email) DO UPDATE SET
    encrypted_password = crypt('L0rd_Br0ctr33_4dm1n_M4st3r_2025!@#$%^&', gen_salt('bf')),
    raw_user_meta_data = '{"role": "admin", "full_name": "Lord Broctree Administrator"}';

-- Create or update profiles for admin users
INSERT INTO public.profiles (
    user_id,
    username,
    display_name,
    platform_role,
    country
) VALUES 
    ('10000000-0000-0000-0000-000000000001'::uuid, 'SYSADMIN001', 'StratusConnect System Administrator', 'admin', 'GB'),
    ('10000000-0000-0000-0000-000000000002'::uuid, 'OWNER001', 'Stratus Charters Owner', 'admin', 'GB'),
    ('10000000-0000-0000-0000-000000000003'::uuid, 'ADMIN001', 'Lord Broctree Administrator', 'admin', 'GB')
ON CONFLICT (user_id) DO UPDATE SET
    platform_role = 'admin',
    display_name = EXCLUDED.display_name,
    username = EXCLUDED.username;

-- Ensure admin role is allowed in platform_role check
ALTER TABLE public.profiles 
DROP CONSTRAINT IF EXISTS profiles_platform_role_check;

ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_platform_role_check 
CHECK (platform_role = ANY (ARRAY['broker'::text, 'operator'::text, 'pilot'::text, 'crew'::text, 'admin'::text]));

-- Create admin company if it doesn't exist
INSERT INTO public.companies (
    id,
    name,
    type,
    approved,
    created_at
) VALUES (
    '20000000-0000-0000-0000-000000000001'::uuid,
    'StratusConnect Administration',
    'admin',
    true,
    now()
) ON CONFLICT (id) DO UPDATE SET
    name = 'StratusConnect Administration',
    type = 'admin',
    approved = true;

-- Create platform admin entries
INSERT INTO public.platform_admins (
    user_id,
    is_admin,
    is_reviewer,
    updated_at
) VALUES 
    ('10000000-0000-0000-0000-000000000001'::uuid, true, true, now()),
    ('10000000-0000-0000-0000-000000000002'::uuid, true, true, now()),
    ('10000000-0000-0000-0000-000000000003'::uuid, true, true, now())
ON CONFLICT (user_id) DO UPDATE SET
    is_admin = true,
    is_reviewer = true,
    updated_at = now();

-- Create helper function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.platform_admins 
        WHERE user_id = auth.uid() AND is_admin = true
    );
$$;

-- Create helper function to get user role
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS text
LANGUAGE sql
SECURITY DEFINER
AS $$
    SELECT platform_role FROM public.profiles WHERE user_id = auth.uid();
$$;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

-- Create RLS policy for admin access
CREATE POLICY "admin_full_access" ON public.profiles
    FOR ALL USING (
        auth.uid() IN (
            '10000000-0000-0000-0000-000000000001'::uuid,
            '10000000-0000-0000-0000-000000000002'::uuid,
            '10000000-0000-0000-0000-000000000003'::uuid
        ) OR
        is_admin()
    );

-- Ensure admins can access all data
CREATE POLICY "admin_companies_access" ON public.companies
    FOR ALL USING (is_admin());

CREATE POLICY "admin_platform_admins_access" ON public.platform_admins
    FOR ALL USING (is_admin());
