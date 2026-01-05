/**
 * BPMN 2.0 React Component Interfaces
 * Complete TypeScript interfaces for implementing BPMN connecting objects and swimlanes
 */

// ============================================================================
// TYPES & ENUMS
// ============================================================================

export enum SequenceFlowType {
  NORMAL = 'normal',
  CONDITIONAL = 'conditional',
  DEFAULT = 'default',
}

export enum AssociationDirection {
  NONE = 'None',
  ONE = 'One',
  BOTH = 'Both',
}

export enum GatewayType {
  EXCLUSIVE = 'exclusiveGateway',
  INCLUSIVE = 'inclusiveGateway',
  PARALLEL = 'parallelGateway',
  EVENT_BASED = 'eventBasedGateway',
}

export interface Point {
  x: number;
  y: number;
}

export interface Bounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Label {
  x: number;
  y: number;
  text: string;
  fontSize?: number;
  fontFamily?: string;
  color?: string;
  backgroundColor?: string;
  padding?: number;
}

// ============================================================================
// CONNECTING OBJECTS INTERFACES
// ============================================================================

/**
 * Base interface for all connecting objects
 */
export interface BaseConnectingObject {
  id: string;
  sourceRef: string;
  targetRef: string;
  name?: string;
  label?: Label;
  waypoints?: Point[];
}

/**
 * Sequence Flow - Normal
 */
export interface SequenceFlowProps extends BaseConnectingObject {
  type: SequenceFlowType.NORMAL;
  isImmediate?: boolean;
  color?: string; // default: '#000000'
  strokeWidth?: number; // default: 2
}

/**
 * Sequence Flow - Conditional
 */
export interface ConditionalSequenceFlowProps extends BaseConnectingObject {
  type: SequenceFlowType.CONDITIONAL;
  conditionExpression: string;
  conditionExpressionType?: 'tFormalExpression' | 'tScript';
  conditionLanguage?: string; // 'javascript', 'groovy', 'uel', etc.
  color?: string; // default: '#000000'
  strokeWidth?: number; // default: 2
  diamondMarkerColor?: string; // default: '#000000'
  diamondMarkerSize?: number; // default: 8
  diamondMarkerFill?: string; // default: '#FFFFFF'
}

/**
 * Sequence Flow - Default
 */
export interface DefaultSequenceFlowProps extends BaseConnectingObject {
  type: SequenceFlowType.DEFAULT;
  isDefault: true;
  color?: string; // default: '#000000'
  strokeWidth?: number; // default: 2
  slashMarkerColor?: string; // default: '#000000'
  slashMarkerSize?: number; // default: 6
}

export type SequenceFlowPropsType =
  | SequenceFlowProps
  | ConditionalSequenceFlowProps
  | DefaultSequenceFlowProps;

/**
 * Message Flow - for inter-pool communication
 */
export interface MessageFlowProps extends BaseConnectingObject {
  messageRef?: string; // Reference to Message element definition
  dashArray?: string; // default: '5,3'
  color?: string; // default: '#000000'
  strokeWidth?: number; // default: 2
  circleMarkerColor?: string; // default: '#000000'
  circleMarkerSize?: number; // default: 8
  circleMarkerFill?: string; // default: '#FFFFFF'
  arrowMarkerSize?: number; // default: 8
  sourceParticipant?: string; // Optional: source pool ID
  targetParticipant?: string; // Optional: target pool ID
}

/**
 * Association - connects artifacts to flow objects
 */
export interface AssociationProps extends BaseConnectingObject {
  associationDirection?: AssociationDirection; // default: NONE
  color?: string; // default: '#999999'
  strokeWidth?: number; // default: 1.5
  dashArray?: string; // default: '3,2'
  arrowMarkerColor?: string; // default: '#666666'
  arrowMarkerSize?: number; // default: 6
}

/**
 * Formal Expression for transformations
 */
export interface FormalExpression {
  type: 'tFormalExpression' | 'tScript';
  expression: string;
  language?: string; // 'javascript', 'groovy', 'uel', etc.
}

/**
 * Field assignment in data mapping
 */
export interface Assignment {
  from: string; // Source field path
  to: string; // Target field path
}

/**
 * Base interface for data associations
 */
export interface BaseDataAssociation {
  id: string;
  targetRef: string; // Required: always exactly one target
  transformation?: FormalExpression;
  assignments?: Assignment[];
  color?: string; // default: '#555555'
  strokeWidth?: number; // default: 1.5
  dashArray?: string; // default: '2,2'
  arrowMarkerColor?: string; // default: '#333333'
  arrowMarkerSize?: number; // default: 6
  label?: Label;
  waypoints?: Point[];
}

