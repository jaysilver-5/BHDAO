"use client";

interface VoteBarProps {
  approve: number;
  reject: number;
  total: number;
  ratio?: number;
  compact?: boolean;
}

export default function VoteBar({ approve, reject, total, ratio, compact = false }: VoteBarProps) {
  const pct = total > 0 ? (ratio ?? approve / total) * 100 : 0;

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/5">
          {total > 0 && (
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${pct}%`,
                background: pct >= 60
                  ? "linear-gradient(90deg, #4ade80, #22c55e)"
                  : "linear-gradient(90deg, #facc15, #f59e0b)",
              }}
            />
          )}
        </div>
        <span className="text-[10px] font-mono text-white/40">{total > 0 ? `${Math.round(pct)}%` : "—"}</span>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-[11px]">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-green-400">
            <span className="text-[13px]">▲</span> {approve}
          </span>
          <span className="flex items-center gap-1 text-red-400">
            <span className="text-[13px]">▼</span> {reject}
          </span>
        </div>
        <span className="font-mono text-white/35">{total} vote{total !== 1 ? "s" : ""}</span>
      </div>
      <div className="relative h-2 overflow-hidden rounded-full bg-white/5">
        {total > 0 && (
          <>
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-green-500/70 transition-all duration-700"
              style={{ width: `${pct}%` }}
            />
            <div
              className="absolute inset-y-0 right-0 rounded-full bg-red-500/40 transition-all duration-700"
              style={{ width: `${100 - pct}%` }}
            />
          </>
        )}
      </div>
      <div className="text-center text-[10px] font-medium" style={{ color: pct >= 60 ? "#4ade80" : pct > 0 ? "#facc15" : "rgba(255,255,255,0.25)" }}>
        {total > 0 ? `${Math.round(pct)}% approval` : "No votes yet"}
      </div>
    </div>
  );
}