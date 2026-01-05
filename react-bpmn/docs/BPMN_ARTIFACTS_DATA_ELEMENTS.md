# BPMN 2.0 Artifacts and Data Elements - Comprehensive Specification

## Overview

BPMN 2.0 artifacts and data elements are critical components for modeling data flow and providing contextual information in business process diagrams. This specification provides detailed information for implementing these elements as React components.

**Sources:** ISO/IEC 19510:2013 (BPMN 2.0 specification), OMG BPMN 2.0, bpmn-moddle, and bpmn.io community resources.

---

## Part 1: ARTIFACTS

Artifacts are elements that provide additional context and information to a process model without directly affecting the sequence flow.

### 1.1 Data Objects

Data Objects represent information created, manipulated, or used during process execution.

#### 1.1.1 Single Data Object

**Definition:** A data object represents a single piece of information flowing through the process.

**Visual Representation:**
```
┌─────────────────┐
│   Data Object   │
│   (Name)        │
│                 │
└─────────────────┘
```

**XML Structure:**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL"
             xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
             xmlns:dc="http://www.omg.org/spec/DD/20100524/DC"
             xmlns:di="http://www.omg.org/spec/DD/20100524/DI">

  <process id="Process_1" name="MyProcess" isExecutable="false">
    <!-- Data Object Definition -->
    <dataObject id="DataObject_1" name="Purchase Order" itemSubjectRef="ItemDefinition_1"/>

    <!-- Example: Using data object in a task -->
    <task id="Task_1" name="Review Order">
      <incoming>Flow_1</incoming>
      <outgoing>Flow_2</outgoing>
      <dataOutputAssociation id="DataOutputAssociation_1">
        <sourceRef>Task_1</sourceRef>
        <targetRef>DataObject_1</targetRef>
      </dataOutputAssociation>
    </task>
  </process>

  <!-- Item Definition for type -->
  <itemDefinition id="ItemDefinition_1" name="PurchaseOrder"
                  structureRef="xs:string"/>

  <!-- Diagram Interchange Information -->
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">
      <bpmndi:BPMNShape id="DataObject_1_di" bpmnElement="DataObject_1">
        <dc:Bounds x="150" y="100" width="100" height="80"/>
      </bpmndi:BPMNShape>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</definitions>
```

**React Component Properties:**
```typescript
interface DataObject {
  id: string;
  name: string;
  itemSubjectRef?: string;        // Reference to ItemDefinition
  x: number;                       // Canvas X position
  y: number;                       // Canvas Y position
  width: number;                   // Default 100
  height: number;                  // Default 80
  state?: DataObjectState;         // Optional state
  isCollection?: boolean;          // False for single objects
}

interface DataObjectState {
  id: string;
  name: string;
}
```

**Key Attributes:**
- `id`: Unique identifier
- `name`: Display name for the data object
- `itemSubjectRef`: Reference to ItemDefinition specifying data type
- `state`: Optional state representing lifecycle (pending, completed, deleted, etc.)

---

#### 1.1.2 Data Object Collections

**Definition:** A collection represents multiple instances of the same data type (e.g., list of items, array).

**Visual Representation:**
```
┌─────────────────┐
│  Order Items    │
│  (Collection)   │
├─────────────────┤
│ ═ ═ ═ ═ ═ ═ ═ ═ │  <- Collection marker (3 lines)
└─────────────────┘
```

**XML Structure:**
```xml
<itemDefinition id="ItemDefinition_OrderItems" name="OrderItem"
                structureRef="xs:string" isCollection="true"/>

<process id="Process_1">
  <!-- Collection Data Object -->
  <dataObject id="DataObject_OrderItems" name="Order Items"
              itemSubjectRef="ItemDefinition_OrderItems"
              isCollection="true"/>

  <!-- Alternative: Using Data Object Reference -->
  <dataObjectReference id="DataObjectReference_1"
                      dataObjectRef="DataObject_OrderItems"
                      name="Selected Items"/>
</process>

<!-- Diagram element for collection -->
<bpmndi:BPMNShape id="DataObject_OrderItems_di" bpmnElement="DataObject_OrderItems">
  <dc:Bounds x="200" y="150" width="100" height="80"/>
  <!-- Collection marker shown in rendering -->
  <bpmndi:BPMNLabel>
    <dc:Bounds x="200" y="230" width="100" height="40"/>
  </bpmndi:BPMNLabel>
