Convert an application with the ServiceNow SDK
Release version: 
Zurich
UpdatedJul 30, 20254 minutes to readSummarize
Convert an existing scoped application to support development in source code with the ServiceNow SDK.

Before you begin

Use the ServiceNow SDK to authenticate to a ServiceNow instance. For more information, see Authenticating to a ServiceNow instance with the ServiceNow SDK.

Role required: admin

About this task

Existing scoped applications that weren't created with the ServiceNow IDE or ServiceNow SDK must be converted to support development in source code. Converting an application adds the necessary files and directories for developing it in source code. You can choose whether to convert existing application metadata into ServiceNow Fluent code. The application isn't changed on the instance until you build and install it on the instance.

This procedure uses the ServiceNow SDK command-line interface (CLI). From a command-line tool, enter now-sdk --help to get information about the available commands and global options. To get additional information about a command and its parameters, enter the command and --help or -h. For example, now-sdk auth --help. For more information about the CLI, see ServiceNow SDK CLI.

Procedure

Create a local directory for your application.
In Visual Studio Code, open the directory.
From the application directory, open an integrated Terminal window.
Convert an existing scoped application from an instance or a local directory using the init command.
With the --from parameter, provide a sys_id of an application on the instance or a path to a local directory that contains an application to convert to support development in source code.

Explain this code
npx @servicenow/sdk init --from <sys_id or path>
For example:
Explain this code
npx @servicenow/sdk init --from aadfdd904748a6500ff14ee4316d4369
Note: Using the npx command installs the ServiceNow SDK in your application directory instead of globally.
At the prompt, enter a name for the application package used in the package.json file.
The package name must adhere to Node Package Manager (npm) package naming standards.

In the following example, an application is downloaded from the instance and converted using its sys_id.
Explain this code
$ npx @servicenow/sdk init --from aadfdd904748a6500ff14ee4316d4369
[now-sdk] Bootstrapping a new ServiceNow application project...
[now-sdk] Please provide the missing required fields:
? NPM package name:  example-app
[now-sdk] Access Token has expired, refreshing token
[now-sdk] Downloading application package for aadfdd904748a6500ff14ee4316d4369 from https://myinstance.service-now.com
[now-sdk] Unzipping downloaded package...
[now-sdk] Successfully downloaded and unzipped application aadfdd904748a6500ff14ee4316d4369
[now-sdk] Summary of downloaded metadata files
Metadata: 13 (Total: 13)
  Copied To Metadata Directory::
    1. dictionary/x_snc_example_app_mytable.xml
    2. package_inventory.csv
    3. sys_app_aadfdd904748a6500ff14ee4316d4369.xml
    4. update/sys_db_object_7030a5d04748a6500ff14ee4316d4338.xml
    5. update/sys_dictionary_x_snc_example_app_mytable_null.xml
    6. update/sys_documentation_x_snc_example_app_mytable__en.xml
... and 7 more

[now-sdk] Successfully converted application.
[now-sdk] Install the required dependencies with your preferred package manager before running "$now-sdk build".
          Ex: Run "npm install" if using npm.
The application is available locally with the default application structure and supports development in source code. Existing application metadata is downloaded into in the metadata directory. For information about the application structure, see the Application structure section of the Building applications in source code topic.

Install the required third-party dependencies using your preferred package manager.
For example, if you use Node Package Manager (npm), run npm install.
(Optional) Transform existing application metadata (XML) into ServiceNow Fluent code using the transform command.
With the --from parameter, provide a path to a local directory or file that contains metadata XML to transform into ServiceNow Fluent code.

Explain this code
now-sdk transform [--from <path>] [--directory <package path>] [--preview <flag>] [--auth <alias>]
Tip: You can set the --preview parameter to true to preview the transformed ServiceNow Fluent code from the command line without saving the changes.
For example:
Explain this code
now-sdk transform --from metadata/update --auth devuser1
Application metadata is defined in ServiceNow Fluent code in the src/fluent/generated directory and removed from the specified directory.
Note: A limited number of metadata types, such as Metadata Snapshots [sys_metadata_link] and UX Assets [sys_ux_lib_asset], can't be represented as ServiceNow Fluent code and aren't transformed. These metadata types remain as metadata XML files in the metadata directory of your application.
Build the application with the build command.
now-sdk build
(Optional) Update the application on the instance with the install command.
Explain this code
now-sdk install --auth <alias>
Result

The converted application is added to your local directory with the necessary files and directories to support development in source code. If you installed the application successfully, it’s updated on the instance. For more information about installing applications, see Build and install an application with the ServiceNow SDK. After installing a converted application, the Package JSON field of the custom application record [sys_app] contains the path to the package.json file for the application.

New application metadata added after converting an application is automatically transformed into source code in the src/fluent/generated directory when you use the transform command. If metadata exists in the local application as both XML and source code, the XML version takes precedence when installed on the instance.

What to do next

In Visual Studio Code, start developing your application in source code with ServiceNow Fluent, writing custom JavaScript modules, or adding third-party libraries.