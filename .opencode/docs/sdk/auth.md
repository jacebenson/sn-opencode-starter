Authenticating to a ServiceNow instance with the ServiceNow SDK
Release version: 
Zurich
UpdatedJul 30, 20254 minutes to readSummarize
Authenticate to a ServiceNow instance and store user credentials for accessing the instance on your system with the ServiceNow SDK.

You can use basic or OAuth 2.0 credentials to authenticate to an instance. To use OAuth 2.0 authentication, your instance must have ServiceNow IDE (version 1.1 or later) installed or have the required XML configuration imported. By default, instances on the Zurich release include ServiceNow IDE version 1.1.4 and support using OAuth 2.0 authentication with the ServiceNow SDK.

After authenticating to an instance with the ServiceNow SDK command-line interface (CLI), you can begin developing applications and installing them on your instance. A non-production instance should be used for application development.

Authenticate to a ServiceNow instance using basic authentication with the ServiceNow SDK
Use basic authentication to connect to a ServiceNow instance with the ServiceNow SDK.

Before you begin

Role required: admin

About this task

This procedure uses the ServiceNow SDK command-line interface (CLI). From a command-line tool, enter now-sdk --help to get information about the available commands and global options. To get additional information about a command and its parameters, enter the command and --help or -h. For example, now-sdk auth --help. For more information about the CLI, see ServiceNow SDK CLI.

Procedure

Create a local directory for your application.
In Visual Studio Code, open the directory.
From the application directory, open an integrated Terminal window.
Specify the instance to authenticate to with the auth command.
Explain this code
npx @servicenow/sdk auth --add <instance>
For example:
Explain this code
npx @servicenow/sdk auth --add https://myinstance.service-now.com
Note: Using the npx command installs the ServiceNow SDK in your application directory instead of globally.
Respond to the following series of prompts.

Prompt	Response
Type of authentication to use	Select basic.
Alias for these credentials	Enter an alias for your credentials and the instance.
The alias can be used for authentication with the init, transform, dependencies, and install commands.

The username to authenticate with the instance	Enter your username for the instance.
You must be assigned the admin role.

The password to authenticate with the instance	Enter your password.
Result

The alias and credentials are stored in the device keychain or credential manager on your system and are set as the default credentials.

What to do next

Create a scoped application or convert an existing application for use with the ServiceNow SDK. For more information, see Create an application with the ServiceNow SDK or Convert an application with the ServiceNow SDK.

Configure a ServiceNow instance for OAuth 2.0 authentication with the ServiceNow SDK
Import the configuration to use OAuth 2.0 authentication with the ServiceNow SDK to an instance.

Before you begin

Important: This procedure is required only for instances that don't have ServiceNow IDE (version 1.1 or later) installed. By default, instances on the Zurich release include ServiceNow IDE version 1.1.4 and support using OAuth 2.0 authentication with the ServiceNow SDK.
The default System Administrator (admin) user must elevate to the privileged security_admin role to configure an instance for OAuth 2.0 authentication with the ServiceNow SDK. For more information, see Elevate to a privileged role.

Role required: security_admin

Procedure

Navigate to the Configuring ServiceNow SDK for OAuth 2.0 authentication (SSO) article in the ServiceNow Community.
Download the attached ZIP file and unzip its contents.
Import the XML to your instance.
From your instance, navigate to any list.
Any list can be used because the XML file contains the destination table name for the records.
Select and hold (or right-click) any column title and select Import XML.
In the Import XML form, select Choose File and select one of the downloaded XML files.
Select Upload.
Repeat these steps for each XML file.
For additional information, see Import data from XML.
Result

Developers can authenticate to the instance using OAuth 2.0 with the ServiceNow SDK.

Authenticate to a ServiceNow instance using OAuth 2.0 with the ServiceNow SDK
Use OAuth 2.0 authentication to connect to a ServiceNow instance with the ServiceNow SDK.

Before you begin

To use OAuth 2.0 authentication, your instance must have ServiceNow IDE (version 1.1 or later) installed or have the required XML configuration imported. By default, instances on the Zurich release include ServiceNow IDE version 1.1.4 and support using OAuth 2.0 authentication with the ServiceNow SDK. For more information, see Configure a ServiceNow instance for OAuth 2.0 authentication with the ServiceNow SDK.

Role required: admin

About this task

This procedure uses the ServiceNow SDK command-line interface (CLI). From a command-line tool, enter now-sdk --help to get information about the available commands and global options. To get additional information about a command and its parameters, enter the command and --help or -h. For example, now-sdk auth --help. For more information about the CLI, see ServiceNow SDK CLI.

Procedure

Create a local directory for your application.
In Visual Studio Code, open the directory.
From the application directory, open an integrated Terminal window.
Specify the instance to authenticate to with the auth command.
Explain this code
npx @servicenow/sdk auth --add <instance>
For example:
Explain this code
npx @servicenow/sdk auth --add https://myinstance.service-now.com
Note: Using the npx command installs the ServiceNow SDK in your application directory instead of globally.
Respond to the following series of prompts.
Prompt	Response
Type of authentication to use	Select oauth.
Alias for these credentials	Enter an alias for your credentials and the instance.
The alias can be used for authentication with the init, transform, dependencies, and install commands.

The ServiceNow SDK opens a web browser to authenticate with the instance.
Navigate to the web page that opens and log in to the instance if you aren't currently logged in.
Select Accept to allow the ServiceNow SDK to connect to the instance.
The page refreshes and includes an authentication code.
Select Copy to copy the authentication code provided.
In the command line, paste the authentication code.
Result

The alias and credentials are stored in the device keychain or credential manager on your system and are set as the default credentials.

What to do next

Create a scoped application or convert an existing application for use with the ServiceNow SDK. For more information, see Create an application with the ServiceNow SDK or Convert an application with the ServiceNow SDK.