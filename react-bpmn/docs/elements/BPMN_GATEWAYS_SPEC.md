# BPMN 2.0 Gateways Specification
## React BPMN Editor Component

---

## 1. Overview

Gateways are used to control how sequence flows interact as they converge and diverge within a process. They act as decision points, merge points, or synchronization points. All gateways are depicted as diamonds (rhombus shape).

### 1.1 Gateway Functions

| Function | Description |
|----------|-------------|
| **Split (Diverge)** | One incoming flow, multiple outgoing flows |
| **Merge (Converge)** | Multiple incoming flows, one outgoing flow |
| **Both** | Multiple incoming AND multiple outgoing flows |

---

## 2. Gateway Types (5 Total)

### 2.1 Exclusive Gateway (XOR)

**Description:** Routes the sequence flow to exactly one outgoing path based on conditions. Only one path will be taken.

**Icon:** X (cross) symbol
- Size: 24x24px centered in diamond
- Stroke: 3px

**Behavior:**
- **Split:** Evaluates conditions on outgoing flows, takes first true condition
- **Merge:** No synchronization, immediately passes through
- **Default Flow:** One outgoing flow can be marked as default (takes if no conditions match)

**Visual Indicator:** X in center (or empty for data-based exclusive)

**XML Example:**
```xml
<!-- Condition-based split -->
<bpmn:exclusiveGateway id="Gateway_Decision" name="Order Valid?">
  <bpmn:incoming>Flow_1</bpmn:incoming>
  <bpmn:outgoing>Flow_Yes</bpmn:outgoing>
  <bpmn:outgoing>Flow_No</bpmn:outgoing>
</bpmn:exclusiveGateway>

<bpmn:sequenceFlow id="Flow_Yes" sourceRef="Gateway_Decision" targetRef="Task_Process">
  <bpmn:conditionExpression xsi:type="bpmn:tFormalExpression">
    ${orderValid == true}
  </bpmn:conditionExpression>
</bpmn:sequenceFlow>

<bpmn:sequenceFlow id="Flow_No" sourceRef="Gateway_Decision" targetRef="Task_Reject"
    isImmediate="true" />  <!-- Default flow -->
```

**Default Flow Notation:**
- Small slash mark on the sequence flow line near gateway
- XML: No condition expression, or marked with `default` attribute on gateway

### 2.2 Parallel Gateway (AND)

**Description:** Creates parallel paths (split) or synchronizes parallel paths (merge). All paths are executed/required.

**Icon:** + (plus) symbol
- Size: 24x24px centered in diamond
- Stroke: 3px

**Behavior:**
- **Split:** Creates a token for each outgoing flow (all paths execute)
- **Merge:** Waits for all incoming tokens before proceeding (synchronization)
- No conditions on outgoing flows

**XML Example:**
```xml
<!-- Parallel split -->
<bpmn:parallelGateway id="Gateway_Split" name="Start Parallel">
  <bpmn:incoming>Flow_1</bpmn:incoming>
  <bpmn:outgoing>Flow_Branch1</bpmn:outgoing>
  <bpmn:outgoing>Flow_Branch2</bpmn:outgoing>
  <bpmn:outgoing>Flow_Branch3</bpmn:outgoing>
</bpmn:parallelGateway>

<!-- Parallel merge (synchronize) -->
<bpmn:parallelGateway id="Gateway_Merge" name="Synchronize">
  <bpmn:incoming>Flow_Branch1_End</bpmn:incoming>
  <bpmn:incoming>Flow_Branch2_End</bpmn:incoming>
  <bpmn:incoming>Flow_Branch3_End</bpmn:incoming>
  <bpmn:outgoing>Flow_Continue</bpmn:outgoing>
</bpmn:parallelGateway>
```

### 2.3 Inclusive Gateway (OR)

**Description:** One or more paths may be taken based on conditions. Synchronizes all active incoming paths.

**Icon:** O (circle) symbol
- Size: 20px diameter centered in diamond
- Stroke: 3px

**Behavior:**
- **Split:** Evaluates all conditions, takes all paths where condition is true
- **Merge:** Waits for all active incoming tokens (tokens that were actually created)
- Default flow available for when no conditions match

