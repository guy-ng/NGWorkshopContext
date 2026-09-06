import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";
import { theme, fontFamily } from "../theme";
import {
  WIDTH,
  HEIGHT,
  TIMING,
  LLM_X,
  LLM_Y,
  LLM_RADIUS,
  TOOL_ORBIT_RADIUS,
  TOOLS,
  SELECTED_TOOL_INDEX,
  QUERY_TEXT,
  RESPONSE_TEXT,
  THINK_TEXT,
  OBSERVE_TEXT,
  TOOL_RESULT,
  SUMMARY_BOXES,
} from "./config";

// ─── Helper: frame range progress ────────────────────────────────────
function progress(
  frame: number,
  fps: number,
  startSec: number,
  endSec: number,
): number {
  return interpolate(frame, [startSec * fps, endSec * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });
}

// ─── SVG Filters ─────────────────────────────────────────────────────
const SvgFilters: React.FC = () => (
  <defs>
    <filter id="rl-glow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
    <filter id="rl-softGlow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
    <filter id="rl-bigGlow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur in="SourceGraphic" stdDeviation="18" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
    <radialGradient id="rl-brainGrad" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stopColor={theme.primaryLight} />
      <stop offset="100%" stopColor={theme.primary} />
    </radialGradient>
  </defs>
);

// ─── Brain / LLM Icon ────────────────────────────────────────────────
const BrainIcon: React.FC<{
  x: number;
  y: number;
  scale: number;
  pulsePhase: number;
  active?: boolean;
}> = ({ x, y, scale, pulsePhase, active }) => {
  const pulseScale = 1 + 0.06 * Math.sin(pulsePhase * Math.PI * 2);
  const finalScale = scale * pulseScale;
  const glowOpacity = active ? 0.8 : 0.4 + 0.15 * Math.sin(pulsePhase * Math.PI * 2);

  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* Outer glow ring */}
      <circle
        r={LLM_RADIUS * 1.4 * finalScale}
        fill="none"
        stroke={theme.primary}
        strokeWidth={2}
        opacity={glowOpacity * 0.3}
        filter="url(#rl-bigGlow)"
      />
      {/* Main circle */}
      <circle
        r={LLM_RADIUS * finalScale}
        fill="url(#rl-brainGrad)"
        opacity={0.15}
        filter="url(#rl-glow)"
      />
      <circle
        r={LLM_RADIUS * finalScale}
        fill="none"
        stroke={theme.primary}
        strokeWidth={3}
        opacity={glowOpacity}
        filter="url(#rl-softGlow)"
      />
      {/* Brain neural paths */}
      <g opacity={0.9 * scale} transform={`scale(${finalScale})`}>
        {/* Simplified brain shape using paths */}
        <path
          d="M-25,-35 C-40,-30 -45,-10 -40,5 C-35,20 -25,30 -10,35 C0,38 10,35 15,30"
          fill="none"
          stroke={theme.primaryLight}
          strokeWidth={2.5}
          strokeLinecap="round"
        />
        <path
          d="M25,-35 C40,-30 45,-10 40,5 C35,20 25,30 10,35"
          fill="none"
          stroke={theme.primaryLight}
          strokeWidth={2.5}
          strokeLinecap="round"
        />
        <path
          d="M-10,-40 C-5,-45 5,-45 10,-40"
          fill="none"
          stroke={theme.primaryLight}
          strokeWidth={2.5}
          strokeLinecap="round"
        />
        {/* Neural connections */}
        <path
          d="M-20,-15 C-5,-20 5,0 20,-10"
          fill="none"
          stroke={theme.textWhite}
          strokeWidth={1.5}
          opacity={0.6}
          strokeLinecap="round"
        />
        <path
          d="M-15,5 C0,10 10,-5 25,5"
          fill="none"
          stroke={theme.textWhite}
          strokeWidth={1.5}
          opacity={0.6}
          strokeLinecap="round"
        />
        <path
          d="M0,-25 C5,-10 -5,10 0,25"
          fill="none"
          stroke={theme.textWhite}
          strokeWidth={1.5}
          opacity={0.5}
          strokeLinecap="round"
        />
        {/* Neural nodes */}
        {[
          [-20, -15],
          [20, -10],
          [-15, 5],
          [25, 5],
          [0, -25],
          [0, 25],
          [-30, -5],
          [30, -5],
        ].map(([nx, ny], i) => (
          <circle
            key={i}
            cx={nx}
            cy={ny}
            r={3}
            fill={theme.primaryLight}
            opacity={0.8}
          />
        ))}
      </g>
      {/* LLM Label */}
      <text
        y={LLM_RADIUS * finalScale + 35}
        textAnchor="middle"
        fontFamily={fontFamily}
        fontWeight={700}
        fontSize={28}
        fill={theme.textWhite}
        opacity={scale}
      >
        LLM
      </text>
    </g>
  );
};

