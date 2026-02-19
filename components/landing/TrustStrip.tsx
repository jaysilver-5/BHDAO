export default function TrustStrip() {
  const items = [
    { k: "Substrate", v: "Runtime and pallets" },
    { k: "Polkadot", v: "Secure network layer" },
    { k: "IPFS", v: "Resilient storage" },
    { k: "On chain proof", v: "Provenance trail" },
    { k: "Community verified", v: "Validator voting" },
  ];

  return (
    <section className="border-y border-white/10 bg-white/[0.02]">
      <div className="container-page py-10">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {items.map((x) => (
            <div
              key={x.k}
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4"
            >
              <div className="text-sm font-semibold">{x.k}</div>
              <div className="mt-1 text-xs text-[color:var(--color-muted)]">
                {x.v}
              </div>
            </div>
          ))}
        </div>

        <p className="mt-6 text-center text-xs text-[color:var(--color-muted)]">
          Designed for permanence, verification, and public access.
        </p>
      </div>
    </section>
  );
}
