# BPMN 2.0 Artifacts Specification
## React BPMN Editor Component

---

## 1. Overview

Artifacts provide additional information about a process but do not affect the flow of execution. They are used for documentation, data modeling, and visual organization.

### 1.1 Artifact Types

| Type | Purpose | Visual |
|------|---------|--------|
| **Data Object** | Information/document in process | Document icon |
| **Data Store** | Persistent storage reference | Database cylinder |
| **Group** | Visual grouping of elements | Dashed rounded rectangle |
| **Text Annotation** | Comments and documentation | Open bracket with text |

---

## 2. Data Object

### 2.1 Description

Data Objects represent information flowing through the process. They can be physical (paper documents) or electronic (files, records).

### 2.2 Data Object Types

| Type | Description | Visual Indicator |
|------|-------------|------------------|
| Data Object | Basic information item | Document icon |
| Data Input | Input to the process | Filled arrow on corner |
| Data Output | Output from the process | Empty arrow on corner |
| Data Collection | Multiple instances | Three vertical lines |

### 2.3 Visual Specification

| Property | Value |
|----------|-------|
| Width | 36px |
| Height | 50px |
| Folded corner | 10x10px |
| Border width | 1.5px |
| Border color | #000000 |
| Fill | #FFFFFF |

### 2.4 Data Object Icon (SVG Path)

```svg
<!-- Basic data object -->
<path d="M 0 0 L 26 0 L 36 10 L 36 50 L 0 50 Z M 26 0 L 26 10 L 36 10"
      fill="#FFFFFF"
      stroke="#000000"
      stroke-width="1.5" />
```

### 2.5 XML Structure

```xml
<!-- Data Object Definition -->
<bpmn:dataObject id="DataObject_1" name="Order Data" isCollection="false" />

<!-- Data Object Reference (visual instance) -->
<bpmn:dataObjectReference id="DataObjectRef_1" name="Order" dataObjectRef="DataObject_1">
  <bpmn:dataState name="Submitted" />
</bpmn:dataObjectReference>

<!-- Data Input -->
<bpmn:dataInput id="DataInput_1" name="Customer Info" isCollection="false" />

<!-- Data Output -->
<bpmn:dataOutput id="DataOutput_1" name="Invoice" isCollection="false" />
```

### 2.6 Data States

Data objects can have states representing their lifecycle stage.

```xml
<bpmn:dataObjectReference id="DataObjectRef_Order" dataObjectRef="DataObject_Order">
  <bpmn:dataState name="Draft" />  <!-- or "Submitted", "Approved", "Rejected" -->
</bpmn:dataObjectReference>
```

**Visual:** State name displayed in brackets below object name: `Order [Draft]`

### 2.7 Collection Marker

For data collections (isCollection="true"), display three vertical lines at bottom.

```
┌─────┐╮
│     │
│     │
│ ||| │  ← Collection marker
└─────┘
```

---

## 3. Data Store

### 3.1 Description

Data Stores represent persistent storage that persists beyond the life of a process instance (databases, file systems, etc.).

### 3.2 Visual Specification

| Property | Value |
|----------|-------|
| Width | 50px |
| Height | 50px |
| Border width | 1.5px |
| Border color | #000000 |
| Fill | #FFFFFF |
| Top ellipse height | 10px |

### 3.3 Data Store Icon (SVG)

```svg
<!-- Cylinder shape -->
<path d="
  M 0 10
  C 0 4, 25 0, 25 0
  C 25 0, 50 4, 50 10
  L 50 40
  C 50 46, 25 50, 25 50
  C 25 50, 0 46, 0 40
  Z
" fill="#FFFFFF" stroke="#000000" stroke-width="1.5" />

<!-- Top ellipse (visible) -->
<ellipse cx="25" cy="10" rx="25" ry="10"
         fill="#FFFFFF" stroke="#000000" stroke-width="1.5" />
```

### 3.4 XML Structure

