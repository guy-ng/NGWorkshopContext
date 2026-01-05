# BPMN 2.0 Activities Specification
## React BPMN Editor Component

---

## 1. Overview

Activities represent work performed within a business process. They are the primary action elements and are depicted as rounded rectangles.

### 1.1 Activity Categories

| Category | Description | Visual |
|----------|-------------|--------|
| **Tasks** | Atomic activities (cannot be decomposed) | Rounded rectangle |
| **Sub-Processes** | Compound activities containing other elements | Rounded rectangle with + marker |
| **Call Activities** | Reusable activities referencing global elements | Thick border rounded rectangle |

---

## 2. Tasks (8 Types)

### 2.1 Abstract Task (Generic)

**Description:** Generic task with no specific implementation type.

**Visual:**
- Rounded rectangle: 100x80px
- Corner radius: 10px
- No icon

**XML Example:**
```xml
<bpmn:task id="Task_1" name="Process Order">
  <bpmn:incoming>Flow_1</bpmn:incoming>
  <bpmn:outgoing>Flow_2</bpmn:outgoing>
</bpmn:task>
```

### 2.2 User Task

**Description:** Task performed by a human with software assistance.

**Icon:** Person silhouette (upper body)
- Position: Top-left corner (8px offset)
- Size: 16x16px

**XML Example:**
```xml
<bpmn:userTask id="UserTask_1" name="Review Application">
  <bpmn:incoming>Flow_1</bpmn:incoming>
  <bpmn:outgoing>Flow_2</bpmn:outgoing>
</bpmn:userTask>
```

### 2.3 Service Task

**Description:** Automated task executed by a service or application.

**Icon:** Gear/cog wheels
- Position: Top-left corner (8px offset)
- Size: 16x16px
- Two interlocking gears

**XML Example:**
```xml
<bpmn:serviceTask id="ServiceTask_1" name="Send Email">
  <bpmn:incoming>Flow_1</bpmn:incoming>
  <bpmn:outgoing>Flow_2</bpmn:outgoing>
</bpmn:serviceTask>
```

### 2.4 Script Task

**Description:** Task executed by a script engine.

**Icon:** Document with lines (script)
- Position: Top-left corner (8px offset)
- Size: 16x16px

**XML Example:**
```xml
<bpmn:scriptTask id="ScriptTask_1" name="Calculate Total" scriptFormat="javascript">
  <bpmn:script>
    var total = price * quantity;
    execution.setVariable("total", total);
  </bpmn:script>
</bpmn:scriptTask>
```

### 2.5 Manual Task

**Description:** Task performed without any automation assistance.

**Icon:** Hand
- Position: Top-left corner (8px offset)
- Size: 16x16px

**XML Example:**
```xml
<bpmn:manualTask id="ManualTask_1" name="Physical Inspection">
  <bpmn:incoming>Flow_1</bpmn:incoming>
  <bpmn:outgoing>Flow_2</bpmn:outgoing>
</bpmn:manualTask>
```

### 2.6 Send Task

**Description:** Task that sends a message to an external participant.

**Icon:** Filled envelope (black)
- Position: Top-left corner (8px offset)
- Size: 16x16px

**XML Example:**
```xml
<bpmn:sendTask id="SendTask_1" name="Send Confirmation" messageRef="Message_Confirmation">
  <bpmn:incoming>Flow_1</bpmn:incoming>
  <bpmn:outgoing>Flow_2</bpmn:outgoing>
</bpmn:sendTask>
```

### 2.7 Receive Task

**Description:** Task that waits for a message from an external participant.

**Icon:** Unfilled envelope (outline)
- Position: Top-left corner (8px offset)
- Size: 16x16px

**XML Example:**
```xml
<bpmn:receiveTask id="ReceiveTask_1" name="Receive Payment" messageRef="Message_Payment">
  <bpmn:incoming>Flow_1</bpmn:incoming>
  <bpmn:outgoing>Flow_2</bpmn:outgoing>
</bpmn:receiveTask>
```

### 2.8 Business Rule Task

**Description:** Task that evaluates business rules (DMN integration).

**Icon:** Table/grid
- Position: Top-left corner (8px offset)
- Size: 16x16px

**XML Example:**
```xml
<bpmn:businessRuleTask id="BusinessRuleTask_1" name="Determine Discount"
    camunda:decisionRef="discount-decision">
  <bpmn:incoming>Flow_1</bpmn:incoming>
  <bpmn:outgoing>Flow_2</bpmn:outgoing>
</bpmn:businessRuleTask>
```

---

## 3. Task Icons Reference

