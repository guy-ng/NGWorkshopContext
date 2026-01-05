# BPMN 2.0 Swimlanes Specification
## React BPMN Editor Component

---

## 1. Overview

Swimlanes are used to organize and categorize activities. They visually partition the diagram to show which participant (organization, role, or system) is responsible for which activities.

### 1.1 Swimlane Types

| Type | Description | Visual |
|------|-------------|--------|
| **Pool** | Container representing a participant/organization | Large rectangle with header |
| **Lane** | Subdivision within a pool for roles/departments | Horizontal or vertical band |

---

## 2. Pools (Participants)

### 2.1 Description

A Pool represents a participant in a collaboration. It acts as a container for a process and graphically separates activities from those of other pools.

### 2.2 Pool Types

#### 2.2.1 White Box Pool (Expanded)
Shows internal process details.

```xml
<bpmn:collaboration id="Collaboration_1">
  <bpmn:participant id="Participant_Customer" name="Customer" processRef="Process_Customer" />
</bpmn:collaboration>

<bpmn:process id="Process_Customer" isExecutable="true">
  <bpmn:startEvent id="StartEvent_1" />
  <bpmn:task id="Task_1" name="Place Order" />
  <bpmn:endEvent id="EndEvent_1" />
</bpmn:process>
```

#### 2.2.2 Black Box Pool (Collapsed)
Hides internal details, shows only the participant.

```xml
<bpmn:collaboration id="Collaboration_1">
  <bpmn:participant id="Participant_External" name="External System" />
  <!-- No processRef means black box -->
</bpmn:collaboration>
```

### 2.3 Visual Specification

| Property | Value (Horizontal) | Value (Vertical) |
|----------|-------------------|------------------|
| Min Width | 600px | 200px |
| Min Height | 150px | 400px |
| Header Width | 30px | Full width |
| Header Height | Full height | 30px |
| Border Width | 2px | 2px |
| Corner Radius | 0px | 0px |
| Header Background | #F5F5F5 | #F5F5F5 |
| Body Background | #FFFFFF | #FFFFFF |

### 2.4 Pool Header

The header contains the participant name, typically rotated 90° for horizontal pools.

```
Horizontal Pool:
┌──┬─────────────────────────────────────────┐
│  │                                         │
│ N│                                         │
│ a│         Process Contents                │
│ m│                                         │
│ e│                                         │
└──┴─────────────────────────────────────────┘

Vertical Pool:
┌─────────────────────────────────────────────┐
│                  Name                        │
├─────────────────────────────────────────────┤
│                                             │
│              Process Contents               │
│                                             │
└─────────────────────────────────────────────┘
```

### 2.5 Collapsed Pool (Black Box)

```
┌──┬─────────────────────────────────────────┐
│ N│                                         │
│ a│           (Empty - Black Box)           │
│ m│                                         │
└──┴─────────────────────────────────────────┘
Height: 50-60px (collapsed state)
```

---

## 3. Lanes

### 3.1 Description

Lanes are sub-partitions within a pool used to organize activities, typically by role, department, or system.

### 3.2 Lane Structure

Lanes can be nested to create hierarchical organization.

```
┌──┬───────────────────────────────────────────────────┐
│  │  ┌─────────────────────────────────────────────┐  │
│  │  │  Lane 1: Manager                            │  │
│ P│  ├─────────────────────────────────────────────┤  │
│ o│  │  Lane 2: Employee                           │  │
│ o│  │  ┌────────────────────┬──────────────────┐  │  │
│ l│  │  │ Sub-Lane: Senior   │ Sub-Lane: Junior │  │  │
│  │  │  └────────────────────┴──────────────────┘  │  │
│  │  ├─────────────────────────────────────────────┤  │
│  │  │  Lane 3: System                             │  │
│  │  └─────────────────────────────────────────────┘  │
└──┴───────────────────────────────────────────────────┘
```

### 3.3 Visual Specification

