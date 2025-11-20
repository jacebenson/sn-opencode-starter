ServiceNow SDK CLI
Release version: 
Zurich
UpdatedJul 30, 20258 minutes to readSummarize
Use the ServiceNow SDK command-line interface (CLI) to manage changes between a local application and the application on an instance.

From the command-line tool on your system, enter now-sdk to start the CLI and return a list of available commands or now-sdk [command] to begin using the ServiceNow SDK.

The CLI includes the following commands and global options:

Global options
Option	Description
--version, -v	Return the version of the CLI.
--help, -h	Return information about commands, subcommands, and parameters.
--debug, -d	Return the debug logs generated with a command.
auth
Authenticate to an instance and store, update, or view user credentials for accessing an instance on your system.

The auth command has parameters for adding credentials, deleting credentials, listing credentials, and setting credentials to use by default.

For more information, see Authenticating to a ServiceNow instance with the ServiceNow SDK.

add
Store credentials in the device keychain or credential manager on your system.

The auth command has the following structure with the --add parameter:
Explain this code
npx @servicenow/sdk auth [--add <instance url>] [--type <auth method>] [--alias <alias>]
Note: Using the npx command installs the ServiceNow SDK in your application directory instead of globally.
Required parameters
Parameter	Type	Description	Default value
--add	String	The URL of the target instance to access and to which you install applications. The instance must be on the Washington DC release or later.	—
Optional parameters
Parameter	Type	Description	Default value
--type	String	The method to use to authenticate with the target instance. Specify basic for basic authentication or oauth for OAuth 2.0 authentication.	basic
--alias	String	The alias for the instance and user credentials.
The alias can be used for authentication with the init, transform, dependencies, and install commands.

—
For example:
Explain this code
npx @servicenow/sdk auth --add https://myinstance.service-now.com --type oauth --alias devuser1
delete
Remove credentials in the device keychain or credential manager on your system.

The auth command has the following structure with the --delete parameter:
Explain this code
now-sdk auth [--delete <alias or all>]
Required parameters
Parameter	Type	Description	Default value
--delete	String	
The alias for the instance and user credentials.

To delete all credentials, set this parameter to --delete all.

—
For example:
Explain this code
now-sdk auth --delete devuser1
list
View credentials saved in the device keychain or credential manager on your system. Passwords and authentication codes aren't returned.

The auth command has the following structure with the --list parameter:
now-sdk auth [--list]
Required parameters
Parameter	Type	Description	Default value
--list	String	Lists all available authentication credentials.	—
For example:
now-sdk auth --list
use
Set the credentials to be used by commands by default.

The auth command has the following structure with the --use parameter:
now-sdk auth [--use <alias>]
Required parameters
Parameter	Type	Description	Default value
--use	String	The alias for the instance and user credentials.	—
For example:
now-sdk auth --use devuser1
init
Create a custom scoped application or convert an existing scoped application to support development in source code. The application is added in the current directory.

To create an application with your default credentials, you can run the init command without any optional parameters. For example, now-sdk init. To convert an existing application, you must include the --from parameter to provide the sys_id of an application on an instance or a path to a local directory that contains an application.

After initializing an application, you must install the required third-party dependencies using your preferred package manager before building the application. For example, if you use Node Package Manager (npm), run npm install.

The init command has the following structure:
Explain this code
npx @servicenow/sdk init [--from <sys_id or path>] [--appName <name>] [--packageName <name>] [--scopeName <name>] [--auth <alias>] [--template <template>]
Note: Using the npx command installs the ServiceNow SDK in your application directory instead of globally.

Optional parameters
Parameter	Type	Description	Default value
--from	String	A sys_id of an application on the instance or a path to a local directory that contains an application to convert to support development in source code.
Converting an application adds the necessary files and directories for using the ServiceNow SDK locally and downloads the application metadata. The application isn't changed on the instance until you build and install it on the instance. After installing a converted application, the Package JSON field of the custom application record [sys_app] contains the path to the package.json file for the application.

