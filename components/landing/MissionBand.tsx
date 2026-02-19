export default function MissionBand() {
  return (
    <section className="relative overflow-hidden bg-black/60">
      {/* Keep background language consistent with hero */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(900px_500px_at_15%_20%,rgba(255,255,255,0.06),transparent_60%),radial-gradient(900px_600px_at_85%_70%,rgba(255,255,255,0.05),transparent_55%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/60" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 py-14 md:py-20">
        <div className="grid gap-10 md:grid-cols-12 md:gap-12">
          <div className="md:col-span-5">
            <h2 className="text-2xl font-semibold tracking-tight text-white md:text-3xl">
              What the MVP proves
            </h2>
            <p className="mt-4 text-white/75 leading-relaxed">
              A public search engine where anyone can discover artifacts and information submitted by contributors,
              approved by community review, stored with IPFS, and anchored on-chain for integrity.
            </p>

            <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
              <div className="text-sm font-semibold text-white">MVP routes we are building next</div>
              <ul className="mt-3 space-y-2 text-sm text-white/75">
                <li><span className="text-white/90 font-medium">/</span> Landing (what this is, why it matters)</li>
                <li><span className="text-white/90 font-medium">/search</span> Search input + results</li>
                <li><span className="text-white/90 font-medium">/item/[id]</span> Artifact details + provenance</li>
                <li><span className="text-white/90 font-medium">/proposals/new</span> Submit artifact (wallet connect)</li>
                <li><span className="text-white/90 font-medium">/dispute/new?item=</span> Dispute form (wallet connect)</li>
                <li><span className="text-white/90 font-medium">/how-it-works</span> Simple flow explanation</li>
              </ul>
            </div>
          </div>

          <div className="md:col-span-7">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur md:p-8">
              <div className="flex flex-col gap-4">
                <FlowRow n="1" title="Connect wallet" desc="Contributor connects with MetaMask, we capture address for proposals." />
                <FlowRow n="2" title="Create proposal" desc="Title, description, tags, type, language, date, and file upload." />
                <FlowRow n="3" title="Review window" desc="Test reviewers vote yes/no. If no, cooldown blocks resubmission for 7 days." />
                <FlowRow n="4" title="Anchor + store" desc="Approved proposals store metadata on-chain and file in IPFS (plus backup storage)." />
                <FlowRow n="5" title="Search and dispute" desc="Users search title, description, tags. Members can dispute with reasons." />
              </div>

              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                <Callout title="Search relevance" body="We index title, description, tags first. Later we add better ranking and filters." />
                <Callout title="Trust signals" body="We show on-chain reference, uploader address, and proposal status in the UI." />
              </div>

              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href="/how-it-works"
                  className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Read the flow
                </a>
                <a
                  href="/search"
                  className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-black transition hover:-translate-y-0.5"
                >
                  Try search
                </a>
              </div>
            </div>

            {/* tiny aesthetic footer note */}
            <p className="mt-4 text-xs text-white/50">
              This layout is intentionally bold and “product-like”, so it looks like progress even before the full chain integration is done.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function FlowRow({ n, title, desc }: { n: string; title: string; desc: string }) {
  return (
    <div className="flex gap-4 rounded-2xl border border-white/10 bg-black/20 p-4">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-sm font-black text-black">
        {n}
      </div>
      <div>
        <div className="text-sm font-semibold text-white">{title}</div>
        <div className="mt-1 text-sm text-white/70 leading-relaxed">{desc}</div>
      </div>
    </div>
  );
}

function Callout({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/15 p-4">
      <div className="text-sm font-semibold text-white">{title}</div>
      <div className="mt-1 text-sm text-white/70 leading-relaxed">{body}</div>
    </div>
  );
}
