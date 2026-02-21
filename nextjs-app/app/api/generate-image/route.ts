import { NextRequest, NextResponse } from "next/server";
import { Client } from "@gradio/client";
import { IMAGE_BACKENDS, EDEN_PRESETS, EDEN_NEGATIVE } from "@/lib/data";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt, preset, backend, resolution, steps, seed, randomSeed, enhance, negative } = body;

    const presetText = EDEN_PRESETS[preset as keyof typeof EDEN_PRESETS] || "";
    let fullPrompt = presetText ? `${prompt}, ${presetText}` : prompt;
    if (enhance) fullPrompt = `(masterpiece, best quality, extremely detailed), ${fullPrompt}`;
    const fullNeg = negative ? `${negative}, ${EDEN_NEGATIVE}` : EDEN_NEGATIVE;

    const spaceId = IMAGE_BACKENDS[backend as keyof typeof IMAGE_BACKENDS] || "Tongyi-MAI/Z-Image-Turbo";
    const actualSeed = randomSeed ? Math.floor(Math.random() * 2 ** 32) : seed;

    const client = await Client.connect(spaceId);

    if (spaceId.includes("Z-Image") || spaceId.includes("Tongyi")) {
      const result = await client.predict("/Z_Image_Turbo_generate", {
        prompt: fullPrompt,
        resolution: resolution || "1024x1024 ( 1:1 )",
        random_seed: randomSeed,
        seed: actualSeed,
        steps: steps || 8,
        shift: 3.0,
      });

      const data = result.data as unknown[];
      if (Array.isArray(data) && data.length > 0) {
        const gallery = data[0];
        if (Array.isArray(gallery) && gallery.length > 0) {
          const img = gallery[gallery.length - 1];
          const url = typeof img === "string" ? img : (img as Record<string, unknown>)?.image || (img as Record<string, unknown>)?.url || (img as Record<string, unknown>)?.path;
          return NextResponse.json({ image: url, seed: data[2] || actualSeed });
        }
      }
      return NextResponse.json({ error: "No image in result" }, { status: 500 });
    }

    // FLUX / SDXL fallback
    const result = await client.predict("/predict", [fullPrompt, fullNeg]);
    const data = result.data;
    if (typeof data === "string") {
      return NextResponse.json({ image: data, seed: actualSeed });
    }
    return NextResponse.json({ error: `Unexpected: ${typeof data}` }, { status: 500 });

  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
