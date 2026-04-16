import { ReactComponent as ArrowForward } from '../assets/arrow_forward.svg';

interface StandardButtonProps {
  padding?: string;
  textSize?: string;
  color?: string;
  text: string;
  textColor?: string;
  onclick?: () => void;
}

export default function StandardButton({ padding = "px-4 py-2", textSize = "text-sm", color = "bg-primary hover:bg-green-600", text, onclick }: StandardButtonProps) {
  return (
    <div className={`${padding} ${textSize} ${color} flex flex-row justify-between items-center text-white rounded-lg cursor-pointer transition-colors duration-300`} 
    onClick={onclick}>
      {text}
      <ArrowForward className="ml-2 w-4 h-4" />
    </div>
  )
}

export function SecondaryButton({ padding = "px-4 py-2", textColor = "text-primary", textSize = "text-sm", color = "bg-neutral-300 hover:bg-secondaryBackground/80", text, onclick }: StandardButtonProps) {
  return (
    <div className={`${padding} ${textSize} ${color} mt-6 flex flex-row 
    justify-between items-center ${textColor} rounded-full 
    cursor-pointer transition-colors duration-300
    font-semibold`} onClick={onclick}>
      {text}
    </div>
  )
}

// ─── Insight Primitives ───────────────────────────────────────────────────────

/** Active/inactive toggle button — used in latency percentile selector */
export function TabButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`text-xs px-3 py-1 rounded-full font-semibold border transition-all ${
        active
          ? 'bg-primary text-white border-primary'
          : 'text-neutral-500 border-neutral-200 hover:border-primary hover:text-primary'
      }`}
    >
      {label}
    </button>
  );
}

/** Coloured pill badge — used in latency summary rows and similar stat strips */
export function BadgePill({ label, value, colorClass }: { label: string; value: string; colorClass: string }) {
  return (
    <div className={`flex items-center gap-2 text-xs px-3 py-1.5 rounded-full border font-medium ${colorClass}`}>
      <span className="text-neutral-500">{label}:</span>
      <span className="font-bold">{value}</span>
    </div>
  );
}

/** Ranked feature pill — e.g. "#1 Age · 34%" */
export function RankBadge({ rank, name, pct }: { rank: number; name: string; pct: string }) {
  return (
    <div className="flex items-center gap-1.5 text-xs bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-1 rounded-full font-semibold">
      <span className="text-emerald-500">#{rank}</span> {name}
      <span className="text-neutral-400 font-normal">· {pct}%</span>
    </div>
  );
}


