# ServiceNow SDK Guide

This directory contains comprehensive documentation for the ServiceNow SDK CLI and development workflow. Understanding the SDK commands, authentication options, and build process is essential for successfully developing and deploying ServiceNow applications.

## Documentation Overview

### Getting Started
- **[Authentication](./auth.md)** - Authenticate to ServiceNow instances using basic or OAuth 2.0
- **[Create Application](./create-application.md)** - Initialize new ServiceNow applications
- **[Convert Application](./convert-application.md)** - Convert existing apps to SDK format
- **[CLI Reference](./cli-reference.md)** - Complete command-line interface reference

### Development Workflow
- **[Define Metadata](./define-metadata.md)** - Write ServiceNow Fluent code to define app components
- **[Build and Install](./build-and-install-application.md)** - Compile and deploy applications
- **[Dependencies](./downloading-application-and-script-dependencies.md)** - Manage app and script dependencies

### Advanced Features
- **[JavaScript Modules](./using-js-modules.md)** - Create reusable JS code
- **[TypeScript Modules](./using-ts-modules.md)** - Use TypeScript for type safety
- **[Third-Party Libraries](./using-third-party-modules.md)** - Include npm packages

## Quick Start Guide

### 1. Authentication

Before working with ServiceNow SDK, authenticate to your instance:

```bash
npx @servicenow/sdk auth --add https://yourinstance.service-now.com
```

**Choose authentication method:**
- **Basic auth**: Username + password (simpler, good for dev)
- **OAuth 2.0**: More secure, requires ServiceNow IDE 1.1+ on instance

**Best practices:**
- Create an alias for each instance (e.g., `dev`, `test`, `prod`)
- Use non-production instances for development
- Requires `admin` role on the instance

**See:** [auth.md](./auth.md) for detailed authentication instructions

### 2. Create or Convert Application

**Create a new application:**
```bash
npx @servicenow/sdk init
```

**Convert existing application:**
```bash
npx @servicenow/sdk init --from <sys_id or path>
```

**Template options:**
- `base` - Basic structure only
- `javascript.basic` - Fluent + JavaScript
- `javascript.react` - Fluent + JavaScript + React
- `typescript.basic` - Fluent + TypeScript
- `typescript.react` - Fluent + TypeScript + React

**Critical: Scope naming**
- Must include vendor code: `x_<vendor>_<appname>`
- Get vendor code: Use `@sn-api getVendorCode --saveToEnv`
- Maximum 18 characters
- Must be unique on instance

**See:** [create-application.md](./create-application.md) and [convert-application.md](./convert-application.md)

### 3. Define Application Metadata

Write ServiceNow Fluent code in `src/fluent/*.now.ts` files:

```typescript
import { Table, StringColumn } from '@servicenow/sdk/core'

export const x_scope_mytable = Table({
  name: 'x_scope_mytable',
  schema: {
    title: StringColumn({ label: 'Title', mandatory: true })
  }
})
```

**Organization:**
- `src/fluent/` - Fluent API code (`.now.ts` files)
- `src/server/` - JavaScript/TypeScript modules
- `src/client/` - Client-side code (React, etc.)

**See:** [define-metadata.md](./define-metadata.md) for detailed Fluent API usage

### 4. Build and Install

**Workflow:**

```bash
# 1. Install npm dependencies (first time only)
npm install

# 2. Build application (compile Fluent code to XML)
now-sdk build

# 3. Install to instance
now-sdk install --auth <alias>
```

**What happens:**
- Fluent code → compiled to ServiceNow XML
- JavaScript modules → added to `sys_module` table
- Output to `dist/app/` directory
- Uploaded to ServiceNow instance

**Reinstall (wipes instance data):**
```bash
now-sdk install --auth <alias> --reinstall true
```

**Warning:** `--reinstall` removes metadata on instance that's not in local build!

**See:** [build-and-install-application.md](./build-and-install-application.md)

## Essential CLI Commands

### Authentication Commands

