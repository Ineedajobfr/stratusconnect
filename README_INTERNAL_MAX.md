# Internal Max - Systems Operator Documentation

## Overview

Max has been transformed from a user-facing chatbot into an internal systems operator that works exclusively for Admin users. Max monitors platform events, enforces trust and compliance, surfaces risks and opportunities, and prepares actions for Admin approval.

## Architecture

### Core Components

1. **Event Bus** (`internal_max.event_bus`)
   - Captures all platform events in real-time
   - Status tracking (pending/processed)
   - Actor identification and payload storage

2. **Rules Engine** (`max-worker` Edge Function)
   - Processes events every minute via cron
   - Applies security and business rules
   - Generates findings and tasks

3. **Findings System** (`internal_max.findings`)
   - Security alerts and compliance issues
   - Severity levels: info, warn, high, critical
   - Status tracking (open/resolved)

4. **Task Management** (`internal_max.tasks`)
   - Admin action items
   - Suggested actions for approval
   - Status workflow (open/in_progress/done)

5. **Admin Console** (`/admin/max`)
   - Private Admin-only interface
   - Real-time monitoring dashboard
   - Action approval workflows

## Event Model

### Supported Events

| Event Type | Description | Trigger |
|------------|-------------|---------|
| `rfq.created` | New RFQ submitted | Broker creates RFQ |
| `rfq.updated` | RFQ modified | Broker updates RFQ |
| `quote.submitted` | Operator submits quote | Operator responds to RFQ |
| `quote.expired` | Quote expires | Quote timeout reached |
| `deal.created` | Deal initiated | Broker selects quote |
| `deal.accepted` | Deal confirmed | Operator accepts deal |
| `deal.cancelled` | Deal cancelled | Either party cancels |
| `user.signup` | New user registration | User creates account |
| `verification.submitted` | KYC documents submitted | User uploads docs |
| `verification.failed` | KYC verification failed | Documents rejected |
| `sanctions.screened` | User screened for sanctions | Background check |
| `sanctions.match` | Sanctions match found | High-risk user detected |
| `aircraft.availability.updated` | Aircraft schedule changed | Operator updates fleet |
| `message.sent` | Private message sent | User sends message |
| `contact.requested` | Contact info request | Broker requests operator contact |
| `payment.intent.created` | Payment initiated | User starts payment |
| `payment.succeeded` | Payment completed | Payment processed |
| `payment.failed` | Payment failed | Payment error |

### Event Structure

```typescript
interface Event {
  id: string;
  occurred_at: string;
  type: string;
  actor_user_id: string | null;
  payload: any;
  status: 'pending' | 'processed';
}
```

## Rules Engine

### Core Rules

#### 1. Guard Rules
- **Contact Leak Detection**: Flags messages containing phone/email before deal acceptance
- **Undercut Attempts**: Detects suspicious pricing patterns
- **Duplicate Accounts**: Identifies potential duplicate registrations
- **Document Mismatches**: Flags inconsistent KYC documents

#### 2. Analyst Rules
- **Price Outlier Detection**: Flags quotes >2 standard deviations from median
- **Empty Leg Discovery**: Identifies positioning opportunities
- **SLA Monitoring**: Tracks operator response times
- **Supply/Demand Analysis**: Market intelligence per route

#### 3. Router Rules
- **Operator Recommendations**: Suggests optimal operators for RFQs
- **Soft Nudges**: Recommends actions like "Invite Top Three"
- **Route Optimization**: Identifies efficient aircraft positioning

#### 4. Clerk Rules
- **Compliance Pack Generation**: Weekly audit reports
- **Daily Digest**: Admin summary with incidents and wins
- **Document Management**: Tracks signed receipts and PDFs

## Data Model

### Tables

#### `internal_max.event_bus`
```sql
CREATE TABLE internal_max.event_bus (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    type TEXT NOT NULL,
    actor_user_id UUID REFERENCES auth.users(id),
    payload JSONB NOT NULL DEFAULT '{}',
    status TEXT NOT NULL DEFAULT 'pending',
    processed_at TIMESTAMPTZ
);
```

#### `internal_max.findings`
```sql
CREATE TABLE internal_max.findings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    severity TEXT NOT NULL CHECK (severity IN ('info', 'warn', 'high', 'critical')),
    event_id UUID REFERENCES internal_max.event_bus(id),
    label TEXT NOT NULL,
    details JSONB NOT NULL DEFAULT '{}',
    status TEXT NOT NULL DEFAULT 'open',
    linked_object_type TEXT,
    linked_object_id UUID
);
```

#### `internal_max.tasks`
```sql
CREATE TABLE internal_max.tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    kind TEXT NOT NULL CHECK (kind IN ('alert', 'review', 'enrich', 'generate_report', 'route')),
    summary TEXT NOT NULL,
    suggested_action JSONB NOT NULL DEFAULT '{}',
    assignee TEXT NOT NULL DEFAULT 'admin',
    status TEXT NOT NULL DEFAULT 'open',
    due_at TIMESTAMPTZ
);
```

## Processing Loop

### Edge Function: `max-worker`