/**
 * Data Input Association - data flowing INTO an activity
 */
export interface DataInputAssociationProps extends BaseDataAssociation {
  sourceRef: string | string[]; // Can have multiple sources
  direction: 'input';
}

/**
 * Data Output Association - data flowing OUT OF an activity
 */
export interface DataOutputAssociationProps extends BaseDataAssociation {
  sourceRef: string;
  direction: 'output';
  targetRef: string | string[]; // Can have multiple targets
}

// ============================================================================
// SWIMLANE INTERFACES
// ============================================================================

/**
 * Pool - top-level container for a participant's process
 */
export interface PoolProps extends Bounds {
  id: string;
  processRef: string;
  name: string;
  isExecutable?: boolean;
  isCollapsed?: boolean; // true = black box, false = white box
  participantMultiplicity?: ParticipantMultiplicity;

  // Styling
  backgroundColor?: string; // default: '#FFFFFF'
  borderColor?: string; // default: '#000000'
  borderWidth?: number; // default: 2
  borderRadius?: number; // default: 0 (no radius)

  // Label styling
  labelPosition?: 'left' | 'top'; // default: 'left'
  labelRotation?: number; // default: -90 (degrees)
  labelFontSize?: number; // default: 12
  labelFontColor?: string; // default: '#000000'
  labelFontFamily?: string; // default: 'Arial'

  // Content
  children?: React.ReactNode; // Lanes and flow elements

  // Optional references
  processElement?: ProcessElement;
  laneSet?: LaneSet;
  flowElements?: FlowElement[];
}

/**
 * Participant Multiplicity - for multi-instance pools
 */
export interface ParticipantMultiplicity {
  minimum: number; // default: 1
  maximum: number | null; // null = unbounded
}

/**
 * Lane - subdivision within a pool
 */
export interface LaneProps extends Bounds {
  id: string;
  name: string;
  flowNodeRefs: string[]; // IDs of elements in this lane

  // Parent reference
  parentLaneSet?: string;

  // Child lanes (for nested/matrix structure)
  childLanes?: Lane[];
  childLaneSet?: LaneSet;

  // Styling
  backgroundColor?: string; // default: '#F5F5F5'
  borderColor?: string; // default: '#CCCCCC'
  borderWidth?: number; // default: 1

  // Label styling
  labelPosition?: 'left' | 'top'; // default: 'left'
  labelRotation?: number; // default: -90
  labelFontSize?: number; // default: 12
  labelFontColor?: string; // default: '#000000'

  // Content
  children?: React.ReactNode; // Flow elements within lane
}

/**
 * LaneSet - container for lanes
 */
export interface LaneSet {
  id: string;
  lanes: Lane[];
}

/**
 * Lane data type for tree structure
 */
export interface Lane {
  id: string;
  name: string;
  flowNodeRefs: string[];
  childLanes?: Lane[];
}

/**
 * Process element referenced by pool
 */
export interface ProcessElement {
  id: string;
  name: string;
  isExecutable: boolean;
  flowElements: FlowElement[];
  laneSet?: LaneSet;
  dataObjects?: DataObject[];
  dataStores?: DataStore[];
}

/**
 * Flow element (task, event, gateway, etc.)
 */
export interface FlowElement {
  id: string;
  name: string;
  type: 'task' | 'event' | 'gateway' | 'subprocess' | 'callactivity';
  bounds: Bounds;
  incoming?: string[]; // Sequence flow IDs
  outgoing?: string[]; // Sequence flow IDs
  dataInputAssociations?: DataInputAssociationProps[];
  dataOutputAssociations?: DataOutputAssociationProps[];
}

/**
 * Data Object - represents data/artifact
 */
export interface DataObject {
  id: string;
  name: string;
  isCollection?: boolean;
  type?: string; // Data type specification
}

/**
 * Data Store - persistent data repository
 */
export interface DataStore {
  id: string;
  name: string;
  capacity?: number;
  type?: string;
}

// ============================================================================
// COLLABORATION INTERFACES
// ============================================================================

/**
 * Collaboration - container for multiple pools and message flows
 */
export interface CollaborationProps {
  id: string;
  name?: string;
  participants: Participant[];
  messageFlows: MessageFlowProps[];
  processes: ProcessElement[];
  messages?: MessageDefinition[];

  // Rendering
  width: number;
  height: number;
  children?: React.ReactNode;
}

/**
 * Participant - represents an entity in collaboration (becomes a Pool visually)
 */
