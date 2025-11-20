Table API - ServiceNow Fluent
Release version: 
Zurich
UpdatedJul 30, 202513 minutes to readSummarize
The Table API defines tables [sys_db_object] to store data in a scoped application.

Create a table using the Table object. From the schema property, add Column objects, such as StringColumn or IntegerColumn, to define the columns.

For general information about tables, see Table administration.

Table object
Create a table [sys_db_object] in a scoped application.


Properties
Name	Type	Description
name	String	Required. A name for the table beginning with the application scope and in all lowercase letters in the following format: <scope>_<name>. The name should match the variable identifier of the Table object.
Note: To add columns to an existing table in a different application scope, you can provide the name of the table without the application scope followed by as any. The column names must begin with the application scope instead.
Maximum length: 80

schema	Array	Required. A list of Column objects. For more information, see Column object.
extends	String	The name of any other table on which the table is based.
Extending a base table incorporates all the fields of the original table and creates system fields for the new table. If they are in the same scope or if they can be configured from other scopes, you can extend tables that are marked as extensible.

label	String or Array	A unique label for the table in list and form views. Field labels can be provided as a string or an array of label objects. For more information, see label object.
Maximum length: 80

Default: the value of the name property

licensingConfig	Object	The licensing configuration [ua_table_licensing_config] for a table. For more information, see licensingConfig object.
display	String	The default display column. Use a column name from the schema property.
extensible	Boolean	Flag that indicates whether other tables can extend the table.
Valid values:
true: Other tables can extend the table.
false: Other tables can't extend the table.
Changing this property from true to false prevents the creation of additional child tables but existing child tables remain unchanged.

Default: false

liveFeed	Boolean	Flag that indicates if live feeds are available for records in the table.
Valid values:
true: Live feeds are provided for records in the table. This option adds the Show Live Feed option (Show Live Feed icon) in the form header.
false: Live feeds aren't provided for records in the table.
Default: false

accessibleFrom	String	The application scopes that can access the table.
Valid values:
public: The table is accessible from all application scopes.
package_private: The table is accessible from only the application scope it's in.
Default: public

callerAccess	String	The access level for cross-scope requests.
Valid values:
restricted: Calls to the resource must be manually approved. Access requests are tracked in the Restricted Caller Access table with a status of Requested.
tracking: Calls to the resource are automatically approved. Calls are tracked in the Restricted Caller Access table with a status of Allowed.
none: Cross-scope calls to the resource are approved or denied based on the value of the accessibleFrom property.
For more information, see Restricted caller access privilege settings.

Default: none

actions	Array	A list of access options.
Valid values:
read: Allow script objects from other application scopes to read records stored in this table. For example, a script in another application can query data on this table. Read access is required to grant any other API record operations.
create: Allow script objects from other application scopes to create records in this table. For example, a script in another application can insert a new record in this table.
update: Allow script objects from other application scopes to modify records stored in this table. For example, a script in another application can modify a field value on this table.
delete: Allow script objects from other application scopes to delete records from this table. For example, a script in another application can remove a record from this table.
Default: read

allowWebServiceAccess	Boolean	Flag that indicates whether web services can make calls to the table.
Valid values:
true: Web services can make calls to the table.
false: Web services can't make calls to the table.
Default: false

allowNewFields	Boolean	Flag that indicates whether to allow design time configuration of new fields on the table from other application scopes.
Valid values:
true: Allow design time configuration of new fields on the table from other application scopes.
false: Don't allow design time configuration of new fields on the table from other application scopes.
Default: false

allowUiActions	Boolean	Flag that indicates whether to allow design time configuration of UI actions on the table from other application scopes.
Valid values:
true: Allow design time configuration of UI actions on the table from other application scopes.
false: Don't allow design time configuration of UI actions on the table from other application scopes.
Default: false

allowClientScripts	Boolean	Flag that indicates whether to allow design time configuration of client scripts on the table from other application scopes.
Valid values:
true: Allow design time configuration of client scripts on the table from other application scopes.
false: Don't allow design time configuration of client scripts on the table from other application scopes.
Default: false

