import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";
import { fontFamily } from "../theme";
import {
  COLORS,
  CANVAS,
  TIMING,
  WEIGHT_CELLS,
  MODEL_CX,
  MODEL_CY,
} from "./config";

// ─── SVG Filters ─────────────────────────────────────────────────────

const SvgFilters: React.FC = () => (
  <defs>
    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="6" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
    <filter id="bigGlow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="20" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>
);

// ─── Data particles (fly from edges → grid positions) ────────────────

const DATA_LABELS = ["ספרים", "אינטרנט", "מאמרים", "קוד"];
const DATA_COLORS = ["#4A90D9", "#50C878", "#FF8C42", "#B07DDB"];
const DATA_CHARS = [
  "אבגדהוזחטיכלמנס",
  "ABCDEFGHIJKLMNOP",
  "מחקרתובנותמידע",
  "{}[]()=>;func",
];

// Each cell has a data particle origin (spread around left edge)
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 12.9898 + seed * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

interface DataParticle {
  startX: number;
  startY: number;
  sourceIndex: number; // which data source color/char
  char: string;
  cellIndex: number; // which weight cell it flies to
}

const DATA_PARTICLES: DataParticle[] = WEIGHT_CELLS.map((cell, i) => {
  const sourceIndex = i % 4;
  const chars = DATA_CHARS[sourceIndex];
  return {
    startX: 40 + seededRandom(i * 3.1) * 120,
    startY: 100 + seededRandom(i * 4.7) * (CANVAS.height - 200),
    sourceIndex,
    char: chars[Math.floor(seededRandom(i * 5.3) * chars.length)],
    cellIndex: i,
  };
});

// ─── Phase 1: Data → Weights ─────────────────────────────────────────

const DataToWeights: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const phaseEnd = TIMING.dataToWeights * fps;

  // Source labels (left edge)
  const labelsProgress = spring({ frame, fps, config: { damping: 200 } });

  // Per-particle flight: staggered
  return (
    <g fontFamily={fontFamily}>
      {/* Source labels */}
      {DATA_LABELS.map((label, i) => {
        const y = 240 + i * 180;
        return (
          <g key={`label-${i}`} opacity={labelsProgress * interpolate(frame, [phaseEnd - 20, phaseEnd], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}>
            <rect
              x={30}
              y={y - 16}
              width={110}
              height={32}
              rx={8}
              fill="rgba(0,0,0,0.5)"
              stroke={DATA_COLORS[i]}
              strokeWidth={1.5}
            />
            <text
              x={85}
              y={y + 8}
              textAnchor="middle"
              fill={DATA_COLORS[i]}
              fontSize={18}
              fontWeight="700"
              direction="rtl"
            >
              {label}
            </text>
          </g>
        );
      })}

      {/* Data particles flying to grid positions */}
      {DATA_PARTICLES.map((p, i) => {
        const cell = WEIGHT_CELLS[p.cellIndex];
        const delay = 10 + (cell.row * 4 + cell.col * 2);
        const flight = interpolate(frame, [delay, delay + 40], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.out(Easing.quad),
        });

        if (flight <= 0) return null;

        const x = interpolate(flight, [0, 1], [p.startX, cell.gx]);
        const y = interpolate(flight, [0, 1], [p.startY, cell.gy]);

        // Particle is a character while flying, morphs to number at landing
        const isLanded = flight > 0.85;
        const charOpacity = isLanded ? interpolate(flight, [0.85, 1], [1, 0]) : 1;
        const numOpacity = isLanded ? interpolate(flight, [0.85, 1], [0, 1]) : 0;

        return (
          <g key={`dp-${i}`}>
            {/* Flying character */}
            {charOpacity > 0 && (
              <text
                x={x}
                y={y + 5}
                textAnchor="middle"
                fill={DATA_COLORS[p.sourceIndex]}
                fontSize={16}
                opacity={charOpacity * 0.9}
              >
                {p.char}
              </text>
            )}
            {/* Landing number */}
            {numOpacity > 0 && (
              <text
                x={cell.gx}
                y={cell.gy + 6}
                textAnchor="middle"
                fill={cell.positive ? COLORS.weight : COLORS.weightNeg}
                fontSize={20}
                fontWeight="400"
                opacity={numOpacity}
              >
                {cell.value}
              </text>
            )}
          </g>
        );
      })}

    </g>
  );
};