```bash
# Add credentials
npx @servicenow/sdk auth --add <instance-url> --type [basic|oauth] --alias <name>

# List credentials
now-sdk auth --list

# Set default credentials
now-sdk auth --use <alias>

# Delete credentials
now-sdk auth --delete <alias>
```

### Project Initialization

```bash
# Create new app (interactive prompts)
npx @servicenow/sdk init

# Create with all options specified
npx @servicenow/sdk init --appName "My App" --packageName my-app --scopeName x_vendor_myapp --template typescript.basic --auth dev

# Convert existing app by sys_id
npx @servicenow/sdk init --from abc123def456 --auth dev

# Convert from local directory
npx @servicenow/sdk init --from /path/to/app --auth dev
```

### Build and Deploy

```bash
# Build application
now-sdk build

# Build with frozen keys (CI/CD)
now-sdk build --frozenKeys true

# Install to instance
now-sdk install --auth <alias>

# Reinstall (removes instance metadata not in build)
now-sdk install --auth <alias> --reinstall true

# Install and open in browser
now-sdk install --auth <alias> --open-browser true

# Check installation status (doesn't install)
now-sdk install --info
```

### Sync and Transform

```bash
# Download changes from instance and transform to Fluent code
now-sdk transform --auth <alias>

# Transform local XML to Fluent code
now-sdk transform --from metadata/update

# Preview transformation (don't save)
now-sdk transform --from metadata/update --preview true

# Download metadata (for comparison)
now-sdk download /path/to/directory --auth <alias>

# Download only changes
now-sdk download /path/to/directory --incremental true
```

### Dependencies

```bash
# Download app and script dependencies
now-sdk dependencies --auth <alias>

# Downloads:
# - Tables from now.config.json dependencies
# - TypeScript type definitions for Glide APIs
# - Script include type definitions
```

### Maintenance

```bash
# Remove build artifacts
now-sdk clean

# Package build into ZIP
now-sdk pack
```

## Development Workflow Best Practices

### Recommended Workflow

1. **Initial Setup**
   ```bash
   npx @servicenow/sdk auth --add https://dev.service-now.com --alias dev
   npx @servicenow/sdk init --template typescript.basic --auth dev
   npm install
   ```

2. **Daily Development**
   ```bash
   # Pull changes from instance
   now-sdk transform --auth dev
   
   # Make code changes in src/fluent/*.now.ts
   
   # Build and test
   now-sdk build
   now-sdk install --auth dev
   ```

3. **Sync with Team**
   ```bash
   # Download latest from instance
   now-sdk transform --auth dev
   
   # Build and install
   now-sdk build
   now-sdk install --auth dev
   ```

### Template Selection Guide

| Use Case | Template | Why |
|----------|----------|-----|
| Simple server-side app | `typescript.basic` | Type safety, autocomplete |
| Complex automation | `typescript.basic` | Better refactoring, fewer bugs |
| Custom UI with React | `typescript.react` | Modern UI development |
| Simple scripts only | `javascript.basic` | Less setup, faster start |
| Service Portal widgets | `javascript.react` | Service Portal uses AngularJS |
| Legacy app conversion | `base` | Minimal changes |

### Vendor Code Requirements

**CRITICAL:** All ServiceNow apps must use vendor-prefixed scopes.

**Format:** `x_<vendor>_<appname>`

**Get vendor code:**
1. Use `@sn-api` agent: `@sn-api getVendorCode --saveToEnv`
2. Manual: Query `sys_properties` table for `glide.appcreator.company.code`
3. Stored in `.env` as `SN_VENDOR_CODE=12345`

**Example scopes:**
- ✅ `x_12345_myapp` (correct - includes vendor code)
- ❌ `x_myco_myapp` (wrong - missing vendor code)

## JavaScript Modules

### Creating Modules

**Location:** `src/server/*.js` or `src/server/*.ts`

**Example JavaScript module:**
```javascript
import { gs } from '@servicenow/glide'

export function logMessage(message) {
  gs.info(message)
}

export const STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive'
}
```

