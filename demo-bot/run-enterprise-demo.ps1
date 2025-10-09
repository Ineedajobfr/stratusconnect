# StratusConnect Enterprise Feature Demo Launcher
# Showcases all 8 phases of new features

Write-Host ""
Write-Host "🚀 STRATUSCONNECT - ENTERPRISE FEATURE DEMO" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host ""

# Check if dev server is running
Write-Host "🔍 Checking if dev server is running..." -ForegroundColor Yellow
$devServerRunning = $false
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8080" -Method Head -TimeoutSec 2 -ErrorAction SilentlyContinue
    if ($response.StatusCode -eq 200) {
        $devServerRunning = $true
    }
} catch {
    $devServerRunning = $false
}

if (-not $devServerRunning) {
    Write-Host "❌ Dev server is not running on port 8080" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please start the dev server first:" -ForegroundColor Yellow
    Write-Host "   npm run dev" -ForegroundColor White
    Write-Host ""
    Write-Host "Then run this demo again." -ForegroundColor Yellow
    Write-Host ""
    exit 1
}

Write-Host "✅ Dev server is running!" -ForegroundColor Green
Write-Host ""

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installing demo dependencies..." -ForegroundColor Yellow
    npm install
    Write-Host ""
}

# Create screenshots directory
if (-not (Test-Path "demo-screenshots")) {
    Write-Host "📁 Creating screenshots directory..." -ForegroundColor Yellow
    New-Item -ItemType Directory -Path "demo-screenshots" | Out-Null
    Write-Host "✅ Directory created" -ForegroundColor Green
    Write-Host ""
}

# Run the enterprise demo
Write-Host "🎬 Launching Enterprise Feature Demo..." -ForegroundColor Cyan
Write-Host ""
Write-Host "This demo will showcase:" -ForegroundColor White
Write-Host "   • Admin AI System (AI Assistant, Platform Overview, Revenue)" -ForegroundColor Gray
Write-Host "   • Enhanced Flight Map (Real-time tracking)" -ForegroundColor Gray
Write-Host "   • Door-to-Door Travel Calculator" -ForegroundColor Gray
Write-Host "   • Smart Leg Finder (AI matching)" -ForegroundColor Gray
Write-Host "   • Post-Flight Analytics" -ForegroundColor Gray
Write-Host "   • AI Crew Scheduling" -ForegroundColor Gray
Write-Host "   • Integration Hub" -ForegroundColor Gray
Write-Host "   • Shuttle Operations" -ForegroundColor Gray
Write-Host "   • All 27 enterprise components" -ForegroundColor Gray
Write-Host ""
Write-Host "Press Ctrl+C in the demo to close the browser" -ForegroundColor Yellow
Write-Host ""
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Run the demo
node enterprise-feature-demo.js

# If we get here, demo ended
Write-Host ""
Write-Host "👋 Demo completed!" -ForegroundColor Green
Write-Host ""

