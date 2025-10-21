@echo off
echo ========================================
echo ThoughtPro B2B API & UI Test Suite
echo ========================================

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo Error: Python is not installed or not in PATH
    echo Please install Python 3.7+ from https://python.org
    pause
    exit /b 1
)

REM Install dependencies if requirements.txt exists
if exist requirements.txt (
    echo Installing Python dependencies...
    pip install -r requirements.txt
    if errorlevel 1 (
        echo Warning: Failed to install some dependencies
    )
)

echo.
echo Starting comprehensive API and UI tests...
echo This may take several minutes to complete.
echo.

REM Run the comprehensive test suite
python test_api_ui_integration.py

echo.
echo ========================================
echo Test execution completed!
echo Check the following files for results:
echo - api_ui_test_report.txt (Detailed report)
echo - api_test_results.log (Execution logs)
echo ========================================
pause