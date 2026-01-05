# BPMN 2.0 Artifacts and Data Elements - XML Templates and Examples

Complete, copy-paste ready XML templates for all BPMN 2.0 artifacts and data elements.

---

## 1. Complete Process Template with All Artifacts

```xml
<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL"
             xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
             xmlns:dc="http://www.omg.org/spec/DD/20100524/DC"
             xmlns:di="http://www.omg.org/spec/DD/20100524/DI"
             xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
             targetNamespace="http://example.com/bpmn"
             id="Definitions_Complete">

  <!-- ===== ITEM DEFINITIONS (Type System) ===== -->

  <itemDefinition id="ItemDef_String" name="String" structureRef="xsd:string"/>
  <itemDefinition id="ItemDef_Integer" name="Integer" structureRef="xsd:integer"/>
  <itemDefinition id="ItemDef_Boolean" name="Boolean" structureRef="xsd:boolean"/>
  <itemDefinition id="ItemDef_Date" name="Date" structureRef="xsd:date"/>

  <!-- Collection types -->
  <itemDefinition id="ItemDef_StringList" name="String List"
                  structureRef="xsd:string" isCollection="true"/>
  <itemDefinition id="ItemDef_OrderList" name="Order List"
                  structureRef="xsd:string" isCollection="true"/>

  <!-- ===== DATA STORES (Global, Persistent) ===== -->

  <dataStore id="DataStore_CustomerDB" name="Customer Database"
             capacity="999999" isUnlimited="true"
             itemSubjectRef="ItemDef_String"/>

  <dataStore id="DataStore_InventoryDB" name="Inventory Database"
             capacity="100000" isUnlimited="false"
             itemSubjectRef="ItemDef_Integer"/>

  <dataStore id="DataStore_OrderArchive" name="Order Archive"
             capacity="9999999" isUnlimited="true"
             itemSubjectRef="ItemDef_String"/>

  <!-- ===== CATEGORIES & GROUPS ===== -->

  <category id="Category_ProcessPhase" name="Process Phases">
    <categoryValue id="CategoryValue_Intake" value="Intake"/>
    <categoryValue id="CategoryValue_Processing" value="Processing"/>
    <categoryValue id="CategoryValue_Completion" value="Completion"/>
  </category>

  <!-- ===== MAIN PROCESS ===== -->

  <process id="Process_OrderFulfillment" name="Order Fulfillment Process" isExecutable="true">

    <!-- ===== PROCESS-LEVEL DATA INPUTS/OUTPUTS ===== -->

    <ioSpecification id="IOSpec_Process">
      <!-- Process inputs -->
      <dataInput id="DataInput_ProcessOrder" name="Customer Order"
                itemSubjectRef="ItemDef_String"/>
      <dataInput id="DataInput_CustomerInfo" name="Customer Information"
                itemSubjectRef="ItemDef_String"/>

      <!-- Process outputs -->
      <dataOutput id="DataOutput_ProcessInvoice" name="Generated Invoice"
                 itemSubjectRef="ItemDef_String"/>
      <dataOutput id="DataOutput_ProcessShipment" name="Shipment Confirmation"
                 itemSubjectRef="ItemDef_String"/>

      <!-- Input set -->
      <inputSet id="InputSet_Process">
        <dataInputRefs>DataInput_ProcessOrder</dataInputRefs>
        <dataInputRefs>DataInput_CustomerInfo</dataInputRefs>
      </inputSet>

      <!-- Output set -->
      <outputSet id="OutputSet_Process">
        <dataOutputRefs>DataOutput_ProcessInvoice</dataOutputRefs>
        <dataOutputRefs>DataOutput_ProcessShipment</dataOutputRefs>
      </outputSet>
    </ioSpecification>

    <!-- ===== DATA OBJECTS (Process-scoped) ===== -->

    <!-- Single data object -->
    <dataObject id="DataObject_Order" name="Purchase Order"
               itemSubjectRef="ItemDef_String">
      <dataState id="DataState_Pending" name="pending"/>
      <dataState id="DataState_Validated" name="validated"/>
      <dataState id="DataState_Processed" name="processed"/>
      <dataState id="DataState_Shipped" name="shipped"/>
      <dataState id="DataState_Delivered" name="delivered"/>
    </dataObject>

    <!-- Collection data object -->
    <dataObject id="DataObject_OrderItems" name="Order Items"
               itemSubjectRef="ItemDef_StringList" isCollection="true">
      <dataState id="DataState_Items_Picked" name="picked"/>
      <dataState id="DataState_Items_Packed" name="packed"/>
      <dataState id="DataState_Items_Shipped" name="shipped"/>
    </dataObject>

    <!-- Single data object for invoice -->
    <dataObject id="DataObject_Invoice" name="Invoice Document"
               itemSubjectRef="ItemDef_String">
      <dataState id="DataState_Invoice_Generated" name="generated"/>
      <dataState id="DataState_Invoice_Sent" name="sent"/>
    </dataObject>

    <!-- ===== DATA STORE REFERENCES (Local process references) ===== -->

    <dataStoreReference id="DataStoreRef_Customer"
                       dataStoreRef="DataStore_CustomerDB"
                       name="Customer Information"/>

    <dataStoreReference id="DataStoreRef_Inventory"
                       dataStoreRef="DataStore_InventoryDB"
                       name="Product Inventory"/>

    <dataStoreReference id="DataStoreRef_Archive"
                       dataStoreRef="DataStore_OrderArchive"
                       name="Order Archive"/>

    <!-- ===== DATA OBJECT REFERENCES (Multiple states of same object) ===== -->

    <dataObjectReference id="DataObjectRef_OrderPending"
                        dataObjectRef="DataObject_Order"
                        name="Order (Pending)">
      <state id="State_OrderPending_Pending" name="pending"/>
    </dataObjectReference>

    <dataObjectReference id="DataObjectRef_OrderValidated"
                        dataObjectRef="DataObject_Order"
                        name="Order (Validated)">
      <state id="State_OrderValidated_Validated" name="validated"/>
    </dataObjectReference>

    <dataObjectReference id="DataObjectRef_OrderProcessed"
                        dataObjectRef="DataObject_Order"
                        name="Order (Processed)">
      <state id="State_OrderProcessed_Processed" name="processed"/>
    </dataObjectReference>

    <!-- ===== PROPERTIES (Process variables) ===== -->

    <property id="Property_OrderCount" name="Order Count"
             itemSubjectRef="ItemDef_Integer"/>
    <property id="Property_TotalAmount" name="Total Amount"
             itemSubjectRef="ItemDef_String"/>
    <property id="Property_IsUrgent" name="Is Urgent"
             itemSubjectRef="ItemDef_Boolean"/>
    <property id="Property_ProcessedDate" name="Processed Date"
             itemSubjectRef="ItemDef_Date"/>

    <!-- ===== START EVENT ===== -->

    <startEvent id="StartEvent_OrderReceived" name="Order Received">
      <outgoing>SequenceFlow_Start</outgoing>
      <!-- Event produces initial order data -->
      <dataOutputAssociation id="DAO_StartOrder">
        <sourceRef>StartEvent_OrderReceived</sourceRef>
        <targetRef>DataInput_ProcessOrder</targetRef>
      </dataOutputAssociation>
    </startEvent>

    <!-- ===== TASK 1: Validate Order ===== -->

    <task id="Task_ValidateOrder" name="Validate Order">
      <incoming>SequenceFlow_Start</incoming>
      <outgoing>SequenceFlow_ToCheckInventory</outgoing>

      <!-- Task-level I/O specification -->
      <ioSpecification id="IOSpec_ValidateTask">
        <dataInput id="DI_ValidateInput" name="Order to Validate"
                  itemSubjectRef="ItemDef_String"/>
        <dataOutput id="DO_ValidateOutput" name="Validation Result"
                   itemSubjectRef="ItemDef_Boolean"/>

        <inputSet id="IS_Validate">
          <dataInputRefs>DI_ValidateInput</dataInputRefs>
        </inputSet>

        <outputSet id="OS_Validate">
          <dataOutputRefs>DO_ValidateOutput</dataOutputRefs>
        </outputSet>
      </ioSpecification>

      <!-- Input: Read order from data object -->
      <dataInputAssociation id="DIA_ValidateReadOrder">
        <sourceRef>DataObjectRef_OrderPending</sourceRef>
        <targetRef>DI_ValidateInput</targetRef>
      </dataInputAssociation>

      <!-- Input: Read customer from data store -->
      <dataInputAssociation id="DIA_ValidateReadCustomer">
        <sourceRef>DataStoreRef_Customer</sourceRef>
        <targetRef>DI_ValidateInput</targetRef>
        <transformation id="Transform_GetCustomer">
          <body>SELECT * FROM customers WHERE id = order.customerId</body>
        </transformation>
      </dataInputAssociation>

      <!-- Output: Update order state -->
      <dataOutputAssociation id="DAO_ValidateOrder">
        <sourceRef>DO_ValidateOutput</sourceRef>
        <targetRef>DataObjectRef_OrderValidated</targetRef>
      </dataOutputAssociation>

      <!-- Update property -->
      <dataOutputAssociation id="DAO_ValidateCount">
        <sourceRef>DO_ValidateOutput</sourceRef>
        <targetRef>Property_OrderCount</targetRef>
      </dataOutputAssociation>
    </task>

    <!-- ===== TASK 2: Check Inventory ===== -->

    <task id="Task_CheckInventory" name="Check Inventory Availability">
      <incoming>SequenceFlow_ToCheckInventory</incoming>
      <outgoing>SequenceFlow_ToProcessOrder</outgoing>

      <ioSpecification id="IOSpec_InventoryTask">
        <dataInput id="DI_InventoryInput" name="Items to Check"
                  itemSubjectRef="ItemDef_StringList"/>
        <dataOutput id="DO_InventoryOutput" name="Inventory Status"
                   itemSubjectRef="ItemDef_Boolean"/>

        <inputSet id="IS_Inventory">
          <dataInputRefs>DI_InventoryInput</dataInputRefs>
        </inputSet>

        <outputSet id="OS_Inventory">
          <dataOutputRefs>DO_InventoryOutput</dataOutputRefs>
        </outputSet>
      </ioSpecification>

      <!-- Read items from collection -->
      <dataInputAssociation id="DIA_InventoryReadItems">
        <sourceRef>DataObject_OrderItems</sourceRef>
        <targetRef>DI_InventoryInput</targetRef>
      </dataInputAssociation>

      <!-- Read from inventory database -->
      <dataInputAssociation id="DIA_InventoryRead">
        <sourceRef>DataStoreRef_Inventory</sourceRef>
        <targetRef>DI_InventoryInput</targetRef>
        <transformation id="Transform_QueryInventory">
          <body>SELECT quantity FROM inventory WHERE sku IN (items.skus)</body>
        </transformation>
      </dataInputAssociation>

      <!-- Write back to inventory (deduct) -->
      <dataOutputAssociation id="DAO_InventoryWrite">
        <sourceRef>DO_InventoryOutput</sourceRef>
        <targetRef>DataStoreRef_Inventory</targetRef>
        <transformation id="Transform_UpdateInventory">
          <body>UPDATE inventory SET quantity = quantity - items.qty WHERE sku = items.sku</body>
        </transformation>
      </dataOutputAssociation>
    </task>

    <!-- ===== TASK 3: Create Invoice ===== -->

    <task id="Task_CreateInvoice" name="Create Invoice">
      <incoming>SequenceFlow_ToProcessOrder</incoming>
      <outgoing>SequenceFlow_ToEnd</outgoing>

      <ioSpecification id="IOSpec_InvoiceTask">
        <dataInput id="DI_InvoiceInput" name="Order Details"
                  itemSubjectRef="ItemDef_String"/>
        <dataOutput id="DO_InvoiceOutput" name="Invoice Document"
                   itemSubjectRef="ItemDef_String"/>

        <inputSet id="IS_Invoice">
          <dataInputRefs>DI_InvoiceInput</dataInputRefs>
        </inputSet>

        <outputSet id="OS_Invoice">
          <dataOutputRefs>DO_InvoiceOutput</dataOutputRefs>
        </outputSet>
      </ioSpecification>

      <!-- Read processed order -->
      <dataInputAssociation id="DIA_InvoiceReadOrder">
        <sourceRef>DataObjectRef_OrderProcessed</sourceRef>
        <targetRef>DI_InvoiceInput</targetRef>
      </dataInputAssociation>

      <!-- Output invoice to object -->
      <dataOutputAssociation id="DAO_InvoiceOutput">
        <sourceRef>DO_InvoiceOutput</sourceRef>
        <targetRef>DataObject_Invoice</targetRef>
      </dataOutputAssociation>

      <!-- Archive to data store -->
      <dataOutputAssociation id="DAO_InvoiceArchive">
        <sourceRef>DO_InvoiceOutput</sourceRef>
        <targetRef>DataStoreRef_Archive</targetRef>
      </dataOutputAssociation>

      <!-- Set property -->
      <dataOutputAssociation id="DAO_InvoiceAmount">
        <sourceRef>DO_InvoiceOutput</sourceRef>
        <targetRef>Property_TotalAmount</targetRef>
      </dataOutputAssociation>
    </task>

    <!-- ===== END EVENT ===== -->

    <endEvent id="EndEvent_OrderComplete" name="Order Complete">
      <incoming>SequenceFlow_ToEnd</incoming>

      <!-- Capture final output -->
      <dataInputAssociation id="DIA_EndInvoice">
        <sourceRef>DataObject_Invoice</sourceRef>
        <targetRef>DataOutput_ProcessInvoice</targetRef>
      </dataInputAssociation>

      <dataInputAssociation id="DIA_EndShipment">
        <sourceRef>DataObjectRef_OrderShipped</sourceRef>
        <targetRef>DataOutput_ProcessShipment</targetRef>
      </dataInputAssociation>
    </endEvent>

    <!-- ===== SEQUENCE FLOWS ===== -->

    <sequenceFlow id="SequenceFlow_Start"
                 sourceRef="StartEvent_OrderReceived"
                 targetRef="Task_ValidateOrder"/>

    <sequenceFlow id="SequenceFlow_ToCheckInventory"
                 sourceRef="Task_ValidateOrder"
                 targetRef="Task_CheckInventory"/>

    <sequenceFlow id="SequenceFlow_ToProcessOrder"
                 sourceRef="Task_CheckInventory"
                 targetRef="Task_CreateInvoice"/>

    <sequenceFlow id="SequenceFlow_ToEnd"
                 sourceRef="Task_CreateInvoice"
                 targetRef="EndEvent_OrderComplete"/>

    <!-- ===== TEXT ANNOTATIONS ===== -->

    <textAnnotation id="TextAnnotation_ValidateNote">
      <text>Validates order against business rules.
Checks for duplicate orders and customer credit limits.</text>
    </textAnnotation>

    <association id="Association_ValidateNote"
                sourceRef="Task_ValidateOrder"
                targetRef="TextAnnotation_ValidateNote"
                associationDirection="None"/>

    <textAnnotation id="TextAnnotation_InventoryNote">
      <text>Real-time inventory check.
Reserves items and updates stock levels.</text>
    </textAnnotation>

    <association id="Association_InventoryNote"
                sourceRef="Task_CheckInventory"
                targetRef="TextAnnotation_InventoryNote"
                associationDirection="None"/>

    <!-- ===== GROUPS ===== -->

    <!-- Group 1: Intake Phase -->
    <group id="Group_IntakePhase"
          categoryValueRef="CategoryValue_Intake"
          name="Intake Phase"/>

    <!-- Group 2: Processing Phase -->
    <group id="Group_ProcessingPhase"
          categoryValueRef="CategoryValue_Processing"
          name="Processing Phase"/>

  </process>

  <!-- ===== DIAGRAM INTERCHANGE INFORMATION ===== -->

  <bpmndi:BPMNDiagram id="BPMNDiagram_1" name="Order Fulfillment">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_OrderFulfillment">

      <!-- Start Event -->
      <bpmndi:BPMNShape id="StartEvent_OrderReceived_di" bpmnElement="StartEvent_OrderReceived">
        <dc:Bounds x="50" y="100" width="36" height="36"/>
        <bpmndi:BPMNLabel>
          <dc:Bounds x="30" y="140" width="76" height="14"/>
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>

      <!-- Task 1 -->
      <bpmndi:BPMNShape id="Task_ValidateOrder_di" bpmnElement="Task_ValidateOrder">
        <dc:Bounds x="150" y="80" width="100" height="80"/>
        <bpmndi:BPMNLabel>
          <dc:Bounds x="160" y="120" width="80" height="14"/>
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>

      <!-- Task 2 -->
      <bpmndi:BPMNShape id="Task_CheckInventory_di" bpmnElement="Task_CheckInventory">
        <dc:Bounds x="310" y="80" width="100" height="80"/>
        <bpmndi:BPMNLabel>
          <dc:Bounds x="312" y="110" width="96" height="28"/>
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>

      <!-- Task 3 -->
      <bpmndi:BPMNShape id="Task_CreateInvoice_di" bpmnElement="Task_CreateInvoice">
        <dc:Bounds x="470" y="80" width="100" height="80"/>
        <bpmndi:BPMNLabel>
          <dc:Bounds x="478" y="120" width="84" height="14"/>
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>

      <!-- End Event -->
      <bpmndi:BPMNShape id="EndEvent_OrderComplete_di" bpmnElement="EndEvent_OrderComplete">
        <dc:Bounds x="630" y="100" width="36" height="36"/>
        <bpmndi:BPMNLabel>
          <dc:Bounds x="615" y="140" width="66" height="14"/>
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>

      <!-- Data Objects -->
      <bpmndi:BPMNShape id="DataObject_Order_di" bpmnElement="DataObjectRef_OrderPending">
        <dc:Bounds x="175" y="30" width="50" height="40"/>
        <bpmndi:BPMNLabel>
          <dc:Bounds x="165" y="-10" width="70" height="14"/>
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>

      <bpmndi:BPMNShape id="DataObject_Items_di" bpmnElement="DataObject_OrderItems">
        <dc:Bounds x="335" y="30" width="50" height="40"/>
        <bpmndi:BPMNLabel>
          <dc:Bounds x="325" y="-10" width="70" height="14"/>
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>

      <bpmndi:BPMNShape id="DataObject_Invoice_di" bpmnElement="DataObject_Invoice">
        <dc:Bounds x="495" y="30" width="50" height="40"/>
        <bpmndi:BPMNLabel>
          <dc:Bounds x="485" y="-10" width="70" height="14"/>
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>

      <!-- Data Stores -->
      <bpmndi:BPMNShape id="DataStore_Customer_di" bpmnElement="DataStoreRef_Customer">
        <dc:Bounds x="170" y="220" width="60" height="50"/>
        <bpmndi:BPMNLabel>
          <dc:Bounds x="160" y="275" width="80" height="14"/>
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>

      <bpmndi:BPMNShape id="DataStore_Inventory_di" bpmnElement="DataStoreRef_Inventory">
        <dc:Bounds x="330" y="220" width="60" height="50"/>
        <bpmndi:BPMNLabel>
          <dc:Bounds x="320" y="275" width="80" height="14"/>
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>

      <!-- Text Annotations -->
      <bpmndi:BPMNShape id="TextAnnotation_Validate_di" bpmnElement="TextAnnotation_ValidateNote">
        <dc:Bounds x="280" y="200" width="180" height="60"/>
        <bpmndi:BPMNLabel>
          <dc:Bounds x="280" y="200" width="180" height="60"/>
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>

      <!-- Sequence Flows -->
      <bpmndi:BPMNEdge id="SequenceFlow_Start_di" bpmnElement="SequenceFlow_Start">
        <di:waypoint x="86" y="118"/>
        <di:waypoint x="150" y="120"/>
      </bpmndi:BPMNEdge>

      <bpmndi:BPMNEdge id="SequenceFlow_ToCheckInventory_di" bpmnElement="SequenceFlow_ToCheckInventory">
        <di:waypoint x="250" y="120"/>
        <di:waypoint x="310" y="120"/>
      </bpmndi:BPMNEdge>

      <bpmndi:BPMNEdge id="SequenceFlow_ToProcessOrder_di" bpmnElement="SequenceFlow_ToProcessOrder">
        <di:waypoint x="410" y="120"/>
        <di:waypoint x="470" y="120"/>
      </bpmndi:BPMNEdge>

      <bpmndi:BPMNEdge id="SequenceFlow_ToEnd_di" bpmnElement="SequenceFlow_ToEnd">
        <di:waypoint x="570" y="120"/>
        <di:waypoint x="630" y="118"/>
      </bpmndi:BPMNEdge>

      <!-- Data Associations (shown as edges) -->
      <bpmndi:BPMNEdge id="DIA_ValidateReadOrder_di" bpmnElement="DIA_ValidateReadOrder">
        <di:waypoint x="200" y="70"/>
        <di:waypoint x="200" y="80"/>
        <bpmndi:BPMNLabel>
          <dc:Bounds x="170" y="65" width="70" height="20"/>
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>

      <!-- Associations -->
      <bpmndi:BPMNEdge id="Association_ValidateNote_di" bpmnElement="Association_ValidateNote">
        <di:waypoint x="250" y="160"/>
        <di:waypoint x="350" y="200"/>
      </bpmndi:BPMNEdge>

      <!-- Groups -->
      <bpmndi:BPMNShape id="Group_IntakePhase_di" bpmnElement="Group_IntakePhase">
        <dc:Bounds x="40" y="60" width="150" height="150"/>
        <bpmndi:BPMNLabel>
          <dc:Bounds x="50" y="70" width="80" height="20"/>
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>

    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>

</definitions>
```

