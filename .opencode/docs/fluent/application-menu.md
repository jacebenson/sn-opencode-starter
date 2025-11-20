Application Menu API - ServiceNow Fluent
Release version: 
Zurich
UpdatedJul 30, 20252 minutes to readSummarize
The Application Menu API defines menus in the application navigator [sys_app_application].

For general information about application menus, see Create an application menu.

ApplicationMenu object
Create a menu for an application [sys_app_application].


Properties
Name	Type	Description
$id	String or Number	Required. A unique ID for the metadata object. When you build the application, this ID is hashed into a unique sys_id.
Format: Now.ID['String' or Number]

title	String	Required. The label for the menu in the application navigator.
active	Boolean	Flag that indicates whether the menu appears in the application navigator.
Valid values:
true: The menu appears.
false: The menu is hidden.
Default: true

roles	Array	A list of variable identifiers of Role objects or names of roles that can access the menu. For more information, see Role API - ServiceNow Fluent.
category	Reference	The variable identifier of a menu category [sys_app_category] that defines the navigation menu style. To define a menu category, use the Record API - ServiceNow Fluent.
For general information about menu categories, see Customize menu categories.

hint	String	A short description of the menu that displays as tooltip when hovering over it.
description	String	Additional information about what the application does.
name	String	An internal name to differentiate between applications with the same title.
order	Number	The relative position of the application menu in the application navigator.
Default: 100

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
import { ApplicationMenu } from "@servicenow/sdk/core";

ApplicationMenu({
   $id: Now.ID['my_app_menu'],
   title: 'My App Menu',
   hint: 'This is a hint',
   description: 'This is a description',
   category: appCategory,
   roles: ['admin'],
   active: true,
})
The category referenced is defined using the Record object:
Explain this code
import { Record } from "@servicenow/sdk/core";

export const appCategory = Record({
   table: 'sys_app_category',
   $id: Now.ID[9],
   data: {
      name: 'example',
      style: 'border-color: #a7cded; background-color: #e3f3ff;',
   },
})