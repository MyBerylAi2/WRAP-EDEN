import { NextRequest, NextResponse } from "next/server";

// ═══════════════════════════════════════════════════════════════════
// EDEN AI ROUTER — Central dispatch to all models
// Distributes work across Grok, Kimi, GLM-5, OpenAI, Claude
// Purpose: Avoid Claude rate limits by offloading tasks
// ═══════════════════════════════════════════════════════════════════

type ModelEngine = "grok" | "kimi" | "glm5" | "openai" | "claude" | "auto";
type TaskType = "prompt-enhance" | "governance" | "code-gen" | "chat" | "embed" | "voice" | "quality-check";

// Auto-routing: which model handles what by default
const TASK_ROUTING: Record<TaskType, ModelEngine> = {
  "prompt-enhance": "grok",      // Grok: fast, creative, uncensored
  "governance": "glm5",          // GLM-5: independent quality gate
  "code-gen": "kimi",            // Kimi K2.5: visual coding, 256K context
  "chat": "grok",                // Grok: fast conversational
  "embed": "openai",             // OpenAI: best embeddings
  "voice": "grok",               // Grok: realtime voice API
  "quality-check": "glm5",       // GLM-5: output validation
};

// ═══ ENGINE CONFIGS ═══
const ENGINES = {
  grok: {
    url: "https://api.x.ai/v1/chat/completions",
    keyEnv: "XAI_API_KEY",
    model: "grok-3-mini-fast",
    maxTokens: 2000,
  },
  kimi: {
    url: "https://api.moonshot.cn/v1/chat/completions",
    keyEnv: "KIMI_API_KEY",
    model: "moonshot-v1-auto",
    maxTokens: 4000,
  },
  glm5: {
    url: "https://open.bigmodel.cn/api/paas/v4/chat/completions",
    keyEnv: "GLM5_API_KEY",
    model: "glm-4-plus",
    maxTokens: 2000,
  },
  openai: {
    url: "https://api.openai.com/v1/chat/completions",
    keyEnv: "OPENAI_API_KEY",
    model: "gpt-4o-mini",
    maxTokens: 2000,
  },
  claude: {
    url: "https://api.anthropic.com/v1/messages",
    keyEnv: "ANTHROPIC_API_KEY",
    model: "claude-sonnet-4-20250514",
    maxTokens: 2000,
  },
};

async function callEngine(engine: ModelEngine, system: string, userMessage: string, temperature = 0.7) {
  if (engine === "auto") throw new Error("Auto engine must be resolved before calling");

  const config = ENGINES[engine];
  const apiKey = process.env[config.keyEnv];
  if (!apiKey) throw new Error(`${engine} API key not configured (${config.keyEnv})`);

  if (engine === "claude") {
    // Anthropic uses different API format
    const res = await fetch(config.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: config.model,
        max_tokens: config.maxTokens,
        system,
        messages: [{ role: "user", content: userMessage }],
      }),
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Claude ${res.status}: ${err.slice(0, 200)}`);
    }
    const data = await res.json();
    return data.content?.[0]?.text || "";
  }

  // OpenAI-compatible format (Grok, Kimi, GLM-5, OpenAI)
  const res = await fetch(config.url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: config.model,
      messages: [
        { role: "system", content: system },
        { role: "user", content: userMessage },
      ],
      max_tokens: config.maxTokens,
      temperature,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`${engine} ${res.status}: ${err.slice(0, 200)}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content || "";
}

export async function POST(req: NextRequest) {
  try {
    const { task, engine, system, message, temperature } = await req.json();

    // Resolve engine: explicit or auto-routed by task type
    let resolvedEngine: ModelEngine = engine || "auto";
    if (resolvedEngine === "auto") {
      resolvedEngine = TASK_ROUTING[task as TaskType] || "grok";
    }

    const systemPrompt = system || "You are a helpful AI assistant for the Eden Realism Engine platform.";

    const reply = await callEngine(resolvedEngine, systemPrompt, message, temperature || 0.7);

    return NextResponse.json({
      reply,
      engine: resolvedEngine,
      model: ENGINES[resolvedEngine]?.model,
      task: task || "chat",
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
