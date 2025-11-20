Use third-party libraries in applications with the ServiceNow SDK
Release version: 
Zurich
UpdatedJul 30, 20251 minute read
Call third-party libraries in your application to use existing open-source functionality with the ServiceNow SDK.

Before you begin

Create a JavaScript module. For more information, see Create and use JavaScript modules in applications with the ServiceNow SDK.

Role required: admin

About this task

Third-party libraries are added to applications as JavaScript modules. For general information about the syntax used to create JavaScript modules, see the JavaScript modules page on the MDN Web Docs website.

Important: You can't use third-party libraries that rely on unsupported functionality, such as unsupported APIs or ECMAScript features. For more information about unsupported functionality, see JavaScript modules and third-party libraries.
Procedure

In Visual Studio Code, open your scoped application directory.
From the application directory, open an integrated Terminal window.
Install the npm package for the library.
npm install <package name>
The library's packages are added to your application in the node_modules directory, and the library is added as a dependency in the package.json file for the application.
Explain this code
"dependencies": {
    "<package name>": "<version>"
  }
In a JavaScript module, import the library using an import statement.
In this example, the module includes a namespace import for the lodash module.
Explain this code
import * as lodash from "lodash"
In this example, the module includes a named import for the camelCase function in the lodash module.

Explain this code
import camelCase from 'lodash'
Call code imported from the library in your module to reuse it.
What to do next

Build and install your changes on an instance. For more information, see Build and install an application with the ServiceNow SDK.