// ─── Phase 2: Weights → Model ────────────────────────────────────────

const WeightsToModel: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const phaseStart = TIMING.dataToWeights * fps;
  const phaseEnd = TIMING.weightsToModel * fps;
  const localFrame = frame - phaseStart;
  const phaseDuration = phaseEnd - phaseStart;

  if (localFrame < 0) return null;

  // Compress: cells fly toward center
  const compress = interpolate(localFrame, [0, phaseDuration * 0.5], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });

  // Number opacity fades as they compress
  const numFade = interpolate(compress, [0.3, 0.7], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Model icon grows
  const modelProgress = interpolate(localFrame, [phaseDuration * 0.4, phaseDuration * 0.7], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  // Model label
  const labelProgress = spring({
    frame: localFrame - Math.floor(phaseDuration * 0.6),
    fps,
    config: { damping: 200 },
  });

  return (
    <g fontFamily={fontFamily}>
      {/* Compressing weight cells → center */}
      {WEIGHT_CELLS.map((cell, i) => {
        const cx = interpolate(compress, [0, 1], [cell.gx, MODEL_CX]);
        const cy = interpolate(compress, [0, 1], [cell.gy, MODEL_CY]);
        const dotSize = interpolate(compress, [0, 0.5, 1], [0, 3, 5]);

        return (
          <g key={`wc-${i}`}>
            {/* Number (fading) */}
            {numFade > 0 && (
              <text
                x={cx}
                y={cy + 6}
                textAnchor="middle"
                fill={cell.positive ? COLORS.weight : COLORS.weightNeg}
                fontSize={20}
                opacity={numFade}
              >
                {cell.value}
              </text>
            )}
            {/* Dot (replacing number) */}
            {compress > 0.3 && (
              <circle
                cx={cx}
                cy={cy}
                r={dotSize}
                fill={COLORS.primary}
                opacity={interpolate(compress, [0.3, 0.6], [0, 0.8], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
              />
            )}
          </g>
        );
      })}

      {/* Model icon: brain-like circle */}
      {modelProgress > 0 && (
        <g>
          <circle
            cx={MODEL_CX}
            cy={MODEL_CY}
            r={70 * modelProgress}
            fill={COLORS.primary}
            opacity={0.15 * modelProgress}
            filter="url(#bigGlow)"
          />
          <circle
            cx={MODEL_CX}
            cy={MODEL_CY}
            r={50 * modelProgress}
            fill="none"
            stroke={COLORS.primary}
            strokeWidth={3}
            opacity={modelProgress}
            filter="url(#glow)"
          />
          {/* Inner brain lines */}
          {[-20, 0, 20].map((offset) => (
            <line
              key={`bl-${offset}`}
              x1={MODEL_CX - 30 * modelProgress}
              y1={MODEL_CY + offset}
              x2={MODEL_CX + 30 * modelProgress}
              y2={MODEL_CY + offset}
              stroke={COLORS.primaryLight}
              strokeWidth={1.5}
              opacity={modelProgress * 0.5}
              strokeLinecap="round"
            />
          ))}
          {/* LLM label */}
          <text
            x={MODEL_CX}
            y={MODEL_CY + 8}
            textAnchor="middle"
            fill={COLORS.text}
            fontSize={28}
            fontWeight="700"
            opacity={modelProgress}
          >
            LLM
          </text>
        </g>
      )}

      {/* "מודל" label below */}
      {labelProgress > 0 && (
        <text
          x={MODEL_CX}
          y={MODEL_CY + 100}
          textAnchor="middle"
          fill={COLORS.text}
          fontSize={34}
          fontWeight="700"
          direction="rtl"
          opacity={labelProgress}
        >
          מודל שפה
        </text>
      )}
    </g>
  );
};

// ─── Main Composition ────────────────────────────────────────────────

export const LLMTraining: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      <svg
        viewBox={`0 0 ${CANVAS.width} ${CANVAS.height}`}
        style={{ width: "100%", height: "100%" }}
      >
        <SvgFilters />
        <DataToWeights frame={frame} fps={fps} />
        <WeightsToModel frame={frame} fps={fps} />
      </svg>
    </AbsoluteFill>
  );
};
