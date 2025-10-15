-- Debug Password Issue - Let's see what's actually in the database
-- Run this in Supabase SQL Editor

-- Check if admin user exists and what password hash looks like
SELECT 
    'ADMIN_USER_CHECK' as check_type,
    id,
    email,
    email_confirmed_at,
    encrypted_password,
    LENGTH(encrypted_password) as password_length,
    SUBSTRING(encrypted_password, 1, 10) as password_start,
    created_at,
    raw_user_meta_data
FROM auth.users 
WHERE email = 'stratuscharters@gmail.com';

-- Check if there are any other users with similar emails
SELECT 
    'SIMILAR_EMAILS' as check_type,
    id,
    email,
    created_at
FROM auth.users 
WHERE email LIKE '%stratuscharters%' OR email LIKE '%admin%';

-- Test our password against the stored hash
SELECT 
    'PASSWORD_TEST' as test_type,
    email,
    encrypted_password,
    CASE 
        WHEN encrypted_password = crypt('Str4tu$C0nn3ct_M4st3r_4dm1n_2025!#$', encrypted_password) 
        THEN '✅ PASSWORD MATCHES' 
        ELSE '❌ PASSWORD DOES NOT MATCH' 
    END as password_test_result,
    CASE 
        WHEN encrypted_password LIKE '$2a$%' THEN 'bcrypt format'
        WHEN encrypted_password LIKE '$2b$%' THEN 'bcrypt format'
        WHEN encrypted_password LIKE '$argon2%' THEN 'argon2 format'
        ELSE 'unknown format: ' || SUBSTRING(encrypted_password, 1, 20)
    END as hash_format
FROM auth.users 
WHERE email = 'stratuscharters@gmail.com';

-- Let's also check what a working user's password hash looks like (if any exist)
SELECT 
    'EXISTING_USER_FORMATS' as check_type,
    email,
    LENGTH(encrypted_password) as password_length,
    SUBSTRING(encrypted_password, 1, 10) as password_start,
    CASE 
        WHEN encrypted_password LIKE '$2a$%' THEN 'bcrypt'
        WHEN encrypted_password LIKE '$2b$%' THEN 'bcrypt'
        WHEN encrypted_password LIKE '$argon2%' THEN 'argon2'
        ELSE 'unknown'
    END as hash_format
FROM auth.users 
WHERE encrypted_password IS NOT NULL
LIMIT 5;