```xml
<!-- Data Store Definition -->
<bpmn:dataStore id="DataStore_1" name="Customer Database" capacity="unlimited" />

<!-- Data Store Reference (visual instance) -->
<bpmn:dataStoreReference id="DataStoreRef_1" name="CRM Database" dataStoreRef="DataStore_1" />
```

---

## 4. Group

### 4.1 Description

Groups provide a visual mechanism to organize elements without affecting the flow. They are purely for documentation and visual clarity.

### 4.2 Visual Specification

| Property | Value |
|----------|-------|
| Border style | Dashed |
| Dash pattern | 8px dash, 4px gap |
| Border width | 1.5px |
| Border color | #000000 |
| Corner radius | 10px |
| Fill | Transparent |
| Min size | 100x100px |

### 4.3 XML Structure

```xml
<bpmn:group id="Group_1" categoryValueRef="CategoryValue_Approval" />

<bpmn:category id="Category_1" name="Approval Flow">
  <bpmn:categoryValue id="CategoryValue_Approval" value="Approval Steps" />
</bpmn:category>
```

### 4.4 DI Shape

```xml
<bpmndi:BPMNShape id="Group_1_di" bpmnElement="Group_1">
  <dc:Bounds x="100" y="100" width="300" height="200" />
  <bpmndi:BPMNLabel>
    <dc:Bounds x="200" y="80" width="100" height="20" />
  </bpmndi:BPMNLabel>
</bpmndi:BPMNShape>
```

### 4.5 Group Behavior

- Groups can span across lanes but not across pools
- Elements inside a group are not "contained" - they can be selected independently
- Moving a group does not move contained elements
- Groups can overlap with each other

---

## 5. Text Annotation

### 5.1 Description

Text Annotations provide additional textual information. They are connected to elements using associations.

### 5.2 Visual Specification

| Property | Value |
|----------|-------|
| Left bracket width | 20px |
| Min width | 100px |
| Min height | 30px |
| Border width | 1px |
| Text padding | 5px |
| Font size | 11px |
| Font family | Arial, sans-serif |
| Text color | #000000 |

### 5.3 Visual Representation

```
   ╔═══════════════════════
   ║ This is annotation text
   ║ that can span multiple
   ║ lines as needed.
   ╚═══════════════════════

Left bracket only (open bracket shape)
```

### 5.4 SVG Shape

```svg
<g class="bpmn-text-annotation">
  <!-- Open bracket -->
  <path d="M 20 0 L 0 0 L 0 50 L 20 50"
        fill="none"
        stroke="#000000"
        stroke-width="1" />

  <!-- Text area -->
  <foreignObject x="25" y="5" width="175" height="40">
    <div xmlns="http://www.w3.org/1999/xhtml">
      Annotation text here
    </div>
  </foreignObject>
</g>
```

### 5.5 XML Structure

```xml
<bpmn:textAnnotation id="TextAnnotation_1">
  <bpmn:text>This step requires manager approval for amounts over $10,000.</bpmn:text>
</bpmn:textAnnotation>

<!-- Connected via association -->
<bpmn:association id="Association_1"
    sourceRef="TextAnnotation_1"
    targetRef="Task_Approve"
    associationDirection="None" />
```

---

## 6. Data Associations

### 6.1 Data Input Association

Shows data flowing into an activity.

```xml
<bpmn:task id="Task_Process" name="Process Order">
  <bpmn:dataInputAssociation id="DataInputAssociation_1">
    <bpmn:sourceRef>DataObjectRef_Order</bpmn:sourceRef>
    <bpmn:targetRef>Property_Input</bpmn:targetRef>
  </bpmn:dataInputAssociation>
</bpmn:task>
```

**Visual:** Dotted line with arrow pointing TO the activity.

### 6.2 Data Output Association

Shows data flowing out of an activity.

