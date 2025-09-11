# StratusConnect Production Setup Guide

## Environment Variables

Set these environment variables in your production environment (Netlify, Vercel, etc.):

```bash
# Demo Mode - MUST be false in production
VITE_SC_DEMO_MODE=false

# Stripe Connect Production Keys
VITE_STRIPE_PUBLIC_KEY=pk_live_your_production_publishable_key
STRIPE_SECRET_KEY=sk_live_your_production_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_production_webhook_secret

# Supabase Production
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_production_anon_key
SUPABASE_SERVICE_ROLE=your_production_service_role_key

# UptimeRobot Production
UPTIMEROBOT_API_KEY=your_production_uptimerobot_key

# App Configuration
VITE_APP_BASE_URL=https://stratusconnect.com
VITE_STATUS_PAGE_URL=https://status.stratusconnect.com

# Security
VITE_ENABLE_MFA=true
VITE_REQUIRE_KYC=true
VITE_SANCTIONS_SCREENING=true
```

## Stripe Connect Setup

1. **Create Stripe Connect Account**
   - Go to Stripe Dashboard > Connect
   - Create a platform account
   - Enable Standard accounts for operators
   - Set up webhook endpoints

2. **Webhook Endpoints**
   - URL: `https://stratusconnect.com/api/webhooks/stripe`
   - Events: `payment_intent.succeeded`, `payment_intent.payment_failed`, `transfer.created`, `charge.dispute.created`

3. **Fee Structure Enforcement**
   - 7% platform commission on broker-operator deals
   - 10% hiring fee on operator pilot/crew hires
   - 0% fees for pilots and crew

## Supabase Setup

1. **Run Migrations**
   ```bash
   supabase db push
   ```

2. **Enable Row Level Security**
   - All tables have RLS policies enabled
   - Users can only access their own data
   - Admins have full access

3. **Set up Backups**
   - Enable point-in-time recovery
   - Set up nightly backups
   - Test restore procedures

## UptimeRobot Setup

1. **Create Monitors**
   - Main website: `https://stratusconnect.com`
   - API health: `https://stratusconnect.com/api/health`
   - Webhook endpoint: `https://stratusconnect.com/api/webhooks/stripe`

2. **Status Page**
   - Create public status page
   - Link to footer of main site
   - Update `VITE_STATUS_PAGE_URL`

## Security Checklist

- [ ] MFA enabled for all admin accounts
- [ ] KYC verification required before payouts
- [ ] Sanctions screening enabled
- [ ] Rate limiting on all public endpoints
- [ ] File upload scanning enabled
- [ ] API keys rotated quarterly
- [ ] SSL certificates valid
- [ ] Security headers configured

## Legal Pages

Ensure these pages are published and linked:
- Terms and Conditions: `/terms`
- Privacy Notice: `/privacy`
- Cookies Policy: `/cookies`
- Service Level Agreement: `/sla`
- Security Overview: `/security`

## Smoke Tests

Run these tests after deployment:

1. **Payment Flow**
   - Create a £10,000 deal
   - Verify £700 platform fee
   - Confirm payout blocked before KYC
   - Pass KYC and release payment

2. **Hiring Flow**
   - Create £3,000 pilot hire
   - Verify £300 hiring fee
   - Confirm payment processing

3. **Status Page**
   - Create test incident
   - Verify it appears on status page
   - Close incident and verify resolution

4. **DSAR Workflow**
   - Submit data export request
   - Download JSON file
   - Verify complete data export

5. **Security Tests**
   - Try to access another user's deal
   - Verify clean denial
   - Test rate limiting

## Monitoring

- Set up alerts for failed payments
- Monitor error rates
- Track response times
- Watch for security incidents

## Support

- Document all processes
- Train support team on platform
- Create escalation procedures
- Set up incident response plan
