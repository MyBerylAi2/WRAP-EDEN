import { NextRequest, NextResponse } from "next/server";

// Supported chat engines for voice agent demos
type ChatEngine = "grok" | "anthropic";

export async function POST(req: NextRequest) {
  try {
    const { systemPrompt, agentName, messages, engine, ttsEngine } = await req.json();

    const chatEngine: ChatEngine = engine || "grok";
    const agentSystem = `${systemPrompt}\n\nYou are "${agentName}" — a voice agent product by Eden / Beryl AI Labs. Keep responses concise (2-4 sentences) as if speaking on a phone call. Be natural, warm, professional. Female voice personality.`;

    let reply: string;

    if (chatEngine === "anthropic") {
      // Claude API path
      const apiKey = process.env.ANTHROPIC_API_KEY;
      if (!apiKey) return NextResponse.json({ error: "Anthropic API key not configured" }, { status: 500 });

      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 300,
          system: agentSystem,
          messages: messages.map((m: { role: string; content: string }) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        return NextResponse.json({ error: `Claude API ${res.status}: ${errText.slice(0, 200)}` }, { status: res.status });
      }

      const data = await res.json();
      reply = data.content?.[0]?.text || "Could you try again?";
    } else {
      // Grok (default)
      const apiKey = process.env.XAI_API_KEY;
      if (!apiKey) return NextResponse.json({ error: "XAI API key not configured" }, { status: 500 });

      const grokMessages = [
        { role: "system", content: agentSystem },
        ...messages.map((m: { role: string; content: string }) => ({ role: m.role, content: m.content })),
      ];

      const res = await fetch(`${process.env.XAI_BASE_URL || "https://api.x.ai/v1"}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "grok-3-mini-fast",
          messages: grokMessages,
          max_tokens: 300,
          temperature: 0.8,
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        return NextResponse.json({ error: `Grok API ${res.status}: ${errText.slice(0, 200)}` }, { status: res.status });
      }

      const data = await res.json();
      reply = data.choices?.[0]?.message?.content || "Could you try again?";
    }

    // Return reply with TTS engine info for frontend audio synthesis
    return NextResponse.json({
      reply,
      engine: chatEngine,
      ttsEngine: ttsEngine || "kokoro",
    });
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Unknown error" }, { status: 500 });
  }
}
