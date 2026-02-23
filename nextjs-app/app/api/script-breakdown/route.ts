import { NextRequest, NextResponse } from "next/server";

// ═══════════════════════════════════════════════════════════════════
// EDEN FILM ROOM — Script Breakdown API
// Takes raw text + content type → returns structured scenes via Grok
// Each content type gets a tuned directorial voice
// ═══════════════════════════════════════════════════════════════════

type ContentType =
  | "film" | "novel" | "documentary" | "cartoon" | "kids"
  | "sleep" | "promo" | "adult" | "audiobook" | "news";

const DIRECTOR_PROMPTS: Record<ContentType, string> = {
  film: `You are an Oscar-winning film director. Break this script into cinematic scenes with wide/medium/close-up variety. Think Villeneuve meets Nolan — every frame tells a story. Use dramatic lighting, film grain, anamorphic lens language.`,

  novel: `You are a literary film adapter (think BBC Masterpiece Theatre). Break this text into visually rich scenes that honor the source material. Establish atmosphere first, then character moments. Every scene should feel like a painting come to life.`,

  documentary: `You are a Ken Burns-level documentary filmmaker. Break this into interview setups, B-roll sequences, archival-style shots. Use natural lighting, handheld where appropriate, and talking-head compositions. Include establishing shots of locations.`,

  cartoon: `You are a top animation director (Pixar/Studio Ghibli quality). Break this into bright, character-driven scenes with expressive poses and simple but beautiful backgrounds. Think bold colors, clean compositions, and emotional clarity.`,

  kids: `You are a children's educational content creator (Sesame Street meets Bluey). Every scene must be bright, safe, age-appropriate, and educational. Use primary colors, friendly characters, simple compositions. NO scary imagery, NO violence.`,

  sleep: `You are an ambient content creator for sleep and relaxation. Break this into slow, calming scenes — nature landscapes, gentle water, soft clouds, starfields. NO faces, NO sudden movements. Everything should feel like a warm weighted blanket. Whisper-level narration.`,

  promo: `You are a viral social media director. Break this into fast-paced, attention-grabbing shots. First scene MUST hook in 2 seconds. Use trending aesthetics, product glamour shots, bold text overlay descriptions. Think TikTok meets Super Bowl ad.`,

  adult: `You are an artistic director for premium adult content. Break this into tasteful, sensual scenes with moody lighting, warm tones, and intimate framing. Emphasize atmosphere and anticipation over explicit content. Think high-end, artistic, cinematic.`,

  audiobook: `You are an audiobook producer and sound designer. Break this into narrated chapters with vivid scene descriptions. Each scene should have a clear mood, pacing note, and ambient sound description. Focus on voice performance direction and emotional beats.`,

  news: `You are a premium AI news broadcast director (think Bloomberg meets MKBHD). Break this into news segments — anchor intro, data visualization scenes, expert commentary setups, and closing summaries. Use clean, modern, tech-forward aesthetics.`,
};

const SYSTEM_PROMPT = `You are the EDEN Film Room Director AI — you break scripts, chapters, ideas, and raw text into structured visual scenes for AI generation.

RULES:
1. Return ONLY valid JSON — no markdown, no backticks, no explanation
2. Each scene needs: title, imagePrompt, videoPrompt, narration, duration (seconds), mood
3. Image prompts: detailed visual description for AI image generation (50-100 words)
4. Video prompts: camera movement + action description for AI video generation (30-60 words)
5. Narration: the voiceover/dialogue text for this scene
6. Duration: realistic seconds (3-10 per scene)
7. Mood: one word (suspense, joy, calm, tension, wonder, intimate, energy, melancholy, triumph, mystery)
8. Make scenes flow narratively — beginning, middle, end structure
9. Vary shot types: establishing, medium, close-up, over-shoulder, POV

Return format:
{"scenes":[{"title":"...","imagePrompt":"...","videoPrompt":"...","narration":"...","duration":5,"mood":"..."}]}`;

export async function POST(req: NextRequest) {
  try {
    const { script, contentType, sceneCount } = await req.json();

    if (!script?.trim()) {
      return NextResponse.json({ error: "Script text is required" }, { status: 400 });
    }

    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Grok API key not configured" }, { status: 500 });
    }

    const ct = (contentType || "film") as ContentType;
    const count = Math.min(Math.max(sceneCount || 6, 2), 16);
    const directorVoice = DIRECTOR_PROMPTS[ct] || DIRECTOR_PROMPTS.film;

    const userMsg = `${directorVoice}

Break the following into exactly ${count} scenes:

---
${script.slice(0, 8000)}
---

Return ONLY the JSON object with the "scenes" array. No other text.`;

    const res = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "grok-3-mini-fast",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userMsg },
        ],
        max_tokens: 4000,
        temperature: 0.8,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      return NextResponse.json(
        { error: `Grok ${res.status}: ${errText.slice(0, 200)}` },
        { status: res.status },
      );
    }

    const data = await res.json();
    const raw = data.choices?.[0]?.message?.content?.trim() || "";

    // Parse JSON — Grok sometimes wraps in backticks
    const cleaned = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    let parsed: { scenes: Array<{ title: string; imagePrompt: string; videoPrompt: string; narration: string; duration: number; mood: string }> };

    try {
      parsed = JSON.parse(cleaned);
    } catch {
      // Try extracting JSON from response
      const match = cleaned.match(/\{[\s\S]*"scenes"[\s\S]*\}/);
      if (match) {
        parsed = JSON.parse(match[0]);
      } else {
        return NextResponse.json(
          { error: "Failed to parse scene breakdown", raw: cleaned.slice(0, 500) },
          { status: 500 },
        );
      }
    }

    if (!parsed.scenes || !Array.isArray(parsed.scenes)) {
      return NextResponse.json({ error: "Invalid scene structure" }, { status: 500 });
    }

    return NextResponse.json({
      scenes: parsed.scenes,
      contentType: ct,
      engine: "grok-3-mini-fast",
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
