import { NextRequest, NextResponse } from "next/server";
import { Client } from "@gradio/client";
import { VIDEO_BACKENDS } from "@/lib/data";

function extractVideoUrl(data: unknown): string | null {
  if (!data) return null;
  if (typeof data === "string") return data;
  if (typeof data === "object" && data !== null) {
    const obj = data as Record<string, unknown>;
    if (obj.video) return String(obj.video);
    if (obj.url) return String(obj.url);
    if (obj.path) return String(obj.path);
  }
  return null;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt, backend, seed, randomSeed, duration, width, height, cameraMotion } = body;

    const spaceId = VIDEO_BACKENDS[backend as keyof typeof VIDEO_BACKENDS] || "alexnasa/ltx-2-TURBO";
    const actualSeed = randomSeed ? Math.floor(Math.random() * 2 ** 32) : (seed || 42);

    const client = await Client.connect(spaceId);

    // ═══ LTX-2 TURBO — Fast cinematic with camera control ═══
    if (spaceId.includes("ltx-2") || spaceId.includes("alexnasa")) {
      const result = await client.predict("/generate_video", {
        first_frame: null,
        end_frame: null,
        prompt: prompt,
        duration: parseFloat(duration) || 5,
        input_video: null,
        generation_mode: "Image-to-Video",
        enhance_prompt: true,
        seed: actualSeed,
        randomize_seed: !!randomSeed,
        height: height || 768,
        width: width || 1360,
        camera_lora: cameraMotion || "No LoRA",
        audio_path: null,
      });
      const data = result.data;
      const url = typeof data === "string" ? data : Array.isArray(data) ? extractVideoUrl(data[0]) : extractVideoUrl(data);
      if (url) {
        return NextResponse.json({ video: url, seed: actualSeed, backend: "LTX-2 Turbo" });
      }
      return NextResponse.json({ error: "LTX-2 returned no video" }, { status: 500 });
    }

    // ═══ WAN 2.2 ANIMATE — Motion blending ═══
    if (spaceId.includes("Wan2.2-Animate") || spaceId.includes("Wan-AI")) {
      const result = await client.predict("/predict", {
        ref_img: null,
        video: null,
        model_id: "wan2.2-animate-move",
        model: "wan-pro",
      });
      const data = result.data as Record<string, unknown>;
      const url = data?.output_video ? String(data.output_video) : null;
      if (url) {
        return NextResponse.json({ video: url, seed: actualSeed, backend: "Wan 2.2 Animate" });
      }
      return NextResponse.json({ error: "Wan 2.2 Animate returned no video" }, { status: 500 });
    }

    // ═══ WAN 2.2 14B FAST — Quick iteration ═══
    if (spaceId.includes("wan2-2") || spaceId.includes("r3gm")) {
      const result = await client.predict("/generate_video", {
        input_image: null,
        last_image: null,
        prompt: prompt,
        steps: 4,
        negative_prompt: "blurry, distorted, low quality",
        duration_seconds: parseFloat(duration) || 5,
        guidance_scale: 7.5,
        guidance_scale_2: 4.0,
        seed: actualSeed,
        randomize_seed: !!randomSeed,
        quality: 7,
        scheduler: "UniPCMultistep",
        flow_shift: 6.0,
        frame_multiplier: 16,
      });
      const data = result.data;
      const url = Array.isArray(data) ? extractVideoUrl(data[0]) : extractVideoUrl(data);
      if (url) {
        return NextResponse.json({ video: url, seed: actualSeed, backend: "Wan 2.2 14B Fast" });
      }
      return NextResponse.json({ error: "Wan 2.2 14B returned no video" }, { status: 500 });
    }

    // Generic fallback
    const result = await client.predict("/predict", [prompt]);
    const data = result.data;
    const url = typeof data === "string" ? data : null;
    if (url) return NextResponse.json({ video: url, seed: actualSeed });

    return NextResponse.json({ error: "No video generated — backend may be unavailable" }, { status: 500 });

  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
