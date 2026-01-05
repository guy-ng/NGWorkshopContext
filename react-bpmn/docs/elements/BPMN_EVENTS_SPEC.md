# BPMN 2.0 Events Specification
## React BPMN Editor Component

---

## 1. Overview

Events represent something that happens during the course of a process. They affect the flow of the process and usually have a cause (trigger) or an impact (result). Events are depicted as circles.

### 1.1 Event Categories by Position

| Category | Visual | Border | Description |
|----------|--------|--------|-------------|
| **Start Events** | Circle | Single thin (1px) | Triggers that initiate a process |
| **Intermediate Events** | Circle | Double thin (1px each) | Occur between start and end |
| **End Events** | Circle | Single thick (3px) | Indicate process completion |

### 1.2 Event Behavior Types

| Type | Visual Indicator | Description |
|------|------------------|-------------|
| **Catching** | Unfilled icon | Waits for trigger to occur |
| **Throwing** | Filled icon | Produces the trigger |

---

## 2. Event Types (13 Total)

### 2.1 None Event (Empty)

**Description:** Generic event with no specific trigger defined.

| Position | Catching/Throwing | Use Case |
|----------|-------------------|----------|
| Start | Catching | Generic process start |
| Intermediate | Throwing | Milestone marker |
| End | Throwing | Generic process end |

**Visual:** Empty circle, no internal icon.

**XML Example:**
```xml
<bpmn:startEvent id="StartEvent_1" name="Process Start">
  <bpmn:outgoing>Flow_1</bpmn:outgoing>
</bpmn:startEvent>
```

### 2.2 Message Event

**Description:** Represents sending or receiving a message between participants.

| Position | Catching/Throwing | Icon |
|----------|-------------------|------|
| Start | Catching | Envelope (unfilled) |
| Intermediate Catch | Catching | Envelope (unfilled) |
| Intermediate Throw | Throwing | Envelope (filled) |
| End | Throwing | Envelope (filled) |
| Boundary | Catching | Envelope (unfilled) |

**Icon Specification:**
- Envelope shape: 20x14px centered
- Lines: 2px stroke
- Catching: White fill with black stroke
- Throwing: Black fill

**XML Example:**
```xml
<bpmn:intermediateCatchEvent id="Event_Message" name="Receive Order">
  <bpmn:messageEventDefinition id="MessageEventDefinition_1" messageRef="Message_Order" />
</bpmn:intermediateCatchEvent>
```

### 2.3 Timer Event

**Description:** Triggered based on time conditions (specific date, duration, or cycle).

| Position | Catching/Throwing | Icon |
|----------|-------------------|------|
| Start | Catching | Clock face |
| Intermediate | Catching | Clock face |
| Boundary | Catching | Clock face |

**Icon Specification:**
- Circle: 20px diameter
- Clock hands at 10:10 position
- Stroke: 2px black

**Timer Types:**
- `timeDate`: Specific date/time (ISO 8601)
- `timeDuration`: Duration (ISO 8601 duration)
- `timeCycle`: Recurring (ISO 8601 repeating interval)

**XML Example:**
```xml
<bpmn:intermediateCatchEvent id="Event_Timer" name="Wait 24 Hours">
  <bpmn:timerEventDefinition id="TimerEventDefinition_1">
    <bpmn:timeDuration xsi:type="bpmn:tFormalExpression">PT24H</bpmn:timeDuration>
  </bpmn:timerEventDefinition>
</bpmn:intermediateCatchEvent>
```

### 2.4 Error Event

**Description:** Represents error conditions that interrupt normal flow.

| Position | Catching/Throwing | Icon |
|----------|-------------------|------|
| End | Throwing | Lightning bolt (filled) |
| Boundary | Catching | Lightning bolt (unfilled) |

**Icon Specification:**
- Lightning bolt: 16x20px
- Zigzag shape pointing down
- Always interrupting (no non-interrupting variant)

**XML Example:**
```xml
<bpmn:boundaryEvent id="Event_Error" attachedToRef="Task_1">
  <bpmn:errorEventDefinition id="ErrorEventDefinition_1" errorRef="Error_ValidationFailed" />
</bpmn:boundaryEvent>
```

