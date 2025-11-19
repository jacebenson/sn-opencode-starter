# ServiceNow OpenCode Starter Template

A starter template for building ServiceNow applications using OpenCode with the ServiceNow SDK and Fluent API.

## What is This?

This template provides custom OpenCode tools and a specialized ServiceNow agent to help you build ServiceNow applications using natural language and AI assistance. Instead of manually writing XML or clicking through the ServiceNow UI, you can describe what you want to build and let OpenCode help you create it using the ServiceNow Fluent API.

## Features

- **ServiceNow SDK Tools**: Custom OpenCode tools for authentication, building, installing, and managing ServiceNow applications
- **Specialized ServiceNow Agent**: An AI agent with deep knowledge of ServiceNow development patterns and the Fluent API
- **17 Fluent APIs**: Support for Tables, Business Rules, Script Includes, UI Actions, Roles, ACLs, and more
- **Natural Language Development**: Describe what you want to build, and OpenCode will help you create it

## Prerequisites

- [OpenCode](https://opencode.ai) installed
- Node.js and npm
- Access to a ServiceNow instance (PDI, developer instance, or sandbox)
- ServiceNow SDK installed globally:

## Getting Started

### 1. Clone or Use This Template

```bash
git clone <your-repo-url>
cd sn-opencode-starter
```

### 2. Set up ServiceNow SDK

<https://www.servicenow.com/docs/bundle/yokohama-application-development/page/build/servicenow-sdk/task/install-servicenow-sdk.html>

### 2. Open in OpenCode

Open this directory in your terminal and start OpenCode:

```bash
code .
# Then press Ctrl+L to start OpenCode
```

### 3. Authenticate with ServiceNow

First, add your ServiceNow instance credentials:

```
Can you authenticate with my ServiceNow instance at dev123456.service-now.com using basic auth with alias 'dev'?
```

OpenCode will use the `servicenow_auth` tool to securely store your credentials.

### 4. Create Your First Application

Ask OpenCode to create a new ServiceNow application:

```
Create a new ServiceNow application called "Task Tracker" with scope x_myco using the typescript.basic template
```

OpenCode will use the `servicenow_init` tool to scaffold your project.

### 5. Build Application Components

Now you can start building your application using natural language:

```
Create a table called x_myco_task with fields for title (string), description (text), priority (choice: low/medium/high), assigned_to (reference to sys_user), and due_date (date). Add auto-numbering with prefix TASK starting at 1000.
```

```
Add a business rule that auto-assigns tasks to the current user when priority is set to high
```

```
Create a UI action button called "Complete Task" that marks the task as complete
```

### 6. Build and Deploy

Once you've defined your components, ask OpenCode to build and install:

```
Build and deploy this application to my dev instance
```

OpenCode will:
1. Run `servicenow_build` to compile your Fluent API code to ServiceNow XML
2. Run `servicenow_install` to deploy the application to your instance

## Available Tools

The ServiceNow agent has access to these specialized tools:

### Authentication
- `servicenow_auth` - Manage ServiceNow instance credentials
  - Add, delete, list, or set default credentials

### Project Management
- `servicenow_init` - Initialize new ServiceNow projects
  - Templates: base, javascript.react, typescript.basic, typescript.react, javascript.basic

### Development
- `servicenow_build` - Build Fluent API code to ServiceNow XML
- `servicenow_install` - Deploy applications to ServiceNow instances
- `servicenow_dependencies` - Manage application dependencies
- `servicenow_transform` - Convert XML update sets to Fluent API

## Supported Fluent APIs

The ServiceNow agent can help you create:

### Core Components
- **Tables** - Database tables with columns, auto-numbering, audit trails
- **Business Rules** - Server-side automation (before/after/async/display)
- **Script Includes** - Reusable server-side code
- **UI Actions** - Buttons, links, and context menu items
- **Roles** - Security roles with hierarchies
- **ACLs** - Access control rules

### Additional Components
- **Application Menus** - Navigator menus
- **Client Scripts** - Client-side form validation
- **UI Pages** - Custom UI pages
- **Scripted REST APIs** - RESTful web services
- **Properties** - System properties
- **Records** - Demo data and seed records
- **Lists** - List view configurations
- **Automated Tests** - ATF tests
- **Service Portal** - Portal widgets

## Example Workflows

### Creating a Complete Application

```
I want to create an incident management application with:
- A custom incident table with priority, assigned user, and due date
- Auto-assignment when priority is critical
- A resolve button that marks incidents as resolved
- Roles for users and admins
- ACLs so only admins can delete incidents
```

### Converting Existing XML

```
I have an update set XML file at ./my_update_set.xml. Can you transform it to Fluent API?
```

### Managing Dependencies

```
Add the ITSM dependency to my project
```

## Project Structure

After initializing a project, you'll have:

```
your-app-name/
├── src/
│   └── fluent/
│       └── index.now.ts       # Your Fluent API definitions
├── dist/
│   └── app/                   # Generated ServiceNow XML
├── now.config.json            # SDK configuration
├── package.json
└── README.md
```

## How It Works

1. **Custom Tools** (`.opencode/tool/servicenow.ts`): These tools wrap the ServiceNow SDK commands and make them available to OpenCode
2. **ServiceNow Agent** (`.opencode/agent/servicenow.md`): This specialized agent understands ServiceNow development patterns and the Fluent API
3. **Natural Language**: You describe what you want, OpenCode translates it to Fluent API code and manages the build/deploy process

## Tips for Best Results

1. **Be Specific**: The more details you provide, the better OpenCode can help
   - Good: "Create a task table with auto-numbering prefix TASK, fields for title, description, and priority"
   - Less good: "Create a table"

2. **Build Incrementally**: Start with tables, then add business rules, UI actions, etc.

3. **Ask for Explanations**: OpenCode can explain what code it's creating and why

4. **Review Before Deploy**: Ask OpenCode to show you the generated code before deploying

## Common Commands

```
# Authentication
"List my ServiceNow credentials"
"Add credentials for instance dev123.service-now.com"

# Project Setup
"Initialize a new project called X with scope x_myco"
"Show me the project structure"

# Development
"Create a table for tracking incidents"
"Add a business rule that validates the priority field"
"Create a UI action to approve records"

# Build and Deploy
"Build the application"
"Install to my dev instance"
"Build and deploy"

# Dependencies
"List project dependencies"
"Add the ITSM dependency"
```

## Troubleshooting

### Authentication Issues
If you have trouble connecting, verify your instance URL and credentials:
```
Can you list my ServiceNow credentials?
```

### Build Errors
Ask OpenCode to review the build output:
```
The build failed, can you check what went wrong?
```

### Need Help
OpenCode can explain ServiceNow concepts:
```
How do I create a reference field in a table?
What's the difference between before and after business rules?
```

## Learn More

- [ServiceNow SDK Documentation](https://developer.servicenow.com/dev.do)
- [OpenCode Documentation](https://opencode.ai/docs)
- [ServiceNow Fluent API Guide](https://developer.servicenow.com/dev.do#!/reference/now-cli/fluent-api)

## Contributing

Feel free to extend this template with additional tools or agent configurations for your specific ServiceNow development needs.

## License

MIT