| Task Type | Icon Shape | SVG Path Reference |
|-----------|------------|-------------------|
| User Task | Person bust | `M12,4A4,4,0,1,1,8,8...` |
| Service Task | Gears | `M19.43,12.98c...` |
| Script Task | Document | `M14,2H6A2,2,0,0,0,4,4V20...` |
| Manual Task | Hand | `M2,15c2,0,3-1,5-1s3,1,5,1...` |
| Send Task | Envelope (filled) | `M20,4H4L12,10L20,4Z...` |
| Receive Task | Envelope (outline) | `M4,4H20V18H4Z M4,4L12,10L20,4` |
| Business Rule | Table grid | `M3,3H21V21H3V3Z M3,9H21...` |

---

## 4. Sub-Processes (5 Types)

### 4.1 Embedded Sub-Process

**Description:** Self-contained process within the parent process.

**Visual:**
- Rounded rectangle (expandable)
- [+] collapse marker at bottom center
- Contains nested flow elements

**States:**
- Collapsed: Shows [+] marker, 100x80px
- Expanded: Shows contents, variable size (min 200x150px)

**XML Example:**
```xml
<bpmn:subProcess id="SubProcess_1" name="Handle Order">
  <bpmn:startEvent id="SubStart_1" />
  <bpmn:task id="SubTask_1" name="Validate Order" />
  <bpmn:endEvent id="SubEnd_1" />
  <bpmn:sequenceFlow id="SubFlow_1" sourceRef="SubStart_1" targetRef="SubTask_1" />
  <bpmn:sequenceFlow id="SubFlow_2" sourceRef="SubTask_1" targetRef="SubEnd_1" />
</bpmn:subProcess>
```

### 4.2 Call Activity

**Description:** Invokes a globally-defined process or task.

**Visual:**
- Thick border (3px instead of 2px)
- Same shape as sub-process

**XML Example:**
```xml
<bpmn:callActivity id="CallActivity_1" name="Process Payment"
    calledElement="PaymentProcess">
  <bpmn:incoming>Flow_1</bpmn:incoming>
  <bpmn:outgoing>Flow_2</bpmn:outgoing>
</bpmn:callActivity>
```

### 4.3 Event Sub-Process

**Description:** Sub-process triggered by an event, not sequence flow.

**Visual:**
- Dashed border (5px dash, 3px gap)
- Start event attached inside (determines trigger)
- No incoming sequence flows

**XML Example:**
```xml
<bpmn:subProcess id="EventSubProcess_1" triggeredByEvent="true">
  <bpmn:startEvent id="EventStart_1" isInterrupting="true">
    <bpmn:errorEventDefinition id="ErrorEventDef_1" />
  </bpmn:startEvent>
  <bpmn:task id="HandleError_1" name="Handle Error" />
  <bpmn:endEvent id="EventEnd_1" />
</bpmn:subProcess>
```

### 4.4 Transaction Sub-Process

**Description:** Sub-process with ACID-like transaction semantics.

**Visual:**
- Double border (2px gap between borders)
- Supports Cancel and Compensation events

**XML Example:**
```xml
<bpmn:transaction id="Transaction_1" name="Order Transaction">
  <bpmn:startEvent id="TxStart_1" />
  <bpmn:task id="TxTask_1" name="Reserve Stock" />
  <bpmn:task id="TxTask_2" name="Charge Payment" />
  <bpmn:endEvent id="TxEnd_1" />
</bpmn:transaction>
```

### 4.5 Ad-Hoc Sub-Process

**Description:** Container for activities that can execute in any order.

**Visual:**
- Tilde (~) marker at bottom center
- Activities inside have no required sequence

**XML Example:**
```xml
<bpmn:adHocSubProcess id="AdHoc_1" name="Preparation Tasks" ordering="Parallel">
  <bpmn:task id="AdHocTask_1" name="Gather Documents" />
  <bpmn:task id="AdHocTask_2" name="Schedule Meeting" />
  <bpmn:task id="AdHocTask_3" name="Prepare Presentation" />
  <bpmn:completionCondition xsi:type="bpmn:tFormalExpression">
    ${allTasksCompleted}
  </bpmn:completionCondition>
</bpmn:adHocSubProcess>
```

---

## 5. Activity Markers

Markers are small icons displayed at the bottom center of activities indicating execution behavior.

### 5.1 Marker Types

| Marker | Symbol | Description |
|--------|--------|-------------|
| Loop | ↻ (curved arrow) | Activity repeats until condition |
| Multi-Instance Parallel | ≡ (3 vertical lines) | Multiple instances run simultaneously |
| Multi-Instance Sequential | ☰ (3 horizontal lines) | Multiple instances run in sequence |
| Compensation | ◄◄ (double rewind) | Activity can be compensated |
| Collapse | [+] (plus in box) | Sub-process is collapsed |
| Ad-Hoc | ~ (tilde) | Ad-hoc sub-process marker |