### 2.5 Cancel Event

**Description:** Used within transaction sub-processes to handle cancellation.

| Position | Catching/Throwing | Icon |
|----------|-------------------|------|
| End | Throwing | X mark (filled) |
| Boundary | Catching | X mark (unfilled) |

**Icon Specification:**
- X shape: 18x18px
- Lines: 3px stroke
- Only valid on Transaction sub-processes

**XML Example:**
```xml
<bpmn:endEvent id="Event_Cancel" name="Cancel Order">
  <bpmn:cancelEventDefinition id="CancelEventDefinition_1" />
</bpmn:endEvent>
```

### 2.6 Compensation Event

**Description:** Triggers compensation activities to undo completed work.

| Position | Catching/Throwing | Icon |
|----------|-------------------|------|
| Intermediate Throw | Throwing | Double rewind arrows (filled) |
| End | Throwing | Double rewind arrows (filled) |
| Boundary | Catching | Double rewind arrows (unfilled) |

**Icon Specification:**
- Two left-pointing triangles: 16x12px total
- Triangles touching at center

**XML Example:**
```xml
<bpmn:intermediateThrowEvent id="Event_Compensation" name="Compensate">
  <bpmn:compensateEventDefinition id="CompensateEventDefinition_1" activityRef="Task_ToCompensate" />
</bpmn:intermediateThrowEvent>
```

### 2.7 Conditional Event

**Description:** Triggered when a business condition becomes true.

| Position | Catching/Throwing | Icon |
|----------|-------------------|------|
| Start | Catching | Document with lines |
| Intermediate | Catching | Document with lines |
| Boundary | Catching | Document with lines |

**Icon Specification:**
- Rectangle: 14x18px
- 3-4 horizontal lines inside
- Represents a "rule" or condition document

**XML Example:**
```xml
<bpmn:intermediateCatchEvent id="Event_Conditional" name="Stock Level Low">
  <bpmn:conditionalEventDefinition id="ConditionalEventDefinition_1">
    <bpmn:condition xsi:type="bpmn:tFormalExpression">${stockLevel &lt; 10}</bpmn:condition>
  </bpmn:conditionalEventDefinition>
</bpmn:intermediateCatchEvent>
```

### 2.8 Link Event

**Description:** Off-page connector for large diagrams (paired throw/catch).

| Position | Catching/Throwing | Icon |
|----------|-------------------|------|
| Intermediate Catch | Catching | Right arrow (unfilled) |
| Intermediate Throw | Throwing | Right arrow (filled) |

**Icon Specification:**
- Arrow/chevron: 16x14px
- Points right
- Used in pairs (throw links to catch)

**XML Example:**
```xml
<bpmn:intermediateThrowEvent id="Event_Link_Throw" name="Go to Page 2">
  <bpmn:linkEventDefinition id="LinkEventDefinition_1" name="Page2Link" />
</bpmn:intermediateThrowEvent>

<bpmn:intermediateCatchEvent id="Event_Link_Catch" name="From Page 1">
  <bpmn:linkEventDefinition id="LinkEventDefinition_2" name="Page2Link" />
</bpmn:intermediateCatchEvent>
```

### 2.9 Signal Event

**Description:** Broadcast signal that can be caught by multiple listeners.

| Position | Catching/Throwing | Icon |
|----------|-------------------|------|
| Start | Catching | Triangle (unfilled) |
| Intermediate Catch | Catching | Triangle (unfilled) |
| Intermediate Throw | Throwing | Triangle (filled) |
| End | Throwing | Triangle (filled) |
| Boundary | Catching | Triangle (unfilled) |

**Icon Specification:**
- Equilateral triangle: 18px base
- Points upward

**XML Example:**
```xml
<bpmn:intermediateThrowEvent id="Event_Signal" name="Order Shipped">
  <bpmn:signalEventDefinition id="SignalEventDefinition_1" signalRef="Signal_OrderShipped" />
</bpmn:intermediateThrowEvent>
```

### 2.10 Terminate Event

**Description:** Immediately terminates all activities in the process.

| Position | Catching/Throwing | Icon |
|----------|-------------------|------|
| End | Throwing | Filled circle |

