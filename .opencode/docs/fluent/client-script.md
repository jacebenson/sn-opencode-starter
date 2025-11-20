Client Script API - ServiceNow Fluent
Release version: 
Zurich
UpdatedJul 30, 20253 minutes to readSummarize
The Client Script API defines client-side scripts [sys_script_client] that run JavaScript on the client (web browser) when client-based events occur, such as when a form loads, after form submission, or when a field changes value.

For general information about client scripts, see Client scripts.

ClientScript object
Create a client script [sys_script_client] to configure forms, form fields, and field values while the user is using the form.


Properties
Name	Type	Description
$id	String or Number	Required. A unique ID for the metadata object. When you build the application, this ID is hashed into a unique sys_id.
Format: Now.ID['String' or Number]

table	String	Required. The name of the table on which the client script runs.
name	String	Required. The name of the client script.
active	Boolean	Flag that indicates whether the client script is enabled.
Valid values:
true: The script is enabled.
false: The script isn't enabled.
Default: true

appliesExtended	Boolean	Flag that indicates whether the client script applies to tables extended from the specified table.
Valid values:
true: The script applies to extended tables.
false: The script doesn't apply to extended tables.
Default: false

uiType	String	The user interface to which the client script applies.
Valid values:
desktop
mobile_or_service_portal
all
Default: desktop

description	String	A description of the functionality and purpose of the client script.
messages	String	Text strings that are available to the client script as localized messages using getmessage('[message]'). For more information, see Translate a client script message.
isolateScript	Boolean	Flag that indicates whether the script runs in strict mode, with access to direct DOM, jQuery, prototype, and the window object turned off.
Valid values:
true: Isolate the script and don't run it in strict mode.
false: Run the script in strict mode.
Default: false

script	Script	A client-side script that runs in the browser. This property supports inline JavaScript or a reference to another file in the application that contains a script.
Format:
To use text content from another file, refer to a file in the application using the following format: Now.include('path/to/file').
To provide an inline script, use string literals or template literals for multiple lines of code: 'Script' or `Script`.
global	Boolean	Flag that indicates on which views of the table the client script runs.
Valid values:
true: The script runs on all views.
false: The script runs only on the specified views.
Default: true

view	String	The views of the table on which the client script runs. This property applies only when the global property is set to false.
type	String	The type of client script, which defines when it runs. For more information about the supported types, see Client scripts.
Valid values:
onCellEdit: Runs when the list editor changes a cell value.
onChange: Runs when a particular field value changes on the form.
onLoad: Runs when the system first renders the form and before users can enter data. Typically, onLoad() client scripts perform client-side-manipulation of the current form or set default record values.
onSubmit: Runs when a form is submitted. Typically, onSubmit() scripts validate things on the form and ensure that the submission makes sense. An onSubmit() client script can cancel form submission by returning a value of false.
field	String	A field on the table that the client script applies to. This property applies only when the type property is set to onChange or onCellEdit.
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
Explain this code
import { ClientScript } from '@servicenow/sdk/core'

export const cs = ClientScript({
   $id: Now.ID['my_scripts'], 
   name: 'my_scripts',
   table: 'incident',
   active: true, 
   appliesExtended: false, 
   global: true,
   uiType: 'all', 
   messages: '', 
   isolateScript: false, 
   type: 'onLoad',
   script: Now.include('../client/client-script.js'),
})
The client script is defined in the client-script.js file referenced from the script property. For example:
Explain this code
function onLoad() { 
    const x = 'util' g_form.addInfoMessage(x) 
}