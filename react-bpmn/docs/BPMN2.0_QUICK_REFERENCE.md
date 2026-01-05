# BPMN 2.0 Quick Reference Guide

At-a-glance reference for BPMN 2.0 connecting objects and swimlanes.

---

## Connecting Objects Quick Reference

### Sequence Flow Types

#### Normal Sequence Flow
```
Task1 ——→ Task2
```
- **Use**: Standard flow between elements
- **Line**: Solid, 2px, #000000
- **Marker**: Arrow only
- **XML**: `<sequenceFlow id="" sourceRef="" targetRef="" />`

#### Conditional Sequence Flow
```
Gateway ◇——→ Task
```
- **Use**: Decision flow with condition
- **Line**: Solid, 2px, #000000
- **Marker**: Diamond (8px) + Arrow
- **Condition**: `<conditionExpression xsi:type="tFormalExpression">${x > 1}</conditionExpression>`
- **Label**: Show condition expression
- **XML**: Plus `<conditionExpression>` child element

#### Default Sequence Flow
```
Gateway /——→ Task
```
- **Use**: Fallback when no conditions met
- **Line**: Solid, 2px, #000000
- **Marker**: Slash (6-8px) + Arrow
- **Parent Attr**: `default="SequenceFlow_id"` on gateway
- **Rules**: Conditions ignored if present, exactly one per element

---

### Message Flow
```
Pool A  Pool B
[Task] ……●—→ [Event]
```
- **Use**: Communication between pools
- **Line**: Dotted, 2px, #000000, dash `5,3`
- **Marker**: Circle (source) + Arrow (target)
- **Constraint**: ONLY between different pools
- **Optional**: Reference message definition with `messageRef=""`

---

### Associations

#### Normal Association
```
Task ═════════ Annotation
```
- **Use**: Link artifacts (data, text, groups) to elements
- **Line**: Dotted, 1.5px, #999999, dash `3,2`
- **Marker**: None
- **No impact** on sequence or data flow

#### Directional Association
```
DataObj ——●→ Task
```
- **Use**: Show one-way relationship
- **Direction**: `associationDirection="One"`
- **Arrow**: Solid, 6px, #666666

#### Bi-Directional Association
```
DataObj ←—●—→ Task
```
- **Use**: Show two-way relationship
- **Direction**: `associationDirection="Both"`
- **Arrows**: Both ends

---

### Data Associations

#### Data Input (Into Task)
```
DataObj ……●→ Task
```
- **Use**: Data flows INTO task
- **Line**: Fine dotted, 1.5px, #555555, dash `2,2`
- **Arrow**: Solid, 6px, #333333 (pointing to target)
- **Optional**: Transformation expression
- **XML**: `<dataInputAssociation><sourceRef>...</sourceRef><targetRef>...</targetRef></dataInputAssociation>`

#### Data Output (From Task)
```
Task →●…… DataObj
```
- **Use**: Data flows OUT OF task
- **Same styling** as input, arrow direction reversed

---

## Swimlanes Quick Reference

### Pool (Container for Participant)

#### White Box (Expanded) - Shows Details
```
┌────────────────────────────┐
│ Customer (Participant)      │
│ ┌──────────────┐            │
│ │ Lane 1       │ [Task]     │
│ ├──────────────┤            │
│ │ Lane 2       │ [Task]     │
│ └──────────────┘            │
└────────────────────────────┘
```

- **Border**: 2px solid #000000
- **Fill**: #FFFFFF
- **Label Area**: 30-50px wide, vertical text (-90°)
- **Contains**: Lanes and flow elements
- **Constraint**: Sequence flows contained within

#### Black Box (Collapsed) - Hides Details
```
┌──────────────┐
│ Supplier     │
└──────────────┘
```

- **Border**: 2px solid #000000
- **Height**: 80-100px (smaller than expanded)
- **Content**: Hidden
- **Connections**: Only message flows
- **Use**: External participants, abstracted processes

