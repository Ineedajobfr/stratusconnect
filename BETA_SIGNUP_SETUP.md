# Beta Signup Setup Guide

## Environment Variables Required

Add these environment variables to your project:

### Frontend (.env.local)
```bash
VITE_TURNSTILE_SITE_KEY=your_turnstile_site_key
```

### Supabase Edge Functions (set in Supabase dashboard)
```bash
CF_TURNSTILE_SECRET_KEY=your_turnstile_secret_key
NOTION_API_KEY=your_notion_api_key (optional)
NOTION_DATABASE_ID=your_notion_database_id (optional)
```

## Setup Steps

1. **Get Cloudflare Turnstile Keys**
   - Go to [Cloudflare Turnstile](https://developers.cloudflare.com/turnstile/)
   - Create a new site
   - Copy the Site Key and Secret Key

2. **Deploy Database Migration**
   ```bash
   supabase db push
   ```

3. **Deploy Edge Function**
   ```bash
   supabase functions deploy beta-signup
   ```

4. **Set Edge Function Environment Variables**
   - Go to Supabase Dashboard > Functions > beta-signup
   - Add the environment variables listed above

5. **Optional: Setup Notion Integration**
   - Create a Notion database with these properties:
     - Name (Title)
     - Email (Email)
     - Phone (Rich Text)
     - Source (Rich Text)
     - Status (Select: Pending, Verified, Rejected)
   - Get API key from Notion integrations
   - Add database ID to environment variables

## Features

- ✅ Bot protection with Cloudflare Turnstile
- ✅ Duplicate email handling
- ✅ IP hashing for privacy
- ✅ Optional Notion sync
- ✅ Admin dashboard with search and CSV export
- ✅ Responsive design matching site theme

## Admin Access

Visit `/admin/beta` to view and manage beta signups (admin role required).

## Testing

1. Go to the About page
2. Click "Sign up for the beta test"
3. Fill out the form and complete Turnstile verification
4. Check admin dashboard for the new signup
