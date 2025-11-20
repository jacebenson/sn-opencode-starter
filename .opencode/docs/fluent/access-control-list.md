Access Control List API - ServiceNow Fluent
Release version: 
Zurich
UpdatedJul 30, 20256 minutes to readSummarize
The Access Control List API defines access control lists [sys_security_acl] that secure parts of an application.

For general information about access control lists (ACLs), see Access Control List Rules.

ACL object
Configure a custom ACL rule [sys_security_acl] to secure access to new objects or to change the default security behavior.

ACLs must include one or more roles, a security attribute, a condition, or a script.


Properties
Name	Type	Description
$id	String or Number	Required. A unique ID for the metadata object. When you build the application, this ID is hashed into a unique sys_id.
Format: Now.ID['String' or Number]

operation	String	Required. The operation that this ACL rule secures. An ACL rule can only secure one operation. To secure multiple operations, create a separate ACL rule for each.
The operation must be execute if the type property is client_callable_flow_object, client_callable_script_include, graphql, processor, or rest_endpoint.

Valid values:
execute: Allow users to execute scripts on a record or UI page.
create: Allow users to insert new records (rows) into a table.
read: Allow users to display records from a table.
write: Allow users to update records in a table.
delete: Allow users to remove records from a table or drop a table.
conditional_table_query_range: Enables users to give partial ACL-access based on read ACLs. Created for the tables that have the read ACLs without Data condition and script.
data_fabric: Enable users to allow Data Fabric connectors to access data on a particular table.
query_match: Enables users to submit match queries (such as "is", "is not", and "is empty").
query_range: Enables users to submit range queries (such as "starts with", "ends with", and "contains") and sorting is unrestricted.
edit_task_relations: Allow users to extend the Task [task] table.
edit_ci_relations: Allow users to extend the Configuration Item [cmdb_ci] table.
save_as_template: Allow users to save a record as a template.
add_to_list: Allow users from viewing or personalizing specific columns in the list mechanic. Conditions and scripts aren't supported.
report_on: Allow users to report on tables.
list_edit: Allow users to update records (rows) from a list.
report_view: Allow users to report on field ACLs.
personalize_choices: Allow users to configure the table or field.
type	String	Required. The type of object that this ACL rule secures. The type determines which operations are available.
After creating an ACL rule, if you want to change the type, you must delete the ACL and create a new one with the correct type.

Valid values:
record
rest_endpoint
ui_page
processor
graphql
pd_action
ux_data_broker
ux_page
ux_route
client_callable_flow_object
client_callable_script_include
Default: record

active	Boolean	Flag that indicates whether the ACL rule is enforced.
Valid values:
true: The ACL rule is enforced.
false: The ACL rule isn't enforced.
Default: true

adminOverrides	Boolean	Flag that indicates whether users with the admin role automatically pass the permissions check for this ACL rule.
Valid values:
true: Administrators automatically pass the permissions check.
If true, admin users pass the permissions check regardless of what script or role restrictions apply. However, the nobody role, which only ServiceNow personnel can assign, takes precedence over the admin override option. If an ACL is assigned the nobody role, admin users cannot access the resource even when admin_overrides is true. For more information, see Base system roles.

false: Administrators must meet the permissions defined in this ACL rule to gain access to the secured object. Use the condition or script properties to create a permissions check that administrators must pass.
Default: true

script	Script	A custom script that defines the permissions required to access the object. This property supports a function from a JavaScript module, a reference to another file in the application that contains a script, or inline JavaScript.
ACLs must include one or more roles, a security attribute, a condition, or a script.

Note: If the type property is graphql, scripts aren't supported.
The script can use the values of the current and previous global variables and system properties. The script must generate a true or false response in one of two ways:
return an answer variable set to a value of true or false
evaluate to true or false
In either case, users only gain access to the object when the script evaluates to true and the user meets any conditions the ACL rule has. Both the conditions and the script must evaluate to true for a user to access the object.
Note: If the evaluated item is in a related list, current points to the item the related list is on, not to the current item the ACL is for. However, If the item you are evaluating the ACL for is not in a related list, current points to the actual item.
Format:
For functions, use the name of a function, function expression, or default function exported from a JavaScript module and import it into the .now.ts file. For information about JavaScript modules, see JavaScript modules and third-party libraries.
To use text content from another file, refer to a file in the application using the following format: Now.include('path/to/file').
To provide an inline script, use string literals or template literals for multiple lines of code: 'Script' or `Script`.
description	String	A description of the object or permissions this ACL rule secures.
localOrExisting	String	The type of security attribute to apply.
Valid values:
Local: A security attribute based on the condition property that is saved only for the ACL it is created in.
Existing: An existing security attribute to reference in the security_attribute property.
Default: Local

decisionType	String	An option for whether the ACL should allow or deny access.
Valid values:
allow: The ACL allows access.
deny: The ACL denies access.
Default: allow

condition	String	A filter query that specifies the fields and values that must be true for users to access the object. For more information, see Operators available for filters and queries.
ACLs must include one or more roles, a security attribute, a condition, or a script.

roles	Array	A list of variable identifiers of Role objects or sys_ids of roles that a user must have to access the object. For more information, see Role API - ServiceNow Fluent.
ACLs must include one or more roles, a security attribute, a condition, or a script.

Note: Users with the admin role always pass this permissions check because the admin role automatically grants users all other roles.
securityAttribute	String	Pre-defined conditions for the ACL to use. For example, whether a user is impersonating another user. For more information about security attributes, see OOB (Out-of-Box) Security Attributes.
ACLs must include one or more roles, a security attribute, a condition, or a script.

Note: For security attributes with the Is localized field set to true, the localOrExisting property of the ACL should be set to Local. If the Is localized field is false, the localOrExisting property should be set to Existing.
table	String	The name of the table to which the ACL applies.
This property only applies and is required if the type property is one of the following values: ux_data_broker, ux_page, ux_route, pd_action, or record.

field	String	The name of a field on the table to secure. You can use the wildcard character ("*") to select all fields.
name	String	The name of the ACL.
This property only applies and is required if the type property is one of the following values: rest_endpoint, ui_page, processor, graphql, client_callable_flow_object, or client_callable_script_include.

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
import { Acl } from "@servicenow/sdk/core";

export default Acl({
    $id: Now.ID['task_delete_acl'],
    active: true,
    adminOverrides: true,
    type: 'record',
    table: 'task',
    field: 'description',
    operation: 'delete',
    roles: [adminRole, managerRole],
})
The roles referenced are defined using the Role object:
Explain this code
import { Role } from "@servicenow/sdk/core";

const managerRole = Role({ 
   $id: Now.ID['manager_role'], 
   name: 'x_snc_example.manager' 
})

const adminRole = Role({ 
   $id: Now.ID['admin_role'], 
   name: 'x_snc_example.admin', 
   containsRoles: [managerRole] 
})