```xml
<bpmn:task id="Task_Process" name="Create Invoice">
  <bpmn:dataOutputAssociation id="DataOutputAssociation_1">
    <bpmn:sourceRef>Property_Output</bpmn:sourceRef>
    <bpmn:targetRef>DataObjectRef_Invoice</bpmn:targetRef>
  </bpmn:dataOutputAssociation>
</bpmn:task>
```

**Visual:** Dotted line with arrow pointing FROM the activity to data object.

---

## 7. TypeScript Interfaces

```typescript
// Data Object Types
type DataObjectType = 'dataObject' | 'dataInput' | 'dataOutput';

// Data Object
interface BPMNDataObject {
  id: string;
  name?: string;
  isCollection: boolean;
}

// Data Object Reference
interface BPMNDataObjectReference {
  id: string;
  name?: string;
  dataObjectRef: string;
  dataState?: string;
}

// Data Store
interface BPMNDataStore {
  id: string;
  name?: string;
  capacity?: string | number;
  isUnlimited?: boolean;
}

// Data Store Reference
interface BPMNDataStoreReference {
  id: string;
  name?: string;
  dataStoreRef: string;
}

// Group
interface BPMNGroup {
  id: string;
  categoryValueRef?: string;
}

// Category (for groups)
interface BPMNCategory {
  id: string;
  name?: string;
  categoryValue: BPMNCategoryValue[];
}

interface BPMNCategoryValue {
  id: string;
  value: string;
}

// Text Annotation
interface BPMNTextAnnotation {
  id: string;
  text: string;
  textFormat?: string; // default: "text/plain"
}

// Data Association
interface BPMNDataAssociation {
  id: string;
  sourceRef: string;
  targetRef: string;
  transformation?: string;
}

// Visual Shapes
interface ArtifactShape {
  artifactId: string;
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
```

---

## 8. React Component Structure

```typescript
// Artifact Components
<ArtifactLayer>
  {/* Data Objects */}
  <DataObjectComponent
    id={dataObject.id}
    name={dataObject.name}
    isCollection={dataObject.isCollection}
    dataState={dataObject.dataState}
    type="dataObject"  // or "dataInput" | "dataOutput"
  >
    <DataObjectIcon type={type} isCollection={isCollection} />
    <DataObjectLabel name={name} state={dataState} />
  </DataObjectComponent>

  {/* Data Stores */}
  <DataStoreComponent
    id={dataStore.id}
    name={dataStore.name}
  >
    <DataStoreIcon />
    <DataStoreLabel name={name} />
  </DataStoreComponent>

  {/* Groups */}
  <GroupComponent
    id={group.id}
    label={categoryValue}
    bounds={bounds}
  >
    <GroupBorder />
    <GroupLabel text={label} />
  </GroupComponent>

  {/* Text Annotations */}
  <TextAnnotationComponent
    id={annotation.id}
    text={annotation.text}
  >
    <AnnotationBracket />
    <AnnotationText text={text} />
  </TextAnnotationComponent>
</ArtifactLayer>

// Data Associations (in connector layer)
<DataAssociationLayer>
  <DataAssociation
    sourceRef={source}
    targetRef={target}
    waypoints={waypoints}
    direction="input" // or "output"
  />
</DataAssociationLayer>
```

---

## 9. Styling Specifications

### 9.1 Data Object Styles

```css
.bpmn-data-object {
  stroke: #000000;
  stroke-width: 1.5px;
  fill: #FFFFFF;
}

.bpmn-data-object.selected {
  stroke: #1976D2;
  stroke-width: 2px;
}

.bpmn-data-object-label {
  font-family: Arial, sans-serif;
  font-size: 11px;
  text-anchor: middle;
  fill: #000000;
}

.bpmn-data-object-state {
  font-size: 10px;
  font-style: italic;
}

.bpmn-data-collection-marker {
  stroke: #000000;
  stroke-width: 1px;
}
```

### 9.2 Data Store Styles

