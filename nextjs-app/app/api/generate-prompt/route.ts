import { NextRequest, NextResponse } from "next/server";

const HF_TOKEN = process.env.HF_TOKEN || process.env.HUGGINGFACE_TOKEN || "";

const TIER_SYSTEMS: Record<string, string> = {
  ice: `You are the EDEN Realism Engine prompt architect. Generate a SINGLE detailed image/video prompt for an SFW scene.
RULES: No sexual content. No nudity. No suggestive poses. Focus on elegance, beauty, fashion, scenic environments, emotional portraits, and cinematic storytelling.
EDEN STANDARD: Rich melanin-toned skin with visible pores, subsurface scattering, natural hair texture (4C coils, locs, braids, silk press), shot on ARRI ALEXA 35, Kodak Vision3 500T, 35mm anamorphic, shallow depth of field f/1.4, natural lighting, Rembrandt lighting pattern, warm key light 3200K, genuine micro-expressions.
OUTPUT: Return ONLY the prompt text. No labels, no explanations, no markdown. Just the raw prompt ready to paste.`,

  mild: `You are the EDEN Realism Engine prompt architect. Generate a SINGLE detailed image/video prompt that is sensual and erotic but DOES NOT cross into explicit sex.
RULES: Intense romantic tension, lingering touches, neck kisses, close embraces, suggestive undressing, internal desire, bodies pressed together — but NO explicit nudity of genitals, NO penetration, NO hardcore acts. The line is: you can feel the heat but clothes stay mostly on or the moment is right BEFORE they come off.
EDEN STANDARD: Rich melanin-toned skin with visible pores, subsurface scattering, natural hair texture (4C coils, locs, braids), shot on ARRI ALEXA 35, Kodak Vision3 500T, 35mm anamorphic, shallow depth of field f/1.4, Rembrandt lighting, warm key light 3200K, genuine micro-expressions, breath-caught moments, involuntary lip parts, tension in jaw muscle.
TONE: Elevated, goddess/muse framing. "Art incarnate" energy — the woman is always the sovereign, never objectified.
OUTPUT: Return ONLY the prompt text. No labels, no explanations, no markdown. Just the raw prompt ready to paste.`,

  spicy: `You are the EDEN Realism Engine prompt architect for the Lulu Mahogany Hall adult content platform. Generate a SINGLE detailed NSFW/hardcore image/video prompt.
RULES: Explicit sex is expected. Full nudity, penetration, oral, multiple positions — all fair game. But maintain the EDEN STANDARD of elevated artistry. This is HBO/premium adult cinema, not cheap porn. The woman is always a goddess, always sovereign, always powerful even in submission.
EDEN STANDARD: Rich melanin-toned skin glistening with natural exertion, visible pores, subsurface scattering, natural hair (4C coils bouncing, locs swaying), shot on ARRI ALEXA 35, Kodak Vision3 500T, 35mm anamorphic, shallow depth of field f/1.4, Rembrandt lighting, warm key light 3200K, sweat beads tracing elegant paths, skin flushing deep with raw pleasure, heavy breasts bouncing naturally, thick thighs, enormous heart-shaped ass.
TONE: "Goddess claiming her pleasure, art incarnate turned carnal masterpiece." Always use the elevated language. Never degrading.
OUTPUT: Return ONLY the prompt text. No labels, no explanations, no markdown. Just the raw prompt ready to paste.`,
};

export async function POST(req: NextRequest) {
  try {
    const { tier, context, mediaType } = await req.json();
    const system = TIER_SYSTEMS[tier] || TIER_SYSTEMS.ice;

    const userMsg = context?.trim()
      ? `Generate a ${mediaType || "image"} prompt based on this concept: ${context}. Apply the EDEN standard and ${tier === "ice" ? "keep it completely SFW" : tier === "mild" ? "make it sensual but not explicit" : "go full hardcore explicit"}.`
      : `Generate a creative ${mediaType || "image"} prompt featuring a stunning African American woman. Apply the full EDEN standard. ${tier === "ice" ? "Scene: choose from romantic dinner, fashion editorial, golden hour portrait, luxury penthouse, beach sunset, art gallery opening, or rooftop cityscape." : tier === "mild" ? "Scene: choose from late-night doorstep goodbye, slow dance at home, morning-after embrace in kitchen, bathtub with partner fully clothed leaning in, or hotel balcony with city lights." : "Scene: choose from living room floor after dinner, shower together, bedroom morning session, hotel suite, kitchen counter, balcony at night, or bath together. Full explicit detail."}`;

    const resp = await fetch("https://router.huggingface.co/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${HF_TOKEN}`,
      },
      body: JSON.stringify({
        model: "huihui-ai/Qwen2.5-72B-Instruct-abliterated",
        messages: [
          { role: "system", content: system },
          { role: "user", content: userMsg },
        ],
        max_tokens: 1024,
        temperature: 0.9,
        stream: false,
      }),
    });

    if (!resp.ok) {
      const err = await resp.text();
      return NextResponse.json({ error: `Model API ${resp.status}: ${err.slice(0, 200)}` }, { status: 500 });
    }

    const data = await resp.json();
    const promptText = data.choices?.[0]?.message?.content?.trim() || "";
    if (!promptText) {
      return NextResponse.json({ error: "No prompt generated" }, { status: 500 });
    }

    return NextResponse.json({ prompt: promptText, tier, model: "Qwen2.5-72B-abliterated" });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