---

## 2. Minimal Template (Quick Start)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL"
             xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
             xmlns:dc="http://www.omg.org/spec/DD/20100524/DC"
             xmlns:di="http://www.omg.org/spec/DD/20100524/DI"
             targetNamespace="http://example.com/bpmn" id="Definitions_Minimal">

  <!-- Item definition -->
  <itemDefinition id="ItemDef_String" structureRef="xsd:string"/>

  <!-- Data store -->
  <dataStore id="Store1" name="Database" itemSubjectRef="ItemDef_String"/>

  <!-- Process -->
  <process id="Process1" name="My Process">

    <!-- Data object -->
    <dataObject id="DO1" name="Order" itemSubjectRef="ItemDef_String"/>

    <!-- Data store reference -->
    <dataStoreReference id="SR1" dataStoreRef="Store1" name="DB"/>

    <!-- Text annotation -->
    <textAnnotation id="TA1">
      <text>Process note</text>
    </textAnnotation>

    <!-- Association -->
    <association id="Assoc1" sourceRef="Task1" targetRef="TA1"/>

  </process>

</definitions>
```

---

## 3. Data Element Templates

### 3.1 DataInput/DataOutput (Task-Level)

```xml
<task id="Task_Process" name="Process Data">
  <ioSpecification id="IOSpec_1">
    <!-- Input -->
    <dataInput id="DI_Input1" name="Input Data"
              itemSubjectRef="ItemDef_String"/>

    <!-- Output -->
    <dataOutput id="DO_Output1" name="Output Data"
               itemSubjectRef="ItemDef_String"/>

    <!-- Sets -->
    <inputSet id="IS1">
      <dataInputRefs>DI_Input1</dataInputRefs>
    </inputSet>

    <outputSet id="OS1">
      <dataOutputRefs>DO_Output1</dataOutputRefs>
    </outputSet>
  </ioSpecification>

  <!-- Associations -->
  <dataInputAssociation id="DIA1">
    <sourceRef>DataObject_Source</sourceRef>
    <targetRef>DI_Input1</targetRef>
  </dataInputAssociation>

  <dataOutputAssociation id="DAO1">
    <sourceRef>DO_Output1</sourceRef>
    <targetRef>DataObject_Target</targetRef>
  </dataOutputAssociation>
