# Automated Demo Bots Setup - StratusConnect Aviation Platform

**FCA Compliant Aviation Platform - Automated Proof of Life System**

This guide sets up automated demo bots that run continuously to prove the StratusConnect platform works in reality. The system creates believable simulations that post requests, send quotes, accept assignments, and log every step with video recordings and audit trails.

## 🎯 Overview

The automated demo system includes:

- **GitHub Actions Workflows** - Automated testing on schedule and PR events
- **Windows Task Scheduler** - Local automated execution
- **Playwright Test Suite** - Realistic user behavior simulation
- **Supabase Integration** - Event logging and audit trails
- **Video Recording** - Proof of life documentation

## 🚀 Quick Start

### 1. Environment Setup

Run the environment setup script:

```powershell
# Run as Administrator for system-wide environment variables
.\scripts\setup-demo-environment.ps1
```

Or set manually:

```powershell
$env:STRATUS_URL = "http://localhost:8080"
$env:SUPABASE_EVENTS_URL = "https://your-project.functions.supabase.co/events-recorder"
$env:SUPABASE_URL = "https://your-project.supabase.co"
$env:SUPABASE_SERVICE_ROLE_KEY = "your-service-role-key"
```

### 2. Database Setup

Apply the demo schema and seed data:

```sql
-- Apply schema
\i demo-bots/supabase/schema_demo.sql

-- Apply seed data
\i demo-bots/supabase/seed_demo.sql
```

### 3. Deploy Edge Function

```bash
cd demo-bots/edge/events-recorder
supabase functions deploy events-recorder
```

### 4. Test the Setup

```powershell
# Run a test to verify everything works
.\scripts\run-demo-bots.ps1 video
```

## 🔄 Automated Execution

### GitHub Actions (Recommended)

The system includes two GitHub Actions workflows:

1. **Hourly Demo Bots** (`.github/workflows/demo-bots.yml`)
   - Runs every 2 hours during business hours (8 AM - 6 PM, Monday-Friday)
   - Triggered on PR events
   - Uploads test results and videos as artifacts

2. **Nightly Full Test Suite** (`.github/workflows/demo-bots-nightly.yml`)
   - Runs daily at 2 AM UTC
   - Comprehensive test suite
   - Long-term artifact storage

**Required GitHub Secrets:**
- `STRATUS_URL`
- `SUPABASE_EVENTS_URL`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

### Windows Task Scheduler

For local automated execution:

```powershell
# Run as Administrator to create system tasks
.\scripts\setup-demo-scheduler.ps1
```

This creates three scheduled tasks:
- **Hourly**: Every 2 hours during business hours
- **Daily**: Daily at 2:00 AM
- **Weekly**: Weekly on Monday at 9:00 AM

To remove scheduled tasks:
```powershell
.\scripts\setup-demo-scheduler.ps1 -Remove
```

## 🎭 Demo Personas

The system uses realistic personas for testing:

- **Ethan Broker** - Fast typer, confident, follows up
- **Amelia Operator** - Methodical, detailed, patient  
- **Sam Pilot** - Quick decisions, efficient, direct
- **Nadia Crew** - Balanced approach, thorough

## 🧪 Test Types

Run specific test types:

```powershell
# Video recording demo (headed browser)
.\scripts\run-demo-bots.ps1 video

# Broker terminal demo
.\scripts\run-demo-bots.ps1 broker

# Operator terminal demo
.\scripts\run-demo-bots.ps1 operator

# Pilot terminal demo
.\scripts\run-demo-bots.ps1 pilot

# Full workflow demo
.\scripts\run-demo-bots.ps1 full

# All demos
.\scripts\run-demo-bots.ps1 all
```

## 📊 Monitoring & Results

### Test Results

Results are stored in:
- `demo-bots/playwright/test-results/` - Screenshots and videos
- `demo-bots/playwright/playwright-report/` - HTML reports

### Database Events

