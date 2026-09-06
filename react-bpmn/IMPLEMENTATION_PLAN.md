# React BPMN 2.0 Editor - Implementation Plan

**Version:** 1.0
**Date:** January 2026
**Total Phases:** 14
**Estimated Duration:** 12-16 weeks

---

## Table of Contents

1. [Phase 1: Project Setup & Foundation](#phase-1-project-setup--foundation)
2. [Phase 2: Core Type System & State Management](#phase-2-core-type-system--state-management)
3. [Phase 3: Canvas Infrastructure](#phase-3-canvas-infrastructure)
4. [Phase 4: BPMN Elements - Events](#phase-4-bpmn-elements---events)
5. [Phase 5: BPMN Elements - Activities](#phase-5-bpmn-elements---activities)
6. [Phase 6: BPMN Elements - Gateways](#phase-6-bpmn-elements---gateways)
7. [Phase 7: Connecting Objects](#phase-7-connecting-objects)
8. [Phase 8: Swimlanes - Pools & Lanes](#phase-8-swimlanes---pools--lanes)
9. [Phase 9: Artifacts & Data Elements](#phase-9-artifacts--data-elements)
10. [Phase 10: XML Import/Export](#phase-10-xml-importexport)
11. [Phase 11: User Interface Components](#phase-11-user-interface-components)
12. [Phase 12: Interactions & User Experience](#phase-12-interactions--user-experience)
13. [Phase 13: History, Clipboard & Validation](#phase-13-history-clipboard--validation)
14. [Phase 14: Testing & Documentation](#phase-14-testing--documentation)

---

## Phase 1: Project Setup & Foundation

**Goal:** Establish the project structure, development environment, and core dependencies.

### Task 1.1: Initialize Project with Vite + React + TypeScript
**Description:** Create a new Vite project configured for React 18 with TypeScript, including proper tsconfig settings for strict type checking.
**Expected Outcome:**
- Working Vite development server
- React 18 with TypeScript properly configured
- tsconfig.json with strict mode enabled
- Package.json with initial scripts (dev, build, test, lint)
**Files:**
- `package.json`
- `tsconfig.json`
- `vite.config.ts`
- `index.html`
- `src/main.tsx`
- `src/App.tsx`
**Dependencies:** None

### Task 1.2: Configure ESLint and Prettier
**Description:** Set up ESLint with React and TypeScript plugins, Prettier for code formatting, and integrate with VSCode settings.
**Expected Outcome:**
- ESLint configured with recommended rules for React/TypeScript
- Prettier configuration for consistent formatting
- Pre-commit hooks with husky and lint-staged
- VSCode settings for auto-format on save
**Files:**
- `.eslintrc.cjs`
- `.prettierrc`
- `.vscode/settings.json`
- `.husky/pre-commit`
**Dependencies:** Task 1.1

### Task 1.3: Install Core Dependencies
**Description:** Install and configure essential libraries: Zustand for state management, styled-components for CSS-in-JS, uuid for ID generation, and fast-xml-parser for XML operations.
**Expected Outcome:**
- All dependencies installed with correct versions
- TypeScript declarations available for all packages
- Styled-components theme provider configured
**Files:**
- `package.json` (updated)
- `src/styles/theme.ts`
- `src/styles/GlobalStyles.ts`
**Dependencies:** Task 1.1

### Task 1.4: Set Up Testing Framework
**Description:** Configure Vitest with React Testing Library for unit and integration testing, including DOM testing utilities and mocking capabilities.
**Expected Outcome:**
- Vitest configured with jsdom environment
- React Testing Library setup complete
- Test coverage reporting enabled
- Sample test running successfully
**Files:**
- `vitest.config.ts`
- `src/setupTests.ts`
- `src/App.test.tsx`
**Dependencies:** Task 1.1

### Task 1.5: Create Directory Structure
**Description:** Establish the complete folder structure following the component architecture specification.
**Expected Outcome:**
- All directories created as per architecture document
- Index files for module exports
- README in each major directory explaining contents
**Files:**
- `src/components/` (directory structure)
- `src/hooks/`
- `src/store/`
- `src/services/`
- `src/types/`
- `src/utils/`
- `src/constants/`
**Dependencies:** Task 1.1

---

## Phase 2: Core Type System & State Management

**Goal:** Define all TypeScript interfaces and set up centralized state management.

### Task 2.1: Define Base BPMN Types
**Description:** Create TypeScript interfaces for fundamental BPMN concepts: elements, shapes, bounds, and points.
**Expected Outcome:**
- `BPMNElement` base interface with id, name, type
- `Point` and `Bounds` geometry interfaces
- `BPMNShape` and `BPMNEdge` diagram interchange types
- Type guards for runtime type checking
**Files:**
- `src/types/base.ts`
- `src/types/geometry.ts`
- `src/types/diagram.ts`
**Dependencies:** Task 1.5

### Task 2.2: Define Event Types
**Description:** Create interfaces for all 13 BPMN event types including position, behavior, and event-specific definitions.
**Expected Outcome:**
- `EventPosition` type: 'start' | 'intermediate' | 'end' | 'boundary'
- `EventType` union of 13 event types
- `EventBehavior` type: 'catching' | 'throwing'
- `BPMNEvent` interface with all properties
- `TimerDefinition`, error/signal/escalation refs
**Files:**
- `src/types/events.ts`
**Dependencies:** Task 2.1

### Task 2.3: Define Activity Types
**Description:** Create interfaces for 8 task types and 5 sub-process types, including markers and loop characteristics.
**Expected Outcome:**
- `TaskType` union of 8 task types
- `SubProcessType` union of 5 sub-process types
- `ActivityMarkers` interface (loop, multiInstance, compensation)
- `StandardLoopCharacteristics` and `MultiInstanceLoopCharacteristics`
- `BPMNActivity` comprehensive interface
**Files:**
- `src/types/activities.ts`
**Dependencies:** Task 2.1

### Task 2.4: Define Gateway Types
**Description:** Create interfaces for 5 gateway types with direction and condition handling.
**Expected Outcome:**
- `GatewayType` union of 5 types
- `GatewayDirection` type: 'diverging' | 'converging' | 'mixed'
- `BPMNGateway` interface with default flow support
- Sequence flow condition expression type
**Files:**
- `src/types/gateways.ts`
**Dependencies:** Task 2.1

### Task 2.5: Define Connector Types
**Description:** Create interfaces for sequence flows, message flows, associations, and data associations.
**Expected Outcome:**
- `ConnectorType` union type
- `BPMNSequenceFlow` with condition expressions
- `BPMNMessageFlow` with message references
- `BPMNAssociation` with direction
- `BPMNDataAssociation` for data input/output
- `Waypoint` array type for routing
**Files:**
- `src/types/connectors.ts`
**Dependencies:** Task 2.1

### Task 2.6: Define Swimlane Types
**Description:** Create interfaces for pools, lanes, and collaboration elements.
**Expected Outcome:**
- `BPMNParticipant` for pools
- `BPMNLane` with nested lane support
- `BPMNLaneSet` for lane collections
- `BPMNCollaboration` interface
- Pool and lane shape types with orientation
**Files:**
- `src/types/swimlanes.ts`
**Dependencies:** Task 2.1

### Task 2.7: Define Artifact Types
**Description:** Create interfaces for data objects, data stores, groups, and text annotations.
**Expected Outcome:**
- `BPMNDataObject` with collection and state support
- `BPMNDataStore` and `BPMNDataStoreReference`
- `BPMNGroup` with category reference
- `BPMNTextAnnotation` interface
- `ItemDefinition` for type system
**Files:**
- `src/types/artifacts.ts`
**Dependencies:** Task 2.1

### Task 2.8: Create Unified Type Index
**Description:** Create a central index file that exports all types with proper organization.
**Expected Outcome:**
- Single import point for all BPMN types
- Properly namespaced exports
- Re-export of common utility types
**Files:**
- `src/types/index.ts`
- `src/types/bpmn.ts` (combined diagram model)
**Dependencies:** Tasks 2.1-2.7

### Task 2.9: Set Up Zustand Store Structure
**Description:** Create the core Zustand store with diagram state, selection, viewport, and history slices.
**Expected Outcome:**
- `EditorStore` interface defined
- Store with immer middleware for immutable updates
- Devtools middleware for debugging
- Persist middleware for auto-save
**Files:**
- `src/store/editorStore.ts`
- `src/store/types.ts`
**Dependencies:** Task 2.8

### Task 2.10: Implement Element Actions
**Description:** Create actions for adding, updating, deleting, and moving BPMN elements.
**Expected Outcome:**
- `addElement` action with shape creation
- `updateElement` for property changes
- `deleteElements` with cascade deletion
- `moveElements` with bounds update
- All actions properly typed
**Files:**
- `src/store/actions/elementActions.ts`
**Dependencies:** Task 2.9

### Task 2.11: Implement Connection Actions
**Description:** Create actions for managing sequence flows and other connectors.
**Expected Outcome:**
- `addConnection` with waypoint calculation
- `updateConnection` for waypoint changes
- `deleteConnections` with cleanup
- Auto-routing placeholder
**Files:**
- `src/store/actions/connectionActions.ts`
**Dependencies:** Task 2.9

### Task 2.12: Implement Selection Actions
**Description:** Create actions for element selection management.
**Expected Outcome:**
- `select` with additive mode support
- `selectAll` action
- `clearSelection` action
- Multi-select box calculation
**Files:**
- `src/store/actions/selectionActions.ts`
**Dependencies:** Task 2.9

### Task 2.13: Create Store Selectors
**Description:** Implement memoized selectors for efficient state access.
**Expected Outcome:**
- `selectElement` by ID
- `selectSelectedElements` array
- `selectConnections` for element
- `selectBoundingBox` for selection
- Properly memoized for performance
**Files:**
- `src/store/selectors.ts`
**Dependencies:** Task 2.9

---

## Phase 3: Canvas Infrastructure

**Goal:** Build the SVG-based canvas with pan, zoom, grid, and rendering layers.

### Task 3.1: Create SVGCanvas Component
**Description:** Build the main SVG container component with viewport transformation support.
**Expected Outcome:**
- SVG element with proper viewBox handling
- Viewport transformation (translate + scale)
- Event listeners for mouse/touch interactions
- Ref forwarding for parent access
**Files:**
- `src/components/Canvas/SVGCanvas.tsx`
- `src/components/Canvas/SVGCanvas.styles.ts`
**Dependencies:** Task 2.9

### Task 3.2: Implement Viewport Hook
**Description:** Create a hook for managing zoom and pan state with calculations.
**Expected Outcome:**
- `useViewport` hook with zoom (0.1-4.0 range)
- Pan offset tracking
- `screenToCanvas` coordinate transformation
- `canvasToScreen` inverse transformation
- `fitToScreen` calculation
**Files:**
- `src/hooks/useViewport.ts`
**Dependencies:** Task 3.1

### Task 3.3: Create Grid Component
**Description:** Build a background grid layer using SVG patterns.
**Expected Outcome:**
- Minor grid (10px) with light lines
- Major grid (100px) with darker lines
- Grid visibility toggle
- Infinite grid illusion via pattern
**Files:**
- `src/components/Canvas/Grid.tsx`
**Dependencies:** Task 3.1

### Task 3.4: Implement Snap-to-Grid Utility
**Description:** Create utility functions for snapping coordinates to grid positions.
**Expected Outcome:**
- `snapToGrid` function for points
- `snapBoundsToGrid` for element bounds
- Configurable grid size
- Toggle for snap behavior
**Files:**
- `src/utils/snap.ts`
**Dependencies:** Task 3.3

### Task 3.5: Create Rendering Layers
**Description:** Implement the layer system for proper z-ordering of elements.
**Expected Outcome:**
- `GridLayer` (bottom)
- `SwimlanesLayer`
- `GroupsLayer`
- `ConnectionsLayer`
- `ElementsLayer`
- `OverlaysLayer`
- `SelectionLayer`
- `DragPreviewLayer` (top)
**Files:**
- `src/components/Canvas/layers/index.ts`
- `src/components/Canvas/layers/GridLayer.tsx`
- `src/components/Canvas/layers/ElementsLayer.tsx`
- `src/components/Canvas/layers/ConnectionsLayer.tsx`
- `src/components/Canvas/layers/SelectionLayer.tsx`
- `src/components/Canvas/layers/OverlaysLayer.tsx`
**Dependencies:** Task 3.1

### Task 3.6: Create SVG Defs Component
**Description:** Define reusable SVG elements like markers, patterns, and filters.
**Expected Outcome:**
- Arrow markers for sequence flows
- Circle marker for message flows
- Dashed patterns for associations
- Selection highlight filter
- Drop shadow filter
**Files:**
- `src/components/Canvas/SVGDefs.tsx`
**Dependencies:** Task 3.1

### Task 3.7: Implement Pan Behavior
**Description:** Add mouse/touch panning functionality to the canvas.
**Expected Outcome:**
- Middle-click drag to pan
- Space + drag to pan
- Touch two-finger pan
- Smooth pan animation
- Pan boundaries (optional)
**Files:**
- `src/hooks/usePan.ts`
**Dependencies:** Task 3.2

### Task 3.8: Implement Zoom Behavior
**Description:** Add zoom functionality with mouse wheel and touch pinch.
**Expected Outcome:**
- Scroll wheel zoom centered on cursor
- Pinch-to-zoom for touch
- Zoom buttons (+/-)
- Zoom to fit selection
- Min/max zoom limits (0.1-4.0)
**Files:**
- `src/hooks/useZoom.ts`
**Dependencies:** Task 3.2

### Task 3.9: Create Selection Box Component
**Description:** Build the marquee selection box for multi-select.
**Expected Outcome:**
- Dashed rectangle during drag
- Calculate intersecting elements
- Additive selection with Shift
- Visual feedback during selection
**Files:**
- `src/components/Canvas/SelectionBox.tsx`
**Dependencies:** Task 3.5

### Task 3.10: Create Minimap Component
**Description:** Build a minimap showing the entire diagram with viewport indicator.
**Expected Outcome:**
- Scaled-down diagram preview
- Viewport rectangle indicator
- Click to navigate
- Drag viewport rectangle
- Toggle visibility
**Files:**
- `src/components/Canvas/Minimap.tsx`
- `src/components/Canvas/Minimap.styles.ts`
**Dependencies:** Task 3.1, Task 3.5

---

## Phase 4: BPMN Elements - Events

**Goal:** Implement all 13 event types with proper visuals and behaviors.

### Task 4.1: Create Base Event Component
**Description:** Build the foundational event component with circle rendering and positioning.
**Expected Outcome:**
- Circle SVG element with configurable border width
- Start (1px), Intermediate (double 1px), End (3px) borders
- Connection point hooks (4 cardinal points)
- Label positioning below element
- Selection highlight styling
**Files:**
- `src/components/Elements/Events/BaseEvent.tsx`
- `src/components/Elements/Events/EventCircle.tsx`
**Dependencies:** Task 3.5

### Task 4.2: Create Event Icon Components
**Description:** Build SVG icon components for each of the 13 event types.
**Expected Outcome:**
- 13 icon components with catching/throwing variants
- Consistent 20x20px sizing
- Filled (throwing) vs unfilled (catching) rendering
- Icons: None, Message, Timer, Error, Cancel, Compensation, Conditional, Link, Signal, Terminate, Escalation, Multiple, Parallel Multiple
**Files:**
- `src/components/Elements/Events/icons/NoneIcon.tsx`
- `src/components/Elements/Events/icons/MessageIcon.tsx`
- `src/components/Elements/Events/icons/TimerIcon.tsx`
- `src/components/Elements/Events/icons/ErrorIcon.tsx`
- `src/components/Elements/Events/icons/CancelIcon.tsx`
- `src/components/Elements/Events/icons/CompensationIcon.tsx`
- `src/components/Elements/Events/icons/ConditionalIcon.tsx`
- `src/components/Elements/Events/icons/LinkIcon.tsx`
- `src/components/Elements/Events/icons/SignalIcon.tsx`
- `src/components/Elements/Events/icons/TerminateIcon.tsx`
- `src/components/Elements/Events/icons/EscalationIcon.tsx`
- `src/components/Elements/Events/icons/MultipleIcon.tsx`
- `src/components/Elements/Events/icons/ParallelMultipleIcon.tsx`
- `src/components/Elements/Events/icons/index.ts`
**Dependencies:** Task 4.1

### Task 4.3: Implement Start Event Component
**Description:** Create the Start Event component with thin border and catching-only behavior.
**Expected Outcome:**
- 36px diameter circle
- 1px black border
- White fill
- Support for 7 trigger types: None, Message, Timer, Conditional, Signal, Multiple, Parallel Multiple
- No incoming sequence flows (validation rule)
**Files:**
- `src/components/Elements/Events/StartEvent.tsx`
**Dependencies:** Task 4.1, Task 4.2

### Task 4.4: Implement Intermediate Event Component
**Description:** Create the Intermediate Event component with double border.
**Expected Outcome:**
- 36px diameter with double border (3px gap)
- Catching and throwing variants
- Support for 10 event types
- Boundary attachment capability
- Both incoming and outgoing flows
**Files:**
- `src/components/Elements/Events/IntermediateEvent.tsx`
**Dependencies:** Task 4.1, Task 4.2

### Task 4.5: Implement End Event Component
**Description:** Create the End Event component with thick border and throwing-only behavior.
**Expected Outcome:**
- 36px diameter circle
- 3px black border
- White fill
- Support for 9 result types: None, Message, Error, Cancel, Compensation, Signal, Terminate, Escalation, Multiple
- No outgoing sequence flows
**Files:**
- `src/components/Elements/Events/EndEvent.tsx`
**Dependencies:** Task 4.1, Task 4.2

### Task 4.6: Implement Boundary Event Component
**Description:** Create the Boundary Event component that attaches to activities.
**Expected Outcome:**
- Double border like intermediate events
- Interrupting (solid) vs non-interrupting (dashed) variants
- Positioning on activity border
- Automatic repositioning on activity move
- 8 supported event types
**Files:**
- `src/components/Elements/Events/BoundaryEvent.tsx`
**Dependencies:** Task 4.4

### Task 4.7: Create Event Factory Function
**Description:** Build a factory function that returns the correct event component based on type.
**Expected Outcome:**
- `createEventElement` factory function
- Type-safe event creation
- Default property values
- ID generation
**Files:**
- `src/components/Elements/Events/eventFactory.ts`
**Dependencies:** Tasks 4.3-4.6

### Task 4.8: Implement Event Validation Rules
**Description:** Create validation functions for event-specific rules.
**Expected Outcome:**
- Event matrix validation (which types at which positions)
- Connection rules (Start = no incoming, End = no outgoing)
- Boundary event attachment rules
- Error messages for violations
**Files:**
- `src/services/validation/eventValidation.ts`
**Dependencies:** Task 4.7

---

## Phase 5: BPMN Elements - Activities

**Goal:** Implement all 8 task types and 5 sub-process types with markers.

### Task 5.1: Create Base Activity Component
**Description:** Build the foundational activity component with rounded rectangle rendering.
**Expected Outcome:**
- 100x80px rounded rectangle (10px radius)
- 2px black border, white fill
- Icon slot (top-left, 8px offset)
- Marker slot (bottom-center)
- Label centered
- Selection and hover states
**Files:**
- `src/components/Elements/Activities/BaseActivity.tsx`
- `src/components/Elements/Activities/ActivityRect.tsx`
**Dependencies:** Task 3.5

### Task 5.2: Create Task Icon Components
**Description:** Build SVG icon components for each of the 8 task types.
**Expected Outcome:**
- 8 icon components at 16x16px
- Icons: User (person), Service (gears), Script (document), Manual (hand), Send (filled envelope), Receive (outline envelope), Business Rule (table)
- Consistent stroke and fill styles
**Files:**
- `src/components/Elements/Activities/icons/UserTaskIcon.tsx`
- `src/components/Elements/Activities/icons/ServiceTaskIcon.tsx`
- `src/components/Elements/Activities/icons/ScriptTaskIcon.tsx`
- `src/components/Elements/Activities/icons/ManualTaskIcon.tsx`
- `src/components/Elements/Activities/icons/SendTaskIcon.tsx`
- `src/components/Elements/Activities/icons/ReceiveTaskIcon.tsx`
- `src/components/Elements/Activities/icons/BusinessRuleTaskIcon.tsx`
- `src/components/Elements/Activities/icons/index.ts`
**Dependencies:** Task 5.1

### Task 5.3: Create Activity Marker Components
**Description:** Build marker icons for loop, multi-instance, and compensation.
**Expected Outcome:**
- Loop marker (curved arrow)
- Multi-instance parallel (3 vertical lines)
- Multi-instance sequential (3 horizontal lines)
- Compensation (double rewind arrows)
- Collapse marker (plus in box)
- Ad-hoc marker (tilde)
- Proper positioning at bottom-center
**Files:**
- `src/components/Elements/Activities/markers/LoopMarker.tsx`
- `src/components/Elements/Activities/markers/MultiInstanceMarker.tsx`
- `src/components/Elements/Activities/markers/CompensationMarker.tsx`
- `src/components/Elements/Activities/markers/CollapseMarker.tsx`
- `src/components/Elements/Activities/markers/AdHocMarker.tsx`
- `src/components/Elements/Activities/markers/MarkerGroup.tsx`
**Dependencies:** Task 5.1

### Task 5.4: Implement Abstract Task Component
**Description:** Create the generic task component with no icon.
**Expected Outcome:**
- Basic rounded rectangle
- Name label only
- Full marker support
- Boundary event attachment points
**Files:**
- `src/components/Elements/Activities/Task.tsx`
**Dependencies:** Task 5.1, Task 5.3

### Task 5.5: Implement Typed Task Components
**Description:** Create components for all 7 typed task variants.
**Expected Outcome:**
- UserTask, ServiceTask, ScriptTask, ManualTask
- SendTask, ReceiveTask, BusinessRuleTask
- Each with appropriate icon
- Consistent styling and behavior
**Files:**
- `src/components/Elements/Activities/UserTask.tsx`
- `src/components/Elements/Activities/ServiceTask.tsx`
- `src/components/Elements/Activities/ScriptTask.tsx`
- `src/components/Elements/Activities/ManualTask.tsx`
- `src/components/Elements/Activities/SendTask.tsx`
- `src/components/Elements/Activities/ReceiveTask.tsx`
- `src/components/Elements/Activities/BusinessRuleTask.tsx`
**Dependencies:** Task 5.2, Task 5.4

### Task 5.6: Implement Sub-Process Component
**Description:** Create the expandable sub-process container component.
**Expected Outcome:**
- Collapsed state: 100x80px with [+] marker
- Expanded state: variable size (min 200x150px)
- Nested element rendering
- Expand/collapse toggle
- Boundary event support
**Files:**
- `src/components/Elements/Activities/SubProcess.tsx`
- `src/components/Elements/Activities/SubProcessContent.tsx`
**Dependencies:** Task 5.1, Task 5.3

### Task 5.7: Implement Call Activity Component
**Description:** Create the call activity component with thick border.
**Expected Outcome:**
- 3px border (vs 2px for regular tasks)
- Reference to called element
- Collapsed view only
- Visual distinction clear
**Files:**
- `src/components/Elements/Activities/CallActivity.tsx`
**Dependencies:** Task 5.6

### Task 5.8: Implement Event Sub-Process Component
**Description:** Create the event-triggered sub-process with dashed border.
**Expected Outcome:**
- Dashed border (5px dash, 3px gap)
- Start event inside (not connected via sequence flow)
- Interrupting vs non-interrupting based on start event
- No incoming sequence flows
**Files:**
- `src/components/Elements/Activities/EventSubProcess.tsx`
**Dependencies:** Task 5.6

### Task 5.9: Implement Transaction Component
**Description:** Create the transaction sub-process with double border.
**Expected Outcome:**
- Double border (2px each, 3px gap)
- Support for Cancel and Compensation events
- Transaction semantics indication
**Files:**
- `src/components/Elements/Activities/Transaction.tsx`
**Dependencies:** Task 5.6

### Task 5.10: Implement Ad-Hoc Sub-Process Component
**Description:** Create the ad-hoc sub-process with tilde marker.
**Expected Outcome:**
- Tilde (~) marker at bottom
- No required sequence between contained tasks
- Completion condition support
**Files:**
- `src/components/Elements/Activities/AdHocSubProcess.tsx`
**Dependencies:** Task 5.6

### Task 5.11: Create Activity Factory Function
**Description:** Build a factory function for creating activities by type.
**Expected Outcome:**
- `createActivity` factory function
- Type-safe activity creation
- Default dimensions and properties
**Files:**
- `src/components/Elements/Activities/activityFactory.ts`
**Dependencies:** Tasks 5.4-5.10

### Task 5.12: Implement Activity Validation Rules
**Description:** Create validation functions for activity-specific rules.
**Expected Outcome:**
- Marker combination validation (no loop + multi-instance)
- Connection rules
- Sub-process content validation
- Compensation activity rules
**Files:**
- `src/services/validation/activityValidation.ts`
**Dependencies:** Task 5.11

---

## Phase 6: BPMN Elements - Gateways

**Goal:** Implement all 5 gateway types with proper icons and behaviors.

### Task 6.1: Create Base Gateway Component
**Description:** Build the foundational gateway component with diamond shape.
**Expected Outcome:**
- 50x50px diamond (rhombus) shape
- 2px black border, white fill
- Icon centered (24x24px area)
- 4 connection points at vertices
- Selection and hover states
**Files:**
- `src/components/Elements/Gateways/BaseGateway.tsx`
- `src/components/Elements/Gateways/GatewayDiamond.tsx`
**Dependencies:** Task 3.5

### Task 6.2: Create Gateway Icon Components
**Description:** Build SVG icon components for each gateway type.
**Expected Outcome:**
- Exclusive: X mark (3px stroke)
- Parallel: + mark (3px stroke)
- Inclusive: O circle (3px stroke)
- Event-Based: Pentagon in circle
- Complex: Asterisk/star
**Files:**
- `src/components/Elements/Gateways/icons/ExclusiveIcon.tsx`
- `src/components/Elements/Gateways/icons/ParallelIcon.tsx`
- `src/components/Elements/Gateways/icons/InclusiveIcon.tsx`
- `src/components/Elements/Gateways/icons/EventBasedIcon.tsx`
- `src/components/Elements/Gateways/icons/ComplexIcon.tsx`
- `src/components/Elements/Gateways/icons/index.ts`
**Dependencies:** Task 6.1

### Task 6.3: Implement Exclusive Gateway Component
**Description:** Create the XOR gateway for single-path decisions.
**Expected Outcome:**
- X icon centered
- Default flow marker support (slash on line)
- Condition expression display
- Split and merge behaviors
**Files:**
- `src/components/Elements/Gateways/ExclusiveGateway.tsx`
**Dependencies:** Task 6.1, Task 6.2

### Task 6.4: Implement Parallel Gateway Component
**Description:** Create the AND gateway for parallel execution.
**Expected Outcome:**
- Plus icon centered
- No conditions on outgoing flows
- Split creates all tokens
- Merge synchronizes all
**Files:**
- `src/components/Elements/Gateways/ParallelGateway.tsx`
**Dependencies:** Task 6.1, Task 6.2

### Task 6.5: Implement Inclusive Gateway Component
**Description:** Create the OR gateway for one-or-more paths.
**Expected Outcome:**
- Circle icon centered
- Conditions on outgoing flows
- Default flow support
- Merge waits for active tokens
**Files:**
- `src/components/Elements/Gateways/InclusiveGateway.tsx`
**Dependencies:** Task 6.1, Task 6.2

### Task 6.6: Implement Event-Based Gateway Component
**Description:** Create the event-based gateway for event-driven routing.
**Expected Outcome:**
- Pentagon-in-circle icon
- Only connects to intermediate catch events
- First event wins behavior
- No merge capability
**Files:**
- `src/components/Elements/Gateways/EventBasedGateway.tsx`
**Dependencies:** Task 6.1, Task 6.2

### Task 6.7: Implement Complex Gateway Component
**Description:** Create the complex gateway for custom logic.
**Expected Outcome:**
- Asterisk icon centered
- Activation condition support
- Custom merge/split logic
**Files:**
- `src/components/Elements/Gateways/ComplexGateway.tsx`
**Dependencies:** Task 6.1, Task 6.2

### Task 6.8: Create Gateway Factory Function
**Description:** Build a factory function for creating gateways by type.
**Expected Outcome:**
- `createGateway` factory function
- Type-safe gateway creation
- Default properties
**Files:**
- `src/components/Elements/Gateways/gatewayFactory.ts`
**Dependencies:** Tasks 6.3-6.7

### Task 6.9: Implement Gateway Validation Rules
**Description:** Create validation functions for gateway-specific rules.
**Expected Outcome:**
- Connection count validation
- Condition requirements (exclusive/inclusive splits)
- Event-based gateway target validation
- Default flow validation
**Files:**
- `src/services/validation/gatewayValidation.ts`
**Dependencies:** Task 6.8

---

## Phase 7: Connecting Objects

**Goal:** Implement all 4 connector types with routing and markers.

### Task 7.1: Create Base Connector Component
**Description:** Build the foundational connector component with path rendering.
**Expected Outcome:**
- SVG path element from waypoints
- Invisible hit area for selection (20px)
- Label positioning on path
- Selection highlight styling
- Waypoint handles
**Files:**
- `src/components/Connections/BaseConnector.tsx`
- `src/components/Connections/ConnectorPath.tsx`
**Dependencies:** Task 3.5

### Task 7.2: Implement Path Generation Utilities
**Description:** Create utility functions for generating SVG paths from waypoints.
**Expected Outcome:**
- `generateLinearPath` for straight segments
- `generateOrthogonalPath` for right-angle routing
- `generateCurvedPath` for bezier curves
- Path optimization (remove redundant points)
**Files:**
- `src/utils/pathGeneration.ts`
**Dependencies:** Task 7.1

### Task 7.3: Implement Sequence Flow Component
**Description:** Create the sequence flow connector with solid line and arrow.
**Expected Outcome:**
- Solid 2px line
- Filled triangle arrow at target
- Conditional marker (diamond at source)
- Default flow marker (slash at source)
- Label on path
**Files:**
- `src/components/Connections/SequenceFlow.tsx`
**Dependencies:** Task 7.1, Task 7.2

### Task 7.4: Implement Message Flow Component
**Description:** Create the message flow connector with dashed line and markers.
**Expected Outcome:**
- Dashed line (10px dash, 5px gap)
- Empty circle at source
- Filled arrow at target
- Message envelope icon (optional)
- Cross-pool only validation
**Files:**
- `src/components/Connections/MessageFlow.tsx`
**Dependencies:** Task 7.1, Task 7.2

### Task 7.5: Implement Association Component
**Description:** Create the association connector with dotted line.
**Expected Outcome:**
- Dotted line (4px dot, 4px gap)
- Direction variants: None, One, Both
- Arrow heads based on direction
- Links artifacts to elements
**Files:**
- `src/components/Connections/Association.tsx`
**Dependencies:** Task 7.1, Task 7.2

### Task 7.6: Implement Data Association Component
**Description:** Create the data association connector for data flow.
**Expected Outcome:**
- Dotted line with arrow
- Input association (data to activity)
- Output association (activity to data)
- Transformation indicator
**Files:**
- `src/components/Connections/DataAssociation.tsx`
**Dependencies:** Task 7.1, Task 7.2

### Task 7.7: Create Connection Points Component
**Description:** Build the visual connection points on elements for drawing connections.
**Expected Outcome:**
- 4 cardinal points (top, right, bottom, left)
- Visible on hover/selection
- Snap-to behavior
- Visual highlight on valid drop
**Files:**
- `src/components/shared/ConnectionPoints.tsx`
**Dependencies:** Task 7.1

### Task 7.8: Implement Auto-Routing Algorithm
**Description:** Create an algorithm for automatically routing connections around obstacles.
**Expected Outcome:**
- Orthogonal routing (right angles)
- Obstacle avoidance
- Minimum waypoints
- Path optimization
**Files:**
- `src/services/layout/autoRouter.ts`
**Dependencies:** Task 7.2

### Task 7.9: Implement Waypoint Dragging
**Description:** Create the ability to manually adjust connection waypoints.
**Expected Outcome:**
- Drag existing waypoints
- Add waypoints on path click
- Remove waypoints (double-click)
- Snap waypoints to grid
**Files:**
- `src/components/Connections/WaypointHandles.tsx`
- `src/hooks/useWaypointDrag.ts`
**Dependencies:** Task 7.1

### Task 7.10: Implement Connection Validation Rules
**Description:** Create validation functions for connection rules.
**Expected Outcome:**
- Sequence flow same-pool validation
- Message flow different-pool validation
- Valid source/target combinations
- Self-loop prevention (configurable)
**Files:**
- `src/services/validation/connectionValidation.ts`
**Dependencies:** Tasks 7.3-7.6

---

## Phase 8: Swimlanes - Pools & Lanes

**Goal:** Implement pools and lanes with proper containment and resizing.

### Task 8.1: Create Pool Component
**Description:** Build the pool container component representing participants.
**Expected Outcome:**
- Rectangle with header on left
- Header with rotated text (90deg)
- Minimum dimensions (600x150px)
- Expand/collapse to black box (50px height)
- Contains lanes and elements
**Files:**
- `src/components/Elements/Swimlanes/Pool.tsx`
- `src/components/Elements/Swimlanes/PoolHeader.tsx`
**Dependencies:** Task 3.5

### Task 8.2: Create Lane Component
**Description:** Build the lane component for subdividing pools.
**Expected Outcome:**
- Full-width band within pool
- Header with rotated text
- Minimum height (100px)
- Nested lane support
- Element containment tracking
**Files:**
- `src/components/Elements/Swimlanes/Lane.tsx`
- `src/components/Elements/Swimlanes/LaneHeader.tsx`
**Dependencies:** Task 8.1

### Task 8.3: Implement Lane Set Management
**Description:** Create logic for managing multiple lanes within a pool.
**Expected Outcome:**
- Add lane (split or append)
- Remove lane (redistribute space)
- Reorder lanes (drag)
- Nested lane sets
**Files:**
- `src/components/Elements/Swimlanes/LaneSet.tsx`
- `src/store/actions/laneActions.ts`
**Dependencies:** Task 8.2

### Task 8.4: Implement Pool Resize Behavior
**Description:** Create resize handles and logic for pools.
**Expected Outcome:**
- Resize from all edges
- Minimum size enforcement
- Lane proportional resize
- Content containment check
**Files:**
- `src/components/Elements/Swimlanes/PoolResizeHandles.tsx`
- `src/hooks/usePoolResize.ts`
**Dependencies:** Task 8.1

### Task 8.5: Implement Lane Resize Behavior
**Description:** Create resize handles for adjusting lane boundaries.
**Expected Outcome:**
- Drag lane dividers
- Adjacent lane inverse resize
- Minimum height enforcement
- Content repositioning
**Files:**
- `src/components/Elements/Swimlanes/LaneDivider.tsx`
- `src/hooks/useLaneResize.ts`
**Dependencies:** Task 8.2

### Task 8.6: Implement Element-Lane Association
**Description:** Create logic for tracking which elements belong to which lane.
**Expected Outcome:**
- `findContainingLane` function
- Update lane reference on element move
- Cross-lane move handling
- Lane flowNodeRef management
**Files:**
- `src/services/layout/laneContainment.ts`
**Dependencies:** Task 8.2

### Task 8.7: Implement Collaboration Component
**Description:** Create the collaboration container for multi-pool diagrams.
**Expected Outcome:**
- Multiple pool support
- Pool spacing/arrangement
- Message flow layer between pools
- Collaboration-level selection
**Files:**
- `src/components/Elements/Swimlanes/Collaboration.tsx`
**Dependencies:** Task 8.1

### Task 8.8: Implement Swimlane Validation Rules
**Description:** Create validation functions for swimlane rules.
**Expected Outcome:**
- Pool unique ID validation
- Lane coverage validation (no gaps)
- Element assignment validation
- Cross-pool sequence flow prevention
**Files:**
- `src/services/validation/swimlaneValidation.ts`
**Dependencies:** Tasks 8.1-8.7

---

## Phase 9: Artifacts & Data Elements

**Goal:** Implement data objects, data stores, groups, and annotations.

### Task 9.1: Create Data Object Component
**Description:** Build the data object component with document icon shape.
**Expected Outcome:**
- Document shape (36x50px)
- Folded corner (10x10px)
- Collection marker (3 vertical lines)
- State label [state name]
- Input/Output variants
**Files:**
- `src/components/Elements/Artifacts/DataObject.tsx`
- `src/components/Elements/Artifacts/DataObjectIcon.tsx`
**Dependencies:** Task 3.5

### Task 9.2: Create Data Store Component
**Description:** Build the data store component with cylinder shape.
**Expected Outcome:**
- Cylinder shape (50x50px)
- Top ellipse visible
- Label centered
- Capacity indicator (optional)
**Files:**
- `src/components/Elements/Artifacts/DataStore.tsx`
**Dependencies:** Task 3.5

### Task 9.3: Create Group Component
**Description:** Build the group component for visual organization.
**Expected Outcome:**
- Dashed rounded rectangle
- Transparent fill
- Label at top
- Resizable
- Non-containing (visual only)
**Files:**
- `src/components/Elements/Artifacts/Group.tsx`
**Dependencies:** Task 3.5

### Task 9.4: Create Text Annotation Component
**Description:** Build the text annotation component with open bracket.
**Expected Outcome:**
- Open bracket shape (left side only)
- Multi-line text support
- Auto-resize based on content
- Editable text
**Files:**
- `src/components/Elements/Artifacts/TextAnnotation.tsx`
**Dependencies:** Task 3.5

### Task 9.5: Implement Data Object Reference
**Description:** Create the visual reference to data objects with state.
**Expected Outcome:**
- References underlying DataObject
- Shows current state
- Multiple references to same object
- Position independent
**Files:**
- `src/components/Elements/Artifacts/DataObjectReference.tsx`
**Dependencies:** Task 9.1

### Task 9.6: Implement Data Store Reference
**Description:** Create the visual reference to data stores.
**Expected Outcome:**
- References global DataStore
- Process-local visual
- Multiple references supported
**Files:**
- `src/components/Elements/Artifacts/DataStoreReference.tsx`
**Dependencies:** Task 9.2

### Task 9.7: Create Item Definition Management
**Description:** Implement the type system for data elements.
**Expected Outcome:**
- ItemDefinition interface
- Type registry
- Collection support
- Structure reference
**Files:**
- `src/services/data/itemDefinitions.ts`
**Dependencies:** Task 2.7

### Task 9.8: Implement Data Association Drawing
**Description:** Create the UI for drawing data associations.
**Expected Outcome:**
- Draw from data object to activity
- Direction indication
- Transformation marker
- Input vs output distinction
**Files:**
- `src/hooks/useDataAssociationDraw.ts`
**Dependencies:** Task 7.6

### Task 9.9: Create Artifact Factory Functions
**Description:** Build factory functions for creating artifacts.
**Expected Outcome:**
- `createDataObject`
- `createDataStore`
- `createGroup`
- `createTextAnnotation`
**Files:**
- `src/components/Elements/Artifacts/artifactFactory.ts`
**Dependencies:** Tasks 9.1-9.6

### Task 9.10: Implement Artifact Validation Rules
**Description:** Create validation functions for artifact rules.
**Expected Outcome:**
- Data object reference validation
- Association direction rules
- Group boundary validation
**Files:**
- `src/services/validation/artifactValidation.ts`
**Dependencies:** Task 9.9

---

## Phase 10: XML Import/Export

**Goal:** Implement full BPMN 2.0 XML schema compliance for interoperability.

### Task 10.1: Set Up XML Parser Configuration
**Description:** Configure fast-xml-parser for BPMN XML parsing.
**Expected Outcome:**
- Parser options for attributes
- Namespace handling
- Text node preservation
- Order preservation for elements
**Files:**
- `src/services/xml/parserConfig.ts`
**Dependencies:** Task 1.3

### Task 10.2: Implement XML Element Parsers
**Description:** Create parsers for each BPMN element type.
**Expected Outcome:**
- `parseProcess` for process container
- `parseFlowNode` for events/tasks/gateways
- `parseSequenceFlow` for connections
- `parseParticipant` for pools
- Proper type mapping
**Files:**
- `src/services/xml/parsers/processParser.ts`
- `src/services/xml/parsers/flowNodeParser.ts`
- `src/services/xml/parsers/connectionParser.ts`
- `src/services/xml/parsers/participantParser.ts`
**Dependencies:** Task 10.1

### Task 10.3: Implement Diagram Interchange Parser
**Description:** Create parsers for BPMNDI elements (shapes and edges).
**Expected Outcome:**
- `parseBPMNShape` with bounds
- `parseBPMNEdge` with waypoints
- `parseBPMNLabel` with bounds
- Coordinate extraction
**Files:**
- `src/services/xml/parsers/diagramParser.ts`
**Dependencies:** Task 10.1

### Task 10.4: Create XML Import Service
**Description:** Build the complete XML import pipeline.
**Expected Outcome:**
- `importFromXml` main function
- XML validation against schema
- Error handling with messages
- Diagram state creation
**Files:**
- `src/services/xml/importer.ts`
**Dependencies:** Tasks 10.2, 10.3

### Task 10.5: Implement XML Element Serializers
**Description:** Create serializers for each BPMN element type.
**Expected Outcome:**
- `serializeProcess` with flow elements
- `serializeFlowNode` for all node types
- `serializeSequenceFlow` with conditions
- `serializeParticipant` for pools
**Files:**
- `src/services/xml/serializers/processSerializer.ts`
- `src/services/xml/serializers/flowNodeSerializer.ts`
- `src/services/xml/serializers/connectionSerializer.ts`
- `src/services/xml/serializers/participantSerializer.ts`
**Dependencies:** Task 10.1

### Task 10.6: Implement Diagram Interchange Serializer
**Description:** Create serializers for BPMNDI elements.
**Expected Outcome:**
- `serializeBPMNDiagram`
- `serializeBPMNPlane`
- `serializeBPMNShape` with bounds
- `serializeBPMNEdge` with waypoints
**Files:**
- `src/services/xml/serializers/diagramSerializer.ts`
**Dependencies:** Task 10.1

### Task 10.7: Create XML Export Service
**Description:** Build the complete XML export pipeline.
**Expected Outcome:**
- `exportToXml` main function
- Proper namespace declarations
- XML declaration and encoding
- Pretty formatting option
**Files:**
- `src/services/xml/exporter.ts`
**Dependencies:** Tasks 10.5, 10.6

### Task 10.8: Implement XML Validation Service
**Description:** Create XML validation against BPMN 2.0 schema.
**Expected Outcome:**
- Schema validation
- Required element checks
- Reference integrity
- Error collection
**Files:**
- `src/services/xml/validator.ts`
**Dependencies:** Task 10.4

### Task 10.9: Create XML Namespace Handler
**Description:** Implement proper XML namespace handling.
**Expected Outcome:**
- Standard namespace prefixes
- Custom namespace support
- Namespace resolution
- Extension element handling
**Files:**
- `src/services/xml/namespaces.ts`
**Dependencies:** Task 10.1

### Task 10.10: Implement Round-Trip Testing
**Description:** Create tests ensuring import/export consistency.
**Expected Outcome:**
- Import sample files
- Export back to XML
- Compare structural equality
- Test all element types
**Files:**
- `src/services/xml/__tests__/roundTrip.test.ts`
- `src/services/xml/__tests__/fixtures/` (sample BPMN files)
**Dependencies:** Tasks 10.4, 10.7

---

## Phase 11: User Interface Components

**Goal:** Build the toolbar, palette, and properties panel.

### Task 11.1: Create Toolbar Component
**Description:** Build the main toolbar with common actions.
**Expected Outcome:**
- Undo/Redo buttons
- Zoom controls (+/- /fit/reset)
- Import/Export buttons
- Delete button
- Alignment tools (future)
**Files:**
- `src/components/UI/Toolbar/Toolbar.tsx`
- `src/components/UI/Toolbar/Toolbar.styles.ts`
- `src/components/UI/Toolbar/ToolbarButton.tsx`
- `src/components/UI/Toolbar/ToolbarDivider.tsx`
- `src/components/UI/Toolbar/ZoomControls.tsx`
**Dependencies:** Task 2.9

### Task 11.2: Create Palette Component
**Description:** Build the element palette for drag-and-drop creation.
**Expected Outcome:**
- Collapsible groups (Events, Activities, Gateways, Data, Swimlanes, Artifacts)
- Draggable palette items
- Icons for each element type
- Tooltips with descriptions
**Files:**
- `src/components/UI/Palette/Palette.tsx`
- `src/components/UI/Palette/Palette.styles.ts`
- `src/components/UI/Palette/PaletteGroup.tsx`
- `src/components/UI/Palette/PaletteItem.tsx`
**Dependencies:** Tasks 4.7, 5.11, 6.8, 9.9

### Task 11.3: Create Properties Panel Framework
**Description:** Build the properties panel container and structure.
**Expected Outcome:**
- Panel container with tabs
- Header with element type/name
- Collapsible sections
- Empty state message
- Multi-selection state
**Files:**
- `src/components/UI/PropertiesPanel/PropertiesPanel.tsx`
- `src/components/UI/PropertiesPanel/PropertiesPanel.styles.ts`
- `src/components/UI/PropertiesPanel/PropertiesHeader.tsx`
- `src/components/UI/PropertiesPanel/PropertiesSection.tsx`
**Dependencies:** Task 2.9

### Task 11.4: Create Property Field Components
**Description:** Build reusable property input components.
**Expected Outcome:**
- Text input field
- Select dropdown
- Checkbox toggle
- Number input
- Textarea for multi-line
- Expression editor
**Files:**
- `src/components/UI/PropertiesPanel/fields/TextField.tsx`
- `src/components/UI/PropertiesPanel/fields/SelectField.tsx`
- `src/components/UI/PropertiesPanel/fields/CheckboxField.tsx`
- `src/components/UI/PropertiesPanel/fields/NumberField.tsx`
- `src/components/UI/PropertiesPanel/fields/TextareaField.tsx`
- `src/components/UI/PropertiesPanel/fields/ExpressionField.tsx`
**Dependencies:** Task 11.3

### Task 11.5: Implement Event Properties
**Description:** Create the properties form for events.
**Expected Outcome:**
- Event type selector
- Trigger configuration (message ref, timer def, etc.)
- Interrupting toggle (boundary)
- Documentation field
**Files:**
- `src/components/UI/PropertiesPanel/EventProperties.tsx`
**Dependencies:** Task 11.4

### Task 11.6: Implement Activity Properties
**Description:** Create the properties form for activities.
**Expected Outcome:**
- Task type selector
- Loop characteristics
- Multi-instance configuration
- Script/expression editor
- Called element reference
**Files:**
- `src/components/UI/PropertiesPanel/ActivityProperties.tsx`
**Dependencies:** Task 11.4

### Task 11.7: Implement Gateway Properties
**Description:** Create the properties form for gateways.
**Expected Outcome:**
- Gateway type display
- Default flow selector
- Condition expressions (on outgoing flows)
- Activation condition (complex)
**Files:**
- `src/components/UI/PropertiesPanel/GatewayProperties.tsx`
**Dependencies:** Task 11.4

### Task 11.8: Implement Connection Properties
**Description:** Create the properties form for connections.
**Expected Outcome:**
- Connection type display
- Condition expression editor
- Message reference
- Association direction
**Files:**
- `src/components/UI/PropertiesPanel/ConnectionProperties.tsx`
**Dependencies:** Task 11.4

### Task 11.9: Create Context Menu Component
**Description:** Build the right-click context menu.
**Expected Outcome:**
- Dynamic menu based on selection
- Common actions (copy, delete, edit)
- Element-specific actions
- Keyboard shortcut hints
**Files:**
- `src/components/UI/ContextMenu/ContextMenu.tsx`
- `src/components/UI/ContextMenu/ContextMenu.styles.ts`
- `src/components/UI/ContextMenu/ContextMenuItem.tsx`
**Dependencies:** Task 2.9

### Task 11.10: Create Editor Layout Component
**Description:** Build the main layout organizing all UI components.
**Expected Outcome:**
- Toolbar at top
- Palette on left (collapsible)
- Canvas in center
- Properties on right (collapsible)
- Minimap overlay
**Files:**
- `src/components/BPMNEditor/EditorLayout.tsx`
- `src/components/BPMNEditor/EditorLayout.styles.ts`
**Dependencies:** Tasks 11.1-11.9

---

## Phase 12: Interactions & User Experience

**Goal:** Implement drag-and-drop, keyboard shortcuts, and interaction behaviors.

### Task 12.1: Implement Drag-and-Drop from Palette
**Description:** Create the drag behavior for adding elements from palette.
**Expected Outcome:**
- Drag preview ghost element
- Drop target highlighting
- Snap to grid on drop
- Cancel with Escape
**Files:**
- `src/hooks/useDragFromPalette.ts`
- `src/components/Canvas/DragPreview.tsx`
**Dependencies:** Task 11.2

### Task 12.2: Implement Element Dragging
**Description:** Create the drag behavior for moving existing elements.
**Expected Outcome:**
- Single element drag
- Multi-element drag (selection)
- Snap to grid
- Connection updating
- Boundary constraints
**Files:**
- `src/hooks/useElementDrag.ts`
**Dependencies:** Task 3.5

### Task 12.3: Implement Connection Drawing
**Description:** Create the behavior for drawing new connections.
**Expected Outcome:**
- Start from connection point
- Preview line while dragging
- Snap to valid targets
- Connection type auto-detection
- Cancel with Escape
**Files:**
- `src/hooks/useConnectionDraw.ts`
- `src/components/Canvas/ConnectionPreview.tsx`
**Dependencies:** Task 7.7

### Task 12.4: Implement Element Resize
**Description:** Create resize handles and behavior for resizable elements.
**Expected Outcome:**
- 8 resize handles (corners + edges)
- Minimum size constraints
- Proportional resize (Shift)
- Content containment
**Files:**
- `src/components/shared/ResizeHandles.tsx`
- `src/hooks/useElementResize.ts`
**Dependencies:** Task 3.5

### Task 12.5: Implement Inline Name Editing
**Description:** Create double-click to edit element names.
**Expected Outcome:**
- Text input overlay on element
- Auto-select all text
- Save on Enter or blur
- Cancel on Escape
- Multi-line support
**Files:**
- `src/components/shared/InlineEditor.tsx`
- `src/hooks/useInlineEdit.ts`
**Dependencies:** Task 3.5

### Task 12.6: Implement Keyboard Shortcuts
**Description:** Create the keyboard shortcut system.
**Expected Outcome:**
- Delete/Backspace to delete
- Ctrl+C/X/V for clipboard
- Ctrl+Z/Y for undo/redo
- Ctrl+A to select all
- Arrow keys to nudge
- Escape to deselect
**Files:**
- `src/hooks/useKeyboardShortcuts.ts`
- `src/constants/shortcuts.ts`
**Dependencies:** Task 2.9

### Task 12.7: Implement Selection Behaviors
**Description:** Create selection interaction patterns.
**Expected Outcome:**
- Click to select
- Shift+click for additive
- Click canvas to deselect
- Marquee select box
- Select all in lane
**Files:**
- `src/hooks/useSelection.ts`
**Dependencies:** Task 3.9

### Task 12.8: Implement Boundary Event Attachment
**Description:** Create the behavior for attaching boundary events.
**Expected Outcome:**
- Drag boundary event to activity
- Visual attachment indicator
- Position on activity border
- Automatic repositioning
**Files:**
- `src/hooks/useBoundaryEventAttach.ts`
**Dependencies:** Task 4.6

### Task 12.9: Implement Quick Actions Menu
**Description:** Create the element quick action menu (on selection).
**Expected Outcome:**
- Popup near selected element
- Quick add connected element
- Change type options
- Delete button
**Files:**
- `src/components/UI/QuickActions/QuickActionsMenu.tsx`
**Dependencies:** Task 12.2

### Task 12.10: Implement Touch Support
**Description:** Add touch gesture support for mobile/tablet.
**Expected Outcome:**
- Tap to select
- Long-press for context menu
- Pinch to zoom
- Two-finger pan
- Drag to move
**Files:**
- `src/hooks/useTouchGestures.ts`
**Dependencies:** Tasks 12.1-12.7

---

## Phase 13: History, Clipboard & Validation

**Goal:** Implement undo/redo, copy/paste, and validation systems.

### Task 13.1: Implement History State Management
**Description:** Create the history stack for undo/redo.
**Expected Outcome:**
- History entry structure
- Maximum history limit (50)
- State snapshot creation
- Memory-efficient storage
**Files:**
- `src/store/history/historyState.ts`
**Dependencies:** Task 2.9

### Task 13.2: Implement Undo Action
**Description:** Create the undo functionality.
**Expected Outcome:**
- Pop from history stack
- Push current to future stack
- Restore previous state
- Update UI immediately
**Files:**
- `src/store/actions/historyActions.ts` (undo)
**Dependencies:** Task 13.1

### Task 13.3: Implement Redo Action
**Description:** Create the redo functionality.
**Expected Outcome:**
- Pop from future stack
- Push current to history stack
- Restore next state
- Clear future on new action
**Files:**
- `src/store/actions/historyActions.ts` (redo)
**Dependencies:** Task 13.1

### Task 13.4: Implement History Checkpoints
**Description:** Create smart history grouping for related actions.
**Expected Outcome:**
- Group multiple moves as one entry
- Transaction boundaries
- Named history entries
- Skip insignificant changes
**Files:**
- `src/store/history/historyCheckpoint.ts`
**Dependencies:** Task 13.1

### Task 13.5: Implement Clipboard Copy
**Description:** Create the copy functionality for elements.
**Expected Outcome:**
- Copy selected elements to clipboard
- Include connections between copied elements
- Preserve element properties
- Store relative positions
**Files:**
- `src/services/clipboard/clipboardService.ts` (copy)
**Dependencies:** Task 2.9

### Task 13.6: Implement Clipboard Cut
**Description:** Create the cut functionality.
**Expected Outcome:**
- Copy then delete
- History as single action
- Handle connections
**Files:**
- `src/services/clipboard/clipboardService.ts` (cut)
**Dependencies:** Task 13.5

### Task 13.7: Implement Clipboard Paste
**Description:** Create the paste functionality.
**Expected Outcome:**
- Create new elements from clipboard
- Generate new IDs
- Offset position from original
- Recreate internal connections
- Add to history
**Files:**
- `src/services/clipboard/clipboardService.ts` (paste)
**Dependencies:** Task 13.5

### Task 13.8: Implement System Clipboard Integration
**Description:** Integrate with system clipboard for cross-editor copy.
**Expected Outcome:**
- Copy as JSON to system clipboard
- Paste from system clipboard
- Handle external BPMN XML
- Fallback for restrictions
**Files:**
- `src/services/clipboard/systemClipboard.ts`
**Dependencies:** Task 13.7

### Task 13.9: Implement Validation Engine
**Description:** Create the validation system for checking diagram validity.
**Expected Outcome:**
- Validation rule registry
- Error and warning levels
- Rule execution pipeline
- Validation result structure
**Files:**
- `src/services/validation/validationEngine.ts`
- `src/services/validation/validationResult.ts`
**Dependencies:** Tasks 4.8, 5.12, 6.9, 7.10, 8.8, 9.10

### Task 13.10: Implement Validation UI
**Description:** Create UI for displaying validation results.
**Expected Outcome:**
- Validation panel/drawer
- Error/warning icons on elements
- Click to navigate to issue
- Auto-validate toggle
**Files:**
- `src/components/UI/ValidationPanel/ValidationPanel.tsx`
- `src/components/UI/ValidationPanel/ValidationItem.tsx`
**Dependencies:** Task 13.9

---

## Phase 14: Testing & Documentation

**Goal:** Comprehensive testing coverage and documentation.

### Task 14.1: Write Unit Tests for Types
**Description:** Create unit tests for type utilities and guards.
**Expected Outcome:**
- Type guard tests
- Factory function tests
- Validation type tests
- 100% coverage on types
**Files:**
- `src/types/__tests__/` (all type tests)
**Dependencies:** Phase 2

### Task 14.2: Write Unit Tests for Components
**Description:** Create unit tests for all BPMN element components.
**Expected Outcome:**
- Render tests for each element
- Selection state tests
- Interaction event tests
- Accessibility tests
**Files:**
- `src/components/Elements/__tests__/` (all element tests)
**Dependencies:** Phases 4-9

### Task 14.3: Write Unit Tests for Store
**Description:** Create unit tests for state management.
**Expected Outcome:**
- Action tests
- Selector tests
- History tests
- Full state coverage
**Files:**
- `src/store/__tests__/` (all store tests)
**Dependencies:** Phase 2

### Task 14.4: Write Integration Tests
**Description:** Create integration tests for complex workflows.
**Expected Outcome:**
- Element creation flow
- Connection drawing flow
- Import/export flow
- Undo/redo flow
**Files:**
- `src/__tests__/integration/` (integration tests)
**Dependencies:** Phases 1-13

### Task 14.5: Write E2E Tests
**Description:** Create end-to-end tests with Playwright.
**Expected Outcome:**
- Basic diagram creation
- Load sample file
- Export and verify
- Cross-browser testing
**Files:**
- `e2e/` (E2E test directory)
- `playwright.config.ts`
**Dependencies:** Phases 1-13

### Task 14.6: Create Component Storybook
**Description:** Document components with Storybook.
**Expected Outcome:**
- Story for each element type
- Interactive controls
- Documentation pages
- Visual testing
**Files:**
- `.storybook/`
- `src/components/**/*.stories.tsx`
**Dependencies:** Phases 4-11

### Task 14.7: Write API Documentation
**Description:** Create API documentation for the library.
**Expected Outcome:**
- Public API reference
- Type definitions documented
- Usage examples
- Configuration options
**Files:**
- `docs/api/` (API docs)
**Dependencies:** All phases

### Task 14.8: Create Usage Examples
**Description:** Build example applications showing usage.
**Expected Outcome:**
- Basic editor example
- Custom theme example
- Plugin integration example
- Next.js integration
**Files:**
- `examples/` (example apps)
**Dependencies:** All phases

### Task 14.9: Write Getting Started Guide
**Description:** Create beginner-friendly documentation.
**Expected Outcome:**
- Installation instructions
- Quick start guide
- Basic concepts
- Common patterns
**Files:**
- `docs/getting-started.md`
- `docs/concepts.md`
**Dependencies:** Task 14.7

### Task 14.10: Create Contributing Guide
**Description:** Document contribution process.
**Expected Outcome:**
- Development setup
- Code style guide
- PR process
- Issue templates
**Files:**
- `CONTRIBUTING.md`
- `.github/ISSUE_TEMPLATE/`
- `.github/PULL_REQUEST_TEMPLATE.md`
**Dependencies:** Task 14.9

---

## Dependency Graph Summary

```
Phase 1 (Setup)
    └──> Phase 2 (Types & State)
            └──> Phase 3 (Canvas)
                    ├──> Phase 4 (Events)
                    ├──> Phase 5 (Activities)
                    ├──> Phase 6 (Gateways)
                    ├──> Phase 7 (Connectors)
                    ├──> Phase 8 (Swimlanes)
                    └──> Phase 9 (Artifacts)
                            └──> Phase 10 (XML)
                                    └──> Phase 11 (UI)
                                            └──> Phase 12 (Interactions)
                                                    └──> Phase 13 (History/Validation)
                                                            └──> Phase 14 (Testing/Docs)
```

---

## Success Criteria

| Metric | Target |
|--------|--------|
| Type Coverage | 100% TypeScript strict mode |
| Unit Test Coverage | > 80% |
| E2E Tests | All critical paths covered |
| Performance | < 500ms initial render, 60fps interactions |
| Bundle Size | < 500KB gzipped |
| Accessibility | WCAG AA compliance |
| Browser Support | Chrome, Firefox, Safari, Edge (latest 2) |
| XML Compliance | 100% BPMN 2.0 schema valid |

---

## Risk Mitigation

| Risk | Mitigation Strategy |
|------|---------------------|
| Complex BPMN spec | Phased implementation, core elements first |
| Performance with large diagrams | Virtualization, memoization, profiling |
| XML parsing edge cases | Comprehensive test fixtures, schema validation |
| Browser inconsistencies | CI testing across browsers, polyfills |
| Scope creep | Strict MVP definition, feature backlog |

---

*React BPMN 2.0 Editor - Implementation Plan v1.0*
*Generated: January 2026*
