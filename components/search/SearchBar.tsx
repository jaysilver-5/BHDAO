"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"

const SUGGESTIONS = ["Martin Luther King", "Harlem Renaissance", "Black inventors"]

export default function SearchBar() {
  const router = useRouter()
  const sp = useSearchParams()
  const initial = sp.get("q") || ""
  const [q, setQ] = useState(initial)

  useEffect(() => setQ(initial), [initial])

  function go(next?: string) {
    const v = (next ?? q).trim()
    router.push(v ? `/search?q=${encodeURIComponent(v)}` : "/search")
  }

  return (
    <section className="relative pb-7">
      <div className="container-page">
        <div className="mx-auto max-w-3xl">
          <div className="relative rounded-2xl bg-white/5 backdrop-blur p-1.5 shadow-[0_18px_55px_rgba(0,0,0,0.55)]">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => (e.key === "Enter" ? go() : null)}
              placeholder="Search people, events, places, tags..."
              className="w-full bg-transparent px-4 py-3 text-[15px] text-white placeholder-white/50 outline-none sm:px-5 sm:py-3.5 sm:text-base"
            />

            <button
              onClick={() => go()}
              className="absolute right-1.5 top-1.5 bottom-1.5 rounded-xl bg-white px-4 text-sm font-semibold text-black sm:px-6"
              aria-label="Search"
              title="Search"
            >
              <span className="sm:hidden">Go</span>
              <span className="hidden sm:inline">Search</span>
            </button>
          </div>

          <div className="mt-3 flex flex-wrap w-fit items-center justify-center gap-2 px-1">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => go(s)}
                className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-white/80 hover:bg-white/15 mx-auto"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
