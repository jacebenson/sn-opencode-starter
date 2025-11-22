@echo off
REM ServiceNow OpenCode Starter - Windows Setup Script
REM This script automates the setup process for ServiceNow development on Windows

echo ========================================
echo ServiceNow OpenCode Starter Setup
echo ========================================
echo.

REM Check if NVM is installed
echo [1/6] Checking for NVM (Node Version Manager)...
where nvm >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: NVM is not installed!
    echo Please install NVM for Windows from: https://github.com/coreybutler/nvm-windows
    echo Download nvm-setup.exe from the releases page and run it.
    pause
    exit /b 1
)
echo NVM is installed.
echo.

REM Install and use LTS version of Node.js
echo [2/6] Installing LTS version of Node.js...
call nvm install lts
if %errorlevel% neq 0 (
    echo ERROR: Failed to install Node.js LTS
    pause
    exit /b 1
)
echo.

echo [2/6] Switching to LTS version of Node.js...
call nvm use lts
if %errorlevel% neq 0 (
    echo ERROR: Failed to switch to Node.js LTS
    pause
    exit /b 1
)
echo.

REM Install OpenCode globally
echo [3/6] Installing OpenCode globally...
call npm install -g opencode-ai
if %errorlevel% neq 0 (
    echo ERROR: Failed to install OpenCode
    pause
    exit /b 1
)
echo.

REM Install ServiceNow SDK globally
echo [4/6] Installing ServiceNow SDK globally...
call npm install -g @servicenow/sdk
if %errorlevel% neq 0 (
    echo ERROR: Failed to install ServiceNow SDK
    pause
    exit /b 1
)
echo.

REM Set up .env file
echo [5/6] Setting up .env file...
if exist .env (
    echo .env file already exists. Skipping...
) else (
    if exist .env.example (
        copy .env.example .env
        echo .env file created from .env.example
        echo Please update .env with your configuration!
    ) else (
        echo WARNING: .env.example not found. Please create .env manually.
    )
)
echo.

REM Provide instructions for manual steps
echo [6/6] Manual steps required:
echo ========================================
echo.
echo NEXT STEPS:
echo.
echo 1. Set up an admin account on your ServiceNow instance:
echo    - Log in to your PDI at https://developer.servicenow.com
echo    - Elevate to the 'security_admin' role
echo    - Create an admin user for your instance
echo    - Give the user the 'admin' and 'security_admin' roles
echo    - Set the password and save it
echo.
echo 2. Set up ServiceNow SDK authentication:
echo    Run: npx @servicenow/sdk auth --add YOUR_INSTANCE --alias dev
echo    - Select 'basic' authentication when prompted
echo    - Enter the username and password from step 1
echo.
echo 3. Update your .env file with your instance details
echo.
echo ========================================
echo Setup complete! (except manual steps above)
echo ========================================
pause
