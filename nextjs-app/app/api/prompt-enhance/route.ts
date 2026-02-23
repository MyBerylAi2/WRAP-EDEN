import { NextRequest, NextResponse } from "next/server";

// ═══════════════════════════════════════════════════════════════════
// GROK PROMPT ENHANCER — Offloads prompt refinement from Claude
// Uses Grok's fast, creative, uncensored model for prompt testing
// Applies EDEN ALPHA-26 knowledge for photorealism optimization
// ═══════════════════════════════════════════════════════════════════

const EDEN_PROMPT_EXPERT = `You are the EDEN ALPHA-26 Prompt Expert — the world's best diffusion model prompt architect.

YOUR KNOWLEDGE BASE:
- Six Pillars of Photorealism: Skin Texture, Subsurface Scattering, Lighting Direction, Micro-Expression, Environmental Interaction, Camera Physics
- Anti-Plastic Formula: matte skin, visible pores, powder-set complexion, natural texture
- SDXL Optimal Settings: CFG 4.5, DPM++ 2M Karras sampler, 30 steps, 1024x1024 base, Hires Fix 1.5x at 0.38 denoise
- Smart Negative Engine: Always-active base negatives + conditional triggers based on scene type
- 6-Layer Framework: Subject Identity → Wardrobe → Body Physics → Camera → Emotion → Environment
- EDEN Camera Standard: ARRI ALEXA 35, Kodak Vision3 250D, 35mm anamorphic, f/1.4
- Skin Standard: 100 keywords for maximum realness, 0.3 deviation rule from reference texture

YOUR JOB:
Take any rough prompt and transform it into a cinema-grade, Eden-standard prompt that produces photorealistic results.

RULES:
1. ALWAYS add camera specs (ARRI ALEXA 35 standard)
2. ALWAYS specify skin texture (matte, visible pores, natural)
3. ALWAYS include lighting direction (never just "dramatic lighting")
4. NEVER use glossy/shiny/oily skin descriptors
5. ALWAYS be specific about hairstyle, not just "natural hair"
6. Keep prompts under 200 words — tight and focused
7. Return ONLY the enhanced prompt. No explanations.`;

export async function POST(req: NextRequest) {
  try {
    const { prompt, tier, mediaType } = await req.json();
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Grok API key not configured" }, { status: 500 });
    }

    const userMsg = `Enhance this ${mediaType || "image"} prompt to EDEN ALPHA-26 cinema standard (tier: ${tier || "ice"}):\n\n"${prompt}"`;

    const res = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "grok-3-mini-fast",
        messages: [
          { role: "system", content: EDEN_PROMPT_EXPERT },
          { role: "user", content: userMsg },
        ],
        max_tokens: 800,
        temperature: 0.85,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      return NextResponse.json({
        error: `Grok ${res.status}: ${errText.slice(0, 200)}`,
      }, { status: res.status });
    }

    const data = await res.json();
    const enhanced = data.choices?.[0]?.message?.content?.trim() || "";

    return NextResponse.json({
      original: prompt,
      enhanced,
      engine: "grok-3-mini-fast",
      tier: tier || "ice",
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
