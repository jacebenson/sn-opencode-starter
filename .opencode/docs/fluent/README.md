# ServiceNow Fluent API Reference Guide

This directory contains documentation for ServiceNow Fluent API types that can be built using the ServiceNow SDK. Understanding which components are available and their limitations is crucial for setting proper expectations when building ServiceNow applications.

## Available Fluent API Types

The following ServiceNow components have dedicated Fluent API support and comprehensive documentation:

### Core Platform Components

- **[Table](./table.md)** - Database tables with columns, relationships, and auto-numbering
- **[Business Rule](./business-rule.md)** - Server-side automation triggered on insert/update/delete/query
- **[Script Include](./script-include.md)** - Reusable server-side JavaScript code
- **[Client Script](./client-script.md)** - Client-side validation and field interactions
- **[UI Action](./ui-action.md)** - Buttons, links, and context menu items
- **[UI Page](./ui-page.md)** - Custom user interface pages (supports React development)

### Security & Access Control

- **[Role](./role.md)** - Security roles for users and groups
- **[Access Control List](./access-control-list.md)** - ACLs for CRUD operations and field-level security
- **[Cross-Scope Privilege](./cross-scope-privledge.md)** - Access between different application scopes

### User Interface

- **[Service Portal](./service-portal.md)** - Custom widgets for portal pages (AngularJS-based)
- **[UI Page](./ui-page.md)** - Custom UI pages (can be React-based for modern UIs)
- **[List](./list.md)** - List view configurations
- **[Application Menu](./application-menu.md)** - Navigation menu items

### Integration & Automation

- **[Scripted REST API](./scripted-rest-api.md)** - RESTful web services
- **[Script Action](./script-action.md)** - Event-based automation (triggered by ServiceNow events)
- **[Automated Testing Framework](./automated-testing-framework.md)** - ATF tests for quality assurance

### Configuration

- **[Property](./property.md)** - System properties for configuration

### Fallback Option