</bpmndi:BPMNShape>
```

**React Component Properties:**
```typescript
interface DataObjectCollection extends DataObject {
  isCollection: true;
  itemType?: string;              // Type of items in collection
  capacity?: number;              // Optional capacity limit
}
```

**Rendering Notes:**
- Draw a marker at the bottom (3 horizontal lines) when `isCollection="true"`
- Visual distinction from single data objects is critical
- Collection marker should be proportional to the data object size

---

### 1.2 Data Stores

**Definition:** A Data Store represents persistent storage that outlasts the process instance. It can be accessed by multiple processes and persists data beyond a single process execution.

**Use Cases:**
- Databases
- File systems
- Archives
- Enterprise systems
- Document management systems

**Visual Representation:**
```
┌─────────────────┐
│   Database      │
├─────────────────┤
│   [Data Store]  │
├─────────────────┤
│  (Name)         │
└─────────────────┘
```

**XML Structure:**
```xml
<definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL">

  <!-- Global Data Store Definition -->
  <dataStore id="DataStore_CustomerDB" name="Customer Database"
             capacity="999999" isUnlimited="true"
             itemSubjectRef="ItemDefinition_Customer"/>

  <process id="Process_1">
    <!-- Data Store Reference in Process -->
    <dataStoreReference id="DataStoreReference_1"
                       dataStoreRef="DataStore_CustomerDB"
                       name="Customer DB"/>

    <!-- Task with Data Store Association -->
    <task id="Task_RetrieveCustomer" name="Retrieve Customer Data">
      <incoming>Flow_1</incoming>
      <outgoing>Flow_2</outgoing>

      <!-- Read from data store -->
      <dataInputAssociation id="DataInputAssociation_1">
        <sourceRef>DataStoreReference_1</sourceRef>
        <targetRef>Task_RetrieveCustomer</targetRef>
      </dataInputAssociation>

      <!-- Write to data store -->
      <dataOutputAssociation id="DataOutputAssociation_1">
        <sourceRef>Task_RetrieveCustomer</sourceRef>
        <targetRef>DataStoreReference_1</targetRef>
      </dataOutputAssociation>
    </task>
  </process>

  <itemDefinition id="ItemDefinition_Customer" name="Customer"
                  structureRef="xs:string"/>

  <!-- Diagram Information -->
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">
      <!-- Data Store Reference Shape -->
      <bpmndi:BPMNShape id="DataStoreReference_1_di"
                       bpmnElement="DataStoreReference_1">
        <dc:Bounds x="300" y="150" width="100" height="80"/>
      </bpmndi:BPMNShape>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</definitions>
```

**React Component Properties:**
```typescript
interface DataStore {
  id: string;
  name: string;
  capacity?: number;              // Storage capacity
  isUnlimited?: boolean;          // Default: false
  itemSubjectRef?: string;        // Type of items stored
  x: number;
  y: number;
  width: number;                  // Default 100
  height: number;                 // Default 80
}

interface DataStoreReference {
  id: string;
  name: string;
  dataStoreRef: string;           // Reference to DataStore
  x: number;
  y: number;
  width: number;
  height: number;
}
```

**Key Differences from Data Objects:**
| Aspect | Data Object | Data Store |
|--------|------------|-----------|
| Lifetime | Duration of process instance | Beyond process instance |
| Scope | Process instance only | Global across processes |
| Access | Single process instance | Multiple processes |
| Persistence | In-memory | Permanent storage |
| Definition | Within process | Global in definitions |

---

### 1.3 Groups (Visual Grouping)

**Definition:** Groups provide visual organization of diagram elements without affecting sequence flow. They are tied to CategoryValue supporting elements.

**Visual Representation:**
```
╭─────────────────────────────────────────╮
┆  Approval Process                       ┆
┆  ┌─────────────┐     ┌─────────────┐   ┆
┆  │ Task 1      │────→│ Task 2      │   ┆
┆  └─────────────┘     └─────────────┘   ┆
╰─────────────────────────────────────────╯
     (Dashed rounded rectangle)
```

**XML Structure:**
```xml
<definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL">

  <!-- Category Definition -->
  <category id="Category_1" name="Approval">
    <categoryValue id="CategoryValue_Approval" value="Approval Process"/>
  </category>

  <process id="Process_1" name="Loan Application">
    <task id="Task_1" name="Request Approval"/>
    <task id="Task_2" name="Reviewer Approval"/>

    <!-- Group Definition -->
    <group id="Group_1" categoryValueRef="CategoryValue_Approval" name="Approval Process"/>

    <!-- Sequence Flow -->
    <sequenceFlow id="Flow_1" sourceRef="Task_1" targetRef="Task_2"/>
  </process>

  <!-- Diagram Information -->
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">
      <!-- Group Shape - Dashed rounded rectangle -->
      <bpmndi:BPMNShape id="Group_1_di" bpmnElement="Group_1">
        <dc:Bounds x="100" y="50" width="400" height="200"/>
        <bpmndi:BPMNLabel>
          <dc:Bounds x="110" y="60" width="200" height="30"/>
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>

      <!-- Referenced Tasks -->
      <bpmndi:BPMNShape id="Task_1_di" bpmnElement="Task_1">
        <dc:Bounds x="120" y="100" width="100" height="80"/>
      </bpmndi:BPMNShape>

      <bpmndi:BPMNShape id="Task_2_di" bpmnElement="Task_2">
        <dc:Bounds x="320" y="100" width="100" height="80"/>
      </bpmndi:BPMNShape>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</definitions>
```

**React Component Properties:**
```typescript
interface Group {
  id: string;
  name: string;
  categoryValueRef: string;       // Reference to CategoryValue
  x: number;
  y: number;
  width: number;
  height: number;
  color?: string;                 // Optional: group color/style
  elements?: string[];            // Array of element IDs in group (visual tracking)
}

