# BPMN 2.0 Connecting Objects Specification
## React BPMN Editor Component

---

## 1. Overview

Connecting objects link flow objects and other elements together, showing the order of activities and the flow of messages. There are four types of connecting objects in BPMN 2.0.

### 1.1 Connector Types Summary

| Type | Visual | Purpose | Scope |
|------|--------|---------|-------|
| **Sequence Flow** | Solid line + arrow | Order of activities | Within a pool |
| **Message Flow** | Dashed line + circle/arrow | Communication | Between pools |
| **Association** | Dotted line | Link artifacts | Any elements |
| **Data Association** | Dotted line + arrow | Data flow | Data objects to activities |

---

## 2. Sequence Flow

### 2.1 Description

Sequence flows show the order in which activities are performed in a process. They can only connect elements within the same pool/lane.

### 2.2 Visual Specification

| Property | Value |
|----------|-------|
| Line style | Solid |
| Line width | 2px |
| Color | #000000 |
| Arrow | Filled triangle at target |
| Arrow size | 10x8px |

### 2.3 Types of Sequence Flow

#### 2.3.1 Normal Flow
Standard flow with no conditions.

```xml
<bpmn:sequenceFlow id="Flow_1" sourceRef="Task_1" targetRef="Task_2" />
```

#### 2.3.2 Conditional Flow
Flow with an expression that must evaluate to true.

**Visual:** Small diamond at source end

```xml
<bpmn:sequenceFlow id="Flow_Condition" sourceRef="Task_1" targetRef="Task_2">
  <bpmn:conditionExpression xsi:type="bpmn:tFormalExpression">
    ${amount > 1000}
  </bpmn:conditionExpression>
</bpmn:sequenceFlow>
```

#### 2.3.3 Default Flow
Flow taken when no other conditions match (used with Exclusive/Inclusive Gateways).

**Visual:** Slash/tick mark near source

```xml
<bpmn:exclusiveGateway id="Gateway_1" default="Flow_Default">
  <bpmn:outgoing>Flow_Yes</bpmn:outgoing>
  <bpmn:outgoing>Flow_Default</bpmn:outgoing>
</bpmn:exclusiveGateway>

<bpmn:sequenceFlow id="Flow_Default" sourceRef="Gateway_1" targetRef="Task_Reject" />
```

### 2.4 Connection Rules

| Source Element | Valid Targets |
|----------------|---------------|
| Start Event | Task, Gateway, Intermediate Event, Sub-Process |
| Task | Task, Gateway, End Event, Intermediate Event, Sub-Process |
| Gateway | Task, Gateway, End Event, Intermediate Event, Sub-Process |
| Intermediate Event | Task, Gateway, End Event, Sub-Process |
| Sub-Process | Task, Gateway, End Event, Intermediate Event |
| Boundary Event | Task, Gateway, End Event, Sub-Process |

### 2.5 Waypoints

Sequence flows can have intermediate waypoints to route around obstacles.

```xml
<bpmndi:BPMNEdge id="Flow_1_di" bpmnElement="Flow_1">
  <di:waypoint x="200" y="100" />  <!-- Start point -->
  <di:waypoint x="250" y="100" />  <!-- Intermediate point -->
  <di:waypoint x="250" y="200" />  <!-- Corner -->
  <di:waypoint x="300" y="200" />  <!-- End point -->
</bpmndi:BPMNEdge>
```

---

## 3. Message Flow

### 3.1 Description

Message flows show communication between participants (pools). They represent messages sent between different organizations or process participants.

### 3.2 Visual Specification

| Property | Value |
|----------|-------|
| Line style | Dashed (10px dash, 5px gap) |
| Line width | 1.5px |
| Color | #000000 |
| Source marker | Empty circle (6px diameter) |
| Target marker | Filled arrow (10x8px) |

### 3.3 Connection Rules

| Valid Sources | Valid Targets |
|---------------|---------------|
| Pool (participant) | Pool (participant) |
| Task (Send/Receive) | Task (Send/Receive) |
| Intermediate Throw Event (Message) | Intermediate Catch Event (Message) |
| End Event (Message) | Start Event (Message) |

**Critical Rule:** Message flows CANNOT connect elements within the same pool.

### 3.4 XML Example

```xml
<bpmn:collaboration id="Collaboration_1">
  <bpmn:participant id="Participant_Customer" processRef="Process_Customer" />
  <bpmn:participant id="Participant_Supplier" processRef="Process_Supplier" />

  <bpmn:messageFlow id="MessageFlow_Order"
      sourceRef="Task_SendOrder"
      targetRef="Task_ReceiveOrder"
      messageRef="Message_PurchaseOrder" />
</bpmn:collaboration>

<bpmn:message id="Message_PurchaseOrder" name="Purchase Order" />
```

### 3.5 Message Flow with Message Object

