# Complete Workflow Guide

This document explains how to use the ServiceNow OpenCode starter template from planning to deployment.

## Architecture Overview

```
@sn-setup (environment)    → Installs SDK, configures auth, validates .env
@sn-plan (planning)        → Creates ROBUSTPROMPT.md
@servicenow (orchestrator) → Coordinates entire workflow
  ├── @sn-api (queries)    → Fetches vendor codes, queries data
  └── @sn-sdk (build)      → Creates code, builds, deploys
```

## Workflow 0: First-Time Setup

**User Journey:** "I just cloned this repo, how do I get started?"

### What You Need
- ServiceNow instance (PDI or developer instance)
- Instance credentials (username/password)

### Step 1: Invoke Setup Agent
```bash
User: "@sn-setup help me get started"
```

**What happens:**

#### 1.1 Check Node.js
```
@sn-setup:
- Runs: node --version
- If missing or < v18:
  → Guides installation via nvm
  → nvm install --lts
  → nvm use --lts
```

#### 1.2 Install ServiceNow SDK
```
@sn-setup:
- Runs: npx @servicenow/sdk --version
- If missing:
  → npm install -g @servicenow/sdk
  → Verifies installation
```

#### 1.3 Create Auth Profile
```
@sn-setup:
- Asks for instance URL (e.g., dev123456.service-now.com)
- Asks for username (e.g., admin)
- Asks for alias (e.g., dev)
- Runs: npx @servicenow/sdk auth add --alias dev --instance dev123456 --username admin --type basic
```

#### 1.4 Configure .env File
```
@sn-setup:
- Checks if .env exists
- If missing: cp .env.example .env
- Asks for password
- Adds: PROFILE_dev="password"
- Verifies format
```

#### 1.5 Verify Setup
```
@sn-setup:
- Runs: npx @servicenow/sdk auth --list
- Checks: cat .env | grep PROFILE_
- Returns: ✓ Setup complete!
```

**Total time:** 2-3 minutes

### When Setup Runs Automatically

The orchestrator will automatically invoke `@sn-setup` if it detects:
- `npx` command not found
- SDK commands fail
- Auth profile missing
- .env file issues

```bash
User: "Create a ServiceNow app"
servicenow: [Tries to check auth]
servicenow: [Detects SDK not installed]
servicenow: "I see the SDK isn't set up. Let me help with that first..."
servicenow: [Invokes @sn-setup]
```

---

## Workflow 1: Complete App from Scratch

**User Journey:** "I have an idea for an app, help me build it"

### Step 1: Planning
```bash
User: "@sn-plan I need an equipment checkout app for IT to track laptop loans"
```

**What happens:**
1. `@sn-plan` subagent activates
2. Asks clarifying questions:
   - Who will use it? (roles)
   - What features are needed?
   - What data should we track?
   - Any approval workflows?
   - Any reporting needs?
3. Makes sensible defaults for unspecified details
4. Generates `ROBUSTPROMPT.md` with complete requirements

**Output:** `ROBUSTPROMPT.md` created with:
- Goal and success criteria
- Audience and usage patterns
- App identity (name, scope, classification)
- Core capabilities
- Data model (tables, fields)
- Automation (business rules)
- User experience
- Security (roles, ACLs)

### Step 2: Review Requirements
```bash
User: "Show me the requirements"
```

**What happens:**
1. Agent reads `ROBUSTPROMPT.md`
2. Summarizes key sections
3. Asks if user wants to make changes

### Step 3: Build Application
```bash
User: "@servicenow build my application"
```

**What happens:**

#### 3.1 Orchestrator reads ROBUSTPROMPT.md
```
servicenow agent:
- Reads ROBUSTPROMPT.md
- Parses all sections
- Extracts: app name, scope, tables, fields, business rules, roles, ACLs
```

#### 3.2 Check/Fetch Vendor Code
```
servicenow agent:
- Reads .env file
- Checks for SN_VENDOR_CODE
- If missing:
  → Invokes @sn-api via task tool
  → @sn-api queries instance for vendor code
  → @sn-api saves to .env
  → Returns vendor code to orchestrator
```

#### 3.3 Initialize Project
```
servicenow orchestrator:
→ Invokes @sn-sdk via task tool
  @sn-sdk:
  - Runs sn_sdk_init tool
  - Creates project structure
  - Configures now.config.json
  - Creates src/fluent/index.now.ts
```

