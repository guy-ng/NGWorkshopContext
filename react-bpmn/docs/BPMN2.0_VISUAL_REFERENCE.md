# BPMN 2.0 Visual Reference Guide

Complete visual and styling specifications for implementing BPMN 2.0 connecting objects and swimlanes.

---

## 1. CONNECTING OBJECTS - VISUAL STYLES

### 1.1 Sequence Flow Variants

#### Normal Sequence Flow
```
Task A ———————→ Task B
       (solid line, 2px, arrow)
```

**CSS/SVG Properties**:
```css
stroke: #000000;
stroke-width: 2px;
stroke-linecap: butt;
stroke-linejoin: miter;
fill: none;
marker-end: url(#arrowSolid);
```

**SVG Path Example**:
```xml
<path
  d="M 100,100 L 300,100"
  stroke="#000000"
  stroke-width="2"
  fill="none"
  marker-end="url(#arrowSolid)" />
```

---

#### Conditional Sequence Flow
```
         ◇
        /
Gw1 ———●———→ Task1
       (diamond marker + arrow)
```

**Styling**:
- Main line: Same as normal (solid, 2px, black)
- Diamond marker: 8px × 8px square rotated 45°
- Diamond fill: #FFFFFF (white)
- Diamond stroke: #000000 (black), 2px

**SVG Diamond Marker Definition**:
```xml
<marker
  id="conditionalMarker"
  markerWidth="16"
  markerHeight="16"
  refX="8"
  refY="8"
  markerUnits="userSpaceOnUse">
  <path
    d="M 8 0 L 16 8 L 8 16 L 0 8 Z"
    fill="#FFFFFF"
    stroke="#000000"
    stroke-width="2" />
</marker>
```

**Label Placement**:
- Position: above or alongside the line
- Background: white rectangle with 4px padding
- Font-size: 12px
- Font-color: #000000
- Example label: "amount > 1000"

---

#### Default Sequence Flow
```
         /
        /
Gw1 ————●———→ Task_default
       (slash marker + arrow)
```

**Styling**:
- Main line: Solid, 2px, black
- Slash marker: 45-degree line, 6-8px long
- Slash position: offset 3px from source element
- Slash color: #000000

**SVG Implementation**:
```xml
<!-- Main line with arrow -->
<path
  d="M 100,100 L 300,100"
  stroke="#000000"
  stroke-width="2"
  fill="none"
  marker-end="url(#arrowSolid)" />

<!-- Slash marker -->
<line
  x1="103"
  y1="97"
  x2="110"
  y2="104"
  stroke="#000000"
  stroke-width="2" />
```

---

### 1.2 Message Flow

```
Pool A  ┌─────────────┐       ┌──────────────┐  Pool B
        │   Task A    │       │  Event B     │
        │    (Send)   │       │  (Receive)   │
        └──────┬──────┘       └──────┬───────┘
               │                     │
               ○.................●
                  (dotted line)
```

**Styling**:
- Line: Dotted pattern
- Dash array: `5 3` (5px dash, 3px gap)
- Stroke: #000000
- Stroke width: 2px
- Source marker: Circle (8px diameter, white fill, black stroke)
- Target marker: Arrow (standard arrowhead)

**SVG Definition**:
```xml
<path
  d="M 180,150 L 620,150"
  stroke="#000000"
  stroke-width="2"
  stroke-dasharray="5,3"
  fill="none"
  marker-start="url(#messageCircle)"
  marker-end="url(#arrowSolid)" />

<!-- Circle marker definition -->
<marker
  id="messageCircle"
  markerWidth="12"
  markerHeight="12"
  refX="6"
  refY="6"
  markerUnits="userSpaceOnUse">
  <circle
    cx="6"
    cy="6"
    r="4"
    fill="#FFFFFF"
    stroke="#000000"
    stroke-width="2" />
</marker>
```

**Label Positioning**:
- Position: above the line, centered
- Background: white rectangle
- Font-size: 12px
- Example: "Send Order"

---

### 1.3 Association

```
Task ═════════════════ Annotation
(dotted, light gray)
```

**Styling**:
- Line: Dotted, light pattern
- Dash array: `3 2` (lighter than message flow)
- Stroke: #999999 (medium gray)
- Stroke width: 1.5px
- NO markers or arrows
- Lighter visual weight

