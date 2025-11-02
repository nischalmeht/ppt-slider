// import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
// import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
// import { error } from "console";
// import { z } from "zod";
// import * as fs from "fs/promises";
// import * as path from "path";
// const server = new McpServer({
//   name: "weather-github",
//   version: "1.0.0",
//   capabilities: {
//     resources: {},
//     tools: {},
//   },
// });
// // ---- Existing Tool ----
// server.tool(
//   "add-numbers",
//   "Add two numbers",
//   {
//     a: z.number().describe("First number"),
//     b: z.number().describe("Second number"),
//   },
//   ({ a, b }) => {
//     const sum = a + b;
//     return {
//       content: [{ type: "text", text: `The sum of ${a} and ${b} is ${sum}` }],
//     };
//   }
// );
// // ---- NEW: Fetch GitHub Repo Info Tool ----
// server.tool(
//   "fetch-github-repo",
//   "Fetch details of a GitHub repository",
//   {
//     username: z.string().describe("GitHub username or organization"),
//   },
//   async ({ username }) => {
//     const url = `https://api.github.com/users/${username}`;
//     const res = await fetch(url, {
//       headers: {
//         "User-Agent": "MCP-SERVER",
//       }
//     });
//     if (!res.ok) {
//       return {
//         content: [
//           { type: "error", text: `Failed to fetch repo: ${res.statusText}` }
//         ]
//       };
//     }
//     const data = await res.json();
//     return {
//       content: [
//         {
//           type: "text",
//           text: `Repository: ${data.full_name}
// Description: ${data.description}
// Stars: ${data.stargazers_count}
// Forks: ${data.forks_count}
// Language: ${data.language}
// URL: ${data.html_url}
// `
//         }
//       ]
//     };
//   }
// );
// server.resource(
//   "apartment-rules",
//   "rules://all",{
//     description:"Resource for all apartment rule",
//     mimeType:"text/plain"
//   },
//   async(url)=>{
//     const uriString= url.toString();
//     const _fileName= fileURLToPATH(import.meta.url);
//     const __dirname= path.dirname(_fileName);
//     const rules = await  fs.readFile(
//       path.resolve(__dirname,"../src/data/rules.doc"),"utf-8"
//     );
//     return {
//       content:[
//         {
//           uri:uriString,
//            mimeType:"text/plain",
//            text:rules
//         }
//       ]
//     }
//   }
// )
// async function main() {
//   const transport = new StdioServerTransport();
//   await server.connect(transport);
// }
// main().catch((error) => {
//   console.error("Error in main", error);
//   process.exit(1);
// });
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import * as fs from "fs/promises";
import * as path from "path";
import { fileURLToPath } from "url";
const server = new McpServer({
    name: "weather-github",
    version: "1.0.0",
    capabilities: {
        tools: {},
        resources: { list: true, read: true },
    },
});
// ---- Add Number Tool ----
server.tool("add-numbers", "Add two numbers", {
    a: z.number(),
    b: z.number(),
}, ({ a, b }) => ({
    content: [
        { type: "text", text: `The sum of ${a} and ${b} is ${a + b}` }
    ]
}));
// ---- GitHub User Fetch Tool ----
server.tool("fetch-github-user", "Fetch GitHub user account info", {
    username: z.string(),
}, async ({ username }) => {
    const res = await fetch(`https://api.github.com/users/${username}`, {
        headers: { "User-Agent": "MCP-SERVER" }
    });
    if (!res.ok) {
        return { content: [{ type: "error", text: `User not found` }] };
    }
    const u = await res.json();
    return {
        content: [
            {
                type: "text",
                text: `
Login: ${u.login}
Name: ${u.name}
Followers: ${u.followers}
Following: ${u.following}
Public Repos: ${u.public_repos}
Profile: ${u.html_url}
          `.trim()
            }
        ]
    };
});
// ---- Resource Loader ----
server.resource("apartment-rules", "rules://all", {
    description: "Apartment rules text file",
    mimeType: "text/plain",
}, async (url) => {
    const __file = fileURLToPath(import.meta.url);
    const __dir = path.dirname(__file);
    const rules = await fs.readFile(path.resolve(__dir, "../src/data/rules.txt"), "utf-8");
    return {
        content: [
            {
                uri: url.toString(),
                mimeType: "text/plain",
                text: rules
            }
        ]
    };
});
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
}
main().catch((err) => {
    console.error("Error in main:", err);
    process.exit(1);
});
