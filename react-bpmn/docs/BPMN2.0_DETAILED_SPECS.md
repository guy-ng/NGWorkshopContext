# BPMN 2.0 Detailed Specifications: Connecting Objects & Swimlanes

Complete reference for implementing BPMN 2.0 connecting objects and swimlanes as React components.

---

## PART 1: CONNECTING OBJECTS

### 1. SEQUENCE FLOW

**Purpose**: Defines the order and direction of execution between flow objects (activities, events, gateways) within the same pool.

#### 1.1 Normal Sequence Flow

**Definition**: Standard connector showing the logical progression of tasks.

**Visual Representation**:
- Solid line
- Arrow pointing to target element
- Line weight: 2px (standard)
- Color: #000000 (black)
- No additional markers

**XML Structure**:
```xml
<sequenceFlow id="SequenceFlow_1" sourceRef="Task_1" targetRef="Task_2" />
```

**XML Attributes**:
- `id` (required): Unique identifier (format: SequenceFlow_xxx)
- `sourceRef` (required): ID of source flow element
- `targetRef` (required): ID of target flow element
- `name` (optional): Display name/label
- `isImmediate` (optional, default=true): Whether to immediately follow
- `default` (optional): Not set on normal flows

**React Component Props**:
```typescript
interface SequenceFlowProps {
  id: string;
  sourceRef: string;
  targetRef: string;
  name?: string;
  isConditional?: boolean;
  isDefault?: boolean;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  color?: string; // default: '#000000'
  strokeWidth?: number; // default: 2
  waypoints?: Array<{x: number; y: number}>;
  label?: {
    x: number;
    y: number;
    text: string;
  };
}
```

---

#### 1.2 Conditional Sequence Flow

**Definition**: A sequence flow with an attached condition expression that determines whether the flow is selected during execution.

**Visual Representation**:
- Solid line (same as normal)
- Diamond marker (small, 8px) at the source point
- Diamond filled with white, border color matches line
- Label showing condition expression
- Arrowhead at target

**Styling Rules**:
- Line color: #000000 (black)
- Diamond: 8px × 8px
- Diamond border: 2px solid #000000
- Label background: #FFFFFF with padding 4px
- Label text color: #000000
- Label font-size: 12px

**XML Structure**:
```xml
<sequenceFlow id="SequenceFlow_conditional" sourceRef="ExclusiveGateway_1" targetRef="Task_2">
  <conditionExpression xsi:type="tFormalExpression">${amount > 1000}</conditionExpression>
</sequenceFlow>
```

**XML Attributes**:
- All normal sequence flow attributes, plus:
- Child element: `<conditionExpression>` (required for conditional flows)
  - `xsi:type="tFormalExpression"` (required)
  - Content: Boolean expression (UEL, JavaScript, Groovy, etc.)

**Condition Expression Examples**:
```xml
<!-- UEL Expression -->
<conditionExpression xsi:type="tFormalExpression">${x == 1}</conditionExpression>

<!-- Method invocation -->
<conditionExpression xsi:type="tFormalExpression">${order.isStandardOrder()}</conditionExpression>

<!-- Complex condition -->
<conditionExpression xsi:type="tFormalExpression">${order.price > 100 && order.price < 250}</conditionExpression>
```

**React Component Props**:
```typescript
interface ConditionalSequenceFlowProps extends SequenceFlowProps {
  isConditional: true;
  conditionExpression: string;
  conditionExpressionType?: 'tFormalExpression' | 'tScript';
  diamondMarkerColor?: string; // default: '#000000'
  diamondMarkerSize?: number; // default: 8
}
```

**Important Rules**:
- Conditions on default flows are ALWAYS IGNORED
- Expression must resolve to boolean, otherwise exception occurs
- Multiple conditional flows from same element create parallel execution paths
- Gateways handle conditions differently based on gateway type
- Conditional flows should have descriptive labels for clarity

---

#### 1.3 Default Sequence Flow

**Definition**: A fallback flow selected only when no other outgoing sequence flows are selected. Used as "else" path in decision gateways.

**Visual Representation**:
- Solid line
- Slash marker ("/") at the source point
- 45-degree slash, 6-8px long
- Same styling as normal sequence flow
- Arrow at target

**Styling Rules**:
- Line color: #000000
- Slash color: #000000
- Slash angle: 45 degrees
- Slash position: near source element, offset 3px

**XML Structure**:
```xml
<!-- Default sequence flow is defined by 'default' attribute on source element -->
<exclusiveGateway id="ExclusiveGateway_1" name="Check Amount" default="SequenceFlow_default">
  <!-- ... -->
</exclusiveGateway>

<!-- Then reference it -->
<sequenceFlow id="SequenceFlow_default" sourceRef="ExclusiveGateway_1" targetRef="Task_default" />
<sequenceFlow id="SequenceFlow_conditional" sourceRef="ExclusiveGateway_1" targetRef="Task_alt">
  <conditionExpression xsi:type="tFormalExpression">${amount > 5000}</conditionExpression>
</sequenceFlow>
```

