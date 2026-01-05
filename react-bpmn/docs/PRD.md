# Product Requirements Document (PRD)
# React BPMN 2.0 Diagram Editor

## Document Information
- **Version:** 1.0
- **Date:** January 2026
- **Status:** Draft

---

## 1. Executive Summary

### 1.1 Product Vision
Build a modern, open-source React component library for creating, editing, and saving BPMN 2.0 (Business Process Model and Notation) diagrams. The component should provide a user experience similar to [bpmn.io](https://demo.bpmn.io/new) while being built from scratch using React and modern web technologies, avoiding any bpmn.io code to ensure clean intellectual property.

### 1.2 Key Objectives
1. **Full BPMN 2.0 Compliance:** Support all 116 BPMN 2.0 elements with proper visual representation and XML serialization
2. **React-Native Implementation:** Pure React component architecture with no dependencies on bpmn.io
3. **Intuitive UX:** Drag-and-drop interface, context menus, keyboard shortcuts
4. **XML Import/Export:** Full BPMN 2.0 XML schema compliance for interoperability
5. **Extensibility:** Plugin architecture for custom elements and behaviors

### 1.3 Target Users
- **Business Analysts:** Design process flows visually
- **Software Developers:** Integrate BPMN editing into applications
- **Process Engineers:** Model and document business processes
- **Enterprise Applications:** Embed BPMN editing in workflow tools

---

## 2. Product Overview

### 2.1 What is BPMN 2.0?
BPMN 2.0 (Business Process Model and Notation) is the de-facto industry standard for business process diagrams, maintained by the Object Management Group (OMG) and ratified as ISO 19510:2013. It provides:

- Standardized graphical notation (116 elements)
- Formal execution semantics
- XML interchange format
- Token-based process execution model

### 2.2 Product Scope

#### In Scope
- Visual BPMN diagram editing
- All BPMN 2.0 element types (Flow Objects, Connecting Objects, Swimlanes, Artifacts)
- XML import/export with BPMN 2.0 schema compliance
- Diagram Interchange (DI) support for visual positions
- Undo/redo functionality
- Copy/paste/delete operations
- Zoom/pan navigation
- Element property editing
- Validation rules

#### Out of Scope (v1.0)
- Process execution engine
- BPMN simulation/animation
- Choreography diagrams (deferred to v2.0)
- Conversation diagrams (deferred to v2.0)
- Real-time collaboration
- Cloud storage integration

---

## 3. BPMN 2.0 Element Categories

### 3.1 Flow Objects (Core Elements)

#### 3.1.1 Events (Circles)
Events are triggers that start, modify, or complete a process.

| Category | Position | Visual | Description |
|----------|----------|--------|-------------|
| Start Events | Process entry | Thin circle | Catch-only, triggers process start |
| Intermediate Events | Mid-process | Double circle | Catch or throw during execution |
| End Events | Process exit | Thick circle | Throw-only, terminates process path |

**Event Types (13 total):**
1. None (empty)
2. Message
3. Timer
4. Error
5. Cancel
6. Compensation
7. Conditional
8. Link
9. Signal
10. Terminate
11. Escalation
12. Multiple
13. Parallel Multiple

**Boundary Events:** Attached to activities, can be interrupting or non-interrupting.

#### 3.1.2 Activities (Rounded Rectangles)
Work units performed in the process.

**Task Types (8):**
1. Abstract Task
2. User Task
3. Service Task
4. Script Task
5. Manual Task
6. Send Task
7. Receive Task
8. Business Rule Task

**Sub-Process Types (5):**
1. Embedded Sub-Process
2. Call Activity (Reusable)
3. Event Sub-Process
4. Transaction Sub-Process
5. Ad-Hoc Sub-Process

**Activity Markers:**
- Loop marker (curved arrow)
- Multi-instance parallel (3 vertical lines)
- Multi-instance sequential (3 horizontal lines)
- Compensation marker (double arrow)

#### 3.1.3 Gateways (Diamonds)
Control flow decision and merge points.

| Gateway Type | Symbol | Behavior |
|-------------|--------|----------|
| Exclusive (XOR) | X | One path selected |
| Parallel (AND) | + | All paths executed |
| Inclusive (OR) | O | One or more paths |
| Event-Based | Pentagon | First event wins |
| Complex | * | Custom logic |

### 3.2 Connecting Objects (Lines)

| Type | Style | Purpose |
|------|-------|---------|
| Sequence Flow | Solid + arrow | Order within pool |
| Message Flow | Dashed + circle/arrow | Communication between pools |
| Association | Dotted | Link artifacts to elements |
| Data Association | Dotted + arrow | Data flow direction |

### 3.3 Swimlanes (Containers)

| Element | Purpose | Visual |
|---------|---------|--------|
| Pool | Participant/organization | Large rectangle container |
| Lane | Role/department | Subdivisions within pool |

### 3.4 Artifacts (Supporting Elements)

| Element | Purpose | Visual |
|---------|---------|--------|
| Data Object | Information item | Document icon |
| Data Store | Persistent storage | Database cylinder |
| Group | Visual organization | Dashed rounded rectangle |
| Text Annotation | Comments/notes | Open bracket with text |

---

## 4. Functional Requirements

### 4.1 Canvas Operations

| ID | Requirement | Priority |
|----|-------------|----------|
| F-001 | SVG-based rendering for scalability | P0 |
| F-002 | Pan and zoom with mouse/touch | P0 |
| F-003 | Grid snap for element alignment | P1 |
| F-004 | Selection of single and multiple elements | P0 |
| F-005 | Keyboard shortcuts (delete, copy, paste) | P0 |
| F-006 | Context menu for element operations | P1 |
| F-007 | Mini-map navigation | P2 |

### 4.2 Element Operations

| ID | Requirement | Priority |
|----|-------------|----------|
| F-010 | Drag elements from palette to canvas | P0 |
| F-011 | Move elements by dragging | P0 |
| F-012 | Resize activities and swimlanes | P0 |
| F-013 | Connect elements with sequence flows | P0 |
| F-014 | Add waypoints to connections | P1 |
| F-015 | Auto-routing for connections | P2 |
| F-016 | Attach boundary events to activities | P1 |
| F-017 | Expand/collapse sub-processes | P1 |

### 4.3 Property Editing

| ID | Requirement | Priority |
|----|-------------|----------|
| F-020 | Properties panel for selected element | P0 |
| F-021 | Edit element name inline | P0 |
| F-022 | Configure event types and triggers | P0 |
| F-023 | Set gateway conditions | P1 |
| F-024 | Assign task types with icons | P0 |
| F-025 | Define loop/multi-instance markers | P1 |
| F-026 | Configure compensation activities | P2 |

### 4.4 XML Operations

| ID | Requirement | Priority |
|----|-------------|----------|
| F-030 | Export to BPMN 2.0 XML | P0 |
| F-031 | Import from BPMN 2.0 XML | P0 |
| F-032 | Include Diagram Interchange (DI) | P0 |
| F-033 | Validate XML against schema | P1 |
| F-034 | Support namespace extensions | P2 |

### 4.5 History & State

| ID | Requirement | Priority |
|----|-------------|----------|
| F-040 | Undo operation (Ctrl+Z) | P0 |
| F-041 | Redo operation (Ctrl+Y) | P0 |
| F-042 | Clipboard operations (copy/cut/paste) | P0 |
| F-043 | Auto-save to local storage | P1 |

---

## 5. Non-Functional Requirements

### 5.1 Performance

| ID | Requirement | Target |
|----|-------------|--------|
| NF-001 | Initial render time | < 500ms |
| NF-002 | Element drag responsiveness | 60fps |
| NF-003 | Support diagrams with 500+ elements | Smooth interaction |
| NF-004 | XML export time | < 1s for 500 elements |
| NF-005 | Memory footprint | < 100MB for large diagrams |

### 5.2 Compatibility

| ID | Requirement | Target |
|----|-------------|--------|
| NF-010 | Browser support | Chrome, Firefox, Safari, Edge (latest 2 versions) |
| NF-011 | React version | 18.x+ |
| NF-012 | TypeScript support | Full type definitions |
| NF-013 | SSR compatibility | Next.js support |
| NF-014 | Mobile touch support | Basic operations |

### 5.3 Accessibility

| ID | Requirement | Target |
|----|-------------|--------|
| NF-020 | Keyboard navigation | Full support |
| NF-021 | Screen reader support | ARIA labels |
| NF-022 | Color contrast | WCAG AA |
| NF-023 | Focus indicators | Visible |

---

## 6. Technical Architecture

### 6.1 Technology Stack

| Layer | Technology | Rationale |
|-------|------------|-----------|
| UI Framework | React 18+ | Modern hooks, concurrent features |
| Rendering | SVG | Vector scalability, DOM integration |
| State Management | Zustand/Redux Toolkit | Immutable state, time travel |
| Type Safety | TypeScript | Developer experience, maintainability |
| Styling | CSS-in-JS (styled-components) | Component co-location |
| XML Parsing | fast-xml-parser | Performance, full XML support |
| Build Tool | Vite | Fast builds, HMR |
| Testing | Vitest + Testing Library | Component testing |

### 6.2 Component Architecture

```
BPMNEditor (Root)
├── Toolbar
│   ├── UndoRedoButtons
│   ├── ZoomControls
│   └── ExportButton
├── Palette
│   ├── EventPalette
│   ├── ActivityPalette
│   ├── GatewayPalette
│   ├── ConnectorPalette
│   └── ArtifactPalette
├── Canvas
│   ├── SVGContainer
│   ├── Grid
│   ├── SelectionBox
│   ├── Connections
│   │   ├── SequenceFlow
│   │   ├── MessageFlow
│   │   └── Association
│   ├── Swimlanes
│   │   ├── Pool
│   │   └── Lane
│   └── FlowObjects
│       ├── Events
│       ├── Activities
│       └── Gateways
├── PropertiesPanel
│   ├── GeneralProperties
│   ├── EventProperties
│   ├── ActivityProperties
│   └── GatewayProperties
└── Minimap
```

### 6.3 State Model

```typescript
interface BPMNEditorState {
  // Diagram data
  definitions: BPMNDefinitions;
  process: BPMNProcess;
  collaboration?: BPMNCollaboration;

  // Visual state
  diagram: {
    shapes: Map<string, BPMNShape>;
    edges: Map<string, BPMNEdge>;
  };

  // Editor state
  selection: Set<string>;
  clipboard: BPMNElement[];
  history: HistoryState;

  // View state
  viewport: {
    zoom: number;
    panX: number;
    panY: number;
  };
}
```

### 6.4 XML Schema Namespaces

```xml
xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL"
xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
xmlns:dc="http://www.omg.org/spec/DD/20100524/DC"
xmlns:di="http://www.omg.org/spec/DD/20100524/DI"
```

---

## 7. User Interface Design

### 7.1 Layout

```
┌─────────────────────────────────────────────────────────────┐
│                         Toolbar                              │
├──────────┬─────────────────────────────────────┬────────────┤
│          │                                     │            │
│          │                                     │            │
│ Palette  │              Canvas                 │ Properties │
│          │                                     │            │
│          │                                     │            │
│          │                                     │            │
│          ├──────────────────┬──────────────────┤            │
│          │                  │     Minimap      │            │
└──────────┴──────────────────┴──────────────────┴────────────┘
```

### 7.2 Interaction Patterns

| Action | Trigger | Result |
|--------|---------|--------|
| Add element | Drag from palette | Element placed at cursor |
| Select | Click element | Element selected, properties shown |
| Multi-select | Shift+click or drag box | Multiple elements selected |
| Move | Drag selected | Elements move with cursor |
| Connect | Drag from element handle | Connection drawn |
| Delete | Delete key or context menu | Element removed |
| Edit name | Double-click | Inline text editor |
| Zoom | Scroll wheel or buttons | Canvas zooms |
| Pan | Middle-click drag or space+drag | Canvas pans |

### 7.3 Visual Styling

**Element Dimensions:**
- Start/End Event: 36px diameter
- Intermediate Event: 36px diameter (double circle)
- Activity: 100x80px
- Gateway: 50x50px
- Lane height: 150px minimum
- Pool width: Full diagram width

**Colors:**
- Events: White fill, black stroke
- Activities: White fill (#FFFFFF), 2px black stroke
- Gateways: White fill, 2px black stroke
- Connections: Black (#000000)
- Selection: Blue highlight (#1976D2)
- Grid: Light gray (#E0E0E0)

---

## 8. Implementation Phases

### Phase 1: Core Foundation (MVP)
- Canvas with pan/zoom
- Basic elements (Start, End, Task, Exclusive Gateway)
- Sequence flow connections
- Single pool/lane support
- Basic XML export
- Properties panel

### Phase 2: Full BPMN Elements
- All event types (13)
- All task types (8)
- All gateway types (5)
- Boundary events
- Sub-processes
- Multi-instance markers

### Phase 3: Advanced Features
- XML import
- Validation rules
- Multiple pools
- Message flows
- Data objects and stores
- Groups and annotations

### Phase 4: Polish & Extensions
- Undo/redo history
- Clipboard operations
- Auto-layout
- Minimap
- Keyboard shortcuts
- Accessibility

---

## 9. Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Element render time | < 100ms | Performance API |
| User task completion | < 30s for simple flow | User testing |
| XML compatibility | 100% schema compliance | Automated validation |
| Code coverage | > 80% | Test reports |
| Bundle size | < 500KB gzipped | Build output |
| npm downloads | 1000/month (6 months post-launch) | npm stats |

---

## 10. Risks and Mitigations

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Complex BPMN spec | High | High | Prioritize core elements, phased approach |
| Performance with large diagrams | High | Medium | Virtual rendering, canvas optimization |
| XML parsing edge cases | Medium | Medium | Comprehensive test suite, schema validation |
| Browser compatibility | Medium | Low | Target modern browsers, polyfills |
| Scope creep | High | Medium | Strict MVP definition, backlog management |

---

## 11. Dependencies

### External Libraries
- `fast-xml-parser`: XML parsing/generation
- `zustand` or `@reduxjs/toolkit`: State management
- `styled-components` or `@emotion/react`: Styling
- `uuid`: ID generation
- `hotkeys-js`: Keyboard shortcuts

### No Dependencies On
- bpmn.io libraries (bpmn-js, diagram-js)
- Any Camunda proprietary code
- Other BPMN editor implementations

---

## 12. Appendices

### A. Reference Documents
- [OMG BPMN 2.0 Specification](https://www.omg.org/spec/BPMN/2.0/)
- [ISO 19510:2013](https://www.iso.org/standard/62652.html)
- [Camunda BPMN Reference](https://camunda.com/bpmn/reference/)

### B. Related Specification Files
- [BPMN_EVENTS_SPEC.md](./elements/BPMN_EVENTS_SPEC.md)
- [BPMN_ACTIVITIES_SPEC.md](./elements/BPMN_ACTIVITIES_SPEC.md)
- [BPMN_GATEWAYS_SPEC.md](./elements/BPMN_GATEWAYS_SPEC.md)
- [BPMN_CONNECTORS_SPEC.md](./elements/BPMN_CONNECTORS_SPEC.md)
- [BPMN_SWIMLANES_SPEC.md](./elements/BPMN_SWIMLANES_SPEC.md)
- [BPMN_ARTIFACTS_SPEC.md](./elements/BPMN_ARTIFACTS_SPEC.md)

### C. Glossary
- **BPMN:** Business Process Model and Notation
- **DI:** Diagram Interchange
- **Token:** Virtual marker representing process execution state
- **Pool:** Container representing a participant
- **Lane:** Subdivision within a pool
- **Gateway:** Control flow decision point

---

*Document Version 1.0 | React BPMN Editor PRD*