audit	Boolean	Flag that indicates whether to track the creation, update, and deletion of all records in the table.
Valid values:
true: Track the creation, update, and deletion of all records in the table
false: Don't track the creation, update, and deletion of all records in the table.
Default: false

readOnly	Boolean	Flag that indicates whether users can edit fields in the table.
Valid values:
true: Users can't edit fields in the table.
false: Users can edit fields in the table.
Default: false

textIndex	Boolean	Flag that indicates whether search engines index the text in a table.
Valid values:
true: The table's text is indexed.
false: The table's text isn't indexed.
Default: false

attributes	Object	Key and value pairs of any supported dictionary attributes [sys_schema_attribute]. For example:
attributes: 
   {
      updateSyncCustom: Boolean,
      nativeRecordLock: Boolean
   }
For more information, see Dictionary Attributes.
index	Array	A list of column references to generate indexes in the metadata XML of the table. The value of the element property should match the object key used with the Column object.
A database index increases the speed of accessing data from the table with the expense of using additional storage.

index: [
    {
        name: 'String',
        element: 'String',
        unique: Boolean
    },
    ...
]
autoNumber	Object	The auto-numbering configuration [sys_number] for a table. For more information, see autoNumber object.
scriptableTable	Boolean	Flag that indicates whether the table is a remote table that uses data retrieved from an external source. For more information, see Remote tables.
Valid values:
true: The table is a remote table.
false: The table isn't a remote table.
Default: false

Example
For typeahead support for columns, assign the Table object to an exported variable with the same name as the name property.

Explain this code
import { Table, StringColumn } from "@servicenow/sdk/core";
import { myFunction } from "../server/myFunction.js"

export const x_snc_example_to_do = Table({
    name: 'x_snc_example_to_do',
    label: 'My To Do Table',
    extends: 'task',
    schema: {
        status: StringColumn({ label: 'Status' }),
        deadline: StringColumn({
            label: 'Deadline',
            active: true,
            mandatory: false,
            readOnly: false,
            maxLength: 40,
            dropdown: 'none',
            attributes: { 
                updateSync: false,
            },
            default: 'today',
            dynamicValueDefinitions: {
                type: 'calculated_value',
                calculatedValue: '',
            },
            choices: {
                choice1: {
                    label: 'Choice1 Label',
                    sequence: 0,
                    inactiveOnUpdate: false,
                    dependentValue: '5',
                    hint: 'hint',
                    inactive: false,
                    language: 'en',
                },
                choice2: { label: 'Choice2 Label', sequence: 1 },
            },
        }),
        dynamic1: StringColumn({
            dynamicValueDefinitions: {
                type: 'calculated_value',
                calculatedValue: myFunction,
            },
        }),
        dynamic2: StringColumn({
            dynamicValueDefinitions: {
                type: 'dynamic_default',
                dynamicDefault: `gs.info()`,
            },
        }),
        dynamic3: StringColumn({
            dynamicValueDefinitions: {
                type: 'dependent_field',
                columnName: 'status',
            },
        }),
        dynamic4: StringColumn({
            dynamicValueDefinitions: {
                type: 'choices_from_other_table',
                table: 'sc_cat_item',
                field: 'display',
            },
        }),
    },
    actions: ['create', 'read'],
    display: 'deadline',
    accessibleFrom: 'package_private',
    allowClientScripts: true,
    allowNewFields: true,
    allowUiActions: true,
    allowWebServiceAccess: true,
    extensible: true,
    liveFeed: true,
    callerAccess: 'none',
    autoNumber: {
        number: 10,
        numberOfDigits: 2,
        prefix: 'abc',
    },
    audit: true,
    readOnly: true,
    textIndex: true,
    attributes: {
        updateSync: true,
    },
    index: [
        {
            name: 'idx',
            element: 'status',
            unique: true,
        },
    ],
})
Column object
Add a column [sys_dictionary] to a table.