**XML Attributes**:
- On source element (gateway/task): `default="SequenceFlow_id"`
- Sequence flow itself has no special attributes
- Child `<conditionExpression>` elements are IGNORED if present

**React Component Props**:
```typescript
interface DefaultSequenceFlowProps extends SequenceFlowProps {
  isDefault: true;
  slashMarkerColor?: string; // default: '#000000'
  slashMarkerSize?: number; // default: 6
}
```

**Rules**:
- Only one default flow per element
- Conditions on default flow are ignored
- Only selected if NO other outgoing flows are selected
- Essential for exclusive gateways to handle unmapped conditions

---

### 2. MESSAGE FLOW

**Purpose**: Depicts communication between separate participants/pools. Cannot connect elements within the same pool.

#### 2.1 Standard Message Flow

**Definition**: Represents a message exchange between two pools/participants.

**Visual Representation**:
- Dotted line (dash pattern: 5px dash, 3px gap)
- Arrow pointing to target
- Open circle at source point (8px diameter)
- Target element may have open circle if receiving message
- Color: #000000

**Styling Rules**:
- Line: dotted (stroke-dasharray: 5, 3)
- Line width: 2px
- Circle diameter: 8px
- Circle fill: white/transparent
- Circle border: 2px solid #000000
- Arrowhead size: standard (8px)

**XML Structure**:
```xml
<!-- Within collaboration element -->
<collaboration id="Collaboration_1">
  <participant id="Participant_1" processRef="Process_1" name="Participant A" />
  <participant id="Participant_2" name="Participant B" />
  <messageFlow id="MessageFlow_1" sourceRef="Task_1" targetRef="Event_received" />
</collaboration>
```

**XML Attributes**:
- `id` (required): Unique identifier
- `sourceRef` (required): Source element (must be in different pool)
- `targetRef` (required): Target element (must be in different pool)
- `messageRef` (optional): Reference to Message element
- `name` (optional): Message name/label

**React Component Props**:
```typescript
interface MessageFlowProps {
  id: string;
  sourceRef: string;
  targetRef: string;
  messageRef?: string;
  name?: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  waypoints?: Array<{x: number; y: number}>;
  dashArray?: string; // default: '5,3'
  circleMarkerColor?: string; // default: '#000000'
  circleMarkerSize?: number; // default: 8
  label?: {
    x: number;
    y: number;
    text: string;
  };
}
```

**Connection Rules**:
- Cannot connect elements WITHIN same pool
- Can connect:
  - Task to Task (different pools)
  - Event to Event (different pools)
  - Task to Event (different pools)
  - Flow object to Participant pool boundary
- Typically connects Send/Receive tasks or Message events

---

#### 2.2 Message Definition (Referenced in Message Flow)

**XML Structure**:
```xml
<message id="Message_1" name="Order Confirmation" />

<!-- In message flow, reference it -->
<messageFlow id="MessageFlow_1"
             sourceRef="Task_sendOrder"
             targetRef="Task_receiveOrder"
             messageRef="Message_1"
             name="Send Order" />
```

**Best Practices**:
- Name message flows descriptively (e.g., "Send Order Confirmation")
- Use message definitions to track specific message types
- Show both send and receive events in different pools
- Document message content in message definitions

---

### 3. ASSOCIATION

**Purpose**: Connects artifacts (data objects, annotations, groups) to flow objects without affecting sequence flow.

#### 3.1 Normal Association

**Definition**: Links documentation artifacts to activities/events/gateways.

**Visual Representation**:
- Dotted line (lighter than message flow)
- No arrowhead (unless directional)
- Thin line (1.5px)
- Color: #999999 (gray)
- No markers at endpoints

**Styling Rules**:
- Line: dotted (stroke-dasharray: 3, 2 or similar, lighter pattern)
- Line width: 1.5px
- Color: #999999 (medium gray)
- No arrowheads
- No circles or markers

**XML Structure**:
```xml
<association id="Association_1" sourceRef="Task_1" targetRef="TextAnnotation_1" />
```

**XML Attributes**:
- `id` (required): Unique identifier
- `sourceRef` (required): Source (flow object or artifact)
- `targetRef` (required): Target (usually artifact)
- `associationDirection` (optional): 'None' (default), 'One', 'Both'
- `name` (optional): Label for the association

