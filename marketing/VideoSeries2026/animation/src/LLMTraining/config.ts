// Data → Weights → Model — compact animation config
import { theme } from "../theme";

export const COLORS = {
  background: theme.bgDark,
  primary: theme.primary,
  primaryLight: theme.primaryLight,
  primaryGlow: theme.primaryGlow,
  text: theme.textWhite,
  textDim: theme.textMuted,

  data: "#4A90D9",
  weight: theme.primary,
  weightNeg: "#E06060",
  model: theme.primaryLight,
};

export const CANVAS = { width: 1920, height: 1080 };
export const FPS = 30;

// 6 seconds total
export const TIMING = {
  // Data particles fly toward weight grid (0–3s)
  dataToWeights: 3,
  // Weight grid compresses into model icon (3–5s)
  weightsToModel: 5,
  // Hold (5–6s)
  end: 6,
};

export const TOTAL_FRAMES = TIMING.end * FPS; // 180

// ─── Weight grid ─────────────────────────────────────────────────────
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 12.9898 + seed * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

export interface WeightCell {
  col: number;
  row: number;
  // Grid position (phase 1 target)
  gx: number;
  gy: number;
  value: string;
  positive: boolean;
}

const COLS = 6;
const ROWS = 6;
const GRID_CX = 750;
const GRID_CY = CANVAS.height / 2;
const CELL_W = 100;
const CELL_H = 60;
const GRID_LEFT = GRID_CX - (COLS * CELL_W) / 2;
const GRID_TOP = GRID_CY - (ROWS * CELL_H) / 2;

export const WEIGHT_CELLS: WeightCell[] = [];
for (let r = 0; r < ROWS; r++) {
  for (let c = 0; c < COLS; c++) {
    const seed = r * COLS + c;
    const raw = seededRandom(seed) * 2 - 1;
    WEIGHT_CELLS.push({
      col: c,
      row: r,
      gx: GRID_LEFT + c * CELL_W + CELL_W / 2,
      gy: GRID_TOP + r * CELL_H + CELL_H / 2,
      value: raw.toFixed(2),
      positive: raw >= 0,
    });
  }
}

// Model icon — to the right of the grid
export const MODEL_CX = 1500;
export const MODEL_CY = CANVAS.height / 2;
