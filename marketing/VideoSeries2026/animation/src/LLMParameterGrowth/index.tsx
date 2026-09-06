import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
  Img,
  staticFile,
} from "remotion";
import { fontFamily } from "../theme";
import {
  CANVAS,
  CHART,
  TIMING,
  COLORS,
  MODELS,
  Y_TICKS,
  pointX,
  paramToY,
} from "./config";

// ─── SVG Defs ────────────────────────────────────────────────────────
const SvgDefs: React.FC = () => (
  <defs>
    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="8" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
    <marker
      id="arrowhead"
      markerWidth="14"
      markerHeight="10"
      refX="12"
      refY="5"
      orient="auto"
    >
      <polygon points="0 0, 14 5, 0 10" fill={COLORS.line} />
    </marker>
  </defs>
);

// ─── Axes ────────────────────────────────────────────────────────────
const Axes: React.FC<{ progress: number }> = ({ progress }) => {
  const draw = interpolate(progress, [0, 1], [0, 1], {
    easing: Easing.out(Easing.quad),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <g fontFamily={fontFamily} opacity={progress}>
      <line
        x1={CHART.left}
        y1={CHART.bottom}
        x2={CHART.left}
        y2={interpolate(draw, [0, 1], [CHART.bottom, CHART.top])}
        stroke={COLORS.axis}
        strokeWidth={2}
      />
      <line
        x1={CHART.left}
        y1={CHART.bottom}
        x2={interpolate(draw, [0, 1], [CHART.left, CHART.right])}
        y2={CHART.bottom}
        stroke={COLORS.axis}
        strokeWidth={2}
      />
      {Y_TICKS.map((tick) => {
        const y = paramToY(tick.value);
        return (
          <g key={`y-${tick.value}`} opacity={draw}>
            {tick.value > 0 && (
              <line
                x1={CHART.left}
                y1={y}
                x2={CHART.right}
                y2={y}
                stroke={COLORS.gridLine}
                strokeWidth={1}
                strokeDasharray="6 4"
              />
            )}
            <text
              x={CHART.left - 20}
              y={y + 6}
              textAnchor="end"
              fill={COLORS.axisLabel}
              fontSize={22}
            >
              {tick.label}
            </text>
          </g>
        );
      })}
      <text
        x={60}
        y={CANVAS.height / 2}
        textAnchor="middle"
        fill={COLORS.axisLabel}
        fontSize={24}
        transform={`rotate(-90, 60, ${CANVAS.height / 2})`}
      >
        Total Parameters
      </text>
    </g>
  );
};

// ─── Title ───────────────────────────────────────────────────────────
const Title: React.FC<{ progress: number }> = ({ progress }) => (
  <g opacity={progress} fontFamily={fontFamily}>
    <text
      x={CANVAS.width / 2}
      y={80}
      textAnchor="middle"
      fill={COLORS.title}
      fontSize={48}
      fontWeight="700"
    >
      OpenAI — Parameter Growth
    </text>
    <text
      x={CANVAS.width / 2}
      y={125}
      textAnchor="middle"
      fill={COLORS.axisLabel}
      fontSize={26}
    >
      175B → 1.76T → 4T in 5 years
    </text>
  </g>
);

// ─── Helper: interpolate a point along the polyline at t ∈ [0,1] ────
function getPointOnLine(
  t: number,
  pts: { x: number; y: number }[],
): { x: number; y: number } {
  if (t <= 0) return pts[0];
  if (t >= 1) return pts[pts.length - 1];
  const totalSegs = pts.length - 1;
  const seg = Math.min(Math.floor(t * totalSegs), totalSegs - 1);
  const segT = t * totalSegs - seg;
  return {
    x: interpolate(segT, [0, 1], [pts[seg].x, pts[seg + 1].x]),
    y: interpolate(segT, [0, 1], [pts[seg].y, pts[seg + 1].y]),
  };
}

// ─── Line graph with arrow + dots ────────────────────────────────────
const GrowthLine: React.FC<{ frame: number; fps: number }> = ({
  frame,
  fps,
}) => {
  const dotTimes = [TIMING.dot1, TIMING.dot2, TIMING.dot3];

  // All 3 data points in chart coords
  const pts = MODELS.map((m, i) => ({
    x: pointX(i),
    y: paramToY(m.paramsBillions),
  }));

  // Line draws progressively: starts at dot1, reaches dot2, then dot3
  const lineProgress = interpolate(
    frame,
    [dotTimes[0] * fps, dotTimes[2] * fps + 15],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.quad) },
  );

  // Build the partial SVG path up to current progress
  const tipPt = getPointOnLine(lineProgress, pts);
  const visiblePts: { x: number; y: number }[] = [];
  for (let i = 0; i < pts.length; i++) {
    const segT = i / (pts.length - 1);
    if (segT <= lineProgress) {
      visiblePts.push(pts[i]);
    }
  }
  visiblePts.push(tipPt);

  const pathD = visiblePts
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");

  return (
    <g fontFamily={fontFamily}>
      {/* Glow line (behind) */}
      {lineProgress > 0 && (
        <path
          d={pathD}
          fill="none"
          stroke={COLORS.lineGlow}
          strokeWidth={10}
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#glow)"
        />
      )}

      {/* Main line with arrowhead */}
      {lineProgress > 0 && (
        <path
          d={pathD}
          fill="none"
          stroke={COLORS.line}
          strokeWidth={4}
          strokeLinecap="round"
          strokeLinejoin="round"
          markerEnd="url(#arrowhead)"
        />
      )}

      {/* Area fill under line */}
      {lineProgress > 0 && (
        <path
          d={`${pathD} L ${tipPt.x} ${CHART.bottom} L ${pts[0].x} ${CHART.bottom} Z`}
          fill={COLORS.line}
          opacity={0.06}
        />
      )}

      {/* Dots + labels at each model point */}
      {MODELS.map((model, i) => {
        const startFrame = dotTimes[i] * fps;
        const localFrame = frame - startFrame;
        if (localFrame < 0) return null;

        const dotScale = spring({
          frame: localFrame,
          fps,
          config: { damping: 12, stiffness: 200 },
        });

        const x = pts[i].x;
        const y = pts[i].y;

        // Multiplier badge between dots
        const prevParams = i > 0 ? MODELS[i - 1].paramsBillions : null;
        const multiplier = prevParams
          ? `×${Math.round(model.paramsBillions / prevParams)}`
          : null;
        const multOpacity =
          multiplier && localFrame > 20
            ? spring({
                frame: localFrame - 20,
                fps,
                config: { damping: 200 },
              })
            : 0;

        // Arrow midpoint for multiplier placement
        const midX = i > 0 ? (pts[i - 1].x + x) / 2 : 0;
        const midY = i > 0 ? (pts[i - 1].y + y) / 2 : 0;

        return (
          <g key={model.model}>
            {/* Outer glow ring */}
            <circle
              cx={x}
              cy={y}
              r={18 * dotScale}
              fill={COLORS.line}
              opacity={0.15 * dotScale}
              filter="url(#glow)"
            />
            {/* Dot */}
            <circle
              cx={x}
              cy={y}
              r={10 * dotScale}
              fill={COLORS.background}
              stroke={COLORS.line}
              strokeWidth={3}
            />
            <circle
              cx={x}
              cy={y}
              r={5 * dotScale}
              fill={COLORS.line}
            />

            {/* Param label above dot */}
            <g opacity={dotScale}>
              <text
                x={x}
                y={y - 40}
                textAnchor="middle"
                fill={COLORS.line}
                fontSize={36}
                fontWeight="700"
              >
                {model.label}
              </text>
            </g>

            {/* Model + year below dot */}
            <g opacity={dotScale}>
              <text
                x={x}
                y={y + 36}
                textAnchor="middle"
                fill={COLORS.text}
                fontSize={28}
                fontWeight="700"
              >
                {model.model}
              </text>
              <text
                x={x}
                y={y + 62}
                textAnchor="middle"
                fill={COLORS.axisLabel}
                fontSize={20}
              >
                {model.year}
              </text>
            </g>

            {/* Multiplier badge on the line segment */}
            {multiplier && multOpacity > 0 && (
              <g opacity={multOpacity}>
                <rect
                  x={midX - 32}
                  y={midY - 18}
                  width={64}
                  height={36}
                  rx={18}
                  fill={COLORS.background}
                  stroke={COLORS.line}
                  strokeWidth={1.5}
                />
                <text
                  x={midX}
                  y={midY + 8}
                  textAnchor="middle"
                  fill={COLORS.line}
                  fontSize={20}
                  fontWeight="700"
                >
                  {multiplier}
                </text>
              </g>
            )}
          </g>
        );
      })}
    </g>
  );
};

