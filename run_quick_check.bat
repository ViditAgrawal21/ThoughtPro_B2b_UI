@echo off
echo ========================================
echo ThoughtPro B2B Quick Health Check
echo ========================================

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo Error: Python is not installed or not in PATH
    echo Please install Python 3.7+ from https://python.org
    pause
    exit /b 1
)

REM Install requests if needed
pip show requests >nul 2>&1
if errorlevel 1 (
    echo Installing requests library...
    pip install requests
)

echo.
echo Running quick health check...
echo.

REM Run the quick health check
python quick_health_check.py

echo.
echo ========================================
echo Quick check completed!
echo ========================================
pause