interface CategoryValue {
  id: string;
  value: string;
}

interface Category {
  id: string;
  name: string;
  categoryValues: CategoryValue[];
}
```

**Rendering Characteristics:**
- Dashed border (typically 2-3px dash)
- Rounded corners (8-12px radius)
- Semi-transparent fill (5-10% opacity)
- Contained elements visible on top
- Can span multiple pools/lanes
- No effect on sequence flow

**Use Cases:**
- Highlighting approval phases
- Organizing by department
- Showing parallel work streams
- Documentation grouping
- Risk area identification

---

### 1.4 Text Annotations

**Definition:** Text Annotations are notes that provide additional context to elements or the entire process. They are shown directly on the diagram connected via associations.

**Visual Representation:**
```
Process Element    ┈┈┈┈┈┈┈┈┈┈┈┈┈┈    ┌──────────────────┐
     [TASK]        ┈ Association ┈───→│ This is a note    │
                                       │ explaining the    │
                                       │ task behavior     │
                                       └──────────────────┘
                   (Open rectangle with dotted line connector)
```

**XML Structure:**
```xml
<definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL">

  <process id="Process_1">
    <!-- Task Element -->
    <task id="Task_1" name="Complex Calculation"/>

    <!-- Text Annotation -->
    <textAnnotation id="TextAnnotation_1">
      <text>This task calculates the total amount based on items in the cart, applying discounts and taxes according to the current business rules.</text>
    </textAnnotation>

    <!-- Association linking annotation to element -->
    <association id="Association_1" sourceRef="Task_1"
                 targetRef="TextAnnotation_1" associationDirection="One"/>
  </process>

  <!-- Diagram Information -->
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">

      <!-- Task Shape -->
      <bpmndi:BPMNShape id="Task_1_di" bpmnElement="Task_1">
        <dc:Bounds x="150" y="100" width="100" height="80"/>
      </bpmndi:BPMNShape>

      <!-- Text Annotation Shape -->
      <bpmndi:BPMNShape id="TextAnnotation_1_di" bpmnElement="TextAnnotation_1">
        <dc:Bounds x="350" y="80" width="200" height="120"/>
        <bpmndi:BPMNLabel>
          <dc:Bounds x="350" y="80" width="200" height="120"/>
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>

      <!-- Association Edge -->
      <bpmndi:BPMNEdge id="Association_1_di" bpmnElement="Association_1">
        <di:waypoint x="250" y="140"/>
        <di:waypoint x="350" y="140"/>
      </bpmndi:BPMNEdge>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</definitions>
```

**React Component Properties:**
```typescript
interface TextAnnotation {
  id: string;
  text: string;
  x: number;
  y: number;
  width: number;                  // Default 200
  height: number;                 // Default 100
  textFormat?: 'plain' | 'html';  // Default: plain
}

interface Association {
  id: string;
  sourceRef: string;              // Element ID
  targetRef: string;              // TextAnnotation or Data element ID
  associationDirection?: 'One' | 'Both' | 'None'; // Default: None
}
```

**Rendering Characteristics:**
- Open rectangle (not filled)
- Solid border (1-2px)
- Text wrapped within bounds
- Connected via dotted association line
- Typically positioned right/below source element
- Text typically left-aligned with padding

**Association Directions:**
- `None`: No arrow (default for annotations)
- `One`: Single arrow pointing to target
- `Both`: Bidirectional arrows

---

## Part 2: DATA ELEMENTS

Data Elements are constructs that manage the flow and type of information through a process.

### 2.1 Data Input/Output

**Definition:** Data Inputs specify required information for an activity/process. Data Outputs represent results produced by completion.

#### 2.1.1 Process-Level Data Input/Output

**XML Structure:**
```xml
<definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL">

  <!-- Item Definitions -->
  <itemDefinition id="ItemDefinition_OrderData" name="OrderData"
                  structureRef="xs:string"/>
  <itemDefinition id="ItemDefinition_ProcessResult" name="ProcessResult"
                  structureRef="xs:string"/>

  <process id="Process_1" name="Order Processing" isExecutable="true">

    <!-- Input Specification -->
    <ioSpecification id="IOSpec_1">
      <!-- Data Inputs -->
      <dataInput id="DataInput_Order" name="Order Information"
                itemSubjectRef="ItemDefinition_OrderData"/>
      <dataInput id="DataInput_CustomerData" name="Customer Data"
                itemSubjectRef="ItemDefinition_OrderData"/>

      <!-- Data Outputs -->
      <dataOutput id="DataOutput_Invoice" name="Invoice"
                 itemSubjectRef="ItemDefinition_ProcessResult"/>
      <dataOutput id="DataOutput_ShipmentConfirm" name="Shipment Confirmation"
                 itemSubjectRef="ItemDefinition_ProcessResult"/>

      <!-- Input Sets -->
      <inputSet id="InputSet_1">
        <dataInputRefs>DataInput_Order</dataInputRefs>
        <dataInputRefs>DataInput_CustomerData</dataInputRefs>
      </inputSet>

      <!-- Output Sets -->
      <outputSet id="OutputSet_1">
        <dataOutputRefs>DataOutput_Invoice</dataOutputRefs>
        <dataOutputRefs>DataOutput_ShipmentConfirm</dataOutputRefs>
      </outputSet>
    </ioSpecification>

    <!-- Tasks -->
    <task id="Task_ProcessOrder" name="Process Order"/>

    <!-- Task Input/Output Specification -->
    <task id="Task_CreateInvoice" name="Create Invoice">
      <ioSpecification id="IOSpec_Task_1">
        <dataInput id="DataInput_Task_OrderTotal" name="Order Total"
                  itemSubjectRef="ItemDefinition_OrderData"/>
        <dataOutput id="DataOutput_Task_Invoice" name="Invoice Document"
                   itemSubjectRef="ItemDefinition_ProcessResult"/>

        <inputSet id="InputSet_Task_1">
          <dataInputRefs>DataInput_Task_OrderTotal</dataInputRefs>
        </inputSet>

        <outputSet id="OutputSet_Task_1">
          <dataOutputRefs>DataOutput_Task_Invoice</dataOutputRefs>
        </outputSet>
      </ioSpecification>

      <!-- Data Association: Map process data to task input -->
      <dataInputAssociation id="DataInputAssoc_1">
        <sourceRef>DataInput_Order</sourceRef>
        <targetRef>DataInput_Task_OrderTotal</targetRef>
        <transformation id="Transform_1">
          <body>calculateTotal(order)</body>
        </transformation>
      </dataInputAssociation>

      <!-- Data Association: Map task output to process data -->
      <dataOutputAssociation id="DataOutputAssoc_1">
        <sourceRef>DataOutput_Task_Invoice</sourceRef>
        <targetRef>DataOutput_Invoice</targetRef>
      </dataOutputAssociation>
    </task>

    <!-- Incoming data association from external source -->
    <dataInputAssociation id="DataInputAssoc_ProcessLevel_1">
      <sourceRef>startEvent_trigger</sourceRef>
      <targetRef>DataInput_Order</targetRef>
    </dataInputAssociation>
  </process>
