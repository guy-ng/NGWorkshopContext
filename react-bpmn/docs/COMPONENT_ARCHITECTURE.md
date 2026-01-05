# React BPMN Editor - Component Architecture
## Technical Design Document

---

## 1. Overview

This document outlines the component architecture for the React BPMN 2.0 Editor, providing a comprehensive blueprint for implementing a modern, maintainable, and performant diagram editor.

### 1.1 Design Principles

| Principle | Description |
|-----------|-------------|
| **Composition** | Small, focused components composed together |
| **Separation of Concerns** | UI, state, and business logic separated |
| **Type Safety** | Full TypeScript coverage |
| **Performance** | Virtualization, memoization, efficient rendering |
| **Accessibility** | WCAG AA compliance, keyboard navigation |
| **Extensibility** | Plugin architecture for custom elements |

---

## 2. High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        BPMNEditor                                │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    EditorProvider                         │   │
│  │  (Context: State, Actions, Selection, History)           │   │
│  │  ┌────────────────────────────────────────────────────┐  │   │
│  │  │                  EditorLayout                       │  │   │
│  │  │  ┌─────────┬─────────────────────┬──────────────┐  │  │   │
│  │  │  │ Toolbar │       Canvas        │  Properties  │  │  │   │
│  │  │  ├─────────┤                     │    Panel     │  │  │   │
│  │  │  │         │  ┌───────────────┐  │              │  │  │   │
│  │  │  │ Palette │  │   SVGCanvas   │  │              │  │  │   │
│  │  │  │         │  │   ├─ Grid     │  │              │  │  │   │
│  │  │  │         │  │   ├─ Elements │  │              │  │  │   │
│  │  │  │         │  │   ├─ Connect. │  │              │  │  │   │
│  │  │  │         │  │   └─ Overlays │  │              │  │  │   │
│  │  │  │         │  └───────────────┘  │              │  │  │   │
│  │  │  │         │  ┌─────────────────┐│              │  │  │   │
│  │  │  │         │  │     Minimap     ││              │  │  │   │
│  │  │  └─────────┴──┴─────────────────┴┴──────────────┘  │  │   │
│  │  └────────────────────────────────────────────────────┘  │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. Core Components

### 3.1 BPMNEditor (Root)

The main entry point component.

```typescript
interface BPMNEditorProps {
  // Initial diagram (optional)
  initialXml?: string;
  initialDiagram?: BPMNDiagram;

  // Configuration
  config?: EditorConfig;
  plugins?: EditorPlugin[];

  // Callbacks
  onChange?: (diagram: BPMNDiagram) => void;
  onSelect?: (elements: BPMNElement[]) => void;
  onError?: (error: EditorError) => void;

  // Styling
  className?: string;
  style?: React.CSSProperties;
  theme?: EditorTheme;
}

interface EditorConfig {
  readOnly?: boolean;
  showMinimap?: boolean;
  showToolbar?: boolean;
  showPalette?: boolean;
  showPropertiesPanel?: boolean;
  gridSize?: number;
  snapToGrid?: boolean;
  keyboardShortcuts?: boolean;
}
```

### 3.2 EditorProvider

Context provider for global state management.

```typescript
interface EditorContextValue {
  // State
  diagram: BPMNDiagram;
  selection: Set<string>;
  viewport: ViewportState;
  mode: EditorMode;

  // Actions
  actions: {
    // Element operations
    addElement: (element: BPMNElement, position: Point) => void;
    updateElement: (id: string, updates: Partial<BPMNElement>) => void;
    deleteElements: (ids: string[]) => void;
    moveElements: (ids: string[], delta: Point) => void;

    // Connection operations
    addConnection: (connection: BPMNConnection) => void;
    updateConnection: (id: string, updates: Partial<BPMNConnection>) => void;
    deleteConnections: (ids: string[]) => void;

    // Selection
    select: (ids: string[], additive?: boolean) => void;
    selectAll: () => void;
    clearSelection: () => void;

    // Viewport
    setZoom: (zoom: number) => void;
    pan: (delta: Point) => void;
    fitToScreen: () => void;

    // History
    undo: () => void;
    redo: () => void;

    // Clipboard
    copy: () => void;
    cut: () => void;
    paste: () => void;

    // Import/Export
    importXml: (xml: string) => Promise<void>;
    exportXml: () => string;
  };

  // Computed
  canUndo: boolean;
  canRedo: boolean;
  hasSelection: boolean;
}

type EditorMode =
  | 'select'
  | 'pan'
  | 'connect'
  | 'drag'
  | 'resize'
  | 'multiSelect';
```