// ─── Speech Bubble ───────────────────────────────────────────────────
const SpeechBubble: React.FC<{
  x: number;
  y: number;
  text: string;
  opacity: number;
  direction: "left" | "right";
  color?: string;
}> = ({ x, y, text, opacity, direction, color }) => {
  const bgColor = color || theme.bgCard;
  // Tail points toward the source: "left" means bubble came from left, tail points right toward LLM
  const tailDir = direction === "left" ? 1 : -1;
  const boxWidth = 520;
  const boxHeight = 70;

  return (
    <g transform={`translate(${x}, ${y})`} opacity={opacity}>
      {/* Bubble body */}
      <rect
        x={-boxWidth / 2}
        y={-boxHeight / 2}
        width={boxWidth}
        height={boxHeight}
        rx={20}
        fill={bgColor}
        stroke={theme.primary}
        strokeWidth={2}
        opacity={0.95}
      />
      {/* Tail */}
      <polygon
        points={`${tailDir * (boxWidth / 2 - 30)},-5 ${tailDir * (boxWidth / 2 + 20)},0 ${tailDir * (boxWidth / 2 - 30)},5`}
        fill={bgColor}
        stroke={theme.primary}
        strokeWidth={1.5}
      />
      {/* Text */}
      <text
        textAnchor="middle"
        fontFamily={fontFamily}
        fontSize={24}
        fill={theme.textWhite}
        dominantBaseline="middle"
        direction="rtl"
      >
        {text}
      </text>
    </g>
  );
};

// ─── Thought Bubble ──────────────────────────────────────────────────
const ThoughtBubble: React.FC<{
  x: number;
  y: number;
  lines: string[];
  label: string;
  labelEn: string;
  opacity: number;
  textProgress: number;
}> = ({ x, y, lines, label, labelEn, opacity, textProgress }) => {
  const boxWidth = 560;
  const boxHeight = 120;

  return (
    <g transform={`translate(${x}, ${y})`} opacity={opacity}>
      {/* Thought dots leading up */}
      <circle cx={0} cy={boxHeight / 2 + 35} r={6} fill={theme.primary} opacity={0.5} />
      <circle cx={-15} cy={boxHeight / 2 + 55} r={4} fill={theme.primary} opacity={0.4} />
      {/* Main cloud */}
      <rect
        x={-boxWidth / 2}
        y={-boxHeight / 2}
        width={boxWidth}
        height={boxHeight}
        rx={25}
        fill={theme.bgCard}
        stroke={theme.primary}
        strokeWidth={2}
        opacity={0.9}
        filter="url(#rl-softGlow)"
      />
      {/* Text lines */}
      {lines.map((line, i) => {
        const charsToShow = Math.floor(
          textProgress * lines.join("").length,
        );
        let accum = 0;
        for (let j = 0; j < i; j++) accum += lines[j].length;
        const visible = Math.max(0, Math.min(line.length, charsToShow - accum));
        return (
          <text
            key={i}
            y={-boxHeight / 2 + 40 + i * 32}
            textAnchor="middle"
            fontFamily={fontFamily}
            fontSize={20}
            fill={theme.textWhite}
            dominantBaseline="middle"
            direction="rtl"
          >
            {line.slice(0, visible)}
          </text>
        );
      })}
      {/* Phase label */}
      <text
        y={-boxHeight / 2 - 18}
        textAnchor="middle"
        fontFamily={fontFamily}
        fontWeight={700}
        fontSize={22}
        fill={theme.primary}
      >
        {label} | {labelEn}
      </text>
    </g>
  );
};

