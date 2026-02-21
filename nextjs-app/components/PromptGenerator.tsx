"use client";

interface CategoryGroup {
  group: string;
  items: string[];
}

interface PromptGeneratorProps {
  mode: "image" | "video";
  sceneCategories: CategoryGroup[];
  subjects: string[];
  skinTones?: string[];
  cameras?: string[];
  lightings?: string[];
  cameraMotions?: string[];
  visualStyles: string[];
  platforms: string[];
}

function GroupedSelect({
  label,
  icon,
  groups,
  value,
  onChange,
}: {
  label: string;
  icon: string;
  groups: CategoryGroup[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex-1 min-w-[200px]">
      <label className="block text-xs font-bold tracking-wider text-[#C5B358] mb-1.5" style={{ fontFamily: '"DM Mono", monospace' }}>
        {icon} {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full text-sm"
      >
        {groups.map((g) => (
          <optgroup key={g.group} label={`── ${g.group} ──`}>
            {g.items.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </optgroup>
        ))}
      </select>
    </div>
  );
}

function SimpleSelect({
  label,
  icon,
  options,
  value,
  onChange,
}: {
  label: string;
  icon: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex-1 min-w-[180px]">
      <label className="block text-xs font-bold tracking-wider text-[#C5B358] mb-1.5" style={{ fontFamily: '"DM Mono", monospace' }}>
        {icon} {label}
      </label>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full text-sm">
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}

export function PromptGenerator(props: PromptGeneratorProps) {
  return (
    <div className="border border-[rgba(197,179,88,0.15)] rounded-xl p-5 bg-[rgba(18,16,10,0.6)] mb-6">
      <div className="flex items-center gap-3 mb-1">
        <span className="text-2xl">🎯</span>
        <h3 className="text-lg font-bold text-[#C5B358]" style={{ fontFamily: '"Cinzel", serif' }}>
          Prompt Generator
        </h3>
      </div>
      <p className="text-xs text-[#504830] mb-4" style={{ fontFamily: '"DM Mono", monospace' }}>
        Select categories → Feed to local Phi Uncensored for prompt generation → Paste below
      </p>

      <div className="flex flex-wrap gap-4 mb-4">
        <GroupedSelect
          label={props.mode === "image" ? "Scene Category" : "Video Scene"}
          icon={props.mode === "image" ? "📂" : "🎬"}
          groups={props.sceneCategories}
          value={props.sceneCategories[0]?.items[0] || ""}
          onChange={() => {}}
        />
        <SimpleSelect label="Subject" icon="🎭" options={props.subjects} value={props.subjects[0]} onChange={() => {}} />
      </div>

      <div className="flex flex-wrap gap-4 mb-4">
        {props.skinTones && (
          <SimpleSelect label="Skin Tone (Eden Protocol)" icon="🎨" options={props.skinTones} value={props.skinTones[0]} onChange={() => {}} />
        )}
        {props.cameras && (
          <SimpleSelect label="Camera / Lens" icon="📷" options={props.cameras} value={props.cameras[0]} onChange={() => {}} />
        )}
        {props.lightings && (
          <SimpleSelect label="Lighting" icon="💡" options={props.lightings} value={props.lightings[0]} onChange={() => {}} />
        )}
        {props.cameraMotions && (
          <SimpleSelect label="Camera Motion" icon="🎥" options={props.cameraMotions} value={props.cameraMotions[0]} onChange={() => {}} />
        )}
      </div>

      <div className="flex flex-wrap gap-4">
        <SimpleSelect label="Visual Style" icon="🎨" options={props.visualStyles} value={props.visualStyles[0]} onChange={() => {}} />
        <SimpleSelect label="Platform" icon="📱" options={props.platforms} value={props.platforms[0]} onChange={() => {}} />
      </div>

      {/* Top 5 features badge */}
      <div className="mt-4 pt-3 border-t border-[rgba(197,179,88,0.08)] flex items-center gap-2 flex-wrap text-xs text-[#706850]" style={{ fontFamily: '"DM Mono", monospace' }}>
        <span className="text-[#8B6914]">✨ POWERED BY</span>
        <span>📱 Multi-Platform Export</span>
        <span>·</span>
        <span>🎨 27+ Visual Styles</span>
        <span>·</span>
        <span>🎥 Camera Motion Control</span>
        <span>·</span>
        <span>📝 Auto-Captions <span className="text-[#504830]">(coming)</span></span>
        <span>·</span>
        <span>🔗 Batch Pipeline <span className="text-[#504830]">(coming)</span></span>
      </div>
    </div>
  );
}
