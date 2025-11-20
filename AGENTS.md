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

## Key Constraints
- ROBUSTPROMPT.md: Read this first for app requirements (goal, data model, automation, security)
- Vendor code: MUST be in .env as SN_VENDOR_CODE before building (fetch via sn_api_getVendorCode if missing)
- Not supported: Workspaces, Flows, Process Automation Designer, Virtual Agent, Dashboards, Reports (use Business Rules/Script Actions instead)
