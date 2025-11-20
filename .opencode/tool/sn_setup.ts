import { tool } from "@opencode-ai/plugin"

/**
 * ServiceNow Setup and Environment Tools
 * 
 * These tools help manage the ServiceNow development environment,
 * including vendor code management and environment configuration.
 */

export const getVendorCode = tool({
  description: "Get the ServiceNow vendor code from .env file, optionally fetching from instance if missing",
  args: {
    fetchIfMissing: tool.schema.boolean().optional().describe("Fetch from instance and save to .env if not found locally (default: false)"),
    auth: tool.schema.string().optional().describe("Auth profile alias to use when fetching from instance"),
  },
  async execute(args, context) {
    try {
      const { readFile, writeFile } = await import('fs/promises')
      const { exec } = await import("child_process")
      const { promisify } = await import("util")
      const execAsync = promisify(exec)
      const envPath = '.env'
      
      // Check if .env file exists
      let envContent: string
      try {
        envContent = await readFile(envPath, 'utf-8')
      } catch (error: any) {
        if (error.code === 'ENOENT') {
          if (!args.fetchIfMissing) {
            return `❌ .env file not found\n\nPlease create a .env file or use fetchIfMissing=true to fetch vendor code from instance.`
          }
          // Create .env from .env.example if it exists
          try {
            const exampleContent = await readFile('.env.example', 'utf-8')
            envContent = exampleContent
          } catch {
            envContent = '# ServiceNow Configuration\n'
          }
        } else {
          throw error
        }
      }
      
      // Parse vendor code from .env
      const vendorCodeMatch = envContent.match(/^SN_VENDOR_CODE=(.*)$/m)
      const existingVendorCode = vendorCodeMatch ? vendorCodeMatch[1].trim() : ''
      
      if (existingVendorCode) {
        return `✓ Vendor code found in .env: ${existingVendorCode}\n\nNo action needed - vendor code is already configured.`
      }
      
      // Vendor code not found or empty
      if (!args.fetchIfMissing) {
        return `⚠ Vendor code not set in .env file\n\nThe SN_VENDOR_CODE variable is empty or missing.\n\nOptions:\n1. Manually add it to .env: SN_VENDOR_CODE=x_xxxxx\n2. Run this tool with fetchIfMissing=true to fetch it from your instance`
      }
      
      // Fetch from instance
      console.log('Fetching vendor code from ServiceNow instance...')
      
      // Get auth credentials
      const { stdout: authList } = await execAsync('npx @servicenow/sdk auth --list')
      
      // Parse auth profiles
      interface AuthProfile {
        alias: string
        host: string
        username: string
        type: string
        default: boolean
      }
      
      const profiles: AuthProfile[] = []
      const lines = authList.split('\n')
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
      
      // Find the profile to use
      let profile: AuthProfile | undefined
      if (args.auth) {
        profile = profiles.find(p => p.alias === args.auth)
        if (!profile) {
          return `❌ Auth profile '${args.auth}' not found\n\nAvailable profiles: ${profiles.map(p => p.alias).join(', ')}\n\nRun: npx @servicenow/sdk auth --list`
        }
      } else {
        profile = profiles.find(p => p.default) || profiles[0]
        if (!profile) {
          return `❌ No auth profiles found\n\nPlease run: npx @servicenow/sdk auth --add <instance>`
        }
      }
      
      // Get password from environment
      const envKey = `PROFILE_${profile.alias}`
      const password = process.env[envKey]
      
      if (!password) {
        return `❌ Password not found in .env file\n\nAdd this line to your .env file:\n${envKey}="your_password_here"`
      }
      
      // Make API request to fetch vendor code
      const url = `${profile.host}/api/now/table/sys_properties?sysparm_query=name=glide.appcreator.company.code&sysparm_fields=value,name`
      const auth = Buffer.from(`${profile.username}:${password}`).toString('base64')
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Basic ${auth}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })
      
      if (!response.ok) {
        const text = await response.text()
        return `❌ Failed to fetch vendor code from instance (${response.status})\n\n${text}\n\nInstance: ${profile.host}\nProfile: ${profile.alias}`
      }
      
      const result = await response.json()
      
      if (!result.result || result.result.length === 0) {
        return `❌ Vendor code not found on instance\n\nThe property 'glide.appcreator.company.code' may not be set on instance ${profile.host}`
      }
      
      const vendorCode = result.result[0].value
      
      if (!vendorCode) {
        return `❌ Vendor code property exists but has no value\n\nInstance: ${profile.host}\nPlease set the vendor code in ServiceNow: System Properties > glide.appcreator.company.code`
      }
      
      // Save to .env
      if (envContent.includes('SN_VENDOR_CODE=')) {
        // Update existing line
        envContent = envContent.replace(
          /SN_VENDOR_CODE=.*/,
          `SN_VENDOR_CODE=${vendorCode}`
        )
      } else {
        // Add new line
        envContent += `\n# Vendor code fetched from ${profile.host} on ${new Date().toISOString()}\nSN_VENDOR_CODE=${vendorCode}\n`
      }
      
      await writeFile(envPath, envContent, 'utf-8')
      
      return `✓ Vendor code retrieved and saved: ${vendorCode}\n\nInstance: ${profile.host}\nProfile: ${profile.alias}\nSaved to: .env\n\nYou can now use this vendor code for initializing ServiceNow projects.`
      
    } catch (error: any) {
      return `❌ Error: ${error.message}\n\n${error.stack || ''}`
    }
  },
})