| Property | Value |
|----------|-------|
| Min Height | 100px |
| Header Width | 25px |
| Border Width | 1px |
| Border Style | Solid |
| Border Color | #000000 |
| Header Background | #FAFAFA |
| Body Background | #FFFFFF |
| Text Rotation | 90° (horizontal lanes) |

### 3.4 XML Structure

```xml
<bpmn:process id="Process_1" isExecutable="true">
  <bpmn:laneSet id="LaneSet_1">
    <bpmn:lane id="Lane_Manager" name="Manager">
      <bpmn:flowNodeRef>Task_Approve</bpmn:flowNodeRef>
      <bpmn:flowNodeRef>Gateway_Decision</bpmn:flowNodeRef>
    </bpmn:lane>

    <bpmn:lane id="Lane_Employee" name="Employee">
      <bpmn:flowNodeRef>StartEvent_1</bpmn:flowNodeRef>
      <bpmn:flowNodeRef>Task_Submit</bpmn:flowNodeRef>
      <bpmn:flowNodeRef>EndEvent_1</bpmn:flowNodeRef>

      <!-- Nested lanes -->
      <bpmn:childLaneSet id="ChildLaneSet_1">
        <bpmn:lane id="Lane_Senior" name="Senior">
          <bpmn:flowNodeRef>Task_Review</bpmn:flowNodeRef>
        </bpmn:lane>
        <bpmn:lane id="Lane_Junior" name="Junior">
          <bpmn:flowNodeRef>Task_Prepare</bpmn:flowNodeRef>
        </bpmn:lane>
      </bpmn:childLaneSet>
    </bpmn:lane>
  </bpmn:laneSet>
</bpmn:process>
```

---

## 4. Multi-Pool Collaboration

### 4.1 Description

When multiple participants interact, each has their own pool. Communication between pools is shown with message flows.

### 4.2 Collaboration Structure

```xml
<bpmn:definitions>
  <bpmn:collaboration id="Collaboration_1">
    <bpmn:participant id="Participant_Customer" name="Customer" processRef="Process_Customer" />
    <bpmn:participant id="Participant_Vendor" name="Vendor" processRef="Process_Vendor" />

    <bpmn:messageFlow id="MessageFlow_Order"
        sourceRef="Task_SendOrder"
        targetRef="Task_ReceiveOrder" />
    <bpmn:messageFlow id="MessageFlow_Confirm"
        sourceRef="Task_SendConfirmation"
        targetRef="Task_ReceiveConfirmation" />
  </bpmn:collaboration>

  <bpmn:process id="Process_Customer">
    <!-- Customer's process -->
  </bpmn:process>

  <bpmn:process id="Process_Vendor">
    <!-- Vendor's process -->
  </bpmn:process>
</bpmn:definitions>
```

### 4.3 Visual Layout

```
┌──┬───────────────────────────────────────────────────┐
│ C│  [Start] → [Place Order] → [Send Order] --------│--→ Message
│ u│                                         ←--------│--- Flow
│ s│  [Receive Confirmation] → [End]                  │
│ t│                                                  │
└──┴───────────────────────────────────────────────────┘
                          ↕ (Message Flows)
┌──┬───────────────────────────────────────────────────┐
│ V│  [Receive Order] → [Process] → [Send Confirm] ---│--→
│ e│                                                  │
│ n│                                                  │
│ d│                                                  │
└──┴───────────────────────────────────────────────────┘
```

---

## 5. Diagram Interchange (DI)

### 5.1 Pool Shape

```xml
<bpmndi:BPMNDiagram id="BPMNDiagram_1">
  <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Collaboration_1">

    <!-- Pool shape -->
    <bpmndi:BPMNShape id="Participant_Customer_di" bpmnElement="Participant_Customer"
        isHorizontal="true">
      <dc:Bounds x="100" y="50" width="600" height="250" />
      <bpmndi:BPMNLabel>
        <dc:Bounds x="105" y="150" width="20" height="100" />
      </bpmndi:BPMNLabel>
    </bpmndi:BPMNShape>

    <!-- Lane shape -->
    <bpmndi:BPMNShape id="Lane_Manager_di" bpmnElement="Lane_Manager" isHorizontal="true">
      <dc:Bounds x="130" y="50" width="570" height="125" />
    </bpmndi:BPMNShape>

    <bpmndi:BPMNShape id="Lane_Employee_di" bpmnElement="Lane_Employee" isHorizontal="true">
      <dc:Bounds x="130" y="175" width="570" height="125" />
    </bpmndi:BPMNShape>

  </bpmndi:BPMNPlane>
</bpmndi:BPMNDiagram>
```