</task>
```

### 3.2 DataObject with States

```xml
<dataObject id="DO_Order" name="Order" itemSubjectRef="ItemDef_Order">
  <dataState id="State1" name="pending"/>
  <dataState id="State2" name="approved"/>
  <dataState id="State3" name="completed"/>
</dataObject>

<!-- References at different states -->
<dataObjectReference id="DOR1" dataObjectRef="DO_Order" name="Order [Pending]">
  <state id="S1" name="pending"/>
</dataObjectReference>

<dataObjectReference id="DOR2" dataObjectRef="DO_Order" name="Order [Approved]">
  <state id="S2" name="approved"/>
</dataObjectReference>
```

### 3.3 DataStore with Transformations

```xml
<dataStore id="Store1" name="Customer DB"
          capacity="1000000" isUnlimited="true"
          itemSubjectRef="ItemDef_Customer"/>

<dataStoreReference id="StoreRef1" dataStoreRef="Store1" name="Customers"/>

<!-- Read operation with SQL -->
<dataInputAssociation id="Read1">
  <sourceRef>StoreRef1</sourceRef>
  <targetRef>Task1</targetRef>
  <transformation id="Transform1">
    <body>SELECT * FROM customers WHERE status='active'</body>
  </transformation>
</dataInputAssociation>

