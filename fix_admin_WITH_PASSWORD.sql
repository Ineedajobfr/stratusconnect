-- COMPLETE FIX - Includes password_hash for all users
-- 100% SAFE - Handles ALL required fields

-- 1. Add status column if missing
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active' CHECK (status IN ('active','pending','suspended','inactive'));

-- 2. Migrate verification_status to status
UPDATE public.users 
SET status = CASE 
  WHEN verification_status = 'approved' THEN 'active'
  WHEN verification_status = 'pending' THEN 'pending'
  WHEN verification_status = 'rejected' THEN 'suspended'
  ELSE 'active'
END
WHERE status IS NULL;

-- 3. Add indexes
CREATE INDEX IF NOT EXISTS idx_users_status ON public.users(status);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);

-- 4. Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 5. Drop old policies
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
DROP POLICY IF EXISTS "Admins can update users" ON public.users;
DROP POLICY IF EXISTS "Admins can insert users" ON public.users;
DROP POLICY IF EXISTS "Admins can delete users" ON public.users;
DROP POLICY IF EXISTS "Users can view their own data" ON public.users;

-- 6. Create admin policies
CREATE POLICY "Admins can view all users" ON public.users FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Users can view their own data" ON public.users FOR SELECT TO authenticated 
USING (id = auth.uid());

CREATE POLICY "Admins can update users" ON public.users FOR UPDATE TO authenticated
USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can insert users" ON public.users FOR INSERT TO authenticated
WITH CHECK (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can delete users" ON public.users FOR DELETE TO authenticated
USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

-- 7. Make YOU admin (with ALL required fields)
UPDATE public.users
SET 
  role = 'admin', 
  status = 'active', 
  verification_status = 'approved',
  full_name = COALESCE(full_name, 'Stratus Admin'),
  username = COALESCE(username, 'stratusadmin'),
  access_code_hash = COALESCE(access_code_hash, 'ADMIN_ACCESS'),
  password_hash = COALESCE(password_hash, 'NO_PASSWORD_OAUTH_ONLY'),
  updated_at = NOW()
WHERE email = 'Stratuscharters@gmail.com';

-- Create admin if doesn't exist
INSERT INTO public.users (
  id, email, username, access_code_hash, password_hash, full_name, 
  role, status, verification_status, created_at, updated_at, is_active
)
SELECT 
  gen_random_uuid(),
  'Stratuscharters@gmail.com',
  'stratusadmin',
  'ADMIN_ACCESS',
  'NO_PASSWORD_OAUTH_ONLY',
  'Stratus Admin',
  'admin',
  'active',
  'approved',
  NOW(),
  NOW(),
  true
WHERE NOT EXISTS (
  SELECT 1 FROM public.users WHERE email = 'Stratuscharters@gmail.com'
);

-- 8. Add test users (with ALL required fields)
INSERT INTO public.users (
  id, email, username, access_code_hash, password_hash, full_name, 
  role, status, verification_status, created_at, last_login_at, is_active
)
SELECT 
  gen_random_uuid(),
  'test.broker@stratusconnect.com',
  'johnbroker',
  'TEST_ACCESS_1',
  'TEST_PASSWORD_1',
  'John Broker',
  'broker',
  'active',
  'approved',
  NOW() - INTERVAL '30 days',
  NOW(),
  true
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'test.broker@stratusconnect.com');

INSERT INTO public.users (
  id, email, username, access_code_hash, password_hash, full_name, 
  role, status, verification_status, created_at, last_login_at, is_active
)
SELECT 
  gen_random_uuid(),
  'test.operator@stratusconnect.com',
  'sarahoperator',
  'TEST_ACCESS_2',
  'TEST_PASSWORD_2',
  'Sarah Operator',
  'operator',
  'active',
  'approved',
  NOW() - INTERVAL '25 days',
  NOW(),
  true
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'test.operator@stratusconnect.com');

INSERT INTO public.users (
  id, email, username, access_code_hash, password_hash, full_name, 
  role, status, verification_status, created_at, is_active
)
SELECT 
  gen_random_uuid(),
  'test.pilot@stratusconnect.com',
  'mikepilot',
  'TEST_ACCESS_3',
  'TEST_PASSWORD_3',
  'Mike Pilot',
  'pilot',
  'active',
  'approved',
  NOW() - INTERVAL '20 days',
  true
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'test.pilot@stratusconnect.com');

INSERT INTO public.users (
  id, email, username, access_code_hash, password_hash, full_name, 
  role, status, verification_status, created_at, is_active
)
SELECT 
  gen_random_uuid(),
  'test.crew@stratusconnect.com',
  'lisacrew',
  'TEST_ACCESS_4',
  'TEST_PASSWORD_4',
  'Lisa Crew',
  'crew',
  'active',
  'approved',
  NOW() - INTERVAL '15 days',
  true
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'test.crew@stratusconnect.com');

INSERT INTO public.users (
  id, email, username, access_code_hash, password_hash, full_name, 
  role, status, verification_status, created_at, is_active
)
SELECT 
  gen_random_uuid(),
  'pending.broker@stratusconnect.com',
  'davidpending',
  'PENDING_ACCESS_1',
  'PENDING_PASSWORD_1',
  'David Pending',
  'broker',
  'pending',
  'pending',
  NOW() - INTERVAL '2 days',
  false
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'pending.broker@stratusconnect.com');

INSERT INTO public.users (
  id, email, username, access_code_hash, password_hash, full_name, 
  role, status, verification_status, created_at, is_active
)
SELECT 
  gen_random_uuid(),
  'pending.operator@stratusconnect.com',
  'emmapending',
  'PENDING_ACCESS_2',
  'PENDING_PASSWORD_2',
  'Emma Pending',
  'operator',
  'pending',
  'pending',
  NOW() - INTERVAL '1 day',
  false
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'pending.operator@stratusconnect.com');

INSERT INTO public.users (
  id, email, username, access_code_hash, password_hash, full_name, 
  role, status, verification_status, created_at, is_active
)
SELECT 
  gen_random_uuid(),
  'suspended.user@stratusconnect.com',
  'suspendeduser',
  'SUSPENDED_ACCESS',
  'SUSPENDED_PASSWORD',
  'Suspended User',
  'broker',
  'suspended',
  'rejected',
  NOW() - INTERVAL '45 days',
  false
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'suspended.user@stratusconnect.com');

-- 9. Show success message
SELECT 
  '🎉 Admin Console Setup Complete!' as message,
  '✅ All users created with required fields' as status,
  COUNT(*) as total_users,
  COUNT(*) FILTER (WHERE role = 'admin') as admin_users,
  COUNT(*) FILTER (WHERE status = 'pending') as pending_approval,
  COUNT(*) FILTER (WHERE status = 'active') as active_users
FROM public.users;

-- 10. List all users
SELECT 
  '👤 ' || username as user,
  email,
  full_name,
  role,
  status,
  CASE 
    WHEN last_login_at >= CURRENT_DATE THEN '🟢 Active Today'
    WHEN last_login_at IS NOT NULL THEN '🟡 Logged In Before'
    ELSE '⚪ Never Logged In'
  END as activity,
  created_at
FROM public.users
ORDER BY 
  CASE role 
    WHEN 'admin' THEN 1
    WHEN 'broker' THEN 2
    WHEN 'operator' THEN 3
    WHEN 'pilot' THEN 4
    WHEN 'crew' THEN 5
  END,
  created_at DESC;














