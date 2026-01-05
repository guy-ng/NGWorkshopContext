# BPMN 2.0 Artifacts and Data Elements - Visual Reference Guide

## Visual Representation Standards

This guide provides standardized visual representations for all BPMN 2.0 artifacts and data elements.

---

## 1. ARTIFACTS - Visual Standards

### 1.1 Data Object (Single)

**Standard Representation:**
```
┌─────────────────┐
│  Order Form     │
│                 │
│                 │
└─────────────────┘

Dimensions: 100px × 80px
Border: 1px solid #333
Fill: #FFFFFF
Font: 12px Arial
```

**SVG Path:**
```svg
<rect x="0" y="0" width="100" height="80"
      fill="#FFFFFF" stroke="#333333" stroke-width="1" rx="2" ry="2"/>
<text x="50" y="40" text-anchor="middle"
      dominant-baseline="middle" font-size="12">Order Form</text>
```

**Use Cases:**
- Single documents
- Discrete data items
- Configuration data

---

### 1.2 Data Object Collection

**Standard Representation:**
```
┌─────────────────┐
│  Order Items    │
├─────────────────┤
│ ═ ═ ═ ═ ═ ═ ═ ═ │  <- Collection Marker
└─────────────────┘

Dimensions: 100px × 80px
Marker: 3 horizontal lines @ 65px, 70px, 75px from top
Marker stroke: 2px
Marker spacing: 5px between lines
```

**SVG Path:**
```svg
<!-- Main rectangle -->
<rect x="0" y="0" width="100" height="80"
      fill="#FFFFFF" stroke="#333333" stroke-width="1"/>

<!-- Collection marker (3 lines) -->
<line x1="10" y1="65" x2="90" y2="65" stroke="#333333" stroke-width="2"/>
<line x1="10" y1="70" x2="90" y2="70" stroke="#333333" stroke-width="2"/>
<line x1="10" y1="75" x2="90" y2="75" stroke="#333333" stroke-width="2"/>

<text x="50" y="40" text-anchor="middle"
      dominant-baseline="middle" font-size="12">Order Items</text>
```

**Key Indicators:**
- Marker at bottom of rectangle
- 3 parallel horizontal lines
- Clear spacing between lines
- Consistent with Multi-Instance Task notation

---

### 1.3 Data Store Reference

**Standard Representation:**
```
┌──────────────────┐
│  Customer Data   │
├──────────────────┤
│   (DATABASE)     │
├──────────────────┤
│    [Database]    │
└──────────────────┘

Component Heights:
- Top ellipse: 10px (fill: #FFFFFF)
- Body rectangle: 60px (fill: #FFFFFF)
- Bottom ellipse: 10px (fill: #F5F5F5)
Border: 1px solid #333
```

**SVG Path:**
```svg
<!-- Top ellipse -->
<ellipse cx="50" cy="5" rx="50" ry="5"
         fill="#FFFFFF" stroke="#333333" stroke-width="1"/>

<!-- Main cylinder body -->
<rect x="0" y="5" width="100" height="60"
      fill="#FFFFFF" stroke="#333333" stroke-width="1"/>

<!-- Bottom ellipse (darkened) -->
<ellipse cx="50" cy="75" rx="50" ry="5"
         fill="#F5F5F5" stroke="#333333" stroke-width="1"/>

<!-- Text label -->
<text x="50" y="40" text-anchor="middle"
      dominant-baseline="middle" font-size="12" font-weight="bold">Customer Data</text>
```

**Visual Characteristics:**
- 3D cylinder appearance
- Top ellipse same shade as body
- Bottom ellipse darker (shadow effect)
- Icon or database symbol optional

---

### 1.4 Group (Visual Grouping)

**Standard Representation:**
```
╭─────────────────────────────────────────╮
┆  Approval Process                       ┆
┆  ┌─────────────┐     ┌─────────────┐   ┆
┆  │ Task 1      │────→│ Task 2      │   ┆
┆  └─────────────┘     └─────────────┘   ┆
╰─────────────────────────────────────────╯

Dimensions: Variable (contains elements)
Border: 2px dashed #888888
Corner radius: 8px
Fill opacity: 10% (light background color)
Dash pattern: 5px dash, 5px gap
Label: Top-left, 12px bold Arial
```