---

## 4. Canvas Components

### 4.1 SVGCanvas

Main rendering surface using SVG.

```typescript
interface SVGCanvasProps {
  width: number;
  height: number;
  viewport: ViewportState;
  onViewportChange: (viewport: ViewportState) => void;
}

interface ViewportState {
  zoom: number;      // 0.1 to 4.0
  panX: number;
  panY: number;
}

// Canvas structure
<SVGCanvas>
  <defs>
    <ArrowMarkers />
    <Patterns />
    <Filters />
  </defs>

  <g transform={viewportTransform}>
    <GridLayer />
    <SwimlanesLayer />
    <ConnectionsLayer />
    <ElementsLayer />
    <OverlaysLayer />
    <SelectionLayer />
    <DragPreviewLayer />
  </g>
</SVGCanvas>
```

### 4.2 Rendering Layers

```typescript
// Layer order (bottom to top)
const LAYER_ORDER = [
  'grid',          // Background grid
  'swimlanes',     // Pools and lanes
  'groups',        // Visual groups
  'connections',   // All connector types
  'elements',      // Flow objects and artifacts
  'overlays',      // Labels, markers
  'selection',     // Selection boxes, handles
  'dragPreview',   // Ghost elements during drag
  'contextMenu',   // Right-click menus
] as const;

interface LayerProps {
  elements: BPMNElement[];
  selection: Set<string>;
  zoom: number;
}
```

### 4.3 Grid Component

```typescript
interface GridProps {
  size: number;        // Grid cell size (default: 10)
  majorSize: number;   // Major grid size (default: 100)
  visible: boolean;
  snap: boolean;
}

// Renders infinite grid pattern
<Grid>
  <pattern id="grid-minor">
    <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#E0E0E0" />
  </pattern>
  <pattern id="grid-major">
    <path d="M 100 0 L 0 0 0 100" fill="none" stroke="#BDBDBD" />
  </pattern>
  <rect fill="url(#grid-minor)" />
  <rect fill="url(#grid-major)" />
</Grid>
```

---

## 5. Element Components

### 5.1 Element Component Factory

```typescript
// Element type to component mapping
const ElementComponents: Record<string, React.ComponentType<ElementProps>> = {
  // Events
  startEvent: StartEventComponent,
  intermediateEvent: IntermediateEventComponent,
  endEvent: EndEventComponent,
  boundaryEvent: BoundaryEventComponent,

  // Activities
  task: TaskComponent,
  userTask: UserTaskComponent,
  serviceTask: ServiceTaskComponent,
  scriptTask: ScriptTaskComponent,
  manualTask: ManualTaskComponent,
  sendTask: SendTaskComponent,
  receiveTask: ReceiveTaskComponent,
  businessRuleTask: BusinessRuleTaskComponent,
  subProcess: SubProcessComponent,
  callActivity: CallActivityComponent,

  // Gateways
  exclusiveGateway: ExclusiveGatewayComponent,
  parallelGateway: ParallelGatewayComponent,
  inclusiveGateway: InclusiveGatewayComponent,
  eventBasedGateway: EventBasedGatewayComponent,
  complexGateway: ComplexGatewayComponent,

  // Artifacts
  dataObject: DataObjectComponent,
  dataStore: DataStoreComponent,
  group: GroupComponent,
  textAnnotation: TextAnnotationComponent,

  // Swimlanes
  pool: PoolComponent,
  lane: LaneComponent,
};

// Factory function
function renderElement(element: BPMNElement, props: ElementProps): JSX.Element {
  const Component = ElementComponents[element.type];
  if (!Component) {
    console.warn(`Unknown element type: ${element.type}`);
    return <UnknownElementComponent {...props} />;
  }
  return <Component {...props} />;
}
```

