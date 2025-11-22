@echo off
setlocal enabledelayedexpansion

echo ========================================
echo ServiceNow OpenCode Starter Setup
echo ========================================
echo.

REM ========================================
REM Step 1: Check Node.js
REM ========================================
echo Step 1: Checking Node.js...
node --version >nul 2>&1
if !errorlevel! neq 0 (
    echo ERROR: Node.js is not installed.
    echo Please install Node.js from: https://nodejs.org
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo   Found: !NODE_VERSION!
echo.

REM ========================================
REM Step 2: Install OpenCode
REM ========================================
echo Step 2: Installing OpenCode...
call npm install -g opencode-ai
if !errorlevel! neq 0 (
    echo ERROR: Failed to install OpenCode
    pause
    exit /b 1
)
echo   OpenCode installed successfully!
echo.

REM ========================================
REM Step 3: Install ServiceNow SDK
REM ========================================
echo Step 3: Installing ServiceNow SDK...
echo.
echo NOTE: The SDK installer may ask about nvm-windows location.
echo If you have NVM installed, enter the path (e.g., C:\Users\YourName\AppData\Roaming\nvm)
echo If you don't have NVM, just press Enter to skip.
echo.
call npm install -g @servicenow/sdk
if !errorlevel! neq 0 (
    echo WARNING: ServiceNow SDK installation had issues, but continuing...
    echo You can install it later with: npm install -g @servicenow/sdk
    echo.
) else (
    echo   ServiceNow SDK installed successfully!
    echo.
)

REM ========================================
REM Step 4: Setup Project
REM ========================================
echo Step 4: Project Setup
echo.
echo Current directory: %CD%
echo.
set /p "USE_CURRENT=Use current directory for project? (Y/N): "

if /i "!USE_CURRENT!"=="Y" (
    set "PROJECT_DIR=%CD%"
) else (
    echo.
    echo Default: C:\Projects\sn-lawncare
    set /p "PROJECT_DIR=Enter project path (or press Enter for default): "
    if "!PROJECT_DIR!"=="" (
        set "PROJECT_DIR=C:\Projects\sn-lawncare"
    )
)

echo.
echo Using project directory: !PROJECT_DIR!
echo.

REM Create directory if it doesn't exist
if not exist "!PROJECT_DIR!" (
    echo Creating directory...
    mkdir "!PROJECT_DIR!"
)

REM ========================================
REM Step 5: Download Starter Repo
REM ========================================
set /p "DOWNLOAD=Download starter repo to this location? (Y/N): "
if /i "!DOWNLOAD!"=="Y" (
    echo.
    echo Downloading repository...
    
    set "ZIP_URL=https://github.com/jacebenson/sn-opencode-starter/archive/refs/heads/main.zip"
    set "TEMP_ZIP=%TEMP%\sn-opencode-starter.zip"
    
    powershell -Command "Invoke-WebRequest -Uri '!ZIP_URL!' -OutFile '!TEMP_ZIP!'"
    if !errorlevel! neq 0 (
        echo ERROR: Failed to download repository
        pause
        exit /b 1
    )
    
    echo Extracting...
    powershell -Command "Expand-Archive -Path '!TEMP_ZIP!' -DestinationPath '%TEMP%\sn-opencode-extract' -Force"
    
    echo Copying files...
    xcopy /E /I /Y "%TEMP%\sn-opencode-extract\sn-opencode-starter-main\*" "!PROJECT_DIR!\"
    
    REM Clean up
    del "!TEMP_ZIP!"
    rmdir /S /Q "%TEMP%\sn-opencode-extract"
    
    echo   Repository downloaded successfully!
    echo.
)

REM Change to project directory
cd /d "!PROJECT_DIR!"
echo Changed to: !PROJECT_DIR!
echo.

REM ========================================
REM Step 6: Setup .env
REM ========================================
if exist ".env.example" (
    if not exist ".env" (
        echo Setting up .env file...
        copy .env.example .env >nul
        echo   .env file created
        echo.
    )
)

REM ========================================
REM Step 7: Setup ServiceNow Authentication
REM ========================================
echo Step 7: ServiceNow SDK Authentication
echo.
set /p "SETUP_AUTH=Do you want to set up ServiceNow authentication now? (Y/N): "
if /i "!SETUP_AUTH!"=="Y" (
    echo.
    set /p "INSTANCE=Enter your ServiceNow instance (e.g., dev12345.service-now.com): "
    
    if not "!INSTANCE!"=="" (
        echo.
        echo Setting up authentication for: !INSTANCE!
        echo.
        echo When prompted:
        echo   1. Select "basic" for authentication type
        echo   2. Enter your username
        echo   3. Enter your password
        echo.
        pause
        
        npx @servicenow/sdk auth --add !INSTANCE! --alias dev
        
        if !errorlevel! equ 0 (
            echo.
            echo   Authentication configured successfully!
            echo.
        ) else (
            echo.
            echo   Authentication setup had issues. You can try again later with:
            echo   npx @servicenow/sdk auth --add !INSTANCE! --alias dev
            echo.
        )
    )
) else (
    echo.
    echo Skipping authentication setup.
    echo You can set it up later with:
    echo   npx @servicenow/sdk auth --add YOUR_INSTANCE --alias dev
    echo.
)

REM ========================================
REM Done!
REM ========================================
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo NEXT STEPS:
echo 1. Set your vendor code in .env file (if not done already)
echo.
echo To manage authentication later:
echo   npx @servicenow/sdk auth --add YOUR_INSTANCE --alias dev
echo.
set /p "START=Start OpenCode now? (Y/N, default Y): "
if "!START!"=="" set "START=Y"

if /i "!START!"=="Y" (
    echo.
    echo Starting OpenCode...
    opencode
)

echo.
pause