### 5.2 Marker Positioning

```
┌─────────────────────────────────┐
│ [icon]                          │
│                                 │
│         Activity Name           │
│                                 │
│           [markers]             │
└─────────────────────────────────┘
     ↑ 8px from bottom, centered
```

### 5.3 Loop Marker Configuration

```xml
<bpmn:task id="Task_Loop" name="Retry Task">
  <bpmn:standardLoopCharacteristics testBefore="true">
    <bpmn:loopCondition xsi:type="bpmn:tFormalExpression">
      ${retryCount &lt; 3}
    </bpmn:loopCondition>
  </bpmn:standardLoopCharacteristics>
</bpmn:task>
```

### 5.4 Multi-Instance Configuration

```xml
<!-- Parallel Multi-Instance -->
<bpmn:task id="Task_MultiParallel" name="Process Each Item">
  <bpmn:multiInstanceLoopCharacteristics isSequential="false">
    <bpmn:loopCardinality xsi:type="bpmn:tFormalExpression">
      ${itemCount}
    </bpmn:loopCardinality>
  </bpmn:multiInstanceLoopCharacteristics>
</bpmn:task>

<!-- Sequential Multi-Instance -->
<bpmn:task id="Task_MultiSequential" name="Review Each Document">
  <bpmn:multiInstanceLoopCharacteristics isSequential="true">
    <bpmn:loopDataInputRef>documentList</bpmn:loopDataInputRef>
    <bpmn:inputDataItem id="document" />
  </bpmn:multiInstanceLoopCharacteristics>
</bpmn:task>
```

### 5.5 Compensation Association

```xml
<bpmn:task id="Task_Main" name="Charge Card" isForCompensation="false" />
<bpmn:task id="Task_Compensate" name="Refund Card" isForCompensation="true" />
<bpmn:association id="Association_Comp"
    associationDirection="One"
    sourceRef="BoundaryEvent_Comp"
    targetRef="Task_Compensate" />
```

---

## 6. Visual Specifications

### 6.1 Dimensions

| Element | Property | Value |
|---------|----------|-------|
| Task | Width | 100px |
| Task | Height | 80px |
| Task | Corner radius | 10px |
| Task | Border width | 2px |
| Icon | Size | 16x16px |
| Icon | Offset | 8px from top-left |
| Marker | Size | 12x12px |
| Marker | Position | Center bottom, 8px offset |
| Sub-Process (collapsed) | Same as Task | 100x80px |
| Sub-Process (expanded) | Min width | 200px |
| Sub-Process (expanded) | Min height | 150px |
| Call Activity | Border width | 3px |
| Transaction | Inner border | 2px |
| Transaction | Border gap | 3px |

### 6.2 Colors

| State | Fill | Stroke |
|-------|------|--------|
| Default | #FFFFFF | #000000 |
| Selected | #E3F2FD | #1976D2 |
| Hover | #F5F5F5 | #000000 |
| Icon | #000000 | - |
| Marker | #000000 | - |

### 6.3 Border Styles

| Activity Type | Border Style |
|---------------|--------------|
| Task | Solid 2px |
| Call Activity | Solid 3px (thick) |
| Event Sub-Process | Dashed 2px (5px dash, 3px gap) |
| Transaction | Double solid 2px with 3px gap |

---

## 7. TypeScript Interfaces

