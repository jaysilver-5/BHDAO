// app/auth/page.tsx
"use client"

import React, { useMemo, useState } from "react"

type Json = Record<string, any>

function shortAddr(addr: string) {
  if (!addr) return ""
  return addr.length > 12 ? `${addr.slice(0, 6)}…${addr.slice(-4)}` : addr
}

function nowTime() {
  return new Date().toLocaleTimeString()
}

export default function AuthPlaygroundPage() {
  const API_BASE = useMemo(() => {
    return "https://bhdao-backend-production.up.railway.app/"
  }, [])

  // ─── Auth state ───
  const [wallet, setWallet] = useState("")
  const [nonceResp, setNonceResp] = useState<Json | null>(null)
  const [signature, setSignature] = useState("")
  const [verifyResp, setVerifyResp] = useState<Json | null>(null)
  const [meResp, setMeResp] = useState<Json | null>(null)
  const [token, setToken] = useState("")

  // ─── Artifacts state ───
  const [artifactForm, setArtifactForm] = useState({
    title: "",
    description: "",
    type: "document",
    sourceUrl: "",
    language: "en",
    license: "",
    tags: "",
  })
  const [submitResp, setSubmitResp] = useState<Json | null>(null)
  const [myArtifacts, setMyArtifacts] = useState<Json[]>([])
  const [publicArtifacts, setPublicArtifacts] = useState<Json[]>([])
  const [selectedArtifact, setSelectedArtifact] = useState<Json | null>(null)
  const [activityLog, setActivityLog] = useState<Json[]>([])

  // ─── UI state ───
  const [logLines, setLogLines] = useState<string[]>([])
  const [busy, setBusy] = useState<string | null>(null)
  const [err, setErr] = useState("")

  const isAuthed = !!token

  function pushLog(line: string) {
    setLogLines((prev) => [`[${nowTime()}] ${line}`, ...prev])
  }

  /**
   * LOGGING HELPERS
   * Requirement: "console the signature, token, and every other info in the console log card"
   * So:
   *  - UI console card (pushLog)
   *  - Browser devtools console (console.log/console.error)
   *  - NO REDACTION: full values printed (token/signature included)
   */
  function logCard(label: string, payload?: any) {
    const line =
      payload === undefined
        ? String(label)
        : `${label} ${typeof payload === "string" ? payload : JSON.stringify(payload, null, 2)}`
    pushLog(line)
  }

  function logDev(label: string, payload?: any) {
    if (payload === undefined) console.log(label)
    else console.log(label, payload)
  }

  function logAll(label: string, payload?: any) {
    logCard(label, payload)
    logDev(label, payload)
  }

  function logError(label: string, e: any) {
    const msg = e?.message ?? String(e)
    pushLog(`ERROR ${label}: ${msg}`)
    console.error(label, e)
  }

  function apiUrl(path: string) {
    if (!API_BASE) return path
    return `${API_BASE}${path.startsWith("/") ? path : `/${path}`}`
  }

  function authHeaders(): Record<string, string> {
    const h: Record<string, string> = { "Content-Type": "application/json" }
    if (token) h["Authorization"] = `Bearer ${token}`
    return h
  }

  // ═══════════════════════════════════════════
  // AUTH FUNCTIONS
  // ═══════════════════════════════════════════

  async function connectWallet() {
    setErr("")
    setBusy("connect")
    try {
      const eth = (window as any).ethereum
      if (!eth) throw new Error("No wallet found. Install MetaMask.")
      const accounts: string[] = await eth.request({ method: "eth_requestAccounts" })
      const addr = accounts?.[0]
      if (!addr) throw new Error("No account returned.")
      setWallet(addr)
      logAll("connectWallet: connected address =", addr)
    } catch (e: any) {
      setErr(e?.message ?? "Failed to connect wallet.")
      logError("connect", e)
    } finally {
      setBusy(null)
    }
  }

  async function requestNonce() {
    setErr("")
    setBusy("nonce")
    setNonceResp(null)
    try {
      if (!wallet) throw new Error("Connect wallet first.")

      const reqBody = { wallet }
      logAll("POST /auth/nonce request body =", reqBody)

      const res = await fetch(apiUrl("/auth/nonce"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(reqBody),
      })

      const data = await res.json().catch(() => ({}))

      logAll("POST /auth/nonce response meta =", { ok: res.ok, status: res.status })
      logAll("POST /auth/nonce response body =", data)

      if (!res.ok) throw new Error(data?.message ?? `Nonce failed (${res.status})`)

      setNonceResp(data)

      logAll("nonceResp.nonce =", data?.nonce)
      logAll("nonceResp.message =", data?.message)
    } catch (e: any) {
      setErr(e?.message ?? "Nonce failed.")
      logError("nonce", e)
    } finally {
      setBusy(null)
    }
  }

  async function signNonce() {
    setErr("")
    setBusy("sign")
    setSignature("")
    try {
      const eth = (window as any).ethereum
      if (!eth) throw new Error("No wallet found.")
      if (!wallet) throw new Error("Connect wallet first.")
      const message = nonceResp?.message
      if (!message) throw new Error("Request nonce first.")

      logAll("signNonce: wallet =", wallet)
      logAll("signNonce: message =", message)

      // personal_sign expects hex string in some providers; your backend message is plaintext
      const hexMessage =
        "0x" +
        Array.from(new TextEncoder().encode(message))
          .map((b) => b.toString(16).padStart(2, "0"))
          .join("")

      logAll("signNonce: hexMessage =", hexMessage)

      const sig: string = await eth.request({
        method: "personal_sign",
        params: [hexMessage, wallet],
      })

      setSignature(sig)

      // Requirement: show signature in console log card (FULL)
      logAll("signature =", sig)
      pushLog("Signed ✓")
    } catch (e: any) {
      setErr(e?.message ?? "Sign failed.")
      logError("sign", e)
    } finally {
      setBusy(null)
    }
  }

  async function verifySignature() {
    setErr("")
    setBusy("verify")
    setVerifyResp(null)
    try {
      if (!wallet || !signature) throw new Error("Complete previous steps first.")

      const reqBody = { wallet, signature }
      logAll("POST /auth/verify request body =", reqBody)

      const res = await fetch(apiUrl("/auth/verify"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(reqBody),
      })

      const data = await res.json().catch(() => ({}))

      logAll("POST /auth/verify response meta =", { ok: res.ok, status: res.status })
      logAll("POST /auth/verify response body =", data)

      if (!res.ok) throw new Error(data?.message ?? `Verify failed (${res.status})`)

      if (data.token) {
        setToken(data.token)
        // Requirement: show token in console log card (FULL)
        logAll("token =", data.token)
      } else {
        logAll("token =", "(no token returned)")
      }

      setVerifyResp(data)
      pushLog(`Verified ✓ — role: ${data.user?.role}`)
    } catch (e: any) {
      setErr(e?.message ?? "Verify failed.")
      logError("verify", e)
    } finally {
      setBusy(null)
    }
  }

  async function fetchMe() {
    setErr("")
    setBusy("me")
    setMeResp(null)
    try {
      const headers: Record<string, string> = {}
      if (token) headers["Authorization"] = `Bearer ${token}`
      logAll("GET /auth/me request headers =", headers)

      const res = await fetch(apiUrl("/auth/me"), {
        method: "GET",
        credentials: "include",
        headers,
      })
      const data = await res.json().catch(() => ({}))

      logAll("GET /auth/me response meta =", { ok: res.ok, status: res.status })
      logAll("GET /auth/me response body =", data)

      if (!res.ok) throw new Error(data?.message ?? `auth/me failed (${res.status})`)
      setMeResp(data)
      pushLog(`Me: ${JSON.stringify(data.user)}`)
    } catch (e: any) {
      setErr(e?.message ?? "Failed /auth/me.")
      logError("me", e)
    } finally {
      setBusy(null)
    }
  }

  // ═══════════════════════════════════════════
  // ARTIFACT FUNCTIONS
  // ═══════════════════════════════════════════

  async function submitArtifact() {
    setErr("")
    setBusy("submit")
    setSubmitResp(null)
    try {
      const body: any = {
        title: artifactForm.title,
        description: artifactForm.description,
        type: artifactForm.type,
        language: artifactForm.language || "en",
      }
      if (artifactForm.sourceUrl) body.sourceUrl = artifactForm.sourceUrl
      if (artifactForm.license) body.license = artifactForm.license
      if (artifactForm.tags)
        body.tags = artifactForm.tags
          .split(",")
          .map((t: string) => t.trim())
          .filter(Boolean)

      const headers = authHeaders()
      logAll("POST /artifacts request headers =", headers)
      logAll("POST /artifacts request body =", body)

      const res = await fetch(apiUrl("/artifacts"), {
        method: "POST",
        headers,
        credentials: "include",
        body: JSON.stringify(body),
      })
      const data = await res.json().catch(() => ({}))

      logAll("POST /artifacts response meta =", { ok: res.ok, status: res.status })
      logAll("POST /artifacts response body =", data)

      if (!res.ok) {
        const msg = Array.isArray(data?.message) ? data.message.join("; ") : data?.message ?? `Submit failed (${res.status})`
        throw new Error(msg)
      }

      setSubmitResp(data)
      pushLog(`Artifact submitted: ${data.id} — status: ${data.status}`)
      fetchMyArtifacts()
    } catch (e: any) {
      setErr(e?.message ?? "Submit failed.")
      logError("submit", e)
    } finally {
      setBusy(null)
    }
  }

  async function fetchMyArtifacts() {
    setErr("")
    setBusy("my-artifacts")
    try {
      const headers = authHeaders()
      logAll("GET /artifacts?mine=true request headers =", headers)

      const res = await fetch(apiUrl("/artifacts?mine=true"), {
        headers,
        credentials: "include",
      })
      const data = await res.json().catch(() => ({}))

      logAll("GET /artifacts?mine=true response meta =", { ok: res.ok, status: res.status })
      logAll("GET /artifacts?mine=true response body =", data)

      if (!res.ok) throw new Error(data?.message ?? `Fetch failed (${res.status})`)
      setMyArtifacts(data.items ?? [])
      pushLog(`My artifacts: ${data.items?.length ?? 0} found`)
    } catch (e: any) {
      setErr(e?.message ?? "Fetch failed.")
      logError("my-artifacts", e)
    } finally {
      setBusy(null)
    }
  }

  async function fetchPublicArtifacts() {
    setErr("")
    setBusy("public-artifacts")
    try {
      const headers = { "Content-Type": "application/json" }
      logAll("GET /artifacts request headers =", headers)

      const res = await fetch(apiUrl("/artifacts"), { headers })
      const data = await res.json().catch(() => ({}))

      logAll("GET /artifacts response meta =", { ok: res.ok, status: res.status })
      logAll("GET /artifacts response body =", data)

      if (!res.ok) throw new Error(data?.message ?? `Fetch failed (${res.status})`)
      setPublicArtifacts(data.items ?? [])
      pushLog(`Public (VERIFIED): ${data.items?.length ?? 0} found`)
    } catch (e: any) {
      setErr(e?.message ?? "Fetch failed.")
      logError("public", e)
    } finally {
      setBusy(null)
    }
  }

  async function viewArtifact(id: string) {
    setErr("")
    setBusy("view")
    setSelectedArtifact(null)
    setActivityLog([])
    try {
      const headers = authHeaders()
      logAll(`GET /artifacts/${id} request headers =`, headers)

      const res = await fetch(apiUrl(`/artifacts/${id}`), {
        headers,
        credentials: "include",
      })
      const data = await res.json().catch(() => ({}))

      logAll(`GET /artifacts/${id} response meta =`, { ok: res.ok, status: res.status })
      logAll(`GET /artifacts/${id} response body =`, data)

      if (!res.ok) throw new Error(data?.message ?? `View failed (${res.status})`)
      setSelectedArtifact(data)
      pushLog(`Viewing: ${data.title} [${data.status}]`)

      const actHeaders = authHeaders()
      logAll(`GET /artifacts/${id}/activity request headers =`, actHeaders)

      const actRes = await fetch(apiUrl(`/artifacts/${id}/activity`), {
        headers: actHeaders,
        credentials: "include",
      })
      const actData = await actRes.json().catch(() => [])

      logAll(`GET /artifacts/${id}/activity response meta =`, { ok: actRes.ok, status: actRes.status })
      logAll(`GET /artifacts/${id}/activity response body =`, actData)

      setActivityLog(Array.isArray(actData) ? actData : [])
    } catch (e: any) {
      setErr(e?.message ?? "View failed.")
      logError("view", e)
    } finally {
      setBusy(null)
    }
  }

  async function withdrawArtifact(id: string) {
    setErr("")
    setBusy("withdraw")
    try {
      const headers = authHeaders()
      logAll(`POST /artifacts/${id}/withdraw request headers =`, headers)

      const res = await fetch(apiUrl(`/artifacts/${id}/withdraw`), {
        method: "POST",
        headers,
        credentials: "include",
      })
      const data = await res.json().catch(() => ({}))

      logAll(`POST /artifacts/${id}/withdraw response meta =`, { ok: res.ok, status: res.status })
      logAll(`POST /artifacts/${id}/withdraw response body =`, data)

      if (!res.ok) throw new Error(data?.message ?? `Withdraw failed (${res.status})`)
      pushLog(`Withdrawn: ${id}`)
      setSelectedArtifact(data)
      fetchMyArtifacts()
    } catch (e: any) {
      setErr(e?.message ?? "Withdraw failed.")
      logError("withdraw", e)
    } finally {
      setBusy(null)
    }
  }

  async function uploadFile(artifactId: string, file: File) {
    setErr("")
    setBusy("upload")
    try {
      const formData = new FormData()
      formData.append("file", file)

      const headers: Record<string, string> = {}
      if (token) headers["Authorization"] = `Bearer ${token}`

      logAll(`POST /artifacts/${artifactId}/upload request headers =`, headers)
      logAll(`POST /artifacts/${artifactId}/upload file meta =`, {
        name: file.name,
        type: file.type,
        size: file.size,
      })

      const res = await fetch(apiUrl(`/artifacts/${artifactId}/upload`), {
        method: "POST",
        headers,
        credentials: "include",
        body: formData,
      })
      const data = await res.json().catch(() => ({}))

      logAll(`POST /artifacts/${artifactId}/upload response meta =`, { ok: res.ok, status: res.status })
      logAll(`POST /artifacts/${artifactId}/upload response body =`, data)

      if (!res.ok) {
        const msg = data?.message ?? `Upload failed (${res.status})`
        throw new Error(Array.isArray(msg) ? msg.join("; ") : msg)
      }

      pushLog(`File uploaded: ${data.fileUrl}`)
      setSelectedArtifact(data.artifact)
      fetchMyArtifacts()
    } catch (e: any) {
      setErr(e?.message ?? "Upload failed.")
      logError("upload", e)
    } finally {
      setBusy(null)
    }
  }

  // ═══════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════

  const nonce = nonceResp?.nonce ?? ""
  const statusColors: Record<string, string> = {
    COMMUNITY_REVIEW: "text-yellow-400 bg-yellow-400/10 border-yellow-400/30",
    EXPERT_REVIEW: "text-blue-400 bg-blue-400/10 border-blue-400/30",
    VERIFIED: "text-green-400 bg-green-400/10 border-green-400/30",
    REJECTED: "text-red-400 bg-red-400/10 border-red-400/30",
    WITHDRAWN: "text-white/40 bg-white/5 border-white/10",
    FLAGGED: "text-orange-400 bg-orange-400/10 border-orange-400/30",
    PENDING: "text-white/50 bg-white/5 border-white/10",
  }

  return (
    <main className="min-h-[100svh] bg-[#07060a] text-white">
      <div className="mx-auto w-full max-w-6xl px-5 py-8">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#ffb35a] via-[#f97316] to-[#7c2d12]" />
          <div>
            <div className="text-sm text-white/70">BHDAO</div>
            <h1 className="text-2xl font-semibold tracking-tight">Dev Playground</h1>
          </div>
          {isAuthed && (
            <div className="ml-auto flex items-center gap-2">
              <span className="rounded-lg border border-green-500/30 bg-green-500/10 px-2 py-1 text-xs text-green-400">
                {verifyResp?.user?.role ?? "MEMBER"}
              </span>
              <span className="font-mono text-xs text-white/60">{shortAddr(wallet)}</span>
            </div>
          )}
        </div>

        {err && (
          <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {err}
          </div>
        )}

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
          {/* ─── Left Column ─── */}
          <div className="space-y-6">
            {/* Auth Section */}
            <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <h2 className="text-sm font-semibold text-white/80">Authentication</h2>

              {!isAuthed ? (
                <div className="mt-4 space-y-3">
                  {/* Connect */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={connectWallet}
                      disabled={busy !== null}
                      className="rounded-xl bg-gradient-to-r from-[#ffb35a] to-[#f97316] px-4 py-2 text-sm font-semibold text-black disabled:opacity-60"
                    >
                      {wallet ? `✓ ${shortAddr(wallet)}` : "Connect Wallet"}
                    </button>
                    {wallet && !nonce && (
                      <button
                        onClick={requestNonce}
                        disabled={busy !== null}
                        className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm hover:bg-white/10 disabled:opacity-50"
                      >
                        {busy === "nonce" ? "..." : "Get Nonce"}
                      </button>
                    )}
                    {nonce && !signature && (
                      <button
                        onClick={signNonce}
                        disabled={busy !== null}
                        className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm hover:bg-white/10 disabled:opacity-50"
                      >
                        {busy === "sign" ? "..." : "Sign"}
                      </button>
                    )}
                    {signature && (
                      <button
                        onClick={verifySignature}
                        disabled={busy !== null}
                        className="rounded-lg bg-white px-3 py-2 text-sm font-semibold text-black hover:bg-white/90 disabled:opacity-50"
                      >
                        {busy === "verify" ? "..." : "Verify & Login"}
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-white/40">Connect → Get Nonce → Sign → Verify</p>
                </div>
              ) : (
                <div className="mt-3 flex items-center gap-3">
                  <span className="text-sm text-green-400">✓ Authenticated</span>
                  <button
                    onClick={fetchMe}
                    disabled={busy !== null}
                    className="rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs hover:bg-white/10 disabled:opacity-50"
                  >
                    GET /auth/me
                  </button>
                  {meResp && (
                    <span className="font-mono text-xs text-white/50">
                      {meResp.user?.wallet} ({meResp.user?.role})
                    </span>
                  )}
                </div>
              )}
            </section>

            {/* Submit Artifact */}
            {isAuthed && (
              <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <h2 className="text-sm font-semibold text-white/80">Submit Artifact</h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <input
                    placeholder="Title (min 3 chars)"
                    value={artifactForm.title}
                    onChange={(e) => setArtifactForm((f) => ({ ...f, title: e.target.value }))}
                    className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-white/30 focus:outline-none"
                  />
                  <select
                    value={artifactForm.type}
                    onChange={(e) => setArtifactForm((f) => ({ ...f, type: e.target.value }))}
                    className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white focus:border-white/30 focus:outline-none"
                  >
                    <option value="document">Document</option>
                    <option value="image">Image</option>
                    <option value="audio">Audio</option>
                    <option value="video">Video</option>
                    <option value="text">Text</option>
                  </select>
                  <textarea
                    placeholder="Description (min 10 chars)"
                    value={artifactForm.description}
                    onChange={(e) => setArtifactForm((f) => ({ ...f, description: e.target.value }))}
                    rows={2}
                    className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-white/30 focus:outline-none sm:col-span-2"
                  />
                  <input
                    placeholder="Source URL (optional)"
                    value={artifactForm.sourceUrl}
                    onChange={(e) => setArtifactForm((f) => ({ ...f, sourceUrl: e.target.value }))}
                    className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-white/30 focus:outline-none"
                  />
                  <input
                    placeholder="Tags (comma-separated)"
                    value={artifactForm.tags}
                    onChange={(e) => setArtifactForm((f) => ({ ...f, tags: e.target.value }))}
                    className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-white/30 focus:outline-none"
                  />
                  <input
                    placeholder="Language (en)"
                    value={artifactForm.language}
                    onChange={(e) => setArtifactForm((f) => ({ ...f, language: e.target.value }))}
                    className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-white/30 focus:outline-none"
                  />
                  <input
                    placeholder="License (optional)"
                    value={artifactForm.license}
                    onChange={(e) => setArtifactForm((f) => ({ ...f, license: e.target.value }))}
                    className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-white/30 focus:outline-none"
                  />
                </div>
                <div className="mt-4 flex items-center gap-3">
                  <button
                    onClick={submitArtifact}
                    disabled={busy !== null || !artifactForm.title || !artifactForm.description}
                    className="rounded-xl bg-gradient-to-r from-[#ffb35a] to-[#f97316] px-4 py-2 text-sm font-semibold text-black disabled:opacity-60"
                  >
                    {busy === "submit" ? "Submitting..." : "POST /artifacts"}
                  </button>
                  {submitResp && (
                    <span className="text-xs text-green-400">
                      ✓ Created: {submitResp.id?.slice(0, 8)}… [{submitResp.status}]
                    </span>
                  )}
                </div>
              </section>
            )}

            {/* Artifact Lists */}
            {isAuthed && (
              <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="flex items-center gap-3">
                  <h2 className="text-sm font-semibold text-white/80">Artifacts</h2>
                  <button
                    onClick={fetchMyArtifacts}
                    disabled={busy !== null}
                    className="rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs hover:bg-white/10 disabled:opacity-50"
                  >
                    {busy === "my-artifacts" ? "..." : "My Submissions"}
                  </button>
                  <button
                    onClick={fetchPublicArtifacts}
                    disabled={busy !== null}
                    className="rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs hover:bg-white/10 disabled:opacity-50"
                  >
                    {busy === "public-artifacts" ? "..." : "Public (Verified)"}
                  </button>
                </div>

                {/* My artifacts */}
                {myArtifacts.length > 0 && (
                  <div className="mt-4">
                    <div className="text-xs text-white/50 mb-2">My Submissions ({myArtifacts.length})</div>
                    <div className="space-y-2">
                      {myArtifacts.map((a) => (
                        <div
                          key={a.id}
                          className="flex items-center justify-between rounded-lg border border-white/10 bg-black/20 px-3 py-2"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="text-sm font-medium truncate">{a.title}</div>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span
                                className={`inline-block rounded border px-1.5 py-0.5 text-[10px] font-medium ${
                                  statusColors[a.status] ?? "text-white/50"
                                }`}
                              >
                                {a.status}
                              </span>
                              <span className="text-[10px] text-white/40">{a.type}</span>
                              <span className="text-[10px] text-white/30">{a.id.slice(0, 8)}…</span>
                            </div>
                          </div>
                          <div className="flex gap-1.5 ml-3">
                            <button
                              onClick={() => viewArtifact(a.id)}
                              className="rounded border border-white/10 bg-white/5 px-2 py-1 text-[10px] hover:bg-white/10"
                            >
                              View
                            </button>
                            {(a.status === "COMMUNITY_REVIEW" || a.status === "EXPERT_REVIEW") && (
                              <button
                                onClick={() => withdrawArtifact(a.id)}
                                className="rounded border border-red-500/20 bg-red-500/10 px-2 py-1 text-[10px] text-red-400 hover:bg-red-500/20"
                              >
                                Withdraw
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Public artifacts */}
                {publicArtifacts.length > 0 && (
                  <div className="mt-4">
                    <div className="text-xs text-white/50 mb-2">Public / Verified ({publicArtifacts.length})</div>
                    <div className="space-y-2">
                      {publicArtifacts.map((a) => (
                        <div
                          key={a.id}
                          className="flex items-center justify-between rounded-lg border border-white/10 bg-black/20 px-3 py-2"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="text-sm font-medium truncate">{a.title}</div>
                            <span className="text-[10px] text-white/40">
                              {a.type} · {a.id.slice(0, 8)}…
                            </span>
                          </div>
                          <button
                            onClick={() => viewArtifact(a.id)}
                            className="rounded border border-white/10 bg-white/5 px-2 py-1 text-[10px] hover:bg-white/10"
                          >
                            View
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </section>
            )}

            {/* Selected Artifact Detail */}
            {selectedArtifact && (
              <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-white/80">Artifact Detail</h2>
                  <button
                    onClick={() => {
                      setSelectedArtifact(null)
                      setActivityLog([])
                    }}
                    className="text-xs text-white/40 hover:text-white/70"
                  >
                    Close
                  </button>
                </div>
                <div className="mt-3 space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{selectedArtifact.title}</span>
                    <span
                      className={`inline-block rounded border px-1.5 py-0.5 text-[10px] font-medium ${
                        statusColors[selectedArtifact.status] ?? ""
                      }`}
                    >
                      {selectedArtifact.status}
                    </span>
                  </div>
                  <p className="text-white/60">{selectedArtifact.description}</p>
                  <div className="grid grid-cols-2 gap-2 text-xs text-white/50">
                    <div>
                      Type: <span className="text-white/80">{selectedArtifact.type}</span>
                    </div>
                    <div>
                      Language: <span className="text-white/80">{selectedArtifact.language}</span>
                    </div>
                    <div>
                      ID: <span className="font-mono text-white/80">{selectedArtifact.id}</span>
                    </div>
                    <div>
                      Created:{" "}
                      <span className="text-white/80">{new Date(selectedArtifact.createdAt).toLocaleString()}</span>
                    </div>
                    {selectedArtifact.reviewEndsAt && (
                      <div>
                        Review ends:{" "}
                        <span className="text-white/80">{new Date(selectedArtifact.reviewEndsAt).toLocaleString()}</span>
                      </div>
                    )}
                    {selectedArtifact.sourceUrl && (
                      <div>
                        Source: <span className="text-white/80 break-all">{selectedArtifact.sourceUrl}</span>
                      </div>
                    )}
                    {selectedArtifact.tags?.length > 0 && (
                      <div className="col-span-2">
                        Tags:{" "}
                        {selectedArtifact.tags.map((t: string) => (
                          <span key={t} className="mr-1 rounded bg-white/10 px-1.5 py-0.5 text-white/70">
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* File preview / upload */}
                  <div className="mt-3 rounded-lg border border-white/10 bg-black/20 p-3">
                    {selectedArtifact.fileUrl ? (
                      <div>
                        <div className="text-xs text-white/50 mb-2">Uploaded file</div>
                        {selectedArtifact.type === "image" ? (
                          <img
                            src={selectedArtifact.fileUrl}
                            alt={selectedArtifact.title}
                            className="max-h-48 rounded-lg object-contain"
                          />
                        ) : selectedArtifact.type === "audio" ? (
                          <audio controls src={selectedArtifact.fileUrl} className="w-full" />
                        ) : selectedArtifact.type === "video" ? (
                          <video controls src={selectedArtifact.fileUrl} className="max-h-48 rounded-lg" />
                        ) : (
                          <a
                            href={selectedArtifact.fileUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-sm text-blue-400 underline break-all"
                          >
                            {selectedArtifact.fileUrl}
                          </a>
                        )}
                      </div>
                    ) : (
                      <div>
                        <div className="text-xs text-white/50 mb-2">No file uploaded</div>
                        {(selectedArtifact.status === "COMMUNITY_REVIEW" || selectedArtifact.status === "PENDING") && (
                          <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-xs hover:bg-white/10">
                            <span>{busy === "upload" ? "Uploading..." : "Upload file"}</span>
                            <input
                              type="file"
                              className="hidden"
                              disabled={busy !== null}
                              onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) uploadFile(selectedArtifact.id, file)
                              }}
                            />
                          </label>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Activity log */}
                {activityLog.length > 0 && (
                  <div className="mt-4">
                    <div className="text-xs text-white/50 mb-2">Activity ({activityLog.length} events)</div>
                    <div className="space-y-1">
                      {activityLog.map((ev) => (
                        <div key={ev.id} className="flex items-center gap-2 rounded bg-black/20 px-2 py-1.5 text-xs">
                          <span className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[10px]">{ev.type}</span>
                          <span className="text-white/40">{new Date(ev.createdAt).toLocaleString()}</span>
                          {ev.payload && <span className="text-white/30 truncate">{JSON.stringify(ev.payload)}</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </section>
            )}
          </div>

          {/* ─── Right Column: Console ─── */}
          <aside className="rounded-2xl border border-white/10 bg-white/5 p-4 h-fit lg:sticky lg:top-8">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-semibold text-white/60">Console</h2>
              <button onClick={() => setLogLines([])} className="text-[10px] text-white/40 hover:text-white/70">
                Clear
              </button>
            </div>
            <div className="mt-3 max-h-[70vh] overflow-auto rounded-lg border border-white/10 bg-black/30 p-2 font-mono text-[11px] text-white/70">
              {logLines.length === 0 ? (
                <div className="text-white/30">No logs yet.</div>
              ) : (
                <div className="space-y-1.5">
                  {logLines.map((l, i) => (
                    <div key={i} className="whitespace-pre-wrap break-words">
                      {l}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}