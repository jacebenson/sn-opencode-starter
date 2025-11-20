Create and use JavaScript modules in applications with the ServiceNow SDK
Release version: 
Zurich
UpdatedJul 30, 20253 minutes to readSummarize
Optimize your codebase by defining reusable code blocks with JavaScript modules and the ServiceNow SDK.

Before you begin

Create or convert a scoped application with the ServiceNow SDK. For more information, see Create an application with the ServiceNow SDK or Convert an application with the ServiceNow SDK.

Role required: admin

About this task

To learn about support for using JavaScript modules in scoped applications, including some limitations, see JavaScript modules and third-party libraries. For general information about the syntax used to create JavaScript modules, see the JavaScript modules page on the MDN Web Docs website.

Procedure

In Visual Studio Code, open your scoped application directory.
In the src/server directory of the application, create a JavaScript or TypeScript file to contain the module code you want to reuse.
(Optional) Import server APIs to call them from your module.
Glide APIs can be imported from the @servicenow/glide package or their namespace in the package.

For example:
Explain this code
import { API } from "@servicenow/glide";
import { API } from "@servicenow/glide/<namespace>";
In the module, identify the code to export with export statements.
You can use a named export or default export. Named exports can be variables, constants, functions, or classes whereas default exports can be functions or classes only.

The following example is one way of adding a named export for multiple features (a function and a variable) in a module:
Explain this code
export { myFunction, myVariable };
Use code from the exported module in other modules or server-side scripts.
File	Steps
Module	
From the src/server directory, create or open a JavaScript module.
Import the module code with import statements.
The following example is one way that you could import an exported feature in a module:
Explain this code
import { feature } from "path/to/module";
Note: To import code from one TypeScript file to another TypeScript file, you must include the .ts file extension. For example, import { feature } from './module.ts'.
Call the module code from this module to reuse it.
Server-side script in source code	
Create or open the definition of application metadata that includes a server-side script, such as a business rule, in source code (.now.ts file).
In the script property, import and call the module code to reuse it.
You can import a function or provide an inline script.
Import an exported function, function expression, or default function. For example:
script: FunctionExport,
Inline scripts must use require statements to import the module code. For example:
Explain this code
script: `
    const { process } = require('./dist/modules/server/handler.js')
    process(request, response)`,
For more information about server-side scripts in source code, see ServiceNow Fluent API reference.

Server-side script record	
Open the record for a server-side script, such as a business rule.
Import the module code with require statements.
The following example is one way that you could import an exported feature in a script:
Explain this code
const { feature } = require("path/to/module");
Call the module code from this script to reuse it.
Save your changes.
What to do next

To use third-party libraries in a JavaScript module, see Use third-party libraries in applications with the ServiceNow SDK.

To build your application and add the modules to the EcmaScript Module [sys_module] table, see Build and install an application with the ServiceNow SDK.

Using TypeScript in JavaScript modules with the ServiceNow SDK
Use TypeScript when creating JavaScript modules with the ServiceNow SDK.