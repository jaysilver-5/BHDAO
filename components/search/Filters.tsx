"use client"

import { useRouter, useSearchParams } from "next/navigation"

const TYPE_FILTERS = [
  { label: "All", value: "" },
  { label: "Images", value: "images" },
  { label: "Documents", value: "documents" },
  { label: "Audio", value: "audio" },
  { label: "Video", value: "video" },
]

const LANG_FILTERS = [
  { label: "English", value: "en" },
  { label: "Français", value: "fr" },
]

export default function Filters() {
  const router = useRouter()
  const sp = useSearchParams()

  const q = sp.get("q") || ""
  const type = sp.get("type") || ""
  const lang = sp.get("lang") || ""

  function setParam(key: string, value: string) {
    const next = new URLSearchParams(sp.toString())

    if (q) next.set("q", q)
    if (!value) next.delete(key)
    else next.set(key, value)

    router.push(`/search?${next.toString()}`)
  }

  return (
    <section className="pb-8">
      <div className="container-page">
        {/* Mobile friendly: horizontal scroll chips */}
        <div className="flex flex-col gap-3">
          <div className="flex gap-2 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {TYPE_FILTERS.map((f) => (
              <Chip
                key={f.label}
                active={type === f.value || (f.value === "" && type === "")}
                onClick={() => setParam("type", f.value)}
              >
                {f.label}
              </Chip>
            ))}
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {LANG_FILTERS.map((f) => (
              <Chip
                key={f.label}
                active={lang === f.value}
                onClick={() => setParam("lang", lang === f.value ? "" : f.value)}
              >
                {f.label}
              </Chip>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={
        active
          ? "shrink-0 rounded-full bg-white px-4 py-2 text-sm font-semibold text-black"
          : "shrink-0 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white/80 hover:bg-white/15"
      }
    >
      {children}
    </button>
  )
}