<!-- Write operation with SQL -->
<dataOutputAssociation id="Write1">
  <sourceRef>Task1</sourceRef>
  <targetRef>StoreRef1</targetRef>
  <transformation id="Transform2">
    <body>UPDATE customers SET lastModified=NOW() WHERE id=?</body>
  </transformation>
</dataOutputAssociation>
```

### 3.4 Properties

```xml
<process id="Process1">
  <!-- Process-level properties -->
  <property id="Prop1" name="Counter" itemSubjectRef="ItemDef_Integer"/>
  <property id="Prop2" name="Status" itemSubjectRef="ItemDef_String"/>

  <!-- Task reading/writing properties -->
  <task id="Task1" name="Update Properties">
    <dataOutputAssociation id="SetProp1">
      <sourceRef>Task1</sourceRef>
      <targetRef>Prop1</targetRef>
    </dataOutputAssociation>
  </task>
</process>
```

### 3.5 Collection Types

```xml
<!-- Define collection type -->
<itemDefinition id="ItemDef_OrderCollection"
               structureRef="xsd:string" isCollection="true"/>

<!-- Data object as collection -->
<dataObject id="DO_Orders" name="Order List"
           itemSubjectRef="ItemDef_OrderCollection"
           isCollection="true"/>

<!-- Collection reference -->
<dataObjectReference id="DOR_Orders"
                    dataObjectRef="DO_Orders"
                    name="Selected Orders"/>