```xml
<bpmn:messageFlow id="MessageFlow_1" sourceRef="Task_Send" targetRef="Task_Receive">
  <bpmn:messageRef>Message_Data</bpmn:messageRef>
</bpmn:messageFlow>

<!-- Visual: Message envelope icon on the flow line -->
<bpmndi:BPMNEdge id="MessageFlow_1_di" bpmnElement="MessageFlow_1">
  <di:waypoint x="200" y="200" />
  <di:waypoint x="200" y="300" />
  <bpmndi:BPMNLabel>
    <dc:Bounds x="170" y="240" width="60" height="20" />
  </bpmndi:BPMNLabel>
</bpmndi:BPMNEdge>
```

---

## 4. Association

### 4.1 Description

Associations link artifacts (text annotations, groups, data objects) to flow objects. They do not affect process flow.

### 4.2 Visual Specification

| Property | Value |
|----------|-------|
| Line style | Dotted (4px dot, 4px gap) |
| Line width | 1px |
| Color | #000000 |
| Arrowhead | None (undirected) or single arrow (directed) |

### 4.3 Association Directions

| Direction | Visual | Use Case |
|-----------|--------|----------|
| None | No arrows | Text annotation to element |
| One | Arrow at target | Directed relationship |
| Both | Arrows at both ends | Bidirectional relationship |

### 4.4 XML Example

```xml
<!-- Undirected association (text annotation) -->
<bpmn:association id="Association_1"
    sourceRef="TextAnnotation_1"
    targetRef="Task_1"
    associationDirection="None" />

<!-- Directed association -->
<bpmn:association id="Association_2"
    sourceRef="DataObject_1"
    targetRef="Task_2"
    associationDirection="One" />
```

### 4.5 Compensation Association

Special association linking compensation boundary events to compensation activities.

```xml
<bpmn:boundaryEvent id="BoundaryEvent_Compensation" attachedToRef="Task_Main">
  <bpmn:compensateEventDefinition />
</bpmn:boundaryEvent>

<bpmn:task id="Task_Compensation" isForCompensation="true" name="Undo Action" />

<bpmn:association id="Association_Comp"
    sourceRef="BoundaryEvent_Compensation"
    targetRef="Task_Compensation"
    associationDirection="One" />
```

---

## 5. Data Association

### 5.1 Description

Data associations show how data objects are used by activities (input) or produced by activities (output).

### 5.2 Visual Specification

| Property | Value |
|----------|-------|
| Line style | Dotted (4px dot, 4px gap) |
| Line width | 1px |
| Color | #000000 |
| Arrow | Filled arrow at target |

### 5.3 Types

| Type | Direction | Description |
|------|-----------|-------------|
| Data Input Association | Data → Activity | Activity reads data |
| Data Output Association | Activity → Data | Activity writes data |

### 5.4 XML Example

```xml
<bpmn:task id="Task_Process" name="Process Order">
  <bpmn:dataInputAssociation id="DataInputAssociation_1">
    <bpmn:sourceRef>DataObject_Order</bpmn:sourceRef>
    <bpmn:targetRef>Property_OrderInput</bpmn:targetRef>
  </bpmn:dataInputAssociation>

  <bpmn:dataOutputAssociation id="DataOutputAssociation_1">
    <bpmn:sourceRef>Property_InvoiceOutput</bpmn:sourceRef>
    <bpmn:targetRef>DataObject_Invoice</bpmn:targetRef>
  </bpmn:dataOutputAssociation>
</bpmn:task>

<bpmn:dataObjectReference id="DataObject_Order" dataObjectRef="DataObject_1" />
<bpmn:dataObjectReference id="DataObject_Invoice" dataObjectRef="DataObject_2" />
```

---

## 6. Visual Specifications Summary

### 6.1 Line Styles

```
Sequence Flow:  ————————————————→
                (solid line)

Message Flow:   - - - - - - - - →
                (dashed, circle at start)

Association:    ·····················
                (dotted, no arrow or single arrow)

Data Assoc:     ····················→
                (dotted with arrow)
```

### 6.2 Arrow Types

| Connector | Start Marker | End Marker |
|-----------|--------------|------------|
| Sequence Flow | None | Filled triangle |
| Conditional Flow | Diamond (12px) | Filled triangle |
| Default Flow | Slash (near source) | Filled triangle |
| Message Flow | Empty circle (6px) | Filled arrow |
| Association | None | None/Arrow (optional) |
| Data Association | None | Filled arrow |

### 6.3 Colors by State

| State | Stroke Color | Fill (markers) |
|-------|--------------|----------------|
| Default | #000000 | #000000 / #FFFFFF |
| Selected | #1976D2 | #1976D2 |
| Hover | #424242 | #424242 |
| Invalid | #D32F2F | #D32F2F |

---

## 7. TypeScript Interfaces