</definitions>
```

#### 2.1.2 Task-Level Data Input/Output

**XML Structure:**
```xml
<task id="Task_ReviewOrder" name="Review Order">
  <incoming>Flow_1</incoming>
  <outgoing>Flow_2</outgoing>

  <ioSpecification id="IOSpec_ReviewTask">
    <!-- Inputs needed for task -->
    <dataInput id="DI_Order" name="Order to Review"
              itemSubjectRef="ItemDefinition_Order"/>
    <dataInput id="DI_CustomerProfile" name="Customer Profile"
              itemSubjectRef="ItemDefinition_Customer"/>

    <!-- Outputs produced by task -->
    <dataOutput id="DO_ReviewResult" name="Review Result"
               itemSubjectRef="ItemDefinition_ReviewDecision"/>
    <dataOutput id="DO_RiskAssessment" name="Risk Assessment"
               itemSubjectRef="ItemDefinition_RiskLevel"/>

    <!-- Define input/output sets -->
    <inputSet id="InputSet_Review">
      <dataInputRefs>DI_Order</dataInputRefs>
      <dataInputRefs>DI_CustomerProfile</dataInputRefs>
    </inputSet>

    <outputSet id="OutputSet_Review">
      <dataOutputRefs>DO_ReviewResult</dataOutputRefs>
      <dataOutputRefs>DO_RiskAssessment</dataOutputRefs>
    </outputSet>
  </ioSpecification>

  <!-- Map incoming data to task inputs -->
  <dataInputAssociation id="DIA_Order">
    <sourceRef>DataObject_PendingOrder</sourceRef>
    <targetRef>DI_Order</targetRef>
  </dataInputAssociation>

  <dataInputAssociation id="DIA_Customer">
    <sourceRef>DataStore_CustomerDB</sourceRef>
    <targetRef>DI_CustomerProfile</targetRef>
    <transformation id="Transform_Filter">
      <body>getCustomerById(order.customerId)</body>
    </transformation>
  </dataInputAssociation>

  <!-- Map task outputs to target locations -->
  <dataOutputAssociation id="DAO_Result">
    <sourceRef>DO_ReviewResult</sourceRef>
    <targetRef>DataObject_ReviewDecision</targetRef>
  </dataOutputAssociation>

  <dataOutputAssociation id="DAO_Risk">
    <sourceRef>DO_RiskAssessment</sourceRef>
    <targetRef>DataStore_RiskRegistry</targetRef>
  </dataOutputAssociation>
</task>
```

**React Component Properties:**
```typescript
interface DataInput {
  id: string;
  name: string;
  itemSubjectRef: string;         // Reference to ItemDefinition
  isCollection?: boolean;
  optional?: boolean;
}

interface DataOutput {
  id: string;
  name: string;
  itemSubjectRef: string;
  isCollection?: boolean;
}

interface IOSpecification {
  id: string;
  dataInputs: DataInput[];
  dataOutputs: DataOutput[];
  inputSets: InputSet[];
  outputSets: OutputSet[];
}

