@echo off
REM Demo Bots Runner Script - Beta Terminal Testing
REM FCA Compliant Aviation Platform - Automated Demo Execution

setlocal enabledelayedexpansion

echo 🎬 Demo Bots Runner - StratusConnect Aviation Platform
echo ==================================================

REM Configuration
set "SCRIPT_DIR=%~dp0"
set "PROJECT_ROOT=%SCRIPT_DIR%.."
set "PLAYWRIGHT_DIR=%PROJECT_ROOT%\demo-bots\playwright"

REM Check if we're in the right directory
if not exist "%PLAYWRIGHT_DIR%" (
    echo ❌ Error: Playwright directory not found at %PLAYWRIGHT_DIR%
    exit /b 1
)

REM Function to check environment variables
:check_env
echo 🔍 Checking environment variables...

set "missing_vars="

if "%STRATUS_URL%"=="" set "missing_vars=%missing_vars% STRATUS_URL"
if "%SUPABASE_EVENTS_URL%"=="" set "missing_vars=%missing_vars% SUPABASE_EVENTS_URL"
if "%SUPABASE_URL%"=="" set "missing_vars=%missing_vars% SUPABASE_URL"
if "%SUPABASE_SERVICE_ROLE_KEY%"=="" set "missing_vars=%missing_vars% SUPABASE_SERVICE_ROLE_KEY"

if not "%missing_vars%"=="" (
    echo ❌ Missing required environment variables:%missing_vars%
    echo.
    echo 💡 Set them with:
    echo set STRATUS_URL=http://localhost:8080
    echo set SUPABASE_EVENTS_URL=https://your-project.functions.supabase.co/events-recorder
    echo set SUPABASE_URL=https://your-project.supabase.co
    echo set SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
    exit /b 1
)

echo ✅ All environment variables set
goto :install_deps

REM Function to install dependencies
:install_deps
echo 📦 Installing dependencies...
cd /d "%PLAYWRIGHT_DIR%"

if not exist "node_modules" (
    npm install
) else (
    echo ✅ Dependencies already installed
)

REM Install Playwright browsers if not already installed
npx playwright --version >nul 2>&1
if errorlevel 1 (
    echo 🎭 Installing Playwright browsers...
    npx playwright install
) else (
    echo ✅ Playwright browsers already installed
)

goto :run_tests

REM Function to run tests
:run_tests
set "test_type=%1"
if "%test_type%"=="" set "test_type=all"

echo 🧪 Running demo tests...
echo Test type: %test_type%

cd /d "%PLAYWRIGHT_DIR%"

if "%test_type%"=="video" (
    echo 🎥 Running video demo test...
    npx playwright test demo-video.spec.ts --headed
) else if "%test_type%"=="broker" (
    echo 🏢 Running broker demo test...
    npx playwright test broker.spec.ts
) else if "%test_type%"=="operator" (
    echo ✈️ Running operator demo test...
    npx playwright test operator.spec.ts
) else if "%test_type%"=="pilot" (
    echo 👨‍✈️ Running pilot demo test...
    npx playwright test pilot.spec.ts
) else if "%test_type%"=="full" (
    echo 🔄 Running full workflow test...
    npx playwright test full-workflow.spec.ts
) else if "%test_type%"=="all" (
    echo 🎯 Running all demo tests...
    npx playwright test
) else (
    echo ❌ Unknown test type: %test_type%
    echo Available types: video, broker, operator, pilot, full, all
    exit /b 1
)

goto :show_results

REM Function to show results
:show_results
echo 📊 Test Results Summary
echo =====================

cd /d "%PLAYWRIGHT_DIR%"

if exist "test-results" (
    echo ✅ Test results directory exists
    
    REM Count test files
    for /f %%i in ('dir /b test-results\*.png 2^>nul ^| find /c /v ""') do set "test_count=%%i"
    echo 📸 Screenshots: !test_count!
    
    REM Count videos
    if exist "test-results\videos" (
        for /f %%i in ('dir /b test-results\videos\*.webm 2^>nul ^| find /c /v ""') do set "video_count=%%i"
        echo 🎥 Videos: !video_count!
    )
    
    echo.
    echo 📁 Results location: %PLAYWRIGHT_DIR%\test-results\
) else (
    echo ⚠️ No test results found
)

if exist "playwright-report" (
    echo 📋 HTML Report: %PLAYWRIGHT_DIR%\playwright-report\index.html
)

goto :end

REM Main execution
:main
echo 🚀 Starting demo bots execution...
call :check_env
call :install_deps
call :run_tests %1
call :show_results

echo.
echo 🎉 Demo bots execution completed successfully!
echo 📋 Check the results in: %PLAYWRIGHT_DIR%\test-results\
goto :eof

REM Handle script arguments
:help
echo Demo Bots Runner - StratusConnect Aviation Platform
echo.
echo Usage: %~nx0 [test_type]
echo.
echo Test types:
echo   video    - Run video recording demo
echo   broker   - Run broker terminal demo
echo   operator - Run operator terminal demo
echo   pilot    - Run pilot terminal demo
echo   full     - Run full workflow demo
echo   all      - Run all demos (default)
echo.
echo Environment variables required:
echo   STRATUS_URL
echo   SUPABASE_EVENTS_URL
echo   SUPABASE_URL
echo   SUPABASE_SERVICE_ROLE_KEY
goto :eof

:end
if "%1"=="help" goto :help
if "%1"=="-h" goto :help
if "%1"=="--help" goto :help

call :main %1
