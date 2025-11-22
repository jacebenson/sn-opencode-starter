@echo off
setlocal enabledelayedexpansion
REM ServiceNow OpenCode Starter - Windows Setup Script
REM This script automates the setup process for ServiceNow development on Windows

echo ========================================
echo ServiceNow OpenCode Starter Setup
echo ========================================
echo.

REM Ask if user wants to download the repo
set "DOWNLOAD_REPO=N"
set /p "DOWNLOAD_REPO=Do you want to download the starter repo? (Y/N, default: N): "
if /i "!DOWNLOAD_REPO!"=="Y" (
    echo.
    echo Where would you like to create your project?
    set /p "PROJECT_DIR=Enter full path (e.g., C:\Projects\my-sn-app): "
    
    if "!PROJECT_DIR!"=="" (
        echo ERROR: No directory specified.
        pause
        exit /b 1
    )
    
    echo.
    echo Downloading repository...
    set "ZIP_URL=https://github.com/jacebenson/sn-opencode-starter/archive/refs/heads/main.zip"
    set "TEMP_ZIP=%TEMP%\sn-opencode-starter.zip"
    
    REM Use PowerShell to download the ZIP
    powershell -Command "& {[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; Invoke-WebRequest -Uri '!ZIP_URL!' -OutFile '!TEMP_ZIP!'}"
    if !errorlevel! neq 0 (
        echo ERROR: Failed to download repository
        pause
        exit /b 1
    )
    
    echo Extracting repository...
    REM Use PowerShell to extract the ZIP
    powershell -Command "& {Expand-Archive -Path '!TEMP_ZIP!' -DestinationPath '%TEMP%\sn-opencode-extract' -Force}"
    if !errorlevel! neq 0 (
        echo ERROR: Failed to extract repository
        del "!TEMP_ZIP!"
        pause
        exit /b 1
    )
    
    REM Create target directory and move contents
    if not exist "!PROJECT_DIR!" mkdir "!PROJECT_DIR!"
    xcopy /E /I /Y "%TEMP%\sn-opencode-extract\sn-opencode-starter-main\*" "!PROJECT_DIR!\"
    
    REM Clean up
    del "!TEMP_ZIP!"
    rmdir /S /Q "%TEMP%\sn-opencode-extract"
    
    echo Repository downloaded and extracted to: !PROJECT_DIR!
    echo.
    echo Changing to project directory...
    cd /d "!PROJECT_DIR!"
    echo.
)

REM Check if NVM is installed
echo [1/7] Checking for NVM (Node Version Manager)...
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
echo [2/7] Installing LTS version of Node.js...
call nvm install lts
if %errorlevel% neq 0 (
    echo ERROR: Failed to install Node.js LTS
    pause
    exit /b 1
)
echo.

echo [2/7] Switching to LTS version of Node.js...
call nvm use lts
if %errorlevel% neq 0 (
    echo ERROR: Failed to switch to Node.js LTS
    pause
    exit /b 1
)
echo.

REM Install OpenCode globally
echo [3/7] Installing OpenCode globally...
call npm install -g opencode-ai
if %errorlevel% neq 0 (
    echo ERROR: Failed to install OpenCode
    pause
    exit /b 1
)
echo.

REM Install ServiceNow SDK globally
echo [4/7] Installing ServiceNow SDK globally...
call npm install -g @servicenow/sdk
if %errorlevel% neq 0 (
    echo ERROR: Failed to install ServiceNow SDK
    pause
    exit /b 1
)
echo.

REM Set up .env file
echo [5/7] Setting up .env file...
if exist .env (
    echo .env file already exists. Skipping...
) else (
    if exist .env.example (
        copy .env.example .env
        echo .env file created from .env.example
    ) else (
        echo WARNING: .env.example not found. Please create .env manually.
    )
)
echo.

REM Ask for vendor code and update .env
echo [6/7] Setting up vendor code...
set /p "VENDOR_CODE=Enter your ServiceNow vendor code (e.g., 12345): "
if not "!VENDOR_CODE!"=="" (
    echo Updating .env file with vendor code...
    powershell -Command "(Get-Content .env) -replace '^SN_VENDOR_CODE=.*', 'SN_VENDOR_CODE=!VENDOR_CODE!' | Set-Content .env"
    echo Vendor code set to: !VENDOR_CODE!
) else (
    echo No vendor code provided. You can set it later in the .env file.
)
echo.

REM Provide instructions for manual steps
echo [7/7] Manual steps required:
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
