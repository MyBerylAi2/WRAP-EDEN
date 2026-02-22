import { NextRequest, NextResponse } from "next/server";

const HF_TOKEN = process.env.HF_TOKEN || process.env.HUGGINGFACE_TOKEN || "";
const SPACE_ID = "AIBRUH/eden-diffusion-studio";

export async function GET() {
  try {
    const res = await fetch(`https://huggingface.co/api/spaces/${SPACE_ID}/runtime`, {
      headers: { Authorization: `Bearer ${HF_TOKEN}` },
    });
    if (!res.ok) return NextResponse.json({ error: `HF API ${res.status}` }, { status: res.status });
    const data = await res.json();
    return NextResponse.json({
      stage: data.stage,
      hardware: data.hardware?.current || data.hardware?.requested || "cpu-basic",
      gcTimeout: data.gcTimeout || 600,
    });
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Unknown error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { hardware, sleep } = await req.json();

    // Change hardware — use PUT /settings endpoint (POST /hardware is unreliable)
    if (hardware) {
      const res = await fetch(`https://huggingface.co/api/spaces/${SPACE_ID}/settings`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${HF_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ hardware }),
      });
      if (!res.ok) {
        const errText = await res.text();
        return NextResponse.json({ error: `HF API ${res.status}: ${errText.slice(0, 200)}` }, { status: res.status });
      }
      // After hardware change, restart the Space to apply
      await fetch(`https://huggingface.co/api/spaces/${SPACE_ID}/restart`, {
        method: "POST",
        headers: { Authorization: `Bearer ${HF_TOKEN}` },
      });
      return NextResponse.json({ ok: true, hardware });
    }

    // Change sleep timeout
    if (typeof sleep === "number") {
      const res = await fetch(`https://huggingface.co/api/spaces/${SPACE_ID}/sleeptime`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${HF_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ seconds: sleep }),
      });
      if (!res.ok) {
        const errText = await res.text();
        return NextResponse.json({ error: `HF API ${res.status}: ${errText.slice(0, 200)}` }, { status: res.status });
      }
      return NextResponse.json({ ok: true, sleep });
    }

    return NextResponse.json({ error: "Provide hardware or sleep parameter" }, { status: 400 });
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Unknown error" }, { status: 500 });
  }
}
