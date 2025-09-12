# StratusConnect Gamification System

A Duolingo-style competitive league system that rewards performance, reliability, and compliance in the aviation marketplace.

## Overview

The gamification system replaces traditional pricing tiers with a merit-based league system that encourages:
- **Speed**: Fast responses and quick deal completion
- **Reliability**: On-time performance and dispute-free transactions  
- **Compliance**: Up-to-date credentials and proper documentation
- **Quality**: High completion rates and customer satisfaction

## League Structure

### Leagues (Bronze → Diamond)
1. **Bronze League** - Getting started (0+ points)
2. **Silver League** - Proven reliability (100+ points)
3. **Gold League** - Elite performer (250+ points)
4. **Platinum League** - Top-tier professional (500+ points)
5. **Emerald League** - Outstanding reputation (750+ points)
6. **Diamond League** - Legendary status (1000+ points)

### Weekly Seasons
- Each week is a new competitive season
- Points reset to 0 at season start
- Top 20% promoted, bottom 20% demoted
- Rankings updated in real-time

## XP Events & Points

| Event | Points | Description |
|-------|--------|-------------|
| `rfq_posted` | 5 | Broker posts a new RFQ |
| `quote_submitted_fast` | 15 | Operator responds within 5 minutes |
| `quote_accepted` | 25 | Quote is accepted by broker |
| `deal_completed_on_time` | 40 | Deal completed on schedule |
| `dispute_free_deal` | 20 | Deal closed without disputes |
| `kyc_completed` | 10 | User completes KYC verification |
| `credentials_up_to_date` | 10 | User updates credentials |
| `saved_search_hit_response` | 10 | Quick response to saved search alert |
| `fallthrough_recovered` | 30 | Successfully recover a fallthrough |
| `community_helpful` | 10 | Admin-awarded for helpful behavior |

## Database Schema

### Core Tables
- `sc_leagues` - League definitions and colors
- `sc_seasons` - Weekly season periods
- `sc_league_members` - User membership per season
- `sc_xp_events` - All XP-earning events (append-only)
- `sc_badges` - Achievement badges
- `sc_user_badges` - User badge assignments

### Key Features
- Row Level Security (RLS) for data protection
- Atomic point increments via RPC functions
- Real-time leaderboard views
- Automatic season management

## Implementation

### 1. Database Setup
```sql
-- Run the migration
\i supabase/migrations/20241220_gamification.sql
```

### 2. Server Functions
```typescript
import { recordXpEvent } from '@/lib/gamification';

// Award XP for user actions
await recordXpEvent({
  userId: 'user-123',
  type: 'quote_submitted_fast',
  meta: { quoteId: 'quote-456', responseTimeMs: 120000 }
});
```

### 3. UI Components
```tsx
import LeagueBadge from '@/components/league/LeagueBadge';
import WeeklyLeaderboard from '@/components/league/WeeklyLeaderboard';
import WeeklyChallenges from '@/components/league/WeeklyChallenges';
```

## Integration Points

### Broker Actions
- Post RFQ → `rfq_posted` (5 pts)
- Quick saved search response → `saved_search_hit_response` (10 pts)
- Accept quote → `quote_accepted` (25 pts)

### Operator Actions  
- Fast quote submission → `quote_submitted_fast` (15 pts)
- On-time deal completion → `deal_completed_on_time` (40 pts)
- Dispute-free deal → `dispute_free_deal` (20 pts)

### System Actions
- KYC completion → `kyc_completed` (10 pts)
- Credential updates → `credentials_up_to_date` (10 pts)
- Fallthrough recovery → `fallthrough_recovered` (30 pts)

## UI Features

### League Status Card
- Current league and points
- Progress to next league
- Weekly rank position

### Weekly Challenges
- 5 rotating challenges per week
- Clear point values and descriptions
- Visual completion tracking

### Leaderboard
- Top 30 users globally
- Real-time updates
- League badges and rankings

### Activity Feed
- Recent XP events
- Point awards and timestamps
- Achievement notifications

## Compliance & Safety

### Never Gamified
- Risk-taking behavior
- Safety shortcuts
- Compliance violations
- Financial manipulation

### Always Rewarded
- Speed within safe parameters
- Reliability and consistency
- Quality service delivery
- Proper documentation

## Season Management

### Weekly Rollover (Sundays 00:00 UTC)
1. Calculate final rankings
2. Promote top 20% to next league
3. Demote bottom 20% to previous league
4. Reset all points to 0
5. Create new season
6. Maintain league assignments

### Automated via Supabase Edge Function
```typescript
// supabase/functions/season-roll/index.ts
import { closeSeasonAndRoll } from '../../src/lib/gamification.ts';

Deno.serve(async () => {
  try {
    await closeSeasonAndRoll();
    return new Response("Season rolled successfully");
  } catch (e) {
    return new Response(String(e), { status: 500 });
  }
});
```

## Benefits & Perks

### League Benefits
- **Bronze**: Basic marketplace access, standard support
- **Silver**: Priority support, advanced analytics, badge verification
- **Gold**: VIP support, real-time analytics, premium features
- **Platinum**: Dedicated account manager, custom analytics, first access
- **Emerald**: White-glove service, custom integrations, industry recognition
- **Diamond**: All features, mentorship opportunities, legendary status

### Competitive Advantages
- Higher search ranking
- Early access to opportunities
- Priority support channels
- Exclusive features and tools
- Industry recognition and badges

## Monitoring & Analytics

### Key Metrics
- User engagement and retention
- League distribution and movement
- XP event frequency and patterns
- Challenge completion rates
- Season-over-season growth

### Admin Tools
- Real-time leaderboard monitoring
- XP event audit logs
- League promotion/demotion tracking
- User behavior analytics
- System performance metrics

## Future Enhancements

### Planned Features
- Team-based competitions
- Seasonal tournaments
- Custom achievement badges
- Social features and sharing
- Mobile push notifications
- Advanced analytics dashboard

### Integration Opportunities
- CRM system integration
- Email marketing campaigns
- Customer success metrics
- Performance reporting
- Compliance monitoring

## Getting Started

1. **Run the migration** to set up database tables
2. **Import the components** into your pages
3. **Add XP events** to your existing user actions
4. **Configure the season rollover** function
5. **Customize the UI** to match your brand

The system is designed to be drop-in compatible with existing StratusConnect functionality while adding engaging competitive elements that drive the behaviors you want to encourage.

---

*Built for the aviation industry. Rewarding excellence, promoting safety, driving performance.*
