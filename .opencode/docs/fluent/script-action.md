Script Action API - ServiceNow Fluent
Release version: 
Zurich
UpdatedJul 30, 20252 minutes to readSummarize
The Script Action API defines script actions [sysevent_script_action] that run when an event occurs.

For general information about scheduled script executions, see Script actions.

ScriptAction object
Create a script action [sysevent_script_action] that performs a task when triggered by an event.


Properties
Name	Type	Description
$id	String or Number	Required. A unique ID for the metadata object. When you build the application, this ID is hashed into a unique sys_id.
Format: Now.ID['String' or Number]

name	String	Required. A unique name for the script action.
script	Script	Required. A server-side script that runs when triggered by an event. This property supports a function from a JavaScript module, a reference to another file in the application that contains a script, or inline JavaScript.
Format:
For functions, use the name of a function, function expression, or default function exported from a JavaScript module and import it into the .now.ts file. For information about JavaScript modules, see JavaScript modules and third-party libraries.
To use text content from another file, refer to a file in the application using the following format: Now.include('path/to/file').
To provide an inline script, use string literals or template literals for multiple lines of code: 'Script' or `Script`.
eventName	String	Required. The event that triggers the script action to run. For information about creating events, see Create an event.
active	Boolean	Flag that indicates whether the script action is enabled.
Valid values:
true: The script action executes when triggered by the event.
false: The script action doesn't execute.
Default: false

description	String	A description of the functionality and purpose of the script action.
order	Number	A number indicating the sequence in which the script action should run. If there are multiple script actions on a particular event, the script actions run in the order specified, from lowest to highest.
Default: 100

conditionScript	String	A JavaScript conditional statement that specifies the fields and values that must be true for the script to run.
Note: Don't use this property if you include the condition statement with the script property.
Format:
To use text content from another file, refer to a file in the application using the following format: Now.include('path/to/file').
To provide an inline script, use string literals or template literals for multiple lines of code: 'Script' or `Script`.
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
import { ScriptAction } from '@servicenow/sdk/core'
import { insertIncident } from '../server/scripts.js'

ScriptAction({
    $id: Now.ID['sample-script-action'],
    name: 'SampleScriptAction',
    active: true,
    description: 'Insert an incident',
    script: insertIncident,
    eventName: 'sample.event',
    order: 100,
    conditionScript: "gs.hasRole('my_role')"
})
The script property refers to a function from the scripts.js module. For example:

Explain this code
import { GlideRecord } from '@servicenow/glide'

export const insertIncident = () => {
    var gr = new GlideRecord('incident')
    gr.initialize()
    gr.setValue('short_description', 'New incident from event')
    gr.insert()
}