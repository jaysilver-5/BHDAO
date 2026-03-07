export default function WhatWeBuild() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[#050407]" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(1000px 600px at 15% 20%, rgba(232,195,106,0.10), transparent 60%)," +
            "radial-gradient(900px 600px at 85% 70%, rgba(180,90,50,0.08), transparent 60%)",
        }}
      />

      <div className="container-page relative py-20 sm:py-28">
        <div className="grid gap-12 md:grid-cols-12 md:gap-16">
          {/* Left intro */}
          <div className="md:col-span-5">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/6 px-3.5 py-1.5 ring-1 ring-white/8">
              <span className="h-1.5 w-1.5 rounded-full bg-[#c86b3c]" />
              <span className="text-[11px] font-medium tracking-wide text-white/70">What we're building</span>
            </div>

            <h2 className="mt-6 text-3xl font-semibold tracking-tight text-white sm:text-[2.5rem] sm:leading-[1.1]">
              A living archive the world can search,
              <span className="text-white/60"> and the community defends.</span>
            </h2>

            <p className="mt-4 text-[15px] leading-relaxed text-white/50">
              Not another timeline. Not another blog. This is history with receipts —
              submissions, reviews, provenance, and accountability, all visible.
            </p>

            <div className="mt-8 space-y-1">
              {["Searchable", "Verified", "Provenance-tracked", "Community-governed"].map((t) => (
                <div key={t} className="flex items-center gap-2.5 py-1.5">
                  <div className="h-1 w-1 rounded-full bg-[#e8c36a]/60" />
                  <span className="text-[13px] text-white/60">{t}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right features */}
          <div className="md:col-span-7">
            <div className="space-y-4">
              <Feature
                title="Search first, not buried in menus"
                body="Type a name, place, event, or tag. Results show media, context, and full provenance at a glance."
              />
              <Feature
                title="Community review decides what enters the archive"
                body="Artifacts arrive as proposals. Members vote during a 7-day window. Approved items go to expert review, then become public."
              />
              <Feature
                title="Experts verify with on-chain proof"
                body="Expert approval triggers IPFS pinning and blockchain anchoring. The artifact becomes permanent and tamper-proof."
              />
              <Feature
                title="Flags keep it honest"
                body="Members can flag misinformation or copyright issues. Flagged items are reviewed and hidden if the concern is upheld."
              />
            </div>

            {/* CTA card */}
            <div className="mt-8 rounded-2xl bg-white/4 p-6 ring-1 ring-white/6">
              <p className="text-sm leading-relaxed text-white/50">
                People discover something, add context, verify it, and link it to more history.
                The archive grows fast, but stays trusted.
              </p>
              <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
                <a
                  href="/how-it-works"
                  className="inline-flex items-center justify-center rounded-xl bg-white/6 px-5 py-2.5 text-[13px] font-medium text-white ring-1 ring-white/10 transition hover:bg-white/10"
                >
                  See the flow
                </a>
                <a
                  href="/submit"
                  className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-2.5 text-[13px] font-semibold text-black transition hover:bg-white/90"
                >
                  Submit an artifact →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Feature({ title, body }: { title: string; body: string }) {
  return (
    <div className="group rounded-2xl bg-white/3 p-5 ring-1 ring-white/5 transition hover:bg-white/5 hover:ring-white/8">
      <div className="text-[13px] font-semibold text-white">{title}</div>
      <div className="mt-1.5 text-[13px] leading-relaxed text-white/45">{body}</div>
    </div>
  );
}
