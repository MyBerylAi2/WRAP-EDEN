export function StateBadge({ state }: { state: string }) {
  const configs: Record<string, { label: string; color: string; pulse: boolean }> = {
    idle: { label: "READY", color: "#504830", pulse: false },
    connecting: { label: "CONNECTING", color: "#C5B358", pulse: true },
    connected: { label: "CONNECTED", color: "#4CAF50", pulse: false },
    listening: { label: "LISTENING", color: "#22c55e", pulse: true },
    processing: { label: "THINKING", color: "#F5E6A3", pulse: true },
    speaking: { label: "SPEAKING", color: "#C5B358", pulse: true },
    error: { label: "ERROR", color: "#EF5350", pulse: false },
  };
  const cfg = configs[state] || configs.idle;

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cfg.color }} />
        {cfg.pulse && <div className="absolute inset-0 w-2 h-2 rounded-full animate-ping opacity-40" style={{ backgroundColor: cfg.color }} />}
      </div>
      <span className="text-[10px] font-mono tracking-[0.2em] uppercase" style={{ color: cfg.color }}>
        {cfg.label}
      </span>
    </div>
  );
}
