Create an application with the ServiceNow SDK
Release version: 
Zurich
UpdatedJan 29, 20253 minutes to readSummarize
Create a scoped application to develop in source code with the ServiceNow SDK.

Before you begin

Use the ServiceNow SDK to authenticate to a ServiceNow instance. For more information, see Authenticating to a ServiceNow instance with the ServiceNow SDK.

Role required: admin

About this task

This procedure uses the ServiceNow SDK command-line interface (CLI). From a command-line tool, enter now-sdk --help to get information about the available commands and global options. To get additional information about a command and its parameters, enter the command and --help or -h. For example, now-sdk auth --help. For more information about the CLI, see ServiceNow SDK CLI.

Procedure

Create a local directory for your application.
In Visual Studio Code, open the directory.
From the application directory, open an integrated Terminal window.
Create an application following a guided set of prompts with the init command:
npx @servicenow/sdk init
Note: Using the npx command installs the ServiceNow SDK in your application directory instead of globally.
Respond to the following series of prompts.

Prompt	Response
Select a template	Select a template that defines the default application structure:
Basic now-sdk boilerplate: An application with only the basic structure necessary for development in source code.
JavaScript now-sdk + basic: An application configured for development in ServiceNow Fluent and JavaScript.
JavaScript now-sdk + fullstack React: An application configured for development in ServiceNow Fluent, JavaScript, and React.
TypeScript now-sdk + basic: An application configured for development in ServiceNow Fluent and TypeScript. TypeScript source files in the src/server directory are transpiled into JavaScript modules.
TypeScript now-sdk + fullstack React: An application configured for development in ServiceNow Fluent, TypeScript, and React. TypeScript source files in the src/server directory are transpiled into JavaScript modules.
Name of ServiceNow Application	Enter a name for the application.
NPM package name	Enter a name for the application package used in the package.json file.
The package name must adhere to Node Package Manager (npm) package naming standards.

Scope name	Enter the scope of the application.
The scope name must be unique on the instance, begin with x_<prefix>, and be 18 characters or fewer. For more information, see Namespace identifier.

In the following example, a scoped application named Example App (x_snc_example_app) is created.
Explain this code
$ npx @servicenow/sdk init
[now-sdk] Bootstrapping a new ServiceNow application project...
? Select a template: now-sdk + basic
? Name of ServiceNow Application:  Example App
? NPM package name:  example-app
? Scope name:  x_snc_example_app
[now-sdk] Application created successfully.
          Install the required dependencies with your preferred package manager before running "$now-sdk build".
          Ex: Run "npm install" if using npm.
Install the required third-party dependencies using your preferred package manager.
For example, if you use Node Package Manager (npm), run npm install.
Build the application with the build command:
now-sdk build
(Optional) Install the application on an instance with the install command:
Explain this code
now-sdk install --auth <alias>
Result

A scoped application with the default application structure is available locally. For information about the application structure, see the Application structure section of the Building applications in source code topic.

If you installed the application successfully, it’s available on the instance. For more information about installing applications, see Build and install an application with the ServiceNow SDK.

What to do next

In Visual Studio Code, start developing your application in source code with ServiceNow Fluent, writing custom JavaScript modules, or adding third-party libraries.