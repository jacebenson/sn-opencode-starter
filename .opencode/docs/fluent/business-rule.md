Business Rule API - ServiceNow Fluent
Release version: 
Zurich
UpdatedJul 30, 20254 minutes to readSummarize
The Business Rule API defines server-sides scripts [sys_script] that run when a record is displayed, inserted, updated, or deleted, or when a table is queried.

For general information about business rules, see Classic Business rules.

BusinessRule object
Create a business rule [sys_script] that automatically changes values in form fields when certain server-side conditions are met.


Properties
Name	Type	Description
$id	String or Number	Required. A unique ID for the metadata object. When you build the application, this ID is hashed into a unique sys_id.
Format: Now.ID['String' or Number]

name	String	Required. A name for the business rule.
table	String	Required. The name of the table on which the business rule runs.
script	Script	A custom script runs when the defined conditions are true. This property supports a function from a JavaScript module, a reference to another file in the application that contains a script, or inline JavaScript.
Format:
For functions, use the name of a function, function expression, or default function exported from a JavaScript module and import it into the .now.ts file. For information about JavaScript modules, see JavaScript modules and third-party libraries.
To use text content from another file, refer to a file in the application using the following format: Now.include('path/to/file').
To provide an inline script, use string literals or template literals for multiple lines of code: 'Script' or `Script`.
order	Number	A number indicating the sequence in which the business rule should run. If there are multiple rules on a particular activity, the rules run in the order specified, from lowest to highest.
Default: 100

active	Boolean	Flag that indicates whether the business rule is enabled.
Valid values:
true: The business rule is enforced.
false: The business rule isn't enforced.
Default: true

when	String	The time that the business rule should execute. For more information about when business rules run, see How business rules work.
Valid values:
before
after
async
display
Default: before

action	Array	The record options that the business rule applies to. For more information about business rule actions, see How business rules work.
Valid values:
insert
update
delete
query
addMessage	Boolean	Flag that indicates whether to add a message that appears when the business rule runs.
Valid values:
true: Displays a message.
false: Doesn't display a message.
Default: false

abortAction	Boolean	Flag that indicates whether to abort the current database transaction. For example, on a before insert business rule, if the conditions are met, don't insert the record into the database.
Valid values:
false: Doesn't abort the current database transaction.
true: Aborts the current database transaction. You can't perform additional actions on the record, such as setting field values and running scripts. You can still display a message to users with the addMessage and message properties.
Default: false

message	String	A message that appears when the business rule runs.
roleConditions	Array	A list of variable identifiers of Role objects that users who are modifying records in the table must have for the business rule to run. For more information, see Role API - ServiceNow Fluent.
condition	String	A JavaScript conditional statement that specifies the fields and values that must be true for the script to run. This property supports inline JavaScript or a reference to another file in the application that contains a script.
Note: Don't use this property if you include the condition statement with the filterCondition or script properties.
By specifying the condition statement with this property, the condition is evaluated separately, and the business rule runs only if the condition is true. To have the condition statement reevaluated a second time before running an async business rule, set the glide.businessrule.async_condition_check system property to true.

Format:
To use text content from another file, refer to a file in the application using the following format: Now.include('path/to/file').
To provide an inline script, use string literals or template literals for multiple lines of code: 'Script' or `Script`.
filterCondition	String	A filter query that specifies the fields and values that must be true for the business rule to run. For more information, see Operators available for filters and queries.
setFieldValue	String	The values to set for fields in the table. This can be provided as an encoded query, such as setFieldValue: 'sec_created=false^EQ'.
description	String	A description of what the business rule does.
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
import { BusinessRule } from '@servicenow/sdk/core'
import { FunctionExport, FunctionExpression } from '../server/scripts.js'
import DefaultExportFunction from '../server/scripts.js'

const BR1 = BusinessRule({
    name: 'exportedFunction',
    table: 'x_snc_table',
    when: 'after',
    action: ['update', 'delete', 'insert'],
    script: FunctionExport,
    order: 100,
    active: true,
    addMessage: false,
    message: '<p>message</p>',
    abortAction: false,
    $id: Now.ID[0],
})

const BR2 = BusinessRule({
    name: 'businessrule2',
    table: 'x_snc_table',
    script: FunctionExpression,
    when: 'after',
    action: ['update'],
    $id: Now.ID[1],
})

const BR3 = BusinessRule({
    name: 'businessrule3',
    table: 'x_snc_table',
    script: DefaultExportFunction,
    when: 'after',
    action: ['update'],
    filterCondition: `sys_updated_onSTARTSWITHb^sys_updated_bySTARTSWITHm^EQ
    <item goto="false" or="false" field="sys_updated_on" endquery="false" value="b" operator="STARTSWITH" newquery="false"/>
    <item goto="false" or="false" field="sys_updated_by" endquery="false" value="m" operator="STARTSWITH" newquery="false"/>
    <item goto="false" or="false" field="" endquery="true" value="" operator="=" newquery="false"/>`,
    $id: Now.ID[2],
})

const BR4 = BusinessRule({
    name: 'templateBR',
    action: ['insert'],
    when: 'after',
    table: 'x_snc_table',
    roleConditions: [admin],
    order: 100,
    active: true,
    addMessage: true,
    message: '<p>message</p>',
    script: `gs.info('info')`,
    abortAction: false,
    $id: Now.ID[3],
})