```typescript
// Task Types
type TaskType =
  | 'task'           // Abstract/Generic
  | 'userTask'
  | 'serviceTask'
  | 'scriptTask'
  | 'manualTask'
  | 'sendTask'
  | 'receiveTask'
  | 'businessRuleTask';

// Sub-Process Types
type SubProcessType =
  | 'subProcess'
  | 'callActivity'
  | 'transaction'
  | 'adHocSubProcess';

// Activity Markers
interface ActivityMarkers {
  loop?: boolean;
  multiInstance?: 'parallel' | 'sequential';
  compensation?: boolean;
  collapsed?: boolean;
  adHoc?: boolean;
}

// Loop Configuration
interface StandardLoopCharacteristics {
  testBefore: boolean;
  loopMaximum?: number;
  loopCondition?: string;
}

// Multi-Instance Configuration
interface MultiInstanceLoopCharacteristics {
  isSequential: boolean;
  loopCardinality?: string | number;
  loopDataInputRef?: string;
  loopDataOutputRef?: string;
  inputDataItem?: string;
  outputDataItem?: string;
  completionCondition?: string;
}

// Base Activity Interface
interface BPMNActivity {
  id: string;
  name?: string;
  type: TaskType | SubProcessType;

  // Markers
  markers: ActivityMarkers;

  // Loop characteristics (one or the other)
  loopCharacteristics?: StandardLoopCharacteristics;
  multiInstanceCharacteristics?: MultiInstanceLoopCharacteristics;

  // For compensation
  isForCompensation?: boolean;

  // For sub-processes
  triggeredByEvent?: boolean;  // Event sub-process
  isExpanded?: boolean;
  flowElements?: BPMNFlowElement[];

  // For call activities
  calledElement?: string;

  // For script tasks
  scriptFormat?: string;
  script?: string;

  // Message reference (send/receive tasks)
  messageRef?: string;

  // Business rule reference
  decisionRef?: string;

  // Connections
  incoming?: string[];
  outgoing?: string[];

  // Attached boundary events
  boundaryEventRefs?: string[];
}

// Visual Shape
interface BPMNActivityShape {
  activityId: string;
  isExpanded?: boolean;
  bounds: {
    x: number;
    y: number;
    width: number;   // 100 for collapsed, variable for expanded
    height: number;  // 80 for collapsed, variable for expanded
  };
}
```

---

## 8. React Component Structure

```typescript
// Activity Components Hierarchy
<ActivityGroup>
  <TaskComponent type={taskType} markers={markers}>
    <TaskIcon type={taskType} />
    <ActivityLabel name={name} />
    <MarkerGroup markers={markers} />
    <BoundaryEvents events={boundaryEvents} />
  </TaskComponent>

  <SubProcessComponent type={subProcessType} isExpanded={isExpanded}>
    <SubProcessIcon type={subProcessType} />
    <ActivityLabel name={name} />
    {isExpanded && <NestedCanvas flowElements={flowElements} />}
    <MarkerGroup markers={markers} />
    <BoundaryEvents events={boundaryEvents} />
  </SubProcessComponent>
</ActivityGroup>

// Marker Component
<MarkerGroup>
  {markers.loop && <LoopMarker />}
  {markers.multiInstance && <MultiInstanceMarker sequential={markers.multiInstance === 'sequential'} />}
  {markers.compensation && <CompensationMarker />}
  {markers.collapsed && <CollapseMarker />}
  {markers.adHoc && <AdHocMarker />}
</MarkerGroup>
```

---

## 9. Activity Rules & Validation

### 9.1 Connection Rules

| Activity Type | Incoming Sequence | Outgoing Sequence | Message Flow |
|--------------|-------------------|-------------------|--------------|
| Task | ✓ | ✓ | Receive/Send only |
| Sub-Process | ✓ | ✓ | ✓ |
| Event Sub-Process | ✗ | ✗ | ✓ |
| Call Activity | ✓ | ✓ | ✓ |

### 9.2 Marker Combinations

| Marker Combination | Valid |
|-------------------|-------|
| Loop + Multi-Instance | ✗ |
| Compensation + Loop | ✗ |
| Compensation + Multi-Instance | ✗ |
| Collapsed + Any marker | ✓ |
| Ad-Hoc + Loop/MI | ✓ (on internal tasks) |

### 9.3 Boundary Event Attachment

All activity types can have boundary events attached except:
- Compensation activities (`isForCompensation="true"`)
- Activities inside ad-hoc sub-processes (limited support)

---

## 10. Activity Summary Table

| Type | Icon | Markers | Boundary Events | Expandable |
|------|------|---------|-----------------|------------|
| Task | None | Loop, MI, Comp | ✓ | ✗ |
| User Task | Person | Loop, MI, Comp | ✓ | ✗ |
| Service Task | Gears | Loop, MI, Comp | ✓ | ✗ |
| Script Task | Document | Loop, MI, Comp | ✓ | ✗ |
| Manual Task | Hand | Loop, MI, Comp | ✓ | ✗ |
| Send Task | Envelope (filled) | Loop, MI, Comp | ✓ | ✗ |
| Receive Task | Envelope (outline) | Loop, MI, Comp | ✓ | ✗ |
| Business Rule | Table | Loop, MI, Comp | ✓ | ✗ |
| Sub-Process | [+] | Loop, MI, Comp, Collapse | ✓ | ✓ |
| Call Activity | Thick border | Loop, MI, Comp | ✓ | ✗ |
| Event Sub-Process | Dashed border | None | ✓ | ✓ |
| Transaction | Double border | Loop, MI, Comp, Collapse | ✓ | ✓ |
| Ad-Hoc | ~ | Loop, MI | ✓ | ✓ |

---

*BPMN 2.0 Activities Specification | React BPMN Editor*
