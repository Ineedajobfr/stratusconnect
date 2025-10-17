-- ========================================
-- EMERGENCY FIX - ADD OPERATOR_ID COLUMN ONLY
-- Run this if the full migration keeps failing
-- ========================================

-- Step 1: Check if the table exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'marketplace_listings'
  ) THEN
    RAISE EXCEPTION 'ERROR: marketplace_listings table does not exist! Create it first.';
  END IF;
END $$;

-- Step 2: Add operator_id column if missing
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
      AND table_name = 'marketplace_listings' 
      AND column_name = 'operator_id'
  ) THEN
    ALTER TABLE marketplace_listings 
    ADD COLUMN operator_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
    
    RAISE NOTICE '✅ Added operator_id column to marketplace_listings';
  ELSE
    RAISE NOTICE '⚠️ operator_id column already exists';
  END IF;
END $$;

-- Step 3: Verify it worked
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'marketplace_listings' 
  AND column_name = 'operator_id';

-- If you see a row returned above, SUCCESS! ✅
-- If no rows, the column still doesn't exist ❌
