"use client";

import Nav from "@/components/Nav";
import StatusBadge from "@/components/StatusBadge";
import VoteBar from "@/components/Votebar";
import TimeRemaining from "@/components/TimeRemaining";
import ProofBadge from "@/components/ProofBadge";
import FlagModal from "@/components/FlagModal";
import ActivityTimeline from "@/components/ActivityTimeline";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";

export default function ArtifactDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user, token } = useAuth();
  const router = useRouter();

  const [a, setA] = useState<any>(null);
  const [votes, setVotes] = useState<any>(null);
  const [myVote, setMyVote] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [commentTotal, setCommentTotal] = useState(0);
  const [proof, setProof] = useState<any>(null);
  const [ipfs, setIpfs] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // Actions
  const [busy, setBusy] = useState<string | null>(null);
  const [commentText, setCommentText] = useState("");
  const [showFlag, setShowFlag] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);

  // Expert review
  const [reviewNotes, setReviewNotes] = useState("");

  const load = useCallback(async () => {
    try {
      const art = await api.artifacts.get(id, token);
      setA(art);

      // Parallel loads
      const [vs, cms, ch, ip, ev] = await Promise.allSettled([
        api.votes.summary(id),
        api.comments.list(id),
        api.chain.proof(id),
        api.ipfs.info(id),
        api.artifacts.activity(id, token),
      ]);

      if (vs.status === "fulfilled") setVotes(vs.value);
      if (cms.status === "fulfilled") {
        setComments(cms.value.items);
        setCommentTotal(cms.value.total);
      }
      if (ch.status === "fulfilled") setProof(ch.value);
      if (ip.status === "fulfilled") setIpfs(ip.value);
      if (ev.status === "fulfilled") setEvents(ev.value);

      if (token) {
        api.votes.mine(id, token).then(setMyVote).catch(() => {});
      }
    } catch (e: any) {
      setErr(e.message ?? "Failed to load artifact");
    } finally {
      setLoading(false);
    }
  }, [id, token]);

  useEffect(() => { load(); }, [load]);

  // ─── Actions ───
  const castVote = async (value: "APPROVE" | "REJECT") => {
    if (!token) return;
    setBusy("vote");
    try {
      await api.votes.cast(id, value, token);
      const [vs, mv] = await Promise.all([api.votes.summary(id), api.votes.mine(id, token)]);
      setVotes(vs);
      setMyVote(mv);
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setBusy(null);
    }
  };

  const postComment = async () => {
    if (!token || !commentText.trim()) return;
    setBusy("comment");
    try {
      await api.comments.create(id, commentText.trim(), token);
      setCommentText("");
      const cms = await api.comments.list(id);
      setComments(cms.items);
      setCommentTotal(cms.total);
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setBusy(null);
    }
  };

  const handleFlag = async (reason: string, details: string) => {
    if (!token) return;
    await api.flags.create(id, reason, token, details);
  };

  const handleWithdraw = async () => {
    if (!token || !confirm("Withdraw this artifact? This cannot be undone.")) return;
    setBusy("withdraw");
    try {
      await api.artifacts.withdraw(id, token);
      await load();
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setBusy(null);
    }
  };

  const handleExpertReview = async (decision: "APPROVE" | "REJECT") => {
    if (!token) return;
    setBusy("review");
    try {
      await api.expert.review(id, decision, token, reviewNotes || undefined);
      await load();
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setBusy(null);
    }
  };

  // ─── Loading / Error ───
  if (loading) {
    return (
      <div className="min-h-screen">
        <Nav />
        <div className="mx-auto max-w-4xl px-5 py-12">
          <div className="h-8 w-48 animate-pulse rounded-lg bg-white/5" />
          <div className="mt-4 h-4 w-96 animate-pulse rounded bg-white/3" />
          <div className="mt-8 h-64 animate-pulse rounded-2xl bg-white/[0.025]" />
        </div>
      </div>
    );
  }

  if (!a) {
    return (
      <div className="min-h-screen">
        <Nav />
        <div className="mx-auto max-w-4xl px-5 py-20 text-center">
          <div className="text-2xl opacity-30">404</div>
          <div className="mt-3 text-[13px] text-white/40">{err || "Artifact not found"}</div>
        </div>
      </div>
    );
  }

  const isSubmitter = user?.userId === a.submittedById;
  const isExpertOrAdmin = user && (user.role === "EXPERT" || user.role === "ADMIN");
  const canVote = token && a.status === "COMMUNITY_REVIEW" && !isSubmitter && !myVote?.voted;
  const canWithdraw = isSubmitter && !["VERIFIED", "REJECTED", "WITHDRAWN"].includes(a.status);
  const canReview = isExpertOrAdmin && a.status === "EXPERT_REVIEW";

  return (
    <div className="min-h-screen">
      <Nav />

      {/* Hero glow */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[300px]"
        style={{ background: "radial-gradient(ellipse 40% 30% at 50% 0%, rgba(232,195,106,0.05) 0%, transparent 70%)" }}
      />

      <div className="relative mx-auto max-w-4xl px-5 py-10">
        {/* Breadcrumb */}
        <button onClick={() => router.back()} className="mb-6 text-[12px] text-white/30 transition hover:text-white/50">
          ← Back
        </button>

        {/* ─── Header ─── */}
        <div className="flex flex-wrap items-start gap-3">
          <StatusBadge status={a.status} size="md" />
          {a.status === "COMMUNITY_REVIEW" && a.reviewEndsAt && (
            <TimeRemaining endsAt={a.reviewEndsAt} />
          )}
          {proof?.anchored && (
            <ProofBadge anchored compact txHash={proof.txHash} explorerUrl={proof.explorerUrl} />
          )}
        </div>

        <h1 className="mt-4 text-2xl font-semibold tracking-tight text-[#f0ede6] sm:text-3xl">
          {a.title}
        </h1>
        <p className="mt-3 text-[13px] leading-relaxed text-white/40">{a.description}</p>

        {/* Meta row */}
        <div className="mt-5 flex flex-wrap items-center gap-3 text-[11px] text-white/25">
          <span className="rounded-md bg-white/3 px-2 py-0.5 font-mono ring-1 ring-white/5">
            {a.type}
          </span>
          {a.language && <span>{a.language.toUpperCase()}</span>}
          {a.license && <><span className="text-white/10">·</span><span>{a.license}</span></>}
          <span className="text-white/10">·</span>
          <span>Submitted {new Date(a.createdAt).toLocaleDateString()}</span>
          {a.submittedBy && (
            <>
              <span className="text-white/10">·</span>
              <span className="font-mono">{a.submittedBy.wallet?.slice(0, 6)}…{a.submittedBy.wallet?.slice(-4)}</span>
            </>
          )}
        </div>

        {/* Tags */}
        {a.tags?.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {a.tags.map((t: string) => (
              <span key={t} className="rounded-full bg-[#e8c36a]/[0.04] px-2.5 py-0.5 text-[10px] font-medium text-[#e8c36a]/50 ring-1 ring-[#e8c36a]/10">
                {t}
              </span>
            ))}
          </div>
        )}

        {/* ─── Two-column layout ─── */}
        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
          {/* Left column */}
          <div className="space-y-6">
            {/* File Preview */}
            {a.fileUrl && (
              <div className="overflow-hidden rounded-2xl bg-white/[0.02] ring-1 ring-white/[0.05]">
                {a.type === "image" ? (
                  <img src={a.fileUrl} alt={a.title} className="w-full object-contain" style={{ maxHeight: 500 }} />
                ) : (
                  <div className="flex items-center justify-center py-16">
                    <a href={a.fileUrl} target="_blank" rel="noreferrer" className="rounded-xl bg-white/5 px-5 py-3 text-[12px] font-medium text-white/60 ring-1 ring-white/8 transition hover:bg-white/8">
                      View file ↗
                    </a>
                  </div>
                )}
              </div>
            )}

            {/* Source URL */}
            {a.sourceUrl && (
              <div className="rounded-xl bg-white/[0.02] px-4 py-3 ring-1 ring-white/[0.04]">
                <div className="text-[10px] font-medium uppercase tracking-widest text-white/15">Source</div>
                <a href={a.sourceUrl} target="_blank" rel="noreferrer" className="mt-1 block truncate text-[12px] text-[#e8c36a]/60 underline decoration-[#e8c36a]/15 hover:text-[#e8c36a]/80">
                  {a.sourceUrl}
                </a>
              </div>
            )}

            {/* ─── Comments ─── */}
            <div className="rounded-2xl bg-white/[0.015] p-5 ring-1 ring-white/[0.04]">
              <h2 className="text-[13px] font-semibold text-white/70">
                Comments <span className="text-white/25">({commentTotal})</span>
              </h2>

              {/* Post comment */}
              {token && (
                <div className="mt-4 flex gap-2">
                  <input
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && postComment()}
                    placeholder="Add a comment…"
                    className="flex-1 rounded-xl bg-white/[0.03] px-4 py-2.5 text-[12px] text-white/70 outline-none ring-1 ring-white/[0.06] placeholder:text-white/15 focus:ring-[#e8c36a]/15"
                  />
                  <button
                    onClick={postComment}
                    disabled={busy === "comment" || !commentText.trim()}
                    className="rounded-xl bg-[#e8c36a]/10 px-4 py-2.5 text-[12px] font-medium text-[#e8c36a]/80 ring-1 ring-[#e8c36a]/15 transition hover:bg-[#e8c36a]/15 disabled:opacity-30"
                  >
                    {busy === "comment" ? "…" : "Post"}
                  </button>
                </div>
              )}

              {/* Comment list */}
              <div className="mt-4 space-y-3">
                {comments.length === 0 ? (
                  <div className="py-6 text-center text-[12px] text-white/20">No comments yet.</div>
                ) : (
                  comments.map((c) => (
                    <div key={c.id} className="rounded-xl bg-white/[0.02] px-4 py-3 ring-1 ring-white/[0.03]">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] text-white/30">
                          {c.author?.wallet?.slice(0, 6)}…{c.author?.wallet?.slice(-4)}
                        </span>
                        <span className="text-[10px] text-white/15">
                          {new Date(c.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="mt-1.5 text-[12px] leading-relaxed text-white/50">{c.body}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* ─── Activity Timeline ─── */}
            <div className="rounded-2xl bg-white/[0.015] p-5 ring-1 ring-white/[0.04]">
              <button
                onClick={() => setShowTimeline(!showTimeline)}
                className="flex w-full items-center justify-between text-[13px] font-semibold text-white/70"
              >
                Activity Timeline <span className="text-[11px] text-white/25">({events.length})</span>
                <span className={`text-white/25 transition-transform ${showTimeline ? "rotate-180" : ""}`}>▾</span>
              </button>
              {showTimeline && (
                <div className="mt-4">
                  <ActivityTimeline events={events} />
                </div>
              )}
            </div>
          </div>

          {/* ─── Right sidebar ─── */}
          <div className="space-y-4">
            {/* Votes */}
            {votes && (
              <div className="rounded-2xl bg-white/[0.015] p-5 ring-1 ring-white/[0.04]">
                <h3 className="mb-3 text-[12px] font-semibold text-white/50">Community Vote</h3>
                <VoteBar approve={votes.approve} reject={votes.reject} total={votes.total} ratio={votes.ratio} />

                {canVote && (
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => castVote("APPROVE")}
                      disabled={busy === "vote"}
                      className="flex-1 rounded-xl bg-green-500/8 py-2.5 text-[12px] font-medium text-green-400 ring-1 ring-green-500/15 transition hover:bg-green-500/15 disabled:opacity-40"
                    >
                      ▲ Approve
                    </button>
                    <button
                      onClick={() => castVote("REJECT")}
                      disabled={busy === "vote"}
                      className="flex-1 rounded-xl bg-red-500/8 py-2.5 text-[12px] font-medium text-red-400 ring-1 ring-red-500/15 transition hover:bg-red-500/15 disabled:opacity-40"
                    >
                      ▼ Reject
                    </button>
                  </div>
                )}

                {myVote?.voted && (
                  <div className="mt-3 text-center text-[11px] text-white/25">
                    You voted: <span className={myVote.value === "APPROVE" ? "text-green-400" : "text-red-400"}>{myVote.value}</span>
                  </div>
                )}
              </div>
            )}

            {/* On-chain proof */}
            {proof?.anchored && (
              <ProofBadge
                anchored
                txHash={proof.txHash}
                explorerUrl={proof.explorerUrl}
                cid={ipfs?.cid}
                gatewayUrl={ipfs?.gatewayUrl}
              />
            )}

            {/* IPFS info (if not in proof) */}
            {ipfs?.pinned && !proof?.anchored && (
              <div className="rounded-xl bg-white/[0.02] p-4 ring-1 ring-white/[0.04]">
                <div className="text-[10px] font-medium uppercase tracking-widest text-white/15">IPFS</div>
                <a href={ipfs.gatewayUrl} target="_blank" rel="noreferrer" className="mt-1 block truncate font-mono text-[11px] text-white/40 underline decoration-white/10 hover:text-white/60">
                  {ipfs.cid}
                </a>
              </div>
            )}

            {/* ─── Expert Review Panel ─── */}
            {canReview && (
              <div className="rounded-2xl bg-purple-500/[0.04] p-5 ring-1 ring-purple-500/15">
                <h3 className="text-[12px] font-semibold text-purple-400/80">Expert Review</h3>
                <textarea
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  placeholder="Review notes (required for rejection)…"
                  rows={3}
                  className="mt-3 w-full rounded-xl bg-white/[0.03] px-3 py-2.5 text-[12px] text-white/60 outline-none ring-1 ring-white/[0.06] placeholder:text-white/15 focus:ring-purple-500/20"
                />
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => handleExpertReview("APPROVE")}
                    disabled={busy === "review"}
                    className="flex-1 rounded-xl bg-green-500/10 py-2.5 text-[12px] font-semibold text-green-400 ring-1 ring-green-500/20 transition hover:bg-green-500/20 disabled:opacity-40"
                  >
                    ✓ Approve & Verify
                  </button>
                  <button
                    onClick={() => handleExpertReview("REJECT")}
                    disabled={busy === "review"}
                    className="flex-1 rounded-xl bg-red-500/10 py-2.5 text-[12px] font-semibold text-red-400 ring-1 ring-red-500/20 transition hover:bg-red-500/20 disabled:opacity-40"
                  >
                    ✕ Reject
                  </button>
                </div>
              </div>
            )}

            {/* ─── Submitter Actions ─── */}
            {isSubmitter && (
              <div className="space-y-2">
                {a.status === "COMMUNITY_REVIEW" && (
                  <button
                    onClick={() => router.push(`/artifact/${a.id}/edit`)}
                    className="w-full rounded-xl bg-white/[0.03] py-2.5 text-[12px] font-medium text-white/50 ring-1 ring-white/[0.06] transition hover:bg-white/[0.06]"
                  >
                    Edit artifact
                  </button>
                )}
                {canWithdraw && (
                  <button
                    onClick={handleWithdraw}
                    disabled={busy === "withdraw"}
                    className="w-full rounded-xl bg-white/[0.02] py-2.5 text-[11px] text-white/25 ring-1 ring-white/[0.04] transition hover:bg-white/[0.04] hover:text-white/40 disabled:opacity-40"
                  >
                    Withdraw artifact
                  </button>
                )}
              </div>
            )}

            {/* Flag */}
            {token && a.status !== "WITHDRAWN" && (
              <button
                onClick={() => setShowFlag(true)}
                className="w-full rounded-xl bg-white/[0.02] py-2.5 text-[11px] text-white/20 ring-1 ring-white/[0.04] transition hover:bg-white/[0.04] hover:text-white/35"
              >
                🚩 Flag this artifact
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Flag modal */}
      <FlagModal open={showFlag} onClose={() => setShowFlag(false)} onSubmit={handleFlag} />

      {/* Error toast */}
      {err && (
        <div className="fixed bottom-4 right-4 z-50 rounded-xl bg-red-500/10 px-4 py-3 text-[12px] text-red-400 ring-1 ring-red-500/15 backdrop-blur">
          {err}
          <button onClick={() => setErr("")} className="ml-3 text-red-400/40 hover:text-red-400">✕</button>
        </div>
      )}
    </div>
  );
}