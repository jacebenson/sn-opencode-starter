Property API - ServiceNow Fluent
Release version: 
Zurich
UpdatedJul 30, 20253 minutes to readSummarize
The Property API defines system properties [sys_properties] that control instance behavior.

For general information about system properties, see Add a system property.

Property object
Add a system property [sys_properties] for configuring an aspect of an application.


Properties
Name	Type	Description
$id	String or Number	Required. A unique ID for the metadata object. When you build the application, this ID is hashed into a unique sys_id.
Format: Now.ID['String' or Number]

name	String	Required. The name of the property beginning with the application scope in the following format: <scope>.<name>.
value	Any	A value for the property. The value must be the correct data type.
All property values are stored as strings. When retrieving properties via the gs.getProperty() method, treat the results as strings. For example, a true|false property returns 'true' or 'false' (strings), not the Boolean equivalent.

type	String	A data type for the property value.
Valid values: string, integer, boolean, choicelist, color, date_format, image, password, password2, short_string, time_format, timezone, uploaded_image

description	String	A description of what the property does.
choices	Array	A comma-separated list of choice values. This property only applies if the type property is set to choicelist.
If you need a different choice label and value, use an equal sign (=) to separate the label from the value. For example, ['Blue=0000FF', 'Red=FF0000', 'Green=00FF00'] displays Blue, Red, and Green in the list, and saves the corresponding hex value in the property value field.

roles	Object	The variable identifiers of Role objects or names of roles that have read or write access to the property. For example:
roles: {
   read: [activity_admin, 'app_user'],
   write: [admin]
}
For more information, see Role API - ServiceNow Fluent.

ignoreCache	Boolean	Flag that indicates whether to cache flush when the value of the property is set.
The system stores system property values in server-side caches to avoid querying the database for configuration settings. When you change a system property value, the system flushes the cache for the System Properties [sys_properties] table. Use this field to determine whether to flush this property's value from all other server-side caches.

Valid values:
true: The system ignores flushing some server-side caches, thus flushing only the cache for the System Properties [sys_properties] table and preserving the prior property value in all other caches. This option avoids the performance cost of flushing all caches and retrieving new property values. Generally, you should only set this property to true when you have a system property that changes more frequently than once a month, and the property value is only stored in the System Properties [sys_properties] table table.
false: The system flushes all server-side caches and retrieves the current property value from the database. Set this property to false for all caches to have the current property value.
Default: false

isPrivate	Boolean	Flag that indicates whether to exclude the property from being imported via update sets.
Keeping system properties private helps prevent settings in one instance from overwriting values in another instance. For example, you might not want a system property in a development instance to use the same value as a production instance.

Valid values:
true: The property isn’t included in update sets.
false: The property is included in update sets.
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
import { Property } from '@servicenow/sdk/core'

Property({
   $id: Now.ID['1234'],
   name: 'x_snc_app.some.new.prop',
   type: 'string',
   value: 'hello',
   description: 'A new property',
   roles: {
      read: ['admin'],
      write: [adminRole, managerRole],
   },
   ignoreCache: false,
   isPrivate: false,
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