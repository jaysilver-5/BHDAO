"use client";

import { useState } from "react";

const REASONS = [
  { value: "MISINFO", label: "Misinformation", desc: "Inaccurate or misleading content" },
  { value: "COPYRIGHT", label: "Copyright", desc: "Unauthorized use of copyrighted material" },
  { value: "DUPLICATE", label: "Duplicate", desc: "Already exists in the archive" },
  { value: "OTHER", label: "Other", desc: "Another reason" },
];

interface FlagModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (reason: string, details: string) => Promise<void>;
}

export default function FlagModal({ open, onClose, onSubmit }: FlagModalProps) {
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  if (!open) return null;

  const handleSubmit = async () => {
    if (!reason) return setErr("Select a reason");
    setBusy(true);
    setErr("");
    try {
      await onSubmit(reason, details);
      onClose();
    } catch (e: any) {
      setErr(e.message ?? "Failed to flag");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-md rounded-2xl bg-[#0e0d15] p-6 ring-1 ring-white/8">
        <div className="flex items-center justify-between">
          <h3 className="text-[15px] font-semibold text-white">Flag this artifact</h3>
          <button onClick={onClose} className="text-white/30 transition hover:text-white/60">✕</button>
        </div>

        <p className="mt-2 text-[12px] text-white/35">
          Help maintain archive integrity. Select a reason and provide details.
        </p>

        {/* Reason selector */}
        <div className="mt-5 space-y-2">
          {REASONS.map((r) => (
            <button
              key={r.value}
              onClick={() => setReason(r.value)}
              className={`w-full rounded-xl px-4 py-3 text-left transition ring-1 ${
                reason === r.value
                  ? "bg-[#e8c36a]/8 ring-[#e8c36a]/25 text-white"
                  : "bg-white/2 ring-white/5 text-white/60 hover:bg-white/4 hover:ring-white/10"
              }`}
            >
              <div className="text-[12px] font-medium">{r.label}</div>
              <div className="text-[11px] text-white/30">{r.desc}</div>
            </button>
          ))}
        </div>

        {/* Details */}
        <textarea
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          placeholder="Provide details (optional)…"
          rows={3}
          className="mt-4 w-full rounded-xl bg-white/3 px-4 py-3 text-[12px] text-white/70 outline-none ring-1 ring-white/6 placeholder:text-white/20 focus:ring-white/12"
        />

        {err && <div className="mt-3 text-[11px] text-red-400">{err}</div>}

        <div className="mt-5 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl bg-white/4 py-2.5 text-[12px] font-medium text-white/50 ring-1 ring-white/6 transition hover:bg-white/6"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={busy || !reason}
            className="flex-1 rounded-xl bg-red-500/15 py-2.5 text-[12px] font-medium text-red-400 ring-1 ring-red-500/20 transition hover:bg-red-500/25 disabled:opacity-40"
          >
            {busy ? "Submitting…" : "Submit Flag"}
          </button>
        </div>
      </div>
    </div>
  );
}