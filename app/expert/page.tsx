"use client";

import Nav from "@/components/Nav";
import StatusBadge from "@/components/StatusBadge";
import VoteBar from "@/components/Votebar";
import RoleGuard from "@/components/Roleguard";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import Link from "next/link";
import { useEffect, useState } from "react";

function ExpertQueueInner() {
  const { token } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    api.expert
      .queue(token)
      .then((d) => {
        setItems(d.items);
        setTotal(d.total);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <div className="min-h-screen">
      <Nav />

      <div className="pointer-events-none absolute inset-x-0 top-0 h-[300px]"
        style={{ background: "radial-gradient(ellipse 40% 30% at 50% 0%, rgba(96,165,250,0.04) 0%, transparent 70%)" }}
      />

      <div className="relative mx-auto max-w-5xl px-5 py-10">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/10 ring-1 ring-purple-500/20">
            <span className="text-[16px]">🔬</span>
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-[#f0ede6]">Expert Review Queue</h1>
            <p className="text-[12px] text-white/30">
              {total} artifact{total !== 1 ? "s" : ""} awaiting expert review
            </p>
          </div>
        </div>

        {loading ? (
          <div className="mt-8 space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-28 animate-pulse rounded-2xl bg-white/[0.02]" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="mt-20 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/[0.03] ring-1 ring-white/[0.05]">
              <span className="text-2xl opacity-30">✓</span>
            </div>
            <div className="mt-5 text-[13px] text-white/30">No artifacts in the queue. All caught up.</div>
          </div>
        ) : (
          <div className="mt-8 space-y-3">
            {items.map((a) => (
              <Link
                key={a.id}
                href={`/artifact/${a.id}`}
                className="group flex flex-col gap-4 rounded-2xl bg-white/[0.015] p-5 ring-1 ring-white/[0.04] transition hover:bg-white/[0.025] hover:ring-purple-500/10 sm:flex-row sm:items-center"
              >
                {/* Type icon */}
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-white/[0.03] text-2xl ring-1 ring-white/[0.05]">
                  {a.type === "image" ? "🖼" : a.type === "audio" ? "🎵" : a.type === "video" ? "🎬" : "📄"}
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="truncate text-[14px] font-semibold text-white/80 transition group-hover:text-purple-400/80">
                      {a.title}
                    </h3>
                    <StatusBadge status={a.status} />
                  </div>
                  <p className="mt-1 truncate text-[12px] text-white/30">{a.description}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-[10px] text-white/20">
                    <span>
                      By <span className="font-mono">{a.submittedBy?.wallet?.slice(0, 6)}…{a.submittedBy?.wallet?.slice(-4)}</span>
                    </span>
                    <span>·</span>
                    <span>{new Date(a.createdAt).toLocaleDateString()}</span>
                    {a.flagCount > 0 && (
                      <>
                        <span>·</span>
                        <span className="text-orange-400/70">🚩 {a.flagCount} flag{a.flagCount !== 1 ? "s" : ""}</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Vote summary */}
                {a.voteSummary && (
                  <div className="w-40 shrink-0">
                    <div className="text-[10px] text-white/20 mb-1.5">Community vote</div>
                    <VoteBar
                      approve={a.voteSummary.approve}
                      reject={a.voteSummary.reject}
                      total={a.voteSummary.total}
                      compact
                    />
                    <div className="mt-1 text-[10px] text-white/20">
                      {a.voteSummary.approve}/{a.voteSummary.total} approved
                    </div>
                  </div>
                )}

                <span className="shrink-0 text-[11px] text-white/15 transition group-hover:text-purple-400/40">
                  Review →
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ExpertPage() {
  return (
    <RoleGuard roles={["EXPERT", "ADMIN"]}>
      <ExpertQueueInner />
    </RoleGuard>
  );
}