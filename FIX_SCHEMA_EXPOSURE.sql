-- Fix: Expose public schema to PostgREST API
-- This fixes the "PGRST106" error

-- Option 1: Add public to exposed schemas (RECOMMENDED)
-- Go to Supabase Dashboard > Settings > API Settings
-- Find "API Settings" or "Exposed Schemas"
-- Add "public" to the list

-- Option 2: Create a view in the api schema that points to public.users
CREATE SCHEMA IF NOT EXISTS api;

CREATE OR REPLACE VIEW api.users AS
SELECT * FROM public.users;

-- Grant permissions on the view
GRANT SELECT ON api.users TO authenticated;
GRANT ALL ON api.users TO service_role;

-- Verify it works
SELECT 'View created successfully!' as message, COUNT(*) as users_count FROM api.users;