**SVG Path:**
```svg
<!-- Dashed rounded rectangle -->
<rect x="0" y="0" width="400" height="200"
      fill="#FFFACD" fill-opacity="0.1"
      stroke="#888888" stroke-width="2"
      stroke-dasharray="5,5"
      rx="8" ry="8"/>

<!-- Group name label -->
<text x="10" y="20" font-size="12" font-weight="bold"
      fill="#666666">Approval Process</text>
```

**Rendering Rules:**
- Background is semi-transparent
- Dashed border clearly distinguishes from other elements
- Rounded corners provide visual grouping feel
- Label positioned inside, top-left
- Contained elements drawn on top

**Use Cases:**
- Highlight process phases
- Organize by responsibility
- Risk zone identification
- Approval workflows

---

### 1.5 Text Annotation

**Standard Representation:**
```
┌────────────────────┐
│ This is a note     │
│ explaining the     │
│ element behavior   │
└────────────────────┘

Border: 1px solid #666666
Fill: None (#FFFFFF transparent)
Font: 11px Arial
Line height: 14px
Padding: 5px
Corner radius: 0px (square corners)
```

**SVG Path:**
```svg
<!-- Open rectangle (not filled) -->
<rect x="0" y="0" width="200" height="100"
      fill="none" stroke="#666666" stroke-width="1"/>

<!-- Text content (wrapped) -->
<foreignObject x="5" y="5" width="190" height="90">
  <body xmlns="http://www.w3.org/1999/xhtml">
    <div style="font-size: 11px; font-family: Arial;
                white-space: pre-wrap; word-wrap: break-word;">
      This is a note explaining the element behavior
    </div>
  </body>
</foreignObject>
```

**Association Connection:**
```
Element                      Annotation
  [TASK]  ┈┈┈┈┈┈┈┈┈┈┈┈┈┈  ┌─────────────┐
          (dotted line)     │ This task   │
                            │ does X      │
                            └─────────────┘
```

**Association Characteristics:**
- Dotted line connector (3px dash, 3px gap)
- Arrow pointing to annotation (optional)
- Association direction: typically "None"

---

## 2. DATA ELEMENTS - Visual Standards

### 2.1 Data Input/Output - Visual Representation

**Data Input Indicator:**
```
     ↓ Input Arrow
┌──────────────┐
│ Order Form   │  <- Data Input: "Order Information"
└──────────────┘
    [TASK]
```

**Data Output Indicator:**
```
    [TASK]
┌──────────────┐
│ Invoice      │  <- Data Output: "Invoice Document"
└──────────────┘
     ↓ Output Arrow
```

**IO Specification Panel (Property View):**
```
┌─────────────────────────────────────────┐
│ I/O Specification: IOSpec_Task_1        │
├─────────────────────────────────────────┤
│ ▼ Data Inputs (2)                       │
│   ├─ Order Information                  │
│   │  ID: DataInput_1                    │
│   │  Type: ItemDefinition_Order         │
│   └─ Customer Data                      │
│      ID: DataInput_2                    │
│      Type: ItemDefinition_Customer      │
│      [Optional]                         │
├─────────────────────────────────────────┤
│ ▼ Data Outputs (1)                      │
│   └─ Invoice Document                   │
│      ID: DataOutput_1                   │
│      Type: ItemDefinition_Invoice       │
│      (Collection)                       │
└─────────────────────────────────────────┘
```

---

### 2.2 Data Object Reference - State Progression

**Visual Flow:**
```
Order Lifecycle with References:

DataObject_Order (single definition)
├── State: pending
├── State: approved
├── State: shipped
└── State: delivered

Diagram Representation:

┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ Pending     │───→│ Approved    │───→│ Shipped     │───→│ Delivered   │
│ Order       │    │ Order       │    │ Order       │    │ Order       │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
    [Ref 1]           [Ref 2]            [Ref 3]            [Ref 4]
     ↓                  ↓                  ↓                  ↓
  Task 1            Task 2              Task 3              Task 4
  Approve          Prepare              Ship              Deliver
```

**State Label Format:**
```
┌─────────────┐
│ Approved    │
│ Order       │
├─────────────┤
│  [approved] │  <- State label (italics, gray)
└─────────────┘
```

---

### 2.3 Data Store Reference - Read/Write Operations

