@echo off
echo STRATUSCONNECT BOT TESTING SYSTEM
echo ==================================
echo.

REM Check if PowerShell is available
where powershell >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo PowerShell found - Using basic bot test
    echo.
    powershell -ExecutionPolicy Bypass -File basic-bot-test.ps1 -BotCount %1 -BaseUrl %2
    goto :end
)

echo PowerShell not found
echo Please ensure PowerShell is available
echo.
echo Usage:
echo   run-bot-test.bat [bot-count] [base-url]
echo   Example: run-bot-test.bat 30 http://localhost:8082
echo.

:end
pause