Add Column objects in the schema property of the Table object.

There are many types of columns based on the field type. Column objects use the format <Type>Column where <Type> is the field type. For information about field types, see Field types reference.

The following types of columns are supported: ListColumn, RadioColumn, StringColumn, ChoiceColumn, ScriptColumn, BooleanColumn, ConditionsColumn, DecimalColumn, IntegerColumn, VersionColumn, DomainIdColumn, FieldNameColumn, ReferenceColumn, TableNameColumn, UserRolesColumn, BasicImageColumn, DocumentIdColumn, DomainPathColumn, TranslatedTextColumn, SystemClassNameColumn, TranslatedFieldColumn, GenericColumn, DateColumn, DateTimeColumn, CalendarDateTime, BasicDateTimeColumn, DueDateColumn, CalendarDateTime, IntegerDateColumn, ScheduleDateTimeColumn, and OtherDateColumn.


Properties
Name	Type	Description
label	String or Array	A unique label for the column that appears on list headers and form fields. Field labels can be provided as a string or an array of label objects. For more information, see label object.
Default: the key used for the column object

maxLength	Number	The maximum length of values in the column.
A length of under 254 appears as a single-line text field. Anything 255 characters or over appears as a multi-line text box.

Note: To avoid data loss, only decrease the length of a string field when you’re developing a new application and not when a field contains data.
Default: varies depending on the column type

active	Boolean	Flag that indicates whether to display the field in lists and forms.
Valid values:
true: Displays the field.
false: Hides the field.
Default: true

mandatory	Boolean	Flag that indicates whether the field must contain a value to save a record.
Valid values:
true: The field must contain a value.
false: The field isn't required.
Default: false

readOnly	Boolean	Flag that indicates whether you can edit the field value.
Valid values:
true: You can't change the value, and the system calculates and displays the data for the field.
false: You can change the field value.
Default: false

default	Any	The default value of the field when creating a record. The value must use the correct type based on the column type.
choices	Object	A list of choices [sys_choice] for a column. For more information, see choices object.
This property only applies to ChoiceColumn objects and column types that extend choice columns. It can include either an array of primitive values or a series of choice objects.

attributes	Object	Key and value pairs of any supported dictionary attributes [sys_schema_attribute]. For example:
attributes: 
   {
      updateSyncCustom: Boolean,
      nativeRecordLock: Boolean
   }
For more information, see Dictionary Attributes.
functionDefinition	String	The definition of a function that the field performs, such as a mathematical operation, field length computation, or day of the week calculation.
Each definition begins with glidefunction:, followed by the operation to be performed (such as, concat), followed by function parameters. Constants must be enclosed in single quotes.

For example, the following function definition creates a field that shows the short description, followed by a space, followed by the caller name:
Explain this code
functionDefinition: 'glidefunction:concat(short_description, ' ', caller_id.name)'
For more information about function definitions, see Function field.

dynamicValueDefinitions	Object	Default values that are generated dynamically based on dynamic filters. Provide a combination of a type and a related behavior key to specify dynamic defaults. The following types are supported:
dynamic_default: Provide a function from the Dynamic Filter Options [sys_filter_option_dynamic] table. For more information, see Create a dynamic filter option. For example:
Explain this code
dynamicValueDefinitions: {
   type: 'dynamic_default',
   dynamicDefault: `gs.info()`,
},
dependent_field: Provide another column name from the same table. For example:
Explain this code
dynamicValueDefinitions: {
   type: 'dependent_field',
   columnName: 'status',
},
calculated_value: Provide a function for calculating the value. The function can be imported from a JavaScript module or be defined inline. For example:
Explain this code
dynamicValueDefinitions: {
   type: 'calculated_value',
   calculatedValue: function,
},
choices_from_other_table: Provide choices from a column on another table. For example:
Explain this code
dynamicValueDefinitions: {
   type: 'choices_from_other_table',
   table: 'sc_cat_item',
   field: 'display',
},
dropdown	String	An option for how a list of choices displays for list and form views of the table. This property only applies to ChoiceColumn objects and column types that extend choice columns.
Valid values:
none: The choices aren't enforced.
dropdown_without_none: A menu without the -- None -- option. If you select this option, you must configure the default property for the column.
dropdown_with_none: A menu with the -- None -- option. The default value is -- None --.
suggestion: Choices are displayed in a list of suggested values.
Default: none

