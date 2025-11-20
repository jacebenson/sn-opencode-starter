Record API - ServiceNow Fluent
Release version: 
Zurich
UpdatedJul 30, 20252 minutes to readSummarize
The Record API defines records in any table. Use the Record API to define application metadata that doesn't have a dedicated ServiceNow Fluent API.

Record object
Add data to any table with a record.


Properties
Name	Type	Description
$id	String or Number	Required. A unique ID for the metadata object. When you build the application, this ID is hashed into a unique sys_id.
Format: Now.ID['String' or Number]

table	String	Required. The name of the table to which the record belongs.
data	Object	Fields and their values in the table. For example:
data: {
   state: 'Ready',
   task: 'Add demo data'
}
To use text content from another file, refer to a file in the application using the Now.include syntax.
Explain this code
data: {
   script: Now.include('./script-file.js'),
   html: Now.include('./html-file.html'),
   css: Now.include('./css-file.css')
 }
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
In this example, a record defining a menu category is added to the Menu Category [sys_app_category] table. The menu category style is defined in the css-file.css file.
Explain this code
import { Record } from "@servicenow/sdk/core";

export const appCategory = Record({
   table: 'sys_app_category',
   $id: Now.ID[9],
   data: {
      name: 'example',
      style: Now.include('./css-file.css'),
   },
})
In this example, a record defining an incident is added to the Incident [incident] table.
Explain this code
import { Record } from '@servicenow/sdk/core';

export const incident1 = Record({
  $id: Now.ID['incident-1'],
  table: 'incident',
  data: {
    active: 'true',
    approval: 'not requested',
    description: 'Unable to send or receive emails.',
    incidentState: '1',
    shortDescription: 'Email server is down.',
    subcategory: 'email',
    callerId: '77ad8176731313005754660c4cf6a7de',
  }
})
In this example, a record defining a server is added to the Server [cmdb_ci_server] table.
Explain this code
import { Record } from '@servicenow/sdk/core';

export const ciserver1 = Record({
  $id: Now.ID['cmdb-ci-server-1'],
  table: 'cmdb_ci_server',
  data: {
    assetTag: 'P1000199',
    attested: 'false',
    canPrint: 'false',
    company: 'e7c1f3d53790200044e0bfc8bcbe5deb',
    cost: '2160',
    costCc: 'USD',
    cpuSpeed: '633',
    cpuType: 'GenuineIntel',
    diskSpace: '100',
    manufacturer: 'b7e7d7d8c0a8016900a5d7f291acce5c',
    name: 'DatabaseServer1',
    os: 'Linux Red Hat',
    shortDescription: 'DB Server',
    subcategory: 'Computer',
  }
})