```typescript
// Connector Types
type ConnectorType =
  | 'sequenceFlow'
  | 'messageFlow'
  | 'association'
  | 'dataInputAssociation'
  | 'dataOutputAssociation';

// Association Direction
type AssociationDirection = 'None' | 'One' | 'Both';

// Waypoint
interface Waypoint {
  x: number;
  y: number;
}

// Base Connector Interface
interface BPMNConnector {
  id: string;
  name?: string;
  type: ConnectorType;
  sourceRef: string;
  targetRef: string;
  waypoints: Waypoint[];
}

// Sequence Flow
interface BPMNSequenceFlow extends BPMNConnector {
  type: 'sequenceFlow';
  conditionExpression?: string;
  isDefault?: boolean;
}

// Message Flow
interface BPMNMessageFlow extends BPMNConnector {
  type: 'messageFlow';
  messageRef?: string;
}

// Association
interface BPMNAssociation extends BPMNConnector {
  type: 'association';
  associationDirection: AssociationDirection;
}

// Data Association
interface BPMNDataAssociation extends BPMNConnector {
  type: 'dataInputAssociation' | 'dataOutputAssociation';
  transformation?: string;
}

// Visual Edge
interface BPMNEdge {
  connectorId: string;
  waypoints: Waypoint[];
  label?: {
    text: string;
    bounds: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
  };
}
```

---

## 8. React Component Structure

```typescript
// Connector Components
<ConnectorLayer>
  <SequenceFlowComponent
    waypoints={waypoints}
    isConditional={hasCondition}
    isDefault={isDefault}
  >
    <FlowLine waypoints={waypoints} />
    {isConditional && <ConditionalMarker position={startPosition} />}
    {isDefault && <DefaultMarker position={startPosition} />}
    <ArrowHead position={endPosition} />
    {label && <FlowLabel text={label} position={labelPosition} />}
  </SequenceFlowComponent>

  <MessageFlowComponent waypoints={waypoints}>
    <DashedLine waypoints={waypoints} />
    <CircleMarker position={startPosition} />
    <ArrowHead position={endPosition} />
    {messageRef && <MessageIcon position={midpoint} />}
  </MessageFlowComponent>

  <AssociationComponent
    waypoints={waypoints}
    direction={direction}
  >
    <DottedLine waypoints={waypoints} />
    {direction !== 'None' && <ArrowHead position={endPosition} />}
    {direction === 'Both' && <ArrowHead position={startPosition} />}
  </AssociationComponent>
</ConnectorLayer>
```

---

## 9. Routing Algorithms

### 9.1 Orthogonal Routing

```typescript
function calculateOrthogonalPath(
  source: Point,
  target: Point,
  obstacles: Rectangle[]
): Waypoint[] {
  // Simple L-shaped routing
  const midX = (source.x + target.x) / 2;

  return [
    { x: source.x, y: source.y },
    { x: midX, y: source.y },
    { x: midX, y: target.y },
    { x: target.x, y: target.y }
  ];
}
```

### 9.2 Connection Points

```typescript
// Element connection points (anchors)
type AnchorPosition = 'top' | 'right' | 'bottom' | 'left';

interface ConnectionAnchor {
  position: AnchorPosition;
  x: number;
  y: number;
}

function getElementAnchors(element: BPMNElement): ConnectionAnchor[] {
  const { x, y, width, height } = element.bounds;

  return [
    { position: 'top', x: x + width / 2, y: y },
    { position: 'right', x: x + width, y: y + height / 2 },
    { position: 'bottom', x: x + width / 2, y: y + height },
    { position: 'left', x: x, y: y + height / 2 }
  ];
}
```

---

## 10. Validation Rules

### 10.1 Sequence Flow Rules

| Rule | Description |
|------|-------------|
| Same Pool | Source and target must be in same pool |
| No Self-Loop | Cannot connect element to itself (unless explicitly allowed) |
| Valid Source | Must start from activity, gateway, or event |
| Valid Target | Must end at activity, gateway, or event |
| No Boundary Start | Cannot start from boundary event's parent |

### 10.2 Message Flow Rules

| Rule | Description |
|------|-------------|
| Different Pools | Must connect elements in different pools |
| Valid Endpoints | Only pools, message tasks, message events |
| No Internal | Cannot connect within same participant |

### 10.3 Association Rules

| Rule | Description |
|------|-------------|
| Artifact Required | One end must be artifact (annotation, data object, group) |
| No Flow Objects | Cannot connect two flow objects directly |

---

## 11. Connector Summary Table

| Feature | Sequence Flow | Message Flow | Association | Data Association |
|---------|---------------|--------------|-------------|------------------|
| Line Style | Solid | Dashed | Dotted | Dotted |
| Has Arrow | Yes (end) | Yes (both) | Optional | Yes (end) |
| Conditions | Optional | No | No | No |
| Within Pool | Yes | No | Yes | Yes |
| Between Pools | No | Yes | No | No |
| Affects Flow | Yes | No | No | No |
| Waypoints | Yes | Yes | Yes | Yes |

---

*BPMN 2.0 Connecting Objects Specification | React BPMN Editor*
