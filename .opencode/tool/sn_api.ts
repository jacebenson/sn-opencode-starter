import { tool } from "@opencode-ai/plugin"

/**
 * ServiceNow Table API Tools
 * 
 * These tools query ServiceNow instances using the Table API.
 * Authentication is retrieved from:
 * 1. SDK auth profiles (instance URL, username)
 * 2. .env file (password via PROFILE_<alias>)
 */

interface AuthProfile {
  alias: string
  host: string
  username: string
  type: string
  default: boolean
}

/**
 * Parse SDK auth profiles from the output of `npx @servicenow/sdk auth --list`
 */
function parseAuthProfiles(output: string): AuthProfile[] {
  const profiles: AuthProfile[] = []
  const lines = output.split('\n')
  let currentProfile: Partial<AuthProfile> = {}
  
  for (const line of lines) {
    const aliasMatch = line.match(/^\*?\[(.+)\]/)
    if (aliasMatch) {
      if (currentProfile.alias) {
        profiles.push(currentProfile as AuthProfile)
      }
      currentProfile = {
        alias: aliasMatch[1],
        default: line.startsWith('*')
      }
    } else if (line.includes('host =')) {
      currentProfile.host = line.split('=')[1].trim()
    } else if (line.includes('username =')) {
      currentProfile.username = line.split('=')[1].trim()
    } else if (line.includes('type =')) {
      currentProfile.type = line.split('=')[1].trim()
    }
  }
  
  if (currentProfile.alias) {
    profiles.push(currentProfile as AuthProfile)
  }
  
  return profiles
}

/**
 * Get authentication credentials for making API calls
 */
async function getAuthCredentials(alias?: string) {
  const { exec } = await import("child_process")
  const { promisify } = await import("util")
  const execAsync = promisify(exec)
  
  // Get SDK auth profiles
  const { stdout } = await execAsync('npx @servicenow/sdk auth --list')
  const profiles = parseAuthProfiles(stdout)
  
  // Find the profile to use
  let profile: AuthProfile | undefined
  if (alias) {
    profile = profiles.find(p => p.alias === alias)
    if (!profile) {
      throw new Error(`Auth profile '${alias}' not found. Available profiles: ${profiles.map(p => p.alias).join(', ')}`)
    }
  } else {
    profile = profiles.find(p => p.default)
    if (!profile) {
      profile = profiles[0]
    }
    if (!profile) {
      throw new Error('No auth profiles found. Run: npx @servicenow/sdk auth --add <instance>')
    }
  }
  
  // Get password from environment
  const envKey = `PROFILE_${profile.alias}`
  const password = process.env[envKey]
  
  if (!password) {
    throw new Error(
      `Password not found in .env file.\n` +
      `Add this line to your .env file:\n` +
      `${envKey}="your_password_here"`
    )
  }
  
  return {
    host: profile.host,
    username: profile.username,
    password: password,
    alias: profile.alias
  }
}

/**
 * Make a Table API request
 */
