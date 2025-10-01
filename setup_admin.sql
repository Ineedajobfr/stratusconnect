-- StratusConnect Admin Setup Script
-- Run this in Supabase SQL Editor

-- 1. Make Stratuscharters@gmail.com the main admin
UPDATE public.users 
SET 
  role = 'admin',
  status = 'active',
  full_name = 'Stratus Admin',
  updated_at = NOW()
WHERE email = 'Stratuscharters@gmail.com';

-- If user doesn't exist in public.users yet, insert them
INSERT INTO public.users (id, email, full_name, role, status, created_at, updated_at)
SELECT 
  id,
  'Stratuscharters@gmail.com',
  'Stratus Admin',
  'admin',
  'active',
  created_at,
  NOW()
FROM auth.users
WHERE email = 'Stratuscharters@gmail.com'
ON CONFLICT (id) DO UPDATE
SET 
  role = 'admin',
  status = 'active',
  full_name = 'Stratus Admin',
  updated_at = NOW();

-- 2. Add some test users for demonstration
-- These are fake users to test the admin console features

-- Test Broker (Active)
INSERT INTO public.users (id, email, full_name, role, status, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'test.broker@stratusconnect.com',
  'John Broker',
  'broker',
  'active',
  NOW() - INTERVAL '30 days',
  NOW()
) ON CONFLICT (email) DO NOTHING;

-- Test Operator (Active)
INSERT INTO public.users (id, email, full_name, role, status, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'test.operator@stratusconnect.com',
  'Sarah Operator',
  'operator',
  'active',
  NOW() - INTERVAL '25 days',
  NOW()
) ON CONFLICT (email) DO NOTHING;

-- Test Pilot (Active)
INSERT INTO public.users (id, email, full_name, role, status, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'test.pilot@stratusconnect.com',
  'Mike Pilot',
  'pilot',
  'active',
  NOW() - INTERVAL '20 days',
  NOW()
) ON CONFLICT (email) DO NOTHING;

-- Test Crew (Active)
INSERT INTO public.users (id, email, full_name, role, status, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'test.crew@stratusconnect.com',
  'Lisa Crew',
  'crew',
  'active',
  NOW() - INTERVAL '15 days',
  NOW()
) ON CONFLICT (email) DO NOTHING;

-- Test Broker (Pending Approval)
INSERT INTO public.users (id, email, full_name, role, status, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'pending.broker@stratusconnect.com',
  'David Pending',
  'broker',
  'pending',
  NOW() - INTERVAL '2 days',
  NOW()
) ON CONFLICT (email) DO NOTHING;

-- Test Operator (Pending Approval)
INSERT INTO public.users (id, email, full_name, role, status, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'pending.operator@stratusconnect.com',
  'Emma Pending',
  'operator',
  'pending',
  NOW() - INTERVAL '1 day',
  NOW()
) ON CONFLICT (email) DO NOTHING;

-- Test User (Suspended)
INSERT INTO public.users (id, email, full_name, role, status, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'suspended.user@stratusconnect.com',
  'Suspended User',
  'broker',
  'suspended',
  NOW() - INTERVAL '45 days',
  NOW()
) ON CONFLICT (email) DO NOTHING;

-- Update last_sign_in_at for active users to show "Active Today"
UPDATE public.users 
SET last_sign_in_at = NOW()
WHERE status = 'active' 
  AND email IN (
    'Stratuscharters@gmail.com',
    'test.broker@stratusconnect.com',
    'test.operator@stratusconnect.com'
  );

-- Show results
SELECT 
  email,
  full_name,
  role,
  status,
  created_at,
  last_sign_in_at
FROM public.users
ORDER BY created_at DESC;

-- Show summary stats
SELECT 
  COUNT(*) as total_users,
  COUNT(*) FILTER (WHERE status = 'pending') as pending_approval,
  COUNT(*) FILTER (WHERE role = 'admin') as admin_users,
  COUNT(*) FILTER (WHERE last_sign_in_at >= CURRENT_DATE) as active_today
FROM public.users;