**Example TypeScript module:**
```typescript
import { gs } from '@servicenow/glide'

export function logMessage(message: string): void {
  gs.info(message)
}

export const STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive'
} as const
```

### Using Modules in Fluent Code

```typescript
import { BusinessRule } from '@servicenow/sdk/core'
import { logMessage } from '../server/utils.js'

BusinessRule({
  name: 'Log Update',
  table: 'incident',
  when: 'after',
  action: ['update'],
  script: logMessage  // Direct function reference
})
```

**Or with inline script:**
```typescript
BusinessRule({
  script: `
    const { logMessage } = require('./dist/modules/server/utils.js')
    logMessage('Record updated')
  `
})
```

**See:** [using-js-modules.md](./using-js-modules.md) and [using-ts-modules.md](./using-ts-modules.md)

## Third-Party Libraries

### Adding Libraries

```bash
# Install npm package
npm install lodash

# Import in module
import _ from 'lodash'

# Build and install
now-sdk build
now-sdk install --auth dev
```

**Limitations:**
- Must be ECMAScript modules compatible
- No Node.js-specific APIs (fs, http, etc.)
- No unsupported browser APIs
- Libraries are bundled into app XML

**See:** [using-third-party-modules.md](./using-third-party-modules.md)

## Dependencies Management

### Application Dependencies

Configure in `now.config.json`:

```json
{
  "dependencies": {
    "applications": {
      "global": {
        "tables": ["cmdb_ci_server", "sys_user"]
      },
      "sn_ace": {
        "tables": ["sn_ace_app_config"]
      }
    }
  }
}
```

### Script Dependencies

**Download type definitions:**
```bash
now-sdk dependencies --auth dev
```

**Configure TypeScript (`src/server/tsconfig.json`):**
```json
{
  "include": [
    "./**/*.ts",
    "../../@types/servicenow/*.server.d.ts"
  ]
}
```

**See:** [downloading-application-and-script-dependencies.md](./downloading-application-and-script-dependencies.md)

## Common Workflows

### New Application from Scratch

```bash
# 1. Authenticate
npx @servicenow/sdk auth --add https://dev.service-now.com --alias dev

# 2. Get vendor code (via sn-api agent)
# @sn-api getVendorCode --saveToEnv

# 3. Create app
npx @servicenow/sdk init --appName "Equipment Tracker" \
  --packageName equipment-tracker \
  --scopeName x_12345_equip \
  --template typescript.basic \
  --auth dev

# 4. Install dependencies
npm install

# 5. Define metadata in src/fluent/*.now.ts
# (write your Fluent code)

# 6. Build and deploy
now-sdk build
now-sdk install --auth dev
```

### Convert Existing Application

```bash
# 1. Authenticate
npx @servicenow/sdk auth --add https://dev.service-now.com --alias dev

# 2. Convert app (get sys_id from instance)
npx @servicenow/sdk init --from abc123def456789 --auth dev

# 3. Install dependencies
npm install

# 4. (Optional) Transform XML to Fluent code
now-sdk transform --from metadata/update

# 5. Build and install
now-sdk build
now-sdk install --auth dev
```

### Daily Development Cycle

```bash
# Morning: sync with instance
now-sdk transform --auth dev

# During day: make changes in src/fluent/

# Test changes
now-sdk build
now-sdk install --auth dev

# Before committing: sync again
now-sdk transform --auth dev
now-sdk build
```

### CI/CD Pipeline

```bash
# Set environment variables
export SN_SDK_INSTANCE_URL=https://test.service-now.com
export SN_SDK_USER=admin
export SN_SDK_USER_PWD=password
export SN_SDK_NODE_ENV=SN_SDK_CI_INSTALL

# Build with frozen keys
now-sdk build --frozenKeys true

# Install without browser
now-sdk install --open-browser false
```

## Troubleshooting

### Common Issues

**Build fails with "vendor code missing"**
- Solution: Get vendor code via `@sn-api getVendorCode --saveToEnv`
- Add to scope name: `x_<vendor>_<appname>`

