"use client";

const STATUS_STYLES: Record<string, string> = {
  VERIFIED: "bg-green-500/10 text-green-400 ring-green-500/20",
  COMMUNITY_REVIEW: "bg-yellow-500/10 text-yellow-400 ring-yellow-500/20",
  EXPERT_REVIEW: "bg-blue-500/10 text-blue-400 ring-blue-500/20",
  REJECTED: "bg-red-500/10 text-red-400 ring-red-500/20",
  FLAGGED: "bg-orange-500/10 text-orange-400 ring-orange-500/20",
  WITHDRAWN: "bg-white/5 text-white/30 ring-white/10",
};

export default function StatusBadge({ status, size = "sm" }: { status: string; size?: "sm" | "md" }) {
  const s = size === "md" ? "px-3 py-1 text-[11px]" : "px-2.5 py-0.5 text-[10px]";
  return (
    <span className={`inline-flex items-center rounded-full font-medium ring-1 ${s} ${STATUS_STYLES[status] ?? "bg-white/5 text-white/40 ring-white/10"}`}>
      {status === "VERIFIED" && <span className="mr-1 text-green-400">✦</span>}
      {status.replace(/_/g, " ")}
    </span>
  );
}