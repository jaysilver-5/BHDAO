import CollectionRail from "./CollectionRail"
import ResultsHeader from "./ResultsHeader"
import ResultCard from "./ResultCard"

const results = [
  {
    title: "Martin Luther King Jr. — March on Washington",
    img: "https://upload.wikimedia.org/wikipedia/commons/8/81/Martin_Luther_King_-_March_on_Washington.jpg",
    desc: "Historic speech and crowd photography.",
    meta: "Approved • IPFS • Proposal #24",
  },
  {
    title: "Tuskegee Airmen Training",
    img: "https://upload.wikimedia.org/wikipedia/commons/e/ed/First_Tuskeegee_Class.jpg",
    desc: "Archival photo of the first Black military aviators.",
    meta: "Approved • IPFS • Proposal #18",
  },
  {
    title: "SS Booker T. Washington (1943)",
    img: "https://upload.wikimedia.org/wikipedia/commons/6/68/Ss-booker-t-washington-1943.jpg",
    desc: "Ship and crew documentation from 1943.",
    meta: "Approved • IPFS • Proposal #31",
  },
]

export default function ResultsGrid() {
  return (
    <section className="pb-24">
      <div className="container-page">
        <div className="grid gap-10 md:grid-cols-12">
          <CollectionRail />

          <div className="md:col-span-9">
            {/* <div className="md:hidden mb-5 rounded-2xl bg-white/5 p-4 backdrop-blur">
                <div className="text-xs uppercase tracking-[0.18em] text-white/55">Collection</div>
                <div className="mt-2 text-base font-semibold text-white">Black History Archive</div>
                <div className="mt-1 text-sm text-white/70">Verified artifacts with provenance.</div>
            </div> */}

            <ResultsHeader />

            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((r, i) => (
                <ResultCard key={i} {...r} />
              ))}
            </div>

            <div className="mt-10 flex items-center justify-center">
              <button className="rounded-full bg-white/10 px-6 py-3 text-sm font-semibold text-white/85 hover:bg-white/15">
                Load more
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
