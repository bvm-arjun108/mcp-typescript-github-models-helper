export type GitHubModel = {
  id: string;
  displayName: string;
  publisher: string;
  context_window: number;
  summary: string;
};

const DEFAULT_API_BASE = "https://models.inference.ai.azure.com";

const apiBase = process.env.GITHUB_MODELS_API_BASE || DEFAULT_API_BASE;
const token = process.env.GITHUB_TOKEN || "";

function requireToken(): void {
  if (!token) {
    throw new Error("GITHUB_TOKEN is not set. Add it to your .env file.");
  }
}

export async function getModelsData(): Promise<GitHubModel[]> {
  requireToken();

  const response = await fetch(`${apiBase}/models`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "User-Agent": "mcp-typescript-github-models-helper"
    }
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to fetch models: ${response.status} ${text}`);
  }

  const data = (await response.json()) as { data?: GitHubModel[]; models?: GitHubModel[] };
  return data.data || data.models || [];
}

export async function compareModels(prompt: string, modelIds: string[]) {
  requireToken();

  const requests = modelIds.map(async (model) => {
    const response = await fetch(`${apiBase}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
        "User-Agent": "mcp-typescript-github-models-helper"
      },
      body: JSON.stringify({
        model,
        messages: [{ role: "user", content: prompt }]
      })
    });

    if (!response.ok) {
      const text = await response.text();
      return {
        model,
        error: `Request failed: ${response.status} ${text}`
      };
    }

    const data = await response.json();
    return {
      model,
      response: data
    };
  });

  return Promise.all(requests);
}