**Trigger**: Cron job every minute
**Process**:
1. Fetch up to 50 pending events
2. Apply rules engine to each event
3. Generate findings and tasks
4. Mark events as processed
5. Log all actions

### Rules Engine Implementation

```typescript
class MaxRulesEngine {
  async processEvent(event: Event): Promise<{findings: Finding[], tasks: Task[]}> {
    const findings = [];
    const tasks = [];

    // Apply each rule
    if (event.type === 'message.sent') {
      const contactLeak = this.detectContactLeak(event.payload.content);
      if (contactLeak) {
        findings.push({ /* contact leak finding */ });
        tasks.push({ /* review task */ });
      }
    }

    // ... other rules

    return { findings, tasks };
  }
}
```

## Admin Console

### Access
- **URL**: `/admin/max`
- **Authentication**: Admin role required
- **RLS**: Restricted to admin users only

### Features

#### Dashboard
- Real-time event statistics
- Pending events counter
- Critical findings alerts
- Task completion metrics

#### Events Tab
- Live event stream
- Filter by type/status
- Event payload inspection
- Processing status tracking

#### Findings Tab
- Security alerts by severity
- Compliance issues
- One-click resolution
- Detailed investigation data

#### Tasks Tab
- Admin action items
- Approve/dismiss workflow
- Suggested action execution
- Due date tracking

#### Reports Tab
- Weekly compliance packs
- Daily digest downloads
- Audit trail exports
- Performance metrics

## Security & Privacy

### Access Control
- **Admin Only**: All Max data restricted to admin users
- **RLS Policies**: Database-level security
- **Service Role**: Edge function uses service key
- **Audit Logging**: All Max actions logged

### Data Protection
- **No Raw PII**: Max never stores identification documents
- **Encrypted Storage**: All data encrypted at rest
- **Audit Trail**: Complete action logging
- **Immutable Records**: Findings and tasks are immutable

### Compliance
- **GDPR Compliant**: No personal data storage
- **SOC 2 Ready**: Audit trail and controls
- **Financial Regulations**: Compliance monitoring
- **Data Retention**: Automatic cleanup of old data

## Performance & Monitoring

### KPIs Tracked
- Time to detect contact leaks
- RFQ to quote rate improvement
- Price outlier detection accuracy
- Sanctions false positive rate
- Admin workload reduction

### Monitoring
- Event processing latency
- Rules engine performance
- Database query optimization
- Edge function health checks

### Alerting
- Critical findings push notifications
- Admin console banners
- Email stubs for integration
- Performance degradation alerts

## Development & Extension

### Adding New Rules

1. **Define Event**: Add new event type to instrumentation
2. **Implement Rule**: Add logic to `MaxRulesEngine`
3. **Test Rule**: Unit tests for rule behavior
4. **Deploy**: Update Edge function
5. **Monitor**: Track rule performance and accuracy

### Adding New Events

1. **Instrument Platform**: Add event publishing to relevant code
2. **Update Types**: Add event type to TypeScript definitions
3. **Test Publishing**: Verify events reach event bus
4. **Monitor Processing**: Ensure rules handle new events

### Custom Models

Future extension points:
- Operator acceptance probability
- Undercut behavior prediction
- RFQ success factors analysis
- Market trend forecasting

## Deployment

### Prerequisites
- Supabase project with Edge Functions enabled
- pg_cron extension enabled (for automatic processing)
- Admin users configured with proper roles

### Setup Steps

1. **Run Migrations**:
   ```bash
   supabase db push
   ```

2. **Deploy Edge Function**:
   ```bash
   supabase functions deploy max-worker
   ```

3. **Configure Environment**:
   - Set up service role key
   - Configure cron triggers
   - Test event publishing

4. **Access Admin Console**:
   - Navigate to `/admin/max`
   - Verify admin access
   - Test event processing

### Maintenance

- **Daily**: Monitor processing health
- **Weekly**: Review findings and tasks
- **Monthly**: Analyze performance metrics
- **Quarterly**: Update rules and thresholds

## Troubleshooting

### Common Issues

#### Events Not Processing
- Check Edge function logs
- Verify cron job status
- Confirm database connectivity
- Review event bus status

#### High False Positive Rate
- Adjust rule thresholds
- Review rule logic
- Update training data
- Implement circuit breakers

#### Performance Issues
- Optimize database queries
- Increase Edge function timeout
- Implement event batching
- Review index usage

### Debug Tools

- **Admin Console**: Real-time monitoring
- **Edge Function Logs**: Processing details
- **Database Queries**: Direct data inspection
- **Performance Views**: Worker health metrics

## Future Enhancements

### Planned Features
- Machine learning models for prediction
- Advanced analytics dashboard
- Automated compliance reporting
- Integration with external systems

### Scalability
- Horizontal scaling of Edge functions
- Database partitioning for large datasets
- Caching layer for frequent queries
- Event streaming for real-time processing

---

**Max is now a silent, powerful guardian of the StratusConnect platform - monitoring, analyzing, and protecting the marketplace while providing Admin with actionable intelligence and automated compliance.** 🛡️
