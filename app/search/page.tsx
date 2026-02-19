import SearchTopNav from "@/components/search/SearchTopNav"
import SearchHero from "@/components/search/SearchHero"
import SearchBar from "@/components/search/SearchBar"
import Filters from "@/components/search/Filters"
import ResultsGrid from "@/components/search/ResultsGrid"

export default function SearchPage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Background must be behind */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(1200px 780px at 18% 8%, rgba(232,195,106,0.22), transparent 62%)," +
              "radial-gradient(1050px 820px at 86% 18%, rgba(200,107,60,0.20), transparent 62%)," +
              "radial-gradient(1000px 820px at 50% 92%, rgba(122,166,255,0.10), transparent 62%)," +
              "linear-gradient(to bottom, rgba(0,0,0,0.72), rgba(0,0,0,0.92))",
          }}
        />
        <div className="absolute inset-0 opacity-40 bg-[conic-gradient(from_220deg_at_50%_35%,rgba(255,255,255,0.10),rgba(255,255,255,0.02),rgba(255,255,255,0.08),rgba(255,255,255,0.02))]" />
        <div className="absolute inset-0 bg-[radial-gradient(900px_520px_at_22%_15%,rgba(232,195,106,0.10),transparent_55%)]" />
      </div>

      <div className="relative z-10">
        <SearchTopNav />
        <SearchHero />
        <SearchBar />
        <Filters />
        <ResultsGrid />
      </div>
    </main>
  )
}
