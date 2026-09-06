// Neural Network Layout & Timing Configuration
import { theme } from "../theme";

export const COLORS = {
  background: theme.bgDark,
  neuron: theme.primary,
  neuronGlow: theme.primaryGlow,
  active: theme.primaryLight,
  activeGlow: theme.primaryGlowStrong,
  connection: theme.connectionLine,
  connectionActive: theme.connectionActive,
  strongWeight: theme.primary,
  weakWeight: theme.weakElement,
  text: theme.textWhite,
  textDim: theme.textMuted,
  border: theme.borderDark,
  card: theme.bgCard,
};

export const CANVAS = { width: 1920, height: 1080 };
const PADDING_X = 460;
const PADDING_Y = 140;

export const LAYER_SIZES = [4, 6, 7, 5, 3];

export interface NeuronPos {
  x: number;
  y: number;
  layer: number;
  index: number;
}

export interface ConnectionData {
  from: NeuronPos;
  to: NeuronPos;
  weight: number;
  id: string;
}

export function generateNeurons(): NeuronPos[] {
  const neurons: NeuronPos[] = [];
  const layerCount = LAYER_SIZES.length;

  for (let l = 0; l < layerCount; l++) {
    const x =
      PADDING_X + (l / (layerCount - 1)) * (CANVAS.width - 2 * PADDING_X);
    const count = LAYER_SIZES[l];
    const availableHeight = CANVAS.height - 2 * PADDING_Y;

    for (let n = 0; n < count; n++) {
      const y =
        count === 1
          ? CANVAS.height / 2
          : PADDING_Y + (n / (count - 1)) * availableHeight;
      neurons.push({ x, y, layer: l, index: n });
    }
  }

  return neurons;
}

export function generateConnections(neurons: NeuronPos[]): ConnectionData[] {
  const connections: ConnectionData[] = [];

  for (let l = 0; l < LAYER_SIZES.length - 1; l++) {
    const fromNeurons = neurons.filter((n) => n.layer === l);
    const toNeurons = neurons.filter((n) => n.layer === l + 1);

    for (const from of fromNeurons) {
      for (const to of toNeurons) {
        // Deterministic pseudo-random weight
        const weight =
          Math.sin(from.index * 3.7 + to.index * 2.3 + l * 1.1) * 0.5 + 0.5;
        connections.push({
          from,
          to,
          weight,
          id: `c-${l}-${from.index}-${to.index}`,
        });
      }
    }
  }

  return connections;
}

// Timing (in seconds) - converted to frames in components
export const TIMING = {
  neuronsStart: 0,
  neuronsEnd: 1.5,
  connectionsStart: 1.5,
  connectionsEnd: 3,
  signalStart: 3.5,
  signalEnd: 7.5,
  weightsStart: 8,
  weightsEnd: 15,
};

// Demo input/output text
export const DEMO_INPUT_WORDS = ["אם", "תרצו", "אין", "זו"];
export const DEMO_OUTPUT_WORD = "אגדה";

// Key connections for weight number labels
export const WEIGHT_LABELS: Array<{
  fromLayer: number;
  fromIndex: number;
  toLayer: number;
  toIndex: number;
  label: string;
}> = [
  { fromLayer: 0, fromIndex: 1, toLayer: 1, toIndex: 2, label: "0.7" },
  { fromLayer: 1, fromIndex: 3, toLayer: 2, toIndex: 4, label: "-0.3" },
  { fromLayer: 2, fromIndex: 2, toLayer: 3, toIndex: 1, label: "0.9" },
];
