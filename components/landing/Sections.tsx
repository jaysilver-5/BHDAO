// components/landing/Sections.tsx
// Drop these sections under your Hero + SecondSection.
// Routes referenced match your MVP flow: /search, /item/[id], /proposals/new, /dispute/new, /how-it-works

export function Sections() {
  return (
    <>
      <TrustAndProvenance />
      <FeaturedPreview />
      <HowItWorksCompact />
      <GovernanceAndRoles />
      <FinalCTA />
      <Footer />
    </>
  );
}

function TrustAndProvenance() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(1100px 620px at 18% 20%, rgba(232,195,106,0.14), transparent 62%)," +
              "radial-gradient(900px 620px at 85% 65%, rgba(200,107,60,0.12), transparent 62%)," +
              "linear-gradient(to bottom, rgba(0,0,0,0.78), rgba(0,0,0,0.84))",
          }}
        />
      </div>

      <div className="container-page relative py-14 sm:py-18">
        <div className="grid gap-10 md:grid-cols-12 md:gap-12">
          <div className="md:col-span-5">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs text-white/85">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--gold)]" />
              Trust you can inspect
            </div>

            <h3 className="mt-4 text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Every result comes with provenance,
              <span className="text-white/85"> not vibes.</span>
            </h3>

            <p className="mt-3 text-pretty text-base leading-relaxed text-white/78 sm:text-lg">
              The archive shows where an artifact came from, how it was approved, and what changed over time. If
              something is wrong, the community can dispute it.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <a
                href="/search"
                className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black shadow-[0_18px_55px_rgba(0,0,0,0.45)] transition hover:-translate-y-0.5"
              >
                Explore archive →
              </a>
              <a
                href="/dispute/new"
                className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/5 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/10"
              >
                Dispute a result
              </a>
            </div>
          </div>

          <div className="md:col-span-7">
            <div className="grid gap-4 sm:grid-cols-2">
              <MetricCard
                k="Status"
                v="Approved, Pending, Disputed, Hidden"
                note="Visibility is separate from on-chain history."
              />
              <MetricCard k="Storage" v="IPFS CID + backup" note="CID is shown beside each artifact." />
              <MetricCard k="Submitter" v="Wallet address" note="Public provenance, not anonymous uploads." />
              <MetricCard k="Audit trail" v="Votes + timestamps" note="See who voted and when." />
            </div>

            <div className="mt-4 rounded-3xl bg-white/5 p-6 backdrop-blur">
              <div className="flex items-center justify-between gap-3">
                <div className="text-sm font-semibold text-white">Provenance preview</div>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/80">example</span>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <MiniLine label="Title" value="March on Washington speech photo" />
                <MiniLine label="Tags" value="civil-rights, speeches, 1963" />
                <MiniLine label="IPFS CID" value="bafybeig...x2kq" />
                <MiniLine label="Chain ref" value="0x8b…42f" />
              </div>

              <div className="mt-5 rounded-2xl bg-black/20 p-4">
                <div className="text-xs text-white/60">Why this matters</div>
                <div className="mt-1 text-sm leading-relaxed text-white/75">
                  People can disagree, but the record stays inspectable. Truth is defended by evidence and community
                  process.
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-14 h-px w-full bg-gradient-to-r from-transparent via-white/12 to-transparent" />
      </div>
    </section>
  );
}