**XML Example:**
```xml
<bpmn:inclusiveGateway id="Gateway_Inclusive" name="Notification Options">
  <bpmn:incoming>Flow_1</bpmn:incoming>
  <bpmn:outgoing>Flow_Email</bpmn:outgoing>
  <bpmn:outgoing>Flow_SMS</bpmn:outgoing>
  <bpmn:outgoing>Flow_Push</bpmn:outgoing>
</bpmn:inclusiveGateway>

<bpmn:sequenceFlow id="Flow_Email" sourceRef="Gateway_Inclusive" targetRef="Task_SendEmail">
  <bpmn:conditionExpression xsi:type="bpmn:tFormalExpression">
    ${emailEnabled}
  </bpmn:conditionExpression>
</bpmn:sequenceFlow>

<bpmn:sequenceFlow id="Flow_SMS" sourceRef="Gateway_Inclusive" targetRef="Task_SendSMS">
  <bpmn:conditionExpression xsi:type="bpmn:tFormalExpression">
    ${smsEnabled}
  </bpmn:conditionExpression>
</bpmn:sequenceFlow>
```

### 2.4 Event-Based Gateway

**Description:** Routes based on which event occurs first. Used to wait for one of several possible events.

**Icon:** Pentagon inside circle (or multiple event symbols)
- Pentagon: 16px width
- Circle: 22px diameter
- Centered in diamond

**Behavior:**
- **Split only:** Cannot be used for merging
- Outgoing flows connect to intermediate catching events only
- First event to occur wins, other paths are cancelled

**Valid Following Elements:**
- Intermediate Catch Events (Message, Timer, Signal, Conditional)
- Receive Tasks

**XML Example:**
```xml
<bpmn:eventBasedGateway id="Gateway_EventBased" name="Wait for Response">
  <bpmn:incoming>Flow_1</bpmn:incoming>
  <bpmn:outgoing>Flow_ToMessage</bpmn:outgoing>
  <bpmn:outgoing>Flow_ToTimer</bpmn:outgoing>
</bpmn:eventBasedGateway>

<!-- Must connect to intermediate catching events -->
<bpmn:intermediateCatchEvent id="Event_Message" name="Response Received">
  <bpmn:incoming>Flow_ToMessage</bpmn:incoming>
  <bpmn:messageEventDefinition messageRef="Message_Response" />
</bpmn:intermediateCatchEvent>

<bpmn:intermediateCatchEvent id="Event_Timeout" name="7 Day Timeout">
  <bpmn:incoming>Flow_ToTimer</bpmn:incoming>
  <bpmn:timerEventDefinition>
    <bpmn:timeDuration>P7D</bpmn:timeDuration>
  </bpmn:timerEventDefinition>
</bpmn:intermediateCatchEvent>
```

### 2.5 Complex Gateway

**Description:** Used for complex synchronization behavior not covered by other gateways.

**Icon:** * (asterisk/star) symbol
- Size: 24x24px
- 6-pointed star
- Stroke: 3px

**Behavior:**
- Requires explicit activation condition expression
- Can specify custom merge/split logic
- Used for non-standard patterns (e.g., "3 of 5 must complete")

**XML Example:**
```xml
<bpmn:complexGateway id="Gateway_Complex" name="Complex Decision">
  <bpmn:incoming>Flow_A</bpmn:incoming>
  <bpmn:incoming>Flow_B</bpmn:incoming>
  <bpmn:incoming>Flow_C</bpmn:incoming>
  <bpmn:incoming>Flow_D</bpmn:incoming>
  <bpmn:incoming>Flow_E</bpmn:incoming>
  <bpmn:outgoing>Flow_Continue</bpmn:outgoing>
  <bpmn:activationCondition xsi:type="bpmn:tFormalExpression">
    ${completedCount >= 3}
  </bpmn:activationCondition>
</bpmn:complexGateway>
```

---

## 3. Gateway Patterns

### 3.1 Common Workflow Patterns

