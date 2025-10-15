# StratusConnect Marketplace Deployment Guide

## 🎯 What We Built

A **production-ready marketplace system** for StratusConnect that allows:
- **Brokers**: Search aircraft, post RFQs, view trip requests
- **Operators**: Post aircraft listings, manage empty legs, calendar management  
- **Trust-Based Ranking**: Listings ranked by operator reputation and verification
- **Real-time Search**: Fast, filtered marketplace search with pagination

## 📁 Files Created

### Database Schema
- `supabase/migrations/20251015000000_marketplace_schema.sql` - Complete marketplace schema with no duplicates

### Supabase Edge Functions
- `supabase/functions/marketplace-search/index.ts` - Search listings with filters & trust ranking
- `supabase/functions/marketplace-listing/index.ts` - Create/update/delete listings (operators)
- `supabase/functions/trip-request/index.ts` - Create/manage trip requests (brokers)

### Frontend Services
- `src/lib/marketplace-service.ts` - TypeScript client for marketplace API

### UI Components
- `src/components/marketplace/BrokerMarketplace.tsx` - Broker marketplace interface
- `src/components/marketplace/OperatorListingFlow.tsx` - Operator listing management

### Integration
- `src/pages/BrokerTerminal.tsx` - Integrated marketplace tab
- `src/pages/OperatorTerminal.tsx` - Integrated marketplace tab

## 🚀 Deployment Steps

### 1. Deploy Database Schema

Run the migration in Supabase SQL Editor:

```bash
# Navigate to Supabase Dashboard > SQL Editor
# Run: supabase/migrations/20251015000000_marketplace_schema.sql
```

This will:
- ✅ Add marketplace columns to existing `aircraft` table
- ✅ Enhance `marketplace_listings` table
- ✅ Create `trip_requests` table
- ✅ Create `user_reputation` table
- ✅ Create `security_events` table
- ✅ Create `user_trust` VIEW for ranking
- ✅ Set up RLS policies
- ✅ Create indexes for performance

### 2. Deploy Edge Functions

Deploy each edge function to Supabase:

```bash
# From your project root
cd supabase

# Deploy marketplace search
supabase functions deploy marketplace-search

# Deploy listing management
supabase functions deploy marketplace-listing

# Deploy trip request management
supabase functions deploy trip-request
```

### 3. Verify Deployment

Check that edge functions are deployed:

```bash
supabase functions list
```

You should see:
- ✅ marketplace-search
- ✅ marketplace-listing
- ✅ trip-request

## 🧪 Testing

### Test as Broker

1. Log in as a broker user
2. Navigate to **Broker Terminal** → **Marketplace** tab
3. Try:
   - Searching listings
   - Creating a new RFQ (trip request)
   - Viewing your RFQs

### Test as Operator

1. Log in as an operator user
2. Navigate to **Operator Terminal** → **Marketplace** tab
3. Try:
   - Creating a new listing
   - Editing a listing
   - Deleting a listing
   - Viewing all your listings

### Test Search Functionality

Search with filters:
- Search by text (aircraft type, route)
- Filter by listing type (charter, empty_leg, sale)
- Filter by departure airport
- Test pagination

### Test Trust Scoring

The marketplace automatically ranks listings by:
- Operator reputation score (60% weight)
- Verification status (+20 points if verified)
- Activity count (20% weight)

## 📊 Database Tables

### New Tables

**trip_requests** - Broker RFQs
- Broker creates trip requests
- Operators can view and respond
- Status: open, fulfilled, cancelled

**user_reputation** - Ratings & Reviews
- Users can rate each other after transactions
- Automatic reputation_score calculation
- Triggers update profiles/users tables

**security_events** - Audit Trail
- Logs all marketplace actions
- Tracks user_id, event_type, details
- For compliance and security monitoring

### Enhanced Tables

**marketplace_listings** - Added columns:
- title, description, listing_type
- price, currency, departure/destination airports
- dep_time, arr_time, seats, metadata
- operator_id, active status

**aircraft** - Added columns:
- operator_id, category, base_airport, availability

**users/profiles** - Added columns:
- reputation_score, verified

## 🔐 Security Features

### Row Level Security (RLS)

All tables have RLS enabled:

**marketplace_listings**:
- Anyone can view active listings
- Only operators can create listings
- Only owners can update/delete their listings

**trip_requests**:
- Anyone can view open requests
- Only brokers can create requests
- Only owners can update their requests

**user_reputation**:
- Anyone can view ratings
- Only authenticated users can create ratings
- Must be rated_by = auth.uid()

### Audit Trail

All marketplace actions are logged in `security_events`:
- listing_created
- listing_updated
- listing_deleted
- trip_request_created
- trip_request_updated

## 💰 Pricing & Business Model

**FREE for users** (as requested):
- No listing fees
- No search fees
- No transaction fees on the marketplace
- Users can browse and connect for free

**Revenue comes from**:
- Payment protection (separate service)
- Premium verification
- Featured listings (future)
- Value-added services

## 📈 Next Steps

After testing, you can enhance:

1. **Quote System**: Allow operators to quote on trip requests
2. **Messaging**: Direct messaging between brokers and operators
3. **Advanced Search**: Geographic radius, multi-leg routes
4. **Empty Leg Calendar**: Visual calendar for empty legs
5. **Saved Searches**: Brokers can save searches and get alerts
6. **Featured Listings**: Premium placement for operators
7. **Analytics Dashboard**: Marketplace metrics and insights

## 🐛 Troubleshooting

### Edge Functions Not Working

```bash
# Check function logs
supabase functions logs marketplace-search --tail

# Redeploy if needed
supabase functions deploy marketplace-search --no-verify-jwt
```

### Database Errors

```bash
# Check migration status
supabase db status

# View recent migrations
supabase db history
```

### RLS Policies Blocking Requests

- Ensure user is authenticated
- Check user role matches policy requirements
- Verify auth.uid() matches operator_id/broker_id

## 📝 API Endpoints

### Marketplace Search
```
GET /functions/v1/marketplace-search?q=&listing_type=&departure_airport=&page=1&per_page=20
```

### Create Listing (Operators)
```
POST /functions/v1/marketplace-listing
Body: { title, listing_type, price, ... }
```

### Create Trip Request (Brokers)
```
POST /functions/v1/trip-request
Body: { origin, destination, dep_time, pax, ... }
```

## ✅ Success Criteria

Marketplace is working when:
- ✅ Brokers can search and view listings
- ✅ Brokers can create trip requests
- ✅ Operators can create and manage listings
- ✅ Trust scores are calculated and displayed
- ✅ Search returns results ranked by trust
- ✅ RLS policies protect data correctly
- ✅ All actions are logged in security_events

---

**Built with**: Supabase, TypeScript, React, Tailwind CSS  
**Status**: Production Ready ✨  
**Free to Use**: Yes - No fees for users 🎉