**Icon Specification:**
- Solid filled circle: 18px diameter
- Inner circle is completely black

**XML Example:**
```xml
<bpmn:endEvent id="Event_Terminate" name="Terminate All">
  <bpmn:terminateEventDefinition id="TerminateEventDefinition_1" />
</bpmn:endEvent>
```

### 2.11 Escalation Event

**Description:** Escalates to a higher level of responsibility.

| Position | Catching/Throwing | Icon |
|----------|-------------------|------|
| Start | Catching | Upward arrow (unfilled) |
| Intermediate Throw | Throwing | Upward arrow (filled) |
| End | Throwing | Upward arrow (filled) |
| Boundary | Catching | Upward arrow (unfilled) |

**Icon Specification:**
- Arrow/chevron pointing up: 14x18px
- Similar to signal but elongated

**XML Example:**
```xml
<bpmn:endEvent id="Event_Escalation" name="Escalate to Manager">
  <bpmn:escalationEventDefinition id="EscalationEventDefinition_1" escalationRef="Escalation_1" />
</bpmn:endEvent>
```

### 2.12 Multiple Event

**Description:** Multiple triggers - any one can activate (catch) or all are produced (throw).

| Position | Catching/Throwing | Icon |
|----------|-------------------|------|
| Start | Catching | Pentagon (unfilled) |
| Intermediate Catch | Catching | Pentagon (unfilled) |
| Intermediate Throw | Throwing | Pentagon (filled) |
| End | Throwing | Pentagon (filled) |
| Boundary | Catching | Pentagon (unfilled) |

**Icon Specification:**
- Regular pentagon: 18px width
- Points upward

**XML Example:**
```xml
<bpmn:startEvent id="Event_Multiple" name="Order or Signal">
  <bpmn:messageEventDefinition id="MessageEventDefinition_M1" />
  <bpmn:signalEventDefinition id="SignalEventDefinition_M1" />
</bpmn:startEvent>
```

### 2.13 Parallel Multiple Event

**Description:** All triggers must occur before activation (catch only).

| Position | Catching/Throwing | Icon |
|----------|-------------------|------|
| Start | Catching | Plus in pentagon |
| Intermediate | Catching | Plus in pentagon |
| Boundary | Catching | Plus in pentagon |

**Icon Specification:**
- Pentagon outline: 18px
- Plus sign inside: 12px

**XML Example:**
```xml
<bpmn:intermediateCatchEvent id="Event_ParallelMultiple" name="All Approvals">
  <bpmn:parallelMultiple>true</bpmn:parallelMultiple>
  <bpmn:messageEventDefinition id="MessageEventDefinition_PM1" />
  <bpmn:messageEventDefinition id="MessageEventDefinition_PM2" />
</bpmn:intermediateCatchEvent>
```

---

## 3. Boundary Events

### 3.1 Overview

Boundary events are attached to the border of activities and trigger when specific conditions occur during activity execution.

### 3.2 Interrupting vs Non-Interrupting

| Type | Border Style | Behavior |
|------|--------------|----------|
| Interrupting | Solid | Cancels the activity when triggered |
| Non-Interrupting | Dashed | Activity continues, parallel path created |

### 3.3 Attachment Rules

```
Boundary Event Attachment Rules:
├── Tasks: All types allowed
├── Sub-Processes: All types allowed
├── Call Activities: All types allowed
└── Gateways/Events: NOT allowed
```

### 3.4 Valid Boundary Event Types

| Event Type | Interrupting | Non-Interrupting |
|------------|--------------|------------------|
| Message | ✓ | ✓ |
| Timer | ✓ | ✓ |
| Error | ✓ | ✗ |
| Cancel | ✓ | ✗ |
| Compensation | ✓ | ✗ |
| Conditional | ✓ | ✓ |
| Signal | ✓ | ✓ |
| Escalation | ✓ | ✓ |
| Multiple | ✓ | ✓ |
| Parallel Multiple | ✓ | ✓ |

**XML Example (Boundary):**
```xml
<bpmn:boundaryEvent id="Boundary_Timer" attachedToRef="Task_Process" cancelActivity="false">
  <bpmn:timerEventDefinition id="TimerEventDefinition_B1">
    <bpmn:timeDuration xsi:type="bpmn:tFormalExpression">PT1H</bpmn:timeDuration>
  </bpmn:timerEventDefinition>
  <bpmn:outgoing>Flow_Escalation</bpmn:outgoing>
</bpmn:boundaryEvent>
```

