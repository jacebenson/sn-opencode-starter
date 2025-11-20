Automated Test Framework Test API - ServiceNow Fluent
Release version: 
Zurich
UpdatedJul 30, 20253 minutes to readSummarize
The Automated Test Framework Test API defines automated tests [sys_atf_test] that you can run to confirm that your instance works after making a change.

For general information about Automated Test Framework tests, see Automated Test Framework (ATF).

Test object
Create an automated test [sys_atf_test] containing a series of steps to execute.


Properties
Name	Type	Description
$id	String or Number	Required. A unique ID for the metadata object. When you build the application, this ID is hashed into a unique sys_id.
Format: Now.ID['String' or Number]

name	String	A unique name for the test.
description	String	A description of what the test does.
active	Boolean	Flag that indicates whether the test is active.
Valid values:
true: The test is active.
false: The test isn't active.
Default: true

failOnServerError	Boolean	Flag that indicates whether to fail when a server error occurs during the test.
Valid values:
true: The test fails when a server error occurs.
false: The test doesn't fail when a server error occurs.
Default: true

configurationFunction	Function	The steps of the test. Test steps are passed as statements within the atf function. For example:
(atf) => {
    atf.form.openNewForm({
        table: 'sn_example_table',
        formUI: 'standard_ui',
        view: '',
    })
}
For more information about test steps, see Supported test steps.

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
The output values of test steps with output variables can be saved as variables and used as inputs to other steps using the syntax output.<output-variable>. The output variables can be used both directly as inputs on appropriate fields or inside of a template string, such as with atf.server.log in the following example.

Explain this code
import { Test } from '@servicenow/sdk/core'
import '@servicenow/sdk-core/global'

Test({
        active: true,
        failOnServerError: true,
        name: 'Simple example',
        description: 'An illustrative test written in fluent',
        $id: Now.ID[1],
    },
    (atf) => {
        atf.form.openNewForm({
            table: 'sn_table_app_reptile_table',
            formUI: 'standard_ui',
            view: '',
        })
        atf.form.setFieldValue({
            table: 'sn_table_app_reptile_table',
            formUI: 'standard_ui',
            fieldValues: {
                reptiles: 'lizard' as any,
            },
        })
        const output = atf.form.submitForm({ assertType: 'form_submitted_to_server', formUI: 'standard_ui' })
        atf.server.recordValidation({
            recordId: output.record_id,
            table: 'sn_table_app_reptile_table',
            assertType: 'record_validated',
            enforceSecurity: true,
            fieldValues: 'reptiles=lizard',
        })
        atf.server.log({
            log: `Submitted record with sys_id: ${output.record_id} to table ${output.table}`
        })
    }
)
Supported test steps
The following test steps are supported. For information about step properties, see the Automated Test Framework (ATF) test step categories documentation.

Note: Some fields available for test steps on forms aren't available as properties in ServiceNow Fluent.

Test steps
Category	Steps
Application Navigator category	
atf.applicationNavigator.applicationMenuVisibility
atf.applicationNavigator.moduleVisibility
atf.applicationNavigator.navigateToModule
Email category	
atf.email.generateInboundEmail
atf.email.generateInboundReplyEmail
atf.email.generateRandomString
atf.email.validateOutboundEmail
atf.email.validateOutboundEmailGeneratedByFlow
atf.email.validateOutboundEmailGeneratedByNotification
Form category	
atf.form.addAttachmentsToForm
atf.form.clickDeclarativeAction
atf.form.clickModalButton
atf.form.clickUIAction
atf.form.declarativeActionVisibility
atf.form.fieldStateValidation
atf.form.fieldValueValidation
atf.form.openExistingRecord
atf.form.openNewForm
atf.form.setFieldValue
atf.form.submitForm
atf.form.uiActionVisibility
Forms in Service Portal category	
atf.form_SP.addAttachmentsToForm
atf.form_SP.clickUIAction_SP
atf.form_SP.fieldStateValidation_SP
atf.form_SP.fieldValueValidation_SP
atf.form_SP.openForm_SP
atf.form_SP.openServicePortalPage
atf.form_SP.setFieldValue_SP
atf.form_SP.submitForm_SP
atf.form_SP.uiActionVisibilityValidation_SP
Quick start tests for Dashboards	
atf.reporting.responsiveDashboard
atf.reporting.responsiveDashboardSharing
REST category	
atf.rest.assertJsonResponsePayloadElement
atf.rest.assertResponseHeader
atf.rest.assertResponseJSONPayloadIsValid
atf.rest.assertResponsePayload
atf.rest.assertResponseTime
atf.rest.assertResponseXMLPayloadIsWellFormed
atf.rest.assertStatusCode
atf.rest.assertStatusCodeName
atf.rest.assertXMLResponsePayloadElement
atf.rest.sendRestRequest
Server category	
atf.server.addAttachmentsToExistingRecord
atf.server.checkoutShoppingCart
atf.server.createUser
atf.server.impersonate
atf.server.log
atf.server.recordDelete
atf.server.recordInsert
atf.server.recordQuery
atf.server.recordUpdate
atf.server.recordValidation
atf.server.replayRequestItem
atf.server.runServerSideScript
atf.server.searchForCatalogItem
atf.server.setOutputVariables
Service Catalog category	
atf.catalog.addItemToShoppingCart
atf.catalog.openCatalogItem
atf.catalog.openRecordProducer
atf.catalog.orderCatalogItem
atf.catalog.setCatalogItemQuantity
atf.catalog.setVariableValue
atf.catalog.submitRecordProducer
atf.catalog.validatePriceAndRecurringPrice
atf.catalog.variableStateValidation
atf.catalog.validateVariableValue
Service Catalog in Service Portal category	
atf.catalog_SP.addItemtoShoppingCart_SP
atf.catalog_SP.addOrderGuidetoShoppingCart_SP
atf.catalog_SP.addRowToMultiRowVariableSet_SP
atf.catalog_SP.navigatewithinOrderGuide_SP
atf.catalog_SP.openCatalogItem_SP
atf.catalog_SP.openOrderGuide_SP
atf.catalog_SP.openRecordProducer_SP
atf.catalog_SP.orderCatalogItem_SP
atf.catalog_SP.reviewIteminOrderGuide_SP
atf.catalog_SP.reviewOrderGuideSummary_SP
atf.catalog_SP.saveCurrentRowOfMultiRowVariableSet_SP
atf.catalog_SP.setCatalogItemQuantity_SP
atf.catalog_SP.setVariableValue_SP
atf.catalog_SP.submitOrderGuide_SP
atf.catalog_SP.submitRecordProducer_SP
atf.catalog_SP.validateOrderGuideItem_SP
atf.catalog_SP.validatePriceAndRecurringPrice_SP
atf.catalog_SP.variableStateValidation_SP
atf.catalog_SP.validateVariableValue_SP