import { NextRequest, NextResponse } from "next/server";

// ═══════════════════════════════════════════════════════════════════
// GLM-5 GOVERNANCE ENDPOINT — Independent Quality Gate
// Uses ZhipuAI GLM-4-Plus as an independent auditor
// Validates outputs from other HEARTBEAT agents
// ═══════════════════════════════════════════════════════════════════

const GLM5_URL = process.env.GLM5_BASE_URL || "https://open.bigmodel.cn/api/paas/v4";

type GovernanceMode = "passive" | "active" | "audit";

const GOVERNANCE_SYSTEM = `You are the EDEN Governance Overseer — an independent AI quality auditor for Beryl AI Labs.

YOUR ROLE: Validate outputs from other AI agents (Grok, Kimi, Claude) against Eden quality standards.

EDEN QUALITY STANDARDS:
1. PHOTOREALISM: Skin must be matte with visible pores, never glossy/shiny/plastic. Natural texture always.
2. CINEMA: ARRI ALEXA 35 standard. Bright lighting. Never dark/moody shadows hiding subjects.
3. BRAND: Luxury tech tone. Cinzel headings, Cormorant body. Gold (#C5B358) + Green (#4CAF50) palette.
4. CONTENT TIERS: ice (SFW), mild (sensual), spicy (explicit adult for Lulu platform only). Tier must match request.
5. PROMPTS: Must follow 6-layer framework (Subject, Wardrobe, Body Physics, Camera, Emotion, Environment).
6. REALISM: 0.3 deviation rule — output cannot drift more than 0.3 from reference face texture standard.
7. ANTI-AI: Smart Negative Engine must be active. No glossy skin, no extra fingers, no plastic hair.

OUTPUT FORMAT (JSON):
{
  "pass": true/false,
  "score": 0-100,
  "issues": ["list of specific problems found"],
  "fixes": ["specific corrections to apply"],
  "tier_match": true/false,
  "recommendation": "approve" | "revise" | "reject"
}`;

export async function POST(req: NextRequest) {
  try {
    const { content, mode, contentType, requestedTier } = await req.json();
    const apiKey = process.env.GLM5_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "GLM-5 API key not configured" }, { status: 500 });
    }

    const governanceMode: GovernanceMode = mode || "passive";

    let userMessage: string;
    switch (governanceMode) {
      case "passive":
        userMessage = `PASSIVE REVIEW — Check this ${contentType || "content"} for Eden quality standards compliance. Requested tier: ${requestedTier || "ice"}.\n\nCONTENT TO REVIEW:\n${content}`;
        break;
      case "active":
        userMessage = `ACTIVE GATE — This content MUST pass before deployment. Block if any Eden standard is violated. Requested tier: ${requestedTier || "ice"}.\n\nCONTENT TO VALIDATE:\n${content}`;
        break;
      case "audit":
        userMessage = `FULL AUDIT — Deep analysis of this ${contentType || "output"} against ALL Eden Protocol standards. Score each dimension. Requested tier: ${requestedTier || "ice"}.\n\nCONTENT TO AUDIT:\n${content}`;
        break;
    }

    const res = await fetch(`${GLM5_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "glm-4-plus",
        messages: [
          { role: "system", content: GOVERNANCE_SYSTEM },
          { role: "user", content: userMessage },
        ],
        max_tokens: 1500,
        temperature: 0.3, // Low temp for consistent judgments
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      return NextResponse.json({
        error: `GLM-5 ${res.status}: ${errText.slice(0, 200)}`,
      }, { status: res.status });
    }

    const data = await res.json();
    const replyText = data.choices?.[0]?.message?.content || "";

    // Try to parse as JSON response
    let governance;
    try {
      const jsonMatch = replyText.match(/\{[\s\S]*\}/);
      governance = jsonMatch ? JSON.parse(jsonMatch[0]) : { raw: replyText };
    } catch {
      governance = { raw: replyText, pass: true, score: 70, recommendation: "review" };
    }

    return NextResponse.json({
      governance,
      mode: governanceMode,
      engine: "glm-4-plus",
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