**React Component Props**:
```typescript
interface AssociationProps {
  id: string;
  sourceRef: string;
  targetRef: string;
  associationDirection?: 'None' | 'One' | 'Both';
  name?: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  waypoints?: Array<{x: number; y: number}>;
  color?: string; // default: '#999999'
  strokeWidth?: number; // default: 1.5
  dashArray?: string; // default: '3,2'
}
```

---

#### 3.2 Directional Association

**Definition**: Shows flow direction with arrowhead, indicating data/information direction.

**Visual Representation**:
- Dotted line (same pattern as normal association)
- Arrow at target end (pointing toward target)
- Marker indicating direction of information
- Gray color with darker arrowhead

**XML Structure**:
```xml
<association id="Association_data"
             sourceRef="DataObject_input"
             targetRef="Task_process"
             associationDirection="One" />
```

**XML Attributes** (same as normal, with):
- `associationDirection="One"` (source to target direction)

**React Component Props**:
```typescript
interface DirectionalAssociationProps extends AssociationProps {
  associationDirection: 'One' | 'Both';
  arrowMarkerColor?: string; // default: darker gray
  arrowMarkerSize?: number; // default: 6
}
```

---

#### 3.3 Bi-Directional Association

**Definition**: Indicates two-way relationships between elements.

**Visual Representation**:
- Dotted line
- Arrows at BOTH ends
- Shows mutual information exchange
- Gray color

**XML Structure**:
```xml
<association id="Association_bidirectional"
             sourceRef="DataObject_1"
             targetRef="Task_1"
             associationDirection="Both" />
```

**XML Attributes**:
- `associationDirection="Both"`

---

### 4. DATA ASSOCIATION

**Purpose**: Shows the flow of information/data between data objects, data stores, data inputs/outputs, and activities.

#### 4.1 Data Input Association

**Definition**: Indicates data flowing INTO a task/activity from a source (data object, data store, etc.).

**Visual Representation**:
- Dotted line (fine dotted pattern)
- Arrow pointing TO the target element
- Source: Data object, Data store, or output of previous task
- Target: Activity/Task, Data Input
- Color: #555555 (darker gray than associations)
- Line width: 1.5px

**Styling Rules**:
- Line: dotted (fine pattern, stroke-dasharray: 2, 2)
- Color: #555555
- Arrow: solid arrowhead at target
- Arrow size: 6px
- Label positioning: along line or above/below

**XML Structure**:
```xml
<task id="Task_1" name="Process Order">
  <incoming>SequenceFlow_1</incoming>
  <outgoing>SequenceFlow_2</outgoing>
  <dataInputAssociation id="DataInputAssociation_1">
    <sourceRef>DataObject_orderData</sourceRef>
    <targetRef>DataInput_1</targetRef>
  </dataInputAssociation>
</task>
```

**XML Attributes**:
- Child elements:
  - `<sourceRef>` (0 to many): Source data object/store reference
  - `<targetRef>` (required, 1): Target data input/parameter
  - `<transformation>` (optional): FormalExpression for data transformation
  - `<assignment>` (optional): Specific field mappings

**XML Example with Transformation**:
```xml
<dataInputAssociation id="DataInputAssociation_1">
  <sourceRef>DataObject_1</sourceRef>
  <targetRef>DataInput_1</targetRef>
  <transformation>
    <formalExpression>${dataObject.field * 2}</formalExpression>
  </transformation>
</dataInputAssociation>
```

**React Component Props**:
```typescript
interface DataInputAssociationProps {
  id: string;
  sourceRef: string | string[]; // Can have multiple sources
  targetRef: string;
  transformation?: {
    type: 'tFormalExpression' | 'tScript';
    expression: string;
  };
  assignments?: Array<{
    from: string; // Source field
    to: string;   // Target field
  }>;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  waypoints?: Array<{x: number; y: number}>;
  color?: string; // default: '#555555'
  strokeWidth?: number; // default: 1.5
  arrowMarkerSize?: number; // default: 6
  label?: {
    x: number;
    y: number;
    text: string;
  };
}
```

---

#### 4.2 Data Output Association

**Definition**: Indicates data flowing OUT OF an activity to a target (data object, data store, data output).

**Visual Representation**:
- Dotted line (fine pattern)
- Arrow pointing FROM source TO target
- Source: Activity/Task, Data Output
- Target: Data object, Data store
- Same styling as Data Input Association

**XML Structure**:
```xml
<task id="Task_1" name="Generate Report">
  <dataOutputAssociation id="DataOutputAssociation_1">
    <sourceRef>DataOutput_report</sourceRef>
    <targetRef>DataObject_outputReport</targetRef>
  </dataOutputAssociation>
</task>
```

**React Component Props**:
```typescript
interface DataOutputAssociationProps {
  id: string;
  sourceRef: string;
  targetRef: string | string[]; // Can have multiple targets
  transformation?: {
    type: 'tFormalExpression' | 'tScript';
    expression: string;
  };
  // ... other props same as DataInputAssociation
}
```

