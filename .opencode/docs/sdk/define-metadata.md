Define application metadata in code with ServiceNow Fluent and the ServiceNow SDK
Release version: 
Zurich
UpdatedJul 30, 20255 minutes to readSummarize
Define application metadata in code with ServiceNow Fluent and the ServiceNow SDK.

Before you begin

Install the ServiceNow Fluent Language server to get language processing and validation for ServiceNow Fluent in Visual Studio Code. For more information, see Install the ServiceNow Fluent Language server in Visual Studio Code.
Create or convert a scoped application with the ServiceNow SDK. For more information, see Create an application with the ServiceNow SDK or Convert an application with the ServiceNow SDK.
Role required: admin

About this task

ServiceNow Fluent is a domain-specific language (DSL) based on TypeScript for defining the metadata files [sys_metadata] that make up applications and includes APIs for the different types of metadata, such as tables, roles, ACLs, business rules, and Automated Test Framework tests. For more information about ServiceNow Fluent APIs and examples, see ServiceNow Fluent API reference.

Procedure

In Visual Studio Code, open your scoped application directory.
In the src/fluent directory, add a file with the .now.ts extension.
You can define application metadata in a single file or as many .now.ts files as you want and organize files in directories within the fluent directory.
Tip: In the fluent directory, you can refer to an example file named index.now.ts.
In the .now.ts file, use objects in the ServiceNow Fluent APIs to define metadata in the application.
For example, to create a table [sys_db_object] in the application, use the Table API. The following example includes a simple table for to-do lists using a Table object with the necessary properties and values.
Explain this code
export const x_snc_example_to_do = Table({
    name: 'x_snc_example_to_do',
    schema: {
        deadline: DateColumn({ label: 'Deadline' }),
        state: StringColumn({
            label: 'State',
            choices: {
                ready: { label: 'Ready' },
                completed: { label: 'Completed' },
                inProgress: { label: 'In Progress' },
            },
        }),
        task: StringColumn({ label: 'Task', maxLength: 120 }),
    },
})
Note: You can use the Record API to define application metadata that doesn't have a dedicated API.
Add the required imports for the APIs from @servicenow/sdk/core.
For example, to define a table with a date column and string column, import the corresponding objects to use from the Table API:
Explain this code
import { Table, DateColumn, StringColumn } from '@servicenow/sdk/core'
(Optional) For ServiceNow Fluent APIs that use server-side scripts, such as business rules, import code from JavaScript modules to call them from an object's script property.
This example imports the showStateUpdate function, which can then be referenced from the script property.
Explain this code
import { showStateUpdate } from '../server/script.js'
Save your changes.
(Optional) Build and install your application to compile source code into application metadata and make your changes available on the instance. For more information, see Build and install an application with the ServiceNow SDK.
Tip: You can use the following directives in a code comment to help manage your code:
@fluent-ignore: Suppresses ServiceNow Fluent diagnostic warnings and errors in the following line of code.
@fluent-disable-sync: Turns off syncing changes to a ServiceNow Fluent object. Use before a call expression (for example, Record({ ... })) to turn off syncing for that object and its child objects. Only use this directive if you want to ignore changes made outside of the source code to the object and never update it when syncing.
@fluent-disable-sync-for-file: Turns off syncing changes to a ServiceNow Fluent file (.now.ts). Use in the first line of the file to turn off syncing for all code in the file. Only use this directive if you want to ignore changes made outside of the source code to the file and never update it when syncing.
Example: Defining application metadata in source code with ServiceNow Fluent
In files with the .now.ts extension, use objects in the ServiceNow Fluent APIs to define metadata in the application. You must also include the required imports for the APIs from @servicenow/sdk/core. For objects with server-side scripts, such as the BusinessRule object, you can import and use code from JavaScript modules.

Tip: You can use content from another file in ServiceNow Fluent APIs by referring to the file from a property using the syntax Now.include('path/to/file'). Referring to content in a different file instead of including the content inline can be helpful for records with fields that support JavaScript, HTML, CSS, and so on to make developing different file types easier with the appropriate syntax highlighting. The Now.include utility supports two-way synchronization so changes to fields from other ServiceNow AI Platform user interfaces are synced into the referenced file's source code and changes to the code are synced back to metadata across the instance.
The following example includes the definitions of a table, client script, and business rule in the application. The client script uses a script from the client-script.js file. The business rule uses a function from the script.js JavaScript module.
Explain this code
import '@servicenow/sdk/global'
import { BusinessRule, ClientScript, DateColumn, StringColumn, Table } from '@servicenow/sdk/core'
import { showStateUpdate } from '../server/script.js'

//creates todo table, with three columns (deadline, status and task)
export const x_snc_example_to_do = Table({
    name: 'x_snc_example_to_do',
    schema: {
        deadline: DateColumn({ label: 'Deadline' }),
        state: StringColumn({
            label: 'State',
            choices: {
                ready: { label: 'Ready' },
                completed: { label: 'Completed' },
                inProgress: { label: 'In Progress' },
            },
        }),
        task: StringColumn({ label: 'Task', maxLength: 120 }),
    },
})

//creates a client script that pops up 'Table loaded successfully!!' message everytime todo record is loaded
ClientScript({
    $id: Now.ID['cs0'],
    name: 'my_client_script',
    table: 'x_snc_example_to_do',
    active: true,
    appliesExtended: false,
    global: true,
    uiType: 'all',
    description: 'Custom client script generated by Now SDK',
    messages: '',
    isolateScript: false,
    type: 'onLoad',
    script: Now.include('../client/client-script.js'),
})

//creates a business rule that pops up state change message whenever a todo record is updated
BusinessRule({
    $id: Now.ID['br0'],
    action: ['update'],
    table: 'x_snc_example_to_do',
    script: showStateUpdate,
    name: 'LogStateChange',
    order: 100,
    when: 'after',
    active: true,
})
The client script referenced from the ClientScript object:
Explain this code
function onLoad() {
    g_form.addInfoMessage("Table loaded successfully!!")
}
The JavaScript module referenced from the BusinessRule object:
Explain this code
import { gs } from '@servicenow/glide'

export function showStateUpdate(current, previous) { 
    const currentState = current.getValue('state')
    const previousState = previous.getValue('state')

    gs.addInfoMessage(`state updated from "${previousState}" to "${currentState}"`)
}
After building and installing the application, this source code generates the following application metadata files on the instance.