### 5.2 Base Element Props

```typescript
interface ElementProps {
  element: BPMNElement;
  shape: BPMNShape;
  isSelected: boolean;
  isHovered: boolean;
  isDragging: boolean;

  // Callbacks
  onSelect: (e: React.MouseEvent) => void;
  onDragStart: (e: React.MouseEvent) => void;
  onDoubleClick: (e: React.MouseEvent) => void;
  onContextMenu: (e: React.MouseEvent) => void;
}
```

### 5.3 Event Component Example

```typescript
const StartEventComponent: React.FC<ElementProps> = ({
  element,
  shape,
  isSelected,
  isHovered,
  onSelect,
  onDragStart,
  onDoubleClick,
  onContextMenu,
}) => {
  const { x, y, width, height } = shape.bounds;
  const eventDef = element as BPMNStartEvent;
  const radius = width / 2;

  return (
    <g
      className={clsx('bpmn-event bpmn-start-event', {
        selected: isSelected,
        hovered: isHovered,
      })}
      transform={`translate(${x}, ${y})`}
      onClick={onSelect}
      onMouseDown={onDragStart}
      onDoubleClick={onDoubleClick}
      onContextMenu={onContextMenu}
    >
      {/* Event circle */}
      <circle
        cx={radius}
        cy={radius}
        r={radius - 1}
        className="event-border"
      />

      {/* Event type icon */}
      <EventIcon
        type={eventDef.eventType}
        behavior="catching"
        x={radius}
        y={radius}
        size={20}
      />

      {/* Selection handles */}
      {isSelected && <SelectionHandles bounds={shape.bounds} />}

      {/* Connection points */}
      <ConnectionPoints
        element={element}
        bounds={shape.bounds}
        visible={isHovered || isSelected}
      />

      {/* Label */}
      {element.name && (
        <ElementLabel
          text={element.name}
          x={radius}
          y={height + 15}
          maxWidth={100}
        />
      )}
    </g>
  );
};
```

---

## 6. Connection Components

### 6.1 Connection Renderer

```typescript
interface ConnectionProps {
  connection: BPMNConnection;
  edge: BPMNEdge;
  isSelected: boolean;
  isHovered: boolean;

  onSelect: (e: React.MouseEvent) => void;
  onWaypointDrag: (index: number, point: Point) => void;
}

const ConnectionComponent: React.FC<ConnectionProps> = ({
  connection,
  edge,
  isSelected,
  isHovered,
  onSelect,
  onWaypointDrag,
}) => {
  const waypoints = edge.waypoints;
  const pathData = generatePathData(waypoints);

  return (
    <g
      className={clsx('bpmn-connection', connection.type, {
        selected: isSelected,
        hovered: isHovered,
      })}
      onClick={onSelect}
    >
      {/* Invisible hit area for easier selection */}
      <path
        d={pathData}
        className="connection-hit-area"
        strokeWidth={20}
        stroke="transparent"
        fill="none"
      />

      {/* Visible path */}
      <path
        d={pathData}
        className="connection-path"
        markerEnd={getEndMarker(connection.type)}
        markerStart={getStartMarker(connection.type)}
      />

      {/* Conditional marker (for conditional flows) */}
      {connection.type === 'sequenceFlow' && connection.conditionExpression && (
        <ConditionalMarker position={waypoints[0]} />
      )}

      {/* Default flow marker */}
      {connection.type === 'sequenceFlow' && connection.isDefault && (
        <DefaultFlowMarker position={waypoints[0]} />
      )}

      {/* Label */}
      {connection.name && (
        <ConnectionLabel
          text={connection.name}
          waypoints={waypoints}
        />
      )}

      {/* Waypoint handles */}
      {isSelected && (
        <WaypointHandles
          waypoints={waypoints}
          onDrag={onWaypointDrag}
        />
      )}
    </g>
  );
};
```

### 6.2 Path Generation