// ─── Tool Icon ───────────────────────────────────────────────────────
const ToolIcon: React.FC<{
  x: number;
  y: number;
  icon: string;
  label: string;
  scale: number;
  active: boolean;
  opacity: number;
}> = ({ x, y, icon, label, scale, active, opacity }) => {
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`} opacity={opacity}>
      <circle
        r={42}
        fill={active ? theme.primary : theme.bgCard}
        stroke={active ? theme.primaryLight : theme.borderDark}
        strokeWidth={active ? 3 : 2}
        opacity={active ? 1 : 0.7}
        filter={active ? "url(#rl-glow)" : undefined}
      />
      <text
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={32}
        y={-2}
      >
        {icon}
      </text>
      <text
        y={55}
        textAnchor="middle"
        fontFamily={fontFamily}
        fontSize={16}
        fill={active ? theme.primaryLight : theme.textMuted}
        fontWeight={active ? 700 : 400}
        direction="rtl"
      >
        {label}
      </text>
    </g>
  );
};

// ─── Connection Line (animated) ──────────────────────────────────────
const ConnectionLine: React.FC<{
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  progress: number;
  active?: boolean;
}> = ({ x1, y1, x2, y2, progress: p, active }) => {
  const cx = x1 + (x2 - x1) * p;
  const cy = y1 + (y2 - y1) * p;

  return (
    <line
      x1={x1}
      y1={y1}
      x2={cx}
      y2={cy}
      stroke={active ? theme.primary : theme.connectionLine}
      strokeWidth={active ? 3 : 2}
      strokeDasharray={active ? "none" : "8 4"}
      opacity={active ? 0.9 : 0.5}
      filter={active ? "url(#rl-softGlow)" : undefined}
    />
  );
};

// ─── Data Particle ───────────────────────────────────────────────────
const DataParticle: React.FC<{
  x: number;
  y: number;
  opacity: number;
  text: string;
}> = ({ x, y, opacity, text }) => (
  <g transform={`translate(${x}, ${y})`} opacity={opacity}>
    <rect
      x={-60}
      y={-18}
      width={120}
      height={36}
      rx={10}
      fill={theme.bgCard}
      stroke={theme.primary}
      strokeWidth={1.5}
    />
    <text
      textAnchor="middle"
      dominantBaseline="middle"
      fontFamily={fontFamily}
      fontSize={16}
      fill={theme.primaryLight}
      direction="rtl"
    >
      {text}
    </text>
  </g>
);

// ─── Mini Browser ────────────────────────────────────────────────────
const MiniBrowser: React.FC<{
  x: number;
  y: number;
  scale: number;
  resultText: string;
  resultProgress: number;
  opacity: number;
}> = ({ x, y, scale, resultText, resultProgress, opacity }) => {
  const w = 360;
  const h = 200;
  const charsToShow = Math.floor(resultProgress * resultText.length);

  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`} opacity={opacity}>
      {/* Browser frame */}
      <rect
        x={-w / 2}
        y={-h / 2}
        width={w}
        height={h}
        rx={12}
        fill="#1a1a2e"
        stroke={theme.borderDark}
        strokeWidth={2}
      />
      {/* Title bar */}
      <rect
        x={-w / 2}
        y={-h / 2}
        width={w}
        height={36}
        rx={12}
        fill="#252540"
      />
      <rect
        x={-w / 2}
        y={-h / 2 + 24}
        width={w}
        height={12}
        fill="#252540"
      />
      {/* Traffic lights */}
      <circle cx={-w / 2 + 20} cy={-h / 2 + 18} r={6} fill="#ff5f57" />
      <circle cx={-w / 2 + 40} cy={-h / 2 + 18} r={6} fill="#febc2e" />
      <circle cx={-w / 2 + 60} cy={-h / 2 + 18} r={6} fill="#28c840" />
      {/* URL bar */}
      <rect
        x={-w / 2 + 80}
        y={-h / 2 + 8}
        width={w - 100}
        height={22}
        rx={6}
        fill="#1a1a2e"
      />
      <text
        x={0}
        y={-h / 2 + 22}
        textAnchor="middle"
        fontFamily={fontFamily}
        fontSize={11}
        fill={theme.textMuted}
      >
        weather.api/tel-aviv
      </text>
      {/* Content area */}
      <text
        y={15}
        textAnchor="middle"
        fontFamily={fontFamily}
        fontSize={22}
        fill={theme.primaryLight}
        fontWeight={700}
        direction="rtl"
      >
        {resultText.slice(0, charsToShow)}
      </text>
    </g>
  );
};

