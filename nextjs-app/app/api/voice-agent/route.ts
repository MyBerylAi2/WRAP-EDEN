import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { systemPrompt, agentName, messages } = await req.json();
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) return NextResponse.json({ error: "XAI API key not configured" }, { status: 500 });

    const grokMessages = [
      {
        role: "system",
        content: `${systemPrompt}\n\nYou are "${agentName}" — a voice agent product by Eden / Beryl AI Labs. Keep responses concise (2-4 sentences) as if speaking on a phone call. Be natural, warm, professional.`
      },
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
    const reply = data.choices?.[0]?.message?.content || "Could you try again?";
    return NextResponse.json({ reply });
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Unknown error" }, { status: 500 });
  }
}
