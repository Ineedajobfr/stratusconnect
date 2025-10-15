# Admin Console Fix Guide

## What's Fixed

1. **Dev server restarted** on port 8080
2. **AdminConsole.tsx updated** with intelligent fallback logic:
   - Tries `profiles` table first
   - Falls back to `users` table if profiles doesn't exist
   - Transforms data to match expected format
   - Extensive console logging for debugging
3. **SQL script created**: `ADMIN_DEBUG_AND_FIX.sql` - comprehensive database setup

## Step-by-Step Fix

### Option 1: Run the SQL Script (RECOMMENDED)

1. Open your Supabase dashboard: https://supabase.com/dashboard/project/pvgqfqkrtflpvajhddhr
2. Go to **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy and paste the entire contents of `ADMIN_DEBUG_AND_FIX.sql`
5. Click **Run** (or press Ctrl+Enter)
6. Check the output - you should see:
   - ✅ Success messages
   - A list of all created users
   - Statistics by role

### Option 2: Expose Public Schema (Alternative)

If the SQL script doesn't work, try exposing the `public` schema:

1. Go to **Settings** → **API** in your Supabase dashboard
2. Find **Exposed schemas** setting
3. Add `public` to the list (comma-separated if multiple)
4. Click **Save**
5. Refresh your admin console

## What to Check After Running SQL

### In Browser Console

Open the admin console and check the browser console (F12). You should see:

```
🔍 Starting user load...
📊 Profiles query result: { data: [...], error: null }
✅ Profiles loaded successfully: 6 users
```

OR if using users table:

```
🔍 Starting user load...
📊 Profiles query result: { data: null, error: {...} }
❌ Profiles error: ...
🔄 Trying users table...
📊 Users query result: { data: [...], error: null }
✅ Transformed users: [...]
```

### In Admin Console UI

You should now see:

1. **Platform Tab**: Overview stats
2. **Users Tab**: List of all users (6 total)
3. **Verification Tab**: Any pending users
4. **Test Users Tab**: Impersonation feature

## Test Users Created

| Email | Role | Status | Username |
|-------|------|--------|----------|
| Stratuscharters@gmail.com | admin | active | stratusadmin |
| broker@test.com | broker | active | test_broker |
| operator@test.com | operator | active | test_operator |
| pilot@test.com | pilot | active | test_pilot |
| crew@test.com | crew | active | test_crew |
| pending@test.com | broker | pending | test_pending |
| suspended@test.com | operator | suspended | test_suspended |

## Troubleshooting

### Still seeing empty tables?

1. Check browser console for error messages
2. Look for the 🔍 emoji logs
3. Share the error details

### RLS Policy Errors?

The SQL script includes comprehensive RLS policies. If you still get permission errors:

1. Make sure you're logged in as `Stratuscharters@gmail.com`
2. Check that your user has `is_admin = TRUE` in the database
3. Try logging out and back in

### Schema Mismatch Errors?

The new code tries both `profiles` and `users` tables and transforms the data accordingly. If you still get errors, share:

1. The exact error message
2. Browser console logs (especially the ones with emojis 🔍📊❌✅)

## Next Steps

Once the admin console loads:

1. **Test Verification**: Click on the pending user and try approving/rejecting
2. **Test Suspension**: Click suspend on an active user
3. **Test Impersonation**: Go to "Test Users" tab and click on a user to impersonate them
4. **Check Terminals**: After impersonating, verify that the respective terminal loads correctly

## Need More Help?

If you're still seeing issues, please provide:

1. Screenshot of the admin console
2. Browser console output (F12)
3. Any error messages from Supabase SQL Editor