**CSS/SVG Properties**:
```css
stroke: #999999;
stroke-width: 1.5px;
stroke-dasharray: 3,2;
fill: none;
stroke-linecap: butt;
```

**SVG Path Example**:
```xml
<path
  d="M 150,150 L 350,250"
  stroke="#999999"
  stroke-width="1.5"
  stroke-dasharray="3,2"
  fill="none" />
```

---

#### Directional Association
```
DataObj ─────●──→ Task
           (arrow toward target)
```

**Styling** (extends basic association):
- Same line style
- Arrow marker at target
- Arrowhead color: #666666 (darker gray)
- Arrow size: 6px

**SVG Marker**:
```xml
<marker
  id="associationArrow"
  markerWidth="10"
  markerHeight="10"
  refX="9"
  refY="3"
  markerUnits="strokeWidth"
  orient="auto">
  <path
    d="M 0 0 L 10 3 L 0 6 Z"
    fill="#666666" />
</marker>
```

---

#### Bi-Directional Association
```
DataObj ←───●───→ Task
         (arrows both sides)
```

**Styling**:
- Same as directional
- Arrow markers at BOTH ends
- Both arrows same size and color

---

### 1.4 Data Association

```
DataObject ……●──→ Task (Input)
            (fine dotted)

Task ──→●…… DataObject (Output)
       (fine dotted)
```

**Styling - Input Association**:
- Line: Fine dotted pattern
- Dash array: `2 2` (very fine)
- Stroke: #555555 (darker gray than association)
- Stroke width: 1.5px
- Arrow: Solid arrowhead pointing to target
- Arrow color: #333333

**Styling - Output Association**:
- Same as input but arrow points away from source

**SVG Definition**:
```xml
<!-- Data Input Association -->
<path
  d="M 100,250 L 200,200"
  stroke="#555555"
  stroke-width="1.5"
  stroke-dasharray="2,2"
  fill="none"
  marker-end="url(#dataArrow)" />

<!-- Data arrow marker (darker) -->
<marker
  id="dataArrow"
  markerWidth="10"
  markerHeight="10"
  refX="9"
  refY="3"
  markerUnits="strokeWidth"
  orient="auto">
  <path
    d="M 0 0 L 10 3 L 0 6 Z"
    fill="#333333" />
</marker>
```

---

## 2. SWIMLANES - VISUAL STYLES

### 2.1 Pool (White Box - Expanded)

```
╔════════════════════════════════════════╗
║ A  ┌──────────────────────────────┐    ║
║ u  │  Role 1                      │    ║
║ t  │  [Task1] → [Task2]          │    ║
║ o  ├──────────────────────────────┤    ║
║ m  │  Role 2                      │    ║
║ a  │  [Task3] → [Task4]          │    ║
║ t  └──────────────────────────────┘    ║
║ e                                       ║
║ d  (Vertical label)                    ║
╚════════════════════════════════════════╝
 P   Customer Process (Pool)               P
 a                                         o
 r   Width: ~600px                         o
 t   Height: ~300px                        l
 i   Min: 100px height
```

**Styling**:
- Border: 2px solid #000000
- Background: #FFFFFF (white)
- Corner radius: 0 (square corners)
- Padding: 10px

**Label**:
- Position: Left side, vertical
- Rotation: -90 degrees
- Font-size: 12-14px
- Font-family: Arial, sans-serif
- Color: #000000
- Width: 30-50px label area

**SVG Example**:
```xml
<!-- Pool rectangle -->
<rect
  x="50"
  y="50"
  width="600"
  height="300"
  stroke="#000000"
  stroke-width="2"
  fill="#FFFFFF" />

<!-- Label background (for visual clarity) -->
<rect
  x="50"
  y="50"
  width="30"
  height="300"
  stroke="#000000"
  stroke-width="2"
  fill="#F0F0F0" />

<!-- Vertical label text -->
<text
  x="65"
  y="200"
  transform="rotate(-90 65 200)"
  text-anchor="middle"
  font-size="12"
  font-family="Arial"
  fill="#000000">
  Customer
</text>
```

---

### 2.2 Pool (Black Box - Collapsed)

```
╔══════════════════════════╗
║  Supplier (Collapsed)    ║
╚══════════════════════════╝
        ↑ (Message In)
        │
     (no internal details)
```

**Styling** (same as white box but):
- Height: 80-100px (smaller)
- NO internal lanes or elements visible
- NO dividing lines
- Clean, simple container
- May have visual indicator (e.g., small icon) showing it's collapsed