```typescript
// Generate SVG path from waypoints
function generatePathData(waypoints: Point[]): string {
  if (waypoints.length < 2) return '';

  const [start, ...rest] = waypoints;
  let d = `M ${start.x} ${start.y}`;

  for (const point of rest) {
    d += ` L ${point.x} ${point.y}`;
  }

  return d;
}

// Generate curved path (bezier)
function generateCurvedPath(waypoints: Point[]): string {
  if (waypoints.length < 2) return '';
  if (waypoints.length === 2) {
    return `M ${waypoints[0].x} ${waypoints[0].y} L ${waypoints[1].x} ${waypoints[1].y}`;
  }

  // Use quadratic bezier curves through waypoints
  let d = `M ${waypoints[0].x} ${waypoints[0].y}`;

  for (let i = 1; i < waypoints.length - 1; i++) {
    const curr = waypoints[i];
    const next = waypoints[i + 1];
    const midX = (curr.x + next.x) / 2;
    const midY = (curr.y + next.y) / 2;
    d += ` Q ${curr.x} ${curr.y} ${midX} ${midY}`;
  }

  const last = waypoints[waypoints.length - 1];
  d += ` L ${last.x} ${last.y}`;

  return d;
}
```

---

## 7. UI Components

### 7.1 Toolbar

```typescript
interface ToolbarProps {
  canUndo: boolean;
  canRedo: boolean;
  zoom: number;
  onUndo: () => void;
  onRedo: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitToScreen: () => void;
  onExport: () => void;
  onImport: () => void;
}

<Toolbar>
  <ToolbarGroup>
    <Button icon={<UndoIcon />} onClick={onUndo} disabled={!canUndo} />
    <Button icon={<RedoIcon />} onClick={onRedo} disabled={!canRedo} />
  </ToolbarGroup>

  <ToolbarDivider />

  <ToolbarGroup>
    <Button icon={<ZoomOutIcon />} onClick={onZoomOut} />
    <ZoomDisplay value={zoom} onChange={setZoom} />
    <Button icon={<ZoomInIcon />} onClick={onZoomIn} />
    <Button icon={<FitScreenIcon />} onClick={onFitToScreen} />
  </ToolbarGroup>

  <ToolbarDivider />

  <ToolbarGroup>
    <Button icon={<ImportIcon />} onClick={onImport}>Import</Button>
    <Button icon={<ExportIcon />} onClick={onExport}>Export</Button>
  </ToolbarGroup>
</Toolbar>
```

### 7.2 Palette

```typescript
interface PaletteProps {
  onDragStart: (elementType: string) => void;
}

const PALETTE_GROUPS: PaletteGroup[] = [
  {
    name: 'Events',
    items: [
      { type: 'startEvent', icon: StartEventIcon, label: 'Start Event' },
      { type: 'intermediateThrowEvent', icon: IntermediateEventIcon, label: 'Intermediate Event' },
      { type: 'endEvent', icon: EndEventIcon, label: 'End Event' },
    ],
  },
  {
    name: 'Activities',
    items: [
      { type: 'task', icon: TaskIcon, label: 'Task' },
      { type: 'userTask', icon: UserTaskIcon, label: 'User Task' },
      { type: 'serviceTask', icon: ServiceTaskIcon, label: 'Service Task' },
      { type: 'subProcess', icon: SubProcessIcon, label: 'Sub-Process' },
    ],
  },
  {
    name: 'Gateways',
    items: [
      { type: 'exclusiveGateway', icon: XORGatewayIcon, label: 'Exclusive Gateway' },
      { type: 'parallelGateway', icon: ANDGatewayIcon, label: 'Parallel Gateway' },
      { type: 'inclusiveGateway', icon: ORGatewayIcon, label: 'Inclusive Gateway' },
    ],
  },
  {
    name: 'Data',
    items: [
      { type: 'dataObject', icon: DataObjectIcon, label: 'Data Object' },
      { type: 'dataStore', icon: DataStoreIcon, label: 'Data Store' },
    ],
  },
  {
    name: 'Swimlanes',
    items: [
      { type: 'pool', icon: PoolIcon, label: 'Pool' },
      { type: 'lane', icon: LaneIcon, label: 'Lane' },
    ],
  },
  {
    name: 'Artifacts',
    items: [
      { type: 'group', icon: GroupIcon, label: 'Group' },
      { type: 'textAnnotation', icon: AnnotationIcon, label: 'Text Annotation' },
    ],
  },
];

<Palette>
  {PALETTE_GROUPS.map(group => (
    <PaletteGroup key={group.name} title={group.name}>
      {group.items.map(item => (
        <PaletteItem
          key={item.type}
          draggable
          onDragStart={() => onDragStart(item.type)}
        >
          <item.icon />
          <span>{item.label}</span>
        </PaletteItem>
      ))}
    </PaletteGroup>
  ))}
</Palette>
```