Example
Column names are provided as object keys paired with the column definitions.
Explain this code
schema: {
   deadline: DateColumn({ label: 'Deadline' }),
   state: StringColumn({
      label: 'State',
      choices: {
         ready: { label: 'Ready' },
         completed: { label: 'Completed' },
         inProgress: { label: 'In Progress' },
      }   
   }),
   task: StringColumn({ label: 'Task', maxLength: 120 }),
}
If the table name doesn't include the application scope, column names must be prefixed with the application scope instead.
Explain this code
schema: {
   x_scope_myColumn: StringColumn({...})
}

## ReferenceColumn - IMPORTANT

**CRITICAL:** When creating reference fields, you MUST use the `referenceTable` property (NOT `reference`).

### Properties
Name	Type	Description
referenceTable	String	**REQUIRED for ReferenceColumn.** The name of the table being referenced (e.g., 'sys_user', 'cmdb_ci', 'incident'). This is the correct property name - do NOT use `reference`.
cascadeRule	String	Configure what happens to records that reference a record when that record is deleted.
Valid values:
- none: No cascade behavior
- delete_no_workflow: Delete referencing records without running workflows
- cascade: Delete referencing records with workflows
- delete: Delete referencing records
- restrict: Prevent deletion if references exist
- clear: Clear the reference field value

Default: none

referenceFloats	Boolean	Flag that indicates whether the referenced table's form has an "edit" button in the related list.
Valid values:
- true: Show edit button in related lists
- false: No edit button

dynamicCreation	Boolean	Flag that indicates whether to allow creation of a new record in the referenced table if the reference is not found.
Valid values:
- true: Allow dynamic creation
- false: Don't allow dynamic creation

dynamicCreationScript	String	Script to populate a new record from a reference field based on the field value.
referenceKey	String	Sets up a many-to-many relationship. The value specified is the label describing the relationship.
referenceQual	String	Filter reference based on a filter condition, referenced value, or sys_filter_option_dynamic sys_id.

### Example - CORRECT Usage
Explain this code
schema: {
   owner: ReferenceColumn({
      label: 'Owner',
      referenceTable: 'sys_user',  // CORRECT - use referenceTable
      mandatory: true,
   }),
   assigned_to: ReferenceColumn({
      label: 'Assigned To',
      referenceTable: 'sys_user',
      referenceQual: 'active=true',  // Filter to only active users
   }),
   parent_task: ReferenceColumn({
      label: 'Parent Task',
      referenceTable: 'task',
      cascadeRule: 'none',
   }),
}

### Common Mistake - INCORRECT Usage
Explain this code
// ❌ WRONG - This will NOT work!
owner: ReferenceColumn({
   label: 'Owner',
   reference: 'sys_user',  // WRONG property name
})

// ✅ CORRECT - Use this instead
owner: ReferenceColumn({
   label: 'Owner',
   referenceTable: 'sys_user',  // CORRECT property name
})

choices object
Configure choices [sys_choice] for a column in a table.

The choices object is a property within the Column object. Use the choices object with supported column types in the schema property of a Table object. Only certain column types extend the choice column type (ChoiceColumn) and can include choices.


Properties
Name	Type	Description
label	String	Required. The text to display for the choice in the list.
dependentValue	String	A value that you map to the dependentField in the dynamicValueDefinitions property of the Column object.
hint	String	A short description of the choice that displays as tooltip when hovering over it.
language	String	The BCP 47 code of the language for the translated choice.
Default: en

sequence	Integer	The order in the list of choices that a choice occurs.
inactive	Boolean	Flag that indicates whether to show the choice in the list.
Valid values:
true: The choice is hidden from the list.
false: The choice appears in the list.
Default: false