---

#### 4.3 Important Rules for Data Associations

1. **Transformation Element**:
   - Optional, applies function to data during mapping
   - Contains `<formalExpression>` or script
   - Executed during task execution

2. **Multiple Sources**:
   - Data Input Association can have multiple `<sourceRef>` elements
   - Combined/merged to single target

3. **Element Ordering in XML** (CRITICAL):
   - Order MUST be: sourceRef(s) → targetRef → transformation → assignment
   - Incorrect order causes parsing failures
   - Example:
   ```xml
   <dataInputAssociation id="DataInputAssociation_1">
     <sourceRef>DataObject_1</sourceRef>
     <targetRef>DataInput_1</targetRef>
     <transformation>...</transformation>
     <assignment>...</assignment>
   </dataInputAssociation>
   ```

4. **Runtime Behavior**:
   - Data copied from source to target during execution
   - If transformation present, applied during copy
   - No impact on sequence flow

---

## PART 2: SWIMLANES (POOLS & LANES)

### 1. POOLS

**Purpose**: Represents a participant/organization in a process diagram. Top-level container for process execution.

#### 1.1 Pool - Basic Structure

**Definition**: Graphical container representing a single participant. Each pool contains exactly one process definition.

**Visual Representation**:
- Large rectangle
- Typically fills most of diagram width
- Minimum height: 100px
- Label on left side (vertical orientation in standard BPMN)
- Thick border (2-3px)
- White fill by default

**Styling Rules**:
- Border: 2px solid #000000
- Fill: #FFFFFF
- Label area: 30-50px wide
- Label text: vertical or rotated 90 degrees
- Label font-size: 12-14px
- Padding: 10px from borders

**XML Structure**:
```xml
<collaboration id="Collaboration_1">
  <participant id="Participant_1"
               processRef="Process_customer"
               name="Customer"
               isExecutable="true" />
  <participant id="Participant_2"
               name="Supplier"
               isExecutable="true" />
</collaboration>

<!-- Process definition referenced by pool -->
<process id="Process_customer"
         name="Customer Process"
         isExecutable="true">
  <laneSet id="LaneSet_1">
    <!-- lanes go here -->
  </laneSet>
  <!-- flow elements go here -->
</process>
```

**XML Attributes** (on `<participant>`):
- `id` (required): Unique identifier
- `processRef` (required): References process definition ID
- `name` (required): Display name
- `isExecutable` (optional, default=false): Whether process can be executed
- `participantMultiplicity` (optional): For multi-instance pools
  - `minimum`: Minimum instances (default=1)
  - `maximum`: Maximum instances (unbounded if not specified)

**React Component Props - Pool**:
```typescript
interface PoolProps {
  id: string;
  processRef: string;
  name: string;
  x: number;
  y: number;
  width: number; // typically full diagram width
  height: number; // minimum 100px
  isExecutable?: boolean;
  participantMultiplicity?: {
    minimum: number;
    maximum: number | null;
  };
  isCollapsed?: boolean;
  backgroundColor?: string; // default: '#FFFFFF'
  borderColor?: string; // default: '#000000'
  borderWidth?: number; // default: 2
  labelRotation?: number; // default: -90 (degrees)
  labelX?: number;
  labelY?: number;
  labelFontSize?: number;
  children?: React.ReactNode; // lanes and flow elements
}
```

---

#### 1.2 Pool - White Box (Expanded)

**Definition**: Shows internal process details with lanes and activities visible.

**Visual Representation**:
- Full rectangle with internal content visible
- Lanes appear as sub-divisions
- All flow elements visible
- Complete process logic shown

**Styling**: Same as basic pool, but WITH internal content displayed.

**React Component Behavior**:
```typescript
// isCollapsed = false shows white-box representation
<Pool
  id="Participant_1"
  isCollapsed={false}
  // ... other props
>
  {/* Lanes and flow elements render inside */}
  <Lane id="Lane_1" name="Role 1" />
  <Lane id="Lane_2" name="Role 2" />
  {/* ... tasks, events, etc. */}
</Pool>
```

---

#### 1.3 Pool - Black Box (Collapsed)

**Definition**: Hides internal process details; shows only pool boundary and interaction points (message flows).

**Visual Representation**:
- Rectangle with no internal divisions
- Only participant name visible
- Message flows entering/leaving visible
- No activities, lanes, or flow objects shown
- Indicates external or abstracted process
- Height may be smaller (80-100px)

**Styling Rules**:
- Same border as white-box pool
- Empty interior (no lanes visible)
- Only label visible
- Message flow connection points indicated

