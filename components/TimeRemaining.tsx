"use client";

import { useEffect, useState } from "react";

function calc(end: string) {
  const diff = new Date(end).getTime() - Date.now();
  if (diff <= 0) return null;
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  return { d, h, m, total: diff };
}

export default function TimeRemaining({ endsAt, label = "Review ends in" }: { endsAt: string; label?: string }) {
  const [t, setT] = useState(calc(endsAt));

  useEffect(() => {
    const id = setInterval(() => setT(calc(endsAt)), 60000);
    return () => clearInterval(id);
  }, [endsAt]);

  if (!t) {
    return (
      <span className="text-[11px] text-red-400/80">Review window closed</span>
    );
  }

  const urgent = t.total < 86400000; // less than 1 day

  return (
    <div className="flex items-center gap-2">
      <span className={`text-[11px] ${urgent ? "text-orange-400/80" : "text-white/35"}`}>{label}</span>
      <div className="flex items-center gap-1">
        {t.d > 0 && (
          <span className={`rounded-md px-1.5 py-0.5 font-mono text-[11px] font-medium ring-1 ${urgent ? "bg-orange-500/8 text-orange-400 ring-orange-500/15" : "bg-white/4 text-white/50 ring-white/8"}`}>
            {t.d}d
          </span>
        )}
        <span className={`rounded-md px-1.5 py-0.5 font-mono text-[11px] font-medium ring-1 ${urgent ? "bg-orange-500/8 text-orange-400 ring-orange-500/15" : "bg-white/4 text-white/50 ring-white/8"}`}>
          {t.h}h
        </span>
        <span className={`rounded-md px-1.5 py-0.5 font-mono text-[11px] font-medium ring-1 ${urgent ? "bg-orange-500/8 text-orange-400 ring-orange-500/15" : "bg-white/4 text-white/50 ring-white/8"}`}>
          {t.m}m
        </span>
      </div>
    </div>
  );
}