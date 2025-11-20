Using TypeScript in JavaScript modules with the ServiceNow SDK
Release version: 
Zurich
UpdatedJul 30, 20253 minutes to readSummarize
Use TypeScript when creating JavaScript modules with the ServiceNow SDK.

TypeScript uses static typing and type annotations to support developers catching errors earlier while writing code in Visual Studio Code.

For general information about using TypeScript, see the TypeScript Documentation on the typescriptlang.org website.

Use TypeScript in JavaScript modules
Use TypeScript in JavaScript modules by adding support for TypeScript in your application.

Before you begin

Install TypeScript version 4.8.4 or later. For installation instructions, see Download TypeScript on the typescriptlang.org website.

Role required: admin

About this task

Follow this procedure to update existing applications that weren't created using a TypeScript template to use TypeScript in modules. Beginning with the ServiceNow SDK version 3.0, applications support using TypeScript in JavaScript modules by default using default compiler options. To use a tsconfig.json file with custom options for transpiling TypeScript into JavaScript during the build process, configure the tsconfigPath parameter in the now.config.json file. If you want to use a custom transpilation step before building the application, configure the modulePaths parameter in the now.config.json file.

Procedure

In Visual Studio Code, open your scoped application directory.
Open the application's package.json file and in the devDependencies object, add the TypeScript package and version.
Explain this code
"devDependencies": {
    "typescript": "<version>",
    "@servicenow/sdk": "2.0.0",
    "@servicenow/glide": "26.0.1",
    "eslint": "8.50.0",
    "@servicenow/eslint-plugin-sdk-app-plugin": "2.0.0"
  }
In your application's src/server directory, add a tsconfig.json file that defines the options for compiling the application.
Explain this code
{
    "compilerOptions": {
        "rootDir": "./",
        "outDir": "../../dist/server",
        "module": "es2022",
        "target": "es2022",
        "moduleResolution": "bundler",
        "allowJs": true,
        "declaration": false,
        "sourceMap": false,
        "skipLibCheck": true,
        "allowImportingTsExtensions": true,
        "noEmit": true
    },
    "include": [
        "./**/*.ts"
    ],
    "exclude": [
        "**/*.now.ts"
    ]
}
In the application's now.config.json file, set the tsconfigPath parameter to the location of the tsconfig.json in the application. .
Explain this code
{
  "scope": "x_snc_example_app",
  "scopeId": "2f8400eb07426110f736e28f69d3017a",   
  "name": "ExampleApp",
  "tsconfigPath": "./src/server/tsconfig.json"
  
}
In the src/server directory, add at least one .ts file to contain module code.
For information about creating modules, see Create and use JavaScript modules in applications with the ServiceNow SDK.
Compile TypeScript files into JavaScript modules and build your application.
From your application directory, open a command-line tool on your system.
Enter the following command:
now-sdk build
Add type definitions for APIs
Get type-ahead support for APIs and scriptable objects outside of Glide APIs.

Before you begin

Role required: admin

About this task

Declare modules directly in the ServiceNow SDK application to stub access to the APIs for type-ahead support. These modules aren't packaged in the application package, but they can be tracked in a source control repository for the application and shared between developers.

Procedure

In Visual Studio Code, open your scoped application directory.
In your application, add a TypeScripe (.ts) file for type definitions.
In your TypeScript file, declare modules for APIs and scriptable objects.
This example declares a module for an API using the API namespace (sn_app_api):
Explain this code
declare module '@servicenow/glide/sn_app_api' {
	class AppStoreAPI {
		static canUpgradeAnyStoreApp(): boolean
	}
} 
This example declares a module to access objects defined in script includes using the scope of the script include (x_1234_scope):
Explain this code
declare module '@servicenow/glide/x_1234_scope' {
	class MyLogItemClass {
		myLogFunction()
	}
}
In JavaScript modules in your application, import the declared modules.
This example imports the declared module for the AppStoreAPI.
Explain this code
import { gs } from '@servicenow/glide'
import { AppStoreAPI } from '@servicenow/glide/sn_app_api'

export const canUpgradeStoreApp = function () {
	var canUpgrade = AppStoreAPI.canUpgradeAnyStoreApp()
	if (canUpgrade) {
		gs.addInfoMessage(`You can upgrade store apps!`)
	} else {
		gs.addInfoMessage(`You cannot upgrade store apps!`)
	}
}
This example imports the declared module for the MyLogItemClass object.
Explain this code
import { MyLogItemClass } from '@servicenow/glide/x_1234_scope'

export const myLogFunction = function (status) {
	const myLogItem = new MyLogItemClass()
	myLogItem.myLogFunction(status)
}
Note: Modules can access only global scriptable objects or scriptable objects in the same application scope.