# MCP TypeScript GitHub Models Helper

TypeScript MCP server that lists available GitHub Models and compares responses across models for the same prompt.

## Requirements

- Node.js 18+
- GitHub account with access to GitHub Models
- A GitHub Personal Access Token with access to GitHub Models

## Setup

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

Open the URL printed by the Inspector and use the Resources, Tools, and Prompts tabs.

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