**Visual Representation:**

**Read Operation (Input Association):**
```
┌──────────────┐
│ Database     │
│ Customer DB  │
└──────────────┘
      ↑
  ┈┈┈ ┈ ┈┈┈ (dotted line)
      │
   ┌──────────┐
   │  Task    │
   │ Validate │
   └──────────┘
```

**Write Operation (Output Association):**
```
   ┌──────────┐
   │  Task    │
   │ Update   │
   └──────────┘
      │
  ┈┈┈ ┈ ┈┈┈ (dotted line)
      ↓
┌──────────────┐
│ Database     │
│ Inventory    │
└──────────────┘
```

**Transformation Indicator:**
```
Data Source ┈┈┈ ◆ ┈┈┈ Data Target
            Transform point
            (orange circle)
```

---

### 2.4 Property Variables - Panel Representation

**Property Inspector:**
```
┌─────────────────────────────────────┐
│ Process Properties                  │
├─────────────────────────────────────┤
│ Property_RequestCount               │
│  Type: ItemDefinition_Integer       │
│  Value: [empty]                     │
├─────────────────────────────────────┤
│ Property_TotalAmount                │
│  Type: ItemDefinition_String        │
│  Value: [empty]                     │
├─────────────────────────────────────┤
│ Property_IsApproved                 │
│  Type: ItemDefinition_Boolean       │
│  Value: [empty]                     │
│  Readonly: ☐                        │
└─────────────────────────────────────┘
```

---

## 3. ASSOCIATION TYPES - Visual Distinctions

### 3.1 Data Input Association
```
Source ──→ DataInput ──→ [TASK]
```
**Characteristics:**
- Solid or dotted line
- Arrow pointing to task input
- May include transformation
- Source: DataObject, DataStore, Property, or Process DataInput

### 3.2 Data Output Association
```
[TASK] ──→ DataOutput ──→ Target
```
**Characteristics:**
- Solid or dotted line
- Arrow pointing away from task output
- May include transformation
- Target: DataObject, DataStore, Property, or Process DataOutput

### 3.3 Text Annotation Association
```
Element ┈┈┈ TextAnnotation
```
**Characteristics:**
- Dotted line
- No directional arrow (direction="None")
- Short, clear connection
- Should not cross other flows

---

## 4. COMPARISON MATRICES

### 4.1 Artifact Types Comparison

```
╔═══════════════╦════════════╦══════════╦═══════════╦═══════════╗
║ Artifact      ║ Persistent ║ Scope    ║ Visual    ║ Flow      ║
║ Type          ║            ║          ║ Impact    ║ Effect    ║
╠═══════════════╬════════════╬══════════╬═══════════╬═══════════╣
║ Data Object   ║ No*        ║ Process  ║ Explicit  ║ None      ║
║ (Single)      ║            ║ Instance ║ on canvas ║           ║
╠═══════════════╬════════════╬══════════╬═══════════╬═══════════╣
║ Data Object   ║ No*        ║ Process  ║ Explicit  ║ None      ║
║ (Collection)  ║            ║ Instance ║ on canvas ║           ║
╠═══════════════╬════════════╬══════════╬═══════════╬═══════════╣
║ Data Store    ║ Yes        ║ Global   ║ Explicit  ║ None      ║
║               ║            ║ (shared) ║ on canvas ║           ║
╠═══════════════╬════════════╬══════════╬═══════════╬═══════════╣
║ Group         ║ No         ║ Diagram  ║ Visual    ║ None      ║
║               ║            ║ (cosmetic)│ grouping ║ (cosmetic)║
╠═══════════════╬════════════╬══════════╬═══════════╬═══════════╣
║ Text          ║ No         ║ Diagram  ║ Explicit  ║ None      ║
║ Annotation    ║            ║ (cosmetic)│ on canvas ║ (cosmetic)║
╚═══════════════╩════════════╩══════════╩═══════════╩═══════════╝

* Data Objects can be persistent via states if stored in data store
```

### 4.2 Data Element Types Comparison

