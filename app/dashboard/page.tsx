"use client";

import Nav from "@/components/Nav";
import StatusBadge from "@/components/StatusBadge";
import VoteBar from "@/components/Votebar";
import TimeRemaining from "@/components/TimeRemaining";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import Link from "next/link";
import { useEffect, useState } from "react";

const TABS = [
  { key: "ALL", label: "All" },
  { key: "COMMUNITY_REVIEW", label: "In Review" },
  { key: "EXPERT_REVIEW", label: "Expert Review" },
  { key: "VERIFIED", label: "Verified" },
  { key: "REJECTED", label: "Rejected" },
  { key: "WITHDRAWN", label: "Withdrawn" },
];

export default function DashboardPage() {
  const { user, token, loading: authLoading } = useAuth();
  const [artifacts, setArtifacts] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("ALL");
  const [voteSummaries, setVoteSummaries] = useState<Record<string, any>>({});

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    api.artifacts
      .listMine(token)
      .then(async (d) => {
        setArtifacts(d.items);
        setTotal(d.total);
        // Fetch vote summaries for items in review
        const reviewItems = d.items.filter((a: any) =>
          ["COMMUNITY_REVIEW", "EXPERT_REVIEW"].includes(a.status),
        );
        const summaries: Record<string, any> = {};
        await Promise.allSettled(
          reviewItems.map(async (a: any) => {
            const vs = await api.votes.summary(a.id);
            summaries[a.id] = vs;
          }),
        );
        setVoteSummaries(summaries);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  if (!authLoading && !user) {
    return (
      <div className="min-h-screen">
        <Nav />
        <div className="mx-auto max-w-4xl px-5 py-20 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#e8c36a]/[0.06] ring-1 ring-[#e8c36a]/10">
            <span className="text-2xl">🔒</span>
          </div>
          <h2 className="mt-5 text-lg font-semibold text-white/80">Connect your wallet</h2>
          <p className="mt-2 text-[13px] text-white/35">Connect to see your submissions.</p>
        </div>
      </div>
    );
  }

  const filtered = tab === "ALL" ? artifacts : artifacts.filter((a) => a.status === tab);

  const statusCounts = artifacts.reduce(
    (acc: Record<string, number>, a) => {
      acc[a.status] = (acc[a.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  return (
    <div className="min-h-screen">
      <Nav />

      <div className="pointer-events-none absolute inset-x-0 top-0 h-[300px]"
        style={{ background: "radial-gradient(ellipse 40% 30% at 50% 0%, rgba(232,195,106,0.04) 0%, transparent 70%)" }}
      />

      <div className="relative mx-auto max-w-5xl px-5 py-10">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-[#f0ede6]">My Artifacts</h1>
            <p className="mt-1 text-[13px] text-white/30">
              {total} submission{total !== 1 ? "s" : ""} total
            </p>
          </div>
          <Link
            href="/submit"
            className="shrink-0 rounded-xl bg-gradient-to-r from-[#e8c36a] to-[#c9a44e] px-5 py-2.5 text-[13px] font-semibold text-black transition hover:shadow-[0_0_20px_rgba(232,195,106,0.15)]"
          >
            Submit new →
          </Link>
        </div>

        {/* Stat cards */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "In Review", count: (statusCounts.COMMUNITY_REVIEW || 0) + (statusCounts.EXPERT_REVIEW || 0), color: "text-yellow-400" },
            { label: "Verified", count: statusCounts.VERIFIED || 0, color: "text-green-400" },
            { label: "Rejected", count: statusCounts.REJECTED || 0, color: "text-red-400" },
            { label: "Withdrawn", count: statusCounts.WITHDRAWN || 0, color: "text-white/30" },
          ].map((s) => (
            <div key={s.label} className="rounded-xl bg-white/[0.02] px-4 py-3 ring-1 ring-white/[0.04]">
              <div className={`text-xl font-semibold ${s.color}`}>{s.count}</div>
              <div className="text-[10px] text-white/25">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="mt-6 flex gap-1 overflow-x-auto pb-1">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`shrink-0 rounded-lg px-3 py-1.5 text-[11px] font-medium transition ${
                tab === t.key
                  ? "bg-[#e8c36a]/10 text-[#e8c36a] ring-1 ring-[#e8c36a]/20"
                  : "text-white/30 hover:bg-white/[0.03] hover:text-white/50"
              }`}
            >
              {t.label}
              {t.key !== "ALL" && statusCounts[t.key] ? (
                <span className="ml-1.5 text-[10px] opacity-50">{statusCounts[t.key]}</span>
              ) : null}
            </button>
          ))}
        </div>

        {/* List */}
        {loading ? (
          <div className="mt-6 space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 animate-pulse rounded-2xl bg-white/[0.02]" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="mt-16 text-center">
            <div className="text-[13px] text-white/25">
              {tab === "ALL" ? "You haven't submitted any artifacts yet." : `No ${tab.replace(/_/g, " ").toLowerCase()} artifacts.`}
            </div>
          </div>
        ) : (
          <div className="mt-6 space-y-3">
            {filtered.map((a) => {
              const vs = voteSummaries[a.id];
              return (
                <Link
                  key={a.id}
                  href={`/artifact/${a.id}`}
                  className="group flex items-center gap-4 rounded-2xl bg-white/[0.015] p-4 ring-1 ring-white/[0.04] transition hover:bg-white/[0.025] hover:ring-white/[0.08]"
                >
                  {/* Type icon */}
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/[0.03] text-xl ring-1 ring-white/[0.05]">
                    {a.type === "image" ? "🖼" : a.type === "audio" ? "🎵" : a.type === "video" ? "🎬" : "📄"}
                  </div>

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="truncate text-[13px] font-semibold text-white/80 transition group-hover:text-[#e8c36a]/80">
                        {a.title}
                      </h3>
                      <StatusBadge status={a.status} />
                    </div>
                    <div className="mt-1 flex items-center gap-3 text-[11px] text-white/25">
                      <span>{new Date(a.createdAt).toLocaleDateString()}</span>
                      {a.status === "COMMUNITY_REVIEW" && a.reviewEndsAt && (
                        <TimeRemaining endsAt={a.reviewEndsAt} label="" />
                      )}
                    </div>
                  </div>

                  {/* Vote progress */}
                  {vs && (
                    <div className="hidden w-32 shrink-0 sm:block">
                      <VoteBar approve={vs.approve} reject={vs.reject} total={vs.total} ratio={vs.ratio} compact />
                    </div>
                  )}

                  <span className="shrink-0 text-[11px] text-white/15 transition group-hover:text-white/40">→</span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}