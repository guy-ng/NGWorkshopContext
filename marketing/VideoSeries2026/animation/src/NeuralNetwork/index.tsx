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
  LAYER_SIZES,
  TIMING,
  WEIGHT_LABELS,
  DEMO_INPUT_WORDS,
  DEMO_OUTPUT_WORD,
  generateNeurons,
  generateConnections,
  type NeuronPos,
  type ConnectionData,
} from "./config";

const NEURONS = generateNeurons();
const CONNECTIONS = generateConnections(NEURONS);

const NEURON_RADIUS = 16;

// ─── SVG Filter Definitions ───────────────────────────────────────────

const SvgFilters: React.FC = () => (
  <defs>
    <filter id="neuronGlow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="6" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
    <filter id="activeGlow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="12" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
    <filter id="lineGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="3" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>
);

// ─── Phase 1: Neurons Appear ──────────────────────────────────────────

const NeuronLayer: React.FC<{
  neurons: NeuronPos[];
  layerIndex: number;
  isActive: boolean;
  activeProgress: number;
  weightPhaseProgress: number;
}> = ({ neurons, layerIndex, isActive, activeProgress, weightPhaseProgress }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const layerCount = LAYER_SIZES.length;
  const phaseDuration = (TIMING.neuronsEnd - TIMING.neuronsStart) * fps;
  const layerDelay = (layerIndex / layerCount) * phaseDuration;

  return (
    <>
      {neurons.map((neuron, i) => {
        const neuronDelay = layerDelay + i * 3;

        const appearProgress = spring({
          frame,
          fps,
          delay: neuronDelay,
          config: { damping: 200 },
        });

        const scale = interpolate(appearProgress, [0, 1], [0, 1]);
        const opacity = appearProgress;

        // During signal phase, neurons glow when their layer is active
        const glowIntensity = isActive
          ? interpolate(activeProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0.3], {
              extrapolateRight: "clamp",
              extrapolateLeft: "clamp",
            })
          : 0;

        const fillColor =
          glowIntensity > 0.1
            ? COLORS.active
            : weightPhaseProgress > 0
              ? COLORS.neuron
              : COLORS.neuron;

        const currentGlow =
          glowIntensity > 0.1 ? "url(#activeGlow)" : "url(#neuronGlow)";

        return (
          <g key={`neuron-${neuron.layer}-${neuron.index}`}>
            {/* Outer glow ring when active */}
            {glowIntensity > 0.1 && (
              <circle
                cx={neuron.x}
                cy={neuron.y}
                r={NEURON_RADIUS + 8}
                fill="none"
                stroke={COLORS.activeGlow}
                strokeWidth={2}
                opacity={glowIntensity * 0.6}
              />
            )}
            <circle
              cx={neuron.x}
              cy={neuron.y}
              r={NEURON_RADIUS * scale}
              fill={fillColor}
              opacity={opacity}
              filter={currentGlow}
            />
          </g>
        );
      })}
    </>
  );
};

// ─── Phase 2: Connections Draw In ─────────────────────────────────────

