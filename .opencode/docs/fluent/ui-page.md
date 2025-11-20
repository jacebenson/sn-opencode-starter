UI Page API - ServiceNow Fluent
Release version: 
Zurich
UpdatedJul 30, 20254 minutes to readSummarize
The UI Page API defines custom user interface (UI) pages [sys_ui_page] that display forms, dialogs, lists, and other UI components.

A UI page displays as a web page and can be added to a widget for use in dashboards. For general information about UI pages, see UI pages.

You can develop a simple React application with the UI Page API. In the src/client directory, add static content files that define the HTML, client script, and styling of the page. From the UiPage object, refer to the page's HTML entry point (index.html). For more information, see User interface development with React.

UiPage object
Create a UI page [sys_ui_page] for a custom user interface.


Properties
Name	Type	Description
$id	String or Number	Required. A unique ID for the metadata object. When you build the application, this ID is hashed into a unique sys_id.
Format: Now.ID['String' or Number]

endpoint	String	Required. The endpoint to access the web page. The endpoint value can't contain spaces.
Format: <scope>_<ui_page_name>.do

description	String	A description of the user interface and its purpose.
direct	Boolean	Flag that indicates whether to omit the standard HTML, CSS, and JavaScript for a UI page. For React UI pages, set this property to true.
Valid values:
true: Omit the standard HTML, CSS, and JavaScript and provide custom CSS and JavaScript for the page.
false: Include the standard HTML, CSS, and JavaScript.
Default: false

html	String	The body HTML code that defines what is rendered when the page is shown. It can contain either static XHTML, dynamically generated content defined as Jelly, or call script includes and UI Macros. This property supports an alias to import an index.html file for React development, a reference to another file in the application that contains HTML, or inline JavaScript.
Note: With React development and imported HTML, the html property of the UiPage object supports only one-way synchronization. After defining the HTML of a UI page in source code, if the HTML is modified outside of the source code, those changes aren't synchronized and reflected in the source code.
Format:
An alias to import the index.html file from the previous build for UI development with React. The alias can be any value and must also be imported in the now.ts file that contains the UiPage object: import <alias> from 'path/to/index.html'.
To use text content from another file, refer to a file in the application using the following format: Now.include('path/to/file').
To provide inline HTML, use string literals or template literals for multiple lines of code: 'HTML' or `HTML`.
category	String	The type of UI page.
Valid values:
general: The page is general purpose.
homepages: The page is used as a home page.
htmleditor: The page is used to insert HTML content.
kb: The page is used with a Knowledge Base.
cms: The page is used with the Content Management System (CMS).
catalog: The page is used with Service Catalog.
clientScript	Script	A script that runs in the browser, such as functions called by buttons. This script handles any required client-side processing needed, like setting focus to a field or other interactive DHTML features after a page is loaded. This property supports inline JavaScript or a reference to another file in the application that contains a script.
Client scripts for the UI page are deployed to the browser within a <script> tag, so the content can similarly be defined within the HTML field. The clientScript property can be used instead to define these scripts concisely to maintain the Jelly and HTML manageability.

Format:
To use text content from another file, refer to a file in the application using the following format: Now.include('path/to/file').
To provide an inline script, use string literals or template literals for multiple lines of code: 'Script' or `Script`.
processingScript	Script	A script that runs on the server when the page is submitted, which is useful if your page has a form defined with the <g:ui_form/> or <g:form/> tags. This property supports a function from a JavaScript module, a reference to another file in the application that contains a script, or inline JavaScript.
Format:
For functions, use the name of a function, function expression, or default function exported from a JavaScript module and import it into the .now.ts file. For information about JavaScript modules, see JavaScript modules and third-party libraries.
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
In this example of UI development with React, the HTML of the page is imported from the index.html file in the src/client directory.

Explain this code
//incident-manager.now.ts
import '@servicenow/sdk/global'
import { UiPage } from '@servicenow/sdk/core'
import incidentPage from '../../client/index.html'

UiPage({
    $id: Now.ID['incident-manager-page'],
    endpoint: '<scope>_incident_manager.do',
    description: 'Incident Response Manager UI Page',
    category: 'general',
    html: incidentPage,
    direct: true,
})
In the index.html file, the <script> tag refers to the main.jsx file in the src/client directory, which contains the component code.

Explain this code
//index.html
<html>
<head>
  <title>Incident Response Manager</title>

  <!-- Initialize globals and Include ServiceNow's required scripts -->
  <sdk:now-ux-globals></sdk:now-ux-globals>

  <!-- Include your React entry point -->
  <script src="./main.jsx" type="module"></script>
</head>
<body>
  <div id="root"></div>
</body>
</html>