```

---

## 4. Group and Annotation Templates

### 4.1 Groups with Categories

```xml
<!-- Category definitions -->
<category id="Cat1" name="Process Phases">
  <categoryValue id="CV1" value="Intake"/>
  <categoryValue id="CV2" value="Processing"/>
  <categoryValue id="CV3" value="Completion"/>
</category>

<process id="Process1">
  <!-- Group definitions -->
  <group id="Group1" categoryValueRef="CV1" name="Intake Phase"/>
  <group id="Group2" categoryValueRef="CV2" name="Processing Phase"/>
  <group id="Group3" categoryValueRef="CV3" name="Completion Phase"/>

  <!-- Tasks contained in groups -->
  <task id="Task1" name="Accept Order"/>
  <task id="Task2" name="Validate Order"/>
  <task id="Task3" name="Process"/>
</process>
```

### 4.2 Text Annotations with Associations

```xml
<textAnnotation id="TA1">
  <text>Long explanation of this process step.
Can be multi-line.
Supports detailed notes.</text>
</textAnnotation>

<textAnnotation id="TA2">
  <text>Warning: This step may fail for bulk orders</text>
</textAnnotation>

<!-- Associate to elements -->
<association id="Assoc1"
            sourceRef="Task1"
            targetRef="TA1"
            associationDirection="None"/>

