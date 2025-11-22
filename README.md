## ServiceNow OpenCode Template

This repository serves as a template for creating ServiceNow OpenCode projects. It includes essential configurations and documentation to help you get started with building applications using the ServiceNow SDK and Fluent API.
It provides a structured approach to manage your ServiceNow development workflows effectively.

## Getting Started

Choose your operating system for setup instructions:

- [Windows Setup](#windows-setup)
- [macOS/Linux Setup](#macoslinux-setup)

---

### Windows Setup

You have two options for setting up your ServiceNow development environment on Windows:

#### Option 1: Automated Setup (Recommended)

1. Download the `setup.bat` file from the [latest release](https://github.com/jacebenson/sn-opencode-starter/releases/latest)
2. Run the batch file by double-clicking it or from command prompt
3. Follow the prompts:
   - Choose whether to download the starter repo (Y/N)
   - If yes, specify where to create your project
   - Enter your ServiceNow vendor code when prompted
4. Complete the manual steps displayed at the end (ServiceNow admin account and SDK auth setup)

#### Option 2: Manual Setup

1. Install NVM as this allows you to get the correct version of NodeJS for ServiceNow development. Follow the instructions at [NVM for Windows](https://github.com/coreybutler/nvm-windows)
    - Download the `nvm-setup.exe` from the releases page
    - Run the installer
2. Install the LTS version of NodeJS using NVM
   ```bash
   nvm install lts
   nvm use lts
   ```
3. Install OpenCode globally
    ```bash
    npm install -g opencode-ai
    ```
4. Install ServiceNow SDK globally
    ```bash
    npm install -g @servicenow/sdk
    ```
5. Download and extract this starter repository
    - Go to https://github.com/jacebenson/sn-opencode-starter
    - Click the green "Code" button and select "Download ZIP"
    - Extract the contents to your desired project directory
    - Navigate to that directory in your terminal
6. Set up your .env file
   - Copy `.env.example` to `.env`
   ```bash
   copy .env.example .env
   ```
   - Open `.env` and set your vendor code (e.g., `SN_VENDOR_CODE=12345`)
7. Set up an admin account for your ServiceNow instance
    - Log in to your PDI at https://developer.servicenow.com
    - Elevate to the `security_admin` role
    - Create an admin user for your instance
    - Give the user the `admin` and `security_admin` roles
    - Set the password and save it
8. Set up ServiceNow SDK authentication
    ```bash
    npx @servicenow/sdk auth --add YOUR_INSTANCE --alias dev
    ```
    - Replace `YOUR_INSTANCE` with your instance name (e.g., `dev12345`)
    - When prompted, select `basic` authentication
    - Enter the username and password for the admin user you created in the previous step

---

### macOS/Linux Setup

You have two options for setting up your ServiceNow development environment on macOS/Linux:

#### Option 1: Automated Setup (Recommended)

1. Download the `setup.sh` file from the [latest release](https://github.com/jacebenson/sn-opencode-starter/releases/latest)
2. Make it executable and run it:
   ```bash
   chmod +x setup.sh
   ./setup.sh
   ```
3. Follow the prompts:
   - Choose whether to download the starter repo (y/N)
   - If yes, specify where to create your project
   - Enter your ServiceNow vendor code when prompted
4. Complete the manual steps displayed at the end (ServiceNow admin account and SDK auth setup)

#### Option 2: Manual Setup

1. Install NVM (Node Version Manager) to manage NodeJS versions
   
   ```bash
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
   ```
   
   After installation, restart your terminal or run:
   ```bash
   source ~/.bashrc  # or ~/.zshrc for macOS
   ```

2. Install the LTS version of NodeJS using NVM
   ```bash
   nvm install --lts
   nvm use --lts
   ```

3. Install OpenCode globally
   ```bash
   npm install -g opencode-ai
   ```

4. Install ServiceNow SDK globally
   ```bash
   npm install -g @servicenow/sdk
   ```

5. Download and extract this starter repository
   
   **Option A: Using wget**
   ```bash
   wget https://github.com/jacebenson/sn-opencode-starter/archive/refs/heads/main.zip
   unzip main.zip
   mv sn-opencode-starter-main your-project-name
   cd your-project-name
   ```
   
   **Option B: Using curl**
   ```bash
   curl -L https://github.com/jacebenson/sn-opencode-starter/archive/refs/heads/main.zip -o main.zip
   unzip main.zip
   mv sn-opencode-starter-main your-project-name
   cd your-project-name
   ```
   
   **Option C: Manual download**
   - Go to https://github.com/jacebenson/sn-opencode-starter
   - Click the green "Code" button and select "Download ZIP"
   - Extract the contents to your desired project directory
   - Navigate to that directory in your terminal

6. Set up your .env file
   ```bash
   cp .env.example .env
   ```
   - Open `.env` in your preferred editor and set your vendor code (e.g., `SN_VENDOR_CODE=12345`)

7. Set up an admin account for your ServiceNow instance
    - Log in to your PDI at https://developer.servicenow.com
    - Elevate to the `security_admin` role
    - Create an admin user for your instance
    - Give the user the `admin` and `security_admin` roles
    - Set the password and save it

8. Set up ServiceNow SDK authentication
    ```bash
    npx @servicenow/sdk auth --add YOUR_INSTANCE --alias dev
    ```
    - Replace `YOUR_INSTANCE` with your instance name (e.g., `dev12345`)
    - When prompted, select `basic` authentication
    - Enter the username and password for the admin user you created in the previous step

---

## Next Steps

After completing the setup for your operating system, you're ready to start developing ServiceNow applications! Check out the documentation in `.opencode/docs/` to learn more about building with the Fluent API.