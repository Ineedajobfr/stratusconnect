-- ========================================
-- DIAGNOSTIC SCRIPT - CHECK CURRENT DATABASE STATE
-- Run this FIRST to see what exists in your database
-- ========================================

-- 1. Check if marketplace_listings table exists
SELECT 
  'marketplace_listings' as table_name,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'marketplace_listings'
    ) THEN '✅ EXISTS'
    ELSE '❌ DOES NOT EXIST'
  END as status;

-- 2. Check what columns marketplace_listings currently has
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'marketplace_listings'
ORDER BY ordinal_position;

-- 3. Check if operator_id column specifically exists
SELECT 
  'operator_id column' as check_name,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema = 'public' 
        AND table_name = 'marketplace_listings' 
        AND column_name = 'operator_id'
    ) THEN '✅ EXISTS'
    ELSE '❌ MISSING - THIS IS YOUR PROBLEM'
  END as status;

-- 4. List all policies on marketplace_listings
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'marketplace_listings';

-- 5. Check all public tables in your database
SELECT 
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public'
ORDER BY table_name;

-- ========================================
-- COPY THE RESULTS AND SEND THEM TO ME
-- ========================================
