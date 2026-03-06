"use client";

interface ProofBadgeProps {
  anchored: boolean;
  txHash?: string;
  explorerUrl?: string;
  cid?: string;
  gatewayUrl?: string;
  compact?: boolean;
}

export default function ProofBadge({ anchored, txHash, explorerUrl, cid, gatewayUrl, compact = false }: ProofBadgeProps) {
  if (!anchored) return null;

  if (compact) {
    return (
      <a
        href={explorerUrl}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-1.5 rounded-full bg-[#e8c36a]/8 px-2.5 py-0.5 text-[10px] font-medium text-[#e8c36a]/80 ring-1 ring-[#e8c36a]/15 transition hover:bg-[#e8c36a]/12 hover:ring-[#e8c36a]/25"
      >
        <span className="text-[#e8c36a]">◆</span>
        On-chain
      </a>
    );
  }

  return (
    <div className="space-y-2 rounded-xl bg-[#e8c36a]/[0.03] p-4 ring-1 ring-[#e8c36a]/10">
      <div className="flex items-center gap-2 text-[12px] font-semibold text-[#e8c36a]/90">
        <span className="text-[14px]">◆</span>
        Verified on-chain
      </div>

      {txHash && (
        <div className="space-y-1">
          <div className="text-[10px] font-medium uppercase tracking-widest text-white/20">Transaction</div>
          <a
            href={explorerUrl}
            target="_blank"
            rel="noreferrer"
            className="block truncate font-mono text-[11px] text-[#e8c36a]/60 underline decoration-[#e8c36a]/15 transition hover:text-[#e8c36a]/80"
          >
            {txHash}
          </a>
        </div>
      )}

      {cid && (
        <div className="space-y-1">
          <div className="text-[10px] font-medium uppercase tracking-widest text-white/20">IPFS CID</div>
          <a
            href={gatewayUrl}
            target="_blank"
            rel="noreferrer"
            className="block truncate font-mono text-[11px] text-white/50 underline decoration-white/10 transition hover:text-white/70"
          >
            {cid}
          </a>
        </div>
      )}
    </div>
  );
}