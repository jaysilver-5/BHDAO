export default function SearchTopNav() {
  return (
    <header className="relative z-10">
      <div className="container-page pt-8">
        <div className="flex items-center justify-between">
          <a href="/" className="group flex items-center gap-3">
            <div
              className="grid h-10 w-10 place-items-center rounded-2xl bg-white/10 text-sm font-black text-white backdrop-blur transition group-hover:scale-[1.02]"
              style={{
                boxShadow:
                  "0 0 0 1px rgba(232,195,106,0.20), 0 0 42px rgba(200,107,60,0.14)",
              }}
            >
              BH
            </div>

            <div className="leading-tight">
              <div className="text-sm font-semibold text-white">BHDao</div>
              <div className="text-xs text-white/60">Black History DAO</div>
            </div>
          </a>

          <nav className="hidden items-center gap-2 sm:flex">
            <a
              href="/how-it-works"
              className="rounded-full bg-white/10 px-4 py-2 text-xs font-semibold text-white/80 hover:bg-white/15"
            >
              How it works
            </a>
            <a
              href="/proposals/new"
              className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-black hover:-translate-y-0.5 transition"
            >
              Submit
            </a>
          </nav>
        </div>

        <div className="mt-6 h-px w-full bg-gradient-to-r from-transparent via-white/12 to-transparent" />
      </div>
    </header>
  )
}
