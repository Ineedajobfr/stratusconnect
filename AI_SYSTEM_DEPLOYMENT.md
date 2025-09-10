# AI Co-Developer System Deployment Guide

## Overview
This AI system provides multiple specialized agents that monitor, analyze, and improve your Stratus Connect platform in real-time.

## Architecture
- **Frontend**: React/TypeScript with event emission
- **Backend**: Netlify Functions + Supabase Edge Functions
- **Database**: Supabase Postgres with RLS
- **AI**: OpenAI GPT-4o-mini for analysis
- **Monitoring**: Real-time agent reports dashboard

## Agents Included

### 1. Code Reviewer
- **Trigger**: GitHub webhook on PR events
- **Function**: `netlify/functions/github_webhook.ts`
- **Purpose**: Reviews code changes for bugs, security issues, performance problems

### 2. Security Sentry
- **Trigger**: Every 5 minutes
- **Function**: `netlify/functions/scheduled_security_sentry.ts`
- **Purpose**: Monitors for suspicious user behavior and security threats

### 3. Performance Scout
- **Trigger**: Every hour
- **Function**: `netlify/functions/scheduled_perf_scout.ts`
- **Purpose**: Identifies slow queries, pages, and performance bottlenecks

### 4. Data Janitor
- **Trigger**: Background function
- **Function**: `netlify/functions/background_event_compaction.ts`
- **Purpose**: Cleans up old events and maintains database performance

## Deployment Steps

### 1. Database Setup
```bash
# Run the migration in Supabase
supabase db push
```

### 2. Deploy Supabase Edge Function
```bash
# Deploy the Policy Gateway
supabase functions deploy policy_gateway_apply_patch
```

### 3. Set Environment Variables on Netlify
```bash
# Required environment variables
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE=your_service_role_key
OPENAI_API_KEY=your_openai_key
GITHUB_TOKEN=your_github_token
GITHUB_WEBHOOK_SECRET=your_webhook_secret
```

### 4. Deploy to Netlify
```bash
# Deploy the site
netlify deploy --prod
```

### 5. Configure GitHub Webhook
1. Go to your GitHub repository settings
2. Add webhook: `https://your-site.netlify.app/api/github-webhook`
3. Set secret to match `GITHUB_WEBHOOK_SECRET`
4. Select "Pull request" events

### 6. Access Admin Dashboard
Visit `/admin/ai-reports` to see real-time agent reports.

## Event Emission

The system automatically emits events from key user actions:

```typescript
import { Events } from '@/lib/events';

// Login events
Events.login(userId, 'email');

// Marketplace events
Events.requestCreated(requestId, userId, details);
Events.bidPlaced(bidId, userId, amount);
Events.dealClosed(dealId, brokerId, operatorId, amount);

// Performance events
Events.pageView(route, ttfbMs, loadTimeMs);
Events.apiTrace(endpoint, method, durationMs, statusCode);
```

## Security Features

- **RLS Policies**: All database access is protected
- **Policy Gateway**: AI actions must be approved
- **Edge Guard**: Blocks malicious requests
- **Audit Trail**: All agent actions are logged

## Monitoring

### Real-time Dashboard
- View agent reports at `/admin/ai-reports`
- See security alerts, performance issues, code reviews
- Monitor system health and AI suggestions

### Database Tables
- `events`: All platform activity
- `agent_reports`: AI findings and recommendations
- `agent_actions`: Proposed changes (require approval)
- `feature_flags`: AI-controlled feature toggles

## Cost Optimization

- **Netlify Functions**: Generous free tier, scale as needed
- **Supabase**: Pro tier recommended for production
- **OpenAI**: Use GPT-4o-mini for cost efficiency
- **Event Storage**: Automatic cleanup of old events

## Next Steps

1. **Deploy the system** following the steps above
2. **Monitor agent reports** for the first few days
3. **Add more event emission** to key user flows
4. **Expand agents** with Trust & Safety, UX Noticer
5. **Enable auto-patches** for low-risk changes

## Troubleshooting

### Common Issues
- **Webhook not working**: Check GitHub secret matches
- **Agents not running**: Verify Netlify environment variables
- **No reports**: Check if events are being emitted
- **Permission errors**: Verify RLS policies are correct

### Debug Commands
```bash
# Check Netlify function logs
netlify functions:list
netlify functions:invoke scheduled_security_sentry

# Check Supabase logs
supabase functions logs policy_gateway_apply_patch
```

## Support

The AI system is designed to be self-monitoring and self-improving. The agents will learn from your platform's patterns and provide increasingly valuable insights over time.

**Remember**: This is your fortress. The AI works for you, not against you. Every action is audited, every change is controlled, and every decision is yours to make.