// ─── OpenAI logo badge (HTML overlay) ────────────────────────────────
const LogoBadge: React.FC<{ progress: number }> = ({ progress }) => {
  if (progress <= 0) return null;
  return (
    <div
      style={{
        position: "absolute",
        top: 42,
        right: 80,
        display: "flex",
        alignItems: "center",
        gap: 14,
        opacity: progress,
        fontFamily,
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 12,
          backgroundColor: "rgba(16, 163, 127, 0.15)",
          border: "1.5px solid rgba(16, 163, 127, 0.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Img
          src={staticFile("logos/openai.svg")}
          style={{ width: 28, height: 28 }}
        />
      </div>
      <span style={{ color: COLORS.openai, fontSize: 24, fontWeight: 700 }}>
        OpenAI
      </span>
    </div>
  );
};

// ─── Main Composition ────────────────────────────────────────────────
export const LLMParameterGrowth: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleProgress = spring({
    frame,
    fps,
    config: { damping: 200 },
  });

  const axesProgress = interpolate(
    frame,
    [0, TIMING.axesIn * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      <svg
        viewBox={`0 0 ${CANVAS.width} ${CANVAS.height}`}
        style={{ width: "100%", height: "100%" }}
      >
        <SvgDefs />
        <Title progress={titleProgress} />
        <Axes progress={axesProgress} />
        <GrowthLine frame={frame} fps={fps} />
      </svg>
      <LogoBadge progress={titleProgress} />
    </AbsoluteFill>
  );
};