#### 3.4 Create Tables
```
servicenow orchestrator:
→ Invokes @sn-sdk via task tool with table specs from ROBUSTPROMPT.md
  @sn-sdk:
  - Writes Fluent API table definitions
  - Adds fields with types, constraints, defaults
  - Creates choice lists
  - Sets up auto-numbering
  - Configures audit trails
```

#### 3.5 Create Business Rules
```
servicenow orchestrator:
→ Invokes @sn-sdk via task tool with automation specs from ROBUSTPROMPT.md
  @sn-sdk:
  - Writes Fluent API business rule code
  - Implements when-to-run logic
  - Adds script logic
```

#### 3.6 Create Roles & ACLs
```
servicenow orchestrator:
→ Invokes @sn-sdk via task tool with security specs from ROBUSTPROMPT.md
  @sn-sdk:
  - Creates role definitions
  - Sets up role hierarchies
  - Creates ACL rules for tables
  - Sets permissions (create, read, write, delete)
```

#### 3.7 Build Application
```
servicenow orchestrator:
→ Invokes @sn-sdk via task tool
  @sn-sdk:
  - Runs sn_sdk_build tool
  - Compiles Fluent API → ServiceNow XML
  - Generates dist/app/ directory
  - Validates all components
```

#### 3.8 Deploy to Instance
```
servicenow orchestrator:
→ Invokes @sn-sdk via task tool
  @sn-sdk:
  - Runs sn_sdk_install tool
  - Uploads XML to ServiceNow instance
  - Installs application
  - Returns success confirmation
```

#### 3.9 Generate Documentation
```
servicenow orchestrator:
- Creates build log (all components created)
- Creates quick start guide (how each role uses the app)
- Lists assumptions made
- Returns to user
```

**Total time:** 2-5 minutes depending on complexity

---

## Workflow 2: Quick Build (Skip Planning)

**User Journey:** "I already know what I want, just build it"

**Prerequisites:** Environment already set up (SDK installed, auth configured)

### Manual ROBUSTPROMPT.md
```bash
User: Manually copies .opencode/docs/ROBUSTPROMPT.md to project root
User: Edits ROBUSTPROMPT.md with requirements
User: "@servicenow build my application"
```

**What happens:**
- Skips Workflow 0 (setup already done)
- Skips Workflow 1 Step 1 (planning)
- Proceeds directly to Workflow 1 Steps 2-3 (review, build)
- Same orchestration flow as Workflow 1

---

## Workflow 3: Direct Commands (No Planning)

**User Journey:** "Just create this one table for me"

### Direct SDK Commands
```bash
User: "@sn-sdk create a table called x_12345_task with fields for title and description"
```

**What happens:**
1. `@sn-sdk` subagent activates directly
2. Creates Fluent API code for table
3. Returns code to user
4. No build/deploy unless requested

**Use when:**
- Quick prototyping
- Adding to existing app
- Learning Fluent API
- Don't need full orchestration

---

## Workflow 4: Query Then Build

**User Journey:** "Show me existing data, then build something similar"

### Example: Extend Incident Table
```bash
User: "@sn-api query incident table and show me the fields"
```

**What happens:**
1. `@sn-api` subagent queries `sys_db_object` and `sys_dictionary` tables
2. Returns incident table structure
3. User reviews fields

```bash
User: "@sn-sdk create a table that extends incident with additional field 'equipment_id'"
```

**What happens:**
1. `@sn-sdk` creates table extending incident
2. Adds custom field
3. User can build and deploy

---

## Decision Tree: Which Workflow?

```
Do you have detailed requirements written down?
├─ NO → Use Workflow 1 (Plan with @sn-plan)
└─ YES → Do you have ROBUSTPROMPT.md filled out?
    ├─ YES → Use Workflow 2 (Build directly)
    └─ NO → Are requirements complex (multiple tables, rules, roles)?
        ├─ YES → Use Workflow 1 (Plan with @sn-plan)
        └─ NO → Use Workflow 3 (Direct commands)
```

---

## Agent Communication Patterns

### Pattern 1: Orchestrator → Subagent → Orchestrator
```
User → servicenow orchestrator
        ↓
        Reads ROBUSTPROMPT.md
        ↓
        task(prompt: "@sn-api getVendorCode")
        ↓
      @sn-api executes sn_api_getVendorCode tool
        ↓
        Returns vendor code
        ↓
servicenow receives result
        ↓
        task(prompt: "@sn-sdk initialize project with vendor x_12345")
        ↓
      @sn-sdk executes sn_sdk_init tool
        ↓
        Returns success
        ↓
servicenow summarizes to user
```