```
╔════════════════╦════════════╦═════════╦════════════╦════════════╗
║ Data Element   ║ Definition ║ Typing  ║ Multiple   ║ Persistent ║
║ Type           ║ Location   ║ System  ║ References ║            ║
╠════════════════╬════════════╬═════════╬════════════╬════════════╣
║ DataInput      ║ Task/      ║ Item    ║ No         ║ No         ║
║                ║ Process    ║ Def     ║            ║            ║
╠════════════════╬════════════╬═════════╬════════════╬════════════╣
║ DataOutput     ║ Task/      ║ Item    ║ No         ║ No         ║
║                ║ Process    ║ Def     ║            ║            ║
╠════════════════╬════════════╬═════════╬════════════╬════════════╣
║ DataObject     ║ Process    ║ Item    ║ Yes*       ║ No         ║
║                ║            ║ Def     ║ (Refs)     ║            ║
╠════════════════╬════════════╬═════════╬════════════╬════════════╣
║ DataStore      ║ Global     ║ Item    ║ Yes        ║ Yes        ║
║                ║ (Defns)    ║ Def     ║ (Refs)     ║            ║
╠════════════════╬════════════╬═════════╬════════════╬════════════╣
║ Property       ║ Process/   ║ Item    ║ No         ║ During     ║
║                ║ SubProcess ║ Def     ║            ║ execution  ║
╠════════════════╬════════════╬═════════╬════════════╬════════════╣
║ ItemDefinition ║ Global     ║ Type    ║ Yes        ║ N/A        ║
║                ║ (Defns)    ║ System  ║ (Refs)     ║ (Definition)║
╚════════════════╩════════════╩═════════╩════════════╩════════════╝

* DataObject References allow multiple instances of same object at different states
```

### 4.3 Storage Scope Matrix

```
┌─────────────────┬─────────────────┬──────────────────────┐
│ Element         │ Scope            │ Accessible From      │
├─────────────────┼─────────────────┼──────────────────────┤
│ DataObject      │ Process Instance │ Current process only │
├─────────────────┼─────────────────┼──────────────────────┤
│ DataStore       │ Global           │ All processes        │
├─────────────────┼─────────────────┼──────────────────────┤
│ Property        │ Container        │ Current container    │
│                 │ (Process/Task)   │ and children         │
├─────────────────┼─────────────────┼──────────────────────┤
│ ItemDefinition  │ Global           │ All elements         │
├─────────────────┼─────────────────┼──────────────────────┤
│ Group           │ Diagram          │ Cosmetic only        │
├─────────────────┼─────────────────┼──────────────────────┤
│ TextAnnotation  │ Diagram          │ Cosmetic only        │
└─────────────────┴─────────────────┴──────────────────────┘
```

---

## 5. SIZING RECOMMENDATIONS

### 5.1 Standard Element Dimensions

```
Data Object (Single)
├── Recommended: 100px × 80px
├── Minimum: 60px × 50px
└── Maximum: 200px × 150px

Data Object (Collection)
├── Recommended: 100px × 80px
├── Collection Marker: 3 lines, 2px each, 5px spacing
└── Marker positioned: 10-15px from bottom

Data Store
├── Recommended: 100px × 80px
├── Top Ellipse: 10px height
├── Body: 60px height
└── Bottom Ellipse: 10px height (darker)

Text Annotation
├── Recommended: 200px × 100px
├── Minimum: 150px × 60px
└── Maximum: 400px × 300px

Group
├── Minimum: Contains smallest element + padding (20px)
├── Padding: 10-20px around contained elements
└── Corner Radius: 8px

Association Line
├── Dash Pattern: 5px dash, 5px gap (dotted)
├── Arrow Size: 8px × 6px
└── Transformation Indicator: 4-6px radius circle
```

---

## 6. COLOR SCHEME

### 6.1 Default Colors

```
Element Type          Fill        Stroke      Text
─────────────────────────────────────────────────────
Data Object           #FFFFFF     #333333     #000000
Data Object Selected  #E3F2FD     #1976D2     #000000
Data Store            #FFFFFF     #333333     #000000
Data Store Selected   #E3F2FD     #1976D2     #000000
Group                 #FFFACD     #888888     #666666
                      (10% opacity)
Text Annotation       None        #666666     #000000
Association (data)    N/A         #999999     N/A
Association Selected  N/A         #1976D2     N/A
Transformation Marker N/A         N/A         #FF9800
```

### 6.2 Dark Mode Variant