—
--appName	String	A name for the application.	—
--packageName	String	A name for the application package used in the package.json file. The package name must adhere to Node Package Manager (npm) package naming standards.	—
--scopeName	String	The scope of the application.
The scope name must be unique on the instance, begin with x_<prefix>, and be 18 characters or fewer. For more information, see Namespace identifier.

—
--auth, -a	String	An alias for the credentials to use to authenticate to the instance.	If set, the default alias.
--template	String	A template for the default structure of the application.
base: An application with only the basic structure necessary for development in source code.
javascript.basic: An application configured for development in ServiceNow Fluent and JavaScript.
javascript.react: An application configured for development in ServiceNow Fluent, JavaScript, and React.
typescript.basic: An application configured for development in ServiceNow Fluent and TypeScript. TypeScript source files in the src/server directory are transpiled into JavaScript modules.
typescript.react: An application configured for development in ServiceNow Fluent, TypeScript, and React. TypeScript source files in the src/server directory are transpiled into JavaScript modules.
—
For example:
Explain this code
npx @servicenow/sdk init --from dbce0f6a3b3fda107b45b5d355e45af6 --appName Example App --packageName example-app --scopeName x_snc_example --auth devuser1 --template base
For more information, see Create an application with the ServiceNow SDK or Convert an application with the ServiceNow SDK.

build
Compile source files and output build artifacts. Third-party library dependencies are converted into XML files that can be installed with the application.

The build command has the following structure:
Explain this code
now-sdk build <source> [--frozenKeys <flag>]
Optional parameters
Parameter	Type	Description	Default value
source	String	The path to the directory that contains the package.json file for your application.
The package.json should be in the base directory of your application.

Current working directory
--frozenKeys	Boolean	An option to validate that the keys.ts file is up to date for continuous integration (CI) builds. If true and changes were made to the application's ServiceNow Fluent code, the keys.ts file isn't updated and the build fails.
The keys.ts file is automatically generated in the src/fluent/generated directory.

false
For example:
Explain this code
now-sdk build /path/to/package --frozenKeys true
For more information, see Build and install an application with the ServiceNow SDK.

install
Package the build artifacts and install or update an application on an instance. Before using the install command, you must use the build command to generate an installable package.

The install command has the following structure:

Explain this code
now-sdk install [--source <package path>] [--reinstall <flag>] [--auth <alias>] [--open-browser <flag>] [--info <flag>]

Optional parameters
Parameter	Type	Description	Default value
--source	String	The path to the directory that contains the package.json file for your application.
The package.json should be in the base directory of your application.

Current working directory
--reinstall, -r	Boolean	An option to uninstall and reinstall the application on the instance to ensure that the metadata on the instance matches the metadata in the installation package.
Warning: Metadata that is on the instance but not in your local application is removed.
If you have previous versions of modules in the EcmaScript Module [sys_module] table that aren't needed, re-installing an application removes previous versions of the application’s modules from the table.

false
--auth, -a	String	An alias for the credentials to use to authenticate to the instance.
Note: For CI/CD pipelines, you can set the following environment variables to authenticate with an instance at runtime using basic authentication:
SN_SDK_INSTANCE_URL: The URL of the target instance to access and to which you install applications.
SN_SDK_USER: A username for the instance.
SN_SDK_USER_PWD: The password associated with the user.
SN_SDK_NODE_ENV: Set to SN_SDK_CI_INSTALL to enable CI server support.
If set, the default alias.
--open-browser, -b	Boolean	An option to open the application record in your default browser after successfully installing the application.	false
--info, -i	Boolean	An option to return details about the most recent installation of this application, such as the status and records updated. When this parameter is used, the application isn’t installed.	false
For example:
Explain this code
now-sdk install --source /path/to/package --reinstall false --auth devuser1 --open-browser true --info true
For more information, see Build and install an application with the ServiceNow SDK.

