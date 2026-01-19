import "dotenv/config";

import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

import { compareModels, getModelsData } from "./githubModels.js";

type CompareModelsParams = {
  prompt: string;
  models: string[];
};

type CompareModelsPromptParams = {
  prompt: string;
  models?: string;
};

// Create an MCP server
const server = new McpServer({
  name: "GitHub Models Helper",
  version: "1.0.0"
});

// Register the models://available resource
server.resource(
  "models://available",
  new ResourceTemplate("models://available", { list: undefined }),
  { description: "List available language models" },
  async (uri) => {
    const models = await getModelsData();
    const formattedText = [
      "# Available Models",
      "",
      ...models
        .map((model) => [
          `## ${model.displayName} (\`${model.id}\`)`,
          `- Publisher: ${model.publisher}`,
          `- Context Window: ${model.context_window.toLocaleString()} tokens`,
          `- Summary: ${model.summary}`,
          ""
        ])
        .flat()
    ].join("\n");

    return {
      contents: [
        {
          uri: uri.href,
          text: formattedText
        }
      ]
    };
  }
);

// Register the compare_models tool
server.tool(
  "compare_models",
  "Compare responses from different models for the same prompt",
  {
    prompt: z.string().describe("The prompt to send to all models"),
    models: z
      .array(z.string())
      .default(["gpt-4", "claude-3"])
      .describe("List of model IDs to compare")
  },
  async ({ prompt, models }: CompareModelsParams) => {
    const availableModels = await getModelsData();
    const validModels = models.filter((id) =>
      availableModels.some((model) => model.id === id)
    );

    if (validModels.length === 0) {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                error: "No valid models specified",
                available_models: availableModels.map((m) => m.id)
              },
              null,
              2
            )
          }
        ]
      };
    }

    const responses = await compareModels(prompt, validModels);

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              results: responses,
              summary: {
                models_compared: validModels,
                prompt
              }
            },
            null,
            2
          )
        }
      ]
    };
  }
);

// Register the compare_models_prompt
server.prompt(
  "compare_models_prompt",
  "Create a comparison prompt with selected models",
  {
    prompt: z.string().describe("The prompt to compare"),
    models: z
      .string()
      .optional()
      .describe("Comma-separated list of models to compare")
  },
  ({ prompt, models }: CompareModelsPromptParams) => {
    const message = models
      ? `Please compare how different AI models respond to this prompt:\n\nPrompt: ${prompt}\n\nPlease use these specific models: ${models}`
      : `Please compare how different AI models respond to this prompt:\n\nPrompt: ${prompt}\n\nPlease use the default models available.`;

    return {
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: message
          }
        }
      ]
    };
  }
);

// Start receiving messages on stdin and sending messages on stdout
const transport = new StdioServerTransport();
await server.connect(transport);
