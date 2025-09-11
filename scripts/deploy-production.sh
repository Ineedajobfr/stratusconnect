#!/bin/bash

# StratusConnect Production Deployment Script
# FCA Compliant Aviation Platform

set -e

echo "🚀 Starting StratusConnect Production Deployment"
echo "================================================"

# Check if we're in demo mode
if [ "$VITE_SC_DEMO_MODE" = "true" ]; then
    echo "❌ ERROR: Cannot deploy in demo mode!"
    echo "Set VITE_SC_DEMO_MODE=false before deploying"
    exit 1
fi

# Check required environment variables
echo "🔍 Checking environment variables..."

required_vars=(
    "VITE_STRIPE_PUBLIC_KEY"
    "STRIPE_SECRET_KEY"
    "STRIPE_WEBHOOK_SECRET"
    "VITE_SUPABASE_URL"
    "VITE_SUPABASE_ANON_KEY"
    "SUPABASE_SERVICE_ROLE"
    "UPTIMEROBOT_API_KEY"
)

for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        echo "❌ ERROR: Required environment variable $var is not set"
        exit 1
    fi
done

echo "✅ All required environment variables are set"

# Run database migrations
echo "🗄️  Running database migrations..."
npx supabase db push

# Build the application
echo "🏗️  Building application..."
npm run build

# Run production tests
echo "🧪 Running production tests..."
npm run test:production || {
    echo "❌ Production tests failed!"
    exit 1
}

# Check build output
if [ ! -d "dist" ]; then
    echo "❌ ERROR: Build failed - dist directory not found"
    exit 1
fi

echo "✅ Build completed successfully"

# Verify critical files
echo "🔍 Verifying critical files..."

critical_files=(
    "dist/index.html"
    "dist/assets"
)

for file in "${critical_files[@]}"; do
    if [ ! -e "$file" ]; then
        echo "❌ ERROR: Critical file $file not found in build"
        exit 1
    fi
done

echo "✅ All critical files present"

# Security checks
echo "🔒 Running security checks..."

# Check for hardcoded secrets
if grep -r "sk_live_" dist/; then
    echo "❌ ERROR: Hardcoded Stripe secret key found in build!"
    exit 1
fi

if grep -r "pk_live_" dist/; then
    echo "❌ ERROR: Hardcoded Stripe publishable key found in build!"
    exit 1
fi

echo "✅ Security checks passed"

# Generate deployment manifest
echo "📋 Generating deployment manifest..."
cat > dist/deployment-manifest.json << EOF
{
  "version": "1.0.0",
  "deployed_at": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "environment": "production",
  "features": {
    "stripe_connect": true,
    "kyc_verification": true,
    "sanctions_screening": true,
    "audit_logging": true,
    "dsar_workflow": true,
    "real_time_monitoring": true
  },
  "compliance": {
    "fca_compliant": true,
    "gdpr_ready": true,
    "audit_trail": true
  }
}
EOF

echo "✅ Deployment manifest generated"

# Final verification
echo "🔍 Final verification..."

# Check that demo mode is disabled
if grep -r "VITE_SC_DEMO_MODE.*true" dist/; then
    echo "❌ ERROR: Demo mode is still enabled in build!"
    exit 1
fi

echo "✅ Demo mode properly disabled"

# Success message
echo ""
echo "🎉 Production deployment ready!"
echo "==============================="
echo ""
echo "📁 Build directory: dist/"
echo "🌐 Deploy to: https://stratusconnect.com"
echo "📊 Status page: https://status.stratusconnect.com"
echo ""
echo "🔧 Next steps:"
echo "1. Deploy dist/ to your hosting provider"
echo "2. Configure webhook endpoints"
echo "3. Set up UptimeRobot monitoring"
echo "4. Run smoke tests"
echo "5. Update DNS records"
echo ""
echo "⚡ StratusConnect is ready for takeoff!"
echo ""
echo "There can be no doubt. When the lion is hungry, he eats. 🦁"