```
Pattern: Simple Decision
                    ┌─→ [Task A]
[Start] → [Task] → <X> ─→ [Task B]
                    └─→ [Task C] (default)

Pattern: Parallel Execution
                    ┌─→ [Task A] ─┐
[Start] → [Task] → <+> ─→ [Task B] ─→ <+> → [End]
                    └─→ [Task C] ─┘

Pattern: Multi-Choice
                    ┌─→ [Task A] ─┐
[Start] → [Task] → <O> ─→ [Task B] ─→ <O> → [End]
                    └─→ [Task C] ─┘

Pattern: Deferred Choice (Event-Based)
                    ┌─→ (Message) → [Task A]
[Start] → [Task] → <◇>
                    └─→ (Timer) → [Task B]
```

### 3.2 Gateway Combinations

| Split Gateway | Merge Gateway | Valid | Notes |
|--------------|---------------|-------|-------|
| Exclusive | Exclusive | ✓ | Simple branching |
| Parallel | Parallel | ✓ | Required for sync |
| Inclusive | Inclusive | ✓ | Recommended |
| Parallel | Exclusive | ⚠ | May cause issues |
| Exclusive | Parallel | ⚠ | Will deadlock |
| Event-Based | Any | ✓ | Events handle merge |

---

## 4. Visual Specifications

### 4.1 Dimensions

| Element | Property | Value |
|---------|----------|-------|
| Gateway | Width | 50px |
| Gateway | Height | 50px |
| Gateway | Border width | 2px |
| Icon | Size | 24x24px (varies by type) |
| Icon | Position | Centered |

### 4.2 Shape Geometry

```
Diamond vertices (50x50):
- Top: (25, 0)
- Right: (50, 25)
- Bottom: (25, 50)
- Left: (0, 25)

SVG Path:
M 25 0 L 50 25 L 25 50 L 0 25 Z
```

### 4.3 Colors

| State | Fill | Stroke |
|-------|------|--------|
| Default | #FFFFFF | #000000 |
| Selected | #E3F2FD | #1976D2 |
| Hover | #F5F5F5 | #000000 |
| Icon | #000000 | - |

### 4.4 Icon Specifications

| Gateway | Icon | SVG Path |
|---------|------|----------|
| Exclusive | X | `M 13 13 L 37 37 M 37 13 L 13 37` |
| Parallel | + | `M 25 10 L 25 40 M 10 25 L 40 25` |
| Inclusive | O | Circle: `cx="25" cy="25" r="12"` |
| Event-Based | Pentagon in Circle | Complex path |
| Complex | * | 6-pointed star path |

---

## 5. TypeScript Interfaces

```typescript
// Gateway Types
type GatewayType =
  | 'exclusiveGateway'
  | 'parallelGateway'
  | 'inclusiveGateway'
  | 'eventBasedGateway'
  | 'complexGateway';

// Gateway Direction
type GatewayDirection =
  | 'diverging'   // Split: 1 in, many out
  | 'converging'  // Merge: many in, 1 out
  | 'mixed';      // Both: many in, many out

// Event-Based Gateway Type
type EventBasedGatewayType =
  | 'exclusive'   // Default, first event wins
  | 'parallel';   // All events must occur

// Base Gateway Interface
interface BPMNGateway {
  id: string;
  name?: string;
  type: GatewayType;

  // Direction (derived from connections)
  direction?: GatewayDirection;

  // For exclusive/inclusive gateways
  default?: string;  // ID of default outgoing flow

  // For event-based gateways
  eventGatewayType?: EventBasedGatewayType;
  instantiate?: boolean;  // Can start process

  // For complex gateways
  activationCondition?: string;

  // Connections
  incoming: string[];
  outgoing: string[];
}

// Sequence Flow with Condition
interface BPMNSequenceFlow {
  id: string;
  name?: string;
  sourceRef: string;
  targetRef: string;
  conditionExpression?: string;
  isDefault?: boolean;
}

// Visual Shape
interface BPMNGatewayShape {
  gatewayId: string;
  bounds: {
    x: number;
    y: number;
    width: number;  // Always 50
    height: number; // Always 50
  };
}
```

---

## 6. React Component Structure