### 7.3 Properties Panel

```typescript
interface PropertiesPanelProps {
  selection: BPMNElement[];
  onUpdate: (id: string, updates: Partial<BPMNElement>) => void;
}

<PropertiesPanel>
  {selection.length === 0 && (
    <EmptyState>Select an element to view properties</EmptyState>
  )}

  {selection.length === 1 && (
    <>
      <PropertiesHeader element={selection[0]} />

      <PropertiesSection title="General">
        <PropertyField
          label="ID"
          value={selection[0].id}
          readOnly
        />
        <PropertyField
          label="Name"
          value={selection[0].name}
          onChange={(name) => onUpdate(selection[0].id, { name })}
        />
      </PropertiesSection>

      {/* Element-specific properties */}
      <ElementSpecificProperties
        element={selection[0]}
        onUpdate={onUpdate}
      />

      <PropertiesSection title="Documentation">
        <TextArea
          value={selection[0].documentation}
          onChange={(doc) => onUpdate(selection[0].id, { documentation: doc })}
        />
      </PropertiesSection>
    </>
  )}

  {selection.length > 1 && (
    <MultiSelectionProperties
      elements={selection}
      onUpdate={onUpdate}
    />
  )}
</PropertiesPanel>
```

---

## 8. State Management

### 8.1 Store Structure (Zustand)

```typescript
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

interface EditorStore {
  // Diagram state
  diagram: BPMNDiagram;
  shapes: Map<string, BPMNShape>;
  edges: Map<string, BPMNEdge>;

  // Editor state
  selection: Set<string>;
  clipboard: ClipboardData | null;
  mode: EditorMode;
  activeTool: ToolType;

  // Viewport state
  viewport: ViewportState;

  // History state
  past: HistoryEntry[];
  future: HistoryEntry[];

  // Actions
  // ... (defined in actions slice)
}

const useEditorStore = create<EditorStore>()(
  devtools(
    persist(
      immer((set, get) => ({
        // Initial state
        diagram: createEmptyDiagram(),
        shapes: new Map(),
        edges: new Map(),
        selection: new Set(),
        clipboard: null,
        mode: 'select',
        activeTool: 'select',
        viewport: { zoom: 1, panX: 0, panY: 0 },
        past: [],
        future: [],

        // Actions implemented with immer
        addElement: (element, shape) =>
          set((state) => {
            state.diagram.elements.push(element);
            state.shapes.set(element.id, shape);
            pushHistory(state);
          }),

        // ... more actions
      })),
      { name: 'bpmn-editor' }
    )
  )
);
```

### 8.2 History Management

```typescript
interface HistoryEntry {
  diagram: BPMNDiagram;
  shapes: Map<string, BPMNShape>;
  edges: Map<string, BPMNEdge>;
  timestamp: number;
  action: string;
}

const MAX_HISTORY = 50;

function pushHistory(state: EditorStore, action: string) {
  state.past.push({
    diagram: structuredClone(state.diagram),
    shapes: new Map(state.shapes),
    edges: new Map(state.edges),
    timestamp: Date.now(),
    action,
  });

  // Limit history size
  if (state.past.length > MAX_HISTORY) {
    state.past.shift();
  }

  // Clear future on new action
  state.future = [];
}

function undo(state: EditorStore) {
  const previous = state.past.pop();
  if (!previous) return;

  // Save current state to future
  state.future.push({
    diagram: state.diagram,
    shapes: state.shapes,
    edges: state.edges,
    timestamp: Date.now(),
    action: 'undo',
  });

  // Restore previous state
  state.diagram = previous.diagram;
  state.shapes = previous.shapes;
  state.edges = previous.edges;
}
```

---

## 9. Event Handling

### 9.1 Interaction Manager

