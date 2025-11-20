UI Action API - ServiceNow Fluent
Release version: 
Zurich
UpdatedJul 30, 202510 minutes to readSummarize
The UI Action API defines custom user interface (UI) actions [sys_ui_action], such as buttons, links, and context menu items on forms and lists.

For general information about UI actions, see Create a UI action.

UiAction object
Create a UI action [sys_ui_action] to display on a form.


Properties
Name	Type	Description
$id	String or Number	Required. A unique ID for the metadata object. When you build the application, this ID is hashed into a unique sys_id.
Format: Now.ID['String' or Number]

table	String	Required. The name of the table on which the UI action is available.
By default, the UI action also appears on tables that extend the selected table. For example, Task actions appear on the Incident table. Set the value to global to make the action available on all tables.

name	String	Required. The text that appears on the button, link, or context menu item. The name must be unique within the table specified.
actionName	String	A unique name to use when referencing the UI action in scripts.
active	Boolean	Flag that indicates whether the UI action is enabled.
Valid values:
true: The UI action appears and executes.
false: The UI action is hidden.
Default: true

form	Object	Options for how UI actions appear on forms. For more information, see form object.
list	Object	Options for how UI actions appear on the list view. For more information, see list object.
client	Object	Options to execute the script in the browser. For more information, see client object.
workspace	Object	Options for how UI actions function and appear in workspaces. For more information, see workspace object.
overrides	String or Reference	The name or variable identifier of another UI action that the UI action overrides.
showInsert	Boolean	Flag that indicates whether to show a button on new records before they're inserted.
Valid values:
true: The button appears on records before they're inserted.
false: The button doesn't appear on records that haven't been inserted.
Default: false

showUpdate	Boolean	Flag that indicates whether to show a button on existing records.
Valid values:
true: The button appears on existing records.
false: The button doesn't appear on existing records.
Default: true

showQuery	Boolean	Flag that indicates whether the UI action is visible on a list when a filter query is applied.
Valid values:
true: The UI action appears when a filter query is applied.
false: The UI action doesn't appear a filter query is applied.
Default: false

showMultipleUpdate	Boolean	Flag that indicates whether to show a button when multiple records are selected.
Valid values:
true: The button appears when multiple records are selected.
false: The button doesn't appear when multiple records are selected.
Default: false

condition	String	A JavaScript conditional statement that specifies the fields and values that must be true for the script to run.
Note:
Don't use this property if you include the condition statement with the script property.
The current object isn't available for conditions on a list context menu. If the list's showContextMenu property is true, any use of current on these actions is ignored.
You can reference the parent record for the UI action conditions on a related list button. For example, to disable the New and Edit buttons on the Affected CIs related list for closed changes, copy the global m2m UI actions to the task_ci table and add a condition of parent.active.
If you leave one of the fields that you specify in your condition statement empty, that condition defaults to true.
Format:
To use text content from another file, refer to a file in the application using the following format: Now.include('path/to/file').
To provide an inline script, use string literals or template literals for multiple lines of code: 'Script' or `Script`.
script	Script	A client-side or server-side script that runs when the UI action is executed. Function names must be unique. This property supports inline JavaScript or a reference to another file in the application that contains a script.
Format:
To use text content from another file, refer to a file in the application using the following format: Now.include('path/to/file').
To provide an inline script, use string literals or template literals for multiple lines of code: 'Script' or `Script`.
comments	String	Internal notes about the UI action.
messages	String	Text strings that the UI action can use as a key to look up a localized message alternative from the Message [sys_ui_message] table. Each message key is on a separate line in the Messages field.
The instance looks for a localized message string anytime the UI action makes a getmessage('[message]') call where the message string matches a key in the Messages field. For more information, see Translate a client script message.

hint	String	A short description of the UI action that displays as tooltip when hovering over it.
order	Number	The order in which the UI action appears. The order applies to buttons from left to right and to menu actions from top to bottom.
Default: 100

isolateScript	Boolean	Flag that indicates whether the script runs in strict mode, with access to direct DOM, jQuery, prototype, and the window object turned off.
Valid values:
true: Isolate the script and don't run it in strict mode.
false: Run the script in strict mode.
Default: false

roles	Array	A list of variable identifiers of Role objects or names of roles required for the UI action to apply. For more information, see Role API - ServiceNow Fluent.
includeInViews	Array	A list of names of views in which the UI action is included.
excludeFromViews	Array	A list of names of views from which the UI action is excluded.
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
import { UiAction } from '@servicenow/sdk/core'
        
UiAction({
    $id: Now.ID['car_info'],
    table: 'x_snc_ts_custom_cars',
    actionName: 'Car Information',
    name: 'View car info',
    active: true,
    showInsert: true,
    showUpdate: true,
    hint: 'View car info',
    condition: "current.type == 'SUV'",
    form: {
        showButton: true,
        showLink: true,
        showContextMenu: false,
        style: 'destructive',
    },
    list: {
        showLink: true,
        style: 'primary',
        showButton: true,
        showContextMenu: false,
        showListChoice: false,
        showBannerButton: true,
        showSaveWithFormButton: true,
    },
    workspace: {
        isConfigurableWorkspace: true,
        showFormButtonV2: true,
        showFormMenuButtonV2: true,
        clientScriptV2: `function onClick(g_form) {
                        }`,
    },
    script: `current.name =  "updated by script";
                current.update();`,
    roles: ['u_requestor'],
    client: {
        isClient: true,
        isUi11Compatible: true,
        isUi16Compatible: true,
        },
    order: 100,
    showQuery: false,
    showMultipleUpdate: false,
    isolateScript: false,
    includeInViews: ['specialView'],
    excludeFromViews: [],
})
form object
Configure how a UI action appears on a form.