const ConnectionLines: React.FC<{
  connections: ConnectionData[];
  activeLayer: number;
  signalProgress: number;
  weightPhaseProgress: number;
}> = ({ connections, activeLayer, signalProgress, weightPhaseProgress }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const connectionsStart = TIMING.connectionsStart * fps;
  const connectionsDuration = (TIMING.connectionsEnd - TIMING.connectionsStart) * fps;
  const connectionSets = LAYER_SIZES.length - 1;

  return (
    <>
      {connections.map((conn) => {
        const setIndex = conn.from.layer;
        const setDelay =
          connectionsStart + (setIndex / connectionSets) * connectionsDuration;

        // Draw-in animation: line length grows
        const drawProgress = interpolate(
          frame,
          [setDelay, setDelay + connectionsDuration / connectionSets],
          [0, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.quad) },
        );

        if (drawProgress <= 0) return null;

        // During signal phase, connections glow when signal passes through
        const isSignalActive =
          activeLayer >= 0 &&
          (conn.from.layer === activeLayer - 1 || conn.from.layer === activeLayer);
        const signalGlow = isSignalActive ? signalProgress : 0;

        // During weight phase, vary thickness/opacity by weight
        let strokeWidth = 1;
        let strokeColor = COLORS.connection;
        let strokeOpacity = drawProgress;

        if (weightPhaseProgress > 0) {
          const w = conn.weight;
          if (w > 0.7) {
            strokeWidth = interpolate(weightPhaseProgress, [0, 1], [1, 3.5]);
            strokeColor = COLORS.strongWeight;
            strokeOpacity = interpolate(weightPhaseProgress, [0, 1], [drawProgress, 0.9]);
          } else if (w < 0.3) {
            strokeWidth = interpolate(weightPhaseProgress, [0, 1], [1, 0.5]);
            strokeColor = COLORS.weakWeight;
            strokeOpacity = interpolate(weightPhaseProgress, [0, 1], [drawProgress, 0.15]);
          } else {
            strokeOpacity = interpolate(weightPhaseProgress, [0, 1], [drawProgress, 0.35]);
          }
        }

        if (signalGlow > 0.1) {
          strokeColor = COLORS.connectionActive;
          strokeWidth = 2;
          strokeOpacity = signalGlow * 0.8;
        }

        // Interpolate endpoint for draw animation
        const endX = interpolate(drawProgress, [0, 1], [conn.from.x, conn.to.x]);
        const endY = interpolate(drawProgress, [0, 1], [conn.from.y, conn.to.y]);

        return (
          <line
            key={conn.id}
            x1={conn.from.x}
            y1={conn.from.y}
            x2={endX}
            y2={endY}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            opacity={strokeOpacity}
            filter={signalGlow > 0.1 ? "url(#lineGlow)" : undefined}
          />
        );
      })}
    </>
  );
};

// ─── Phase 4: Weight Number Labels ────────────────────────────────────

const WeightLabels: React.FC<{ progress: number }> = ({ progress }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (progress <= 0) return null;

  return (
    <>
      {WEIGHT_LABELS.map((wl, i) => {
        const fromNeuron = NEURONS.find(
          (n) => n.layer === wl.fromLayer && n.index === wl.fromIndex,
        );
        const toNeuron = NEURONS.find(
          (n) => n.layer === wl.toLayer && n.index === wl.toIndex,
        );
        if (!fromNeuron || !toNeuron) return null;

        const midX = (fromNeuron.x + toNeuron.x) / 2;
        const midY = (fromNeuron.y + toNeuron.y) / 2 - 18;

        const labelDelay = TIMING.weightsStart * fps + 30 + i * 20;
        const labelProgress = spring({
          frame,
          fps,
          delay: labelDelay,
          config: { damping: 200 },
        });

        return (
          <g key={`weight-label-${i}`} opacity={labelProgress}>
            {/* Background pill */}
            <rect
              x={midX - 28}
              y={midY - 14}
              width={56}
              height={28}
              rx={14}
              fill="rgba(0, 0, 0, 0.7)"
              stroke={COLORS.active}
              strokeWidth={1}
            />
            <text
              x={midX}
              y={midY + 5}
              textAnchor="middle"
              fill={COLORS.active}
              fontSize={16}
              fontFamily={fontFamily}
              fontWeight="700"
            >
              {wl.label}
            </text>
          </g>
        );
      })}
    </>
  );
};

// ─── Hebrew Labels ────────────────────────────────────────────────────