<association id="Assoc2"
            sourceRef="Task2"
            targetRef="TA2"
            associationDirection="One"/>
```

---

## 5. Complete Data Association Chain

```xml
<process id="Process_DataFlow">

  <!-- Source -->
  <dataObject id="DO_Source" name="Source Data"
             itemSubjectRef="ItemDef_String"/>

  <!-- Intermediate -->
  <dataObject id="DO_Intermediate" name="Processed Data"
             itemSubjectRef="ItemDef_String"/>

  <!-- Target -->
  <dataStoreReference id="Store1" dataStoreRef="FinalStore"
                     name="Final Storage"/>

  <!-- Task 1: Transform A→B -->
  <task id="Task1" name="Transform 1">
    <ioSpecification id="IO1">
      <dataInput id="DI1" itemSubjectRef="ItemDef_String"/>
      <dataOutput id="DO1" itemSubjectRef="ItemDef_String"/>

      <inputSet id="IS1"><dataInputRefs>DI1</dataInputRefs></inputSet>
      <outputSet id="OS1"><dataOutputRefs>DO1</dataOutputRefs></outputSet>
    </ioSpecification>

    <!-- Source → Input -->
    <dataInputAssociation id="DIA1">
      <sourceRef>DO_Source</sourceRef>
      <targetRef>DI1</targetRef>
      <transformation id="T1">
        <body>uppercase(input)</body>
      </transformation>
    </dataInputAssociation>

    <!-- Output → Intermediate -->
    <dataOutputAssociation id="DAO1">
      <sourceRef>DO1</sourceRef>
      <targetRef>DO_Intermediate</targetRef>
    </dataOutputAssociation>
  </task>

  <!-- Task 2: Final transformation B→C -->
  <task id="Task2" name="Transform 2">
    <ioSpecification id="IO2">
      <dataInput id="DI2" itemSubjectRef="ItemDef_String"/>
      <dataOutput id="DO2" itemSubjectRef="ItemDef_String"/>

      <inputSet id="IS2"><dataInputRefs>DI2</dataInputRefs></inputSet>
      <outputSet id="OS2"><dataOutputRefs>DO2</dataOutputRefs></outputSet>
    </ioSpecification>

    <!-- Intermediate → Input -->
    <dataInputAssociation id="DIA2">
      <sourceRef>DO_Intermediate</sourceRef>
      <targetRef>DI2</targetRef>
    </dataInputAssociation>

    <!-- Output → Store -->
    <dataOutputAssociation id="DAO2">
      <sourceRef>DO2</sourceRef>
      <targetRef>Store1</targetRef>
      <transformation id="T2">
        <body>INSERT INTO store VALUES (?)</body>
      </transformation>
    </dataOutputAssociation>
  </task>

