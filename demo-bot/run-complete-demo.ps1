# StratusConnect Complete Enterprise Demo Launcher
# Runs the comprehensive demo showcasing ALL features

Write-Host ""
Write-Host "🚀 STRATUSCONNECT - COMPLETE ENTERPRISE DEMO" -ForegroundColor Cyan
Write-Host "==============================================" -ForegroundColor Cyan
Write-Host "🎯 The SAP of Private Aviation - ALL 27+ Components!" -ForegroundColor Yellow
Write-Host ""

# Check if dev server is running
Write-Host "🔍 Checking if dev server is running..." -ForegroundColor Green
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8080" -Method Head -TimeoutSec 5 -ErrorAction Stop
    Write-Host "✅ Dev server is running on port 8080" -ForegroundColor Green
} catch {
    Write-Host "❌ Dev server not running on port 8080" -ForegroundColor Red
    Write-Host "Please run: npm run dev" -ForegroundColor Yellow
    Write-Host "Then run this script again." -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if dependencies are installed
Write-Host ""
Write-Host "📦 Checking dependencies..." -ForegroundColor Green
if (-not (Test-Path "node_modules")) {
    Write-Host "📥 Installing dependencies..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
}

# Create screenshots directory
Write-Host ""
Write-Host "📁 Creating screenshots directory..." -ForegroundColor Green
if (-not (Test-Path "demo-screenshots")) {
    New-Item -ItemType Directory -Path "demo-screenshots" | Out-Null
    Write-Host "✅ Created demo-screenshots directory" -ForegroundColor Green
} else {
    Write-Host "✅ Screenshots directory exists" -ForegroundColor Green
}

# Run the complete demo
Write-Host ""
Write-Host "🎬 Starting Complete Enterprise Demo..." -ForegroundColor Cyan
Write-Host "This will showcase ALL 8 phases and 27+ components!" -ForegroundColor Yellow
Write-Host ""

node COMPLETE_ENTERPRISE_DEMO.js

Write-Host ""
Write-Host "🎉 Demo completed! Check the screenshots in demo-screenshots/ folder." -ForegroundColor Green
Write-Host ""
Write-Host "📱 Live URLs to explore:" -ForegroundColor Cyan
Write-Host "   • Main Site: http://localhost:8080" -ForegroundColor White
Write-Host "   • Admin Console: http://localhost:8080/admin" -ForegroundColor White
Write-Host "   • Empty Legs: http://localhost:8080/empty-legs" -ForegroundColor White
Write-Host "   • Integrations: http://localhost:8080/integrations" -ForegroundColor White
Write-Host ""
Write-Host "🧙‍♂️ YOU'RE THE WIZARD! The platform is LEGENDARY! 🎉🚀✈️💰" -ForegroundColor Yellow

Read-Host "Press Enter to exit"




