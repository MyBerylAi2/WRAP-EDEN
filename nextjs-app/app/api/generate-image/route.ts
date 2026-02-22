import { NextRequest, NextResponse } from "next/server";
import { Client } from "@gradio/client";
import { IMAGE_BACKENDS, EDEN_PRESETS, buildSmartNegative, injectPositiveKeywords } from "@/lib/data";

// ─── Extract image URL from various Gradio response formats ───
function extractImageUrl(data: unknown): string | null {
  if (!data) return null;
  if (typeof data === "string") return data;
  if (typeof data === "object" && data !== null) {
    const obj = data as Record<string, unknown>;
    if (obj.url) return String(obj.url);
    if (obj.path) return String(obj.path);
    if (obj.image) return String(obj.image);
  }
  return null;
}

function extractFromArray(data: unknown[]): string | null {
  for (const item of data) {
    if (Array.isArray(item)) {
      // Gallery format — take last (best) image
      const last = item[item.length - 1];
      const url = extractImageUrl(last);
      if (url) return url;
    }
    const url = extractImageUrl(item);
    if (url) return url;
  }
  return null;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt, preset, backend, resolution, steps, seed, randomSeed, enhance, negative, mode } = body;

    // ERE-1: Inject positive keywords based on prompt content + mode
    let fullPrompt = injectPositiveKeywords(prompt, mode || "image_studio", preset);
    const presetText = EDEN_PRESETS[preset as keyof typeof EDEN_PRESETS] || "";
    if (presetText) fullPrompt = `${fullPrompt}, ${presetText}`;
    if (enhance) fullPrompt = `(masterpiece, best quality, extremely detailed, raw photo), ${fullPrompt}`;

    const fullNeg = buildSmartNegative(prompt, negative || undefined);
    const spaceId = IMAGE_BACKENDS[backend as keyof typeof IMAGE_BACKENDS] || "black-forest-labs/FLUX.1-schnell";
    const actualSeed = randomSeed ? Math.floor(Math.random() * 2 ** 32) : (seed || 0);

    // Parse resolution
    const resParts = (resolution || "1024x1024").match(/(\d+)x(\d+)/);
    const width = resParts ? parseInt(resParts[1]) : 1024;
    const height = resParts ? parseInt(resParts[2]) : 1024;

    const client = await Client.connect(spaceId);

    // ═══ FLUX SCHNELL — 4 steps, ~3 seconds, rapid testing ═══
    if (spaceId.includes("FLUX.1-schnell")) {
      const actualSteps = steps || 4;
      const result = await client.predict("/infer", {
        prompt: fullPrompt,
        seed: actualSeed,
        randomize_seed: !!randomSeed,
        width,
        height,
        num_inference_steps: actualSteps,
      });
      const data = result.data as unknown[];
      const url = Array.isArray(data) ? extractFromArray(data) : extractImageUrl(data);
      if (url) {
        return NextResponse.json({
          image: url,
          seed: (Array.isArray(data) && data.length > 1) ? data[1] : actualSeed,
          steps: actualSteps,
          backend: "FLUX Schnell",
        });
      }
      return NextResponse.json({ error: "Schnell returned no image" }, { status: 500 });
    }

    // ═══ FLUX DEV — 20-25 steps, ~18 seconds, production quality ═══
    if (spaceId.includes("FLUX.1-dev")) {
      const actualSteps = steps || 25;
      // FLUX.1-dev Space uses /infer endpoint same as schnell
      const result = await client.predict("/infer", {
        prompt: fullPrompt,
        seed: actualSeed,
        randomize_seed: !!randomSeed,
        width,
        height,
        num_inference_steps: actualSteps,
        guidance_scale: 3.5,
      });
      const data = result.data as unknown[];
      const url = Array.isArray(data) ? extractFromArray(data) : extractImageUrl(data);
      if (url) {
        return NextResponse.json({
          image: url,
          seed: (Array.isArray(data) && data.length > 1) ? data[1] : actualSeed,
          steps: actualSteps,
          backend: "FLUX Dev",
        });
      }
      return NextResponse.json({ error: "FLUX Dev returned no image" }, { status: 500 });
    }

    // ═══ Z-IMAGE TURBO PATH ═══
    if (spaceId.includes("Z-Image") || spaceId.includes("Tongyi")) {
      const actualSteps = steps || 8;
      const result = await client.predict("/Z_Image_Turbo_generate", {
        prompt: fullPrompt,
        resolution: resolution || "1024x1024 ( 1:1 )",
        random_seed: !!randomSeed,
        seed: actualSeed,
        steps: actualSteps,
        shift: 3.0,
      });
      const data = result.data as unknown[];
      const url = Array.isArray(data) ? extractFromArray(data) : null;
      if (url) {
        return NextResponse.json({ image: url, seed: data[2] || actualSeed, steps: actualSteps, backend: "Z-Image Turbo" });
      }
      return NextResponse.json({ error: "Z-Image returned no image" }, { status: 500 });
    }

    // ═══ GENERIC GRADIO SPACE — try common endpoints ═══
    const endpoints = ["/infer", "/predict", "/generate", "/run"];
    for (const ep of endpoints) {
      try {
        const result = await client.predict(ep, {
          prompt: fullPrompt,
          negative_prompt: fullNeg,
          num_inference_steps: steps || 30,
          seed: actualSeed,
          width,
          height,
        });
        const data = result.data;
        const url = Array.isArray(data) ? extractFromArray(data) : extractImageUrl(data);
        if (url) {
          return NextResponse.json({ image: url, seed: actualSeed, steps: steps || 30, backend: backend || spaceId });
        }
      } catch {
        continue; // Try next endpoint
      }
    }

    return NextResponse.json({ error: "No image generated — backend may be sleeping or unavailable" }, { status: 500 });

  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