#### Multi-Instance Marker
```
┌────────────────────────┐
│ Order Handler  ║ ║ ║ │
└────────────────────────┘
   (3 parallel lines on right)
```

- **Marker**: 3 vertical lines, 2px each
- **Spacing**: 2px between lines
- **Position**: 3-5px inside right border
- **Height**: 15-20px, centered vertically
- **Meaning**: Parallel execution of participant
- **XML**: `<participantMultiplicity minimum="1" maximum="5"/>`

---

### Lane (Role/Department Subdivision)

```
┌─ Sales Rep ─────────────┐
│ [Task1] → [Task2]       │
├─ Manager ───────────────┤
│ [Task3] → [Task4]       │
└─────────────────────────┘
```

- **Border**: 1px solid #CCCCCC (dividing line)
- **Background**: #F5F5F5 (light gray)
- **Label Area**: 30px wide, #E8E8E8
- **Height**: Min 60px per lane
- **Text**: Vertical, 12px, -90° rotation
- **Rules**: Sequence flows CAN cross lanes
- **Naming**: Use roles/departments, not individual names

#### Nested Lanes (Matrix Structure)
```
┌─ Department ────────────────────┐
│ ┌─ Manager ─────────────┐       │
│ │ [Task]                │       │
│ ├──────────────────────┤        │
│ │ Analyst               │       │
│ │ [Task]                │       │
│ └─────────────────────┘        │
└────────────────────────────────┘
```

- **Parent Lane**: Uses `<childLaneSet>` instead of `<flowNodeRef>`
- **Child Lanes**: Nested within parent's `<childLaneSet>`
- **Depth**: Arbitrary nesting possible (rarely > 2 levels)

---

## Connection Rules Summary

### Sequence Flow Rules
```
✓ Within same pool          | ✗ Across pools (INVALID)
✓ Between any flow objects  | ✗ To/from participants
✓ Cross lane boundaries     | ✗ To artifacts
```

### Message Flow Rules
```
✓ Between different pools   | ✗ Within same pool (INVALID)
✓ Between flow objects      | ✓ To/from pool boundary
✓ References message def    | ✗ To artifacts
```

### Association Rules
```
✓ To artifacts             | ✗ Cannot connect flow objects
✓ One, both, or no arrows  | ✓ Documentation only
✗ Does NOT affect sequence | ✓ Directional optional
```

### Data Association Rules
```
✓ Multiple sources→1 target | ✓ With transformation
✓ Optional assignments      | ✗ Does NOT affect sequence
✓ Can nest expressions      | ✓ Input AND output variants
```

---

## Color Palette

```
Element Flows:           #000000 (Black)
Associations:            #999999 (Gray)
Data Flows:              #555555 (Dark Gray)

Backgrounds:
  Pool/White-box:        #FFFFFF (White)
  Lane:                  #F5F5F5 (Light Gray)
  Lane Label:            #E8E8E8 (Medium Light)
  Lane Border:           #CCCCCC (Light Gray)

Interactive:
  Selected:              #0066CC (Blue)
  Highlighted:           #FFD700 (Gold)
  Disabled:              #CCCCCC (Gray)
  Error:                 #FF0000 (Red)
```

---

## Stroke Styles

```
Normal Sequence Flow:     stroke: 2px, pattern: solid
Conditional Flow:         stroke: 2px, pattern: solid
Default Flow:            stroke: 2px, pattern: solid
Message Flow:            stroke: 2px, pattern: dotted (5,3)
Association:             stroke: 1.5px, pattern: dotted (3,2)
Data Association:        stroke: 1.5px, pattern: dotted (2,2)
Pool/Lane Borders:       stroke: 2px/1px, pattern: solid
```

---

## XML Element Reference

