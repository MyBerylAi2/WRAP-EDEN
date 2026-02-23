import { NextRequest, NextResponse } from "next/server";

// ═══════════════════════════════════════════════════════════════════
// KIMI K2.5 VISUAL CODE GENERATOR
// Uses Moonshot K2.5's MoE architecture (1T params, 32B active)
// Handles: Landing page generation, component building, code tasks
// 256K context window — can ingest entire codebases
// ═══════════════════════════════════════════════════════════════════

const KIMI_URL = process.env.KIMI_BASE_URL || "https://api.moonshot.cn/v1";

type KimiTask = "landing-page" | "component" | "code-review" | "refactor" | "general";

const KIMI_SYSTEMS: Record<KimiTask, string> = {
  "landing-page": `You are a premium web developer for Beryl AI Labs / Eden Realism Engine.

BRAND GUIDELINES:
- Colors: Primary Gold #C5B358, Bright Gold #F5E6A3, Dark Gold #8B6914, Green #4CAF50, Background #080503, Text #E8DCC8
- Typography: Cinzel Decorative (logo), Cinzel (headings, uppercase, 3-6px letter-spacing), Cormorant Garamond (body)
- Tone: Luxury tech — Rolls Royce meets Silicon Valley
- Style: Dark luxury, gold accents, glass morphism, subtle gradients

Generate complete, production-ready React/Next.js components with Tailwind CSS.
Use 'use client' directive. Include all imports. NO placeholders — every element works.
Every button has an onClick handler. Every form has validation. Every component is fully styled.`,

  "component": `You are a React/Next.js component builder for the Eden Realism Engine SaaS platform.
Follow Eden brand guidelines: dark luxury theme, gold accents (#C5B358), Cinzel headings, Cormorant body text.
Generate complete TypeScript React components with Tailwind CSS. NO placeholders.
Include all state management, event handlers, and API calls.`,

  "code-review": `You are a senior code reviewer for Beryl AI Labs.
Review the provided code for: security vulnerabilities, performance issues, accessibility problems, and adherence to Eden brand guidelines.
Provide specific line-by-line feedback with fixes.`,

  "refactor": `You are a code refactoring expert. Improve the provided code for:
- Performance and efficiency
- TypeScript type safety
- Next.js App Router best practices
- Readability and maintainability
Return the complete refactored code.`,

  "general": `You are an AI assistant for Beryl AI Labs. Help with development tasks for the Eden Realism Engine platform.`,
};

export async function POST(req: NextRequest) {
  try {
    const { task, message, context, maxTokens } = await req.json();
    const apiKey = process.env.KIMI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Kimi API key not configured" }, { status: 500 });
    }

    const taskType: KimiTask = task || "general";
    const system = KIMI_SYSTEMS[taskType] || KIMI_SYSTEMS.general;

    // Build message with optional context (Kimi can handle 256K tokens)
    let userMsg = message;
    if (context) {
      userMsg = `CONTEXT:\n${context}\n\nTASK:\n${message}`;
    }

    const res = await fetch(`${KIMI_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "moonshot-v1-auto",
        messages: [
          { role: "system", content: system },
          { role: "user", content: userMsg },
        ],
        max_tokens: maxTokens || 4000,
        temperature: 0.7,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      return NextResponse.json({
        error: `Kimi ${res.status}: ${errText.slice(0, 200)}`,
      }, { status: res.status });
    }

    const data = await res.json();
    const reply = data.choices?.[0]?.message?.content || "";

    return NextResponse.json({
      reply,
      engine: "kimi-k2.5",
      model: "moonshot-v1-auto",
      task: taskType,
      tokens: data.usage || {},
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
