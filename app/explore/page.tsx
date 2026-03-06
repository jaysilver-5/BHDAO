"use client";

import Nav from "@/components/Nav";
import StatusBadge from "@/components/StatusBadge";
import ProofBadge from "@/components/ProofBadge";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";

function ExploreInner() {
  const params = useSearchParams();
  const { user } = useAuth();
  const initialQ = params.get("q") ?? "";
  const [query, setQuery] = useState(initialQ);
  const [artifacts, setArtifacts] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const limit = 12;

  useEffect(() => {
    setLoading(true);
    api.artifacts
      .list(`page=${page}&limit=${limit}`)
      .then((d) => {
        setArtifacts(d.items);
        setTotal(d.total);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page]);

  const filtered = query.trim()
    ? artifacts.filter(
        (a) =>
          a.title?.toLowerCase().includes(query.toLowerCase()) ||
          a.description?.toLowerCase().includes(query.toLowerCase()) ||
          a.tags?.some((t: string) => t.toLowerCase().includes(query.toLowerCase())),
      )
    : artifacts;

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="min-h-screen">
      <Nav />

      {/* Hero glow */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[400px] opacity-60"
        style={{ background: "radial-gradient(ellipse 50% 35% at 50% 0%, rgba(232,195,106,0.06) 0%, transparent 70%)" }}
      />

      <div className="relative mx-auto max-w-6xl px-5 py-10">
        {/* Header */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#e8c36a]/6 px-3 py-1 text-[10px] font-medium uppercase tracking-widest text-[#e8c36a]/60 ring-1 ring-[#e8c36a]/10">
              <span className="text-[#e8c36a]">◆</span> Public Archive
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-[#f0ede6]">
              Explore the archive
            </h1>
            <p className="mt-2 text-[13px] text-white/35">
              {total} verified artifact{total !== 1 ? "s" : ""} — community reviewed, expert verified, on-chain proven.
            </p>
          </div>
          <Link
            href="/submit"
            className="group shrink-0 overflow-hidden rounded-xl bg-gradient-to-r from-[#e8c36a] to-[#c9a44e] px-5 py-2.5 text-[13px] font-semibold text-black transition hover:shadow-[0_0_20px_rgba(232,195,106,0.2)]"
          >
            Submit artifact
            <span className="ml-1.5 inline-block transition-transform group-hover:translate-x-0.5">→</span>
          </Link>
        </div>

        {/* Proposals CTA */}
        {user && (
          <Link
            href="/proposals"
            className="mt-6 flex items-center justify-between rounded-2xl bg-yellow-500/[0.04] px-5 py-3.5 ring-1 ring-yellow-500/10 transition hover:bg-yellow-500/[0.06] hover:ring-yellow-500/15"
          >
            <div className="flex items-center gap-3">
              <span className="text-[16px]">🗳</span>
              <div>
                <div className="text-[12px] font-medium text-yellow-400/80">Active proposals need your vote</div>
                <div className="text-[11px] text-white/25">Help curate the archive — review and vote on pending submissions</div>
              </div>
            </div>
            <span className="shrink-0 text-[11px] font-medium text-yellow-400/50">View proposals →</span>
          </Link>
        )}

        {/* Search */}
        <div className="mt-8">
          <div className="relative flex items-center rounded-2xl bg-white/[0.025] ring-1 ring-white/[0.06] transition-all focus-within:ring-[#e8c36a]/20 focus-within:bg-white/[0.035]">
            <span className="pl-4 text-white/20">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" strokeLinecap="round" />
              </svg>
            </span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title, description, or tag…"
              className="w-full bg-transparent px-3 py-3.5 text-[13px] text-white/80 outline-none placeholder:text-white/20"
            />
            {query && (
              <button onClick={() => setQuery("")} className="pr-4 text-[11px] text-white/25 transition hover:text-white/50">
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-[300px] animate-pulse rounded-2xl bg-white/[0.025] ring-1 ring-white/[0.04]" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="mt-24 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/[0.03] ring-1 ring-white/[0.06]">
              <span className="text-2xl opacity-40">🔍</span>
            </div>
            <div className="mt-5 text-[13px] text-white/35">
              {query ? `No results for "${query}"` : "No verified artifacts yet."}
            </div>
            <Link
              href="/submit"
              className="mt-5 inline-flex rounded-xl bg-white/5 px-5 py-2.5 text-[12px] font-medium text-white/70 ring-1 ring-white/8 transition hover:bg-white/8"
            >
              Be the first to submit
            </Link>
          </div>
        ) : (
          <>
            <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((a) => (
                <ArtifactCard key={a.id} artifact={a} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-10 flex items-center justify-center gap-3">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="rounded-xl bg-white/[0.03] px-4 py-2 text-[12px] text-white/40 ring-1 ring-white/6 transition hover:bg-white/[0.06] hover:text-white/60 disabled:opacity-25"
                >
                  ← Previous
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
                    const p = i + 1;
                    return (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`h-8 w-8 rounded-lg text-[12px] font-medium transition ${
                          page === p
                            ? "bg-[#e8c36a]/10 text-[#e8c36a] ring-1 ring-[#e8c36a]/20"
                            : "text-white/30 hover:bg-white/5 hover:text-white/50"
                        }`}
                      >
                        {p}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page >= totalPages}
                  className="rounded-xl bg-white/[0.03] px-4 py-2 text-[12px] text-white/40 ring-1 ring-white/6 transition hover:bg-white/[0.06] hover:text-white/60 disabled:opacity-25"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense>
      <ExploreInner />
    </Suspense>
  );
}

/* ─── Artifact Card ─── */

const TYPE_GRADIENTS: Record<string, string> = {
  image: "linear-gradient(135deg, rgba(232,195,106,0.14), rgba(180,90,50,0.06))",
  audio: "linear-gradient(135deg, rgba(120,160,255,0.10), rgba(170,120,230,0.05))",
  video: "linear-gradient(135deg, rgba(240,90,90,0.10), rgba(210,120,70,0.05))",
  document: "linear-gradient(135deg, rgba(100,210,160,0.08), rgba(80,170,130,0.04))",
};

const TYPE_ICONS: Record<string, string> = {
  image: "🖼", audio: "🎵", video: "🎬", document: "📄",
};

function ArtifactCard({ artifact: a }: { artifact: any }) {
  return (
    <Link
      href={`/artifact/${a.id}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl bg-white/[0.02] ring-1 ring-white/[0.05] transition-all duration-300 hover:-translate-y-1 hover:ring-[#e8c36a]/15 hover:shadow-[0_8px_32px_rgba(232,195,106,0.06)]"
    >
      {/* Type + proof badges */}
      <div className="absolute right-3 top-3 z-10 flex items-center gap-1.5">
        {a.chainTxHash && (
          <span className="rounded-full bg-[#e8c36a]/10 px-2 py-0.5 text-[9px] font-medium text-[#e8c36a]/70 ring-1 ring-[#e8c36a]/15 backdrop-blur-sm">
            ◆ On-chain
          </span>
        )}
        <span className="rounded-full bg-black/50 px-2.5 py-0.5 text-[10px] font-medium text-white/60 backdrop-blur-sm ring-1 ring-white/8">
          {a.type}
        </span>
      </div>

      {/* Header with gradient */}
      <div className="relative h-40 overflow-hidden">
        <div className="absolute inset-0" style={{ background: TYPE_GRADIENTS[a.type] ?? TYPE_GRADIENTS.document }} />

        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)", backgroundSize: "40px 40px" }}
        />

        {/* Type icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-4xl opacity-[0.12] transition-transform duration-500 group-hover:scale-110">
            {TYPE_ICONS[a.type] ?? "📄"}
          </span>
        </div>

        {/* Image preview if available */}
        {a.fileUrl && a.type === "image" && (
          <img
            src={a.fileUrl}
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-30 transition-opacity duration-500 group-hover:opacity-40"
          />
        )}

        {/* Bottom fade */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#050407]" />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col px-5 pb-5 pt-1">
        <h3 className="text-[14px] font-semibold leading-snug text-[#f0ede6] line-clamp-2 transition-colors group-hover:text-[#e8c36a]/90">
          {a.title}
        </h3>
        <p className="mt-1.5 text-[12px] leading-relaxed text-white/30 line-clamp-2">{a.description}</p>

        {/* Tags */}
        {a.tags?.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {a.tags.slice(0, 4).map((t: string) => (
              <span key={t} className="rounded-full bg-white/[0.03] px-2 py-0.5 text-[10px] text-white/30 ring-1 ring-white/[0.05]">
                {t}
              </span>
            ))}
            {a.tags.length > 4 && (
              <span className="rounded-full px-2 py-0.5 text-[10px] text-white/20">
                +{a.tags.length - 4}
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/[0.03]">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-wider text-white/20">{a.language}</span>
            {a.license && (
              <>
                <span className="text-white/10">·</span>
                <span className="text-[10px] text-white/20">{a.license}</span>
              </>
            )}
          </div>
          <span className="text-[10px] font-medium text-white/20 transition-all group-hover:text-[#e8c36a]/60 group-hover:translate-x-0.5">
            View →
          </span>
        </div>
      </div>
    </Link>
  );
}