### Sequence Flow
```xml
<sequenceFlow id="SequenceFlow_1"
              sourceRef="Task_1"
              targetRef="Task_2"
              name="Process">
  <conditionExpression xsi:type="tFormalExpression">
    ${x > 100}
  </conditionExpression>
</sequenceFlow>
```

### Message Flow
```xml
<messageFlow id="MessageFlow_1"
             sourceRef="Task_send"
             targetRef="Event_receive"
             messageRef="Message_order"
             name="Send Order"/>
```

### Association
```xml
<association id="Association_1"
             sourceRef="Task_1"
             targetRef="TextAnnotation_1"
             associationDirection="One"/>
```

### Data Association
```xml
<dataInputAssociation id="DataInput_1">
  <sourceRef>DataObject_order</sourceRef>
  <sourceRef>DataObject_customer</sourceRef>
  <targetRef>DataInput_process</targetRef>
  <transformation>
    <formalExpression>${dataObject.price * 1.2}</formalExpression>
  </transformation>
  <assignment>
    <from>${dataObject.id}</from>
    <to>${task.orderId}</to>
  </assignment>
</dataInputAssociation>
```

### Pool
```xml
<collaboration id="Collaboration_1">
  <participant id="Participant_customer"
               processRef="Process_1"
               name="Customer">
    <participantMultiplicity minimum="1" maximum="5"/>
  </participant>
</collaboration>

<process id="Process_1" name="Customer Process">
  <laneSet id="LaneSet_1">
    <lane id="Lane_1" name="Sales Rep">
      <flowNodeRef>Task_1</flowNodeRef>
    </lane>
    <lane id="Lane_2" name="Manager">
      <flowNodeRef>Task_2</flowNodeRef>
    </lane>
  </laneSet>
  <!-- flow elements here -->
</process>
```

---

## Component Props Cheat Sheet

### SequenceFlowProps
```typescript
{
  id: string;
  sourceRef: string;
  targetRef: string;
  startX: number; startY: number;
  endX: number; endY: number;
  name?: string;
  type: 'normal' | 'conditional' | 'default';
  conditionExpression?: string;  // if conditional
  color?: '#000000';
  strokeWidth?: 2;
}
```

### MessageFlowProps
```typescript
{
  id: string;
  sourceRef: string;
  targetRef: string;
  startX: number; startY: number;
  endX: number; endY: number;
  name?: string;
  messageRef?: string;
  dashArray?: '5,3';
  strokeWidth?: 2;
}
```

### PoolProps
```typescript
{
  id: string;
  name: string;
  x: number; y: number;
  width: number; height: number;
  processRef: string;
  isCollapsed?: boolean;
  participantMultiplicity?: {
    minimum: 1;
    maximum: number | null;
  };
  backgroundColor?: '#FFFFFF';
  borderColor?: '#000000';
  borderWidth?: 2;
}
```

### LaneProps
```typescript
{
  id: string;
  name: string;
  x: number; y: number;
  width: number; height: number;
  flowNodeRefs: string[];
  backgroundColor?: '#F5F5F5';
  borderColor?: '#CCCCCC';
  borderWidth?: 1;
}
```

---

## Best Practices

### Naming
- ✓ Lane: "Sales Manager", "Finance Analyst"
- ✗ Lane: "Joan Doe", "Sales Department"
- ✓ Flow: "Approve Order", "Send Invoice"
- ✗ Flow: "Process", "Do Stuff"

### Styling
- Use consistent colors across diagram
- Keep line widths proportional (2px normal, 1.5px associations)
- Ensure contrast ratio > 4.5:1 for accessibility
- Use patterns (dotted) to differentiate line types

### Modeling
- One expanded pool per diagram (main process)
- Multiple collapsed pools as needed (external participants)
- Use conditional flows for gateways with decision logic
- Message flows for inter-organizational communication
- Associations for documentation/annotations only

### Performance
- Cache SVG marker definitions
- Debounce waypoint updates
- Virtualize large lane content
- Use `React.memo` for static components