Example
The choices object includes a series of choice objects, where the names of the choices are provided as object keys paired with the choices definitions.

Explain this code
choices: {
   choice1: {
      label: 'Choice1 Label',
      sequence: 0,
      inactiveOnUpdate: false,
      dependentValue: '5',
      hint: 'hint',
      inactive: false,
      language: 'en',
   },
   choice2: { label: 'Choice2 Label', sequence: 1 },
}
label object
Configure a field label [sys_documentation] for a table or column.

The label object is a property within the Table and Column objects.


Properties
Name	Type	Description
language	String	The BCP 47 code of the language for the field label. A language can have only one label, so each language must be unique within an array of label objects.
label	String	The text of the field label in the specified language.
hint	String	A short description that displays as a tooltip when hovering over the field label.
help	String	Additional information about the field. Help text isn’t displayed in form or list views of the table.
plural	String	The plural form of the field label.
url	String	A URL for a web page that provides information about the field. When a URL is provided, the label displays as a hyperlink.
urlTarget	String	Not used (deprecated).
Example
Explain this code
label: [
   { 
      label: 'English description', 
      language: 'en', 
      hint: 'Provide a short description' 
   },
   {
      label: 'Description de español', 
      language: 'es' 
   },
]
licensingConfig object
Create a licensing configuration [ua_table_licensing_config] to track subscription counts for a table.

The licensingConfig object is a property within the Table object. If this property isn’t specified, a default licensing configuration with licenseModel set to none is generated for the table on the instance.

Note: Specifying a licensing model is not applicable for ServiceNow customers who build custom applications for their own use. Licensing models are used only by partners who sell and monitor the usage of resellable applications on the ServiceNow Store.

Properties
Name	Type	Description
licenseModel	String	The model for tracking subscription usage.
Valid values:
none: Licensing isn’t used for the table.
fulfiller: Fulfiller/requester operations are tracked. This model applies to applications in which users open requests and fulfillers address them. Fulfillment is determined by insert, update, and delete operations on records in one or more key tables in the application under a set of specified conditions. For more information, see Fulfillment tables.
producer: Producer operations are tracked. This model applies to applications in which users can perform insert, update, and delete operations on a table without identifying requesters and fulfillers.
Default: none

licenseRoles	Array	A list of roles for which any operations on records in the table count toward the subscription.
opDelete	Boolean	Flag that indicates whether a subscription is required to delete records for tables with the producer model.
Valid values:
true: A subscription is required to delete records in the table.
false: A subscription isn't required to delete records in the table.
Default: true

opInsert	Boolean	Flag that indicates whether a subscription is required to insert records for tables with the producer model.
Valid values:
true: A subscription is required to insert records in the table.
false: A subscription isn't required to insert records in the table.
Default: true

opUpdate	Boolean	Flag that indicates whether a subscription is required to update records for tables with the producer model.
true: A subscription is required to update records in the table.
false: A subscription isn't required to update records in the table.
Default: true

licenseCondition	String	A filter query that determines conditions for counting operations toward a subscription.
For the fulfiller model, specify the set of conditions that determine whether the logged-in user is the fulfiller of the record.

For the producer model, specify the set of conditions that determine whether records count toward the subscription.

ownerCondition	String	A filter query that determines whether a user owns a record for the fulfiller model.
isFulfillment	Boolean	Not used (deprecated). Flag that indicates whether to disallow updates by users who aren't subscribed to the application.
Valid values:
true: Users who aren't subscribed to the application can't make updates to the table.
false: Users who aren't subscribed to the application can make updates to the table.
Default: false

Example
Explain this code
licensingConfig: {
  licenseModel: 'fulfiller',
  opInsert: false,
  licenseRoles: ['admin'],
}
autoNumber object
Configure auto-numbering [sys_number] for a table.

The autoNumber object is a property within the Table object.

## IMPORTANT: Auto-Numbering Setup Requirements