**XML Attribute** (implicit in visual representation):
```xml
<!-- No special XML marker for collapsed pool -->
<!-- Represented visually by absence of laneSet -->
<participant id="Participant_external"
             name="External Supplier"
             processRef="null" />
```

**Best Practice**:
When modeling black-box pools, omit the `laneSet` entirely or don't populate it.

**React Component Behavior**:
```typescript
<Pool
  id="Participant_external"
  isCollapsed={true}
  height={100} // smaller for collapsed
  // ... other props
>
  {/* No lanes rendered - only pool boundary and message flows */}
</Pool>
```

---

### 2. LANES

**Purpose**: Sub-partitions within a pool representing roles, departments, or organizational units. Help organize "who does what."

#### 2.1 Lane - Basic Structure

**Definition**: Horizontal/vertical subdivision of a pool for organizing activities by responsibility.

**Visual Representation**:
- Rectangle within pool
- Horizontal orientation (standard)
- Dividing line separates lanes
- Label on left side (vertical text)
- Same styling as pool but may have slightly lighter background
- Height: varies, minimum 60px per lane

**Styling Rules**:
- Border (dividing line): 1px solid #CCCCCC or #999999
- Fill: #F5F5F5 (light gray) or #FFFFFF (white)
- Thick left border for label area: 30px
- Label text: vertical, 12px font
- Label area background: may be slightly darker

**XML Structure**:
```xml
<process id="Process_1">
  <laneSet id="LaneSet_1">
    <lane id="Lane_1" name="Sales Representative">
      <flowNodeRef>Task_1</flowNodeRef>
      <flowNodeRef>Event_1</flowNodeRef>
    </lane>
    <lane id="Lane_2" name="Sales Manager">
      <flowNodeRef>Task_2</flowNodeRef>
      <flowNodeRef>Gateway_1</flowNodeRef>
    </lane>
  </laneSet>
</process>
```

**XML Attributes** (on `<lane>`):
- `id` (required): Unique identifier
- `name` (required): Role/responsibility label
- `childLaneSet` (optional): For nested lanes
- Child elements:
  - `<flowNodeRef>` (0 to many): References to tasks/events/gateways in this lane
  - `<childLaneSet>` (optional): Sub-lanes for matrix structure

**React Component Props - Lane**:
```typescript
interface LaneProps {
  id: string;
  name: string;
  flowNodeRefs: string[]; // IDs of tasks/events/gateways in lane
  x: number;
  y: number;
  width: number;
  height: number; // minimum 60px
  parentLaneSet?: string; // Reference to parent laneSet
  childLanes?: Lane[]; // Nested lanes for matrix structures
  backgroundColor?: string; // default: '#F5F5F5'
  borderColor?: string; // default: '#CCCCCC'
  borderWidth?: number; // default: 1
  labelX?: number;
  labelY?: number;
  labelFontSize?: number;
  labelColor?: string; // default: '#000000'
  children?: React.ReactNode; // Flow elements within lane
}
```

---

#### 2.2 Lane - Naming Conventions

**Best Practices**:
1. **DO**: Use specific roles or departments
   - "Sales Representative"
   - "Purchasing Analyst"
   - "Finance Manager"
   - "HR Department"

2. **DON'T**: Use individual names
   - ❌ "Joan Doe"
   - ❌ "John Smith"
   - These reduce reusability when people change roles

3. **DON'T**: Use vague department names
   - ❌ "Sales Department" (too broad)
   - ❌ "Management" (unclear)
   - Instead, specify the role within the department

---

#### 2.3 Nested Lanes (Matrix Structure)

**Definition**: Lanes can be nested within lanes, creating a matrix structure for complex organizational hierarchies.

**Visual Representation**:
- Outer lanes (parent) represent departments
- Inner lanes (child) represent roles within department
- Multiple levels of nesting possible (though rarely used)
- More complex visual hierarchy
- Lines separate each level

**Example Scenario**:
```
Sales Department (outer lane)
  ├─ Sales Manager (inner lane)
  └─ Sales Representative (inner lane)

Finance Department (outer lane)
  ├─ Finance Manager (inner lane)
  └─ Finance Analyst (inner lane)
```

**XML Structure**:
```xml
<laneSet id="LaneSet_1">
  <lane id="Lane_department_sales" name="Sales Department">
    <childLaneSet id="ChildLaneSet_sales">
      <lane id="Lane_role_manager" name="Sales Manager">
        <flowNodeRef>Task_1</flowNodeRef>
      </lane>
      <lane id="Lane_role_rep" name="Sales Representative">
        <flowNodeRef>Task_2</flowNodeRef>
      </lane>
    </childLaneSet>
  </lane>
  <lane id="Lane_department_finance" name="Finance Department">
    <childLaneSet id="ChildLaneSet_finance">
      <lane id="Lane_finance_manager" name="Finance Manager">
        <flowNodeRef>Task_3</flowNodeRef>
      </lane>
    </childLaneSet>
  </lane>
</laneSet>
```

