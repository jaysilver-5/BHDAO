// const BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:3000";
const BASE = "https://bhdao-backend-production.up.railway.app";

type Method = "GET" | "POST" | "PATCH" | "DELETE";

async function request<T = any>(
  path: string,
  opts: { method?: Method; body?: any; token?: string | null } = {},
): Promise<T> {
  const { method = "GET", body, token } = opts;
  const headers: Record<string, string> = {};

  if (body) headers["Content-Type"] = "application/json";
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    credentials: "include",
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const msg = Array.isArray(data?.message)
      ? data.message.join("; ")
      : data?.message ?? `Request failed (${res.status})`;
    throw new Error(msg);
  }

  return data as T;
}

// ─── Auth ───
export const api = {
  auth: {
    nonce: (wallet: string) =>
      request<{ wallet: string; nonce: string; message: string; expiresAt: string }>(
        "/auth/nonce", { method: "POST", body: { wallet } },
      ),
    verify: (wallet: string, signature: string) =>
      request<{ ok: boolean; token: string; user: { id: string; wallet: string; role: string } }>(
        "/auth/verify", { method: "POST", body: { wallet, signature } },
      ),
    me: (token: string) =>
      request<{ ok: boolean; user: { userId: string; wallet: string; role: string } }>(
        "/auth/me", { token },
      ),
  },

  // ─── Artifacts ───
  artifacts: {
    list: (params?: string) =>
      request<{ items: any[]; total: number; page: number; limit: number }>(
        `/artifacts${params ? `?${params}` : ""}`,
      ),
    listMine: (token: string, params?: string) =>
      request<{ items: any[]; total: number; page: number; limit: number }>(
        `/artifacts?mine=true${params ? `&${params}` : ""}`, { token },
      ),
    listByStatus: (status: string, token: string) =>
      request<{ items: any[]; total: number }>(`/artifacts?status=${status}`, { token }),
    get: (id: string, token?: string | null) =>
      request(`/artifacts/${id}`, { token: token ?? undefined }),
    create: (body: any, token: string) =>
      request("/artifacts", { method: "POST", body, token }),
    update: (id: string, body: any, token: string) =>
      request(`/artifacts/${id}`, { method: "PATCH", body, token }),
    withdraw: (id: string, token: string) =>
      request(`/artifacts/${id}/withdraw`, { method: "POST", token }),
    activity: (id: string, token?: string | null) =>
      request<any[]>(`/artifacts/${id}/activity`, { token: token ?? undefined }),
      review: (params?: string) =>
    request<{ items: any[]; total: number; page: number; limit: number }>(
      `/artifacts/review${params ? `?${params}` : ""}`,
    ),
  },

  // ─── Votes ───
  votes: {
    cast: (id: string, value: "APPROVE" | "REJECT", token: string) =>
      request(`/artifacts/${id}/votes`, { method: "POST", body: { value }, token }),
    summary: (id: string) =>
      request<{ approve: number; reject: number; total: number; ratio: number }>(
        `/artifacts/${id}/votes/summary`,
      ),
    mine: (id: string, token: string) =>
      request<{ voted: boolean; value: string | null }>(
        `/artifacts/${id}/votes/mine`, { token },
      ),
  },

  // ─── Comments ───
  comments: {
    list: (id: string, page = 1) =>
      request<{ items: any[]; total: number }>(`/artifacts/${id}/comments?page=${page}`),
    create: (id: string, body: string, token: string) =>
      request(`/artifacts/${id}/comments`, { method: "POST", body: { body }, token }),
  },

  // ─── Flags ───
  flags: {
    create: (id: string, reason: string, token: string, details?: string) =>
      request(`/artifacts/${id}/flags`, { method: "POST", body: { reason, details }, token }),
  },

  // ─── Expert ───
  expert: {
    queue: (token: string) =>
      request<{ items: any[]; total: number }>("/expert/queue", { token }),
    review: (id: string, decision: string, token: string, notes?: string) =>
      request(`/expert/artifacts/${id}/review`, { method: "POST", body: { decision, notes }, token }),
    reviews: (id: string, token: string) =>
      request<any[]>(`/expert/artifacts/${id}/reviews`, { token }),
  },

  // ─── Chain ───
  chain: {
    proof: (id: string) => request(`/chain/artifacts/${id}/proof`),
    anchor: (id: string, token: string) =>
      request(`/chain/artifacts/${id}/anchor`, { method: "POST", token }),
  },

  // ─── IPFS ───
  ipfs: {
    info: (id: string) => request(`/ipfs/artifacts/${id}`),
    pin: (id: string, token: string) =>
      request(`/ipfs/artifacts/${id}/pin`, { method: "POST", token }),
  },

  // ─── Admin ───
  admin: {
    stats: (token: string) => request("/admin/stats", { token }),
    users: (token: string, params?: string) =>
      request(`/admin/users${params ? `?${params}` : ""}`, { token }),
    setRole: (userId: string, role: string, token: string) =>
      request(`/admin/users/${userId}/role`, { method: "PATCH", body: { role }, token }),
    events: (token: string, limit = 50) =>
      request(`/admin/events?limit=${limit}`, { token }),
  },
};