async function tableApiRequest(
  host: string,
  username: string,
  password: string,
  table: string,
  params: Record<string, string> = {}
) {
  const queryString = new URLSearchParams(params).toString()
  const url = `${host}/api/now/table/${table}${queryString ? '?' + queryString : ''}`
  
  const auth = Buffer.from(`${username}:${password}`).toString('base64')
  
  const response = await fetch(url, {
    headers: {
      'Authorization': `Basic ${auth}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  })
  
  if (!response.ok) {
    const text = await response.text()
    throw new Error(`API request failed (${response.status}): ${text}`)
  }
  
  return await response.json()
}

export const query = tool({
  description: "Query ServiceNow tables using the Table API",
  args: {
    table: tool.schema.string().describe("Table name to query (e.g., sys_user, sys_properties, incident)"),
    query: tool.schema.string().optional().describe("Encoded query string (e.g., 'active=true^name=admin')"),
    fields: tool.schema.string().optional().describe("Comma-separated list of fields to return (e.g., 'sys_id,name,email')"),
    limit: tool.schema.number().optional().describe("Maximum number of records to return (default: 10)"),
    auth: tool.schema.string().optional().describe("Auth profile alias to use (uses default if not specified)"),
  },
  async execute(args, context) {
    try {
      const creds = await getAuthCredentials(args.auth)
      
      const params: Record<string, string> = {}
      if (args.query) params.sysparm_query = args.query
      if (args.fields) params.sysparm_fields = args.fields
      if (args.limit) params.sysparm_limit = args.limit.toString()
      else params.sysparm_limit = '10'
      
      const result = await tableApiRequest(
        creds.host,
        creds.username,
        creds.password,
        args.table,
        params
      )
      
      return JSON.stringify(result, null, 2)
    } catch (error: any) {
      return `Error querying table: ${error.message}`
    }
  },
})

export const getVendorCode = tool({
  description: "Fetch the vendor/instance code from the ServiceNow instance",
  args: {
    auth: tool.schema.string().optional().describe("Auth profile alias to use (uses default if not specified)"),
    saveToEnv: tool.schema.boolean().optional().describe("Save the vendor code to .env file (default: false)"),
  },
  async execute(args, context) {
    try {
      const creds = await getAuthCredentials(args.auth)
      
      // Query the system property for vendor code
      const result = await tableApiRequest(
        creds.host,
        creds.username,
        creds.password,
        'sys_properties',
        {
          sysparm_query: 'name=glide.appcreator.company.code',
          sysparm_fields: 'value,name'
        }
      )
      
      if (!result.result || result.result.length === 0) {
        return `Vendor code not found. The property 'glide.appcreator.company.code' may not be set on instance ${creds.host}`
      }
      
      const vendorCode = result.result[0].value
      
      if (!vendorCode) {
        return `Vendor code property exists but has no value on instance ${creds.host}`
      }
      
      let message = `Vendor code: ${vendorCode}\nInstance: ${creds.host}\n`
      
      // Save to .env if requested
      if (args.saveToEnv) {
        const { readFile, writeFile } = await import('fs/promises')
        const envPath = '.env'
        
        try {
          let envContent = await readFile(envPath, 'utf-8')
          
          // Check if SN_VENDOR_CODE already exists
          if (envContent.includes('SN_VENDOR_CODE=')) {
            // Update existing value
            envContent = envContent.replace(
              /SN_VENDOR_CODE=.*/,
              `SN_VENDOR_CODE=${vendorCode}`
            )
            message += `\n✓ Updated SN_VENDOR_CODE in .env file`
          } else {
            // Add new value
            envContent += `\n# Vendor code fetched from ${creds.host}\nSN_VENDOR_CODE=${vendorCode}\n`
            message += `\n✓ Added SN_VENDOR_CODE to .env file`
          }
          
          await writeFile(envPath, envContent, 'utf-8')
        } catch (error: any) {
          message += `\n⚠ Could not save to .env: ${error.message}`
        }
      }
      
      return message
    } catch (error: any) {
      return `Error fetching vendor code: ${error.message}`
    }
  },
})

export const getScopes = tool({
  description: "List application scopes from the ServiceNow instance",
  args: {
    auth: tool.schema.string().optional().describe("Auth profile alias to use (uses default if not specified)"),
    activeOnly: tool.schema.boolean().optional().describe("Only show active scopes (default: true)"),
  },
  async execute(args, context) {
    try {
      const creds = await getAuthCredentials(args.auth)
      
      const params: Record<string, string> = {
        sysparm_fields: 'scope,name,vendor,version,active,sys_id',
        sysparm_limit: '100'
      }
      
      if (args.activeOnly !== false) {
        params.sysparm_query = 'active=true'
      }
      
      const result = await tableApiRequest(
        creds.host,
        creds.username,
        creds.password,
        'sys_scope',
        params
      )
      
      return JSON.stringify(result, null, 2)
    } catch (error: any) {
      return `Error fetching scopes: ${error.message}`
    }
  },
})

export const getProfile = tool({
  description: "Get information about SDK auth profiles",
  args: {
    alias: tool.schema.string().optional().describe("Specific profile alias to get info for"),
  },
  async execute(args, context) {
    try {
      const { exec } = await import("child_process")
      const { promisify } = await import("util")
      const execAsync = promisify(exec)
      
      const { stdout } = await execAsync('npx @servicenow/sdk auth --list')
      const profiles = parseAuthProfiles(stdout)
      
      if (args.alias) {
        const profile = profiles.find(p => p.alias === args.alias)
        if (!profile) {
          return `Profile '${args.alias}' not found.\nAvailable profiles: ${profiles.map(p => p.alias).join(', ')}`
        }
        
        const envKey = `PROFILE_${profile.alias}`
        const hasPassword = !!process.env[envKey]
        
        return JSON.stringify({
          ...profile,
          passwordInEnv: hasPassword,
          envKey: envKey
        }, null, 2)
      }
      
      // Return all profiles with password status
      const profilesWithStatus = profiles.map(p => ({
        ...p,
        passwordInEnv: !!process.env[`PROFILE_${p.alias}`],
        envKey: `PROFILE_${p.alias}`
      }))
      
      return JSON.stringify(profilesWithStatus, null, 2)
    } catch (error: any) {
      return `Error getting profile info: ${error.message}`
    }
  },
})