function FeaturedPreview() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(1000px 620px at 20% 20%, rgba(200,107,60,0.10), transparent 62%)," +
              "radial-gradient(1000px 620px at 80% 80%, rgba(232,195,106,0.10), transparent 62%)," +
              "linear-gradient(to bottom, rgba(0,0,0,0.84), rgba(0,0,0,0.88))",
          }}
        />
      </div>

      <div className="container-page relative py-14 sm:py-18">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs text-white/85">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--burnt)]" />
              Featured preview
            </div>
            <h3 className="mt-4 text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              What search results will feel like.
            </h3>
            <p className="mt-3 text-pretty text-base leading-relaxed text-white/78 sm:text-lg">
              Fast scan. Strong context. Provenance always visible. Click through to the artifact page for full detail.
            </p>
          </div>

          <a
            href="/search"
            className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/5 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/10"
          >
            Go to search
          </a>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-12">
          <ResultCard
            className="md:col-span-4"
            img="https://upload.wikimedia.org/wikipedia/commons/8/81/Martin_Luther_King_-_March_on_Washington.jpg"
            title="March on Washington (1963)"
            desc="A defining moment in the civil rights movement. Media + provenance + proposal history."
            tags={["civil-rights", "speeches", "1963"]}
          />
          <ResultCard
            className="md:col-span-4"
            img="https://upload.wikimedia.org/wikipedia/commons/e/ed/First_Tuskeegee_Class.jpg"
            title="Tuskegee Airmen"
            desc="Records and artifacts tied to the first Black military aviators in the U.S. armed forces."
            tags={["aviation", "WWII", "military"]}
          />
          <ResultCard
            className="md:col-span-4"
            img="https://upload.wikimedia.org/wikipedia/commons/6/68/Ss-booker-t-washington-1943.jpg"
            title="SS Booker T. Washington (1943)"
            desc="Historic ship and crew documentation. Evidence-backed archive entry with public audit trail."
            tags={["maritime", "1943", "industry"]}
          />
        </div>

        <div className="mt-10 rounded-3xl bg-white/5 p-6 backdrop-blur">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-sm font-semibold text-white">Search indexing (MVP)</div>
              <div className="mt-1 text-sm text-white/70">
                Title, description, and tags. Then we improve relevance scoring.
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/80">title</span>
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/80">description</span>
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/80">tags</span>
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/80">language</span>
            </div>
          </div>
        </div>

        <div className="mt-14 h-px w-full bg-gradient-to-r from-transparent via-white/12 to-transparent" />
      </div>
    </section>
  );
}

function HowItWorksCompact() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(1000px 620px at 18% 20%, rgba(232,195,106,0.12), transparent 62%)," +
              "radial-gradient(1000px 620px at 82% 70%, rgba(200,107,60,0.12), transparent 62%)," +
              "linear-gradient(to bottom, rgba(0,0,0,0.88), rgba(0,0,0,0.90))",
          }}
        />
      </div>

      <div className="container-page relative py-14 sm:py-18">
        <div className="grid gap-10 md:grid-cols-12 md:gap-12">
          <div className="md:col-span-5">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs text-white/85">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--gold)]" />
              How it works
            </div>

            <h3 className="mt-4 text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Proposals in, truth out.
            </h3>

            <p className="mt-3 text-pretty text-base leading-relaxed text-white/78 sm:text-lg">
              The MVP is a tight loop: submit, review, publish, dispute. It’s designed to grow fast while staying
              defensible.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <a
                href="/how-it-works"
                className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/5 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/10"
              >
                Read full flow
              </a>
              <a
                href="/proposals/new"
                className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black shadow-[0_18px_55px_rgba(0,0,0,0.45)] transition hover:-translate-y-0.5"
              >
                Create proposal →
              </a>
            </div>
          </div>

          <div className="md:col-span-7">
            <div className="relative rounded-3xl bg-white/5 p-6 backdrop-blur">
              <div className="pointer-events-none absolute inset-0 rounded-3xl bg-[radial-gradient(900px_520px_at_20%_15%,rgba(232,195,106,0.12),transparent_55%)]" />

              <div className="relative space-y-4">
                <FlowLine n="01" title="Connect wallet" body="MetaMask connects. Wallet becomes the proposal identity." />
                <FlowLine
                  n="02"
                  title="Submit artifact"
                  body="Title, description, tags, type, language, date, and file upload."
                />
                <FlowLine
                  n="03"
                  title="Review window"
                  body="Validators vote yes or no. No means cooldown before resubmission."
                />
                <FlowLine
                  n="04"
                  title="Publish and index"
                  body="Approved items appear in search with provenance and storage references."
                />
                <FlowLine
                  n="05"
                  title="Dispute"
                  body="Members can dispute misinformation or rights issues. If upheld, item hides from public view."
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-14 h-px w-full bg-gradient-to-r from-transparent via-white/12 to-transparent" />
      </div>
    </section>
  );
}

