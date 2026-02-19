"use client";

import { useState } from "react";

type Img = { src: string; alt: string };

const IMAGES: Img[] = [
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/8/81/Martin_Luther_King_-_March_on_Washington.jpg",
    alt: "Martin Luther King Jr speaking at the March on Washington",
  },
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/e/ed/First_Tuskeegee_Class.jpg",
    alt: "First Tuskegee Airmen class lined up on an airfield",
  },
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/6/68/Ss-booker-t-washington-1943.jpg",
    alt: "Crew of the SS Booker T. Washington, 1943",
  },
];

const SUGGESTIONS = ["Martin Luther King", "Harlem Renaissance", "Black inventors"];

export default function Hero() {
  const [query, setQuery] = useState("");

  return (
    <section className="relative overflow-hidden">
      {/* ONE continuous background. No bottom fade strip that causes a visible break. */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(1200px 760px at 18% 10%, rgba(232,195,106,0.30), transparent 62%)," +
              "radial-gradient(980px 760px at 82% 18%, rgba(200,107,60,0.26), transparent 62%)," +
              "radial-gradient(900px 760px at 45% 95%, rgba(122,166,255,0.12), transparent 62%)," +
              "linear-gradient(to bottom, rgba(0,0,0,0.06), rgba(0,0,0,0.62))",
          }}
        />
        <div className="absolute inset-0 opacity-60 bg-[conic-gradient(from_220deg_at_50%_35%,rgba(255,255,255,0.14),rgba(255,255,255,0.03),rgba(255,255,255,0.10),rgba(255,255,255,0.03))]" />
      </div>

      <div className="container-page relative pt-14 pb-12 sm:pt-16 sm:pb-14">
        {/* Top bar (less height, less noise) */}
        <div className="flex items-center justify-between">
          <a href="/" className="flex items-center gap-3">
            <div
              className="grid h-10 w-10 place-items-center rounded-2xl bg-white/10 text-sm font-black text-white backdrop-blur"
              style={{
                boxShadow: "0 0 0 1px rgba(232,195,106,0.22), 0 0 42px rgba(200,107,60,0.14)",
              }}
            >
              BH
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold text-white">BHDao</div>
              <div className="text-xs text-white/60">Black History DAO</div>
            </div>
          </a>

          <div className="hidden items-center gap-2 sm:flex">
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/80">
              IPFS + on chain proof
            </span>
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/80">
              DAO verified
            </span>
          </div>
        </div>

        {/* Main layout: less gap, more breathing */}
        <div className="mt-10 grid items-start gap-10 md:grid-cols-12 md:gap-10">
          {/* Left */}
          <div className="md:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs text-white/85">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--gold)]" />
              Community verified archive
            </div>

            {/* Headline (2–3 lines max) */}
            <h1 className="mt-5 text-balance text-4xl font-semibold tracking-tight leading-[1.05] text-white sm:text-6xl">
              Black history,
              <span className="text-white/85"> preserved and searchable </span>
              forever.
            </h1>

            {/* Subline: short */}
            <p className="mt-4 max-w-xl text-pretty text-base leading-relaxed text-white/78 sm:text-lg">
              Submit artifacts. Verify through DAO review. Publish with provenance and resilient storage.
            </p>

            {/* CTAs (clean, no heavy card) */}
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a
                href="/explore"
                className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black shadow-[0_18px_55px_rgba(0,0,0,0.45)] transition hover:-translate-y-0.5"
              >
                Explore archive →
              </a>
              <a
                href="/proposals/new"
                className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/5 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/10"
              >
                Submit an artifact
              </a>
              <a
                href="/how-it-works"
                className="inline-flex items-center justify-center px-2 py-3 text-sm font-semibold text-white/75 transition hover:text-white sm:ml-auto"
              >
                How it works
              </a>
            </div>

            {/* Search moved lower + slimmer (optional but still visible) */}
            <div className="mt-10">
              <div className="rounded-2xl bg-white/5 p-3 backdrop-blur">
                <div className="flex items-center gap-3 rounded-2xl bg-black/25 px-4 py-3">
                  <span className="text-white/70">🔎</span>
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={`Search "${SUGGESTIONS[0]}"`}
                    className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/40 sm:text-base"
                  />
                  <a
                    href={
                      query.trim()
                        ? `/search?q=${encodeURIComponent(query.trim())}`
                        : "/search"
                    }
                    className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-2 text-sm font-semibold text-black transition hover:-translate-y-0.5"
                  >
                    Search
                  </a>
                </div>

                <div className="mt-3 flex flex-wrap gap-2 px-1">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setQuery(s)}
                      className="rounded-full bg-white/10 px-3 py-1.5 text-xs text-white/80 transition hover:bg-white/15"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-4 grid max-w-xl grid-cols-3 gap-3">
                <MiniStat label="Storage" value="IPFS" />
                <MiniStat label="Proof" value="On chain" />
                <MiniStat label="Review" value="DAO vote" />
              </div>
            </div>
          </div>

          {/* Right: larger images again, no borders, equal height top row */}
          <div className="md:col-span-5">
            <div className="relative">
              <div className="absolute -inset-6 rounded-[28px] bg-white/6 blur-2xl" />

              <div className="relative grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <ImageCard className="aspect-[4/5]" {...IMAGES[0]} priority />
                  <ImageCard className="aspect-[4/5]" {...IMAGES[1]} />
                </div>
                <ImageCard className="aspect-[16/9]" {...IMAGES[2]} />
              </div>

              {/* subtle, optional glow line */}
              <div className="pointer-events-none absolute -bottom-3 left-8 right-8 h-px bg-gradient-to-r from-transparent via-[rgba(232,195,106,0.55)] to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/5 p-4 backdrop-blur">
      <div className="text-xs text-white/60">{label}</div>
      <div className="mt-1 text-sm font-semibold text-white">{value}</div>
    </div>
  );
}

function ImageCard({
  src,
  alt,
  className = "",
  priority = false,
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-3xl bg-white/5 shadow-[0_18px_55px_rgba(0,0,0,0.55)] ${className}`}
    >
      <img
        src={src}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        className="h-full w-full object-cover opacity-[0.95]"
        referrerPolicy="no-referrer"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_520px_at_20%_15%,rgba(232,195,106,0.12),transparent_55%)]" />
    </div>
  );
}
