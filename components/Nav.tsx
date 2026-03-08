"use client";

import { useAuth } from "@/lib/auth-context";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

function shortAddr(a: string) {
  return a.length > 10 ? `${a.slice(0, 6)}…${a.slice(-4)}` : a;
}

export default function Nav() {
  const { user, loading, connect, disconnect } = useAuth();
  const path = usePathname();
  const [busy, setBusy] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  async function handleConnect() {
    setBusy(true);
    try { await connect(); } catch (e: any) { alert(e.message); }
    setBusy(false);
  }

  return (
    <nav className="sticky top-0 z-40 border-b border-white/6 bg-[#050407]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-[#e8c36a]/20 to-[#c86b3c]/20 text-[10px] font-black text-white ring-1 ring-white/10">
              BH
            </div>
            <span className="text-[13px] font-semibold text-white">BHDAO</span>
          </Link>

          <div className="hidden items-center gap-1 sm:flex">
            <NavLink href="/explore" active={path === "/explore"}>Explore</NavLink>
            {user && <NavLink href="/proposals" active={path === "/proposals"}>Proposals</NavLink>}
            <NavLink href="/how-it-works" active={path === "/how-it-works"}>How it works</NavLink>
            {user && <NavLink href="/dashboard" active={path === "/dashboard"}>Dashboard</NavLink>}
            {user && (user.role === "EXPERT" || user.role === "ADMIN") && (
              <NavLink href="/expert" active={path === "/expert"}>Review queue</NavLink>
            )}
            {user?.role === "ADMIN" && <NavLink href="/admin" active={path === "/admin"}>Admin</NavLink>}
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {loading ? (
            <div className="h-8 w-24 animate-pulse rounded-xl bg-white/5" />
          ) : user ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-1.5 text-[12px] ring-1 ring-white/8 transition hover:bg-white/8"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                <span className="text-white/70">{shortAddr(user.wallet)}</span>
                <span className="rounded bg-white/8 px-1.5 py-0.5 text-[10px] font-medium text-white/50">
                  {user.role}
                </span>
              </button>
              {menuOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 rounded-xl bg-[#0c0b10] p-1.5 ring-1 ring-white/10 shadow-2xl">
                  <Link
                    href="/proposals"
                    onClick={() => setMenuOpen(false)}
                    className="block rounded-lg px-3 py-2 text-[12px] text-white/60 transition hover:bg-white/5 hover:text-white"
                  >
                    Proposals
                  </Link>
                  <Link
                    href="/dashboard"
                    onClick={() => setMenuOpen(false)}
                    className="block rounded-lg px-3 py-2 text-[12px] text-white/60 transition hover:bg-white/5 hover:text-white"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/submit"
                    onClick={() => setMenuOpen(false)}
                    className="block rounded-lg px-3 py-2 text-[12px] text-white/60 transition hover:bg-white/5 hover:text-white"
                  >
                    Submit artifact
                  </Link>
                  <div className="my-1 border-t border-white/5" />
                  <button
                    onClick={() => { disconnect(); setMenuOpen(false); }}
                    className="block w-full rounded-lg px-3 py-2 text-left text-[12px] text-red-400/70 transition hover:bg-white/5 hover:text-red-400"
                  >
                    Disconnect
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={handleConnect}
              disabled={busy}
              className="rounded-xl bg-white px-4 py-1.5 text-[12px] font-semibold text-black transition hover:bg-white/90 disabled:opacity-50"
            >
              {busy ? "Connecting…" : "Connect wallet"}
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

function NavLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={`rounded-lg px-3 py-1.5 text-[12px] transition ${
        active
          ? "bg-white/6 text-white/90 ring-1 ring-white/8"
          : "text-white/45 hover:bg-white/5 hover:text-white/80"
      }`}
    >
      {children}
    </Link>
  );
}