**XML Attributes**:
- Parent lane uses `<childLaneSet>` element instead of `<flowNodeRef>`
- Child lanes contain `<flowNodeRef>` elements
- Parent lanes cannot directly reference flow nodes

**React Component Props**:
```typescript
interface NestedLaneProps extends LaneProps {
  childLanes: Lane[];
  childLaneSet?: string; // ID of child laneSet
  hasChildren: true;
  flowNodeRefs?: []; // Empty for parent lanes
}
```

---

### 3. COLLAPSED vs EXPANDED POOLS - Advanced Behavioral Rules

**Rule of Thumb**:
A diagram should contain exactly ONE expanded pool (the process in scope) and zero or more collapsed pools (external participants).

#### 3.1 Expanded Pool Characteristics
- Shows internal process structure
- Contains lanes and flow elements
- All details visible
- Sequence flows contained within (cannot cross pool boundary)
- Represents main process being modeled

#### 3.2 Collapsed Pool Characteristics
- Hides internal structure
- Shows only boundary
- Receives/sends message flows
- Represents external participant or abstracted process
- Useful for focus and clarity

**Visual Differentiation**:
```
EXPANDED POOL (Main Process)
┌─ Customer ─────────────────────────────┐
│ ┌─ Sales Rep ──────────────────────┐   │
│ │  ⭕ → [Create Order] → [Review] │   │
│ └────────────────────────────────┘    │
│ ┌─ Manager ────────────────────────┐   │
│ │  [Approve] → ✓ → [Confirm]      │   │
│ └───────────────────────────────────┘  │
└─────────────────────────────────────────┘

COLLAPSED POOL (External)
┌─ Warehouse ─┐
└─────────────┘
      ↑ (Message Flow)
      │
```

---

### 4. MULTI-INSTANCE POOLS

**Purpose**: Represents multiple instances or parallel executions of the same participant role.

#### 4.1 Multi-Instance Pool Definition

**Definition**: A single pool that represents multiple concurrent instances of the same participant (parallel or sequential).

**Visual Representation**:
- Double vertical lines on right edge (parallel)
- OR triple vertical lines stacked (sequential, less common)
- Same pool styling as standard pool
- Label unchanged
- Marker size: 3 parallel lines, each 2px, spaced 2px apart
- Marker location: 3-5px inside right border

**Styling Rules**:
- Multi-instance marker: 3 vertical lines
- Line width: 2px
- Line color: #000000 (black)
- Spacing between lines: 2px
- Marker height: ~15-20px
- Marker positioning: centered vertically, near right edge

**XML Structure**:
```xml
<participant id="Participant_multiinstance"
             processRef="Process_order_handling"
             name="Order Handler">
  <participantMultiplicity minimum="1" maximum="5" />
</participant>
```

**XML Attributes** (on `<participant>`):
- `<participantMultiplicity>` element:
  - `minimum` (optional, default=1): Minimum instances
  - `maximum` (optional): Maximum instances
    - If omitted or empty: unbounded (infinite)
    - Numeric value: specific maximum
  - Example: minimum="2" maximum="10"

**React Component Props**:
```typescript
interface MultiInstancePoolProps extends PoolProps {
  participantMultiplicity: {
    minimum: number; // default: 1
    maximum: number | null; // null = unbounded
  };
  multiInstanceMarkerCount?: number; // default: 3 (lines)
  multiInstanceMarkerType?: 'parallel' | 'sequential';
  multiInstanceMarkerColor?: string; // default: '#000000'
  multiInstanceMarkerSize?: number; // default: 2 (line width)
  multiInstanceMarkerSpacing?: number; // default: 2 (px between lines)
}
```

---

#### 4.2 Multi-Instance Behavior

**Parallel vs Sequential** (at design time):
- Multiple lines (parallel marker): Instances execute in parallel
- Single line (standard): Executes sequentially or instance per execution
- BPMN 2.0 typically shows parallel with double/triple lines

**Runtime Semantics**:
- All instances of the pool are active simultaneously
- Can interact with each other via message flows
- Each instance has its own process state
- Useful for:
  - Multiple concurrent customers in transaction
  - Parallel approval workflows (multiple managers)
  - Batch processing by multiple workers

---

## PART 3: CONNECTION RULES & CONSTRAINTS

### 3.1 Sequence Flow Rules
- ✓ Can connect within SAME pool/lane
- ✓ Can cross lane boundaries (same pool)
- ❌ Cannot cross pool boundaries
- ✓ Can connect: Task→Task, Event→Task, Gateway→Task, Task→Gateway, etc.