### Pattern 2: Direct Subagent Invocation
```
User → @sn-api query sys_user
       ↓
     @sn-api executes sn_api_query tool
       ↓
       Returns results to user
```

---

## File Flow

### Planning Phase
```
ROBUSTPROMPT.md (template)
  ↓
@sn-plan interviews user
  ↓
ROBUSTPROMPT.md (filled out)
```

### Build Phase
```
ROBUSTPROMPT.md
  ↓
servicenow reads requirements
  ↓
@sn-sdk creates Fluent API code
  ↓
your-app/src/fluent/index.now.ts
  ↓
@sn-sdk runs build
  ↓
your-app/dist/app/*.xml
  ↓
@sn-sdk runs install
  ↓
ServiceNow instance (deployed app)
```

---

## Environment Setup Flow

```
1. SDK auth profile created:
   ~/.servicenow/auth.json
   {
     "profiles": {
       "dev": {
         "instance": "dev123456",
         "username": "admin"
       }
     }
   }

2. Password stored in .env:
   PROFILE_dev="password123"

3. Vendor code cached in .env:
   SN_VENDOR_CODE="x_12345"

4. Tools read both sources:
   - SDK tools use ~/.servicenow/auth.json + .env password
   - API tools construct credentials from both
```

---

## Troubleshooting Workflows

### Problem: "Vendor code not found"
```
User: "@sn-api getVendorCode --saveToEnv"
@sn-api fetches from instance and saves to .env
```

### Problem: "Build failed - missing fields"
```
Check ROBUSTPROMPT.md for complete field definitions
Edit ROBUSTPROMPT.md
User: "@servicenow build my application"
Orchestrator reads updated requirements and rebuilds
```

### Problem: "Authentication failed"
```
User: "List my auth profiles"
servicenow runs: npx @servicenow/sdk auth --list

User: "Add auth for dev instance"
servicenow invokes @sn-api to add auth

User: Add password to .env
```

---

## Best Practices

### 1. Always Start with Planning
- Use `@sn-plan` for new applications
- Let it ask clarifying questions
- Review `ROBUSTPROMPT.md` before building

### 2. Build Incrementally
- Don't try to build everything at once
- Build tables first
- Then add business rules
- Then add UI components
- Test at each step

### 3. Use the Right Agent
- `@sn-plan` → Requirements gathering
- `@servicenow` → Complex orchestration
- `@sn-api` → Quick instance queries
- `@sn-sdk` → Direct build commands

### 4. Check .env First
- Verify vendor code is set
- Verify passwords are correct
- Update .env if instance changes

### 5. Review Before Deploy
- Ask to see generated code
- Review table structures
- Validate business logic
- Then deploy

---

## Complete Example

### From Idea to Deployment

```bash
# Step 1: Plan
@sn-plan I need an equipment checkout app for IT staff to loan laptops to employees

# @sn-plan asks questions, creates ROBUSTPROMPT.md

# Step 2: Review
Can you summarize the requirements?

# Step 3: Build
@servicenow build my application

# Orchestrator:
# - Reads ROBUSTPROMPT.md
# - Checks vendor code (fetches if needed)
# - Invokes @sn-sdk to initialize project
# - Invokes @sn-sdk to create tables (Equipment, Loan Request)
# - Invokes @sn-sdk to create business rules (auto-assign, due dates)
# - Invokes @sn-sdk to create roles (user, it_staff, it_admin)
# - Invokes @sn-sdk to create ACLs
# - Invokes @sn-sdk to build
# - Invokes @sn-sdk to deploy

# Step 4: Test
Navigate to dev123456.service-now.com
Login and test the application

# Step 5: Iterate
@sn-sdk add a field to track equipment condition (new, good, fair, poor)
@sn-sdk build and deploy
```

**Time:** ~5 minutes from idea to deployed application

---

## Comparison to Traditional Development

### Traditional Approach
1. Design tables (30 min)
2. Click through UI to create tables (20 min)
3. Write business rules in UI (45 min)
4. Create roles and ACLs in UI (30 min)
5. Test and debug (60 min)
**Total:** 3+ hours

### OpenCode Approach
1. Describe requirements to @sn-plan (3 min)
2. Review ROBUSTPROMPT.md (2 min)
3. Build with @servicenow (2 min)
4. Test (5 min)
**Total:** 12 minutes

**Speed improvement:** 15x faster