The form object is a property within the UiAction object.


Properties
Name	Type	Description
showButton	Boolean	Flag that indicates whether to include a button on a form.
Valid values:
true: A button appears on forms.
false: A button doesn't appear on forms.
Default: false

showLink	Boolean	Flag that indicates whether to include a link in the Related Links section of a form.
Valid values:
true: A link appears in the Related Links section.
false: A link doesn't appear in the Related Links section.
Default: false

showContextMenu	Boolean	Flag that indicates whether to include an item in the context menu of a form.
Valid values:
true: An item appears in the context menu.
false: An item doesn't appear in the context menu.
Default: false

style	String	A style that defines how UI action buttons appear on a form.
Valid values:
primary: Colors the UI action blue.
destructive: Colors the UI action red.
unstyled: The UI action isn’t styled.
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
form: {
  showButton: true,
  showLink: true,
  showContextMenu: false,
  style: 'destructive',
}
list object
Configure how a UI action appears on the list view.

The list object is a property within the UiAction object.


Properties
Name	Type	Description
showButton	Boolean	Flag that indicates whether to include a button at the bottom of a list.
Note: Buttons at the bottom of a list appear regardless of condition and are evaluated per record on execution.
Valid values:
true: A button appears at the bottom of lists.
false: A button doesn't appear at the bottom of lists.
Default: false

showLink	Boolean	Flag that indicates whether to include a link in the Related Links section of a list.
Valid values:
true: A link appears in the Related Links section.
false: A link doesn't appear in the Related Links section.
Default: false

showContextMenu	Boolean	Flag that indicates whether to include an item in the context menu of a list.
Valid values:
true: An item appears in the context menu.
false: An item doesn't appear in the context menu.
Default: false

style	String	A style that defines how UI action buttons appear on the list view.
Valid values:
primary: Colors the UI action blue.
destructive: Colors the UI action red.
unstyled: The UI action isn’t styled.
showListChoice	Boolean	Flag that indicates whether to include a choice in the Actions list of a list.
Note: Choices in the Actions list appear regardless of condition and are evaluated per record on execution.
Valid values:
true: A choice appears in the Actions list.
false: A choice doesn't appear in the Actions list.
Default: false

showBannerButton	Boolean	Flag that indicates whether to include a button on the banner of a list.
Note: Buttons on the banner of a list aren’t intended to support record-specific conditions. Only the first row is considered when the condition is evaluated to determine whether the button appears for the list. Don't use record-specific conditions, such as current.getValue('state') === 'closed'.
Valid values:
true: A button appears on the banner of lists.
false: A button doesn't appear on the banner of lists.
Default: false

showSaveWithFormButton	Boolean	Flag that indicates whether the form is saved when accessed from a list before executing the UI action button.
Valid values:
true: The form must be saved before the UI action executes.
false: The form doesn't have to be saved before the UI action executes.
Default: false

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
list: {
  showButton: true,
  showLink: true,
  showContextMenu: false,
  style: 'primary',
  showListChoice: false,
  showBannerButton: true,
  showSaveWithFormButton: true,
}
client object
Configure options to execute the UI action script in the browser.

The client object is a property within the UiAction object.


Properties
Name	Type	Description
isClient	Boolean	Flag that indicates where the UI action script runs.
Valid values:
true: The script runs on the client (the user's browser).
false: The script runs on the server.
Default: false

isUi11Compatible	Boolean	Flag that indicates whether the UI action is supported in the legacy UI 11.
Valid values:
true: The UI action is supported in the legacy UI 11.
false: The UI action isn't supported in the legacy UI 11.
Default: false

isUi16Compatible	Boolean	Flag that indicates whether the UI action is supported in the Core UI.
Valid values:
true: The UI action is supported in the Core UI.
false: The UI action isn't supported in the Core UI.
Default: false

onClick	String	The name of the JavaScript function to run when the UI action is executed. The function is defined with the script property.
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
client: {
  isClient: true,
  isUi11Compatible: true,
  isUi16Compatible: true,
  onClick: 'reopenIncident()'
}
workspace object
Configure how a UI action functions and appears in workspaces.

The workspace object is a property within the UiAction object.


Properties
Name	Type	Description
isConfigurableWorkspace	Boolean	Flag that indicates the type of workspace in which a UI action applies.
Valid values:
true: The UI action applies to Configurable Workspaces.
false: The UI action applies to Legacy Workspaces.
Default: false

showFormButtonV2	Boolean	Flag that indicates whether to include a button on forms in a workspace.
Valid values:
true: A button appears on forms.
false: A button doesn't appear on forms.
Default: false

showFormMenuButtonV2	Boolean	Flag that indicates whether to include an item in the More Actions menu in a workspace.
Valid values:
true: An item appears in the More Actions menu.
false: An item doesn't appear in the More Actions menu.
Default: false

clientScriptV2	String	A script that runs when the UI action is executed in workspaces. This property supports inline JavaScript or a reference to another file in the application that contains a script.
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
workspace: {
  isConfigurableWorkspace: true,
  showFormButtonV2: true,
  showFormMenuButtonV2: true,
  clientScriptV2: `function onClick(g_form) {
  }`,
}