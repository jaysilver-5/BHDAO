type Featured = {
  title: string;
  desc: string;
  tags: string[];
  type: string;
  year: string;
};

const featured: Featured[] = [
  {
    title: "Civil Rights March Photograph",
    desc: "A verified photograph documenting a key moment in the civil rights era, anchored with on-chain provenance.",
    tags: ["civil-rights", "photography", "usa"],
    type: "Image",
    year: "1955",
  },
  {
    title: "Oral History Recording",
    desc: "An audio recording capturing lived experiences, reviewed by validators for authenticity and context.",
    tags: ["oral-history", "audio", "diaspora"],
    type: "Audio",
    year: "1962",
  },
  {
    title: "Newspaper Archive Scan",
    desc: "A digitized newspaper excerpt preserved with resilient storage and searchable metadata.",
    tags: ["newspaper", "archive", "history"],
    type: "Document",
    year: "1936",
  },
  {
    title: "Community Exhibit Poster",
    desc: "A cultural artifact preserved for future research and exhibitions, including virtual experiences later.",
    tags: ["culture", "exhibit", "poster"],
    type: "Image",
    year: "1971",
  },
  {
    title: "Scholar Submitted Manuscript",
    desc: "A document submitted with references, verified through community review and dispute moderation.",
    tags: ["manuscript", "scholarship", "references"],
    type: "Doc",
    year: "1980",
  },
  {
    title: "Historical Video Clip",
    desc: "A short video artifact preserved with IPFS storage and on-chain record for transparency.",
    tags: ["video", "movement", "archive"],
    type: "Video",
    year: "1968",
  },
];

export default function FeaturedArtifacts() {
  return (
    <section>
      <div className="container-page py-18 sm:py-22">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-[color:var(--color-muted)]">
              <span className="h-2 w-2 rounded-full bg-[color:var(--color-gold)]" />
              Featured artifacts
            </p>
            <h2 className="text-balance text-3xl font-semibold sm:text-4xl">
              Explore the living archive.
            </h2>
            <p className="mt-3 max-w-2xl text-pretty text-[color:var(--color-muted)]">
              A growing collection of community-verified artifacts. Search by title, description, or tags.
            </p>
          </div>

          <a
            href="/explore"
            className="btn-ghost"
            aria-label="Browse the archive"
          >
            Browse archive →
          </a>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((x) => (
            <a
              key={x.title}
              href="/artifact/demo"
              className="group card p-6 transition hover:bg-white/10"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="text-sm font-semibold">{x.title}</div>
                <span className="shrink-0 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/75">
                  {x.type} • {x.year}
                </span>
              </div>

              <p className="mt-3 text-sm leading-relaxed text-[color:var(--color-muted)]">
                {x.desc}
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                {x.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70"
                  >
                    {t}
                  </span>
                ))}
              </div>

              <div className="mt-6 flex items-center justify-between">
                <div className="text-xs text-white/60">
                  Approved and searchable
                </div>
                <div className="text-xs text-white/70 transition group-hover:text-white">
                  View →
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