```typescript
class InteractionManager {
  private canvas: SVGSVGElement;
  private store: EditorStore;
  private dragState: DragState | null = null;

  constructor(canvas: SVGSVGElement, store: EditorStore) {
    this.canvas = canvas;
    this.store = store;
    this.setupEventListeners();
  }

  private setupEventListeners() {
    this.canvas.addEventListener('mousedown', this.handleMouseDown);
    this.canvas.addEventListener('mousemove', this.handleMouseMove);
    this.canvas.addEventListener('mouseup', this.handleMouseUp);
    this.canvas.addEventListener('wheel', this.handleWheel);
    this.canvas.addEventListener('contextmenu', this.handleContextMenu);

    // Keyboard events on document
    document.addEventListener('keydown', this.handleKeyDown);
    document.addEventListener('keyup', this.handleKeyUp);
  }

  private handleMouseDown = (e: MouseEvent) => {
    const point = this.getCanvasPoint(e);
    const element = this.getElementAtPoint(point);

    if (e.button === 0) { // Left click
      if (element) {
        this.startElementDrag(element, point, e.shiftKey);
      } else if (this.store.mode === 'select') {
        this.startMultiSelect(point);
      } else if (this.store.mode === 'pan') {
        this.startPan(point);
      }
    }
  };

  private handleMouseMove = (e: MouseEvent) => {
    if (!this.dragState) return;

    const point = this.getCanvasPoint(e);

    switch (this.dragState.type) {
      case 'element':
        this.updateElementDrag(point);
        break;
      case 'multiSelect':
        this.updateMultiSelect(point);
        break;
      case 'pan':
        this.updatePan(point);
        break;
      case 'connect':
        this.updateConnection(point);
        break;
      case 'resize':
        this.updateResize(point);
        break;
    }
  };

  // ... more handlers
}
```

### 9.2 Keyboard Shortcuts

```typescript
const KEYBOARD_SHORTCUTS: KeyboardShortcut[] = [
  // Selection
  { key: 'a', ctrl: true, action: 'selectAll' },
  { key: 'Escape', action: 'clearSelection' },

  // Clipboard
  { key: 'c', ctrl: true, action: 'copy' },
  { key: 'x', ctrl: true, action: 'cut' },
  { key: 'v', ctrl: true, action: 'paste' },

  // History
  { key: 'z', ctrl: true, action: 'undo' },
  { key: 'y', ctrl: true, action: 'redo' },
  { key: 'z', ctrl: true, shift: true, action: 'redo' },

  // Delete
  { key: 'Delete', action: 'deleteSelection' },
  { key: 'Backspace', action: 'deleteSelection' },

  // Zoom
  { key: '+', ctrl: true, action: 'zoomIn' },
  { key: '-', ctrl: true, action: 'zoomOut' },
  { key: '0', ctrl: true, action: 'resetZoom' },
  { key: '1', ctrl: true, action: 'fitToScreen' },

  // Navigation
  { key: 'ArrowUp', action: 'nudgeUp' },
  { key: 'ArrowDown', action: 'nudgeDown' },
  { key: 'ArrowLeft', action: 'nudgeLeft' },
  { key: 'ArrowRight', action: 'nudgeRight' },

  // Tools
  { key: 'v', action: 'selectTool' },
  { key: 'h', action: 'panTool' },
  { key: 'c', action: 'connectTool' },
];
```

---

## 10. XML Import/Export

### 10.1 XML Parser

```typescript
import { XMLParser, XMLBuilder } from 'fast-xml-parser';

class BPMNXMLParser {
  private parser: XMLParser;
  private builder: XMLBuilder;

  constructor() {
    this.parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '@_',
      textNodeName: '#text',
      preserveOrder: true,
    });

    this.builder = new XMLBuilder({
      ignoreAttributes: false,
      attributeNamePrefix: '@_',
      textNodeName: '#text',
      format: true,
      indentBy: '  ',
    });
  }

  parse(xml: string): BPMNDiagram {
    const doc = this.parser.parse(xml);
    return this.convertToDiagram(doc);
  }

  serialize(diagram: BPMNDiagram): string {
    const doc = this.convertToXML(diagram);
    return this.builder.build(doc);
  }

  private convertToDiagram(doc: any): BPMNDiagram {
    // Extract definitions
    const definitions = doc['bpmn:definitions'] || doc['definitions'];

    // Extract processes
    const processes = this.extractProcesses(definitions);

    // Extract collaboration (if exists)
    const collaboration = this.extractCollaboration(definitions);

    // Extract diagram interchange
    const di = this.extractDiagramInterchange(definitions);

    return {
      id: definitions['@_id'],
      name: definitions['@_name'],
      processes,
      collaboration,
      shapes: di.shapes,
      edges: di.edges,
    };
  }

  // ... more conversion methods
}
```