```
Element Type          Fill        Stroke      Text
─────────────────────────────────────────────────────
Data Object           #2A2A2A     #CCCCCC     #FFFFFF
Data Object Selected  #1A4D7A     #64B5F6     #FFFFFF
Data Store            #2A2A2A     #CCCCCC     #FFFFFF
Data Store Selected   #1A4D7A     #64B5F6     #FFFFFF
Group                 #4A3F00     #666666     #CCCCCC
                      (10% opacity)
Text Annotation       None        #999999     #CCCCCC
```

---

## 7. INTERACTION STATES

### 7.1 Element States

```
Normal State
├── Opacity: 100%
├── Stroke: 1px
├── Cursor: pointer
└── Shadow: None

Hover State
├── Opacity: 100%
├── Stroke: 1.5px
├── Cursor: pointer
├── Shadow: 0 2px 4px rgba(0,0,0,0.1)
└── Fill Opacity: +5%

Selected State
├── Opacity: 100%
├── Fill: Light blue (#E3F2FD)
├── Stroke: 2px #1976D2
├── Shadow: 0 2px 8px rgba(25,118,210,0.3)
└── Cursor: move (if draggable)

Disabled State
├── Opacity: 50%
├── Stroke: 1px dashed
├── Cursor: not-allowed
└── Fill: #F5F5F5
```

### 7.2 Selection Indicators

```
┌─────────────────┐
│ Data Object     │  Normal (no fill highlight)
└─────────────────┘

┌─────────────────┐
│ Data Object     │  Hover (light shadow)
└─────────────────┘
  ▄▄▄▄▄▄▄▄▄▄▄▄▄

┌─────────────────┐
│ Data Object     │  Selected (blue fill, blue border)
└─────────────────┘
```

---

## 8. ACCESSIBILITY CONSIDERATIONS

### 8.1 Visual Accessibility

- Minimum contrast ratio: 4.5:1 for text
- Clear distinction between element types
- Distinct colors for different element types
- Patterns for color-blind users (dashed lines vs solid)
- Adequate minimum size for touch targets (44px × 44px)

### 8.2 Semantic Markup

```xml
<!-- Always include aria labels -->
<g role="img" aria-label="Purchase Order Data Object">
  <rect id="do_order"/>
  <text id="do_order_label"/>
</g>

<!-- Keyboard navigation -->
<svg tabindex="0" onKeyDown={handleKeyboard}>
  {/* Elements with tab indices for focus */}
</svg>
```

---

## 9. EXPORT FORMATS

### 9.1 SVG Export with Styling

```xml
<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg"
     xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
     xmlns:dc="http://www.omg.org/spec/DD/20100524/DC"
     viewBox="0 0 1200 800">
  <defs>
    <style>
      .data-object { fill: #FFFFFF; stroke: #333333; stroke-width: 1; }
      .data-object.selected { fill: #E3F2FD; stroke: #1976D2; stroke-width: 2; }
      .data-store { /* ... */ }
    </style>
  </defs>
  <!-- SVG content -->
</svg>
```

### 9.2 PNG/JPEG Export Considerations

- DPI: 96-150 for web, 300+ for print
- Background: Transparent or white
- Text: Ensure minimum 8px font size
- Line widths: Scale appropriately

---

## 10. RESPONSIVE SCALING

### 10.1 Canvas Scaling

```javascript
const baseScale = 1.0;
const minScale = 0.1;    // 10% zoom out
const maxScale = 5.0;    // 500% zoom in
const scaleStep = 0.1;   // 10% increment

// Maintain aspect ratio during responsive resize
const canvasWidth = containerWidth;
const canvasHeight = (canvasWidth / 16) * 9;  // 16:9 aspect
```

### 10.2 Element Scaling Rules

- Text size minimum: 8px (never scale below)
- Stroke width minimum: 0.5px
- Element padding: Scale with zoom level
- Touch targets: Always ≥ 44px at zoom 1.0

---

## Summary

This visual guide provides:
1. Standard SVG representations for all artifacts
2. Color schemes for different states and themes
3. Sizing recommendations for responsive design
4. Interaction state definitions
5. Comparison matrices for element relationships
6. Accessibility guidelines
7. Export format specifications
8. Scaling considerations

Reference these standards when implementing React components to ensure consistency across your BPMN editor.
