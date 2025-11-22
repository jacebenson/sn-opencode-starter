import { tool } from "@opencode-ai/plugin"

/**
 * ServiceNow Setup and Environment Tools
 * 
 * These tools help manage the ServiceNow development environment.
 * 
 * .env Usage:
 * - Reads/writes: SN_VENDOR_CODE (vendor code for scoping)
 * - Reads: PROFILE_<alias> (passwords for SDK auth profiles, only when fetching from instance)
 */

export const getVendorCode = tool({
  description: "Get the ServiceNow vendor code from .env file (SN_VENDOR_CODE), optionally fetching from instance if missing. Delegates to sn_api_getVendorCode for fetching.",
  args: {
    fetchIfMissing: tool.schema.boolean().optional().describe("Fetch from instance using sn_api_getVendorCode and save to .env if not found locally (default: false)"),
    auth: tool.schema.string().optional().describe("Auth profile alias to use when fetching from instance"),
  },
  async execute(args, context) {
    try {
      const { readFile } = await import('fs/promises')
      const envPath = '.env'
      
      // Check if .env file exists
      let envContent: string
      try {
        envContent = await readFile(envPath, 'utf-8')
      } catch (error: any) {
        if (error.code === 'ENOENT') {
          if (!args.fetchIfMissing) {
            return `❌ .env file not found\n\nPlease create a .env file or use fetchIfMissing=true to fetch vendor code from instance.\n\nTo create .env:\n  cp .env.example .env`
          }
          // If fetchIfMissing, we'll let sn_api_getVendorCode handle it
          return `❌ .env file not found\n\nPlease use the sn_api_getVendorCode tool with saveToEnv=true to fetch and save the vendor code.\n\nAlternatively, create .env manually:\n  cp .env.example .env\n  # Add: SN_VENDOR_CODE=xxxxx`
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
        return `⚠ Vendor code not set in .env file\n\nThe SN_VENDOR_CODE variable is empty or missing.\n\nOptions:\n1. Manually add it to .env: SN_VENDOR_CODE=xxxxx\n2. Use sn_api_getVendorCode tool with saveToEnv=true to fetch from instance`
      }
      
      // Suggest using sn_api_getVendorCode instead
      return `⚠ Vendor code not found in .env\n\nTo fetch vendor code from your instance, use the sn_api_getVendorCode tool:\n  - Tool: sn_api_getVendorCode\n  - Args: { saveToEnv: true${args.auth ? `, auth: "${args.auth}"` : ''} }\n\nThis will fetch the vendor code from your ServiceNow instance and save it to .env.`
      
    } catch (error: any) {
      return `❌ Error: ${error.message}\n\n${error.stack || ''}`
    }
  },
})

export const checkEnv = tool({
  description: "Check the .env file for SN_VENDOR_CODE configuration and report status. Note: SDK auth profile passwords (PROFILE_*) are optional in .env but recommended for SDK CLI tools.",
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
      
      // Check vendor code (PRIMARY CONCERN)
      const vendorCodeMatch = envContent.match(/^SN_VENDOR_CODE=(.*)$/m)
      const vendorCode = vendorCodeMatch ? vendorCodeMatch[1].trim() : ''
      
      if (vendorCode) {
        report += `✓ Vendor code configured: ${vendorCode}\n`
      } else {
        report += "⚠ Vendor code not set (SN_VENDOR_CODE is empty)\n"
        report += "   Use sn_api_getVendorCode with saveToEnv=true to fetch from instance\n"
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
          
          // Check passwords in .env (OPTIONAL but helpful info)
          report += "## Profile Passwords in .env (optional, but recommended for SDK CLI):\n\n"
          for (const alias of profileAliases) {
            const envKey = `PROFILE_${alias}`
            const hasPassword = envContent.includes(`${envKey}=`) && 
                               !envContent.match(new RegExp(`${envKey}=\\s*$`, 'm'))
            
            if (hasPassword) {
              report += `✓ ${envKey} configured\n`
            } else {
              report += `ℹ ${envKey} not set (optional)\n`
              report += `   Add to .env if using SDK CLI: ${envKey}="your_password_here"\n`
            }
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
        report += "✓ Environment is configured for ServiceNow development\n"
        report += "ℹ Profile passwords in .env are optional but recommended for SDK CLI tools\n"
      } else {
        report += "⚠ Some configuration is missing - see details above\n"
      }
      
      return report
    } catch (error: any) {
      return `❌ Error checking environment: ${error.message}\n\n${error.stack || ''}`
    }
  },
})
