// NG Workshop Brand Theme — shared across all animations
import { loadFont } from "@remotion/google-fonts/Heebo";

// ─── Brand Colors ─────────────────────────────────────────────────────

export const theme = {
  primary: "#8ABF3B",
  primaryLight: "#B6D66B",
  primaryGlow: "rgba(138, 191, 59, 0.4)",
  primaryGlowStrong: "rgba(138, 191, 59, 0.6)",

  bgDark: "#0a0a0f",
  bgCard: "#12121a",

  textWhite: "#ffffff",
  textMuted: "#a0a0b0",

  borderDark: "#2a2a3a",

  connectionLine: "rgba(255, 255, 255, 0.15)",
  connectionActive: "rgba(182, 214, 107, 0.8)",
  weakElement: "rgba(255, 255, 255, 0.06)",
} satisfies Record<string, string>;

// ─── Font ─────────────────────────────────────────────────────────────

const heebo = loadFont("normal", {
  weights: ["400", "700"],
  subsets: ["hebrew", "latin"],
});

export const fontFamily = heebo.fontFamily;
