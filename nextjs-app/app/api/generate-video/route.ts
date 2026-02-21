import { NextRequest, NextResponse } from "next/server";
import { Client } from "@gradio/client";
import { VIDEO_BACKENDS } from "@/lib/data";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt, backend, seed, randomSeed } = body;

    const spaceId = VIDEO_BACKENDS[backend as keyof typeof VIDEO_BACKENDS] || "Wan-AI/Wan-2.2-5B";
    const actualSeed = randomSeed ? Math.floor(Math.random() * 2 ** 32) : seed;

    const client = await Client.connect(spaceId);

    // Wan 2.2
    if (spaceId.toLowerCase().includes("wan")) {
      const result = await client.predict("/generate_video", {
        text_prompt: prompt,
        seed: actualSeed,
      });
      const data = result.data;
      if (typeof data === "string") {
        return NextResponse.json({ video: data, seed: actualSeed });
      }
      if (Array.isArray(data)) {
        for (const item of data) {
          if (typeof item === "string" && (item.endsWith(".mp4") || item.endsWith(".webm"))) {
            return NextResponse.json({ video: item, seed: actualSeed });
          }
          if (typeof item === "object" && item !== null) {
            const obj = item as Record<string, unknown>;
            const url = obj.video || obj.url || obj.path;
            if (url) return NextResponse.json({ video: url, seed: actualSeed });
          }
        }
      }
    }

    // LTX
    if (spaceId.toLowerCase().includes("ltx")) {
      const result = await client.predict("/predict", { prompt });
      const data = result.data;
      if (typeof data === "string") return NextResponse.json({ video: data, seed: actualSeed });
    }

    // Generic fallback
    const result = await client.predict("/predict", [prompt]);
    const data = result.data;
    if (typeof data === "string") return NextResponse.json({ video: data, seed: actualSeed });

    return NextResponse.json({ error: "No video in result" }, { status: 500 });

  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
