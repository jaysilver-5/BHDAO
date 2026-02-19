interface ResultCardProps {
  title: string;
  img: string;
  desc: string;
}
export default function ResultCard({ title, img, desc }: ResultCardProps) {
  return (
    <a
      href="/item/demo"
      className="group overflow-hidden rounded-3xl bg-white/5 backdrop-blur hover:-translate-y-1 transition"
    >
      <div className="aspect-[4/3] relative">
        <img src={img} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
      </div>

      <div className="p-5">
        <h3 className="text-white font-semibold">{title}</h3>
        <p className="text-white/70 mt-2 text-sm">{desc}</p>

        <div className="mt-4 text-xs text-white/60">
          Approved • IPFS • Proposal #24
        </div>
      </div>
    </a>
  )
}