### 10.2 XML Schema Validation

```typescript
interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

class BPMNValidator {
  validate(diagram: BPMNDiagram): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // Validate structure
    this.validateProcesses(diagram.processes, errors, warnings);

    // Validate elements
    for (const process of diagram.processes) {
      this.validateElements(process.flowElements, errors, warnings);
    }

    // Validate connections
    this.validateConnections(diagram, errors, warnings);

    // Validate swimlanes
    if (diagram.collaboration) {
      this.validateCollaboration(diagram.collaboration, errors, warnings);
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  private validateElements(
    elements: BPMNFlowElement[],
    errors: ValidationError[],
    warnings: ValidationWarning[]
  ) {
    for (const element of elements) {
      // Check required fields
      if (!element.id) {
        errors.push({
          code: 'MISSING_ID',
          message: 'Element is missing required ID',
          element: element,
        });
      }

      // Check connections
      if (this.isFlowNode(element)) {
        if (element.incoming?.length === 0 && !this.isStartEvent(element)) {
          warnings.push({
            code: 'NO_INCOMING',
            message: `${element.type} has no incoming connections`,
            element: element,
          });
        }
      }

      // Element-specific validation
      this.validateElementSpecific(element, errors, warnings);
    }
  }
}
```

---

## 11. Performance Optimizations

### 11.1 Virtualization

```typescript
// Only render elements visible in viewport
function useVisibleElements(
  elements: BPMNElement[],
  shapes: Map<string, BPMNShape>,
  viewport: ViewportState,
  canvasSize: Size
): BPMNElement[] {
  return useMemo(() => {
    const visibleBounds = getVisibleBounds(viewport, canvasSize);

    return elements.filter((element) => {
      const shape = shapes.get(element.id);
      if (!shape) return false;
      return boundsIntersect(shape.bounds, visibleBounds);
    });
  }, [elements, shapes, viewport, canvasSize]);
}
```

### 11.2 Memoization

```typescript
// Memoize expensive computations
const MemoizedElement = React.memo(
  ElementComponent,
  (prevProps, nextProps) => {
    // Custom comparison for performance
    return (
      prevProps.element.id === nextProps.element.id &&
      prevProps.isSelected === nextProps.isSelected &&
      prevProps.isHovered === nextProps.isHovered &&
      shapeEqual(prevProps.shape, nextProps.shape)
    );
  }
);

// Memoize path calculations
const pathCache = new Map<string, string>();

function getCachedPath(waypoints: Point[]): string {
  const key = waypoints.map((p) => `${p.x},${p.y}`).join('|');

  if (!pathCache.has(key)) {
    pathCache.set(key, generatePathData(waypoints));
  }

  return pathCache.get(key)!;
}
```

### 11.3 Render Batching

```typescript
// Batch multiple state updates
const batchUpdate = useBatchedUpdates();

function handleMultiMove(elements: string[], delta: Point) {
  batchUpdate(() => {
    for (const id of elements) {
      store.moveElement(id, delta);
    }
  });
}
```

---

## 12. Directory Structure

