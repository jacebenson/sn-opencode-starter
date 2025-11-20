## List API - ServiceNow Fluent

Release version:  Zurich
UpdatedJul 30, 20252 minutes to readSummarize
The List API defines list views [sys_ui_list] for tables.

For general information about lists, see ServiceNow AI Platform® list administration.

List object
Configure lists [sys_ui_list] and their views.


Properties
Name	Type	Description
table	String	Required. The name of the table to which the list applies.
view	Reference or String	Required. The variable identifier or name of the UI view [sys_ui_view] to apply to the list or the default view.
To define a UI view, see Record API - ServiceNow Fluent.

To use the default view (default_view), you must import it:
Explain this code
import { default_view } from '@servicenow/sdk/core'
columns	Array	Required. A list of columns in the table to display in the list, specified using the column name and position in the list.
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
import { List } from "@servicenow/sdk/core";

List({
    $id: Now.ID["app_task_view_list"],
    table: "cmdb_ci_server",
    view: app_task_view,
    columns: [
        { element: "name", position: 0 },
        { element: "business_unit", position: 1 },
        { element: "vendor", position: 2 },
        { element: "cpu_type", position: 3 },
    ],
});
The UI view definition referenced is defined using the Record object:
Explain this code
import { Record } from "@servicenow/sdk/core";

const app_task_view = Record({
   $id: Now.ID['app_task_view'],
   table: 'sys_ui_view',
   data: {
        name: 'app_task_view',
        title: 'app_task_view'
   }
})