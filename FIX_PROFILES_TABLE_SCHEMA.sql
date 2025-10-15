-- FIX PROFILES TABLE SCHEMA
-- Add missing verification_status column to profiles table

-- Check if verification_status column exists
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'verification_status';

-- Add verification_status column if it doesn't exist
DO $$
BEGIN
    -- Add verification_status column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
            AND table_name = 'profiles' 
            AND column_name = 'verification_status'
    ) THEN
        ALTER TABLE public.profiles 
        ADD COLUMN verification_status VARCHAR(20) DEFAULT 'pending';
        
        RAISE NOTICE '✅ Added verification_status column to profiles table';
    ELSE
        RAISE NOTICE '✅ verification_status column already exists';
    END IF;
    
    -- Update existing profiles to have verification_status
    UPDATE public.profiles 
    SET verification_status = 'approved' 
    WHERE verification_status IS NULL OR verification_status = '';
    
    RAISE NOTICE '✅ Updated existing profiles with verification_status';
END $$;

-- Verify the fix
SELECT 
    'Profiles table schema updated' as status,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
    AND table_name = 'profiles'
    AND column_name IN ('verification_status', 'id', 'email', 'role')
ORDER BY column_name;
