# Apply Database Migration

## Step 1: Go to Supabase Dashboard
1. Open https://supabase.com/dashboard
2. Select your project: `pvgqfqkrtflpvajhddhr`
3. Go to **SQL Editor** (left sidebar)

## Step 2: Run the Migration
1. Click **"New Query"**
2. Copy the entire content from `supabase/migrations/20251015000001_marketplace_enhancements_safe.sql`
3. Paste it into the SQL Editor
4. Click **"Run"** button

## Step 3: Verify Success
You should see:
- ✅ "Success. No rows returned" (this is normal for DDL statements)
- No error messages

## Step 4: Refresh Your App
1. Go back to http://localhost:8080
2. Navigate to Broker Terminal → Marketplace
3. The search should now work!

---

## What This Migration Does:
- ✅ Creates `aircraft_models` table with sample data
- ✅ Adds new columns to `marketplace_listings` 
- ✅ Creates `trip_requests` table
- ✅ Adds safety ratings to `profiles`
- ✅ Creates `preferred_vendors` and `saved_searches` tables
- ✅ Sets up proper indexes and RLS policies

## If You Get Errors:
- Make sure you're in the correct project
- Check that you have admin access to the database
- The migration is designed to be safe and won't break existing data

