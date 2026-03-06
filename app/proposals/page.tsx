"use client";

import Nav from "@/components/Nav";
import StatusBadge from "@/components/StatusBadge";
import VoteBar from "@/components/Votebar";
import TimeRemaining from "@/components/TimeRemaining";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import Link from "next/link";
import { useEffect, useState } from "react";

const FILTERS = [
  { key: "COMMUNITY_REVIEW", label: "Community Review" },
  { key: "EXPERT_REVIEW", label: "Expert Review" },
];

export default function ProposalsPage() {
  const { user, token, loading: authLoading } = useAuth();
  const [filter, setFilter] = useState("COMMUNITY_REVIEW");
  const [artifacts, setArtifacts] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [voteSummaries, setVoteSummaries] = useState<Record<string, any>>({});
  const [myVotes, setMyVotes] = useState<Record<string, any>>({});
  const [page, setPage] = useState(1);
  const limit = 12;

  useEffect(() => {
    // Community review is public, expert review needs auth
    if (filter === "EXPERT_REVIEW" && !token) return;
    setLoading(true);

    const fetchData = filter === "COMMUNITY_REVIEW"
      ? api.artifacts.review()
      : api.artifacts.listByStatus(filter, token!);

    fetchData
      .then(async (d) => {
        setArtifacts(d.items);
        setTotal(d.total);

        // Fetch vote summaries + user's votes in parallel
        const summaries: Record<string, any> = {};
        const votes: Record<string, any> = {};
        if (token) {
          await Promise.allSettled(
            d.items.map(async (a: any) => {
              const [vs, mv] = await Promise.allSettled([
                api.votes.summary(a.id),
                api.votes.mine(a.id, token),
              ]);
              if (vs.status === "fulfilled") summaries[a.id] = vs.value;
              if (mv.status === "fulfilled") votes[a.id] = mv.value;
            }),
          );
        }
        setVoteSummaries(summaries);
        setMyVotes(votes);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token, filter, page]);

  // ─── Auth guard for expert tab only ───
  if (!authLoading && !user && filter === "EXPERT_REVIEW") {
    return (
      <div className="min-h-screen">
        <Nav />
        <div className="mx-auto max-w-4xl px-5 py-20 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#e8c36a]/[0.06] ring-1 ring-[#e8c36a]/10">
            <span className="text-2xl">🔒</span>
          </div>
          <h2 className="mt-5 text-lg font-semibold text-white/80">Connect your wallet</h2>
          <p className="mt-2 text-[13px] text-white/35">
            Connect to view expert review queue.
          </p>
        </div>
      </div>
    );
  }

  const communityCount = filter === "COMMUNITY_REVIEW" ? total : 0;
  const expertCount = filter === "EXPERT_REVIEW" ? total : 0;

  return (
    <div className="min-h-screen">
      <Nav />

      {/* Glow */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[350px]"
        style={{
          background:
            "radial-gradient(ellipse 50% 35% at 50% 0%, rgba(234,179,8,0.05) 0%, transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-5xl px-5 py-10">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-yellow-500/[0.06] px-3 py-1 text-[10px] font-medium uppercase tracking-widest text-yellow-500/60 ring-1 ring-yellow-500/10">
              <span className="text-yellow-400">●</span> Active Proposals
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-[#f0ede6]">
              Proposals Under Review
            </h1>
            <p className="mt-1 text-[13px] text-white/30">
              Review submissions, cast your vote, and help curate the archive.
            </p>
          </div>
          <Link
            href="/submit"
            className="shrink-0 rounded-xl bg-gradient-to-r from-[#e8c36a] to-[#c9a44e] px-5 py-2.5 text-[13px] font-semibold text-black transition hover:shadow-[0_0_20px_rgba(232,195,106,0.15)]"
          >
            Submit artifact →
          </Link>
        </div>

        {/* Filter tabs */}
        <div className="mt-6 flex gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => {
                setFilter(f.key);
                setPage(1);
              }}
              className={`rounded-xl px-4 py-2 text-[12px] font-medium transition ring-1 ${
                filter === f.key
                  ? f.key === "COMMUNITY_REVIEW"
                    ? "bg-yellow-500/10 text-yellow-400 ring-yellow-500/20"
                    : "bg-blue-500/10 text-blue-400 ring-blue-500/20"
                  : "bg-white/[0.02] text-white/30 ring-white/[0.05] hover:bg-white/[0.04] hover:text-white/50"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Info banner */}
        {filter === "COMMUNITY_REVIEW" && (
          <div className="mt-4 rounded-xl bg-yellow-500/[0.04] px-4 py-3 text-[12px] text-yellow-500/60 ring-1 ring-yellow-500/10">
            <strong className="text-yellow-400/80">How voting works:</strong> Each artifact needs ≥3
            votes with ≥60% approval to advance to expert review. You get one vote per artifact.
            The review window is 7 days.
          </div>
        )}

        {filter === "EXPERT_REVIEW" && (
          <div className="mt-4 rounded-xl bg-blue-500/[0.04] px-4 py-3 text-[12px] text-blue-500/60 ring-1 ring-blue-500/10">
            These artifacts passed community voting and are awaiting expert verification.
            {user?.role === "EXPERT" || user?.role === "ADMIN"
              ? " You can review these from the artifact detail page."
              : " Only experts can approve or reject at this stage."}
          </div>
        )}

        {/* Results */}
        {loading ? (
          <div className="mt-8 space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 animate-pulse rounded-2xl bg-white/[0.02]" />
            ))}
          </div>
        ) : artifacts.length === 0 ? (
          <div className="mt-20 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/[0.03] ring-1 ring-white/[0.05]">
              <span className="text-2xl opacity-30">📭</span>
            </div>
            <div className="mt-5 text-[13px] text-white/30">
              No artifacts in {filter === "COMMUNITY_REVIEW" ? "community" : "expert"} review right now.
            </div>
          </div>
        ) : (
          <div className="mt-6 space-y-3">
            {artifacts.map((a) => {
              const vs = voteSummaries[a.id];
              const mv = myVotes[a.id];
              const isOwn = user?.userId === a.submittedById;

              return (
                <Link
                  key={a.id}
                  href={`/artifact/${a.id}`}
                  className="group flex flex-col gap-4 rounded-2xl bg-white/[0.015] p-5 ring-1 ring-white/[0.04] transition hover:bg-white/[0.025] hover:ring-white/[0.08] sm:flex-row sm:items-center"
                >
                  {/* Type icon */}
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-white/[0.03] text-2xl ring-1 ring-white/[0.05]">
                    {a.type === "image"
                      ? "🖼"
                      : a.type === "audio"
                        ? "🎵"
                        : a.type === "video"
                          ? "🎬"
                          : "📄"}
                  </div>

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="truncate text-[14px] font-semibold text-white/80 transition group-hover:text-[#e8c36a]/80">
                        {a.title}
                      </h3>
                      <StatusBadge status={a.status} />
                      {isOwn && (
                        <span className="rounded-md bg-white/[0.04] px-1.5 py-0.5 text-[9px] font-medium text-white/30 ring-1 ring-white/[0.06]">
                          YOURS
                        </span>
                      )}
                    </div>
                    <p className="mt-1 truncate text-[12px] text-white/30">{a.description}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-[10px] text-white/20">
                      <span className="font-mono">
                        {a.submittedBy?.wallet?.slice(0, 6)}…{a.submittedBy?.wallet?.slice(-4)}
                      </span>
                      <span>·</span>
                      <span>{new Date(a.createdAt).toLocaleDateString()}</span>
                      {a.reviewEndsAt && a.status === "COMMUNITY_REVIEW" && (
                        <>
                          <span>·</span>
                          <TimeRemaining endsAt={a.reviewEndsAt} label="" />
                        </>
                      )}
                      {a.tags?.length > 0 && (
                        <>
                          <span>·</span>
                          <div className="flex gap-1">
                            {a.tags.slice(0, 3).map((t: string) => (
                              <span
                                key={t}
                                className="rounded-full bg-white/[0.03] px-1.5 py-0.5 text-[9px] text-white/25 ring-1 ring-white/[0.04]"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Vote status */}
                  <div className="flex shrink-0 items-center gap-4">
                    {vs && (
                      <div className="w-36">
                        <VoteBar
                          approve={vs.approve}
                          reject={vs.reject}
                          total={vs.total}
                          ratio={vs.ratio}
                          compact
                        />
                        <div className="mt-1 flex items-center justify-between text-[10px]">
                          <span className="text-white/20">
                            {vs.approve}/{vs.total} approved
                          </span>
                          {vs.total >= 3 && vs.ratio >= 0.6 && (
                            <span className="text-green-400/60">✓ threshold</span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* User's vote indicator */}
                    <div className="flex w-16 flex-col items-center">
                      {mv?.voted ? (
                        <span
                          className={`rounded-lg px-2.5 py-1 text-[10px] font-semibold ring-1 ${
                            mv.value === "APPROVE"
                              ? "bg-green-500/8 text-green-400/80 ring-green-500/15"
                              : "bg-red-500/8 text-red-400/80 ring-red-500/15"
                          }`}
                        >
                          {mv.value === "APPROVE" ? "▲" : "▼"} Voted
                        </span>
                      ) : isOwn ? (
                        <span className="text-[10px] text-white/15">—</span>
                      ) : a.status === "COMMUNITY_REVIEW" ? (
                        <span className="rounded-lg bg-yellow-500/8 px-2.5 py-1 text-[10px] font-medium text-yellow-400/60 ring-1 ring-yellow-500/12">
                          Vote →
                        </span>
                      ) : null}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {total > limit && (
          <div className="mt-8 flex items-center justify-center gap-3">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="rounded-xl bg-white/[0.03] px-4 py-2 text-[12px] text-white/40 ring-1 ring-white/6 transition hover:bg-white/[0.06] disabled:opacity-25"
            >
              ← Previous
            </button>
            <span className="text-[11px] text-white/20">
              Page {page} of {Math.ceil(total / limit)}
            </span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= Math.ceil(total / limit)}
              className="rounded-xl bg-white/[0.03] px-4 py-2 text-[12px] text-white/40 ring-1 ring-white/6 transition hover:bg-white/[0.06] disabled:opacity-25"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}