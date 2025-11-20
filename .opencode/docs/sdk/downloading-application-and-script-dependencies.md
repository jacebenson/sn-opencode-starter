Downloading application and script dependencies with the ServiceNow SDK
Release version: 
Zurich
UpdatedJul 30, 20253 minutes to readSummarize
Download the application dependencies configured in the now.config.json file and script dependencies, such as TypeScript type definitions for Glide APIs and script includes, from the instance.

Throughout the development process, you should download the dependencies of your application to support coding against those dependencies.

Download application dependencies
Download the tables that your application depends on from the global scope or other application scopes.

Before you begin

Create or convert a scoped application with the ServiceNow SDK. For more information, see Create an application with the ServiceNow SDK or Convert an application with the ServiceNow SDK.

Role required: admin

About this task

This procedure uses the ServiceNow SDK command-line interface (CLI). From a command-line tool, enter now-sdk --help to get information about the available commands and global options. To get additional information about a command and its parameters, enter the command and --help or -h. For example, now-sdk auth --help. For more information about the CLI, see ServiceNow SDK CLI.

Procedure

In Visual Studio Code, open your scoped application directory.
In the now.config.json file, add the tables that your application depends on in the dependencies object.
In the applications object, you must specify the application scope of the table and then list the table dependencies within the specified scope.
In the following example, the tables specified are downloaded from the global and sn_ace scopes.

Explain this code
"dependencies": {
  "applications": {
    "global":{
      "tables": ["cmdb_ci_server"]
    },
    "sn_ace": {
      "tables": ["sn_ace_app_config"]
    }
  }
}
Save your changes.
From the application directory, open an integrated Terminal window.
Download dependencies of the application with the dependencies command.
Explain this code
now-sdk dependencies --auth <alias>
Dependencies are generated in the @types/servicenow/schema directory with the .d.now.ts file extension. When building the application, these files aren't compiled like source code files.

Download script dependencies
Download script dependencies in your application to get type-ahead support for Glide APIs and script includes.

Before you begin

Create or convert a scoped application with the ServiceNow SDK. For more information, see Create an application with the ServiceNow SDK or Convert an application with the ServiceNow SDK.

Role required: admin

About this task

This procedure uses the ServiceNow SDK command-line interface (CLI). From a command-line tool, enter now-sdk --help to get information about the available commands and global options. To get additional information about a command and its parameters, enter the command and --help or -h. For example, now-sdk auth --help. For more information about the CLI, see ServiceNow SDK CLI.

Procedure

In Visual Studio Code, open your scoped application directory.
From the application directory, open an integrated Terminal window.
Download dependencies for scripts in the application with the dependencies command.
Explain this code
now-sdk dependencies --auth <alias>
Type definitions are downloaded into the @types/servicenow directory based on the scripts in your application.

In the src/fluent directory, create a tsconfig.server.json file for server-side scripts.
In the include object, include the type definitions that you downloaded for server-side Glide APIs (glide.server.d.ts) and script includes (script-includes.server.d.ts).
Explain this code
{
  "compilerOptions": {
    "lib": [
      "ES2021"
    ],
    "noEmit": true,
    "checkJs": false,
    "allowJs": true,
    "noEmitHelpers": true,
    "esModuleInterop": false,
    "module": "None",
    "types": []
  },
  "include": [
    "./**/*.server.js",
    "../../@types/servicenow/*.server.d.ts",
  ]
}
In the src/fluent directory, create a tsconfig.client.json file for client-side scripts.
In the include object, include the type definitions that you downloaded for client-side Glide APIs (glide.client.d.ts).
Explain this code
{
  "compilerOptions": {
    "target": "ES6",
    "lib": [
      "DOM",
      "ES6"
    ],
    "checkJs": false,
    "allowJs": true,
    "noEmit": true,
    "noEmitHelpers": true,
    "esModuleInterop": false,
    "module": "None",
    "types": []
  },
  "include": [
    "./**/*.client.js",
    "../../@types/servicenow/*.client.d.ts",
  ]
}
In the src/fluent directory, create a tsconfig.json file.
Note: This tsconfig.json file is separate from a tsconfig.json file used for applications that use TypeScript to create JavaScript modules.
In the references object, add the paths to the tsconfig.server.json and tsconfig.client.json files.

Explain this code
{
  "files": [],
  "references": [
    {
      "path": "./tsconfig.server.json"
    },
    {
      "path": "./tsconfig.client.json"
    }
  ]
}
Save your changes.
Result

With this configuration, you can use the .server.js file extension for server-side scripts and .client.js file extension for client-side scripts and get type-ahead support during development.