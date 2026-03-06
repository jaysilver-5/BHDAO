// BHDAO Design Tokens — Dark + Gold Accent System
// Use with Tailwind arbitrary values: bg-[--gold], text-[--gold-dim], etc.
// Or import constants directly in components.

export const theme = {
  // Gold spectrum
  gold: "#e8c36a",
  goldBright: "#f5d98a",
  goldDim: "#c9a44e",
  goldMuted: "rgba(232,195,106,0.15)",
  goldSubtle: "rgba(232,195,106,0.06)",
  goldRing: "rgba(232,195,106,0.12)",

  // Surfaces
  bg: "#050407",
  surface1: "rgba(255,255,255,0.025)",
  surface2: "rgba(255,255,255,0.04)",
  surface3: "rgba(255,255,255,0.06)",
  surfaceHover: "rgba(255,255,255,0.08)",

  // Text
  textPrimary: "#f0ede6",
  textSecondary: "rgba(255,255,255,0.55)",
  textTertiary: "rgba(255,255,255,0.30)",
  textGhost: "rgba(255,255,255,0.15)",

  // Rings / borders
  ring1: "rgba(255,255,255,0.06)",
  ring2: "rgba(255,255,255,0.10)",
  ring3: "rgba(255,255,255,0.16)",
  ringGold: "rgba(232,195,106,0.20)",

  // Status colors
  statusVerified: { bg: "rgba(34,197,94,0.08)", text: "#4ade80", ring: "rgba(34,197,94,0.18)" },
  statusCommunity: { bg: "rgba(234,179,8,0.08)", text: "#facc15", ring: "rgba(234,179,8,0.18)" },
  statusExpert: { bg: "rgba(96,165,250,0.08)", text: "#60a5fa", ring: "rgba(96,165,250,0.18)" },
  statusRejected: { bg: "rgba(239,68,68,0.08)", text: "#f87171", ring: "rgba(239,68,68,0.18)" },
  statusFlagged: { bg: "rgba(251,146,60,0.08)", text: "#fb923c", ring: "rgba(251,146,60,0.18)" },
  statusWithdrawn: { bg: "rgba(255,255,255,0.03)", text: "rgba(255,255,255,0.30)", ring: "rgba(255,255,255,0.06)" },
} as const;

// Gradient presets
export const gradients = {
  goldShine: "linear-gradient(135deg, #e8c36a 0%, #c9a44e 50%, #e8c36a 100%)",
  goldSubtle: "linear-gradient(135deg, rgba(232,195,106,0.12) 0%, rgba(180,130,50,0.04) 100%)",
  cardImage: "linear-gradient(135deg, rgba(232,195,106,0.15), rgba(180,90,50,0.1))",
  cardAudio: "linear-gradient(135deg, rgba(100,140,255,0.12), rgba(160,100,220,0.08))",
  cardVideo: "linear-gradient(135deg, rgba(220,80,80,0.12), rgba(200,107,60,0.08))",
  cardDocument: "linear-gradient(135deg, rgba(100,200,150,0.1), rgba(80,160,120,0.06))",
  heroGlow: "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(232,195,106,0.08) 0%, transparent 70%)",
} as const;

// Type icon map
export const typeIcons: Record<string, string> = {
  image: "🖼",
  audio: "🎵",
  video: "🎬",
  document: "📄",
};

// Status display config
export const statusConfig: Record<string, { label: string; classes: string }> = {
  VERIFIED: { label: "Verified", classes: "bg-green-500/8 text-green-400 ring-green-500/18" },
  COMMUNITY_REVIEW: { label: "Community Review", classes: "bg-yellow-500/8 text-yellow-400 ring-yellow-500/18" },
  EXPERT_REVIEW: { label: "Expert Review", classes: "bg-blue-500/8 text-blue-400 ring-blue-500/18" },
  REJECTED: { label: "Rejected", classes: "bg-red-500/8 text-red-400 ring-red-500/18" },
  FLAGGED: { label: "Flagged", classes: "bg-orange-500/8 text-orange-400 ring-orange-500/18" },
  WITHDRAWN: { label: "Withdrawn", classes: "bg-white/3 text-white/30 ring-white/6" },
};