</process>
```

---

## 6. Diagram Interchange (DI) Template

```xml
<bpmndi:BPMNDiagram id="Diagram1" name="Diagram Name">
  <bpmndi:BPMNPlane id="Plane1" bpmnElement="Process1">

    <!-- Data Object Shape -->
    <bpmndi:BPMNShape id="DO1_di" bpmnElement="DO1">
      <dc:Bounds x="100" y="100" width="100" height="80"/>
      <bpmndi:BPMNLabel>
        <dc:Bounds x="110" y="130" width="80" height="20"/>
      </bpmndi:BPMNLabel>
    </bpmndi:BPMNShape>

    <!-- Data Store Shape -->
    <bpmndi:BPMNShape id="Store1_di" bpmnElement="Store1">
      <dc:Bounds x="300" y="100" width="100" height="80"/>
      <bpmndi:BPMNLabel>
        <dc:Bounds x="310" y="180" width="80" height="20"/>
      </bpmndi:BPMNLabel>
    </bpmndi:BPMNShape>

    <!-- Group Shape -->
    <bpmndi:BPMNShape id="Group1_di" bpmnElement="Group1">
      <dc:Bounds x="50" y="50" width="500" height="300"/>
      <bpmndi:BPMNLabel>
        <dc:Bounds x="60" y="60" width="100" height="20"/>
      </bpmndi:BPMNLabel>
    </bpmndi:BPMNShape>

    <!-- Text Annotation Shape -->
    <bpmndi:BPMNShape id="TA1_di" bpmnElement="TA1">
      <dc:Bounds x="500" y="150" width="200" height="100"/>
      <bpmndi:BPMNLabel>
        <dc:Bounds x="510" y="160" width="180" height="80"/>
      </bpmndi:BPMNLabel>
    </bpmndi:BPMNShape>

    <!-- Data Association Edge -->
    <bpmndi:BPMNEdge id="DIA1_di" bpmnElement="DIA1">
      <di:waypoint x="200" y="120"/>
      <di:waypoint x="300" y="120"/>
      <bpmndi:BPMNLabel>
        <dc:Bounds x="230" y="100" width="40" height="14"/>
      </bpmndi:BPMNLabel>
    </bpmndi:BPMNEdge>

    <!-- Association Edge (to annotation) -->
    <bpmndi:BPMNEdge id="Assoc1_di" bpmnElement="Assoc1">
      <di:waypoint x="200" y="150"/>
      <di:waypoint x="500" y="200"/>
    </bpmndi:BPMNEdge>

  </bpmndi:BPMNPlane>
</bpmndi:BPMNDiagram>
```

---

## 7. Common Patterns

### 7.1 Read-Process-Write Pattern

```xml
<task id="ReadTask" name="Read from Store">
  <dataInputAssociation id="Read1">
    <sourceRef>DataStore1</sourceRef>
    <targetRef>ReadTask</targetRef>
    <transformation id="SQL_Read">
      <body>SELECT * FROM table WHERE status='pending'</body>
    </transformation>
  </dataInputAssociation>
  <dataOutputAssociation id="Store1">
    <sourceRef>ReadTask</sourceRef>
    <targetRef>DataObject1</targetRef>
  </dataOutputAssociation>