dependencies
Download the application dependencies configured in the now.config.json file and script dependencies, such as TypeScript type definitions for Glide APIs and script includes, from the instance.

To generate and download any tables on which your application depends, you must configure dependencies in the now.config.json. After downloading script dependencies, you must update your tsconfig.json file to include the type definitions.

The dependencies command has the following structure:

Explain this code
now-sdk dependencies [--directory <package path>] [--auth <alias>]
Optional parameters
Parameter	Type	Description	Default value
--directory	String	The path to the directory that contains the package.json file for your application.
The package.json should be in the base directory of your application.

Current working directory
--auth, -a	String	An alias for the credentials to use to authenticate to the instance.	If set, the default alias.
For example:
Explain this code
now-sdk dependencies --directory /path/to/package --auth devuser1
For more information, see Downloading application and script dependencies with the ServiceNow SDK.

transform
Download application metadata (XML) from the instance and transform the metadata into ServiceNow Fluent source code to synchronize the application changes on the instance into your local application.

After initializing an application, you can run the transform command without any parameters to transform new application metadata from the instance into source code in the src/fluent/generated directory and synchronize changes to metadata into source code in the src/fluent directory. To transform metadata that existed when the application was initialized into source code, use the --from parameter to provide the path to a local directory or file that contains XML. If metadata exists in the local application as both XML and source code, the XML version takes precedence when installed on the instance.

The transform command has the following structure:
Explain this code
now-sdk transform [--from <path>] [--directory <package path>] [--preview <flag>] [--auth <alias>] [--format <flag>]

Optional parameters
Parameter	Type	Description	Default value
--from	String	A path to a local directory or file that contains metadata XML to transform into ServiceNow Fluent code.	—
--directory	String	The path to the directory that contains the package.json file for your application.
The package.json should be in the base directory of your application.

Current working directory
--preview	Boolean	An option to preview the transformed ServiceNow Fluent code from the command line without saving the changes.	false
--auth, -a	String	An alias for the credentials to use to authenticate to the instance.	If set, the default alias.
--format, -f	Boolean	An option to format new and updated ServiceNow Fluent source code when it's transformed.	true
For example:
Explain this code
now-sdk transform --from metadata/update --directory /path/to/package --preview true --auth devuser1 --format true
For more information, see Convert an application with the ServiceNow SDK or Build and install an application with the ServiceNow SDK.

download
Download all application metadata (XML) from an application on an instance to compare with the metadata in your local application.

Updates to JavaScript modules aren't included when downloading application metadata from your instance.​

The download command has the following structure:
Explain this code
now-sdk download <directory> [--source <package path>] [--incremental <flag>]
Required parameters
Parameter	Type	Description	Default value
directory	String	A path to any directory in which to download the metadata.
Note: This directory should be a different directory from the metadata directory in your application.
—
Optional parameters
Parameter	Type	Description	Default value
--source	String	The path to the directory that contains the package.json file for your application.
The package.json should be in the base directory of your application.

Current working directory
--incremental	Boolean	An option to download only changes to application metadata made on the instance and recorded in the Customer Updates [sys_update_xml] table.	false
For example:
Explain this code
now-sdk download /path/to/directory --source /path/to/package --incremental true
clean
Remove the build artifacts that were output with the previous build.

The clean command has the following structure:
now-sdk clean <source>
Optional parameters
Parameter	Type	Description	Default value
source	String	The path to the directory that contains the package.json file for your application.
The package.json should be in the base directory of your application.

Current working directory
For example:
Explain this code
now-sdk clean /path/to/package
pack
Package the build artifacts that were output with the previous build into an installable ZIP file.

The pack command has the following structure:
now-sdk pack <source>
Optional parameters
Parameter	Type	Description	Default value
source	String	The path to the directory that contains the package.json file for your application.
The package.json should be in the base directory of your application.

Current working directory
For example:
now-sdk pack /path/to/package