"use client";

import { useAuth } from "@/lib/auth-context";
import { useState } from "react";

export default function WalletButton() {
  const { user, loading, connect, disconnect } = useAuth();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const handleConnect = async () => {
    setBusy(true);
    setErr("");
    try {
      await connect();
    } catch (e: any) {
      setErr(e.message ?? "Connection failed");
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return <div className="h-9 w-32 animate-pulse rounded-xl bg-white/5" />;
  }

  if (user) {
    const short = `${user.wallet.slice(0, 6)}…${user.wallet.slice(-4)}`;
    return (
      <div className="relative group">
        <button className="flex items-center gap-2.5 rounded-xl bg-white/4 px-3.5 py-2 text-[12px] ring-1 ring-white/8 transition hover:bg-white/6 hover:ring-white/12">
          <span className="h-2 w-2 rounded-full bg-green-400 shadow-[0_0_6px_rgba(74,222,128,0.4)]" />
          <span className="font-mono text-white/70">{short}</span>
          {user.role !== "MEMBER" && (
            <span className="rounded-md bg-[#e8c36a]/10 px-1.5 py-0.5 text-[9px] font-semibold text-[#e8c36a]/80">
              {user.role}
            </span>
          )}
        </button>
        <div className="absolute right-0 top-full z-50 mt-1 hidden w-48 flex-col rounded-xl bg-[#12111a] p-1 ring-1 ring-white/10 group-hover:flex">
          <div className="px-3 py-2 text-[10px] text-white/30 border-b border-white/5">
            {user.wallet}
          </div>
          <button
            onClick={disconnect}
            className="mt-1 w-full rounded-lg px-3 py-2 text-left text-[12px] text-red-400/80 transition hover:bg-red-500/8"
          >
            Disconnect
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={handleConnect}
        disabled={busy}
        className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#e8c36a]/90 to-[#c9a44e]/90 px-4 py-2 text-[12px] font-semibold text-black transition hover:from-[#e8c36a] hover:to-[#c9a44e] disabled:opacity-50"
      >
        {busy ? (
          <span className="flex items-center gap-2">
            <span className="h-3 w-3 animate-spin rounded-full border-2 border-black/20 border-t-black/70" />
            Connecting…
          </span>
        ) : (
          "Connect Wallet"
        )}
      </button>
      {err && (
        <div className="absolute right-0 top-full z-50 mt-2 w-64 rounded-xl bg-red-500/10 px-3 py-2 text-[11px] text-red-400 ring-1 ring-red-500/20">
          {err}
          <button onClick={() => setErr("")} className="ml-2 text-red-400/50 hover:text-red-400">✕</button>
        </div>
      )}
    </div>
  );
}