export interface Participant {
  id: string;
  processRef: string;
  name: string;
  isExecutable?: boolean;
  participantMultiplicity?: ParticipantMultiplicity;

  // Can embed process directly
  process?: ProcessElement;
}

/**
 * Message Definition - describes a message type
 */
export interface MessageDefinition {
  id: string;
  name: string;
  itemRef?: string; // Type of message content
  payload?: Record<string, any>;
}

// ============================================================================
// COMPONENT PROPS INTERFACES
// ============================================================================

/**
 * Common props for all connecting object components
 */
export interface ConnectorComponentProps {
  // Visual state
  isSelected?: boolean;
  isHighlighted?: boolean;
  isDisabled?: boolean;
  opacity?: number;

  // Events
  onClick?: (e: React.MouseEvent) => void;
  onDoubleClick?: (e: React.MouseEvent) => void;
  onMouseEnter?: (e: React.MouseEvent) => void;
  onMouseLeave?: (e: React.MouseEvent) => void;
  onContextMenu?: (e: React.MouseEvent) => void;

  // Interaction
  isDragging?: boolean;
  isEditable?: boolean;

  // Display
  showLabel?: boolean;
  showWaypoints?: boolean;
}

/**
 * Common props for all swimlane components
 */
export interface SwimLaneComponentProps {
  // Visual state
  isSelected?: boolean;
  isHighlighted?: boolean;
  isEditable?: boolean;
  opacity?: number;

  // Events
  onClick?: (e: React.MouseEvent) => void;
  onDoubleClick?: (e: React.MouseEvent) => void;
  onMouseEnter?: (e: React.MouseEvent) => void;
  onMouseLeave?: (e: React.MouseEvent) => void;
  onContextMenu?: (e: React.MouseEvent) => void;

  // Resizing
  onResize?: (newBounds: Bounds) => void;
  isResizable?: boolean;

  // Content
  showChildren?: boolean;
}

// ============================================================================
// XML SERIALIZATION INTERFACES
// ============================================================================

/**
 * XML representation of sequence flow
 */
export interface SequenceFlowXML {
  $: {
    id: string;
    sourceRef: string;
    targetRef: string;
    name?: string;
    isImmediate?: string;
    default?: string;
  };
  conditionExpression?: Array<{
    _: string; // Expression text
    $: {
      'xsi:type': 'tFormalExpression' | 'tScript';
    };
  }>;
}

/**
 * XML representation of message flow
 */
export interface MessageFlowXML {
  $: {
    id: string;
    sourceRef: string;
    targetRef: string;
    messageRef?: string;
    name?: string;
  };
}

/**
 * XML representation of association
 */
export interface AssociationXML {
  $: {
    id: string;
    sourceRef: string;
    targetRef: string;
    associationDirection?: 'None' | 'One' | 'Both';
    name?: string;
  };
}

/**
 * XML representation of data association
 */
export interface DataAssociationXML {
  $: {
    id: string;
  };
  sourceRef: string[];
  targetRef: string[];
  transformation?: Array<{
    formalExpression?: string[];
  }>;
  assignment?: Array<{
    from: string[];
    to: string[];
  }>;
}

/**
 * XML representation of pool/participant
 */
export interface ParticipantXML {
  $: {
    id: string;
    processRef: string;
    name: string;
    isExecutable?: string;
  };
  participantMultiplicity?: Array<{
    $: {
      minimum?: string;
      maximum?: string;
    };
  }>;
}

/**
 * XML representation of lane
 */
export interface LaneXML {
  $: {
    id: string;
    name: string;
  };
  flowNodeRef?: string[];
  childLaneSet?: Array<{
    lane: LaneXML[];
  }>;
}

/**
 * XML representation of process
 */
export interface ProcessXML {
  $: {
    id: string;
    name?: string;
    isExecutable?: string;
  };
  laneSet?: Array<{
    $: {
      id: string;
    };
    lane: LaneXML[];
  }>;
  startEvent?: any[];
  endEvent?: any[];
  task?: any[];
  exclusiveGateway?: any[];
  sequenceFlow?: SequenceFlowXML[];
  dataObject?: any[];
  dataStore?: any[];
  association?: AssociationXML[];
}

// ============================================================================
// UTILITY INTERFACES
// ============================================================================

/**
 * Rendering context for components
 */
export interface RenderContext {
  zoom: number;
  offsetX: number;
  offsetY: number;
  scale: number;
  selectedElements: Set<string>;
  highlightedElements: Set<string>;
}

/**
 * Validation result
 */
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

