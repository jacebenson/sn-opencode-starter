## ServiceNow OpenCode Template

This repository serves as a template for creating ServiceNow OpenCode projects. It includes essential configurations and documentation to help you get started with building applications using the ServiceNow SDK and Fluent API.
It provides a structured approach to manage your ServiceNow development workflows effectively.

## Getting Started


### Windows

1. Install NVM as this allows you get the correct version of NodeJS for ServiceNow development. Follow the instructions at [NVM for Windows](https://github.com/coreybutler/nvm-windows)
    - download the nvm-setup.exe from the releases page
    - run the installer
2. Install the LTS version of NodeJS using NVM
   ```bash
   nvm install lts
   nvm use 24.11.1
   ```
3. Install OpenCode 
    ```bash
    npm install -g opencode-ai
    ```
4. Clone this repository OR Download the ZIP and extract it
    ```bash
    git clone https://github.com/jacebenson/sn-opencode-starter.git your-project-name
    cd your-project-name
    ```
    Or go to https://github.com/jacebenson/sn-opencode-starter, click the green "Code" button, and select "Download ZIP". Extract the contents to your desired project directory.
5. Set up your .env file
   - Create a copy of the `.env.example` file and rename it to `.env`
   - Update the `.env` file with your ServiceNow instance dev auth details (you'll set this up later with the SDK)
5. Set up an admin account for your ServiceNow instance
    - Log in to your PDI at https://developer.servicenow.com
    - Elevate to the `security_admin` role
    - Create an admin user for your instance
    - Give the user the `admin` role and `security_admin` role
    - Set the password and copy it to clipboard
6. Set up ServiceNow's SDK's Auth
    
    ```bash
    npx @servicenow/sdk auth --add dev12345 --alias dev
    ```
    - When prompted, select `basic` authentication
    - Enter the username and password for the admin user you created in the previous step