// ─── Summary Box ─────────────────────────────────────────────────────
const SummaryBox: React.FC<{
  x: number;
  y: number;
  label: string;
  labelHe: string;
  subLabel: string;
  scale: number;
  opacity: number;
  highlighted: boolean;
}> = ({ x, y, label, labelHe, subLabel, scale, opacity, highlighted }) => {
  const w = 300;
  const h = 120;
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`} opacity={opacity}>
      <rect
        x={-w / 2}
        y={-h / 2}
        width={w}
        height={h}
        rx={16}
        fill={highlighted ? theme.primary : theme.bgCard}
        stroke={theme.primary}
        strokeWidth={highlighted ? 3 : 2}
        opacity={highlighted ? 1 : 0.85}
        filter={highlighted ? "url(#rl-glow)" : undefined}
      />
      <text
        y={-15}
        textAnchor="middle"
        fontFamily={fontFamily}
        fontWeight={700}
        fontSize={28}
        fill={highlighted ? theme.bgDark : theme.textWhite}
      >
        {label}
      </text>
      <text
        y={18}
        textAnchor="middle"
        fontFamily={fontFamily}
        fontSize={18}
        fill={highlighted ? theme.bgDark : theme.textMuted}
      >
        ({subLabel})
      </text>
      <text
        y={45}
        textAnchor="middle"
        fontFamily={fontFamily}
        fontWeight={700}
        fontSize={18}
        fill={highlighted ? theme.bgDark : theme.primary}
        direction="rtl"
      >
        ← {labelHe}
      </text>
    </g>
  );
};

// ─── Arrow between boxes ─────────────────────────────────────────────
const ArrowDown: React.FC<{
  x: number;
  y1: number;
  y2: number;
  opacity: number;
  progress: number;
}> = ({ x, y1, y2, opacity, progress: p }) => {
  const len = y2 - y1;
  const currentLen = len * p;
  return (
    <g opacity={opacity}>
      <line
        x1={x}
        y1={y1}
        x2={x}
        y2={y1 + currentLen}
        stroke={theme.primary}
        strokeWidth={3}
      />
      {p > 0.9 && (
        <polygon
          points={`${x},${y2} ${x - 8},${y2 - 14} ${x + 8},${y2 - 14}`}
          fill={theme.primary}
        />
      )}
    </g>
  );
};

// ═════════════════════════════════════════════════════════════════════
// ─── Main Composition ────────────────────────────────────────────────
// ═════════════════════════════════════════════════════════════════════

export const ReActLoop: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Continuous pulse phase for brain
  const pulsePhase = (frame / fps) * 0.8;

  // ── Scene 1: LLM appears ──────────────────────────────────────────
  const llmScale = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 80 },
    durationInFrames: 2 * fps,
  });

  // ── Scene 2: Query arrives ────────────────────────────────────────
  const queryP = progress(frame, fps, TIMING.queryStart, TIMING.queryStart + 1.5);
  const queryX = interpolate(queryP, [0, 1], [-400, LLM_X - 380], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });
  const queryOpacity = interpolate(
    frame,
    [TIMING.queryStart * fps, (TIMING.queryStart + 0.5) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  // Query flows into LLM
  const queryAbsorb = progress(frame, fps, TIMING.queryEnd - 1, TIMING.queryEnd);
  const queryFinalOpacity = queryOpacity * (1 - queryAbsorb);

  // ── Scene 3: THINK ────────────────────────────────────────────────
  const thinkAppear = spring({
    frame: frame - TIMING.thinkStart * fps,
    fps,
    config: { damping: 200 },
  });
  const thinkTextP = progress(frame, fps, TIMING.thinkStart + 0.5, TIMING.thinkEnd - 0.5);
  const thinkFade = progress(frame, fps, TIMING.thinkEnd - 0.5, TIMING.thinkEnd);

  // ── Scene 4: ACT — tools orbit ────────────────────────────────────
  const toolsAppear = spring({
    frame: frame - TIMING.actStart * fps,
    fps,
    config: { damping: 15, stiffness: 100 },
  });
  const orbitAngle = interpolate(
    frame,
    [TIMING.actStart * fps, TIMING.actEnd * fps],
    [0, Math.PI * 0.5],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const toolSelectP = progress(frame, fps, TIMING.actStart + 2, TIMING.actEnd);
  const connectionToToolP = progress(frame, fps, TIMING.actStart + 2.5, TIMING.actEnd);
  // Label
  const actLabelOpacity = interpolate(
    frame,
    [TIMING.actStart * fps, (TIMING.actStart + 1) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const actLabelFade = progress(frame, fps, TIMING.actEnd - 0.5, TIMING.actEnd);

  // ── Scene 5: Tool execution ───────────────────────────────────────
  const browserAppear = spring({
    frame: frame - TIMING.execStart * fps,
    fps,
    config: { damping: 200 },
  });
  const browserResultP = progress(
    frame,
    fps,
    TIMING.execStart + 1,
    TIMING.execEnd - 1,
  );
  // Data flows back
  const dataReturnP = progress(frame, fps, TIMING.execEnd - 1.5, TIMING.execEnd);

  // ── Scene 6: OBSERVE ──────────────────────────────────────────────
  const observeAppear = spring({
    frame: frame - TIMING.observeStart * fps,
    fps,
    config: { damping: 200 },
  });
  const observeTextP = progress(
    frame,
    fps,
    TIMING.observeStart + 0.5,
    TIMING.observeEnd - 0.5,
  );
  const observeFade = progress(frame, fps, TIMING.observeEnd - 0.5, TIMING.observeEnd);

  // ── Scene 7: Final response ───────────────────────────────────────
  const responseP = progress(frame, fps, TIMING.responseStart, TIMING.responseStart + 1.5);
  const responseOpacity = interpolate(
    frame,
    [TIMING.responseStart * fps, (TIMING.responseStart + 0.5) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const responseFade = progress(frame, fps, TIMING.responseEnd - 1, TIMING.responseEnd);

  // ── Scene 8: Summary diagram ──────────────────────────────────────
  const summaryP = progress(frame, fps, TIMING.summaryStart, TIMING.summaryStart + 1);
  const summaryBoxStagger = (i: number) =>
    spring({
      frame: frame - (TIMING.summaryStart + 0.3 * i) * fps,
      fps,
      config: { damping: 15, stiffness: 100 },
    });
  const summaryArrowP = (i: number) =>
    progress(
      frame,
      fps,
      TIMING.summaryStart + 0.5 + 0.4 * i,
      TIMING.summaryStart + 1.5 + 0.4 * i,
    );
  // Highlight cycling
  const cyclePhase = interpolate(
    frame,
    [TIMING.summaryStart * fps + 2 * fps, TIMING.summaryEnd * fps],
    [0, 3],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const highlightIndex = Math.floor(cyclePhase) % 3;

  // ── Fade scenes in/out ────────────────────────────────────────────
  const mainSceneOpacity = interpolate(
    frame,
    [
      TIMING.summaryStart * fps - fps,
      TIMING.summaryStart * fps,
    ],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // Tool positions (with orbit)
  const toolPositions = TOOLS.map((tool, i) => {
    const angle = tool.angle + orbitAngle;
    return {
      x: LLM_X + Math.cos(angle) * TOOL_ORBIT_RADIUS,
      y: LLM_Y + Math.sin(angle) * TOOL_ORBIT_RADIUS,
      ...tool,
      index: i,
    };
  });

  const selectedTool = toolPositions[SELECTED_TOOL_INDEX];

  // Browser position: near the selected tool
  const browserX = selectedTool.x + 280;
  const browserY = selectedTool.y;

  // Response bubble position
  const responseX = interpolate(responseP, [0, 1], [LLM_X + 200, LLM_X + 380], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  return (
    <div
      style={{
        width: WIDTH,
        height: HEIGHT,
        backgroundColor: theme.bgDark,
        overflow: "hidden",
        fontFamily,
      }}
    >
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} width={WIDTH} height={HEIGHT}>
        <SvgFilters />

        {/* ── Main interactive scene ──────────────────────────────── */}
        <g opacity={mainSceneOpacity}>
          {/* LLM Brain - always visible after scene 1 */}
          <BrainIcon
            x={LLM_X}
            y={LLM_Y}
            scale={llmScale}
            pulsePhase={pulsePhase}
            active={frame > TIMING.execEnd * fps}
          />

          {/* Scene 2: Query bubble */}
          <SpeechBubble
            x={queryX}
            y={LLM_Y - 160}
            text={QUERY_TEXT}
            opacity={queryFinalOpacity}
            direction="left"
          />

          {/* Scene 3: Think bubble */}
          {frame >= TIMING.thinkStart * fps && (
            <ThoughtBubble
              x={LLM_X}
              y={LLM_Y - 220}
              lines={THINK_TEXT.split("\n")}
              label="חשיבה"
              labelEn="Reasoning"
              opacity={thinkAppear * (1 - thinkFade)}
              textProgress={thinkTextP}
            />
          )}

          {/* Scene 4: Tool icons orbit */}
          {frame >= TIMING.actStart * fps &&
            toolPositions.map((tool) => {
              const isSelected =
                tool.index === SELECTED_TOOL_INDEX && toolSelectP > 0.5;
              return (
                <ToolIcon
                  key={tool.index}
                  x={tool.x}
                  y={tool.y}
                  icon={tool.icon}
                  label={tool.label}
                  scale={toolsAppear}
                  active={isSelected}
                  opacity={toolsAppear * (1 - summaryP)}
                />
              );
            })}

          {/* Connection line from LLM to selected tool */}
          {connectionToToolP > 0 && frame < TIMING.summaryStart * fps && (
            <ConnectionLine
              x1={LLM_X}
              y1={LLM_Y}
              x2={selectedTool.x}
              y2={selectedTool.y}
              progress={connectionToToolP}
              active
            />
          )}

          {/* ACT label */}
          {frame >= TIMING.actStart * fps && (
            <text
              x={LLM_X}
              y={HEIGHT - 80}
              textAnchor="middle"
              fontFamily={fontFamily}
              fontWeight={700}
              fontSize={26}
              fill={theme.primary}
              opacity={actLabelOpacity * (1 - actLabelFade)}
            >
              פעולה | Action
            </text>
          )}

          {/* Scene 5: Mini browser */}
          {frame >= TIMING.execStart * fps && (
            <>
              <MiniBrowser
                x={browserX}
                y={browserY}
                scale={browserAppear}
                resultText={TOOL_RESULT}
                resultProgress={browserResultP}
                opacity={browserAppear * (1 - summaryP)}
              />
              {/* Connection from tool to browser */}
              {browserAppear > 0.1 && (
                <ConnectionLine
                  x1={selectedTool.x + 42}
                  y1={selectedTool.y}
                  x2={browserX - 180}
                  y2={browserY}
                  progress={browserAppear}
                  active
                />
              )}
            </>
          )}

          {/* Data return particle */}
          {dataReturnP > 0 && dataReturnP < 1 && (
            <DataParticle
              x={interpolate(dataReturnP, [0, 1], [browserX, LLM_X + LLM_RADIUS + 10])}
              y={interpolate(dataReturnP, [0, 1], [browserY, LLM_Y])}
              opacity={1 - dataReturnP * 0.3}
              text={TOOL_RESULT}
            />
          )}

          {/* Scene 6: Observe bubble */}
          {frame >= TIMING.observeStart * fps && (
            <ThoughtBubble
              x={LLM_X}
              y={LLM_Y - 220}
              lines={[OBSERVE_TEXT]}
              label="תצפית"
              labelEn="Observation"
              opacity={observeAppear * (1 - observeFade)}
              textProgress={observeTextP}
            />
          )}

          {/* Scene 7: Response bubble */}
          {frame >= TIMING.responseStart * fps && (
            <SpeechBubble
              x={responseX}
              y={LLM_Y + 160}
              text={RESPONSE_TEXT}
              opacity={responseOpacity * (1 - responseFade)}
              direction="right"
              color="#1a2a1a"
            />
          )}
        </g>

        {/* ── Scene 8: Summary diagram ────────────────────────────── */}
        {frame >= (TIMING.summaryStart - 0.5) * fps && (
          <g opacity={summaryP}>
            {/* Title */}
            <text
              x={WIDTH / 2}
              y={100}
              textAnchor="middle"
              fontFamily={fontFamily}
              fontWeight={700}
              fontSize={42}
              fill={theme.textWhite}
              opacity={summaryP}
            >
              ReAct Loop
            </text>
            <text
              x={WIDTH / 2}
              y={145}
              textAnchor="middle"
              fontFamily={fontFamily}
              fontSize={24}
              fill={theme.textMuted}
              opacity={summaryP}
              direction="rtl"
            >
              לולאת חשיבה ופעולה של סוכן AI
            </text>

            {/* Boxes */}
            {SUMMARY_BOXES.map((box, i) => (
              <SummaryBox
                key={i}
                x={WIDTH / 2}
                y={box.y}
                label={box.label}
                labelHe={box.labelHe}
                subLabel={box.subLabel}
                scale={summaryBoxStagger(i)}
                opacity={summaryBoxStagger(i)}
                highlighted={highlightIndex === i && cyclePhase > 0.5}
              />
            ))}

            {/* Arrows between boxes */}
            {SUMMARY_BOXES.slice(0, -1).map((box, i) => (
              <ArrowDown
                key={i}
                x={WIDTH / 2}
                y1={box.y + 60}
                y2={SUMMARY_BOXES[i + 1].y - 60}
                opacity={summaryBoxStagger(i)}
                progress={summaryArrowP(i)}
              />
            ))}

            {/* Loop back arrow (curved) */}
            {summaryArrowP(2) > 0.5 && (
              <g opacity={summaryArrowP(2)}>
                <path
                  d={`M${WIDTH / 2 + 150},${SUMMARY_BOXES[2].y}
                      C${WIDTH / 2 + 300},${SUMMARY_BOXES[2].y}
                       ${WIDTH / 2 + 300},${SUMMARY_BOXES[0].y}
                       ${WIDTH / 2 + 150},${SUMMARY_BOXES[0].y}`}
                  fill="none"
                  stroke={theme.primary}
                  strokeWidth={2.5}
                  strokeDasharray="8 5"
                  opacity={0.7}
                />
                <text
                  x={WIDTH / 2 + 310}
                  y={(SUMMARY_BOXES[0].y + SUMMARY_BOXES[2].y) / 2}
                  textAnchor="middle"
                  fontFamily={fontFamily}
                  fontSize={18}
                  fill={theme.primary}
                  opacity={0.8}
                  direction="rtl"
                >
                  חזרה או תשובה
                </text>
                <text
                  x={WIDTH / 2 + 310}
                  y={(SUMMARY_BOXES[0].y + SUMMARY_BOXES[2].y) / 2 + 24}
                  textAnchor="middle"
                  fontFamily={fontFamily}
                  fontSize={16}
                  fill={theme.textMuted}
                  opacity={0.7}
                >
                  Repeat or Respond
                </text>
              </g>
            )}
          </g>
        )}
      </svg>
    </div>
  );
};
