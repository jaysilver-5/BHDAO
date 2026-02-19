export default function CollectionRail() {
  return (
    <aside className="hidden md:block md:col-span-3">
      <div className="sticky top-24">
        <div className="rounded-3xl bg-white/5 p-6 backdrop-blur">
          <div className="text-xs uppercase tracking-[0.18em] text-white/55">
            Collection
          </div>

          <div className="mt-3 text-xl font-semibold text-white">
            Black History Archive
          </div>

          <div className="mt-2 text-sm leading-relaxed text-white/70">
            Verified artifacts and records, preserved with provenance.
          </div>

          <div className="mt-6 space-y-3">
            <Pill k="Scope" v="Global diaspora" />
            <Pill k="Status" v="Approved only" />
            <Pill k="Storage" v="IPFS + backup" />
          </div>

          <div className="mt-7 h-px w-full bg-white/10" />

          <div className="mt-6">
            <div className="text-xs uppercase tracking-[0.18em] text-white/55">
              Curated trails
            </div>

            <div className="mt-3 flex flex-col gap-2">
              <Trail href="/search?q=civil%20rights" label="Civil Rights" />
              <Trail href="/search?q=harlem%20renaissance" label="Harlem Renaissance" />
              <Trail href="/search?q=inventors" label="Inventors" />
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}

function Pill({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-black/20 px-4 py-3">
      <div className="text-xs text-white/60">{k}</div>
      <div className="text-sm font-semibold text-white/90">{v}</div>
    </div>
  )
}

function Trail({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      className="rounded-2xl bg-black/15 px-4 py-3 text-sm font-semibold text-white/80 hover:bg-black/25 hover:text-white transition"
    >
      {label} →
    </a>
  )
}