</task>

<task id="ProcessTask" name="Process Data">
  <dataInputAssociation id="Read2">
    <sourceRef>DataObject1</sourceRef>
    <targetRef>ProcessTask</targetRef>
  </dataInputAssociation>
  <dataOutputAssociation id="Output1">
    <sourceRef>ProcessTask</sourceRef>
    <targetRef>DataObject2</targetRef>
  </dataOutputAssociation>
</task>

<task id="WriteTask" name="Write to Store">
  <dataInputAssociation id="Read3">
    <sourceRef>DataObject2</sourceRef>
    <targetRef>WriteTask</targetRef>
  </dataInputAssociation>
  <dataOutputAssociation id="Write1">
    <sourceRef>WriteTask</sourceRef>
    <targetRef>DataStore1</targetRef>
    <transformation id="SQL_Write">
      <body>UPDATE table SET status='completed' WHERE id=?</body>
    </transformation>
  </dataOutputAssociation>
</task>
```

### 7.2 Collection Processing Pattern

```xml
<!-- Collection definition -->
<itemDefinition id="ItemDef_ItemList" structureRef="xsd:string"
               isCollection="true"/>

<!-- Collection data object -->
<dataObject id="DO_Items" name="Items to Process"
           itemSubjectRef="ItemDef_ItemList" isCollection="true"/>

<!-- Multi-instance task processing collection -->
<task id="ProcessItems" name="Process Item">
  <multiInstanceLoopCharacteristics>
    <loopDataInputRef>DO_Items</loopDataInputRef>
  </multiInstanceLoopCharacteristics>

  <ioSpecification id="IO_Process">
    <dataInput id="DI_SingleItem" name="Current Item"
              itemSubjectRef="ItemDef_String"/>
    <dataOutput id="DO_Result" name="Result"
               itemSubjectRef="ItemDef_String"/>

    <inputSet id="IS"><dataInputRefs>DI_SingleItem</dataInputRefs></inputSet>
    <outputSet id="OS"><dataOutputRefs>DO_Result</dataOutputRefs></outputSet>
  </ioSpecification>

  <dataInputAssociation id="DIA_Item">
    <sourceRef>DO_Items</sourceRef>
    <targetRef>DI_SingleItem</targetRef>
  </dataInputAssociation>
</task>
```

---

## 8. Validation Rules

```xml
<!-- Valid configurations -->

<!-- ✓ DataInput references DataObject -->
<dataInputAssociation>
  <sourceRef>DataObject1</sourceRef>
  <targetRef>DataInput1</targetRef>
</dataInputAssociation>

<!-- ✓ DataOutput references DataObject -->
<dataOutputAssociation>
  <sourceRef>DataOutput1</sourceRef>
  <targetRef>DataObject1</targetRef>
</dataOutputAssociation>

<!-- ✓ DataStore reference in process -->
<dataStoreReference id="Ref1" dataStoreRef="GlobalDataStore1"/>

<!-- ✓ ItemDefinition usage -->
<itemDefinition id="ItemDef1" structureRef="xsd:string"/>
<dataObject id="DO1" itemSubjectRef="ItemDef1"/>

<!-- ✓ Association to annotation -->
<association sourceRef="Task1" targetRef="TextAnnotation1"/>

<!-- ✓ Group with category -->
<category><categoryValue id="CV1" value="Phase1"/></category>
<group categoryValueRef="CV1"/>
```

---

## Checklist for Valid BPMN Files

- [ ] All ItemDefinitions defined before use
- [ ] All DataStore definitions in definitions section
- [ ] All DataObject definitions in process section
- [ ] All DataStoreReferences reference valid DataStore
- [ ] All dataObjectRef references valid DataObject
- [ ] All itemSubjectRef references valid ItemDefinition
- [ ] All DataInputAssociation sourceRef exists
- [ ] All DataOutputAssociation targetRef exists
- [ ] All Association sourceRef and targetRef exist
- [ ] Group categoryValueRef references valid CategoryValue
- [ ] BPMNShape bpmnElement references valid element
- [ ] BPMNEdge bpmnElement references valid element
- [ ] DI bounds have positive x, y, width, height
- [ ] No circular DataAssociation chains (unless intentional)
- [ ] TextAnnotation text is properly escaped

---

## Related Resources

- [BPMN 2.0 Specification PDF](https://www.omg.org/spec/BPMN/2.0/PDF/)
- [bpmn.io Examples](https://demo.bpmn.io/)
- [BPMN MIWG Test Suite](https://github.com/bpmn-miwg/bpmn-miwg-test-suite/)