### 3.2 Message Flow Rules
- ✓ Must connect DIFFERENT pools
- ✓ Can connect: Task→Task, Event→Event, Task→Event
- ✓ Can reference Message definition
- ❌ Cannot connect elements within same pool
- ✓ Can connect flow object to pool boundary (black box)

### 3.3 Association Rules
- ✓ Can connect flow objects to artifacts
- ✓ Can be directional (one or both directions)
- ✓ No impact on sequence flow
- ✓ Can label with descriptive text
- ✓ Connect: Task→DataObject, Task→TextAnnotation, Gateway→DataStore

### 3.4 Data Association Rules
- ✓ Source: DataObject, DataStore, DataInput, Task output
- ✓ Target: Task, DataInput, DataOutput, DataStore
- ✓ Can transform data with FormalExpression
- ✓ Can map multiple sources to single target
- ✓ Element order in XML is CRITICAL
- ❌ No impact on sequence flow

---

## PART 4: VISUAL STYLING SUMMARY TABLE

| Element | Line Type | Color | Width | Markers | Label |
|---------|-----------|-------|-------|---------|-------|
| Sequence Flow (Normal) | Solid | #000000 | 2px | Arrow | Top/Side |
| Sequence Flow (Conditional) | Solid | #000000 | 2px | Diamond + Arrow | Top |
| Sequence Flow (Default) | Solid | #000000 | 2px | Slash + Arrow | Top |
| Message Flow | Dotted | #000000 | 2px | Circle + Arrow | Top |
| Association | Dotted | #999999 | 1.5px | None | Top |
| Data Association | Dotted | #555555 | 1.5px | Arrow | Side |
| Pool | — | #FFFFFF | 2px border | None | Vertical |
| Lane | — | #F5F5F5 | 1px border | None | Vertical |
| Pool (Multi-instance) | — | #FFFFFF | 2px border | 3 lines | Vertical |

---

## PART 5: XML NAMESPACE DECLARATIONS

```xml
<?xml version="1.0" encoding="UTF-8"?>
<definitions
  xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL"
  xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
  xmlns:dc="http://www.omg.org/spec/DD/20100524/DC"
  xmlns:di="http://www.omg.org/spec/DD/20100524/DI"
  id="Definitions_1"
  targetNamespace="http://www.example.com/bpmn"
  exporter="BPMN Modeler"
  exporterVersion="1.0.0">

  <!-- Process definitions, collaboration, shapes, and connections -->
</definitions>
```

---

## PART 6: COMPLETE EXAMPLE XML