```
src/
├── components/
│   ├── BPMNEditor/
│   │   ├── BPMNEditor.tsx
│   │   ├── BPMNEditor.styles.ts
│   │   └── index.ts
│   ├── Canvas/
│   │   ├── SVGCanvas.tsx
│   │   ├── Grid.tsx
│   │   ├── Minimap.tsx
│   │   └── layers/
│   │       ├── ElementsLayer.tsx
│   │       ├── ConnectionsLayer.tsx
│   │       └── SelectionLayer.tsx
│   ├── Elements/
│   │   ├── Events/
│   │   │   ├── StartEvent.tsx
│   │   │   ├── IntermediateEvent.tsx
│   │   │   ├── EndEvent.tsx
│   │   │   └── BoundaryEvent.tsx
│   │   ├── Activities/
│   │   │   ├── Task.tsx
│   │   │   ├── SubProcess.tsx
│   │   │   └── CallActivity.tsx
│   │   ├── Gateways/
│   │   │   ├── ExclusiveGateway.tsx
│   │   │   ├── ParallelGateway.tsx
│   │   │   └── ...
│   │   ├── Artifacts/
│   │   │   ├── DataObject.tsx
│   │   │   ├── DataStore.tsx
│   │   │   └── TextAnnotation.tsx
│   │   └── Swimlanes/
│   │       ├── Pool.tsx
│   │       └── Lane.tsx
│   ├── Connections/
│   │   ├── SequenceFlow.tsx
│   │   ├── MessageFlow.tsx
│   │   └── Association.tsx
│   ├── UI/
│   │   ├── Toolbar/
│   │   ├── Palette/
│   │   ├── PropertiesPanel/
│   │   └── ContextMenu/
│   └── shared/
│       ├── ElementLabel.tsx
│       ├── SelectionHandles.tsx
│       └── ConnectionPoints.tsx
├── hooks/
│   ├── useEditorState.ts
│   ├── useSelection.ts
│   ├── useDragDrop.ts
│   ├── useKeyboard.ts
│   └── useViewport.ts
├── store/
│   ├── editorStore.ts
│   ├── selectors.ts
│   └── actions/
│       ├── elementActions.ts
│       ├── connectionActions.ts
│       └── historyActions.ts
├── services/
│   ├── xml/
│   │   ├── parser.ts
│   │   ├── serializer.ts
│   │   └── validator.ts
│   ├── layout/
│   │   ├── autoLayout.ts
│   │   └── connectionRouter.ts
│   └── clipboard/
│       └── clipboardService.ts
├── types/
│   ├── bpmn.ts
│   ├── diagram.ts
│   ├── editor.ts
│   └── xml.ts
├── utils/
│   ├── geometry.ts
│   ├── id.ts
│   └── svg.ts
├── constants/
│   ├── dimensions.ts
│   ├── colors.ts
│   └── shortcuts.ts
└── index.ts
```

---

## 13. Testing Strategy

### 13.1 Unit Tests

```typescript
// Component tests
describe('StartEvent', () => {
  it('renders with correct dimensions', () => {
    const { container } = render(
      <StartEventComponent
        element={mockStartEvent}
        shape={mockShape}
        isSelected={false}
        isHovered={false}
      />
    );

    const circle = container.querySelector('circle');
    expect(circle).toHaveAttribute('r', '17');
  });

  it('shows selection handles when selected', () => {
    const { container } = render(
      <StartEventComponent
        element={mockStartEvent}
        shape={mockShape}
        isSelected={true}
        isHovered={false}
      />
    );

    expect(container.querySelector('.selection-handles')).toBeInTheDocument();
  });
});
```

### 13.2 Integration Tests

```typescript
describe('BPMNEditor', () => {
  it('adds element on palette drag', async () => {
    const { getByTestId, container } = render(<BPMNEditor />);

    const taskPaletteItem = getByTestId('palette-task');
    const canvas = getByTestId('canvas');

    fireEvent.dragStart(taskPaletteItem);
    fireEvent.drop(canvas, { clientX: 200, clientY: 200 });

    await waitFor(() => {
      expect(container.querySelector('.bpmn-task')).toBeInTheDocument();
    });
  });

  it('exports valid BPMN XML', async () => {
    const { getByTestId } = render(<BPMNEditor initialXml={sampleXml} />);

    const exportButton = getByTestId('export-button');
    fireEvent.click(exportButton);

    const exportedXml = await getExportedXml();
    const validation = validateBPMNXml(exportedXml);

    expect(validation.valid).toBe(true);
  });
});
```

---

*React BPMN Editor - Component Architecture v1.0*
