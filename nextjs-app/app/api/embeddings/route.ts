import { NextRequest, NextResponse } from "next/server";

// ═══════════════════════════════════════════════════════════════════
// OPENAI EMBEDDINGS — Knowledge Lake Retrieval
// Uses text-embedding-3-small for semantic search across
// EDEN ALPHA-26 knowledge chunks
// ═══════════════════════════════════════════════════════════════════

export async function POST(req: NextRequest) {
  try {
    const { text, texts } = await req.json();
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "OpenAI API key not configured" }, { status: 500 });
    }

    // Support single text or batch
    const input = texts || [text];

    const res = await fetch("https://api.openai.com/v1/embeddings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "text-embedding-3-small",
        input,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      return NextResponse.json({
        error: `OpenAI ${res.status}: ${errText.slice(0, 200)}`,
      }, { status: res.status });
    }

    const data = await res.json();

    return NextResponse.json({
      embeddings: data.data?.map((d: { embedding: number[]; index: number }) => ({
        embedding: d.embedding,
        index: d.index,
      })),
      model: "text-embedding-3-small",
      usage: data.usage,
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
