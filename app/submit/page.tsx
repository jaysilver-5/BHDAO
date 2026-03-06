"use client";

import Nav from "@/components/Nav";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";

const TYPES = ["image", "audio", "video", "document"];
const LANGUAGES = ["en", "es", "fr", "pt", "ar", "sw", "ha", "yo", "zu", "other"];

export default function SubmitPage() {
  const { user, token, loading } = useAuth();
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("image");
  const [sourceUrl, setSourceUrl] = useState("");
  const [language, setLanguage] = useState("en");
  const [license, setLicense] = useState("Public Domain");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  // File upload
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadDone, setUploadDone] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // Created artifact
  const [artifactId, setArtifactId] = useState<string | null>(null);

  // ─── Tag handling ───
  const addTag = () => {
    const t = tagInput.trim().toLowerCase().replace(/[^a-z0-9-]/g, "");
    if (t && !tags.includes(t) && tags.length < 10) {
      setTags([...tags, t]);
      setTagInput("");
    }
  };

  const removeTag = (t: string) => setTags(tags.filter((x) => x !== t));

  // ─── File handling ───
  const handleFile = (f: File) => {
    setFile(f);
    if (f.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(f);
    } else {
      setPreview(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  // ─── Step 1 → Create artifact ───
  const handleCreate = async () => {
    if (!token) return;
    if (title.length < 3) return setErr("Title must be at least 3 characters");
    if (description.length < 10) return setErr("Description must be at least 10 characters");

    setBusy(true);
    setErr("");
    try {
      const res = await api.artifacts.create(
        { title, description, type, sourceUrl: sourceUrl || undefined, language, license, tags },
        token,
      );
      setArtifactId(res.id);
      setStep(2);
    } catch (e: any) {
      setErr(e.message ?? "Failed to create artifact");
    } finally {
      setBusy(false);
    }
  };

  // ─── Step 2 → Upload file ───
  const handleUpload = async () => {
    if (!token || !artifactId || !file) return;
    setUploading(true);
    setErr("");
    try {
      await api.artifacts.upload(artifactId, file, token);
      setUploadDone(true);
      setStep(3);
    } catch (e: any) {
      setErr(e.message ?? "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  // ─── Auth guard ───
  if (!loading && !user) {
    return (
      <div className="min-h-screen">
        <Nav />
        <div className="mx-auto max-w-2xl px-5 py-20 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#e8c36a]/[0.06] ring-1 ring-[#e8c36a]/10">
            <span className="text-2xl">🔒</span>
          </div>
          <h2 className="mt-5 text-lg font-semibold text-white/80">Connect your wallet</h2>
          <p className="mt-2 text-[13px] text-white/35">You need to connect a wallet to submit artifacts.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Nav />

      {/* Hero glow */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[300px]"
        style={{ background: "radial-gradient(ellipse 40% 30% at 50% 0%, rgba(232,195,106,0.05) 0%, transparent 70%)" }}
      />

      <div className="relative mx-auto max-w-2xl px-5 py-10">
        {/* Progress */}
        <div className="mb-8 flex items-center gap-2">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-semibold transition ${
                  step >= s
                    ? "bg-[#e8c36a]/15 text-[#e8c36a] ring-1 ring-[#e8c36a]/25"
                    : "bg-white/3 text-white/20 ring-1 ring-white/5"
                }`}
              >
                {step > s ? "✓" : s}
              </div>
              {s < 3 && (
                <div className={`h-px w-12 ${step > s ? "bg-[#e8c36a]/20" : "bg-white/5"}`} />
              )}
            </div>
          ))}
          <span className="ml-3 text-[11px] text-white/25">
            {step === 1 ? "Details" : step === 2 ? "Upload file" : "Confirmation"}
          </span>
        </div>

        <h1 className="text-2xl font-semibold tracking-tight text-[#f0ede6]">
          {step === 1 ? "Submit an artifact" : step === 2 ? "Upload file" : "Submitted!"}
        </h1>
        <p className="mt-2 text-[13px] text-white/35">
          {step === 1
            ? "Describe the historical artifact you want to add to the archive."
            : step === 2
              ? "Attach the file for this artifact. You can skip this and add it later."
              : "Your artifact is now in community review."}
        </p>

        {/* ─── Step 1: Details ─── */}
        {step === 1 && (
          <div className="mt-8 space-y-5">
            {/* Title */}
            <Field label="Title *">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. 1963 March on Washington Photograph"
                className="input-field"
              />
            </Field>

            {/* Description */}
            <Field label="Description *">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the artifact, its historical context, and significance…"
                rows={4}
                className="input-field resize-none"
              />
            </Field>

            {/* Type */}
            <Field label="Type">
              <div className="flex gap-2">
                {TYPES.map((t) => (
                  <button
                    key={t}
                    onClick={() => setType(t)}
                    className={`rounded-xl px-4 py-2 text-[12px] font-medium capitalize transition ring-1 ${
                      type === t
                        ? "bg-[#e8c36a]/10 text-[#e8c36a] ring-[#e8c36a]/20"
                        : "bg-white/[0.02] text-white/40 ring-white/[0.05] hover:bg-white/[0.04]"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </Field>

            {/* Source URL */}
            <Field label="Source URL (optional)">
              <input
                value={sourceUrl}
                onChange={(e) => setSourceUrl(e.target.value)}
                placeholder="https://example.com/archive/..."
                className="input-field"
              />
            </Field>

            {/* Language + License row */}
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Language">
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="input-field appearance-none"
                >
                  {LANGUAGES.map((l) => (
                    <option key={l} value={l}>
                      {l.toUpperCase()}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="License">
                <input
                  value={license}
                  onChange={(e) => setLicense(e.target.value)}
                  placeholder="Public Domain"
                  className="input-field"
                />
              </Field>
            </div>

            {/* Tags */}
            <Field label="Tags">
              <div className="flex gap-2">
                <input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") { e.preventDefault(); addTag(); }
                  }}
                  placeholder="Add a tag and press Enter…"
                  className="input-field flex-1"
                />
                <button
                  onClick={addTag}
                  className="rounded-xl bg-white/[0.04] px-4 text-[12px] text-white/40 ring-1 ring-white/[0.06] transition hover:bg-white/[0.06]"
                >
                  Add
                </button>
              </div>
              {tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {tags.map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center gap-1 rounded-full bg-[#e8c36a]/[0.06] px-2.5 py-0.5 text-[10px] font-medium text-[#e8c36a]/60 ring-1 ring-[#e8c36a]/10"
                    >
                      {t}
                      <button onClick={() => removeTag(t)} className="text-[#e8c36a]/30 hover:text-[#e8c36a]/60">✕</button>
                    </span>
                  ))}
                </div>
              )}
            </Field>

            {err && <div className="text-[12px] text-red-400">{err}</div>}

            <button
              onClick={handleCreate}
              disabled={busy}
              className="w-full rounded-xl bg-gradient-to-r from-[#e8c36a] to-[#c9a44e] py-3 text-[13px] font-semibold text-black transition hover:shadow-[0_0_20px_rgba(232,195,106,0.15)] disabled:opacity-50"
            >
              {busy ? "Creating…" : "Continue → Upload File"}
            </button>
          </div>
        )}

        {/* ─── Step 2: Upload ─── */}
        {step === 2 && (
          <div className="mt-8 space-y-5">
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => fileRef.current?.click()}
              className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed py-16 transition ${
                file
                  ? "border-[#e8c36a]/20 bg-[#e8c36a]/[0.02]"
                  : "border-white/[0.06] bg-white/[0.01] hover:border-white/[0.1] hover:bg-white/[0.02]"
              }`}
            >
              <input
                ref={fileRef}
                type="file"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
              />

              {preview ? (
                <img src={preview} alt="" className="mb-4 max-h-48 rounded-xl object-contain" />
              ) : file ? (
                <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-white/[0.04] text-3xl ring-1 ring-white/[0.06]">
                  📎
                </div>
              ) : (
                <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-white/[0.03] text-3xl ring-1 ring-white/[0.05]">
                  ☁️
                </div>
              )}

              {file ? (
                <div className="text-center">
                  <div className="text-[13px] font-medium text-white/60">{file.name}</div>
                  <div className="mt-1 text-[11px] text-white/25">{(file.size / 1024 / 1024).toFixed(2)} MB</div>
                  <button
                    onClick={(e) => { e.stopPropagation(); setFile(null); setPreview(null); }}
                    className="mt-2 text-[11px] text-red-400/60 hover:text-red-400"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <div className="text-[13px] text-white/40">Drop a file here or click to browse</div>
                  <div className="mt-1 text-[11px] text-white/20">Images, audio, video, or documents</div>
                </div>
              )}
            </div>

            {err && <div className="text-[12px] text-red-400">{err}</div>}

            <div className="flex gap-3">
              <button
                onClick={() => setStep(3)}
                className="flex-1 rounded-xl bg-white/[0.03] py-3 text-[13px] font-medium text-white/40 ring-1 ring-white/[0.06] transition hover:bg-white/[0.05]"
              >
                Skip for now
              </button>
              <button
                onClick={handleUpload}
                disabled={!file || uploading}
                className="flex-1 rounded-xl bg-gradient-to-r from-[#e8c36a] to-[#c9a44e] py-3 text-[13px] font-semibold text-black transition hover:shadow-[0_0_20px_rgba(232,195,106,0.15)] disabled:opacity-40"
              >
                {uploading ? "Uploading…" : "Upload & Continue"}
              </button>
            </div>
          </div>
        )}

        {/* ─── Step 3: Confirmation ─── */}
        {step === 3 && (
          <div className="mt-8 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-green-500/[0.06] ring-1 ring-green-500/15">
              <span className="text-4xl">✦</span>
            </div>
            <h2 className="mt-5 text-lg font-semibold text-[#f0ede6]">Artifact submitted</h2>
            <p className="mt-2 text-[13px] text-white/35">
              Your artifact is now in community review. Members have 7 days to vote.
              {!uploadDone && " You can still upload a file from the artifact detail page."}
            </p>

            <div className="mt-8 flex justify-center gap-3">
              <button
                onClick={() => router.push(`/artifact/${artifactId}`)}
                className="rounded-xl bg-[#e8c36a]/10 px-6 py-2.5 text-[13px] font-medium text-[#e8c36a] ring-1 ring-[#e8c36a]/20 transition hover:bg-[#e8c36a]/15"
              >
                View artifact
              </button>
              <button
                onClick={() => router.push("/dashboard")}
                className="rounded-xl bg-white/[0.03] px-6 py-2.5 text-[13px] font-medium text-white/50 ring-1 ring-white/[0.06] transition hover:bg-white/[0.05]"
              >
                My artifacts
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Shared input styles via global CSS or inline */}
      <style jsx global>{`
        .input-field {
          width: 100%;
          border-radius: 0.75rem;
          background: rgba(255,255,255,0.025);
          padding: 0.65rem 1rem;
          font-size: 0.8125rem;
          color: rgba(255,255,255,0.7);
          outline: none;
          box-shadow: inset 0 0 0 1px rgba(255,255,255,0.06);
          transition: box-shadow 0.15s;
        }
        .input-field::placeholder { color: rgba(255,255,255,0.15); }
        .input-field:focus { box-shadow: inset 0 0 0 1px rgba(232,195,106,0.2); }
        .input-field option { background: #0e0d15; color: rgba(255,255,255,0.7); }
      `}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-widest text-white/25">
        {label}
      </label>
      {children}
    </div>
  );
}