const HebrewLabels: React.FC<{ weightPhaseProgress: number }> = ({
  weightPhaseProgress,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const inputX = NEURONS.find((n) => n.layer === 0)!.x;
  const outputX = NEURONS.find((n) => n.layer === LAYER_SIZES.length - 1)!.x;

  // Middle x between hidden layers
  const hiddenNeurons = NEURONS.filter(
    (n) => n.layer > 0 && n.layer < LAYER_SIZES.length - 1,
  );
  const hiddenMinX = Math.min(...hiddenNeurons.map((n) => n.x));
  const hiddenMaxX = Math.max(...hiddenNeurons.map((n) => n.x));
  const hiddenCenterX = (hiddenMinX + hiddenMaxX) / 2;

  const labelY = CANVAS.height - 60;

  // Labels fade in with their respective layers
  const inputLabelProgress = spring({
    frame,
    fps,
    delay: 5,
    config: { damping: 200 },
  });
  const hiddenLabelProgress = spring({
    frame,
    fps,
    delay: 20,
    config: { damping: 200 },
  });
  const outputLabelProgress = spring({
    frame,
    fps,
    delay: 38,
    config: { damping: 200 },
  });

  // "משקל" label appears during weight phase
  const weightLabelProgress = spring({
    frame,
    fps,
    delay: TIMING.weightsStart * fps + 60,
    config: { damping: 200 },
  });

  // Find a specific connection to point the "weight" label at
  const targetConn = CONNECTIONS.find(
    (c) =>
      c.from.layer === 1 && c.from.index === 1 && c.to.layer === 2 && c.to.index === 1,
  );
  const weightArrowX = targetConn
    ? (targetConn.from.x + targetConn.to.x) / 2
    : hiddenCenterX;
  const weightArrowY = targetConn
    ? (targetConn.from.y + targetConn.to.y) / 2 + 40
    : CANVAS.height / 2;

  return (
    <g fontFamily={fontFamily} direction="rtl">
      {/* קלט (Input) */}
      <text
        x={inputX}
        y={labelY}
        textAnchor="middle"
        fill={COLORS.text}
        fontSize={36}
        fontWeight="700"
        opacity={inputLabelProgress}
      >
        קלט
      </text>

      {/* שכבות נסתרות (Hidden Layers) */}
      <text
        x={hiddenCenterX}
        y={labelY}
        textAnchor="middle"
        fill={COLORS.text}
        fontSize={36}
        fontWeight="700"
        opacity={hiddenLabelProgress}
      >
        שכבות נסתרות
      </text>

      {/* פלט (Output) */}
      <text
        x={outputX}
        y={labelY}
        textAnchor="middle"
        fill={COLORS.text}
        fontSize={36}
        fontWeight="700"
        opacity={outputLabelProgress}
      >
        פלט
      </text>

      {/* משקל (Weight) with arrow */}
      {weightPhaseProgress > 0 && targetConn && (
        <g opacity={weightLabelProgress}>
          <text
            x={weightArrowX}
            y={weightArrowY + 35}
            textAnchor="middle"
            fill={COLORS.active}
            fontSize={30}
            fontWeight="700"
          >
            משקל
          </text>
          {/* Arrow pointing up to connection */}
          <line
            x1={weightArrowX}
            y1={weightArrowY + 18}
            x2={weightArrowX}
            y2={weightArrowY + 5}
            stroke={COLORS.active}
            strokeWidth={2}
            markerEnd="url(#arrowHead)"
          />
          <defs>
            <marker
              id="arrowHead"
              markerWidth="8"
              markerHeight="6"
              refX="8"
              refY="3"
              orient="auto"
            >
              <polygon points="0 0, 8 3, 0 6" fill={COLORS.active} />
            </marker>
          </defs>
        </g>
      )}
    </g>
  );
};

// ─── Signal Pulse (traveling glow) ────────────────────────────────────

const SignalPulse: React.FC<{ activeLayer: number; progress: number }> = ({
  activeLayer,
  progress,
}) => {
  if (activeLayer < 0) return null;

  const layerNeurons = NEURONS.filter((n) => n.layer === activeLayer);

  // Pulse ring that expands on each neuron
  return (
    <>
      {layerNeurons.map((neuron) => {
        const ringRadius = interpolate(progress, [0, 1], [NEURON_RADIUS, NEURON_RADIUS + 25]);
        const ringOpacity = interpolate(progress, [0, 0.5, 1], [0.8, 0.4, 0], {
          extrapolateRight: "clamp",
        });

        return (
          <circle
            key={`pulse-${neuron.layer}-${neuron.index}`}
            cx={neuron.x}
            cy={neuron.y}
            r={ringRadius}
            fill="none"
            stroke={COLORS.active}
            strokeWidth={2}
            opacity={ringOpacity}
            filter="url(#activeGlow)"
          />
        );
      })}
    </>
  );
};

// ─── Demo Input/Output Text ───────────────────────────────────────────

const DemoText: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const inputNeurons = NEURONS.filter((n) => n.layer === 0);
  const outputNeurons = NEURONS.filter(
    (n) => n.layer === LAYER_SIZES.length - 1,
  );

  // Input words appear at ~3s (just before signal starts at 3.5s)
  const inputStartDelay = 3 * fps;
  // Output word appears at ~7s (when signal reaches output layer)
  const outputStartDelay = 7 * fps;

  return (
    <g fontFamily={fontFamily} direction="rtl">
      {/* Input words — one per neuron, to the left */}
      {DEMO_INPUT_WORDS.map((word, i) => {
        if (i >= inputNeurons.length) return null;
        const neuron = inputNeurons[i];

        const wordProgress = spring({
          frame,
          fps,
          delay: inputStartDelay + i * 6,
          config: { damping: 200 },
        });

        const xOffset = interpolate(wordProgress, [0, 1], [-120, -150]);

        return (
          <text
            key={`input-word-${i}`}
            x={neuron.x + xOffset}
            y={neuron.y + 10}
            textAnchor="end"
            fill={COLORS.active}
            fontSize={38}
            fontWeight="700"
            opacity={wordProgress}
          >
            {word}
          </text>
        );
      })}

      {/* Output word — centered on middle output neuron */}
      {(() => {
        const middleIndex = Math.floor(outputNeurons.length / 2);
        const neuron = outputNeurons[middleIndex];

        const wordProgress = spring({
          frame,
          fps,
          delay: outputStartDelay,
          config: { damping: 200 },
        });

        const xOffset = interpolate(wordProgress, [0, 1], [120, 150]);

        return (
          <text
            x={neuron.x + xOffset}
            y={neuron.y + 10}
            textAnchor="start"
            fill={COLORS.active}
            fontSize={42}
            fontWeight="700"
            opacity={wordProgress}
          >
            {DEMO_OUTPUT_WORD}
          </text>
        );
      })()}
    </g>
  );
};

