# Agent Guidelines for ServiceNow OpenCode Starter

## Build/Deploy Commands
- Build: `npx @servicenow/sdk build` (compiles Fluent API to XML)
- Install: `npx @servicenow/sdk install --auth <alias>` (deploys to instance)
- Reinstall: `npx @servicenow/sdk install --auth <alias> --reinstall true` (WARNING: removes instance metadata not in local build)
- Transform: `npx @servicenow/sdk transform --auth <alias>` (sync instance changes to local Fluent code)
- Auth setup: `npx @servicenow/sdk auth --add <instance-url> --alias <alias> --type basic`

## Code Organization
- Fluent API code: `src/fluent/*.now.ts` (tables, business rules, ACLs, roles, UI components)
- Server modules: `src/server/*.ts` or `src/server/*.js` (reusable functions, utilities)
- Build output: `dist/app/update/*.xml` (generated, do not edit manually)
- Config: `now.config.json` (SDK config), `.env` (auth passwords, vendor code)

## Coding Style
- Language: TypeScript preferred for type safety (`.now.ts` for Fluent, `.ts` for modules)
- Imports: Use `@servicenow/sdk/core` for Fluent types, `@servicenow/glide` for Glide APIs
- Naming: Vendor-prefixed scopes required: `x_<vendor>_<appname>` (get vendor via `sn_api_getVendorCode`)
- Error handling: Use Business Rules for validation, throw errors in before-insert/update rules
- **Table Schema**: Schema is an OBJECT (not array), with field names as keys:
  ```typescript
  schema: {
    fieldName: StringColumn({ label: 'Label' }),
    // NOT an array
  }
  ```
- **Reference Fields**: MUST use `referenceTable` property (NOT `reference`):
  ```typescript
  owner: ReferenceColumn({
    label: 'Owner',
    referenceTable: 'sys_user',  // ✅ CORRECT
    // reference: 'sys_user'     // ❌ WRONG - will not work
  })
  ```
- **Auto-Numbering**: Requires TWO parts - a number field AND a sys_number record (RECOMMENDED: use Record API):
  ```typescript
  // 1. Create sys_number record
  export const myTableNumbering = Record({
    table: 'sys_number',
    $id: Now.ID['my_table_numbering'],
    data: {
      category: 'x_12345_mytable',  // MUST match table name
      prefix: 'REQ',
      number: 1000,
      maximum_digits: 7,
    },
  })
  
  // 2. Add number field to table schema
  schema: {
    number: StringColumn({  // Use StringColumn, NOT IntegerColumn
      label: 'Number',
      maxLength: 40,
      readOnly: true,
      default: 'javascript:global.getNextObjNumberPadded();',  // MUST include global.
    }),
  }
  ```

## Key Constraints
- ROBUSTPROMPT.md: Read this first for app requirements (goal, data model, automation, security)
- Vendor code: MUST be in .env as SN_VENDOR_CODE before building (fetch via sn_api_getVendorCode if missing)
- Not supported: Workspaces, Flows, Process Automation Designer, Virtual Agent, Dashboards, Reports (use Business Rules/Script Actions instead)