interface InputSet {
  id: string;
  dataInputRefs: string[];        // Array of DataInput IDs
}

interface OutputSet {
  id: string;
  dataOutputRefs: string[];       // Array of DataOutput IDs
}

interface DataInputAssociation {
  id: string;
  sourceRef: string;              // Source element ID
  targetRef: string;              // Target DataInput ID
  transformation?: Transformation;
}

interface DataOutputAssociation {
  id: string;
  sourceRef: string;              // Source DataOutput ID
  targetRef: string;              // Target element ID
  transformation?: Transformation;
}

interface Transformation {
  id: string;
  body: string;                   // Expression or formula
}
```

---

### 2.2 Data Object References

**Definition:** Data Object References allow reusing the same Data Object definition at different points in a process, representing different states.

**Use Case:** An order document that moves through states: "pending" → "approved" → "shipped" → "delivered"

**XML Structure:**
```xml
<definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL">

  <!-- Item Definition -->
  <itemDefinition id="ItemDefinition_Order" name="Order"
                  structureRef="xs:string"/>

  <process id="Process_1" name="Order Fulfillment">

    <!-- Single Data Object Definition -->
    <dataObject id="DataObject_Order" name="Order"
               itemSubjectRef="ItemDefinition_Order">
      <!-- State Definitions -->
      <dataState id="DataState_Pending" name="pending"/>
      <dataState id="DataState_Approved" name="approved"/>
      <dataState id="DataState_Shipped" name="shipped"/>
      <dataState id="DataState_Delivered" name="delivered"/>
    </dataObject>

    <!-- Multiple References to Same Object at Different States -->

    <!-- Reference 1: Initial state -->
    <dataObjectReference id="DataObjectRef_PendingOrder"
                        dataObjectRef="DataObject_Order"
                        name="Pending Order"
                        state="pending"/>

    <!-- Reference 2: After approval -->
    <dataObjectReference id="DataObjectRef_ApprovedOrder"
                        dataObjectRef="DataObject_Order"
                        name="Approved Order"
                        state="approved"/>

    <!-- Reference 3: After shipment -->
    <dataObjectReference id="DataObjectRef_ShippedOrder"
                        dataObjectRef="DataObject_Order"
                        name="Shipped Order"
                        state="shipped"/>

    <!-- Reference 4: Final state -->
    <dataObjectReference id="DataObjectRef_DeliveredOrder"
                        dataObjectRef="DataObject_Order"
                        name="Delivered Order"
                        state="delivered"/>

    <!-- Process Flow -->
    <task id="Task_Approve" name="Approve Order">
      <dataOutputAssociation id="DAO_ApprovedOrder">
        <sourceRef>Task_Approve</sourceRef>
        <targetRef>DataObjectRef_ApprovedOrder</targetRef>
      </dataOutputAssociation>
    </task>

    <task id="Task_Ship" name="Ship Order">
      <dataInputAssociation id="DIA_ShipApproved">
        <sourceRef>DataObjectRef_ApprovedOrder</sourceRef>
        <targetRef>Task_Ship</targetRef>
      </dataInputAssociation>
      <dataOutputAssociation id="DAO_ShippedOrder">
        <sourceRef>Task_Ship</sourceRef>
        <targetRef>DataObjectRef_ShippedOrder</targetRef>
      </dataOutputAssociation>
    </task>

    <task id="Task_Deliver" name="Deliver Order">
      <dataInputAssociation id="DIA_DeliverShipped">
        <sourceRef>DataObjectRef_ShippedOrder</sourceRef>
        <targetRef>Task_Deliver</targetRef>
      </dataInputAssociation>
      <dataOutputAssociation id="DAO_DeliveredOrder">
        <sourceRef>Task_Deliver</sourceRef>
        <targetRef>DataObjectRef_DeliveredOrder</targetRef>
      </dataOutputAssociation>
    </task>
  </process>

  <!-- Diagram Information -->
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">

      <!-- Visual representation of same object at different states -->
      <bpmndi:BPMNShape id="DataObjectRef_PendingOrder_di"
                       bpmnElement="DataObjectRef_PendingOrder">
        <dc:Bounds x="150" y="100" width="100" height="80"/>
        <bpmndi:BPMNLabel>
          <dc:Bounds x="150" y="180" width="100" height="20"/>
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>

      <bpmndi:BPMNShape id="DataObjectRef_ApprovedOrder_di"
                       bpmnElement="DataObjectRef_ApprovedOrder">
        <dc:Bounds x="350" y="100" width="100" height="80"/>
        <bpmndi:BPMNLabel>
          <dc:Bounds x="350" y="180" width="100" height="20"/>
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>

      <bpmndi:BPMNShape id="DataObjectRef_ShippedOrder_di"
                       bpmnElement="DataObjectRef_ShippedOrder">
        <dc:Bounds x="550" y="100" width="100" height="80"/>
        <bpmndi:BPMNLabel>
          <dc:Bounds x="550" y="180" width="100" height="20"/>
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>

      <bpmndi:BPMNShape id="DataObjectRef_DeliveredOrder_di"
                       bpmnElement="DataObjectRef_DeliveredOrder">
        <dc:Bounds x="750" y="100" width="100" height="80"/>
        <bpmndi:BPMNLabel>
          <dc:Bounds x="750" y="180" width="100" height="20"/>
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>

      <!-- Show all references to same underlying object -->
      <bpmndi:BPMNEdge id="DataFlow_1" bpmnElement="DAO_ApprovedOrder">
        <di:waypoint x="250" y="140"/>
        <di:waypoint x="350" y="140"/>
      </bpmndi:BPMNEdge>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</definitions>