/**
 * Validation error
 */
export interface ValidationError {
  type: 'reference' | 'constraint' | 'semantic' | 'syntax';
  message: string;
  elementId: string;
  severity: 'error' | 'warning';
}

/**
 * Validation warning
 */
export interface ValidationWarning {
  type: 'naming' | 'style' | 'practice';
  message: string;
  elementId: string;
  suggestion?: string;
}

/**
 * Diagram state for undo/redo
 */
export interface DiagramState {
  elements: {
    pools: PoolProps[];
    lanes: LaneProps[];
    flows: SequenceFlowPropsType[];
    messageFlows: MessageFlowProps[];
    associations: AssociationProps[];
    dataAssociations: (DataInputAssociationProps | DataOutputAssociationProps)[];
  };
  timestamp: number;
  description: string;
}

/**
 * Import/Export options
 */
export interface BPMNExportOptions {
  format: 'xml' | 'json';
  includeMetadata?: boolean;
  includeStyles?: boolean;
  validate?: boolean;
}

export interface BPMNImportOptions {
  strictMode?: boolean;
  autoLayout?: boolean;
  validateOnImport?: boolean;
  resolveReferences?: boolean;
}

// ============================================================================
// REACT COMPONENT DEFINITIONS
// ============================================================================

export interface SequenceFlowComponent
  extends React.FC<SequenceFlowPropsType & ConnectorComponentProps> {}

export interface MessageFlowComponent
  extends React.FC<MessageFlowProps & ConnectorComponentProps> {}

export interface AssociationComponent
  extends React.FC<AssociationProps & ConnectorComponentProps> {}

export interface DataAssociationComponent
  extends React.FC<
    (DataInputAssociationProps | DataOutputAssociationProps) &
      ConnectorComponentProps
  > {}

export interface PoolComponent
  extends React.FC<PoolProps & SwimLaneComponentProps> {}

export interface LaneComponent
  extends React.FC<LaneProps & SwimLaneComponentProps> {}

export interface CollaborationComponent
  extends React.FC<CollaborationProps & SwimLaneComponentProps> {}

// ============================================================================
// MARKER DEFINITIONS (for SVG)
// ============================================================================

export interface MarkerDefinition {
  id: string;
  markerWidth: number;
  markerHeight: number;
  refX: number;
  refY: number;
  markerUnits: 'strokeWidth' | 'userSpaceOnUse';
  orient: 'auto' | number;
  viewBox: string;
  path: string;
  fill: string;
  stroke?: string;
}

/**
 * Predefined markers for standard BPMN elements
 */
export const STANDARD_MARKERS = {
  arrowSolid: {
    id: 'arrowSolid',
    markerWidth: 10,
    markerHeight: 10,
    refX: 9,
    refY: 3,
    markerUnits: 'strokeWidth' as const,
    orient: 'auto' as const,
    viewBox: '0 0 10 10',
    path: 'M 0 0 L 10 3 L 0 6 z',
    fill: '#000000',
  },
  arrowOpen: {
    id: 'arrowOpen',
    markerWidth: 10,
    markerHeight: 10,
    refX: 9,
    refY: 3,
    markerUnits: 'strokeWidth' as const,
    orient: 'auto' as const,
    viewBox: '0 0 10 10',
    path: 'M 0 0 L 10 3 L 0 6',
    fill: 'none',
    stroke: '#000000',
  },
  diamond: {
    id: 'diamond',
    markerWidth: 10,
    markerHeight: 10,
    refX: 5,
    refY: 5,
    markerUnits: 'strokeWidth' as const,
    orient: 'auto' as const,
    viewBox: '0 0 10 10',
    path: 'M 5 0 L 10 5 L 5 10 L 0 5 Z',
    fill: '#FFFFFF',
    stroke: '#000000',
  },
  circle: {
    id: 'circle',
    markerWidth: 10,
    markerHeight: 10,
    refX: 5,
    refY: 5,
    markerUnits: 'strokeWidth' as const,
    orient: 'auto' as const,
    viewBox: '0 0 10 10',
    path: 'M 5 0 A 5 5 0 1 1 5 10 A 5 5 0 1 1 5 0 Z',
    fill: '#FFFFFF',
    stroke: '#000000',
  },
};

// ============================================================================
// EXPORT TYPES
// ============================================================================

export type AllConnectingObjects =
  | SequenceFlowPropsType
  | MessageFlowProps
  | AssociationProps
  | DataInputAssociationProps
  | DataOutputAssociationProps;

export type AllSwimLanes = PoolProps | LaneProps;
