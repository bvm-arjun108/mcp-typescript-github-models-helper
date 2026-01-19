# MCP TypeScript GitHub Models Helper

TypeScript MCP server that lists available GitHub Models and compares responses across models for the same prompt. It exposes:

- Resource: `models://available`
- Tool: `compare_models`
- Prompt: `compare_models_prompt`

## Requirements

- Node.js 18+
- GitHub account with access to GitHub Models
- GitHub Personal Access Token (PAT) with GitHub Models access

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

3) Add your token

```env
GITHUB_TOKEN=your_github_token_here
```

Optional: override the API base URL in `.env`:

```env
GITHUB_MODELS_API_BASE=https://models.inference.ai.azure.com
```

## How it works

- `src/githubModels.ts` calls the GitHub Models API:
  - `GET /models` for available models
  - `POST /chat/completions` for responses
- `src/index.ts` wires the MCP server:
  - `models://available` formats a Markdown list of models
  - `compare_models` sends the same prompt to multiple models
  - `compare_models_prompt` builds a reusable comparison prompt

## Run (development)

```bash
npm run dev
```

## Build and run

```bash
npm run build
npm start
```

## Test with MCP Inspector

```bash
npm run build
npx @modelcontextprotocol/inspector node dist/index.js
```

Open the URL printed by the Inspector and use:

- Resources tab -> `models://available`
- Tools tab -> `compare_models`
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

- `Cannot find name 'process'`: install Node types with `npm install --save-dev @types/node`.
- `401/403 from GitHub Models`: verify the PAT has GitHub Models access.
- Inspector connection errors: rebuild and re-run `npx @modelcontextprotocol/inspector node dist/index.js`.