export const checkEnv = tool({
  description: "Check the .env file for required ServiceNow configuration and report status",
  args: {},
  async execute(args, context) {
    try {
      const { readFile } = await import('fs/promises')
      const { exec } = await import("child_process")
      const { promisify } = await import("util")
      const execAsync = promisify(exec)
      
      let report = "# ServiceNow Environment Check\n\n"
      
      // Check .env file
      let envContent: string
      try {
        envContent = await readFile('.env', 'utf-8')
        report += "✓ .env file exists\n\n"
      } catch (error: any) {
        if (error.code === 'ENOENT') {
          report += "❌ .env file not found\n"
          report += "   Create one by copying .env.example:\n"
          report += "   cp .env.example .env\n\n"
          return report
        }
        throw error
      }
      
      // Check vendor code
      const vendorCodeMatch = envContent.match(/^SN_VENDOR_CODE=(.*)$/m)
      const vendorCode = vendorCodeMatch ? vendorCodeMatch[1].trim() : ''
      
      if (vendorCode) {
        report += `✓ Vendor code configured: ${vendorCode}\n`
      } else {
        report += "⚠ Vendor code not set (SN_VENDOR_CODE is empty)\n"
        report += "   Run: getVendorCode with fetchIfMissing=true\n"
      }
      report += "\n"
      
      // Check SDK auth profiles
      try {
        const { stdout } = await execAsync('npx @servicenow/sdk auth --list')
        
        // Parse profiles
        const profileAliases: string[] = []
        const lines = stdout.split('\n')
        for (const line of lines) {
          const match = line.match(/^\*?\[(.+)\]/)
          if (match) {
            profileAliases.push(match[1])
          }
        }
        
        if (profileAliases.length > 0) {
          report += `✓ SDK auth profiles configured: ${profileAliases.join(', ')}\n\n`
          
          // Check passwords in .env
          report += "## Profile Passwords in .env:\n\n"
          let allPasswordsFound = true
          for (const alias of profileAliases) {
            const envKey = `PROFILE_${alias}`
            const hasPassword = envContent.includes(`${envKey}=`) && 
                               !envContent.match(new RegExp(`${envKey}=\\s*$`, 'm'))
            
            if (hasPassword) {
              report += `✓ ${envKey} configured\n`
            } else {
              report += `❌ ${envKey} missing or empty\n`
              report += `   Add to .env: ${envKey}="your_password_here"\n`
              allPasswordsFound = false
            }
          }
          
          if (allPasswordsFound) {
            report += "\n✓ All profile passwords configured\n"
          }
        } else {
          report += "⚠ No SDK auth profiles found\n"
          report += "   Run: npx @servicenow/sdk auth --add <instance>\n"
        }
      } catch (error: any) {
        report += "❌ Could not check SDK auth profiles\n"
        report += `   Error: ${error.message}\n`
        report += "   ServiceNow SDK may not be installed\n"
      }
      
      report += "\n## Summary:\n\n"
      if (vendorCode && !report.includes('❌')) {
        report += "✓ Environment is properly configured for ServiceNow development\n"
      } else {
        report += "⚠ Some configuration is missing - see details above\n"
      }
      
      return report
    } catch (error: any) {
      return `❌ Error checking environment: ${error.message}\n\n${error.stack || ''}`
    }
  },
})