```typescript
// Gateway Components Hierarchy
<GatewayGroup>
  <GatewayComponent type={gatewayType}>
    <GatewayDiamond />
    <GatewayIcon type={gatewayType} />
    <GatewayLabel name={name} />
    <ConnectionPoints>
      <ConnectionPoint position="top" />
      <ConnectionPoint position="right" />
      <ConnectionPoint position="bottom" />
      <ConnectionPoint position="left" />
    </ConnectionPoints>
  </GatewayComponent>
</GatewayGroup>

// Gateway Icon Components
<GatewayIcon type="exclusiveGateway">
  <XIcon />  {/* Cross/X symbol */}
</GatewayIcon>

<GatewayIcon type="parallelGateway">
  <PlusIcon />  {/* Plus symbol */}
</GatewayIcon>

<GatewayIcon type="inclusiveGateway">
  <CircleIcon />  {/* Circle/O symbol */}
</GatewayIcon>

<GatewayIcon type="eventBasedGateway">
  <EventIcon />  {/* Pentagon in circle */}
</GatewayIcon>

<GatewayIcon type="complexGateway">
  <AsteriskIcon />  {/* Star/asterisk */}
</GatewayIcon>
```

---

## 7. Validation Rules

### 7.1 Connection Rules

| Gateway Type | Min Incoming | Min Outgoing | Conditions Required |
|--------------|--------------|--------------|---------------------|
| Exclusive (split) | 1 | 2+ | Yes (except default) |
| Exclusive (merge) | 2+ | 1 | No |
| Parallel (split) | 1 | 2+ | No |
| Parallel (merge) | 2+ | 1 | No |
| Inclusive (split) | 1 | 2+ | Yes (except default) |
| Inclusive (merge) | 2+ | 1 | No |
| Event-Based | 1 | 2+ | No (events only) |
| Complex | 1+ | 1+ | Activation condition |

### 7.2 Event-Based Gateway Restrictions

Following elements must be:
- Intermediate Catching Events (Message, Timer, Signal, Conditional)
- Receive Tasks
- NOT: Gateways, End Events, Throwing Events, Tasks (except Receive)

### 7.3 Default Flow Rules

- Only one default flow per gateway
- Default flow cannot have condition
- Visualized with slash mark near gateway
- Required when not all paths may be taken

---

## 8. Gateway Decision Table

| Scenario | Recommended Gateway |
|----------|---------------------|
| Choose exactly one path | Exclusive (XOR) |
| Execute all paths in parallel | Parallel (AND) |
| Execute one or more paths | Inclusive (OR) |
| Wait for first event to occur | Event-Based |
| Complex synchronization (m of n) | Complex |
| Simple merge (no sync needed) | Exclusive (XOR) |
| Synchronize parallel paths | Parallel (AND) |

---

## 9. Gateway Summary Table

| Type | Icon | Split Behavior | Merge Behavior | Conditions |
|------|------|----------------|----------------|------------|
| Exclusive | X | First true condition | Pass-through | Required |
| Parallel | + | All paths | Wait for all | None |
| Inclusive | O | All true conditions | Wait for active | Required |
| Event-Based | ◇ | First event wins | N/A | Events only |
| Complex | * | Custom logic | Custom logic | Activation |

---

## 10. Implementation Notes

### 10.1 Token Semantics

```
Exclusive Gateway:
- Split: 1 token in → 1 token out (to selected path)
- Merge: 1 token in → 1 token out (immediate)

Parallel Gateway:
- Split: 1 token in → N tokens out (all paths)
- Merge: N tokens in → 1 token out (synchronized)

Inclusive Gateway:
- Split: 1 token in → M tokens out (1 ≤ M ≤ N based on conditions)
- Merge: M tokens in → 1 token out (wait for all active)

Event-Based Gateway:
- Split: 1 token in → waits → 1 token out (first event)
- Other paths cancelled when one event fires
```

### 10.2 Condition Expression Evaluation

```typescript
// Condition evaluation order for Exclusive Gateway
function evaluateExclusiveGateway(gateway: BPMNGateway, context: ExecutionContext): string {
  for (const flowId of gateway.outgoing) {
    const flow = getSequenceFlow(flowId);
    if (flow.isDefault) continue;

    if (evaluateCondition(flow.conditionExpression, context)) {
      return flowId;  // First match wins
    }
  }

  // Return default flow if no conditions matched
  return gateway.default || throwError('No matching condition');
}
```

---

*BPMN 2.0 Gateways Specification | React BPMN Editor*
