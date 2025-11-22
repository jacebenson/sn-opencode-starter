#!/bin/bash
# ServiceNow OpenCode Starter - macOS/Linux Setup Script

set -e

echo "========================================"
echo "ServiceNow OpenCode Starter Setup"
echo "========================================"
echo ""

# ========================================
# Step 1: Check Node.js
# ========================================
echo "Step 1: Checking Node.js..."
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed."
    echo "Please install Node.js from: https://nodejs.org"
    exit 1
fi

NODE_VERSION=$(node --version)
echo "  Found: $NODE_VERSION"
echo ""

# ========================================
# Step 2: Install OpenCode
# ========================================
echo "Step 2: Installing OpenCode..."
npm install -g opencode-ai
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install OpenCode"
    exit 1
fi
echo "  OpenCode installed successfully!"
echo ""

# ========================================
# Step 3: Install ServiceNow SDK
# ========================================
echo "Step 3: Installing ServiceNow SDK..."
echo ""
echo "NOTE: The SDK installer may ask configuration questions."
echo "You can usually just press Enter to accept defaults."
echo ""
npm install -g @servicenow/sdk
if [ $? -ne 0 ]; then
    echo "WARNING: ServiceNow SDK installation had issues, but continuing..."
    echo "You can install it later with: npm install -g @servicenow/sdk"
    echo ""
else
    echo "  ServiceNow SDK installed successfully!"
    echo ""
fi

# ========================================
# Step 4: Setup Project
# ========================================
echo "Step 4: Project Setup"
echo ""
echo "Current directory: $(pwd)"
echo ""
read -p "Use current directory for project? (Y/N): " USE_CURRENT

if [[ "$USE_CURRENT" =~ ^[Yy]$ ]]; then
    PROJECT_DIR="$(pwd)"
else
    echo ""
    echo "Default: $HOME/Projects/sn-lawncare"
    read -p "Enter project path (or press Enter for default): " PROJECT_DIR
    if [ -z "$PROJECT_DIR" ]; then
        PROJECT_DIR="$HOME/Projects/sn-lawncare"
    fi
    # Expand ~ to home directory
    PROJECT_DIR="${PROJECT_DIR/#\~/$HOME}"
fi

echo ""
echo "Using project directory: $PROJECT_DIR"
echo ""

# Create directory if it doesn't exist
if [ ! -d "$PROJECT_DIR" ]; then
    echo "Creating directory..."
    mkdir -p "$PROJECT_DIR"
fi

# ========================================
# Step 5: Download Starter Repo
# ========================================
read -p "Download starter repo to this location? (Y/N): " DOWNLOAD
if [[ "$DOWNLOAD" =~ ^[Yy]$ ]]; then
    echo ""
    echo "Downloading repository..."
    
    ZIP_URL="https://github.com/jacebenson/sn-opencode-starter/archive/refs/heads/main.zip"
    TEMP_ZIP="/tmp/sn-opencode-starter.zip"
    
    if command -v curl &> /dev/null; then
        curl -L "$ZIP_URL" -o "$TEMP_ZIP"
    elif command -v wget &> /dev/null; then
        wget "$ZIP_URL" -O "$TEMP_ZIP"
    else
        echo "ERROR: Neither curl nor wget is available."
        exit 1
    fi
    
    echo "Extracting..."
    TEMP_EXTRACT="/tmp/sn-opencode-extract"
    mkdir -p "$TEMP_EXTRACT"
    unzip -q "$TEMP_ZIP" -d "$TEMP_EXTRACT"
    
    echo "Copying files..."
    cp -r "$TEMP_EXTRACT/sn-opencode-starter-main/"* "$PROJECT_DIR/"
    
    # Clean up
    rm "$TEMP_ZIP"
    rm -rf "$TEMP_EXTRACT"
    
    echo "  Repository downloaded successfully!"
    echo ""
fi

# Change to project directory
cd "$PROJECT_DIR"
echo "Changed to: $PROJECT_DIR"
echo ""

# ========================================
# Step 6: Setup .env
# ========================================
if [ -f ".env.example" ] && [ ! -f ".env" ]; then
    echo "Setting up .env file..."
    cp .env.example .env
    echo "  .env file created"
    echo ""
fi

# ========================================
# Step 7: Setup ServiceNow Authentication
# ========================================
echo "Step 7: ServiceNow SDK Authentication"
echo ""
read -p "Do you want to set up ServiceNow authentication now? (Y/N): " SETUP_AUTH
if [[ "$SETUP_AUTH" =~ ^[Yy]$ ]]; then
    echo ""
    read -p "Enter your ServiceNow instance (e.g., dev12345.service-now.com): " INSTANCE
    
    if [ -n "$INSTANCE" ]; then
        echo ""
        echo "Setting up authentication for: $INSTANCE"
        echo ""
        echo "When prompted:"
        echo "  1. Select 'basic' for authentication type"
        echo "  2. Enter your username"
        echo "  3. Enter your password"
        echo ""
        read -p "Press Enter to continue..."
        
        npx @servicenow/sdk auth --add "$INSTANCE" --alias dev
        
        if [ $? -eq 0 ]; then
            echo ""
            echo "  Authentication configured successfully!"
            echo ""
        else
            echo ""
            echo "  Authentication setup had issues. You can try again later with:"
            echo "  npx @servicenow/sdk auth --add $INSTANCE --alias dev"
            echo ""
        fi
    fi
else
    echo ""
    echo "Skipping authentication setup."
    echo "You can set it up later with:"
    echo "  npx @servicenow/sdk auth --add YOUR_INSTANCE --alias dev"
    echo ""
fi

# ========================================
# Done!
# ========================================
echo "========================================"
echo "Setup Complete!"
echo "========================================"
echo ""
echo "NEXT STEPS:"
echo "1. Set your vendor code in .env file (if not done already)"
echo ""
echo "To manage authentication later:"
echo "  npx @servicenow/sdk auth --add YOUR_INSTANCE --alias dev"
echo ""
read -p "Start OpenCode now? (Y/n): " START
START=${START:-Y}

if [[ "$START" =~ ^[Yy]$ ]]; then
    echo ""
    echo "Starting OpenCode..."
    opencode
fi

echo ""