function GovernanceAndRoles() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(1000px 620px at 20% 20%, rgba(200,107,60,0.10), transparent 62%)," +
              "radial-gradient(1000px 620px at 80% 75%, rgba(232,195,106,0.10), transparent 62%)," +
              "linear-gradient(to bottom, rgba(0,0,0,0.90), rgba(0,0,0,0.92))",
          }}
        />
      </div>

      <div className="container-page relative py-14 sm:py-18">
        <div className="grid gap-10 md:grid-cols-12 md:gap-12">
          <div className="md:col-span-5">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs text-white/85">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--burnt)]" />
              Governance and roles
            </div>

            <h3 className="mt-4 text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              The archive is public.
              <span className="text-white/85"> The power is decentralized.</span>
            </h3>

            <p className="mt-3 text-pretty text-base leading-relaxed text-white/78 sm:text-lg">
              Contributors submit. Validators review. Members can dispute. Experts exist to keep quality high, without
              turning the archive into a gated institution.
            </p>
          </div>

          <div className="md:col-span-7">
            <div className="grid gap-4 sm:grid-cols-2">
              <RoleCard
                title="Contributor"
                body="Submits new artifacts and records through proposals. More approved contributions build reputation."
              />
              <RoleCard
                title="Member"
                body="Searches the archive, votes on governance decisions, and can dispute questionable entries."
              />
              <RoleCard
                title="Expert"
                body="KYC approved by DAO council. Helps validate content and raises quality standards."
              />
              <RoleCard
                title="Validator"
                body="Votes on proposals within the review window. Approves what becomes public and searchable."
              />
            </div>

            <div className="mt-4 rounded-3xl bg-white/5 p-6 backdrop-blur">
              <div className="text-sm font-semibold text-white">MVP focus</div>
              <div className="mt-2 text-sm leading-relaxed text-white/70">
                We keep governance light in the demo: proposal creation, voting simulation, publishing to search, and
                dispute flow.
              </div>
            </div>
          </div>
        </div>

        <div className="mt-14 h-px w-full bg-gradient-to-r from-transparent via-white/12 to-transparent" />
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(1200px 700px at 30% 20%, rgba(232,195,106,0.20), transparent 62%)," +
              "radial-gradient(1200px 700px at 75% 75%, rgba(200,107,60,0.18), transparent 62%)," +
              "linear-gradient(to bottom, rgba(0,0,0,0.92), rgba(0,0,0,0.96))",
          }}
        />
      </div>

      <div className="container-page relative py-16 sm:py-20">
        <div className="relative rounded-3xl bg-white/5 p-8 backdrop-blur sm:p-10">
          <div className="pointer-events-none absolute inset-0 rounded-3xl bg-[radial-gradient(900px_520px_at_20%_15%,rgba(232,195,106,0.14),transparent_55%)]" />

          <div className="relative grid gap-8 md:grid-cols-12 md:items-center">
            <div className="md:col-span-7">
                <h4 className="text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Help preserve history that deserves to be permanent.
                </h4>

                <p className="mt-3 max-w-xl text-pretty text-base leading-relaxed text-white/78 sm:text-lg">
                Explore the archive, contribute new artifacts, or help verify the stories that shape our shared history.
                </p>
            </div>
            <div className="md:col-span-5">
              <div className="flex flex-col gap-3">
                <a
                  href="/proposals/new"
                  className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black shadow-[0_18px_55px_rgba(0,0,0,0.45)] transition hover:-translate-y-0.5"
                >
                  Submit an artifact →
                </a>
                <a
                  href="/search"
                  className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/5 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/10"
                >
                  Explore archive
                </a>
                <a
                  href="/how-it-works"
                  className="inline-flex items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold text-white/75 transition hover:text-white"
                >
                  How it works
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="relative overflow-hidden">
      <div className="absolute inset-0 bg-black" />
      <div className="container-page relative py-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-white/10 text-sm font-black text-white">
              BH
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold text-white">BHDao</div>
              <div className="text-xs text-white/60">Black History DAO</div>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-white/70">
            <a className="hover:text-white" href="/how-it-works">
              How it works
            </a>
            <a className="hover:text-white" href="/search">
              Search
            </a>
            <a className="hover:text-white" href="/proposals/new">
              Submit
            </a>
            <a className="hover:text-white" href="/dispute/new">
              Dispute
            </a>
          </div>
        </div>

        <div className="mt-8 h-px w-full bg-gradient-to-r from-transparent via-white/12 to-transparent" />
        <div className="mt-6 text-xs text-white/50">
          © {new Date().getFullYear()} Black History DAO. Built for provenance, public access, and long-term preservation.
        </div>
      </div>
    </footer>
  );
}

