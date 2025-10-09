@echo off
REM StratusConnect Quote Loop System - Live Demo Runner (Windows)
REM This script sets up and runs the complete demonstration

echo 🚀 STRATUSCONNECT QUOTE LOOP SYSTEM - LIVE DEMO
echo ================================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

REM Check if the main project is running
echo 🔍 Checking if StratusConnect is running...
curl -s http://localhost:5173 >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ StratusConnect is not running on localhost:5173
    echo    Please start the development server first:
    echo    npm run dev
    pause
    exit /b 1
)

echo ✅ StratusConnect is running

REM Install dependencies if needed
if not exist "node_modules" (
    echo 📦 Installing demo dependencies...
    npm install
)

REM Create screenshots directory
if not exist "demo-screenshots" mkdir demo-screenshots

echo.
echo 🎯 Starting Quote Loop System Demo...
echo    This will demonstrate:
echo    • RFQ Creation by Broker
echo    • Quote Submission by Operator
echo    • Deal Acceptance with Payment
echo    • Crew Hiring with Commission
echo    • Real-time Updates across all terminals
echo    • Admin Monitoring and Analytics
echo.

REM Run the demo
node quote-loop-demo.js

echo.
echo 🎉 Demo completed! Check the demo-screenshots\ folder for results.
pause



