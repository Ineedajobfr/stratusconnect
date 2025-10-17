# Apply Database Migrations - Quick Guide

## 🚀 Quick Start

### Step 1: Open Supabase Dashboard
1. Go to https://supabase.com/dashboard
2. Select your StratusConnect project
3. Navigate to **SQL Editor** in the left sidebar

---

### Step 2: Run Migrations in Order

Copy and paste each migration file into the SQL Editor and click **Run**.

#### Migration 1: Image Upload Security System
**File**: `supabase/migrations/20251015000009_image_uploads_security.sql`

**What it does**:
- Creates `image_uploads` table for audit trail
- Creates `image_moderation_logs` for AI results
- Creates `security_events` for monitoring
- Creates `aircraft-images` storage bucket
- Sets up RLS policies for security

**Run this migration first** ✅

---

#### Migration 2: Fix Operator Listings Creation
**File**: `supabase/migrations/20251015000010_fix_operator_listings.sql`

**What it does**:
- Ensures `marketplace_listings` table has all required columns
- Adds missing columns (price, departure_airport, etc.)
- Creates comprehensive RLS policies for operators
- Creates `aircraft_models` table with sample data
- Adds performance indexes

**Run this migration second** ✅

---

#### Migration 3: Billing & Transactions System
**File**: `supabase/migrations/20251015000011_billing_transactions.sql`

**What it does**:
- Creates `transactions` table for payment tracking
- Creates `payouts` table for operator payouts
- Creates `commission_rates` table
- Adds Stripe fields to `profiles` table
- Creates functions for commission calculation
- Sets up RLS policies for billing

**Run this migration third** ✅

---

#### Migration 4: Operator Profile System
**File**: `supabase/migrations/20251015000012_operator_profile_system.sql`

**What it does**:
- Creates `operator_fleet` table for aircraft management
- Adds profile columns (company_name, license_number, etc.)
- Adds verification columns (email_verified, business_verified, etc.)
- Creates fleet statistics function
- Sets up RLS policies for fleet management

**Run this migration fourth** ✅

---

## Step 3: Verify Migrations

After running all migrations, verify they were successful:

```sql
-- Check if tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
  'image_uploads',
  'image_moderation_logs',
  'security_events',
  'marketplace_listings',
  'aircraft_models',
  'transactions',
  'payouts',
  'commission_rates',
  'operator_fleet'
);

-- Should return 9 rows
```

---

## Step 4: Configure Storage Bucket

### Create aircraft-images bucket (if not auto-created)

1. Go to **Storage** in Supabase Dashboard
2. Click "Create a new bucket"
3. Bucket name: `aircraft-images`
4. Public bucket: ✅ **Yes**
5. File size limit: `5242880` (5MB)
6. Allowed MIME types: `image/jpeg,image/png,image/webp`
7. Click "Create bucket"

### Verify Storage Policies

Run this SQL to check storage policies:

```sql
SELECT * FROM storage.objects 
WHERE bucket_id = 'aircraft-images';
```

---

## Step 5: Seed Initial Data (Optional)

### Add Sample Aircraft Models

Already included in Migration 2, but if needed:

```sql
SELECT * FROM aircraft_models;
-- Should show 10 aircraft models (G650ER, Global 7500, etc.)
```

### Add Default Commission Rates

Already included in Migration 3:

```sql
SELECT * FROM commission_rates;
-- Should show:
-- charter: 7.00%
-- hiring: 10.00%
-- sale: 3.00%
```

---

## 🎯 Post-Migration Checks

### 1. Check RLS Policies

```sql
-- Should return multiple policies for each table
SELECT tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

### 2. Check Indexes

```sql
-- Should return indexes for performance optimization
SELECT tablename, indexname 
FROM pg_indexes 
WHERE schemaname = 'public'
AND tablename IN ('marketplace_listings', 'transactions', 'operator_fleet')
ORDER BY tablename, indexname;
```

### 3. Check Functions

```sql
-- Should return custom functions
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_schema = 'public'
AND routine_type = 'FUNCTION'
ORDER BY routine_name;
```

---

## ✅ Migration Checklist

- [ ] Migration 1 applied (Image Security)
- [ ] Migration 2 applied (Operator Listings)
- [ ] Migration 3 applied (Billing & Transactions)
- [ ] Migration 4 applied (Operator Profile)
- [ ] Tables verified (9 tables created/updated)
- [ ] Storage bucket created (`aircraft-images`)
- [ ] RLS policies active (checked in SQL)
- [ ] Indexes created (performance optimized)
- [ ] Functions working (commission calc, etc.)
- [ ] Sample data loaded (aircraft models, commission rates)

---

## 🔧 Troubleshooting

### Error: "relation already exists"
**Solution**: Migration creates tables with `CREATE TABLE IF NOT EXISTS`, so this is safe to ignore.

### Error: "policy already exists"
**Solution**: Drop existing policies first:
```sql
DROP POLICY IF EXISTS "policy_name" ON table_name;
```

### Error: "column already exists"
**Solution**: Migrations use `DO $$ BEGIN IF NOT EXISTS...` blocks, so this should not occur.

### Error: "permission denied"
**Solution**: Ensure you're running migrations as the database owner (not anon key).

---

## 🎉 Success!

Once all migrations are applied successfully, you should see:

✅ All operator features functional  
✅ Image uploads with AI moderation working  
✅ Marketplace listings creation enabled  
✅ Billing system connected  
✅ Profile management operational  

**Next**: Test the system using `OPERATOR_TERMINAL_TESTING_GUIDE.md`

---

## 📞 Support

If you encounter issues:
1. Check Supabase logs for error details
2. Verify all environment variables are set
3. Ensure Stripe keys are configured
4. Check browser console for client-side errors

**Status**: Ready to apply migrations 🚀
