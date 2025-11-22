import { tool } from "@opencode-ai/plugin"

export const auth = tool({
  description: "Authenticate with a ServiceNow instance and manage credentials",
  args: {
    action: tool.schema.enum(["add", "delete", "list", "use"]).describe("Authentication action to perform"),
    instance: tool.schema.string().optional().describe("Instance URL (e.g., dev274611.service-now.com)"),
    type: tool.schema.enum(["basic", "oauth"]).optional().describe("Authentication method"),
    alias: tool.schema.string().optional().describe("Alias for the credentials"),
  },
  async execute(args, context) {
    const { exec } = await import("child_process")
    const { promisify } = await import("util")
    const execAsync = promisify(exec)
    
    let cmd = "npx @servicenow/sdk auth"
    
    switch (args.action) {
      case "add":
        if (!args.instance) {
          throw new Error("Instance URL is required for adding credentials")
        }
        cmd += ` --add ${args.instance}`
        if (args.type) cmd += ` --type ${args.type}`
        if (args.alias) cmd += ` --alias ${args.alias}`
        break
      case "delete":
        if (!args.alias) {
          throw new Error("Alias is required for deleting credentials")
        }
        cmd += ` --delete ${args.alias}`
        break
      case "list":
        cmd += " --list"
        break
      case "use":
        if (!args.alias) {
          throw new Error("Alias is required for setting default credentials")
        }
        cmd += ` --use ${args.alias}`
        break
    }
    
    try {
      const { stdout, stderr } = await execAsync(cmd)
      return stdout || stderr || `Successfully executed: ${cmd}`
    } catch (error: any) {
      return `Error executing command: ${error.message}`
    }
  },
})

export const build = tool({
  description: "Build a ServiceNow application from Fluent API code",
  args: {
    project: tool.schema.string().optional().describe("Project name or path"),
  },
  async execute(args, context) {
    const { exec } = await import("child_process")
    const { promisify } = await import("util")
    const execAsync = promisify(exec)
    
    let cmd = "npx @servicenow/sdk build"
    if (args.project) {
      cmd += ` --project ${args.project}`
    }
    
    try {
      const { stdout, stderr } = await execAsync(cmd, { maxBuffer: 10 * 1024 * 1024 })
      return stdout || stderr || "Build completed successfully"
    } catch (error: any) {
      return `Build error: ${error.message}\n${error.stdout || ""}\n${error.stderr || ""}`
    }
  },
})

export const install = tool({
  description: "Install a ServiceNow application to an instance",
  args: {
    project: tool.schema.string().optional().describe("Project name or path"),
    auth: tool.schema.string().optional().describe("Authentication alias to use"),
    instance: tool.schema.string().optional().describe("Instance URL"),
  },
  async execute(args, context) {
    const { exec } = await import("child_process")
    const { promisify } = await import("util")
    const execAsync = promisify(exec)
    
    let cmd = "npx @servicenow/sdk install"
    if (args.project) cmd += ` --project ${args.project}`
    if (args.auth) cmd += ` --auth ${args.auth}`
    if (args.instance) cmd += ` --instance ${args.instance}`
    
    try {
      const { stdout, stderr } = await execAsync(cmd, { maxBuffer: 10 * 1024 * 1024 })
      return stdout || stderr || "Installation completed successfully"
    } catch (error: any) {
      return `Installation error: ${error.message}\n${error.stdout || ""}\n${error.stderr || ""}`
    }
  },
})

export const reinstall = tool({
  description: "Reinstall a ServiceNow application on an instance",
  args: {
    project: tool.schema.string().optional().describe("Project name or path"),
    auth: tool.schema.string().optional().describe("Authentication alias to use"),
    instance: tool.schema.string().optional().describe("Instance URL"),
  },
  async execute(args, context) {
    const { exec } = await import("child_process")
    const { promisify } = await import("util")
    const execAsync = promisify(exec)
    
    let cmd = "npx @servicenow/sdk install --reinstall"
    if (args.project) cmd += ` --project ${args.project}`
    if (args.auth) cmd += ` --auth ${args.auth}`
    if (args.instance) cmd += ` --instance ${args.instance}`
    
    try {
      const { stdout, stderr } = await execAsync(cmd, { maxBuffer: 10 * 1024 * 1024 })
      return stdout || stderr || "Reinstallation completed successfully"
    } catch (error: any) {
      return `Reinstallation error: ${error.message}\n${error.stdout || ""}\n${error.stderr || ""}`
    }
  },
})