### 5.2 Orientation

| Attribute | Value | Description |
|-----------|-------|-------------|
| isHorizontal | true | Lanes stacked vertically, flow left-to-right |
| isHorizontal | false | Lanes stacked horizontally, flow top-to-bottom |

---

## 6. TypeScript Interfaces

```typescript
// Pool/Participant
interface BPMNParticipant {
  id: string;
  name?: string;
  processRef?: string;  // undefined = black box
}

// Lane
interface BPMNLane {
  id: string;
  name?: string;
  flowNodeRefs: string[];  // IDs of contained elements
  childLaneSet?: BPMNLaneSet;
}

// Lane Set
interface BPMNLaneSet {
  id: string;
  lanes: BPMNLane[];
}

// Collaboration
interface BPMNCollaboration {
  id: string;
  participants: BPMNParticipant[];
  messageFlows: BPMNMessageFlow[];
}

// Pool Shape
interface BPMNPoolShape {
  participantId: string;
  isHorizontal: boolean;
  isExpanded: boolean;
  bounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  label?: {
    bounds: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
  };
}

// Lane Shape
interface BPMNLaneShape {
  laneId: string;
  isHorizontal: boolean;
  bounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}
```

---

## 7. React Component Structure

```typescript
// Swimlane Components
<CollaborationCanvas>
  {participants.map(participant => (
    <PoolComponent
      key={participant.id}
      participant={participant}
      isHorizontal={isHorizontal}
      isExpanded={isExpanded}
    >
      <PoolHeader name={participant.name} />

      {isExpanded && (
        <PoolBody>
          <LaneSet lanes={lanes}>
            {lanes.map(lane => (
              <LaneComponent key={lane.id} lane={lane}>
                <LaneHeader name={lane.name} />
                <LaneBody>
                  {/* Flow objects contained in lane */}
                  {lane.flowNodeRefs.map(nodeId => (
                    <FlowObject key={nodeId} id={nodeId} />
                  ))}

                  {/* Nested lanes */}
                  {lane.childLaneSet && (
                    <NestedLaneSet lanes={lane.childLaneSet.lanes} />
                  )}
                </LaneBody>
              </LaneComponent>
            ))}
          </LaneSet>
        </PoolBody>
      )}
    </PoolComponent>
  ))}

  {/* Message flows between pools */}
  <MessageFlowLayer flows={messageFlows} />
</CollaborationCanvas>
```

---

## 8. Resize Behavior

### 8.1 Pool Resize

| Action | Behavior |
|--------|----------|
| Resize Right | Extends pool, lanes stretch proportionally |
| Resize Bottom | Extends pool, distributes space to lanes |
| Resize Left | Moves pool, content stays relative |
| Resize Top | Moves pool, content stays relative |
| Min Size | Cannot shrink below content bounds + padding |

### 8.2 Lane Resize

| Action | Behavior |
|--------|----------|
| Resize Lane Border | Adjacent lanes adjust inversely |
| Minimum Height | 50px (to fit elements) |
| Add Lane | Splits current lane or adds below |
| Remove Lane | Redistributes space to adjacent lanes |

### 8.3 Element Movement

| Action | Behavior |
|--------|----------|
| Drag to Different Lane | Updates flowNodeRef in new lane |
| Drag to Different Pool | Not allowed (must use cut/paste) |
| Lane Contains | Checks if element center is within lane bounds |

---

## 9. Validation Rules

### 9.1 Pool Rules

