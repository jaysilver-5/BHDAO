"use client";

import { useState, useEffect } from "react";

const IMAGES = [
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/8/81/Martin_Luther_King_-_March_on_Washington.jpg",
    alt: "Martin Luther King Jr at the March on Washington",
  },
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/e/ed/First_Tuskeegee_Class.jpg",
    alt: "First Tuskegee Airmen class",
  },
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/6/68/Ss-booker-t-washington-1943.jpg",
    alt: "Crew of the SS Booker T. Washington, 1943",
  },
];

const PLACEHOLDERS = [
  "Martin Luther King",
  "Harlem Renaissance",
  "Black inventors",
  "Tuskegee Airmen",
  "Civil rights movement",
];

export default function Hero() {
  const [query, setQuery] = useState("");
  const [phIdx, setPhIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setPhIdx((i) => (i + 1) % PLACEHOLDERS.length), 3200);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative min-h-[100svh] overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 bg-[#050407]" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(1400px 800px at 10% 0%, rgba(232,195,106,0.22), transparent 60%)," +
            "radial-gradient(1100px 800px at 90% 10%, rgba(180,90,50,0.18), transparent 60%)," +
            "radial-gradient(800px 600px at 50% 100%, rgba(100,140,255,0.06), transparent 60%)",
        }}
      />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjAuNSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIvPjwvc3ZnPg==')] opacity-60" />

      <div className="container-page relative flex min-h-[100svh] flex-col">
        {/* Nav */}
        <nav className="flex items-center justify-between pt-6">
          <a href="/" className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-[#e8c36a]/20 to-[#c86b3c]/20 text-sm font-black text-white ring-1 ring-white/10 backdrop-blur-sm">
              BH
            </div>
            <div className="leading-tight">
              <div className="text-[13px] font-semibold text-white tracking-wide">BHDao</div>
              <div className="text-[11px] text-white/50">Black History DAO</div>
            </div>
          </a>

          <div className="flex items-center gap-3">
            <a href="/explore" className="hidden text-[13px] text-white/60 transition hover:text-white sm:block">
              Explore
            </a>
            <a href="/how-it-works" className="hidden text-[13px] text-white/60 transition hover:text-white sm:block">
              How it works
            </a>
            <a
              href="/submit"
              className="rounded-xl bg-white/8 px-4 py-2 text-[13px] font-medium text-white ring-1 ring-white/10 transition hover:bg-white/12"
            >
              Submit artifact
            </a>
          </div>
        </nav>

        {/* Main content */}
        <div className="flex flex-1 items-center py-12">
          <div className="grid w-full gap-12 md:grid-cols-12 md:gap-8 lg:gap-16">
            {/* Left */}
            <div className="flex flex-col justify-center md:col-span-7">
              <div className="inline-flex w-fit items-center gap-2 rounded-full bg-white/6 px-3.5 py-1.5 ring-1 ring-white/8">
                <span className="h-1.5 w-1.5 rounded-full bg-[#e8c36a]" />
                <span className="text-[11px] font-medium tracking-wide text-white/70">
                  Community verified · IPFS stored · On-chain proof
                </span>
              </div>

              <h1 className="mt-7 text-[clamp(2.4rem,5.5vw,4.2rem)] font-semibold leading-[1.05] tracking-tight text-white">
                Black history,
                <br />
                <span className="bg-gradient-to-r from-[#e8c36a] via-[#d4a050] to-[#c86b3c] bg-clip-text text-transparent">
                  preserved forever.
                </span>
              </h1>

              <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-white/55 sm:text-base">
                Submit historical artifacts. The community reviews. Experts verify.
                Everything is stored on IPFS and anchored to the blockchain — permanent, searchable, and tamper-proof.
              </p>

              {/* Search */}
              <div className="mt-8 max-w-xl">
                <div className="relative flex items-center rounded-2xl bg-white/5 ring-1 ring-white/8 transition-all focus-within:ring-white/20">
                  <span className="pl-4 text-white/30">
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <circle cx="11" cy="11" r="8" />
                      <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
                    </svg>
                  </span>
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={`Search "${PLACEHOLDERS[phIdx]}"`}
                    className="w-full bg-transparent px-3 py-3.5 text-sm text-white outline-none placeholder:text-white/30"
                  />
                  <a
                    href={query.trim() ? `/search?q=${encodeURIComponent(query.trim())}` : "/search"}
                    className="mr-1.5 rounded-xl bg-white px-5 py-2 text-[13px] font-semibold text-black transition hover:bg-white/90"
                  >
                    Search
                  </a>
                </div>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {PLACEHOLDERS.slice(0, 4).map((s) => (
                    <button
                      key={s}
                      onClick={() => setQuery(s)}
                      className="rounded-full bg-white/5 px-3 py-1 text-[11px] text-white/50 ring-1 ring-white/6 transition hover:bg-white/8 hover:text-white/70"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="mt-10 flex gap-8">
                <Stat label="Storage" value="IPFS pinned" />
                <Stat label="Proof" value="On-chain" />
                <Stat label="Review" value="DAO verified" />
              </div>
            </div>

            {/* Right: Image grid */}
            <div className="hidden md:col-span-5 md:flex md:items-center">
              <div className="relative w-full">
                <div className="absolute -inset-8 rounded-[32px] bg-gradient-to-br from-[#e8c36a]/8 to-[#c86b3c]/6 blur-3xl" />
                <div className="relative grid gap-3">
                  <div className="grid grid-cols-2 gap-3">
                    <ImgCard {...IMAGES[0]} className="aspect-[3/4]" />
                    <ImgCard {...IMAGES[1]} className="aspect-[3/4]" />
                  </div>
                  <ImgCard {...IMAGES[2]} className="aspect-[2.2/1]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom fade into next section */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#050407] to-transparent" />
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[11px] font-medium uppercase tracking-widest text-white/30">{label}</div>
      <div className="mt-1 text-sm font-semibold text-white/80">{value}</div>
    </div>
  );
}

function ImgCard({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  return (
    <div className={`relative overflow-hidden rounded-2xl bg-white/5 ring-1 ring-white/8 ${className}`}>
      <img src={src} alt={alt} loading="lazy" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10" />
    </div>
  );
}