```

**React Component Properties:**
```typescript
interface DataObjectReference {
  id: string;
  name: string;
  dataObjectRef: string;          // ID of referenced DataObject
  x: number;
  y: number;
  width: number;
  height: number;
  state?: string;                 // State name from DataObject states
}

interface DataObjectState {
  id: string;
  name: string;
}

// Enhanced DataObject with states
interface DataObject {
  id: string;
  name: string;
  itemSubjectRef: string;
  states: DataObjectState[];      // Lifecycle states
  isCollection?: boolean;
}
```

**Key Benefit:** Multiple references show the same data object flowing through different states without duplication.

---

### 2.3 Data Store References

**Definition:** Data Store References are used within a process to reference globally defined Data Stores, enabling read/write operations.

**XML Structure:**
```xml
<definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL">

  <!-- Global Data Store Definitions -->
  <dataStore id="DataStore_InventoryDB" name="Inventory Database"
            capacity="100000" isUnlimited="false"
            itemSubjectRef="ItemDefinition_InventoryItem"/>

  <dataStore id="DataStore_CustomerDB" name="Customer Database"
            capacity="999999" isUnlimited="true"
            itemSubjectRef="ItemDefinition_Customer"/>

  <itemDefinition id="ItemDefinition_InventoryItem" name="InventoryItem"
                  structureRef="xs:string"/>
  <itemDefinition id="ItemDefinition_Customer" name="Customer"
                  structureRef="xs:string"/>

  <process id="Process_OrderFulfillment">

    <!-- Data Store References in Process -->
    <dataStoreReference id="DataStoreRef_Inventory"
                       dataStoreRef="DataStore_InventoryDB"
                       name="Inventory"/>

    <dataStoreReference id="DataStoreRef_Customer"
                       dataStoreRef="DataStore_CustomerDB"
                       name="Customer Information"/>

    <!-- Task: Read from inventory -->
    <task id="Task_CheckInventory" name="Check Stock Level">
      <incoming>Flow_1</incoming>
      <outgoing>Flow_2</outgoing>

      <!-- Read operation -->
      <dataInputAssociation id="DIA_ReadInventory">
        <sourceRef>DataStoreRef_Inventory</sourceRef>
        <targetRef>Task_CheckInventory</targetRef>
        <transformation id="Transform_QueryStock">
          <body>SELECT quantity FROM inventory WHERE productId = ?</body>
        </transformation>
      </dataInputAssociation>

      <dataOutputAssociation id="DAO_UpdateInventory">
        <sourceRef>Task_CheckInventory</sourceRef>
        <targetRef>DataStoreRef_Inventory</targetRef>
        <transformation id="Transform_UpdateStock">
          <body>UPDATE inventory SET quantity = quantity - orderQty WHERE productId = ?</body>
        </transformation>
      </dataOutputAssociation>
    </task>

    <!-- Task: Read from customer database -->
    <task id="Task_ValidateCustomer" name="Validate Customer">
      <incoming>Flow_3</incoming>
      <outgoing>Flow_4</outgoing>

      <!-- Read customer data -->
      <dataInputAssociation id="DIA_ReadCustomer">
        <sourceRef>DataStoreRef_Customer</sourceRef>
        <targetRef>Task_ValidateCustomer</targetRef>
        <transformation id="Transform_GetCustomer">
          <body>SELECT * FROM customers WHERE customerId = ?</body>
        </transformation>
      </dataInputAssociation>
    </task>

    <!-- Data objects for intermediate storage -->
    <dataObject id="DataObject_StockLevel" name="Current Stock"
               itemSubjectRef="ItemDefinition_InventoryItem"/>
  </process>

  <!-- Diagram Information -->
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_OrderFulfillment">

      <!-- Data Store References are displayed as database symbols -->
      <bpmndi:BPMNShape id="DataStoreRef_Inventory_di"
                       bpmnElement="DataStoreRef_Inventory">
        <dc:Bounds x="300" y="50" width="100" height="80"/>
      </bpmndi:BPMNShape>

      <bpmndi:BPMNShape id="DataStoreRef_Customer_di"
                       bpmnElement="DataStoreRef_Customer">
        <dc:Bounds x="300" y="200" width="100" height="80"/>
      </bpmndi:BPMNShape>

      <!-- Tasks -->
      <bpmndi:BPMNShape id="Task_CheckInventory_di"
                       bpmnElement="Task_CheckInventory">
        <dc:Bounds x="120" y="50" width="100" height="80"/>
      </bpmndi:BPMNShape>

      <!-- Association Lines -->
      <bpmndi:BPMNEdge id="DIA_ReadInventory_di" bpmnElement="DIA_ReadInventory">
        <di:waypoint x="220" y="90"/>
        <di:waypoint x="300" y="90"/>
      </bpmndi:BPMNEdge>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</definitions>
