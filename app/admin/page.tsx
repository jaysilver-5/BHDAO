"use client";

import Nav from "@/components/Nav";
import RoleGuard from "@/components/Roleguard";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { useEffect, useState } from "react";

function AdminInner() {
  const { token } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [userTotal, setUserTotal] = useState(0);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"overview" | "users" | "events">("overview");
  const [busy, setBusy] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    Promise.allSettled([
      api.admin.stats(token),
      api.admin.users(token),
      api.admin.events(token, 30),
    ]).then(([s, u, e]) => {
      if (s.status === "fulfilled") setStats(s.value);
      if (u.status === "fulfilled") {
        setUsers(u.value.items);
        setUserTotal(u.value.total);
      }
      if (e.status === "fulfilled") setEvents(e.value);
      setLoading(false);
    });
  }, [token]);

  const changeRole = async (userId: string, role: string) => {
    if (!token || !confirm(`Change this user's role to ${role}?`)) return;
    setBusy(userId);
    try {
      await api.admin.setRole(userId, role, token);
      const u = await api.admin.users(token);
      setUsers(u.items);
    } catch {
    } finally {
      setBusy(null);
    }
  };

  const TABS = [
    { key: "overview" as const, label: "Overview" },
    { key: "users" as const, label: "Users" },
    { key: "events" as const, label: "Audit Log" },
  ];

  return (
    <div className="min-h-screen">
      <Nav />

      <div className="pointer-events-none absolute inset-x-0 top-0 h-[300px]"
        style={{ background: "radial-gradient(ellipse 40% 30% at 50% 0%, rgba(232,195,106,0.03) 0%, transparent 70%)" }}
      />

      <div className="relative mx-auto max-w-6xl px-5 py-10">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#e8c36a]/10 ring-1 ring-[#e8c36a]/20">
            <span className="text-[16px]">⚙</span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-[#f0ede6]">Admin Dashboard</h1>
        </div>

        {/* Tabs */}
        <div className="mt-6 flex gap-1">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`rounded-lg px-3 py-1.5 text-[12px] font-medium transition ${
                tab === t.key
                  ? "bg-[#e8c36a]/10 text-[#e8c36a] ring-1 ring-[#e8c36a]/20"
                  : "text-white/30 hover:bg-white/[0.03] hover:text-white/50"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="mt-8 grid gap-4 md:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 animate-pulse rounded-2xl bg-white/[0.02]" />
            ))}
          </div>
        ) : (
          <>
            {/* ─── Overview ─── */}
            {tab === "overview" && stats && (
              <div className="mt-6 space-y-6">
                {/* Stat cards */}
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <StatCard label="Total Users" value={stats.users?.total ?? 0} icon="👥" />
                  <StatCard label="Total Artifacts" value={stats.artifacts?.total ?? 0} icon="📦" />
                  <StatCard label="Verified" value={stats.artifacts?.byStatus?.verified ?? 0} icon="✦" color="text-green-400" />
                  <StatCard label="On-chain" value={stats.artifacts?.anchored ?? 0} icon="⛓" color="text-[#e8c36a]" />
                </div>

                {/* Breakdown */}
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-white/[0.015] p-5 ring-1 ring-white/[0.04]">
                    <h3 className="text-[12px] font-semibold text-white/50 mb-4">Artifacts by Status</h3>
                    <div className="space-y-2.5">
                      {Object.entries(stats.artifacts?.byStatus ?? {}).map(([key, val]) => (
                        <div key={key} className="flex items-center justify-between">
                          <span className="text-[12px] text-white/40 capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</span>
                          <span className="font-mono text-[12px] text-white/60">{val as number}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-2xl bg-white/[0.015] p-5 ring-1 ring-white/[0.04]">
                    <h3 className="text-[12px] font-semibold text-white/50 mb-4">Activity</h3>
                    <div className="space-y-2.5">
                      <ActivityRow label="Votes" value={stats.activity?.votes ?? 0} />
                      <ActivityRow label="Comments" value={stats.activity?.comments ?? 0} />
                      <ActivityRow label="Flags" value={stats.activity?.flags ?? 0} />
                      <ActivityRow label="Expert Reviews" value={stats.activity?.expertReviews ?? 0} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ─── Users ─── */}
            {tab === "users" && (
              <div className="mt-6">
                <div className="mb-4 text-[12px] text-white/25">{userTotal} users</div>
                <div className="overflow-x-auto rounded-2xl bg-white/[0.015] ring-1 ring-white/[0.04]">
                  <table className="w-full text-[12px]">
                    <thead>
                      <tr className="border-b border-white/[0.04]">
                        <th className="px-5 py-3 text-left font-medium text-white/30">Wallet</th>
                        <th className="px-5 py-3 text-left font-medium text-white/30">Role</th>
                        <th className="px-5 py-3 text-left font-medium text-white/30">Artifacts</th>
                        <th className="px-5 py-3 text-left font-medium text-white/30">Votes</th>
                        <th className="px-5 py-3 text-left font-medium text-white/30">Reviews</th>
                        <th className="px-5 py-3 text-left font-medium text-white/30">Joined</th>
                        <th className="px-5 py-3 text-left font-medium text-white/30">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u) => (
                        <tr key={u.id} className="border-b border-white/[0.02] hover:bg-white/[0.01]">
                          <td className="px-5 py-3 font-mono text-white/50">
                            {u.wallet.slice(0, 6)}…{u.wallet.slice(-4)}
                          </td>
                          <td className="px-5 py-3">
                            <span
                              className={`rounded-md px-2 py-0.5 text-[10px] font-semibold ring-1 ${
                                u.role === "ADMIN"
                                  ? "bg-[#e8c36a]/10 text-[#e8c36a] ring-[#e8c36a]/20"
                                  : u.role === "EXPERT"
                                    ? "bg-purple-500/10 text-purple-400 ring-purple-500/20"
                                    : "bg-white/[0.03] text-white/40 ring-white/[0.06]"
                              }`}
                            >
                              {u.role}
                            </span>
                          </td>
                          <td className="px-5 py-3 text-white/40">{u._count?.artifacts ?? 0}</td>
                          <td className="px-5 py-3 text-white/40">{u._count?.votes ?? 0}</td>
                          <td className="px-5 py-3 text-white/40">{u._count?.expertReviews ?? 0}</td>
                          <td className="px-5 py-3 text-white/25">{new Date(u.createdAt).toLocaleDateString()}</td>
                          <td className="px-5 py-3">
                            <select
                              value={u.role}
                              onChange={(e) => changeRole(u.id, e.target.value)}
                              disabled={busy === u.id}
                              className="rounded-lg bg-white/[0.03] px-2 py-1 text-[11px] text-white/50 outline-none ring-1 ring-white/[0.06] disabled:opacity-30"
                            >
                              <option value="MEMBER">MEMBER</option>
                              <option value="EXPERT">EXPERT</option>
                              <option value="ADMIN">ADMIN</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ─── Events ─── */}
            {tab === "events" && (
              <div className="mt-6 space-y-2">
                <div className="mb-4 text-[12px] text-white/25">Recent audit events</div>
                {events.length === 0 ? (
                  <div className="py-12 text-center text-[12px] text-white/20">No events yet.</div>
                ) : (
                  events.map((ev) => (
                    <div
                      key={ev.id}
                      className="flex items-start gap-3 rounded-xl bg-white/[0.01] px-4 py-3 ring-1 ring-white/[0.03] hover:bg-white/[0.02]"
                    >
                      <span className="mt-0.5 text-[13px]">
                        {ev.type === "ANCHORED" ? "⛓" : ev.type === "PINNED" ? "📌" : ev.type === "VOTED" ? "🗳" : ev.type === "EXPERT_REVIEWED" ? "🔬" : ev.type === "SUBMITTED" ? "📤" : ev.type === "FLAGGED" ? "🚩" : "⚡"}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[12px] font-medium text-white/60">{ev.type.replace(/_/g, " ")}</span>
                          {ev.artifact && (
                            <span className="truncate text-[11px] text-white/25">
                              — {ev.artifact.title}
                            </span>
                          )}
                        </div>
                        <div className="mt-0.5 flex items-center gap-2 text-[10px] text-white/20">
                          <span className="font-mono">{ev.actorId?.slice(0, 8)}…</span>
                          <span>·</span>
                          <span>{new Date(ev.createdAt).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, color = "text-white/80" }: { label: string; value: number; icon: string; color?: string }) {
  return (
    <div className="rounded-2xl bg-white/[0.015] p-5 ring-1 ring-white/[0.04]">
      <div className="flex items-center justify-between">
        <span className="text-xl">{icon}</span>
      </div>
      <div className={`mt-2 text-2xl font-semibold ${color}`}>{value}</div>
      <div className="text-[10px] text-white/25">{label}</div>
    </div>
  );
}

function ActivityRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[12px] text-white/40">{label}</span>
      <span className="font-mono text-[12px] text-white/60">{value}</span>
    </div>
  );
}

export default function AdminPage() {
  return (
    <RoleGuard roles={["ADMIN"]}>
      <AdminInner />
    </RoleGuard>
  );
}