```css
.bpmn-data-store {
  stroke: #000000;
  stroke-width: 1.5px;
  fill: #FFFFFF;
}

.bpmn-data-store.selected {
  stroke: #1976D2;
  stroke-width: 2px;
}

.bpmn-data-store-label {
  font-family: Arial, sans-serif;
  font-size: 11px;
  text-anchor: middle;
  fill: #000000;
}
```

### 9.3 Group Styles

```css
.bpmn-group {
  stroke: #000000;
  stroke-width: 1.5px;
  stroke-dasharray: 8 4;
  fill: none;
  rx: 10px;
  ry: 10px;
}

.bpmn-group.selected {
  stroke: #1976D2;
  stroke-width: 2px;
}

.bpmn-group-label {
  font-family: Arial, sans-serif;
  font-size: 12px;
  font-weight: bold;
  fill: #000000;
}
```

### 9.4 Text Annotation Styles

```css
.bpmn-text-annotation {
  stroke: #000000;
  stroke-width: 1px;
  fill: none;
}

.bpmn-text-annotation.selected {
  stroke: #1976D2;
}

.bpmn-annotation-text {
  font-family: Arial, sans-serif;
  font-size: 11px;
  fill: #000000;
  line-height: 1.4;
}
```

---

## 10. Validation Rules

### 10.1 Data Object Rules

| Rule | Description |
|------|-------------|
| Unique ID | Each data object must have unique identifier |
| Reference Required | DataObjectReference must reference a DataObject |
| State Optional | Data state is informational only |
| Association | Must connect via data association, not sequence flow |

### 10.2 Data Store Rules

| Rule | Description |
|------|-------------|
| Process Scope | Can be referenced across process instances |
| Persistence | Represents persistent storage |
| Association | Must connect via data association |

### 10.3 Group Rules

| Rule | Description |
|------|-------------|
| Non-Container | Does not contain elements semantically |
| Cross-Lane | Can span multiple lanes in same pool |
| No Cross-Pool | Cannot span across pools |
| Documentation | Purely visual/documentation purpose |

### 10.4 Text Annotation Rules

| Rule | Description |
|------|-------------|
| Association Required | Should be connected to element via association |
| No Flow Impact | Does not affect process execution |
| Text Required | Must contain text content |

---

## 11. Artifact Summary Table

| Feature | Data Object | Data Store | Group | Text Annotation |
|---------|-------------|------------|-------|-----------------|
| Affects Flow | No | No | No | No |
| Connection Type | Data Association | Data Association | None | Association |
| Has Label | Yes | Yes | Optional | N/A (is text) |
| Resizable | No | No | Yes | Yes |
| Can Have State | Yes | No | No | No |
| Collection Support | Yes | No | No | No |
| Z-Index | Above connectors | Above connectors | Below flow objects | Above all |

---

## 12. Implementation Notes

### 12.1 Data Object Creation

```typescript
function createDataObject(
  name: string,
  position: Point,
  isCollection: boolean = false
): { dataObject: BPMNDataObject; reference: BPMNDataObjectReference; shape: ArtifactShape } {
  const objectId = generateId('DataObject');
  const refId = generateId('DataObjectReference');

  return {
    dataObject: {
      id: objectId,
      name,
      isCollection
    },
    reference: {
      id: refId,
      name,
      dataObjectRef: objectId
    },
    shape: {
      artifactId: refId,
      bounds: {
        x: position.x,
        y: position.y,
        width: 36,
        height: 50
      }
    }
  };
}
```

### 12.2 Text Annotation Sizing

```typescript
function calculateAnnotationSize(text: string): { width: number; height: number } {
  const lines = text.split('\n');
  const lineHeight = 16;
  const charWidth = 7;
  const padding = 30; // left bracket + padding

  const maxLineLength = Math.max(...lines.map(l => l.length));

  return {
    width: Math.max(100, maxLineLength * charWidth + padding),
    height: Math.max(30, lines.length * lineHeight + 10)
  };
}
```

---

*BPMN 2.0 Artifacts Specification | React BPMN Editor*