---

## 4. Visual Specifications

### 4.1 Dimensions

| Element | Dimension | Value |
|---------|-----------|-------|
| Event circle | Diameter | 36px |
| Icon | Max size | 20x20px |
| Border (Start) | Width | 1px |
| Border (Intermediate outer) | Width | 1px |
| Border (Intermediate inner) | Width | 1px |
| Border (End) | Width | 3px |
| Gap (Intermediate) | Width | 3px |

### 4.2 Colors

| State | Fill | Stroke |
|-------|------|--------|
| Default | #FFFFFF | #000000 |
| Selected | #E3F2FD | #1976D2 |
| Hover | #F5F5F5 | #000000 |
| Catching icon | #FFFFFF | #000000 |
| Throwing icon | #000000 | #000000 |

### 4.3 Non-Interrupting Visual

- Border style: Dashed
- Dash pattern: 5px dash, 3px gap
- Applies to intermediate boundary events only

---

## 5. TypeScript Interfaces

```typescript
// Event Position
type EventPosition = 'start' | 'intermediate' | 'end' | 'boundary';

// Event Types
type EventType =
  | 'none'
  | 'message'
  | 'timer'
  | 'error'
  | 'cancel'
  | 'compensation'
  | 'conditional'
  | 'link'
  | 'signal'
  | 'terminate'
  | 'escalation'
  | 'multiple'
  | 'parallelMultiple';

// Event Behavior
type EventBehavior = 'catching' | 'throwing';

// Timer Types
interface TimerDefinition {
  type: 'timeDate' | 'timeDuration' | 'timeCycle';
  value: string; // ISO 8601 format
}

// Base Event Interface
interface BPMNEvent {
  id: string;
  name?: string;
  position: EventPosition;
  eventType: EventType;
  behavior: EventBehavior;

  // For boundary events
  attachedToRef?: string;
  cancelActivity?: boolean; // true = interrupting

  // Event-specific definitions
  messageRef?: string;
  timerDefinition?: TimerDefinition;
  errorRef?: string;
  signalRef?: string;
  escalationRef?: string;
  conditionExpression?: string;
  linkName?: string;
  compensationActivityRef?: string;

  // Connections
  incoming?: string[];
  outgoing?: string[];
}

// Visual Shape
interface BPMNEventShape {
  eventId: string;
  bounds: {
    x: number;
    y: number;
    width: number;  // Always 36
    height: number; // Always 36
  };
}
```

---

## 6. React Component Structure

```typescript
// Event Components Hierarchy
<EventGroup>
  <StartEventComponent />
  <IntermediateEventComponent />
  <EndEventComponent />
  <BoundaryEventComponent />
</EventGroup>

// Each renders:
<EventCircle position={position}>
  <EventBorder interrupting={interrupting} />
  <EventIcon type={eventType} behavior={behavior} />
  <EventLabel name={name} />
</EventCircle>
```

---

## 7. Event Matrix Summary

| Event Type | Start | Int. Catch | Int. Throw | End | Boundary Int. | Boundary Non-Int. |
|------------|:-----:|:----------:|:----------:|:---:|:-------------:|:-----------------:|
| None | ✓ | ✓ | ✓ | ✓ | - | - |
| Message | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Timer | ✓ | ✓ | - | - | ✓ | ✓ |
| Error | - | - | - | ✓ | ✓ | - |
| Cancel | - | - | - | ✓ | ✓ | - |
| Compensation | - | - | ✓ | ✓ | ✓ | - |
| Conditional | ✓ | ✓ | - | - | ✓ | ✓ |
| Link | - | ✓ | ✓ | - | - | - |
| Signal | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Terminate | - | - | - | ✓ | - | - |
| Escalation | ✓ | - | ✓ | ✓ | ✓ | ✓ |
| Multiple | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Parallel Multiple | ✓ | ✓ | - | - | ✓ | ✓ |

---

*BPMN 2.0 Events Specification | React BPMN Editor*
