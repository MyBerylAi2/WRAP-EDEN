"use client";

import { useRef, useEffect } from "react";

interface VoiceWaveformProps {
  level: number;
  state: string;
  size?: number;
}

export function VoiceWaveform({ level, state, size = 300 }: VoiceWaveformProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);
  const phaseRef = useRef(0);

  const w = size;
  const h = Math.round(size * 0.667); // maintain 300:200 aspect

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    function draw() {
      ctx.clearRect(0, 0, w, h);
      phaseRef.current += 0.03;
      const mid = h / 2;

      const scale = size / 300; // proportional scaling factor

      if (state === "idle" || state === "connecting") {
        for (let ring = 0; ring < 3; ring++) {
          const r = (30 + ring * 25 + Math.sin(phaseRef.current + ring * 0.5) * 5) * scale;
          const alpha = 0.08 - ring * 0.02;
          ctx.beginPath();
          ctx.arc(w / 2, mid, r, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(197,179,88,${alpha})`;
          ctx.lineWidth = 1.5 * scale;
          ctx.stroke();
        }
        ctx.beginPath();
        ctx.arc(w / 2, mid, 4 * scale, 0, Math.PI * 2);
        ctx.fillStyle = state === "connecting" ? "rgba(197,179,88,0.6)" : "rgba(197,179,88,0.2)";
        ctx.fill();
      } else {
        const barCount = Math.floor(64 * scale);
        const baseRadius = 50 * scale;
        const isListening = state === "listening";
        const isSpeaking = state === "speaking";
        const isProcessing = state === "processing";

        for (let i = 0; i < barCount; i++) {
          const angle = (i / barCount) * Math.PI * 2;
          let amplitude: number;

          if (isListening) {
            amplitude = (level * 60 + Math.sin(phaseRef.current * 2 + i * 0.3) * 15 * level) * scale;
          } else if (isSpeaking) {
            amplitude = (15 + Math.sin(phaseRef.current * 1.5 + i * 0.2) * 20 + Math.cos(phaseRef.current * 0.8 + i * 0.4) * 10) * scale;
          } else if (isProcessing) {
            amplitude = (5 + Math.sin(phaseRef.current * 3 + i * 0.5) * 8) * scale;
          } else {
            amplitude = (3 + Math.sin(phaseRef.current + i * 0.15) * 3) * scale;
          }

          const innerR = baseRadius;
          const outerR = baseRadius + amplitude;
          const x1 = w / 2 + Math.cos(angle) * innerR;
          const y1 = mid + Math.sin(angle) * innerR;
          const x2 = w / 2 + Math.cos(angle) * outerR;
          const y2 = mid + Math.sin(angle) * outerR;

          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.lineWidth = 2 * scale;

          const hue = isListening ? "34,197,94" : isSpeaking ? "197,179,88" : "100,100,100";
          const alpha = 0.3 + (amplitude / (80 * scale)) * 0.7;
          ctx.strokeStyle = `rgba(${hue},${alpha})`;
          ctx.stroke();
        }

        const gradient = ctx.createRadialGradient(w / 2, mid, 0, w / 2, mid, baseRadius);
        const glowColor = isListening ? "34,197,94" : "197,179,88";
        gradient.addColorStop(0, `rgba(${glowColor},0.08)`);
        gradient.addColorStop(1, `rgba(${glowColor},0)`);
        ctx.beginPath();
        ctx.arc(w / 2, mid, baseRadius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(w / 2, mid, 6 * scale, 0, Math.PI * 2);
        ctx.fillStyle = isListening ? "#22c55e" : isSpeaking ? "#C5B358" : isProcessing ? "#F5E6A3" : "#555";
        ctx.fill();
      }

      frameRef.current = requestAnimationFrame(draw);
    }

    draw();
    return () => cancelAnimationFrame(frameRef.current);
  }, [level, state, w, h, size]);

  return (
    <canvas
      ref={canvasRef}
      width={w}
      height={h}
      className="mx-auto"
      style={{ width: `${w}px`, height: `${h}px` }}
    />
  );
}