**"App already exists" error**
- Solution: Use `--reinstall` flag
- `now-sdk install --auth dev --reinstall true`
- ⚠️ WARNING: This removes instance metadata not in local build

**Transform doesn't update files**
- Check: Metadata exists on instance in your scope
- Check: You have `admin` role
- Try: `now-sdk transform --auth dev --format true`

**TypeScript compilation errors**
- Check: `tsconfig.json` is correctly configured
- Check: TypeScript version ≥ 4.8.4
- Run: `npm install` to get latest dependencies

**Module not found errors**
- Check: Import paths are correct
- Check: File extensions in TypeScript imports (`.ts` required)
- Run: `npm install` to install dependencies

**Authentication expired**
- OAuth tokens expire after time
- Solution: Re-authenticate with `now-sdk auth --add`

### Getting Help

1. Check CLI help: `now-sdk --help` or `now-sdk <command> --help`
2. Enable debug mode: `now-sdk build --debug`
3. Review ServiceNow SDK documentation
4. Check this README and individual doc files

## File Structure Reference

```
your-app/
├── src/
│   ├── fluent/           # ServiceNow Fluent code
│   │   ├── index.now.ts  # Main Fluent definitions
│   │   ├── tables.now.ts
│   │   ├── business-rules.now.ts
│   │   └── generated/    # Auto-generated from transform
│   ├── server/           # JavaScript/TypeScript modules
│   │   ├── utils.js
│   │   └── tsconfig.json (if using TypeScript)
│   └── client/           # Client-side code (React, etc.)
│       └── index.html
├── dist/                 # Build output (generated)
│   ├── app/
│   │   └── update/       # XML metadata files
│   └── server/           # Compiled modules
├── metadata/             # XML metadata (if converted app)
├── @types/               # TypeScript type definitions
│   └── servicenow/
│       ├── glide.server.d.ts
│       └── schema/       # Table definitions
├── node_modules/         # npm dependencies
├── package.json          # npm package config
├── now.config.json       # ServiceNow SDK config
└── tsconfig.json         # TypeScript config (if using TS)
```

## Environment Variables

### CI/CD Variables
```bash
SN_SDK_INSTANCE_URL      # Instance URL for CI/CD
SN_SDK_USER              # Username for CI/CD
SN_SDK_USER_PWD          # Password for CI/CD
SN_SDK_NODE_ENV          # Set to SN_SDK_CI_INSTALL for CI
```

### Local Development
```bash
SN_VENDOR_CODE           # Vendor code from instance
PROFILE_<alias>          # Password for auth alias (used by sn-api agent)
```

## Key Concepts

### Build vs. Install
- **Build**: Compiles Fluent code → XML, prepares package
- **Install**: Uploads package → instance, updates records

### Transform
- Downloads metadata XML from instance
- Converts XML → Fluent code (`.now.ts`)
- Syncs instance changes into local code

### Reinstall
- Uninstalls app, then installs fresh
- ⚠️ Removes instance metadata not in local build
- Use when scope name changes or major restructuring

### Scope Name
- Format: `x_<vendor>_<appname>`
- Vendor code is instance-specific (e.g., `12345`)
- Get from: `sys_properties.glide.appcreator.company.code`
- Maximum 18 characters

### Templates
- Define initial project structure
- TypeScript templates include transpilation
- React templates include client build setup
- Can't change template after initialization

## Best Practices

1. **Always use vendor code in scope names** - Required for production
2. **Use TypeScript for complex apps** - Better type safety and refactoring
3. **Transform before building** - Sync instance changes to avoid conflicts
4. **Use aliases for multiple instances** - Easy switching between dev/test/prod
5. **Version control `.now.ts` files** - Track your source code
6. **Don't version `dist/` directory** - Build artifacts are generated
7. **Configure dependencies** - Get IntelliSense for dependent tables
8. **Use `--reinstall` carefully** - Only when necessary, backs up first
9. **Test on non-production instances** - Never develop directly in prod
10. **Document custom modules** - Help team understand reusable code

## References

For detailed information on specific topics, see individual documentation files in this directory.
