# Deployment Guide

This guide provides comprehensive instructions for deploying the StratusConnect platform.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Setup](#environment-setup)
- [Database Setup](#database-setup)
- [Frontend Deployment](#frontend-deployment)
- [Backend Deployment](#backend-deployment)
- [Security Configuration](#security-configuration)
- [Monitoring Setup](#monitoring-setup)
- [Troubleshooting](#troubleshooting)

## Prerequisites

### System Requirements

- **Node.js**: Version 18.x or higher
- **npm**: Version 8.x or higher
- **PostgreSQL**: Version 14.x or higher
- **Redis**: Version 6.x or higher (for caching)
- **Docker**: Version 20.x or higher (optional)
- **Git**: Version 2.x or higher

### Cloud Services

- **Supabase**: Database and authentication
- **Vercel/Netlify**: Frontend hosting
- **AWS S3/CloudFlare R2**: File storage
- **SendGrid/Mailgun**: Email services
- **Stripe**: Payment processing

## Environment Setup

### 1. Clone Repository

```bash
git clone https://github.com/your-org/stratusconnect.git
cd stratusconnect
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Create `.env.local` file:

```env
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/stratusconnect
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Authentication
JWT_SECRET=your-jwt-secret
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=https://your-domain.com

# File Storage
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-bucket-name

# Email
SENDGRID_API_KEY=your-sendgrid-key
FROM_EMAIL=noreply@your-domain.com

# Payment
STRIPE_PUBLIC_KEY=your-stripe-public-key
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret

# Monitoring
SENTRY_DSN=your-sentry-dsn
ANALYTICS_ID=your-analytics-id

# Security
ENCRYPTION_KEY=your-encryption-key
RATE_LIMIT_REDIS_URL=redis://localhost:6379
```

## Database Setup

### 1. Supabase Setup

1. Create a new Supabase project
2. Run database migrations:

```bash
npx supabase db push
```

3. Set up Row Level Security (RLS) policies
4. Configure authentication settings
5. Set up storage buckets for file uploads

### 2. Database Migrations

```bash
# Apply all migrations
npx supabase migration up

# Apply specific migration
npx supabase migration up --file 20240115000000_initial_schema.sql

# Rollback migration
npx supabase migration down --file 20240115000000_initial_schema.sql
```

### 3. Seed Data

```bash
# Run seed scripts
npm run seed

# Or manually insert test data
psql -h localhost -U postgres -d stratusconnect -f scripts/seed.sql
```

## Frontend Deployment

### 1. Build Application

```bash
# Production build
npm run build

# Development build
npm run dev
```

### 2. Vercel Deployment

1. Install Vercel CLI:

```bash
npm i -g vercel
```

2. Deploy:

```bash
vercel --prod
```

3. Configure environment variables in Vercel dashboard

### 3. Netlify Deployment

1. Build command: `npm run build`
2. Publish directory: `dist`
3. Configure environment variables in Netlify dashboard

### 4. Docker Deployment

Create `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

Build and run:

```bash
docker build -t stratusconnect .
docker run -p 3000:3000 stratusconnect
```

## Backend Deployment

### 1. Supabase Functions

Deploy Edge Functions:

```bash
# Deploy all functions
npx supabase functions deploy

# Deploy specific function
npx supabase functions deploy auth-handler
```

### 2. API Routes

Configure API routes in `src/pages/api/`:

- Authentication endpoints
- Job board endpoints
- Contract generation
- Document management
- Analytics endpoints

### 3. Webhook Configuration

Set up webhooks for:

- Stripe payments
- Email notifications
- Security events
- User activity

## Security Configuration

### 1. SSL/TLS

- Configure SSL certificates
- Enable HTTPS redirects
- Set up HSTS headers

### 2. CORS Configuration

```typescript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: 'https://your-domain.com' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ]
  },
}
```

### 3. Rate Limiting

Configure rate limiting:

```typescript
// middleware/rate-limit.ts
import { NextRequest, NextResponse } from 'next/server'

const rateLimit = new Map()

export function middleware(request: NextRequest) {
  const ip = request.ip ?? '127.0.0.1'
  const limit = 100
  const windowMs = 15 * 60 * 1000 // 15 minutes

  if (!rateLimit.has(ip)) {
    rateLimit.set(ip, { count: 1, resetTime: Date.now() + windowMs })
  } else {
    const data = rateLimit.get(ip)
    if (Date.now() > data.resetTime) {
      data.count = 1
      data.resetTime = Date.now() + windowMs
    } else {
      data.count++
      if (data.count > limit) {
        return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })
      }
    }
  }

  return NextResponse.next()
}
```

### 4. Content Security Policy

```typescript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.stripe.com;"
          },
        ],
      },
    ]
  },
}
```

## Monitoring Setup

### 1. Error Tracking

Configure Sentry:

```typescript
// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
})
```

### 2. Analytics

Configure analytics:

```typescript
// lib/analytics.ts
import { Analytics } from '@vercel/analytics/react'

export function trackEvent(event: string, properties?: Record<string, any>) {
  Analytics.track(event, properties)
}
```

### 3. Logging

Set up structured logging:

```typescript
// lib/logger.ts
import winston from 'winston'

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
})

export default logger
```

### 4. Health Checks

Create health check endpoints:

```typescript
// pages/api/health.ts
export default function handler(req, res) {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.npm_package_version,
  })
}
```

## Performance Optimization

### 1. Caching

Configure Redis caching:

```typescript
// lib/redis.ts
import Redis from 'ioredis'

const redis = new Redis(process.env.REDIS_URL)

export async function getCached(key: string) {
  const cached = await redis.get(key)
  return cached ? JSON.parse(cached) : null
}

export async function setCache(key: string, value: any, ttl = 3600) {
  await redis.setex(key, ttl, JSON.stringify(value))
}
```

### 2. Image Optimization

Configure Next.js image optimization:

```typescript
// next.config.js
module.exports = {
  images: {
    domains: ['your-domain.com', 'storage.googleapis.com'],
    formats: ['image/webp', 'image/avif'],
  },
}
```

### 3. Bundle Optimization

Analyze bundle size:

```bash
npm run analyze
```

## Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - Check database URL
   - Verify network connectivity
   - Check firewall settings

2. **Authentication Issues**
   - Verify JWT secret
   - Check token expiration
   - Validate user permissions

3. **File Upload Errors**
   - Check storage credentials
   - Verify file size limits
   - Check CORS configuration

4. **Performance Issues**
   - Monitor database queries
   - Check cache hit rates
   - Analyze bundle size

### Debug Mode

Enable debug logging:

```env
DEBUG=*
NODE_ENV=development
```

### Logs

Check application logs:

```bash
# Vercel logs
vercel logs

# Docker logs
docker logs container-name

# PM2 logs
pm2 logs stratusconnect
```

## Backup and Recovery

### 1. Database Backups

```bash
# Create backup
pg_dump -h localhost -U postgres stratusconnect > backup.sql

# Restore backup
psql -h localhost -U postgres stratusconnect < backup.sql
```

### 2. File Storage Backups

Configure automated backups for S3:

```bash
aws s3 sync s3://your-bucket s3://your-backup-bucket
```

### 3. Configuration Backups

Backup environment variables and configuration files:

```bash
# Backup environment
cp .env.local .env.local.backup

# Backup configuration
tar -czf config-backup.tar.gz config/
```

## Scaling

### 1. Horizontal Scaling

- Use load balancers
- Implement database read replicas
- Cache frequently accessed data

### 2. Vertical Scaling

- Increase server resources
- Optimize database queries
- Implement connection pooling

### 3. CDN Configuration

- Configure CloudFlare or AWS CloudFront
- Cache static assets
- Optimize image delivery

## Maintenance

### 1. Regular Updates

- Update dependencies monthly
- Apply security patches immediately
- Monitor for breaking changes

### 2. Database Maintenance

- Run VACUUM and ANALYZE regularly
- Monitor query performance
- Clean up old data

### 3. Security Audits

- Regular security scans
- Penetration testing
- Code reviews

## Support

For deployment issues:

1. Check the troubleshooting section
2. Review application logs
3. Contact the development team
4. Create a GitHub issue

## Conclusion

This deployment guide provides comprehensive instructions for deploying the StratusConnect platform. Follow these steps carefully and refer to the troubleshooting section if you encounter any issues.

For additional support or questions, please contact the development team.
