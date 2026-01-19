# MCP TypeScript GitHub Models Helper

TypeScript MCP server that integrates with GitHub Models to list available models and compare responses across models for the same prompt. This README includes full requirements, project description, build steps, and testing flow.

## Project requirements

- Node.js 18+
- GitHub account with access to GitHub Models
- GitHub Personal Access Token (PAT) with GitHub Models access
- MCP Inspector (runs via `npx`)

## Project description

This server exposes three MCP primitives:

- Resource: `models://available` (lists available models)
- Tool: `compare_models` (compares model responses to the same prompt)
- Prompt: `compare_models_prompt` (builds a reusable comparison prompt)

## Project structure

```
mcp-typescript-github-models-helper/
  src/
    githubModels.ts
    index.ts
  .env.template
  .gitignore
  package.json
  tsconfig.json
```

## Step-by-step setup

1) Install dependencies

```bash
npm install
```

2) Create `.env` from the template

```bash
cp .env.template .env
```

3) Add your GitHub Models token

```env
GITHUB_TOKEN=your_github_token_here
```

Optional: override the API base URL in `.env`:

```env
GITHUB_MODELS_API_BASE=https://models.inference.ai.azure.com
```

## Step-by-step implementation (what the code does)

1) `src/githubModels.ts`
   - Fetches available models with `GET /models`
   - Compares models with `POST /chat/completions`
   - Uses `GITHUB_TOKEN` from `.env`

2) `src/index.ts`
   - Creates the MCP server
   - Registers the `models://available` resource
   - Registers the `compare_models` tool
   - Registers the `compare_models_prompt` prompt
   - Connects to STDIO transport

## Run (development)

```bash
npm run dev
```

## Build and run (production-style)

```bash
npm run build
npm start
```

## Step-by-step testing with MCP Inspector

1) Build the server

```bash
npm run build
```

2) Start the Inspector

```bash
npx @modelcontextprotocol/inspector node dist/index.js
```

3) Open the URL printed by the Inspector and click Connect

4) Test resources
   - Resources tab -> `models://available`

5) Test tools
   - Tools tab -> `compare_models`

6) Test prompts
   - Prompts tab -> `compare_models_prompt`

## Claude Desktop configuration

Add this to your `claude_desktop_config.json` and update the paths:

```json
{
  "mcpServers": {
    "GitHub Models Comparison": {
      "command": "node",
      "args": [
        "/absolute/path/to/mcp-typescript-github-models-helper/dist/index.js"
      ],
      "env": {
        "GITHUB_TOKEN": "your_github_personal_access_token"
      }
    }
  }
}
```

Note: This is not secure for production. Use proper secrets management and authentication when publishing MCP servers.

## Troubleshooting

- `Cannot find name 'process'`: run `npm install --save-dev @types/node`.
- `401/403 from GitHub Models`: verify the PAT has GitHub Models access.
- Inspector connection errors: rebuild and re-run `npx @modelcontextprotocol/inspector node dist/index.js`.
