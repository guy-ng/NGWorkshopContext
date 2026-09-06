// LLM Parameter Growth — 3 OpenAI milestones (line graph)
import { theme } from "../theme";

export const CANVAS = { width: 1920, height: 1080 };
export const FPS = 30;

// ─── The 3 models ────────────────────────────────────────────────────
export interface ModelPoint {
  model: string;
  year: string;
  paramsBillions: number;
  label: string;
}

export const MODELS: ModelPoint[] = [
  { model: "GPT-3", year: "2020", paramsBillions: 175, label: "175B" },
  { model: "GPT-4", year: "2023", paramsBillions: 1760, label: "1.76T" },
  { model: "GPT-5", year: "2025", paramsBillions: 4000, label: "4T" },
];

// ─── Timing (seconds) ────────────────────────────────────────────────
export const TIMING = {
  axesIn: 0.8,
  // Line draws through each point sequentially
  lineStart: 1.0,
  dot1: 1.0,
  dot2: 2.5,
  dot3: 4.0,
  holdEnd: 6,
};

export const TOTAL_FRAMES = TIMING.holdEnd * FPS;

// ─── Chart layout ───────────────────────────────────────────────────
export const CHART = {
  left: 260,
  right: 1660,
  top: 180,
  bottom: 880,
  get width() {
    return this.right - this.left;
  },
  get height() {
    return this.bottom - this.top;
  },
};

// ─── X mapping — evenly spaced for 3 points ─────────────────────────
export function pointX(index: number): number {
  const padding = 100;
  const usable = CHART.width - padding * 2;
  return CHART.left + padding + (index / 2) * usable;
}

// ─── Y mapping — linear 0 → 4500B ──────────────────────────────────
export const PARAM_MAX = 4500;
export function paramToY(paramsBillions: number): number {
  const t = paramsBillions / PARAM_MAX;
  return CHART.bottom - t * CHART.height;
}

// ─── Colors ─────────────────────────────────────────────────────────
export const COLORS = {
  background: theme.bgDark,
  accent: theme.primaryLight,
  axis: "rgba(255,255,255,0.25)",
  axisLabel: theme.textMuted,
  gridLine: "rgba(255,255,255,0.06)",
  title: theme.textWhite,
  text: theme.textWhite,
  openai: "#10A37F",
  line: "#10A37F",
  lineGlow: "rgba(16, 163, 127, 0.4)",
};

// ─── Y-axis ticks ───────────────────────────────────────────────────
export const Y_TICKS = [
  { value: 0, label: "0" },
  { value: 500, label: "500B" },
  { value: 1000, label: "1T" },
  { value: 2000, label: "2T" },
  { value: 3000, label: "3T" },
  { value: 4000, label: "4T" },
];
