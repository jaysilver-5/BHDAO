export default function SecondSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Continuation background: warm, alive, not blocky */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(1100px 620px at 15% 15%, rgba(232,195,106,0.18), transparent 62%)," +
              "radial-gradient(950px 680px at 88% 70%, rgba(200,107,60,0.16), transparent 62%)," +
              "linear-gradient(to bottom, rgba(0,0,0,0.62), rgba(0,0,0,0.78))",
          }}
        />
      </div>

      <div className="container-page relative py-14 sm:py-18">
        {/* Section header: short, spark, no boring spec text */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs text-white/85">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--burnt)]" />
              What we are building
            </div>

            <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              A living archive the world can search,
              <span className="text-white/85"> and the community can defend.</span>
            </h2>

            <p className="mt-3 text-pretty text-base leading-relaxed text-white/78 sm:text-lg">
              Not another timeline. Not another blog. This is history with receipts: submissions, reviews, provenance,
              and disputes, all visible.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/80">Searchable</span>
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/80">Verified</span>
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/80">Provenance</span>
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/80">Disputes</span>
          </div>
        </div>

        {/* Main layout: airy, editorial, not "cards everywhere" */}
        <div className="mt-10 grid gap-8 md:grid-cols-12 md:gap-10">
          {/* Left: editorial copy + thin feature rows */}
          <div className="md:col-span-6">
            <div className="space-y-5">
              <FeatureRow
                title="Search first, not buried in menus"
                body="Type a name, place, event, or tag. Results show media, context, and provenance at a glance."
              />
              <FeatureRow
                title="Community review decides what becomes part of the archive"
                body="Artifacts arrive as proposals. Validators vote. Approved items become public, rejected ones cool down."
              />
              <FeatureRow
                title="Disputes keep it clean"
                body="Members can flag misinformation or copyright issues. If a dispute is upheld, the item is hidden from public view."
              />
            </div>

            {/* Small spark CTA block */}
            <div className="mt-8 rounded-2xl bg-white/5 p-5 backdrop-blur">
              <div className="text-sm font-semibold text-white">
                The vibe we want
              </div>
              <p className="mt-2 text-sm leading-relaxed text-white/70">
                People discover something, add context, verify it, and link it to more history. The archive grows fast, but stays trusted.
              </p>

              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <a
                  href="/how-it-works"
                  className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/5 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/10"
                >
                  See the flow
                </a>
                <a
                  href="/proposals/new"
                  className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black shadow-[0_18px_55px_rgba(0,0,0,0.45)] transition hover:-translate-y-0.5"
                >
                  Submit an artifact →
                </a>
              </div>
            </div>
          </div>

          {/* Right: elegant "MVP demo" timeline, not blocky cards */}
          <div className="md:col-span-6">
            <div className="relative rounded-3xl bg-white/5 p-6 backdrop-blur">
              {/* soft warm highlight */}
              <div className="pointer-events-none absolute inset-0 rounded-3xl bg-[radial-gradient(900px_520px_at_20%_15%,rgba(232,195,106,0.12),transparent_55%)]" />

              <div className="relative">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold text-white">MVP demo path</div>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/80">
                    proposals → review → search
                  </span>
                </div>

                <div className="mt-6 space-y-5">
                  <TimelineStep
                    n="01"
                    title="Submit a proposal"
                    body="Upload a file and add title, description, tags, type, language, date. Wallet address is captured."
                  />
                  <TimelineStep
                    n="02"
                    title="Validators review"
                    body="A review window. Votes approve or reject. Rejections trigger a short cooldown before resubmission."
                  />
                  <TimelineStep
                    n="03"
                    title="Published with provenance"
                    body="Approved items appear in search. Users can view details, storage reference, and proposal history."
                  />
                  <TimelineStep
                    n="04"
                    title="Dispute if needed"
                    body="Members can dispute misinformation or rights issues. If upheld, the entry is hidden from public view."
                  />
                </div>

                {/* Trust bullets: minimal and classy */}
                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  <TrustPill k="Status" v="Approved, Pending, Disputed" />
                  <TrustPill k="Storage" v="IPFS CID + backup" />
                  <TrustPill k="Provenance" v="Wallet + timestamps" />
                  <TrustPill k="Audit trail" v="Votes + history" />
                </div>
              </div>
            </div>

            {/* subtle divider line to keep flow */}
            <div className="mt-8 h-px w-full bg-gradient-to-r from-transparent via-white/12 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}

function FeatureRow({ title, body }: { title: string; body: string }) {
  return (
    <div className="flex gap-4 rounded-2xl bg-black/20 p-4">
      <div className="mt-1 h-2.5 w-2.5 flex-none rounded-full bg-[var(--gold)]" />
      <div>
        <div className="text-sm font-semibold text-white">{title}</div>
        <div className="mt-1 text-sm leading-relaxed text-white/70">{body}</div>
      </div>
    </div>
  );
}

function TimelineStep({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <div className="relative pl-10">
      <div className="absolute left-0 top-0">
        <div
          className="grid h-8 w-8 place-items-center rounded-2xl bg-white/12 text-xs font-black text-white"
          style={{ boxShadow: "0 0 0 1px rgba(232,195,106,0.18), 0 0 30px rgba(200,107,60,0.10)" }}
        >
          {n}
        </div>
      </div>

      <div className="rounded-2xl bg-black/20 p-4">
        <div className="text-sm font-semibold text-white">{title}</div>
        <div className="mt-1 text-sm leading-relaxed text-white/70">{body}</div>
      </div>

      <div className="pointer-events-none absolute left-3 top-9 bottom-[-18px] w-px bg-gradient-to-b from-white/18 to-transparent" />
    </div>
  );
}

function TrustPill({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-2xl bg-black/15 p-4">
      <div className="text-xs text-white/60">{k}</div>
      <div className="mt-1 text-sm font-semibold text-white/90">{v}</div>
    </div>
  );
}
