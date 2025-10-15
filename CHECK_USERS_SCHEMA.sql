-- CHECK USERS TABLE SCHEMA
-- Run this first to see what columns actually exist

SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
    AND table_name = 'users' 
ORDER BY ordinal_position;

-- Also check if the table exists
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
    AND table_name = 'users';
