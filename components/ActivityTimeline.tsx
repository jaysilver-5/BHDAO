"use client";

const EVENT_CONFIG: Record<string, { icon: string; color: string; label: string }> = {
  SUBMITTED: { icon: "📤", color: "text-blue-400", label: "Submitted" },
  UPDATED: { icon: "✏️", color: "text-white/50", label: "Updated" },
  WITHDRAWN: { icon: "↩️", color: "text-white/40", label: "Withdrawn" },
  VOTED: { icon: "🗳", color: "text-yellow-400", label: "Voted" },
  EXPERT_REVIEWED: { icon: "🔬", color: "text-purple-400", label: "Expert reviewed" },
  STATUS_CHANGE: { icon: "⚡", color: "text-[#e8c36a]", label: "Status changed" },
  FLAGGED: { icon: "🚩", color: "text-orange-400", label: "Flagged" },
  COMMENTED: { icon: "💬", color: "text-white/50", label: "Commented" },
  FILE_UPLOADED: { icon: "📎", color: "text-white/50", label: "File uploaded" },
  PINNED: { icon: "📌", color: "text-green-400", label: "Pinned to IPFS" },
  ANCHORED: { icon: "⛓", color: "text-[#e8c36a]", label: "Anchored on-chain" },
};

function shortWallet(w?: string) {
  if (!w) return "System";
  return `${w.slice(0, 6)}…${w.slice(-4)}`;
}

function relativeTime(date: string) {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(date).toLocaleDateString();
}

interface Event {
  id: string;
  type: string;
  actorId: string;
  payload?: any;
  createdAt: string;
}

export default function ActivityTimeline({ events }: { events: Event[] }) {
  if (!events.length) {
    return <div className="py-8 text-center text-[12px] text-white/25">No activity yet.</div>;
  }

  return (
    <div className="relative space-y-0">
      {/* Vertical line */}
      <div className="absolute left-[15px] top-2 bottom-2 w-px bg-white/5" />

      {events.map((ev, i) => {
        const cfg = EVENT_CONFIG[ev.type] ?? { icon: "•", color: "text-white/40", label: ev.type };
        return (
          <div key={ev.id} className="relative flex gap-3 py-2.5">
            <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0a0a10] text-[14px] ring-1 ring-white/6">
              {cfg.icon}
            </div>
            <div className="flex-1 pt-0.5">
              <div className="flex items-baseline gap-2">
                <span className={`text-[12px] font-medium ${cfg.color}`}>{cfg.label}</span>
                <span className="text-[10px] text-white/20">{relativeTime(ev.createdAt)}</span>
              </div>
              {ev.payload && (
                <div className="mt-0.5 text-[11px] text-white/35">
                  {ev.type === "STATUS_CHANGE" && ev.payload.from && (
                    <span>{ev.payload.from.replace(/_/g, " ")} → {ev.payload.to.replace(/_/g, " ")}</span>
                  )}
                  {ev.type === "VOTED" && <span>Vote: {ev.payload.value}</span>}
                  {ev.type === "EXPERT_REVIEWED" && <span>{ev.payload.decision} — {ev.payload.notes}</span>}
                  {ev.type === "PINNED" && <span className="font-mono">CID: {ev.payload.cid?.slice(0, 16)}…</span>}
                  {ev.type === "ANCHORED" && <span className="font-mono">Block #{ev.payload.blockNumber}</span>}
                  {ev.type === "UPDATED" && ev.payload.fields && <span>Fields: {ev.payload.fields.join(", ")}</span>}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}