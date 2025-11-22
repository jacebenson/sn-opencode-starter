#!/bin/bash
# ServiceNow OpenCode Starter - macOS/Linux Setup Script
# This script automates the setup process for ServiceNow development on Unix-like systems

set -e  # Exit on error

echo "========================================"
echo "ServiceNow OpenCode Starter Setup"
echo "========================================"
echo ""

# Ask if user wants to download the repo
read -p "Do you want to download the starter repo? (y/N): " DOWNLOAD_REPO
DOWNLOAD_REPO=${DOWNLOAD_REPO:-N}

if [[ "$DOWNLOAD_REPO" =~ ^[Yy]$ ]]; then
    echo ""
    read -p "Enter the full path where you want to create your project: " PROJECT_DIR
    
    if [ -z "$PROJECT_DIR" ]; then
        echo "ERROR: No directory specified."
        exit 1
    fi
    
    # Expand ~ to home directory
    PROJECT_DIR="${PROJECT_DIR/#\~/$HOME}"
    
    echo ""
    echo "Downloading repository..."
    ZIP_URL="https://github.com/jacebenson/sn-opencode-starter/archive/refs/heads/main.zip"
    TEMP_ZIP="/tmp/sn-opencode-starter.zip"
    
    # Download using curl or wget
    if command -v curl &> /dev/null; then
        curl -L "$ZIP_URL" -o "$TEMP_ZIP"
    elif command -v wget &> /dev/null; then
        wget "$ZIP_URL" -O "$TEMP_ZIP"
    else
        echo "ERROR: Neither curl nor wget is available. Please install one of them."
        exit 1
    fi
    
    echo "Extracting repository..."
    TEMP_EXTRACT="/tmp/sn-opencode-extract"
    mkdir -p "$TEMP_EXTRACT"
    unzip -q "$TEMP_ZIP" -d "$TEMP_EXTRACT"
    
    # Create target directory and move contents
    mkdir -p "$PROJECT_DIR"
    cp -r "$TEMP_EXTRACT/sn-opencode-starter-main/"* "$PROJECT_DIR/"
    
    # Clean up
    rm "$TEMP_ZIP"
    rm -rf "$TEMP_EXTRACT"
    
    echo "Repository downloaded and extracted to: $PROJECT_DIR"
    echo ""
    echo "Changing to project directory..."
    cd "$PROJECT_DIR"
    echo ""
fi

# Check if NVM is installed
echo "[1/7] Checking for NVM (Node Version Manager)..."
if [ -s "$HOME/.nvm/nvm.sh" ]; then
    source "$HOME/.nvm/nvm.sh"
    echo "NVM is installed."
elif [ -s "/usr/local/opt/nvm/nvm.sh" ]; then
    source "/usr/local/opt/nvm/nvm.sh"
    echo "NVM is installed."
else
    echo "NVM is not installed!"
    echo "Installing NVM..."
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
    
    # Source NVM for current session
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    
    if [ -s "$HOME/.nvm/nvm.sh" ]; then
        source "$HOME/.nvm/nvm.sh"
        echo "NVM installed successfully."
    else
        echo "ERROR: NVM installation failed. Please install manually from: https://github.com/nvm-sh/nvm"
        exit 1
    fi
fi
echo ""

# Install and use LTS version of Node.js
echo "[2/7] Installing LTS version of Node.js..."
nvm install --lts
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install Node.js LTS"
    exit 1
fi
echo ""

echo "[2/7] Switching to LTS version of Node.js..."
nvm use --lts
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to switch to Node.js LTS"
    exit 1
fi
echo ""

# Install OpenCode globally
echo "[3/7] Installing OpenCode globally..."
npm install -g opencode-ai
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install OpenCode"
    exit 1
fi
echo ""

# Install ServiceNow SDK globally
echo "[4/7] Installing ServiceNow SDK globally..."
npm install -g @servicenow/sdk
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install ServiceNow SDK"
    exit 1
fi
echo ""

# Set up .env file
echo "[5/7] Setting up .env file..."
if [ -f .env ]; then
    echo ".env file already exists. Skipping..."
else
    if [ -f .env.example ]; then
        cp .env.example .env
        echo ".env file created from .env.example"
    else
        echo "WARNING: .env.example not found. Please create .env manually."
    fi
fi
echo ""

# Ask for vendor code and update .env
echo "[6/7] Setting up vendor code..."
read -p "Enter your ServiceNow vendor code (e.g., 12345): " VENDOR_CODE

if [ -n "$VENDOR_CODE" ]; then
    echo "Updating .env file with vendor code..."
    if [ -f .env ]; then
        # Use sed to update the vendor code in .env
        if [[ "$OSTYPE" == "darwin"* ]]; then
            # macOS requires empty string after -i
            sed -i '' "s/^SN_VENDOR_CODE=.*/SN_VENDOR_CODE=$VENDOR_CODE/" .env
        else
            # Linux
            sed -i "s/^SN_VENDOR_CODE=.*/SN_VENDOR_CODE=$VENDOR_CODE/" .env
        fi
        echo "Vendor code set to: $VENDOR_CODE"
    else
        echo "WARNING: .env file not found. Please set vendor code manually."
    fi
else
    echo "No vendor code provided. You can set it later in the .env file."
fi
echo ""

# Provide instructions for manual steps
echo "[7/7] Manual steps required:"
echo "========================================"
echo ""
echo "NEXT STEPS:"
echo ""
echo "1. Set up an admin account on your ServiceNow instance:"
echo "   - Log in to your PDI at https://developer.servicenow.com"
echo "   - Elevate to the 'security_admin' role"
echo "   - Create an admin user for your instance"
echo "   - Give the user the 'admin' and 'security_admin' roles"
echo "   - Set the password and save it"
echo ""
echo "2. Set up ServiceNow SDK authentication:"
echo "   Run: npx @servicenow/sdk auth --add YOUR_INSTANCE --alias dev"
echo "   - Select 'basic' authentication when prompted"
echo "   - Enter the username and password from step 1"
echo "   - Credentials will be stored in your system keychain"
echo ""
echo "3. Your .env file is ready with the vendor code"
echo "   - No additional .env configuration needed for SDK tools"
echo "   - SDK tools use your system keychain for authentication"
echo ""
echo "========================================"
echo "Setup complete! (except manual steps above)"
echo "========================================"