```

**React Component Properties:**
```typescript
interface DataStoreReference {
  id: string;
  name: string;
  dataStoreRef: string;           // Reference to global DataStore
  x: number;
  y: number;
  width: number;
  height: number;
}

interface DataAssociationContext {
  sourceRef: string;              // Source element
  targetRef: string;              // Target element
  type: 'read' | 'write' | 'bidirectional';
  transformation?: {
    id: string;
    body: string;               // SQL, expression, etc.
  };
}
```

**Rendering Characteristics:**
- Displayed as database cylinder/barrel shape
- Can have multiple references to same store
- Show data flow with association lines
- Optional transformation expressions shown on edges

---

### 2.4 Properties

**Definition:** Properties are data objects that are part of a process or activity scope, similar to variables in programming.

**Characteristics:**
- Belong to Process, SubProcess, or Activity
- Local scope within their container
- Typed through ItemDefinition
- Persist through activity lifecycle

**XML Structure:**
```xml
<definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL">

  <itemDefinition id="ItemDefinition_Integer" name="Integer"
                  structureRef="xs:int"/>
  <itemDefinition id="ItemDefinition_String" name="String"
                  structureRef="xs:string"/>
  <itemDefinition id="ItemDefinition_Boolean" name="Boolean"
                  structureRef="xs:boolean"/>

  <process id="Process_1" name="Purchase Request">

    <!-- Process-level Properties -->
    <property id="Property_RequestCount" name="Request Count"
             itemSubjectRef="ItemDefinition_Integer"/>
    <property id="Property_TotalAmount" name="Total Amount"
             itemSubjectRef="ItemDefinition_String"/>
    <property id="Property_IsApproved" name="Is Approved"
             itemSubjectRef="ItemDefinition_Boolean"/>

    <!-- Subprocess with its own properties -->
    <subProcess id="SubProcess_ApprovalLoop">
      <property id="Property_AttemptCount" name="Attempt Count"
               itemSubjectRef="ItemDefinition_Integer"/>
      <property id="Property_ApprovalReason" name="Reason for Decision"
               itemSubjectRef="ItemDefinition_String"/>
    </subProcess>

    <!-- Task with property references in associations -->
    <task id="Task_CalculateTotal" name="Calculate Total">
      <incoming>Flow_1</incoming>
      <outgoing>Flow_2</outgoing>

      <!-- Set property through data association -->
      <dataOutputAssociation id="DAO_SetTotal">
        <sourceRef>Task_CalculateTotal</sourceRef>
        <targetRef>Property_TotalAmount</targetRef>
      </dataOutputAssociation>
    </task>

    <!-- Task: Read property -->
    <task id="Task_ApprovalLogic" name="Apply Approval Logic">
      <dataInputAssociation id="DIA_ReadTotal">
        <sourceRef>Property_TotalAmount</sourceRef>
        <targetRef>Task_ApprovalLogic</targetRef>
      </dataInputAssociation>

      <!-- Set approval property -->
      <dataOutputAssociation id="DAO_SetApproved">
        <sourceRef>Task_ApprovalLogic</sourceRef>
        <targetRef>Property_IsApproved</targetRef>
      </dataOutputAssociation>
    </task>

    <!-- Gateway conditional flow based on property -->
    <exclusiveGateway id="Gateway_CheckApproval" name="Approved?">
      <incoming>Flow_3</incoming>
      <outgoing>Flow_Approved</outgoing>
      <outgoing>Flow_Rejected</outgoing>
    </exclusiveGateway>

    <sequenceFlow id="Flow_Approved" sourceRef="Gateway_CheckApproval"
                  targetRef="Task_ProcessRequest">
      <conditionExpression xsi:type="tFormalExpression">
        <![CDATA[Property_IsApproved == true]]>
      </conditionExpression>
    </sequenceFlow>
  </process>

  <!-- Diagram Information -->
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">
      <!-- Properties aren't directly rendered but affect process execution -->
      <!-- They are shown as variables in the process properties panel -->
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</definitions>
```

**React Component Properties:**
```typescript
interface Property {
  id: string;
  name: string;
  itemSubjectRef: string;         // Reference to ItemDefinition
  value?: any;                    // Optional initial value
  isReadonly?: boolean;
}

interface PropertyContainer {
  id: string;
  type: 'Process' | 'SubProcess' | 'Activity';
  properties: Property[];
}

