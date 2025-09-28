# Demo Bots System - Beta Terminal Testing

**FCA Compliant Aviation Platform - Proof of Life System**

This system creates believable simulations that prove Stratus Connect works in reality. Bots act like humans, run daily, post requests, send quotes, accept assignments, and log every step. We capture event data and produce video and reports.

## 🎯 Mission

Create a running loop that shows:
- Broker posting an RFQ
- Operator quoting
- Pilot accepting assignment
- Deal marked confirmed

## 📊 Outcomes

- Time-stamped events in Supabase with clean audit trail
- Playwright videos and HTML reports from runs
- GitHub Actions running sessions through the day on Europe/London time
- Proof of life for the beta terminal system

## 🏗️ Architecture

```
/demo-bots
  /playwright          # Playwright test suite
  /supabase           # Database schema and seeds
  /edge               # Supabase Edge Functions
  .github/workflows   # GitHub Actions scheduler
```

## 🚀 Quick Start

### 1. Setup Database

```bash
# Apply schema and seeds
psql "$SUPABASE_DB_URL" -f demo-bots/supabase/schema_demo.sql
psql "$SUPABASE_DB_URL" -f demo-bots/supabase/seed_demo.sql
```

### 2. Deploy Edge Function

```bash
cd demo-bots/edge/events-recorder
supabase functions deploy events-recorder
```

### 3. Run Locally

```bash
# Set environment variables
export STRATUS_URL="http://localhost:8086"
export SUPABASE_EVENTS_URL="https://<project>.functions.supabase.co/events-recorder"

# Run tests
cd demo-bots/playwright
npx playwright test
```

## 🎭 Personas

- **Ethan Broker** - Fast typer, confident, follows up
- **Amelia Operator** - Methodical, detailed, patient
- **Sam Pilot** - Quick decisions, efficient, direct

## 🔧 Configuration

### Environment Variables

- `STRATUS_URL` - Beta terminal URL
- `SUPABASE_EVENTS_URL` - Edge Function URL
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key

### GitHub Secrets

Add these to your repository secrets:

- `STRATUS_URL` - Beta terminal URL
- `SUPABASE_EVENTS_URL` - Edge Function URL

## 📈 Monitoring

### Events Table

All bot actions are logged to `demo_events` table:

```sql
SELECT 
  actor_role,
  action,
  created_at,
  payload
FROM demo_events 
ORDER BY created_at DESC;
```

### Feedback Table

Session feedback and issues are logged to `demo_feedback` table.

## 🎬 Videos

Failed test runs automatically generate videos stored in:
- `demo-bots/playwright/test-results/`
- GitHub Actions artifacts

## 🔒 Security

- Demo users marked with `is_demo = true`
- Service role only access to demo tables
- No public read access to demo data
- Rate limited bot activity

## 📋 Acceptance Tests

- [ ] Broker journey completes with success message
- [ ] Operator journey finds request and sends quote
- [ ] Pilot journey accepts assignment when available
- [ ] Events logged to Supabase
- [ ] Playwright reports generated
- [ ] Videos saved for failed runs

## 🛠️ Troubleshooting

### Common Issues

1. **Login failures** - Check demo user credentials
2. **Selector not found** - Update selectors in state machines
3. **Event recording fails** - Check Edge Function URL
4. **Tests timeout** - Increase timeout in playwright.config.ts

### Debug Mode

Run with debug output:

```bash
DEBUG=pw:api npx playwright test
```

## 📚 Documentation

- [Playwright Documentation](https://playwright.dev/)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)
- [GitHub Actions](https://docs.github.com/en/actions)

## 🎯 Next Steps

1. Wire selectors to live beta terminal UI
2. Test with staging environment
3. Monitor event logs
4. Generate proof of life reports
5. Scale to production monitoring

---

**When the lion is hungry, he eats. 🦁**
