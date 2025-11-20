Script Include API - ServiceNow Fluent
Release version: 
Zurich
UpdatedJul 30, 20253 minutes to readSummarize
The Script Include API defines script includes [sys_script_include] that store JavaScript functions and classes for use by server-side scripts.

Note: For new scripts, use JavaScript modules instead of script includes when possible to support code reuse and using third-party libraries within a scoped application. For more information about JavaScript module support and limitations, see JavaScript modules and third-party libraries.
For general information about script includes, see Script includes.

ScriptInclude object
Create a script include [sys_script_include] to define a server-side script that runs when called from other scripts.


Properties
Name	Type	Description
$id	String or Number	Required. A unique ID for the metadata object. When you build the application, this ID is hashed into a unique sys_id.
Format: Now.ID['String' or Number]

name	String	Required. The name of the script include. If you define a class, the name must match the name of the class, prototype, and type. If you use a classless (on demand) script include, the name must match the function name.
script	Script	Required. A server-side script to call from other scripts. The script must define a single JavaScript class or a global function. The class or function name must match the name property. This property supports inline JavaScript or a reference to another file in the application that contains a script.
Format:
To use text content from another file, refer to a file in the application using the following format: Now.include('path/to/file').
To provide an inline script, use string literals or template literals for multiple lines of code: 'Script' or `Script`.
apiName	String	An internal name for the script include, which is used to call the script include from out-of-scope applications.
Default: <scope>.<name>

description	String	A description of the purpose and function of the script include.
clientCallable	Boolean	Flag that indicates whether client-side scripts can call the script include using GlideAjax.
The script include is available to client scripts, list/report filters, reference qualifiers, or if specified as part of the URL. Client callable script includes are invoked from GlideAjax and require users to satisfy an ACL associated with the script include.

Valid values:
true: The script include is available to client-side scripts.
false: The script include isn't available to client-side scripts.
Default: false

mobileCallable	Boolean	Flag that indicates whether the script include is available to client scripts called from mobile devices.
Valid values:
true: The script include is available to client scripts called from mobile devices.
false: The script include isn't available to client scripts called from mobile devices.
Default: false

sandboxCallable	Boolean	Flag that indicates whether the script include is available to scripts invoked from the script sandbox, such as a query condition.
Important: Script includes should only be made available to the script sandbox if necessary.
Valid values:
true: The script include is available to scripts invoked from the script sandbox.
false: The script include isn't available to scripts invoked from the script sandbox.
Default: false

callerAccess	String	An option for how cross-scope access to the script include is permitted. For more information, see Restricted caller access privilege settings.
Valid values:
restriction: Calls to the script include must be manually approved. Access requests are tracked in the Restricted Caller Access table with a status of Requested.
tracking: Calls to the script include are automatically approved. Calls are tracked in the Restricted Caller Access table with a status of Allowed.
accessibleFrom	String	Specifies which applications can access the script include.
Valid values:
public: All application scopes can call the script include.
package_private: The script include can only be called from the application scope that it's within.
Default: package_private

active	Boolean	Flag that indicates whether the script include is enabled.
Valid values:
true: The script include is callable.
false: The script include isn't callable.
Default: true

$meta	Object	Metadata for the application metadata.
With the installMethod property, you can map the application metadata to an output directory that loads only in specific circumstances.
Explain this code
$meta: {
      installMethod: 'String'
}
Valid values for installMethod:
demo: Outputs the application metadata to the metadata/unload.demo directory to be installed with the application when the Load demo data option is selected.
first install: Outputs the application metadata to the metadata/unload directory to be installed only the first time an application is installed on an instance.
Example
In the following example, the script include uses a script from the SampleClass.server.js file.
Explain this code
import { ScriptInclude } from '@servicenow/sdk/core';

ScriptInclude({
    $id: Now.ID['sample-script-include'],
    name: 'SampleScriptInclude',
    script: Now.include("./SampleClass.server.js"),
    description: 'some description',
    apiName: 'x_scope.SampleScriptInclude',
    callerAccess: 'tracking',
    clientCallable: true,
    mobileCallable: true,
    sandboxCallable: true,
    accessibleFrom: 'public',
    active: true,
})