/* ---------- small components ---------- */

function MetricCard({ k, v, note }: { k: string; v: string; note: string }) {
  return (
    <div className="rounded-3xl bg-white/5 p-5 backdrop-blur">
      <div className="text-xs text-white/60">{k}</div>
      <div className="mt-1 text-lg font-semibold text-white">{v}</div>
      <div className="mt-2 text-sm leading-relaxed text-white/70">{note}</div>
    </div>
  );
}

function MiniLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-black/20 p-4">
      <div className="text-xs text-white/60">{label}</div>
      <div className="mt-1 text-sm font-semibold text-white/90">{value}</div>
    </div>
  );
}

function ResultCard({
  img,
  title,
  desc,
  tags,
  className = "",
}: {
  img: string;
  title: string;
  desc: string;
  tags: string[];
  className?: string;
}) {
  return (
    <a
      href="/item/demo"
      className={`group relative overflow-hidden rounded-3xl bg-white/5 backdrop-blur transition hover:-translate-y-0.5 ${className}`}
    >
      <div className="relative aspect-[4/3]">
        <img
          src={img}
          alt={title}
          className="h-full w-full object-cover opacity-[0.95]"
          referrerPolicy="no-referrer"
          loading="lazy"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      </div>

      <div className="p-5">
        <div className="text-sm font-semibold text-white">{title}</div>
        <div className="mt-2 text-sm leading-relaxed text-white/70">{desc}</div>

        <div className="mt-4 flex flex-wrap gap-2">
          {tags.map((t) => (
            <span key={t} className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/75">
              {t}
            </span>
          ))}
        </div>

        <div className="mt-5 inline-flex items-center gap-2 text-xs font-semibold text-white/80">
          View artifact <span className="transition group-hover:translate-x-0.5">→</span>
        </div>
      </div>
    </a>
  );
}

function FlowLine({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <div className="flex gap-4 rounded-2xl bg-black/20 p-4">
      <div
        className="grid h-9 w-9 flex-none place-items-center rounded-2xl bg-white/12 text-xs font-black text-white"
        style={{ boxShadow: "0 0 0 1px rgba(232,195,106,0.18), 0 0 30px rgba(200,107,60,0.10)" }}
      >
        {n}
      </div>
      <div>
        <div className="text-sm font-semibold text-white">{title}</div>
        <div className="mt-1 text-sm leading-relaxed text-white/70">{body}</div>
      </div>
    </div>
  );
}

function RoleCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-3xl bg-white/5 p-6 backdrop-blur">
      <div className="text-sm font-semibold text-white">{title}</div>
      <div className="mt-2 text-sm leading-relaxed text-white/70">{body}</div>
    </div>
  );
}
