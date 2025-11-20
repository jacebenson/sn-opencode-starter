Role API - ServiceNow Fluent
Release version: 
Zurich
UpdatedJul 30, 20252 minutes to readSummarize
The Role API defines roles [sys_user_role] that grant specific permissions to users of an application.

For general information about user roles, see Managing roles.

Role object
Create a role [sys_user_role] to control access to applications and their features.


Properties
Name	Type	Description
name	String	A name for the role beginning with the application scope in the following format: <scope>.<name>.
assignableBy	String	Other roles that can assign this role to users.
canDelegate	Boolean	Flag that indicates if the role can be delegated to other users. For more information, see Delegating roles.
Valid values:
true: The role can be delegated to other users.
false: The role can't be delegated to other users.
Default: true

description	String	A description of what the role can access.
elevatedPrivilege	Boolean	Flag that indicates whether manually accepting the responsibility of using the role before you can access the features of the role is required. For more information about elevated privileges, see Elevated privilege roles.
Valid values:
true: You must manually accept the responsibility of using the role before you can access its features.
false: You don't need to manually accept the responsibility of using the role to access its features.
Default: false

grantable	Boolean	Flag that indicates whether the role can be granted independently.
Valid values:
true: The role can be granted independently.
false: The role can't be granted independently.
Default: true

containsRoles	Array	The variable identifiers of other Role objects that this role contains.
scopedAdmin	Boolean	Flag that indicates whether the role is an Application Administrator role. For general information about application administration roles, see Application administration.
Valid values:
true: The role is an Application Administrator.
false: The role isn't an Application Administrator.
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