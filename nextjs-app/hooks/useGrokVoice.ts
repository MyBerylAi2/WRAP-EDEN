"use client";

import { useState, useRef, useCallback } from "react";

// ═══════════════════════════════════════════════════════════════════
// useGrokVoice — Real-time WebSocket voice with Grok
// Re-engineered from xAI's Realtime API pattern
// Browser mic → PCM16 base64 → WebSocket → Grok → Audio playback
// ═══════════════════════════════════════════════════════════════════

const SAMPLE_RATE = 24000;
const WS_URL = "wss://api.x.ai/v1/realtime";

type VoiceState = "idle" | "connecting" | "connected" | "listening" | "processing" | "speaking" | "error";
type GrokVoice = "Ara" | "Eve" | "Leo" | "Rex" | "Sal";

interface UseGrokVoiceOptions {
  voice?: GrokVoice;
  instructions?: string;
  agentName?: string;
  onTranscript?: (text: string, isFinal: boolean) => void;
  onResponse?: (text: string) => void;
  onStateChange?: (state: VoiceState) => void;
  onError?: (error: string) => void;
}

// PCM16 Float32 → base64
function float32ToBase64PCM16(float32Array: Float32Array): string {
  const pcm16 = new Int16Array(float32Array.length);
  for (let i = 0; i < float32Array.length; i++) {
    const s = Math.max(-1, Math.min(1, float32Array[i]));
    pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
  }
  const bytes = new Uint8Array(pcm16.buffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// base64 → PCM16 Float32
function base64PCM16ToFloat32(base64String: string): Float32Array {
  const binaryString = atob(base64String);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  const pcm16 = new Int16Array(bytes.buffer);
  const float32 = new Float32Array(pcm16.length);
  for (let i = 0; i < pcm16.length; i++) {
    float32[i] = pcm16[i] / 32768.0;
  }
  return float32;
}

export function useGrokVoice(options: UseGrokVoiceOptions = {}) {
  const {
    voice = "Eve",
    instructions = "You are a helpful voice assistant for Eden Realism Engine by Beryl AI Labs.",
    agentName = "Eden Voice",
    onTranscript,
    onResponse,
    onStateChange,
    onError,
  } = options;

  const [state, setState] = useState<VoiceState>("idle");
  const [transcript, setTranscript] = useState("");
  const [responseText, setResponseText] = useState("");
  const [audioLevel, setAudioLevel] = useState(0);

  const wsRef = useRef<WebSocket | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const audioQueueRef = useRef<Float32Array[]>([]);
  const isPlayingRef = useRef(false);

  const updateState = useCallback((newState: VoiceState) => {
    setState(newState);
    onStateChange?.(newState);
  }, [onStateChange]);

  // Play queued audio chunks
  const playAudioQueue = useCallback(async () => {
    if (isPlayingRef.current || audioQueueRef.current.length === 0) return;
    isPlayingRef.current = true;

    const ctx = audioContextRef.current;
    if (!ctx) { isPlayingRef.current = false; return; }

    while (audioQueueRef.current.length > 0) {
      const chunk = audioQueueRef.current.shift()!;
      const buffer = ctx.createBuffer(1, chunk.length, SAMPLE_RATE);
      buffer.getChannelData(0).set(chunk);
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      source.start();

      await new Promise<void>((resolve) => {
        source.onended = () => resolve();
        // Fallback timeout
        setTimeout(resolve, (chunk.length / SAMPLE_RATE) * 1000 + 50);
      });
    }

    isPlayingRef.current = false;
    if (state === "speaking") updateState("connected");
  }, [state, updateState]);

  // Connect to Grok Realtime
  const connect = useCallback(async () => {
    if (wsRef.current) return;
    updateState("connecting");

    try {
      // Get ephemeral token from our API
      const tokenRes = await fetch("/api/voice-realtime", { method: "POST" });
      const tokenData = await tokenRes.json();
      if (tokenData.error) throw new Error(tokenData.error);

      const token = tokenData.token;

      // Create AudioContext
      audioContextRef.current = new AudioContext({ sampleRate: SAMPLE_RATE });

      // Connect WebSocket
      const ws = new WebSocket(WS_URL, [`xai-client-secret.${token}`]);
      wsRef.current = ws;

      ws.onopen = () => {
        updateState("connected");

        // Configure session
        ws.send(JSON.stringify({
          type: "session.update",
          session: {
            voice,
            instructions: `${instructions}\n\nYou are "${agentName}" — a voice agent by Eden / Beryl AI Labs. Keep responses concise (2-4 sentences) as you are speaking in real-time. Be natural, warm, and professional.`,
            turn_detection: {
              type: "server_vad",
              threshold: 0.5,
              prefix_padding_ms: 300,
              silence_duration_ms: 500,
            },
            audio: {
              input: { format: { type: "audio/pcm", rate: SAMPLE_RATE } },
              output: { format: { type: "audio/pcm", rate: SAMPLE_RATE } },
            },
          },
        }));
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);

        switch (data.type) {
          case "response.audio.delta":
            // Incoming audio chunk
            if (data.delta) {
              const audioData = base64PCM16ToFloat32(data.delta);
              audioQueueRef.current.push(audioData);
              updateState("speaking");
              playAudioQueue();
            }
            break;

          case "response.audio_transcript.delta":
            // Agent response transcript
            setResponseText(prev => prev + (data.delta || ""));
            break;

          case "response.audio_transcript.done":
            // Full response complete
            if (data.transcript) {
              onResponse?.(data.transcript);
              setResponseText("");
            }
            break;

          case "conversation.item.input_audio_transcription.completed":
            // User speech transcript
            if (data.transcript) {
              setTranscript(data.transcript);
              onTranscript?.(data.transcript, true);
            }
            break;

          case "input_audio_buffer.speech_started":
            updateState("listening");
            break;

          case "input_audio_buffer.speech_stopped":
            updateState("processing");
            break;

          case "error":
            onError?.(data.error?.message || "Voice error");
            break;
        }
      };

      ws.onerror = () => {
        onError?.("WebSocket connection failed");
        updateState("error");
      };

      ws.onclose = () => {
        wsRef.current = null;
        updateState("idle");
      };

    } catch (err) {
      onError?.(err instanceof Error ? err.message : "Connection failed");
      updateState("error");
    }
  }, [voice, instructions, agentName, onTranscript, onResponse, onError, updateState, playAudioQueue]);

  // Start microphone capture
  const startListening = useCallback(async () => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      await connect();
      // Wait for connection
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { sampleRate: SAMPLE_RATE, channelCount: 1, echoCancellation: true, noiseSuppression: true },
      });
      streamRef.current = stream;

      const ctx = audioContextRef.current || new AudioContext({ sampleRate: SAMPLE_RATE });
      audioContextRef.current = ctx;

      const source = ctx.createMediaStreamSource(stream);
      const processor = ctx.createScriptProcessor(4096, 1, 1);
      processorRef.current = processor;

      // Analyser for audio level visualization
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);

      processor.onaudioprocess = (e) => {
        const inputData = e.inputBuffer.getChannelData(0);

        // Audio level for visualization
        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(dataArray);
        const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
        setAudioLevel(avg / 255);

        // Send audio to Grok
        if (wsRef.current?.readyState === WebSocket.OPEN) {
          const base64Audio = float32ToBase64PCM16(inputData);
          wsRef.current.send(JSON.stringify({
            type: "input_audio_buffer.append",
            audio: base64Audio,
          }));
        }
      };

      source.connect(processor);
      processor.connect(ctx.destination);
      updateState("listening");
    } catch (err) {
      onError?.(err instanceof Error ? err.message : "Microphone access denied");
      updateState("error");
    }
  }, [connect, updateState, onError]);

  // Stop microphone
  const stopListening = useCallback(() => {
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    setAudioLevel(0);
    if (state === "listening") updateState("connected");
  }, [state, updateState]);

  // Send text message (bypass audio)
  const sendText = useCallback((text: string) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;

    wsRef.current.send(JSON.stringify({
      type: "conversation.item.create",
      item: {
        type: "message",
        role: "user",
        content: [{ type: "input_text", text }],
      },
    }));

    wsRef.current.send(JSON.stringify({
      type: "response.create",
      response: { modalities: ["text", "audio"] },
    }));
  }, []);

  // Disconnect
  const disconnect = useCallback(() => {
    stopListening();
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    audioQueueRef.current = [];
    isPlayingRef.current = false;
    updateState("idle");
  }, [stopListening, updateState]);

  return {
    state,
    transcript,
    responseText,
    audioLevel,
    connect,
    disconnect,
    startListening,
    stopListening,
    sendText,
    isConnected: state !== "idle" && state !== "error",
    isListening: state === "listening",
    isSpeaking: state === "speaking",
    isProcessing: state === "processing",
  };
}