| Rule | Description |
|------|-------------|
| Unique ID | Each pool must have unique identifier |
| Process Ref | Expanded pools must reference a process |
| No Overlap | Pools cannot overlap each other |
| Sequence Scope | Sequence flows cannot cross pool boundaries |

### 9.2 Lane Rules

| Rule | Description |
|------|-------------|
| Parent Required | Lanes must be within a pool |
| Cover Pool | Lanes must collectively cover entire pool body |
| No Gaps | No gaps allowed between lanes |
| Element Assignment | Each flow node in pool must be in exactly one lane |

### 9.3 Collaboration Rules

| Rule | Description |
|------|-------------|
| Message Flow | Only allowed between different pools |
| Black Box | Cannot have incoming/outgoing sequence flows |
| At Least One | Collaboration must have at least one pool |

---

## 10. Styling Specifications

### 10.1 Pool Styles

```css
.bpmn-pool {
  stroke: #000000;
  stroke-width: 2px;
  fill: #FFFFFF;
}

.bpmn-pool-header {
  fill: #F5F5F5;
  stroke: #000000;
  stroke-width: 1px;
}

.bpmn-pool-header-text {
  font-family: Arial, sans-serif;
  font-size: 12px;
  font-weight: bold;
  fill: #000000;
  writing-mode: vertical-rl;
  text-orientation: mixed;
}

.bpmn-pool.selected {
  stroke: #1976D2;
  stroke-width: 3px;
}

.bpmn-pool.collapsed {
  height: 50px;
}
```

### 10.2 Lane Styles

```css
.bpmn-lane {
  stroke: #000000;
  stroke-width: 1px;
  fill: #FFFFFF;
}

.bpmn-lane-header {
  fill: #FAFAFA;
  stroke: #000000;
  stroke-width: 1px;
}

.bpmn-lane-header-text {
  font-family: Arial, sans-serif;
  font-size: 11px;
  fill: #000000;
  writing-mode: vertical-rl;
}

.bpmn-lane.selected {
  stroke: #1976D2;
  stroke-width: 2px;
}

.bpmn-lane-divider {
  stroke: #000000;
  stroke-width: 1px;
  stroke-dasharray: none;
}
```

---

## 11. Swimlane Summary Table

| Feature | Pool | Lane |
|---------|------|------|
| Contains Process | Yes (white box) | No |
| Can Be Collapsed | Yes (black box) | No |
| Has Header | Yes | Yes |
| Can Nest | No | Yes (child lanes) |
| Sequence Flow | Internal only | Internal to pool |
| Message Flow | Between pools | N/A |
| Min Width | 200px | Inherits from pool |
| Min Height | 50px (collapsed) / 150px (expanded) | 50px |
| Resize | All directions | Height only |

---

## 12. Implementation Notes

### 12.1 Element Containment

```typescript
function findContainingLane(
  element: BPMNFlowNode,
  lanes: BPMNLane[]
): BPMNLane | null {
  const elementCenter = {
    x: element.bounds.x + element.bounds.width / 2,
    y: element.bounds.y + element.bounds.height / 2
  };

  for (const lane of lanes) {
    if (isPointInBounds(elementCenter, lane.bounds)) {
      // Check child lanes first (more specific)
      if (lane.childLaneSet) {
        const childLane = findContainingLane(element, lane.childLaneSet.lanes);
        if (childLane) return childLane;
      }
      return lane;
    }
  }

  return null;
}
```

### 12.2 Pool/Lane Creation

```typescript
function createPool(
  name: string,
  position: Point,
  hasProcess: boolean
): { participant: BPMNParticipant; shape: BPMNPoolShape } {
  const id = generateId('Participant');
  const processId = hasProcess ? generateId('Process') : undefined;

  return {
    participant: {
      id,
      name,
      processRef: processId
    },
    shape: {
      participantId: id,
      isHorizontal: true,
      isExpanded: hasProcess,
      bounds: {
        x: position.x,
        y: position.y,
        width: 600,
        height: hasProcess ? 200 : 50
      }
    }
  };
}
```

---

*BPMN 2.0 Swimlanes Specification | React BPMN Editor*