// Usage in ItemAwareElements
interface ItemAwareElement {
  id: string;
  itemSubjectRef?: string;        // Reference to ItemDefinition
}
```

**Key Differences from Data Objects:**

| Aspect | Property | Data Object |
|--------|----------|-------------|
| Location | Within container | In process space |
| Scope | Container scope | Process scope |
| Visibility | Implicit/metadata | Explicit on diagram |
| Representation | Variables panel | Visual element |
| Persistence | During execution | Can persist via states |

---

## Part 3: ITEMDEFINITION (Supporting Element)

**Definition:** ItemDefinition defines the structure and type of data used by item-aware elements (Data Objects, Properties, Data Inputs, Data Outputs).

**XML Structure:**
```xml
<definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL"
             xmlns:xsd="http://www.w3.org/2001/XMLSchema">

  <!-- Simple Type -->
  <itemDefinition id="ItemDef_String" name="Text"
                  structureRef="xsd:string"/>

  <!-- Simple Type: Collection -->
  <itemDefinition id="ItemDef_StringList" name="List of Texts"
                  structureRef="xsd:string" isCollection="true"/>

  <!-- Complex Type with structure -->
  <itemDefinition id="ItemDef_Order" name="Order"
                  structureRef="tns:OrderType">
    <!-- Optional nested structure definition -->
  </itemDefinition>

  <!-- Enumeration -->
  <itemDefinition id="ItemDef_OrderStatus" name="Order Status"
                  structureRef="tns:OrderStatusEnum"/>

  <process id="Process_1">
    <!-- Usage -->
    <dataObject id="DO_Order" name="Customer Order"
               itemSubjectRef="ItemDef_Order"/>
  </process>
</definitions>
```

**Key Attributes:**
- `id`: Unique identifier
- `name`: Display name
- `structureRef`: Reference to data type (XSD type, custom type, etc.)
- `isCollection`: Whether it represents a collection

**React Component Properties:**
```typescript
interface ItemDefinition {
  id: string;
  name: string;
  structureRef: string;           // Data type reference
  isCollection?: boolean;
  properties?: PropertyDefinition[];
}

interface PropertyDefinition {
  name: string;
  type: string;
  required?: boolean;
}
```

---

## Summary Table: Element Relationships

```
ItemDefinition (Type System)
    ├── DataObject (Single/Collection)
    │   ├── DataObjectReference (Same object, different states)
    │   └── States (Lifecycle progression)
    ├── DataStore (Persistent global storage)
    │   └── DataStoreReference (Process-level reference)
    ├── Property (Scoped variable)
    ├── DataInput (Process/Task input)
    └── DataOutput (Process/Task output)

Artifacts (Visual/Contextual)
    ├── Data Objects & Stores (with associations)
    ├── Group (Visual organization)
    └── TextAnnotation (with associations)

Associations (Data Flow)
    ├── DataInputAssociation (Source to Target)
    ├── DataOutputAssociation (Source to Target)
    └── Association (Element to TextAnnotation)
```

---

## React Implementation Checklist

### Component Structure
- [ ] DataObject component (single & collection variants)
- [ ] DataStore and DataStoreReference components
- [ ] Group component with category support
- [ ] TextAnnotation component
- [ ] DataInput/Output specification renderer
- [ ] DataObjectReference with state tracking
- [ ] Property inspector/variables panel
- [ ] ItemDefinition type system

### Features
- [ ] Visual rendering of collection markers
- [ ] Association line rendering (dotted for annotations, solid for data)
- [ ] State management for data objects
- [ ] Data flow visualization
- [ ] Multi-instance/collection support
- [ ] Transformation expression editing
- [ ] Type validation based on ItemDefinition

### XML Serialization
- [ ] Parse BPMN XML to component props
- [ ] Generate valid BPMN XML from component state
- [ ] Support diagram interchange (dc/di)
- [ ] Validate associations and references
- [ ] Handle transformations and expressions

---

## References

Source materials for this specification:

1. [BPMN 2.0 Visual Paradigm Guide - Data Objects](https://www.visual-paradigm.com/guide/bpmn/how-to-use-data-objects-in-bpmn/)
2. [BPMN 2.0 Artifact Types - Visual Paradigm](https://www.visual-paradigm.com/guide/bpmn/bpmn-artifact-types-explained/)
3. [BPMN Artifacts & Data Objects Guide - ProcessMind](https://processmind.com/resources/docs/bpmn-building-blocks/artifacts)
4. [Camunda BPMN 2.0 Reference](https://camunda.com/bpmn/reference/)
5. [BPMN 2.0 Data Objects - BPM Tips](https://bpmtips.com/bpmn-miwg-demonstration-2018-nearly-everything-you-always-wanted-to-know-about-data-objects-but-were-afraid-to-ask/)
6. [BPMN Moddle - ItemDefinition Example](https://github.com/bpmn-io/bpmn-moddle/blob/main/test/fixtures/bpmn/itemDefinition-structureRef.part.bpmn)
7. [ISO/IEC 19510:2013 - Business Process Model and Notation](https://www.omg.org/spec/BPMN/2.0/)
8. [Data Modeling in BPMN - Cardanit Blog](https://www.cardanit.com/blog/data-modeling-in-bpmn-basics/)
9. [BPMN 2.0 Mystery: Process Data Input and Output - Method And Style](https://www.methodandstyle.com/blog/bpmn-2-0-mystery-process-datainput-and-dataoutput/)
10. [OMG BPMN 2.0 Specification PDF](https://www.omg.org/spec/BPMN/2.0/PDF/)