---

## Common Mistakes to Avoid

❌ **WRONG**: Sequence flow crossing pool boundaries
```
Pool A: [Task1] ——→ [Task2] (in Pool B)  ✗ INVALID
```

✓ **RIGHT**: Use message flow between pools
```
Pool A: [Task1] ——→ [Send]
           ↓
        ……●→  (message flow)
           ↓
Pool B: [Receive] ——→ [Task2]  ✓ CORRECT
```

---

❌ **WRONG**: Data association XML element order
```xml
<dataInputAssociation>
  <targetRef>...</targetRef>          ✗ Wrong order
  <sourceRef>...</sourceRef>
  <transformation>...</transformation>
</dataInputAssociation>
```

✓ **RIGHT**: Correct element order
```xml
<dataInputAssociation>
  <sourceRef>...</sourceRef>          ✓ Correct
  <targetRef>...</targetRef>
  <transformation>...</transformation>
</dataInputAssociation>
```

---

❌ **WRONG**: Lane naming after individuals
```
Sales Department
  ├─ Joan Doe          ✗ Changes when person leaves
  └─ John Smith
```

✓ **RIGHT**: Name lanes after roles
```
Sales Department
  ├─ Sales Manager     ✓ Role-based, reusable
  └─ Sales Analyst
```

---

## Troubleshooting

### Connector not visible
- Check color matches background (should be #000000 or darker)
- Verify stroke-width is at least 1px
- Ensure startX/Y and endX/Y are different (not collapsed)
- Check for opacity < 1 causing transparency

### Label overlaps connector
- Offset label by 15-20px from line midpoint
- Calculate angle and rotate label to match line
- Add white background rectangle to label
- Consider moving label if still overlaps

### Multi-instance marker not showing
- Verify position is inside pool boundary (3-5px from right edge)
- Check marker height is 15-20px (visible at small zoom)
- Ensure stroke-width of marker lines is 2px
- Verify marker y-position is centered vertically

### Zoom makes markers disappear
- Use `markerUnits="strokeWidth"` for auto-scaling
- Alternatively, scale markers separately based on zoom level
- Set minimum marker size (2px stroke minimum)

### XML not importing
- Check element ordering (especially in data associations)
- Verify all ID references exist (no broken pointers)
- Ensure namespace declarations are present
- Validate against BPMN 2.0 schema

---

## Quick Implementation Checklist

**Day 1: Foundation**
- [ ] Set up TypeScript interfaces
- [ ] Create SVG marker definitions
- [ ] Implement basic coordinate system

**Day 2-3: Core Connectors**
- [ ] NormalSequenceFlow component
- [ ] ConditionalSequenceFlow component
- [ ] DefaultSequenceFlow component

**Day 4-5: Inter-Pool Communication**
- [ ] MessageFlow component
- [ ] Association component
- [ ] DataAssociation components

**Day 6: Swimlanes**
- [ ] Pool component (both variants)
- [ ] Lane component
- [ ] Multi-instance marker support

**Day 7: Integration & Testing**
- [ ] XML import/export
- [ ] Connection validation
- [ ] Diagram rendering

---

## Resources

**Full Documentation**:
- BPMN2.0_DETAILED_SPECS.md (6,000+ lines)
- BPMN2.0_COMPONENT_INTERFACES.ts (800+ lines)
- BPMN2.0_VISUAL_REFERENCE.md (1,500+ lines)
- BPMN2.0_IMPLEMENTATION_EXAMPLES.md (1,500+ lines)

**Official Spec**: http://www.omg.org/spec/BPMN/2.0/
**Quick Links**:
- Camunda: https://camunda.com/bpmn/reference/
- Visual Paradigm: https://www.visual-paradigm.com/
- ProcessMind: https://processmind.com/

---

**Version**: 1.0
**Last Updated**: January 2026
**Status**: Ready to use
