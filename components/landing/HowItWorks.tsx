export default function HowItWorks() {
  const steps = [
    {
      title: "Submit",
      desc: "Contributors upload artifacts, documents, audio, and video. Files are stored on IPFS and anchored with on-chain metadata.",
      icon: "⬆️",
    },
    {
      title: "Verify",
      desc: "Validators review proposals and vote. Approved artifacts become part of the public archive with a transparent audit trail.",
      icon: "🗳️",
    },
    {
      title: "Search",
      desc: "Anyone can search verified history by title, description, or tags, then view provenance and storage references.",
      icon: "🔎",
    },
  ];

  return (
    <section className="relative">
      <div className="container-page py-18 sm:py-22">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-[color:var(--color-muted)]">
            <span className="h-2 w-2 rounded-full bg-[color:var(--color-blue)]" />
            How it works
          </p>
          <h2 className="text-balance text-3xl font-semibold sm:text-4xl">
            A simple flow that protects integrity.
          </h2>
          <p className="mt-4 text-pretty text-[color:var(--color-muted)]">
            The archive is community-driven: contributors submit, validators verify, and the world searches approved history.
          </p>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {steps.map((s) => (
            <div key={s.title} className="card p-6">
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-white/5 text-lg">
                  {s.icon}
                </div>
                <div className="text-lg font-semibold">{s.title}</div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-[color:var(--color-muted)]">
                {s.desc}
              </p>

              <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-white/75">
                <span className="font-semibold text-white/90">MVP</span>{" "}
                supports proposals, voting, disputes, and search.
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </section>
  );
}