```xml
<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL"
             xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL"
             xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
             xmlns:dc="http://www.omg.org/spec/DD/20100524/DC"
             xmlns:di="http://www.omg.org/spec/DD/20100524/DI"
             xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
             id="Definitions_1"
             targetNamespace="http://example.com/bpmn">

  <!-- Message definitions -->
  <message id="Message_order" name="Order Confirmation" />

  <!-- Collaboration with pools -->
  <collaboration id="Collaboration_1">
    <participant id="Participant_customer" processRef="Process_customer" name="Customer" />
    <participant id="Participant_supplier" name="Supplier" />
    <messageFlow id="MessageFlow_orderToSupplier"
                 sourceRef="Task_sendOrder"
                 targetRef="Event_receiveOrder"
                 messageRef="Message_order"
                 name="Send Order" />
    <messageFlow id="MessageFlow_confirmFromSupplier"
                 sourceRef="Task_sendConfirm"
                 targetRef="Event_receiveConfirm"
                 name="Send Confirmation" />
  </collaboration>

  <!-- Main process with lanes -->
  <process id="Process_customer" name="Customer Order Process" isExecutable="true">
    <laneSet id="LaneSet_1">
      <lane id="Lane_customer" name="Customer">
        <flowNodeRef>Event_start</flowNodeRef>
        <flowNodeRef>Task_placeOrder</flowNodeRef>
        <flowNodeRef>Event_end</flowNodeRef>
      </lane>
      <lane id="Lane_sales" name="Sales Representative">
        <flowNodeRef>Task_sendOrder</flowNodeRef>
        <flowNodeRef>Task_reviewConfirm</flowNodeRef>
      </lane>
    </laneSet>

    <!-- Start Event -->
    <startEvent id="Event_start" name="Order Needed" />

    <!-- Tasks -->
    <task id="Task_placeOrder" name="Place Order">
      <incoming>SequenceFlow_0</incoming>
      <outgoing>SequenceFlow_1</outgoing>
      <dataOutputAssociation id="DataOutputAssociation_1">
        <sourceRef>DataOutput_orderData</sourceRef>
        <targetRef>DataObject_order</targetRef>
      </dataOutputAssociation>
    </task>

    <task id="Task_sendOrder" name="Send Order to Supplier">
      <incoming>SequenceFlow_1</incoming>
      <outgoing>SequenceFlow_2</outgoing>
      <dataInputAssociation id="DataInputAssociation_1">
        <sourceRef>DataObject_order</sourceRef>
        <targetRef>DataInput_order</targetRef>
      </dataInputAssociation>
    </task>

    <task id="Task_reviewConfirm" name="Review Confirmation">
      <incoming>SequenceFlow_2</incoming>
      <outgoing>SequenceFlow_3</outgoing>
    </task>

    <!-- End Event -->
    <endEvent id="Event_end" name="Order Confirmed">
      <incoming>SequenceFlow_3</incoming>
    </endEvent>

    <!-- Sequence Flows -->
    <sequenceFlow id="SequenceFlow_0" sourceRef="Event_start" targetRef="Task_placeOrder" />
    <sequenceFlow id="SequenceFlow_1" sourceRef="Task_placeOrder" targetRef="Task_sendOrder" />
    <sequenceFlow id="SequenceFlow_2" sourceRef="Task_sendOrder" targetRef="Task_reviewConfirm" />
    <sequenceFlow id="SequenceFlow_3" sourceRef="Task_reviewConfirm" targetRef="Event_end" />

    <!-- Data Objects -->
    <dataObject id="DataObject_order" name="Order Data" isCollection="false" />

    <!-- Associations to artifacts -->
    <association id="Association_1" sourceRef="Task_placeOrder" targetRef="TextAnnotation_1" />
    <textAnnotation id="TextAnnotation_1" text="Customer initiates order" />
  </process>

  <!-- Supplier process (black box) -->
  <process id="Process_supplier" name="Supplier Order Processing" isExecutable="true">
    <startEvent id="Event_receiveOrder" name="Order Received" />
    <task id="Task_processOrder" name="Process Order" />
    <task id="Task_sendConfirm" name="Send Confirmation" />
    <endEvent id="Event_orderSent" name="Order Sent" />

    <sequenceFlow id="SequenceFlow_supplier_1" sourceRef="Event_receiveOrder" targetRef="Task_processOrder" />
    <sequenceFlow id="SequenceFlow_supplier_2" sourceRef="Task_processOrder" targetRef="Task_sendConfirm" />
    <sequenceFlow id="SequenceFlow_supplier_3" sourceRef="Task_sendConfirm" targetRef="Event_orderSent" />
  </process>

  <!-- Diagram metadata (BPMNDI) -->
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Collaboration_1">
      <!-- Pool shapes and connector shapes would go here -->
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>

</definitions>
```

---

## PART 7: REACT COMPONENT IMPLEMENTATION GUIDANCE

### Key Implementation Considerations

1. **Coordinate System**:
   - Use SVG for drawing flows and markers
   - Maintain separate x,y coordinates for start and end points
   - Support waypoints for custom routing

2. **Marker Rendering**:
   - Use SVG `<marker>` or `<path>` elements for arrows, diamonds, circles
   - Scale markers based on line width
   - Reusable marker definitions for multiple flows

3. **Labels**:
   - Render as separate SVG `<text>` elements
   - Position above or beside flows
   - Add background rectangles for readability
   - Update position dynamically based on flow angle

4. **State Management**:
   - Track selected flows for highlighting
   - Support drag-to-connect for new flows
   - Validate connection rules before allowing
   - Store flow type (normal, conditional, default, message, association)

5. **XML Serialization**:
   - Map React component state to BPMN XML
   - Ensure element ordering matches BPMN spec
   - Validate IDs are unique and references are valid

6. **Performance**:
   - Use React.memo for static flow components
   - Debounce waypoint updates
   - Virtualize large swimlane content
   - Cache SVG path calculations

---

## Sources Referenced

This specification is compiled from:
- [BPMN 2.0 Symbols - Camunda](https://camunda.com/bpmn/reference/)
- [ProcessMind - Connecting Objects](https://processmind.com/resources/docs/bpmn-building-blocks/connecting-objects)
- [Camunda - Conditional and Default Sequence Flows](https://docs.camunda.org/manual/latest/reference/bpmn20/gateways/sequence-flow/)
- [Signavio - BPMN Pools and Lanes](https://www.signavio.com/post/bpmn-pools-and-lanes/)
- [Visual Paradigm - Data Objects in BPMN](https://www.visual-paradigm.com/guide/bpmn/how-to-use-data-objects-in-bpmn/)
- [OMG BPMN 2.0 Specification](http://www.omg.org/spec/BPMN/2.0/)
- [BPMN 2.0 Constructs - Flowable](https://www.flowable.com/open-source/docs/bpmn/ch07b-BPMN-Constructs/)

---

**Document Version**: 1.0
**Last Updated**: January 2026
**For**: React BPMN 2.0 Component Implementation