Auto-numbering requires **TWO components** to work properly:

1. **A number field in the table schema** with the auto-numbering default function
2. **EITHER** an `autoNumber` property on the Table object **OR** an explicit `sys_number` Record

### Recommended Approach: Use Record API for sys_number

While the `autoNumber` property on Table works, using the Record API to create the sys_number record explicitly is more reliable and matches ServiceNow's standard approach.

Properties
Name	Type	Description
prefix	String	A prefix for every record number in the table. For example, INC for Incident.
Default: pre

number	Integer	The base record number for this table. Record numbers are automatically incremented, and the next number is maintained in the Counter [sys_number_counter] table.
If you set the base number to a value higher than the current counter, the next record number uses the new base number. Otherwise the next record number uses the current counter. The counter doesn't reset to a base number lower than itself.

Default: 1000

numberOfDigits	Integer	The minimum number of digits to use after the prefix.
Leading zeros are added to auto-numbers, if necessary. For example, INC0001001 contains three leading zeros. The number of digits can exceed the minimum length. For example, if numberOfDigits is 2 and more than 99 records are created on the table, the numbers continue past 100 (such as INC101).

Warning: Changing this field can update all number values for existing records on a table. Take care when changing this field on a production instance.
Default: 7

## Complete Auto-Numbering Examples

### Method 1: Using Record API (RECOMMENDED)
Explain this code
import { Table, StringColumn, Record } from '@servicenow/sdk/core'

// Create the sys_number record for auto-numbering
export const myTableNumbering = Record({
  table: 'sys_number',
  $id: Now.ID['my_table_numbering'],
  data: {
    category: 'x_12345_mytable',  // Must match your table name
    prefix: 'REQ',
    number: 1000,
    maximum_digits: 7,
  },
})

// Create the table with number field
export const myTable = Table({
  name: 'x_12345_mytable',
  label: 'My Table',
  schema: {
    number: StringColumn({
      label: 'Number',
      maxLength: 40,
      readOnly: true,
      default: 'javascript:global.getNextObjNumberPadded();',
    }),
    // ... other fields
  },
})

### Method 2: Using autoNumber property on Table
Explain this code
import { Table, StringColumn } from '@servicenow/sdk/core'

export const myTable = Table({
  name: 'x_12345_mytable',
  label: 'My Table',
  schema: {
    number: StringColumn({
      label: 'Number',
      maxLength: 40,
      readOnly: true,
      default: 'javascript:global.getNextObjNumberPadded();',
    }),
    // ... other fields
  },
  autoNumber: {
    prefix: 'REQ',
    number: 1000,
    numberOfDigits: 7,
  },
})

## Key Points

1. **Number field type**: Use `StringColumn`, not `IntegerColumn` (auto-numbers are strings like "REQ0001000")
2. **Default function**: Must be `'javascript:global.getNextObjNumberPadded();'` (with `global.` prefix)
3. **Read-only**: Always set `readOnly: true` so users can't manually edit
4. **Category field**: In sys_number Record, `category` must exactly match your table name
5. **maximum_digits vs numberOfDigits**: 
   - In Record API: use `maximum_digits` (matches ServiceNow sys_number field name)
   - In autoNumber property: use `numberOfDigits` (Fluent API convention)

## Common Mistakes

### ❌ WRONG - Missing default function
Explain this code
number: StringColumn({
  label: 'Number',
  readOnly: true,
  // Missing default - won't auto-generate!
})

### ❌ WRONG - Using IntegerColumn
Explain this code
number: IntegerColumn({  // WRONG type
  default: 'javascript:global.getNextObjNumberPadded();'
})

### ❌ WRONG - Missing 'global.' prefix
Explain this code
number: StringColumn({
  default: 'javascript:getNextObjNumberPadded();'  // Missing global.
})

### ✅ CORRECT - Complete setup
Explain this code
number: StringColumn({
  label: 'Number',
  maxLength: 40,
  readOnly: true,
  default: 'javascript:global.getNextObjNumberPadded();',
})