All bot actions are logged to the `demo_events` table:

```sql
SELECT 
  actor_role,
  action,
  created_at,
  payload
FROM demo_events 
ORDER BY created_at DESC;
```

### Feedback System

Session feedback and issues are logged to `demo_feedback` table.

## 🔧 Configuration

### Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `STRATUS_URL` | Beta terminal URL | `http://localhost:8080` |
| `SUPABASE_EVENTS_URL` | Edge Function URL | `https://project.functions.supabase.co/events-recorder` |
| `SUPABASE_URL` | Supabase project URL | `https://project.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |

### Playwright Configuration

Edit `demo-bots/playwright/playwright.config.ts` to adjust:
- Timeouts
- Browser settings
- Video recording options
- Reporter settings

## 🛠️ Troubleshooting

### Common Issues

1. **Login Failures**
   - Check demo user credentials in `demo-bots/supabase/seed_demo.sql`
   - Verify user accounts exist and are marked `is_demo = true`

2. **Selector Not Found**
   - Update selectors in state machine files
   - Check if UI elements have changed

3. **Event Recording Fails**
   - Verify Edge Function URL is correct
   - Check Supabase service role key permissions

4. **Tests Timeout**
   - Increase timeout in `playwright.config.ts`
   - Check if application is running and accessible

### Debug Mode

Run with debug output:

```bash
DEBUG=pw:api npx playwright test
```

### Manual Testing

Test individual components:

```powershell
# Test environment setup
.\scripts\test-demos.js

# Test Edge Function
curl -X POST $env:SUPABASE_EVENTS_URL \
  -H "Content-Type: application/json" \
  -d '{"actor_role":"test","action":"manual_test"}'

# Test Playwright setup
cd demo-bots/playwright
npx playwright test --list
```

## 📈 Performance

### Optimization

- Tests run in parallel where possible
- Videos only recorded for failed tests
- Screenshots only on failure
- Configurable timeouts and delays

### Resource Usage

- Browser instances are properly cleaned up
- Videos are compressed and stored efficiently
- Database queries are optimized with indexes
- Rate limiting prevents system overload

## 🔒 Security

### Demo Data Isolation

- Demo users marked with `is_demo = true`
- Service role only access to demo tables
- No public read access to demo data
- Rate limited bot activity

### Access Control

- Edge Functions use service role authentication
- Demo tables have row-level security policies
- No sensitive data in demo scenarios
- Audit trail for all bot actions

## 📋 Maintenance

### Regular Tasks

1. **Weekly**: Review test results and update selectors if UI changes
2. **Monthly**: Clean up old test artifacts and videos
3. **Quarterly**: Update demo personas and scenarios
4. **As Needed**: Update Playwright and dependencies

### Monitoring

- Check GitHub Actions workflow status
- Monitor Supabase function execution logs
- Review demo_events table for anomalies
- Watch for test failures and investigate

## 🎯 Success Metrics

### Key Performance Indicators

- **Uptime**: >99% test execution success rate
- **Coverage**: All major user journeys tested
- **Performance**: Tests complete within 5 minutes
- **Reliability**: Consistent event logging and video recording

### Proof of Life Indicators

- ✅ Broker posting RFQs successfully
- ✅ Operator sending quotes
- ✅ Pilot accepting assignments
- ✅ Deals marked as confirmed
- ✅ Events logged to database
- ✅ Videos recorded for failed runs

## 🚀 Next Steps

1. **Scale Testing**: Add more complex scenarios and edge cases
2. **Performance Testing**: Load testing with multiple concurrent bots
3. **Mobile Testing**: Add mobile device simulation
4. **Integration Testing**: Test with real external services
5. **Analytics**: Add detailed performance metrics and reporting

---

**When the lion is hungry, he eats. 🦁**

*This automated demo system provides continuous proof that StratusConnect works in reality, with believable simulations that demonstrate the platform's capabilities to stakeholders and regulators.*
