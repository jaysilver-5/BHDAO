"use client"

import { useSearchParams } from "next/navigation"

export default function ResultsHeader() {
  const sp = useSearchParams()
  const q = sp.get("q") || ""

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <div className="text-xs uppercase tracking-[0.18em] text-white/55">
          Results
        </div>

        <div className="mt-2 text-lg font-semibold text-white">
          {q ? (
            <>
              Showing <span className="text-white/85">84</span> results for{" "}
              <span className="text-white">“{q}”</span>
            </>
          ) : (
            <>
              Showing <span className="text-white/85">84</span> items from the archive
            </>
          )}
        </div>

        <div className="mt-1 text-sm text-white/65">
          Title, description, and tags are indexed in the MVP.
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xs text-white/55">Sort</span>
        <button className="rounded-full bg-white/10 px-4 py-2 text-xs font-semibold text-white/80 hover:bg-white/15">
          Relevance
        </button>
        <button className="rounded-full bg-white/10 px-4 py-2 text-xs font-semibold text-white/80 hover:bg-white/15">
          Newest
        </button>
      </div>
    </div>
  )
}