**SVG Example**:
```xml
<!-- Collapsed pool rectangle -->
<rect
  x="50"
  y="50"
  width="400"
  height="100"
  stroke="#000000"
  stroke-width="2"
  fill="#FFFFFF" />

<!-- Collapsed indicator (optional small arrow or text) -->
<text
  x="60"
  y="105"
  font-size="12"
  fill="#999999">
  (External Process)
</text>
```

---

### 2.3 Lane (Horizontal Subdivision)

```
┌─────────────────────────────────────┐
│ Sales Rep    [Task1] → [Task2]     │
├─────────────────────────────────────┤
│ Manager      [Task3] → [Task4]     │
└─────────────────────────────────────┘
```

**Styling**:
- Border (dividing line): 1px solid #CCCCCC
- Background: #F5F5F5 (light gray) or #FFFFFF (white)
- Label area width: 30px (left side)
- Label area background: Slightly darker (#E8E8E8)
- Height: minimum 60px per lane

**Label**:
- Position: Left, vertical
- Rotation: -90 degrees
- Font-size: 12px
- Padding: 5px

**SVG Example**:
```xml
<!-- Lane 1 container -->
<rect
  x="50"
  y="50"
  width="600"
  height="150"
  stroke="#CCCCCC"
  stroke-width="1"
  fill="#F5F5F5" />

<!-- Lane label area -->
<rect
  x="50"
  y="50"
  width="30"
  height="150"
  fill="#E8E8E8"
  stroke="#CCCCCC"
  stroke-width="1" />

<!-- Lane label -->
<text
  x="65"
  y="125"
  transform="rotate(-90 65 125)"
  text-anchor="middle"
  font-size="12"
  fill="#000000">
  Sales Rep
</text>

<!-- Dividing line between lanes -->
<line
  x1="50"
  y1="200"
  x2="650"
  y2="200"
  stroke="#CCCCCC"
  stroke-width="1" />
```

---

### 2.4 Multi-Instance Pool Marker

```
╔════════════════════════════╗
║ Order Handler         ║ ║ ║
║ (Process x 5 parallel) ║ ║
║                        ║ ║
╚════════════════════════════╝
    (3 vertical lines on right)
```

**Marker Styling**:
- Position: 3-5px inside right border
- Number of lines: 3 (parallel marker)
- Line width: 2px
- Line color: #000000
- Spacing between lines: 2px
- Line height: 15-20px
- Centered vertically within pool

**SVG Example**:
```xml
<!-- Multi-instance marker (3 parallel lines) -->
<g id="multiInstanceMarker">
  <line
    x1="595"
    y1="155"
    x2="595"
    y2="175"
    stroke="#000000"
    stroke-width="2" />
  <line
    x1="600"
    y1="155"
    x2="600"
    y2="175"
    stroke="#000000"
    stroke-width="2" />
  <line
    x1="605"
    y1="155"
    x2="605"
    y2="175"
    stroke="#000000"
    stroke-width="2" />
</g>
```

---

### 2.5 Nested/Matrix Lanes

```
┌─ Sales Department ──────────────────┐
│ ┌─ Sales Manager ──────────────┐    │
│ │  [Approve] → [Send]         │    │
│ ├──────────────────────────────┤    │
│ │ Sales Rep                    │    │
│ │  [Create] → [Review]        │    │
│ └──────────────────────────────┘    │
├─ Finance Department ────────────────┤
│ ┌─ Finance Manager ────────────┐    │
│ │  [Invoice] → [Approve]      │    │
│ └──────────────────────────────┘    │
└─────────────────────────────────────┘
  (Outer lane = department)
  (Inner lanes = roles)
```

**Styling**:
- Outer lanes: Thicker border (2px), darker label area
- Inner lanes: Thinner border (1px), lighter colors
- Visual hierarchy clear with different shades
- Spacing maintained between levels

---

## 3. COLOR PALETTE & STYLING GUIDE

### Standard Colors

```typescript
const BPMN_COLORS = {
  // Primary elements
  primary: '#000000',        // Black (flows, borders)
  primaryLight: '#333333',   // Dark gray (secondary)

  // Backgrounds
  white: '#FFFFFF',          // White (default fill)
  lightGray: '#F5F5F5',      // Light gray (lanes)
  mediumGray: '#E8E8E8',     // Medium gray (labels)

  // Lines & borders
  border: '#CCCCCC',         // Light gray (lane borders)
  associationLine: '#999999', // Gray (associations)
  dataLine: '#555555',       // Darker gray (data flows)

  // States
  selected: '#0066CC',       // Blue (selected state)
  highlighted: '#FFD700',    // Gold (highlighted)
  disabled: '#CCCCCC',       // Gray (disabled)
  error: '#FF0000',          // Red (errors)
};
```

### Stroke Styles

```typescript
const STROKE_STYLES = {
  solidNormal: {
    strokeWidth: 2,
    dashArray: 'none',
    lineCap: 'butt',
    lineJoin: 'miter',
  },

  dottedMessage: {
    strokeWidth: 2,
    dashArray: '5,3',
    lineCap: 'round',
    lineJoin: 'round',
  },

  dottedAssociation: {
    strokeWidth: 1.5,
    dashArray: '3,2',
    lineCap: 'butt',
    lineJoin: 'miter',
  },

  dottedData: {
    strokeWidth: 1.5,
    dashArray: '2,2',
    lineCap: 'butt',
    lineJoin: 'miter',
  },
};
```

---

## 4. FONT SPECIFICATIONS

### Labels on Flows

```typescript
const FLOW_LABEL_FONT = {
  fontSize: 12,
  fontFamily: 'Arial, Helvetica, sans-serif',
  fontColor: '#000000',
  fontWeight: 'normal',
  backgroundColor: '#FFFFFF',
  padding: 4, // px
  borderRadius: 2,
  maxWidth: 150, // px (wrap after this)
};
```

### Pool/Lane Labels

```typescript
const SWIMLANE_LABEL_FONT = {
  fontSize: 12,
  fontFamily: 'Arial, Helvetica, sans-serif',
  fontColor: '#000000',
  fontWeight: 'normal',
  rotation: -90, // degrees (vertical)
  textAnchor: 'middle',
  maxWidth: 30, // px (label area width)
};
```

---

## 5. HITBOX & INTERACTION ZONES

### Connector Hitbox

```
Regular connector line:
  Actual line: 2px
  Clickable area: 6-8px total (3-4px on each side)

This allows easier clicking on lines without being pixel-perfect.

SVG implementation:
<path
  d="M 100,100 L 300,100"
  stroke="#000000"
  stroke-width="2"
  fill="none" />

<!-- Invisible hitbox (wider for click detection) -->
<path
  d="M 100,100 L 300,100"
  stroke="transparent"
  stroke-width="8"
  fill="none"
  opacity="0"
  style="cursor: pointer;" />
```

### Label Hitbox

```
Label background rectangle:
  Padding: 4px on all sides
  Click-sensitive area extends 2px beyond text bounds
```

---

## 6. INTERACTIVE STATES

### Selected State

```css
/* Selected connector */
stroke: #0066CC; /* Change to blue */
stroke-width: 3px; /* Slightly thicker */
opacity: 1;

/* Selected swimlane */
border-color: #0066CC;
border-width: 3px;
box-shadow: inset 0 0 5px rgba(0, 102, 204, 0.3);
```

### Highlighted State

```css
/* Highlighted connector (preview/hover) */
stroke: #FFD700; /* Change to gold */
stroke-width: 2px;
opacity: 0.8;

/* Highlighted swimlane */
background-color: rgba(255, 215, 0, 0.1);
border-color: #FFD700;
```

### Disabled State

```css
/* Disabled connector */
stroke: #CCCCCC;
stroke-width: 2px;
opacity: 0.5;

/* Disabled swimlane */
opacity: 0.5;
background-color: rgba(200, 200, 200, 0.1);
color: #999999;
```

---

## 7. RESPONSIVE SIZING

### Minimum Dimensions

```typescript
const MINIMUM_DIMENSIONS = {
  pool: {
    width: 200,
    height: 100,
  },

  lane: {
    width: 200,
    height: 60,
  },

  connector: {
    minLength: 20, // pixels
    minWaypoints: 2, // start, end
  },

  label: {
    minWidth: 40,
    minHeight: 20,
    padding: 4,
  },
};
```

### Scaling with Zoom

```typescript
// When zoom level changes
const scaledStrokeWidth = baseStrokeWidth / zoomLevel;
const scaledLabelSize = baseFontSize / zoomLevel;
const scaledMarkerSize = baseMarkerSize / zoomLevel;

// But maintain minimum visibility
const MIN_STROKE_WIDTH = 1;
const MIN_FONT_SIZE = 8;
```

---

## 8. EXPORT/DISPLAY FORMAT

### SVG Export Template

```xml
<svg
  xmlns="http://www.w3.org/2000/svg"
  xmlns:xlink="http://www.w3.org/1999/xlink"
  viewBox="0 0 1200 800"
  width="1200"
  height="800">

  <!-- Define markers -->
  <defs>
    <marker id="arrowSolid">...</marker>
    <marker id="conditionalMarker">...</marker>
    <marker id="messageCircle">...</marker>
    <!-- etc -->
  </defs>

  <!-- Background -->
  <rect width="1200" height="800" fill="#FFFFFF" />

  <!-- Pools (bottom layer) -->
  <g id="pools">...</g>

  <!-- Lanes (within pools) -->
  <g id="lanes">...</g>

  <!-- Connectors (middle layer) -->
  <g id="connectors">...</g>

  <!-- Flow elements (top layer) -->
  <g id="elements">...</g>

  <!-- Labels (top layer) -->
  <g id="labels">...</g>

</svg>
```

---

## 9. COMMON PITFALLS & SOLUTIONS

### Problem: Labels overlap connectors
**Solution**: Calculate label position to avoid connector path
- Place label at connector midpoint offset by 20px
- Auto-rotate label to match line angle
- Adjust background rectangle size to contain text

### Problem: Connector arrows don't scale with zoom
**Solution**: Use SVG marker `markerUnits="strokeWidth"`
- Scales automatically with stroke-width
- Alternatively, scale markers separately based on zoom level

### Problem: Multi-instance markers not visible at small zoom
**Solution**: Set minimum marker size
```typescript
const markerLineWidth = Math.max(2, 2 / zoomLevel);
const markerSpacing = Math.max(2, 2 / zoomLevel);
```

### Problem: Text becomes unreadable at certain angles
**Solution**: Flip text rotation if angle > 90 degrees
```typescript
const angle = Math.atan2(endY - startY, endX - startX);
const rotation = angle > Math.PI / 2 || angle < -Math.PI / 2
  ? angle + Math.PI
  : angle;
```

---

## 10. ACCESSIBILITY & CONTRAST

### Color Contrast Ratios

All BPMN elements should meet WCAG AA standards (4.5:1 ratio):

```
✓ Black on White: #000000 on #FFFFFF (21:1) - Excellent
✓ Dark Gray on White: #333333 on #FFFFFF (12.6:1) - Excellent
✓ Medium Gray on White: #666666 on #FFFFFF (7:1) - Excellent
✓ Gray line on White: #999999 on #FFFFFF (3.2:1) - Good
✓ Light Gray on White: #CCCCCC on #FFFFFF (1.6:1) - Poor (needs context)

Selected Blue: #0066CC on #FFFFFF (7.3:1) - Excellent
Gold: #FFD700 on #FFFFFF (3.9:1) - Good
```

### Recommendations

1. Use color + pattern combinations for color-blind users
2. Provide text labels for all visual markers
3. Ensure adequate contrast for small text
4. Support high-contrast mode

---

## 11. PRINTING CONSIDERATIONS

### Print-Safe Styles

```css
@media print {
  /* Simplify colors for print */
  .bpmn-pool {
    border: 1px solid black;
    background: white;
  }

  .bpmn-lane {
    border: 0.5px solid gray;
    background: white;
  }

  .bpmn-connector {
    stroke: black;
    stroke-width: 1px;
  }

  /* Remove interactive elements */
  .bpmn-hitbox {
    display: none;
  }

  /* Adjust font for print */
  text {
    font-size: 11pt;
  }
}
```

### Page Layout

```
┌─ A4 / Letter (210×297mm / 8.5×11") ─┐
│                                       │
│  ┌─ Safe Print Area ──────────────┐  │
│  │ (margin: 0.5" / 12.7mm)        │  │
│  │                                │  │
│  │  [BPMN Diagram]                │  │
│  │  Width: max 190mm (7.5")       │  │
│  │  Height: max 260mm (10.2")     │  │
│  │                                │  │
│  └────────────────────────────────┘  │
│                                       │
└───────────────────────────────────────┘
```

---

**Last Updated**: January 2026
**Version**: 1.0
**For**: React BPMN 2.0 Component Implementation
