export function Sections() {
  return (
    <>
      <TrustAndProvenance />
      <FeaturedPreview />
      <HowItWorks />
      <GovernanceAndRoles />
      <FinalCTA />
      <Footer />
    </>
  );
}

/* ════════════════════════════════════════════ */

function TrustAndProvenance() {
  return (
    <Section bg="radial-gradient(1000px 600px at 18% 25%, rgba(232,195,106,0.09), transparent 60%), radial-gradient(900px 600px at 82% 65%, rgba(180,90,50,0.07), transparent 60%)">
      <div className="grid gap-12 md:grid-cols-12 md:gap-16">
        <div className="md:col-span-5">
          <Badge color="gold" label="Trust you can inspect" />
          <h3 className="mt-6 text-3xl font-semibold tracking-tight text-white sm:text-[2.5rem] sm:leading-[1.1]">
            Every result comes with provenance,
            <span className="text-white/60"> not vibes.</span>
          </h3>
          <p className="mt-4 text-[15px] leading-relaxed text-white/50">
            The archive shows where an artifact came from, how it was approved, and what changed over time.
            If something is wrong, the community can flag it for review.
          </p>
          <div className="mt-7 flex flex-col gap-2.5 sm:flex-row">
            <a href="/explore" className="btn-primary">Explore archive →</a>
            <a href="/submit" className="btn-secondary">Submit artifact</a>
          </div>
        </div>

        <div className="md:col-span-7">
          <div className="grid gap-3 sm:grid-cols-2">
            <MetricCard k="Status" v="Approved · Pending · Flagged" note="Visibility tied to review status" />
            <MetricCard k="Storage" v="IPFS CID + Cloudinary" note="CID shown beside each artifact" />
            <MetricCard k="Submitter" v="Wallet address" note="Public provenance, not anonymous" />
            <MetricCard k="Audit trail" v="Votes + timestamps" note="Every action is recorded" />
          </div>

          {/* Provenance preview */}
          <div className="mt-4 rounded-2xl bg-white/3 p-6 ring-1 ring-white/5">
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-semibold text-white">Provenance preview</span>
              <span className="rounded-full bg-white/6 px-2.5 py-0.5 text-[10px] text-white/50 ring-1 ring-white/6">example</span>
            </div>
            <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
              <MiniField label="Title" value="March on Washington speech photo" />
              <MiniField label="Tags" value="civil-rights, speeches, 1963" />
              <MiniField label="IPFS CID" value="bafybeig...x2kq" />
              <MiniField label="Chain proof" value="Paseo tx 0x8b…42f" />
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ════════════════════════════════════════════ */

function FeaturedPreview() {
  const cards = [
    {
      img: "https://upload.wikimedia.org/wikipedia/commons/8/81/Martin_Luther_King_-_March_on_Washington.jpg",
      title: "March on Washington (1963)",
      desc: "A defining moment in the civil rights movement. Media, provenance, and proposal history.",
      tags: ["civil-rights", "speeches", "1963"],
    },
    {
      img: "https://upload.wikimedia.org/wikipedia/commons/e/ed/First_Tuskeegee_Class.jpg",
      title: "Tuskegee Airmen",
      desc: "Records tied to the first Black military aviators in the U.S. armed forces.",
      tags: ["aviation", "WWII", "military"],
    },
    {
      img: "https://upload.wikimedia.org/wikipedia/commons/6/68/Ss-booker-t-washington-1943.jpg",
      title: "SS Booker T. Washington (1943)",
      desc: "Historic ship and crew documentation with a public audit trail.",
      tags: ["maritime", "1943", "industry"],
    },
  ];

  return (
    <Section bg="radial-gradient(1000px 600px at 20% 20%, rgba(180,90,50,0.06), transparent 60%), radial-gradient(1000px 600px at 80% 80%, rgba(232,195,106,0.06), transparent 60%)">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <Badge color="burnt" label="Featured preview" />
          <h3 className="mt-6 text-3xl font-semibold tracking-tight text-white sm:text-[2.5rem] sm:leading-[1.1]">
            What search results feel like.
          </h3>
          <p className="mt-3 text-[15px] leading-relaxed text-white/50">
            Fast scan. Strong context. Provenance always visible. Click through for full detail.
          </p>
        </div>
        <a href="/explore" className="btn-secondary shrink-0">Go to search</a>
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {cards.map((c) => (
          <a
            key={c.title}
            href="/item/demo"
            className="group relative overflow-hidden rounded-2xl bg-white/3 ring-1 ring-white/5 transition hover:-translate-y-0.5 hover:ring-white/10"
          >
            <div className="relative aspect-[4/3]">
              <img src={c.img} alt={c.title} className="h-full w-full object-cover" referrerPolicy="no-referrer" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050407] via-[#050407]/30 to-transparent" />
            </div>
            <div className="p-5">
              <div className="text-[13px] font-semibold text-white">{c.title}</div>
              <div className="mt-1.5 text-[12px] leading-relaxed text-white/45">{c.desc}</div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {c.tags.map((t) => (
                  <span key={t} className="rounded-full bg-white/5 px-2.5 py-0.5 text-[10px] text-white/50 ring-1 ring-white/6">{t}</span>
                ))}
              </div>
              <div className="mt-4 text-[11px] font-medium text-white/40 transition group-hover:text-white/70">
                View artifact →
              </div>
            </div>
          </a>
        ))}
      </div>

      <div className="mt-8 rounded-2xl bg-white/3 p-5 ring-1 ring-white/5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-[13px] font-semibold text-white">Search indexing</div>
            <div className="mt-1 text-[12px] text-white/40">Title, description, tags, and language — with relevance scoring to follow.</div>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {["title", "description", "tags", "language"].map((f) => (
              <span key={f} className="rounded-full bg-white/5 px-2.5 py-0.5 text-[10px] text-white/50 ring-1 ring-white/6">{f}</span>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ════════════════════════════════════════════ */

function HowItWorks() {
  const steps = [
    { n: "01", title: "Connect wallet", body: "MetaMask connects. Your wallet becomes your identity in the archive." },
    { n: "02", title: "Submit artifact", body: "Title, description, tags, type, language, and optional file upload." },
    { n: "03", title: "Community review", body: "Members vote during a 7-day window. Reaching threshold moves it to expert review." },
    { n: "04", title: "Expert verification", body: "Experts approve or reject. Approval triggers IPFS pinning and on-chain anchoring." },
    { n: "05", title: "Published forever", body: "Artifact appears in search with provenance, IPFS CID, and blockchain proof." },
  ];

  return (
    <Section bg="radial-gradient(1000px 600px at 18% 20%, rgba(232,195,106,0.08), transparent 60%), radial-gradient(1000px 600px at 82% 70%, rgba(180,90,50,0.07), transparent 60%)">
      <div className="grid gap-12 md:grid-cols-12 md:gap-16">
        <div className="md:col-span-5">
          <Badge color="gold" label="How it works" />
          <h3 className="mt-6 text-3xl font-semibold tracking-tight text-white sm:text-[2.5rem] sm:leading-[1.1]">
            Proposals in,
            <span className="text-white/60"> verified history out.</span>
          </h3>
          <p className="mt-4 text-[15px] leading-relaxed text-white/50">
            A tight loop: submit, community review, expert verification, publish.
            Designed to grow fast while staying defensible.
          </p>
          <div className="mt-7 flex flex-col gap-2.5 sm:flex-row">
            <a href="/how-it-works" className="btn-secondary">Read full flow</a>
            <a href="/explore" className="btn-primary">Create proposal →</a>
          </div>
        </div>

        <div className="md:col-span-7">
          <div className="space-y-3">
            {steps.map((s, i) => (
              <div key={s.n} className="flex gap-4 rounded-2xl bg-white/3 p-4 ring-1 ring-white/5">
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/6 text-[11px] font-black text-white/70 ring-1 ring-white/8">
                  {s.n}
                </div>
                <div>
                  <div className="text-[13px] font-semibold text-white">{s.title}</div>
                  <div className="mt-1 text-[12px] leading-relaxed text-white/45">{s.body}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ════════════════════════════════════════════ */

function GovernanceAndRoles() {
  const roles = [
    { title: "Contributor", body: "Submits artifacts through proposals. More approvals build reputation." },
    { title: "Member", body: "Searches the archive, votes on proposals, and can flag questionable entries." },
    { title: "Expert", body: "Verified by the DAO. Reviews artifacts and triggers on-chain verification." },
    { title: "Admin", body: "Manages roles, oversees the archive, and can manually trigger pinning or anchoring." },
  ];

  return (
    <Section bg="radial-gradient(1000px 600px at 20% 20%, rgba(180,90,50,0.06), transparent 60%), radial-gradient(1000px 600px at 80% 75%, rgba(232,195,106,0.06), transparent 60%)">
      <div className="grid gap-12 md:grid-cols-12 md:gap-16">
        <div className="md:col-span-5">
          <Badge color="burnt" label="Governance & roles" />
          <h3 className="mt-6 text-3xl font-semibold tracking-tight text-white sm:text-[2.5rem] sm:leading-[1.1]">
            The archive is public.
            <span className="text-white/60"> The power is distributed.</span>
          </h3>
          <p className="mt-4 text-[15px] leading-relaxed text-white/50">
            Contributors submit. Members vote. Experts verify.
            No single gatekeeper controls what enters the archive.
          </p>
        </div>

        <div className="md:col-span-7">
          <div className="grid gap-3 sm:grid-cols-2">
            {roles.map((r) => (
              <div key={r.title} className="rounded-2xl bg-white/3 p-5 ring-1 ring-white/5">
                <div className="text-[13px] font-semibold text-white">{r.title}</div>
                <div className="mt-2 text-[12px] leading-relaxed text-white/45">{r.body}</div>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-2xl bg-white/3 p-5 ring-1 ring-white/5">
            <div className="text-[13px] font-semibold text-white">MVP focus</div>
            <div className="mt-2 text-[12px] leading-relaxed text-white/45">
              Governance is lightweight for now: proposal creation, community voting, expert review, and flag resolution.
              Token-weighted governance comes later.
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ════════════════════════════════════════════ */

function FinalCTA() {
  return (
    <Section bg="radial-gradient(1200px 700px at 30% 20%, rgba(232,195,106,0.12), transparent 60%), radial-gradient(1200px 700px at 75% 75%, rgba(180,90,50,0.10), transparent 60%)">
      <div className="rounded-2xl bg-white/4 p-8 ring-1 ring-white/6 sm:p-12">
        <div className="pointer-events-none absolute inset-0 rounded-2xl bg-[radial-gradient(800px_400px_at_20%_20%,rgba(232,195,106,0.08),transparent_55%)]" />
        <div className="relative grid gap-8 md:grid-cols-12 md:items-center">
          <div className="md:col-span-7">
            <h4 className="text-3xl font-semibold tracking-tight text-white sm:text-[2.5rem] sm:leading-[1.1]">
              Help preserve history that deserves to be permanent.
            </h4>
            <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-white/50">
              Explore the archive, contribute new artifacts, or help verify the stories that shape our shared history.
            </p>
          </div>
          <div className="md:col-span-5">
            <div className="flex flex-col gap-2.5">
              <a href="/proposals/new" className="btn-primary text-center">Submit an artifact →</a>
              <a href="/search" className="btn-secondary text-center">Explore archive</a>
              <a href="/how-it-works" className="inline-flex items-center justify-center py-2.5 text-[13px] font-medium text-white/40 transition hover:text-white/70">
                How it works
              </a>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ════════════════════════════════════════════ */

function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#030305]">
      <div className="container-page py-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-white/6 text-[11px] font-black text-white/70 ring-1 ring-white/8">
              BH
            </div>
            <div className="leading-tight">
              <div className="text-[13px] font-semibold text-white">BHDao</div>
              <div className="text-[10px] text-white/40">Black History DAO</div>
            </div>
          </div>
          <div className="flex flex-wrap gap-5 text-[12px] text-white/35">
            <a className="transition hover:text-white/70" href="/how-it-works">How it works</a>
            <a className="transition hover:text-white/70" href="/search">Search</a>
            <a className="transition hover:text-white/70" href="/proposals/new">Submit</a>
          </div>
        </div>
        <div className="mt-8 h-px bg-white/6" />
        <div className="mt-5 text-[11px] text-white/25">
          © {new Date().getFullYear()} Black History DAO. Built for provenance, public access, and long-term preservation.
        </div>
      </div>
    </footer>
  );
}

/* ════════════════════ SHARED ════════════════════ */

function Section({ children, bg }: { children: React.ReactNode; bg: string }) {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[#050407]" />
      <div className="absolute inset-0" style={{ background: bg }} />
      <div className="container-page relative py-20 sm:py-28">{children}</div>
    </section>
  );
}

function Badge({ color, label }: { color: "gold" | "burnt"; label: string }) {
  const dot = color === "gold" ? "bg-[#e8c36a]" : "bg-[#c86b3c]";
  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-white/6 px-3.5 py-1.5 ring-1 ring-white/8">
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
      <span className="text-[11px] font-medium tracking-wide text-white/70">{label}</span>
    </div>
  );
}

function MetricCard({ k, v, note }: { k: string; v: string; note: string }) {
  return (
    <div className="rounded-2xl bg-white/3 p-5 ring-1 ring-white/5">
      <div className="text-[10px] font-medium uppercase tracking-widest text-white/30">{k}</div>
      <div className="mt-1.5 text-sm font-semibold text-white/80">{v}</div>
      <div className="mt-1.5 text-[11px] leading-relaxed text-white/40">{note}</div>
    </div>
  );
}

function MiniField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white/3 p-3 ring-1 ring-white/5">
      <div className="text-[10px] font-medium uppercase tracking-widest text-white/30">{label}</div>
      <div className="mt-1 text-[12px] font-medium text-white/70">{value}</div>
    </div>
  );
}