- **[Record](./record.md)** - Generic API for any ServiceNow table (use when dedicated API doesn't exist)

## Important Limitations - What's NOT Supported

The following ServiceNow features are **NOT available** through Fluent API and cannot be built with this SDK:

### ❌ Not Supported

- **Workspaces** - Modern UI workspaces (Agent Workspace, Employee Center, etc.)
- **Flows** - Flow Designer workflows and actions
- **Process Automation Designer** - PAD processes
- **Virtual Agent** - Chatbot conversations
- **Dashboards** - Performance Analytics dashboards
- **Reports** - Native reporting components
- **Service Catalog Items** - Catalog items and variables (would require Record API)
- **Workflows** - Classic workflow engine (legacy, use Script Actions or Business Rules instead)
- **UI Policies** - Client-side field visibility rules (use Client Scripts instead)
- **Data Policies** - Server-side data validation (use Business Rules instead)

## Choosing the Right Component

### For Beautiful/Modern UIs

**User asks for:** "Create a beautiful UI", "modern interface", "nice looking page"

**Options:**
1. **Service Portal Widget** ([service-portal.md](./service-portal.md))
   - AngularJS-based custom widgets
   - Can be styled with custom CSS/SCSS
   - Used in Service Portal pages
   - Good for: Self-service portals, end-user interfaces

2. **UI Page with React** ([ui-page.md](./ui-page.md))
   - Modern React-based development
   - Full control over HTML/CSS/JS
   - Set `direct: true` to omit standard ServiceNow styling
   - Good for: Custom applications, dashboards, specialized interfaces

**Clarify with user:**
- "Would you like a Service Portal widget (AngularJS) or a React-based UI Page?"
- "Service Portals are for end-user self-service. UI Pages give you full control."

### For Automation

**User asks for:** "Automate this process", "workflow", "automatic updates"

**Options:**
1. **Business Rules** ([business-rule.md](./business-rule.md))
   - Synchronous automation (before/after insert/update/delete)
   - Runs immediately with the transaction
   - Good for: Field calculations, validations, default values

2. **Script Actions** ([script-action.md](./script-action.md))
   - Event-based asynchronous automation
   - Triggered by custom events
   - Good for: Notifications, integrations, delayed processing

**If user asks for Flows or Workspaces:**
- "Flow Designer is not available in Fluent API. Can we use Business Rules (synchronous) or Script Actions (event-based) instead?"
- "Workspaces cannot be built with Fluent API. Would a custom UI Page or Service Portal widget work for your needs?"

### For Data Validation

**User asks for:** "Validate fields", "enforce rules", "prevent bad data"

**Options:**
1. **Client Scripts** ([client-script.md](./client-script.md))
   - Client-side validation (onChange, onSubmit)
   - Immediate user feedback
   - Can be bypassed (not for security)

2. **Business Rules** ([business-rule.md](./business-rule.md))
   - Server-side enforcement (cannot be bypassed)
   - Set `abortAction: true` to prevent saves
   - Use for critical data integrity

**If user asks for UI Policies or Data Policies:**
- "UI Policies aren't in Fluent API. Use Client Scripts for field visibility/mandatory rules."
- "Data Policies aren't in Fluent API. Use Business Rules with `abortAction: true` for enforcement."

### For Security

**User asks for:** "Control access", "permissions", "who can see what"

**Required components:**
1. **Roles** ([role.md](./role.md)) - Define first
2. **Access Control Lists** ([access-control-list.md](./access-control-list.md)) - Then create ACLs

**Best practice:**
- Always create roles before ACLs
- Create ACLs for all CRUD operations (create, read, write, delete)
- Use principle of least privilege
- Enable `audit: true` on sensitive tables

### For Components Without Dedicated APIs

**User asks for something not listed above**

**Use Record API** ([record.md](./record.md))
- Generic API for any ServiceNow table
- Requires knowing the table name and field names
- More guesswork involved
- Examples: Catalog items, notifications, email templates

**Clarify with user:**
- "This component doesn't have dedicated Fluent API support. We can try using the Record API, but it requires more manual configuration."
- "We'll need to know the exact table and field names from ServiceNow documentation."

## Guiding Principles

### 1. Set Expectations Early
When a user requests features that aren't supported (Workspaces, Flows), immediately clarify what alternatives are available.

### 2. Offer Alternatives
Always suggest alternative approaches using available Fluent APIs:
- Flows → Business Rules + Script Actions
- UI Policies → Client Scripts
- Data Policies → Business Rules
- Workspaces → UI Pages or Service Portal

### 3. Use Documentation
Reference these docs files when building components. They contain:
- Complete property definitions
- Valid values and defaults
- Code examples
- Best practices

### 4. Document Assumptions
When using Record API or making choices between alternatives, document your assumptions in the build output.

### 5. Prioritize Supported APIs
Use dedicated Fluent APIs whenever possible. Only use Record API when necessary.

## Quick Reference Table

| User Request | Recommended Component | Alternative | Not Supported |
|-------------|----------------------|-------------|---------------|
| Beautiful UI | UI Page (React) | Service Portal Widget | Workspaces |
| Automation | Business Rules | Script Actions | Flows, PAD |
| Validation | Business Rules | Client Scripts | Data Policies |
| Field Behavior | Client Scripts | Business Rules | UI Policies |
| Access Control | Roles + ACLs | - | - |
| Navigation | Application Menu | - | - |
| Web Services | Scripted REST API | - | - |
| Testing | ATF Tests | - | - |
| Custom Tables | Table API | - | - |
| Buttons/Actions | UI Actions | - | - |
| Reusable Code | Script Includes | - | - |

## Example Conversations

### Example 1: User wants a modern UI
```
User: "Create a beautiful modern interface for incident management"

Agent: "For a modern interface, I recommend a UI Page with React support. This gives you 
full control over the UI with modern web technologies. Alternatively, I could create a 
Service Portal widget if you need it integrated into an existing Service Portal.

Which would you prefer:
1. UI Page (React-based, full control, standalone)
2. Service Portal Widget (AngularJS, integrates with portals)

Note: Agent Workspace and modern Workspaces are not available in Fluent API."
```

### Example 2: User wants automation
```
User: "I need a workflow that sends notifications when priority changes"

Agent: "Flow Designer workflows aren't available in Fluent API. I can achieve this with:

1. Business Rule (synchronous) - Runs immediately when priority changes
2. Script Action (event-based) - Triggered by a custom event

For your use case, I recommend a Business Rule that fires on 'after update' when 
priority changes. Would that work for your requirements?"
```

### Example 3: User wants field validation
```
User: "Make sure the short_description field can't be empty and is at least 10 characters"

Agent: "I'll implement this with two complementary approaches:

1. Client Script (onChange/onSubmit) - Immediate feedback to users
2. Business Rule (before insert/update with abortAction) - Server-side enforcement

This is more secure than UI Policies (not available in Fluent API) because the 
Business Rule cannot be bypassed."
```

## Using These Docs in Your Work

1. **Planning Phase** - Reference this README to set expectations
2. **Requirements Gathering** - Clarify what's possible vs. not supported
3. **Implementation** - Use individual component docs for syntax and examples
4. **Documentation** - Document which approaches you chose and why

## For More Information

- Each component has a dedicated markdown file with full API reference
- ServiceNow official docs: https://developer.servicenow.com/dev.do
- Fluent API introduction: https://developer.servicenow.com/dev.do#!/learn/learning-plans/xanadu/new_to_servicenow/app_store_learnv2_buildmyfirstapp_xanadu_build_the_application