// ─── Main Composition ─────────────────────────────────────────────────

export const NeuralNetwork: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Calculate which phase we're in
  const signalStart = TIMING.signalStart * fps;
  const signalEnd = TIMING.signalEnd * fps;
  const signalDuration = signalEnd - signalStart;
  const layerCount = LAYER_SIZES.length;

  // Signal: which layer is currently active (-1 if not in signal phase)
  const signalFrame = frame - signalStart;
  const signalLayerFloat = interpolate(
    signalFrame,
    [0, signalDuration],
    [-0.5, layerCount - 0.5],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const activeLayer =
    signalFrame >= 0 && signalFrame <= signalDuration
      ? Math.round(signalLayerFloat)
      : -1;
  const signalLocalProgress =
    activeLayer >= 0 ? (signalLayerFloat - activeLayer + 0.5) : 0;

  // Weight phase progress
  const weightPhaseProgress = interpolate(
    frame,
    [TIMING.weightsStart * fps, TIMING.weightsStart * fps + 40],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.quad) },
  );

  // Group neurons by layer
  const neuronsByLayer: NeuronPos[][] = [];
  for (let l = 0; l < layerCount; l++) {
    neuronsByLayer.push(NEURONS.filter((n) => n.layer === l));
  }

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      <svg
        viewBox={`0 0 ${CANVAS.width} ${CANVAS.height}`}
        style={{ width: "100%", height: "100%" }}
      >
        <SvgFilters />

        {/* Connections (behind neurons) */}
        <ConnectionLines
          connections={CONNECTIONS}
          activeLayer={activeLayer}
          signalProgress={signalLocalProgress}
          weightPhaseProgress={weightPhaseProgress}
        />

        {/* Signal pulse effect */}
        <SignalPulse activeLayer={activeLayer} progress={signalLocalProgress} />

        {/* Neurons by layer */}
        {neuronsByLayer.map((layerNeurons, l) => (
          <NeuronLayer
            key={`layer-${l}`}
            neurons={layerNeurons}
            layerIndex={l}
            isActive={l === activeLayer}
            activeProgress={l === activeLayer ? signalLocalProgress : 0}
            weightPhaseProgress={weightPhaseProgress}
          />
        ))}

        {/* Weight number labels */}
        <WeightLabels progress={weightPhaseProgress} />

        {/* Demo input/output text */}
        <DemoText />

        {/* Hebrew text labels */}
        <HebrewLabels weightPhaseProgress={weightPhaseProgress} />
      </svg>
    </AbsoluteFill>
  );
};