export const init = tool({
  description: "Initialize a new ServiceNow project",
  args: {
    appName: tool.schema.string().describe("Name of the ServiceNow app project"),
    scopeName: tool.schema.string().describe("Scope name (must start with vendor prefix, max 18 chars)"),
    packageName: tool.schema.string().optional().describe("Package name for npm (follows npm naming conventions)"),
    template: tool.schema.enum(["base", "javascript.react", "typescript.basic", "typescript.react", "javascript.basic"]).optional().describe("Template to use for the project"),
    auth: tool.schema.string().optional().describe("Authentication alias to use"),
  },
  async execute(args, context) {
    const { spawn } = await import("child_process")
    
    // Build command arguments array
    const cmdArgs = ["@servicenow/sdk", "init"]
    
    // Add required parameters
    cmdArgs.push("--appName", args.appName)
    cmdArgs.push("--scopeName", args.scopeName)
    
    // Add optional parameters
    if (args.packageName) {
      cmdArgs.push("--packageName", args.packageName)
    }
    if (args.template) {
      cmdArgs.push("--template", args.template)
    }
    if (args.auth) {
      cmdArgs.push("--auth", args.auth)
    }
    
    // Use spawn with full inheritance for interactive commands
    return new Promise((resolve, reject) => {
      const process = spawn("npx", cmdArgs, {
        stdio: "inherit",  // Changed from ["inherit", "pipe", "pipe"] to "inherit"
        shell: true
      })
      
      process.on("close", (code) => {
        if (code === 0) {
          resolve(`Project ${args.appName} initialized successfully`)
        } else {
          reject(new Error(`Initialization failed with code ${code}`))
        }
      })
      
      process.on("error", (err) => {
        reject(new Error(`Initialization error: ${err.message}`))
      })
    })
  },
})

export const transform = tool({
  description: "Transform ServiceNow XML update sets to Fluent API code",
  args: {
    project: tool.schema.string().optional().describe("Project name or path"),
    updateSet: tool.schema.string().optional().describe("Update set XML file path"),
  },
  async execute(args, context) {
    const { exec } = await import("child_process")
    const { promisify } = await import("util")
    const execAsync = promisify(exec)
    
    let cmd = "npx @servicenow/sdk transform"
    if (args.project) cmd += ` --project ${args.project}`
    if (args.updateSet) cmd += ` --update-set ${args.updateSet}`
    
    try {
      const { stdout, stderr } = await execAsync(cmd, { maxBuffer: 10 * 1024 * 1024 })
      return stdout || stderr || "Transform completed successfully"
    } catch (error: any) {
      return `Transform error: ${error.message}\n${error.stdout || ""}\n${error.stderr || ""}`
    }
  },
})

export const dependencies = tool({
  description: "Manage ServiceNow application dependencies",
  args: {
    action: tool.schema.enum(["list", "add", "remove"]).describe("Dependency action"),
    dependency: tool.schema.string().optional().describe("Dependency name (for add/remove)"),
    project: tool.schema.string().optional().describe("Project name or path"),
  },
  async execute(args, context) {
    const { exec } = await import("child_process")
    const { promisify } = await import("util")
    const execAsync = promisify(exec)
    
    let cmd = "npx @servicenow/sdk dependencies"
    if (args.project) cmd += ` --project ${args.project}`
    
    switch (args.action) {
      case "add":
        if (!args.dependency) {
          throw new Error("Dependency name is required for add action")
        }
        cmd += ` --add ${args.dependency}`
        break
      case "remove":
        if (!args.dependency) {
          throw new Error("Dependency name is required for remove action")
        }
        cmd += ` --remove ${args.dependency}`
        break
      case "list":
        cmd += " --list"
        break
    }
    
    try {
      const { stdout, stderr } = await execAsync(cmd)
      return stdout || stderr || `Successfully executed: ${cmd}`
    } catch (error: any) {
      return `Error: ${error.message}`
    }
  },
})
