# BPMN 2.0 Detailed Research Summary

Complete research on BPMN 2.0 Connecting Objects and Swimlanes for React component implementation.

---

## Research Overview

This comprehensive research package provides detailed specifications for implementing BPMN 2.0 (Business Process Model and Notation 2.0) connecting objects and swimlanes as production-grade React components.

**Research Date**: January 2026
**Scope**: BPMN 2.0 Specification
**Format**: Implementation-ready specifications with code examples
**Target**: React component developers

---

## Deliverables

### 1. BPMN2.0_DETAILED_SPECS.md
**Comprehensive technical specifications** for all BPMN elements.

**Contents**:
- Sequence Flow (Normal, Conditional, Default)
  - Visual representation, styling rules, XML structure
  - React component props, implementation details
  - Usage rules and constraints

- Message Flow
  - Inter-pool communication specifications
  - Visual styling with dotted lines and markers
  - XML structure and connection rules

- Association (Normal, Directional, Bi-directional)
  - Artifact connection specifications
  - Visual differentiation between types
  - React props and rendering guidance

- Data Association (Input/Output)
  - Data flow specifications
  - Transformation and mapping support
  - XML element ordering (critical for parsing)

- Pools (White-box/Expanded, Black-box/Collapsed)
  - Container specifications for participants
  - Visual representation and styling
  - Process reference linking

- Lanes
  - Subdivision specifications within pools
  - Naming conventions and best practices
  - Nested/matrix structure support

- Multi-Instance Pools
  - Multiplicity markers and visual styles
  - Parallel vs sequential execution indicators
  - Runtime semantics

- Connection Rules & Constraints
  - Sequence flow constraints
  - Message flow constraints
  - Association and data association rules

- Visual Styling Summary Table
  - All elements with colors, line types, widths
  - Marker specifications
  - Label styling

- Complete XML Example
  - Real-world collaboration diagram
  - Process definitions with lanes
  - All connecting objects demonstrated

- React Component Guidance
  - Implementation considerations
  - State management patterns
  - Performance optimization tips

---

### 2. BPMN2.0_COMPONENT_INTERFACES.ts
**Complete TypeScript interfaces** for type-safe component development.

**Contents**:
- Type Enums (SequenceFlowType, AssociationDirection, GatewayType)
- Utility Types (Point, Bounds, Label)
- Connecting Object Interfaces
  - SequenceFlowProps (all variants)
  - ConditionalSequenceFlowProps
  - DefaultSequenceFlowProps
  - MessageFlowProps
  - AssociationProps
  - DataInputAssociationProps
  - DataOutputAssociationProps

- Swimlane Interfaces
  - PoolProps (with ParticipantMultiplicity)
  - LaneProps
  - LaneSet
  - Lane (data type)
  - ProcessElement
  - DataObject
  - DataStore

- Collaboration Interfaces
  - CollaborationProps
  - Participant
  - MessageDefinition

- Component Props
  - ConnectorComponentProps (common props for all connectors)
  - SwimLaneComponentProps (common props for swimlanes)

- XML Serialization Interfaces
  - SequenceFlowXML
  - MessageFlowXML
  - AssociationXML
  - DataAssociationXML
  - ParticipantXML
  - LaneXML
  - ProcessXML

- Utility Interfaces
  - RenderContext
  - ValidationResult/Error/Warning
  - DiagramState
  - BPMNExportOptions/ImportOptions

- React Component Type Definitions
  - Type-safe component definitions for all elements

- Standard Marker Definitions
  - SVG marker specifications (arrows, diamonds, circles)
  - Predefined STANDARD_MARKERS object

**Total Interfaces**: 60+
**Lines of Code**: 800+

---

### 3. BPMN2.0_VISUAL_REFERENCE.md
**Visual specifications and styling guide** for all BPMN elements.

**Contents**:
- Connecting Objects Visual Styles
  - Normal Sequence Flow (diagram, CSS, SVG)
  - Conditional Sequence Flow (diamond marker, labeling)
  - Default Sequence Flow (slash marker)
  - Message Flow (dotted line, circle marker)
  - Association (unidirectional, directional, bi-directional)
  - Data Association (input/output variants)

- Swimlanes Visual Styles
  - Pool (white-box expanded)
  - Pool (black-box collapsed)
  - Lane (horizontal subdivision)
  - Multi-instance Pool Marker (3 parallel lines)
  - Nested/Matrix Lanes (hierarchical structure)

- Color Palette & Styling Guide
  - Standard BPMN colors with hex values
  - Stroke styles (solid, dotted patterns)
  - Dash arrays for each line type

- Font Specifications
  - Flow labels (font, size, color, background)
  - Swimlane labels (vertical rotation, styling)

- Hitbox & Interaction Zones
  - Click detection areas for connectors
  - Label interaction zones

- Interactive States
  - Selected state (blue highlight, thicker stroke)
  - Highlighted state (gold, semi-transparent)
  - Disabled state (grayed out, reduced opacity)

- Responsive Sizing
  - Minimum dimensions for all elements
  - Scaling with zoom levels
  - Viewport-aware rendering

- SVG Export Template
  - Complete SVG structure
  - Marker definitions
  - Layer organization (pools, lanes, connectors, elements, labels)

- Common Pitfalls & Solutions
  - Label overlap prevention
  - Marker scaling at different zoom levels
  - Text readability at various angles
  - Multi-instance marker visibility

- Accessibility & Contrast
  - WCAG AA compliance (4.5:1 ratio)
  - Color-blind friendly combinations
  - High-contrast mode support

- Printing Considerations
  - Print-safe CSS
  - Page layout specifications
  - Margin and safe-print-area definitions

---

### 4. BPMN2.0_IMPLEMENTATION_EXAMPLES.md
**Production-ready code examples** for React component development.

**Contents**:
- Sequence Flow Implementations
  - NormalSequenceFlow component (with hitbox, label, selection state)
  - ConditionalSequenceFlow component (diamond marker, condition expression)
  - DefaultSequenceFlow component (slash marker, visual indicator)

- Message Flow Implementation
  - Complete MessageFlow component
  - Dotted line rendering
  - Label and message reference handling

- Association Implementation
  - Association component (normal, directional)
  - Direction handling (None, One, Both)
  - Visual differentiation

- Data Association Implementation
  - DataAssociation component
  - Input/output direction handling
  - Transformation support

- Pool Component Implementation
  - Pool rectangle with label area
  - Vertical label rendering
  - Multi-instance marker rendering
  - Collapsed state handling

- Lane Component Implementation
  - Lane subdivision within pools
  - Nested lane support
  - Label styling and positioning

- SVG Marker Definitions
  - Solid arrow marker (arrowSolid)
  - Message circle marker (messageCircle)
  - Association arrow marker (associationArrow)
  - Data arrow marker (dataArrow)

- Complete Diagram Example
  - Full BPMN diagram with multiple pools
  - Sequence flows, message flows, associations
  - Data associations demonstrated

- XML to React Conversion
  - parseBPMNXML function (XML → React props)
  - generateBPMNXML function (React props → XML)
  - Full round-trip serialization

- Canvas Rendering with Coordinates
  - calculateDiagramLayout function
  - Automatic positioning and sizing
  - Element and connector coordinate calculation

**Components Demonstrated**: 13
**Code Examples**: 40+
**Total Lines of Code**: 1500+

---

## Key Specifications

### Connecting Objects Summary

#### Sequence Flow
- **Normal**: Solid line, 2px, arrow marker
- **Conditional**: Solid line + diamond marker, with condition expression label
- **Default**: Solid line + slash marker, fallback execution path
- **Connection**: Within same pool/lane only
- **XML**: Uses `<sequenceFlow>` with optional `<conditionExpression>`

#### Message Flow
- **Visual**: Dotted line (5px dash, 3px gap), circle + arrow markers
- **Color**: Black (#000000)
- **Width**: 2px
- **Connection**: Between different pools/participants only
- **XML**: Uses `<messageFlow>` with optional `messageRef` attribute

#### Association
- **Visual**: Dotted line (3px dash, 2px gap), no markers (optional arrows)
- **Color**: Gray (#999999)
- **Width**: 1.5px
- **Direction**: None (default), One, Both
- **Connection**: Flow objects to artifacts (data objects, annotations)

#### Data Association
- **Visual**: Fine dotted line (2px dash, 2px gap), arrow marker
- **Color**: Dark gray (#555555)
- **Width**: 1.5px
- **Types**: Input (to task), Output (from task)
- **Features**: Transformation expressions, field assignments
- **XML**: `<dataInputAssociation>` or `<dataOutputAssociation>`

### Swimlanes Summary

#### Pool (White Box)
- **Visual**: Rectangle, 2px border, white fill
- **Label Area**: 30-50px wide, vertical text (-90° rotation)
- **Content**: Contains lanes and flow elements
- **Multi-instance**: 3 vertical lines marker (parallel indicator)
- **XML**: `<participant>` in collaboration, references `<process>`

#### Pool (Black Box)
- **Visual**: Same as white box but collapsed
- **Height**: 80-100px (smaller)
- **Content**: Hidden - only boundary visible
- **Usage**: External participants or abstracted processes
- **Connector**: Only message flows connect

#### Lane
- **Visual**: Horizontal subdivision, 1px border, light gray fill
- **Label Area**: 30px wide, vertical text, darker background
- **Height**: Minimum 60px per lane
- **Nesting**: Supports hierarchical (department → roles)
- **Constraints**: Sequence flows can cross lanes (same pool)

#### Multi-Instance Pool
- **Visual**: 3 parallel vertical lines on right edge
- **Position**: 3-5px inside right border, centered vertically
- **Styling**: 2px lines, 2px spacing
- **Semantics**: Represents parallel execution of same participant
- **XML**: `<participantMultiplicity>` with minimum/maximum attributes

### Connection Rules

```
SEQUENCE FLOW:
  ✓ Within same pool
  ✓ Cross lanes in same pool
  ✓ Between activities/events/gateways
  ✗ Cannot cross pool boundaries

MESSAGE FLOW:
  ✓ Between different pools
  ✓ Between activities/events
  ✓ From/to pool boundary (black box)
  ✗ Cannot connect within same pool

ASSOCIATION:
  ✓ Flow objects to artifacts
  ✓ Directional or bidirectional
  ✓ Documentation/clarification only
  ✗ Does not affect sequence

DATA ASSOCIATION:
  ✓ Data objects to/from tasks
  ✓ Supports transformations
  ✓ Multiple sources to one target
  ✗ Does not affect sequence flow
```

---

## XML Element Ordering (Critical)

**Data Association Element Order** (MUST follow this):
```xml
<dataInputAssociation id="...">
  <sourceRef>...</sourceRef>        <!-- 1st: Sources (0 to many) -->
  <sourceRef>...</sourceRef>        <!-- Multiple allowed -->
  <targetRef>...</targetRef>        <!-- 2nd: Target (required) -->
  <transformation>...</transformation> <!-- 3rd: Optional transformation -->
  <assignment>...</assignment>      <!-- 4th: Optional assignments -->
</dataInputAssociation>
```

**IMPORTANT**: Incorrect ordering causes parsing failures in some BPMN tools.

---

## Color Specifications

```typescript
PRIMARY_COLORS = {
  black:        '#000000',  // Flows, borders
  darkGray:     '#333333',  // Secondary elements
  mediumGray:   '#555555',  // Data flows
  lightGray:    '#999999',  // Associations
  pale:         '#CCCCCC',  // Lane borders
  veryLight:    '#F5F5F5',  // Lane backgrounds
  white:        '#FFFFFF',  // Pool backgrounds
}

INTERACTIVE_COLORS = {
  selected:     '#0066CC',  // Blue highlight
  highlighted:  '#FFD700',  // Gold (hover/preview)
  disabled:     '#CCCCCC',  // Gray (disabled)
  error:        '#FF0000',  // Red (errors)
}
```

---

## Styling Quick Reference

| Element | Stroke | Width | Pattern | Color | Markers |
|---------|--------|-------|---------|-------|---------|
| Sequence Flow | Solid | 2px | - | #000000 | Arrow |
| Conditional Flow | Solid | 2px | - | #000000 | Diamond + Arrow |
| Default Flow | Solid | 2px | - | #000000 | Slash + Arrow |
| Message Flow | Dotted | 2px | 5,3 | #000000 | Circle + Arrow |
| Association | Dotted | 1.5px | 3,2 | #999999 | Optional arrow |
| Data Association | Dotted | 1.5px | 2,2 | #555555 | Arrow |
| Pool Border | Solid | 2px | - | #000000 | None |
| Lane Border | Solid | 1px | - | #CCCCCC | None |

---

## Implementation Checklist

### Phase 1: Core Connectors
- [ ] NormalSequenceFlow component
- [ ] ConditionalSequenceFlow component
- [ ] DefaultSequenceFlow component
- [ ] Message flow component
- [ ] SVG marker definitions

### Phase 2: Associations & Data
- [ ] Association component (all directions)
- [ ] DataInputAssociation component
- [ ] DataOutputAssociation component
- [ ] Transformation expression support

### Phase 3: Swimlanes
- [ ] Pool component (white-box)
- [ ] Pool component (black-box)
- [ ] Lane component
- [ ] Multi-instance marker rendering
- [ ] Nested lane support

### Phase 4: Diagram Integration
- [ ] Collaboration container
- [ ] Layout calculation
- [ ] Connection validation
- [ ] XML import/export

### Phase 5: Interactive Features
- [ ] Selection state management
- [ ] Hover/highlight effects
- [ ] Drag-to-connect flows
- [ ] Edit labels in-place
- [ ] Resize pools/lanes

### Phase 6: Advanced Features
- [ ] Zoom and pan
- [ ] Undo/redo support
- [ ] Keyboard shortcuts
- [ ] Copy/paste elements
- [ ] Diagram validation

### Phase 7: Accessibility & Polish
- [ ] WCAG AA compliance
- [ ] Keyboard navigation
- [ ] High-contrast mode
- [ ] Print support
- [ ] Documentation

---

## Validation Rules

### Connection Validation

```typescript
validateConnection(source: string, target: string, type: 'sequence' | 'message'): {
  isValid: boolean;
  error?: string;
} {
  // Sequence flow: Same pool only
  if (type === 'sequence') {
    if (getPool(source) !== getPool(target)) {
      return {
        isValid: false,
        error: 'Sequence flows cannot cross pool boundaries',
      };
    }
  }

  // Message flow: Different pools only
  if (type === 'message') {
    if (getPool(source) === getPool(target)) {
      return {
        isValid: false,
        error: 'Message flows must connect different pools',
      };
    }
  }

  return { isValid: true };
}
```

### Lane Naming Validation

```typescript
validateLaneName(name: string): { isValid: boolean; warning?: string } {
  // Check for individual names
  const individualNamePattern = /^[A-Z][a-z]+ [A-Z][a-z]+$/;
  if (individualNamePattern.test(name)) {
    return {
      isValid: true,
      warning: 'Lane should represent role, not individual name',
    };
  }

  // Check for vague names
  if (name.includes('Department') && !name.includes('Sales|Finance|HR')) {
    return {
      isValid: true,
      warning: 'Lane name is too vague - specify the role',
    };
  }

  return { isValid: true };
}
```

---

## Performance Optimization Tips

1. **Hitbox Rendering**: Cache invisible hitbox paths
2. **Label Positioning**: Pre-calculate label positions, update on zoom only
3. **Marker Definitions**: Define once in SVG `<defs>`, reuse by ID
4. **Connector Updates**: Debounce waypoint updates (100ms)
5. **Large Diagrams**: Virtualize lane content (render only visible tasks)
6. **SVG Rendering**: Use `React.memo` for static flow components
7. **Path Calculations**: Cache connector paths in component state

---

## Browser Compatibility

**Recommended Targets**:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

**Key Requirements**:
- SVG support (all targets)
- CSS transforms (for label rotation)
- JavaScript ES2020+ (async/await, optional chaining)
- TypeScript 4.5+ (for type definitions)

---

## Testing Strategy

### Unit Tests
- Connection validation logic
- XML serialization/deserialization
- Coordinate calculations
- Layout algorithms

### Integration Tests
- Component rendering with sample data
- Interactive state changes
- XML round-trip (import → display → export)
- Zoom/pan functionality

### Visual Tests
- Screenshot comparisons against specifications
- Responsive behavior at different viewport sizes
- Print output validation
- Accessibility audit (axe, WAVE)

### Performance Tests
- Large diagram rendering (1000+ elements)
- Zoom performance (smooth scaling)
- Memory leaks (long-running sessions)
- Canvas rendering benchmarks

---

## Future Enhancements

1. **Annotations**: Support text annotations with associations
2. **Grouping**: Element grouping and sub-processes
3. **Decision Tables**: DMN integration for gateway rules
4. **Simulation**: Process simulation and statistics
5. **Collaboration**: Real-time multi-user editing
6. **Analytics**: Process metrics and KPI visualization
7. **Mobile**: Touch-optimized interface for tablets
8. **Export**: PNG, PDF, and image export with high DPI
9. **Templates**: Pre-built diagram templates and patterns
10. **Validation**: Real-time linting and best-practice checks

---

## Sources

### Primary References
1. [Camunda - BPMN 2.0 Symbols Reference](https://camunda.com/bpmn/reference/)
2. [Camunda - Conditional and Default Sequence Flows](https://docs.camunda.org/manual/latest/reference/bpmn20/gateways/sequence-flow/)
3. [ProcessMind - BPMN Connecting Objects](https://processmind.com/resources/docs/bpmn-building-blocks/connecting-objects)
4. [ProcessMind - BPMN Pools and Lanes](https://processmind.com/resources/docs/bpmn-building-blocks/pools-and-swimlanes)
5. [Signavio - BPMN Pools and Lanes](https://www.signavio.com/post/bpmn-pools-and-lanes/)
6. [Visual Paradigm - Data Objects in BPMN](https://www.visual-paradigm.com/guide/bpmn/how-to-use-data-objects-in-bpmn/)
7. [Visual Paradigm - BPMN Sequence and Message Flow](https://www.visual-paradigm.com/support/documents/vpuserguide/2821/286/56998_sequenceandm.html)
8. [Flowable - BPMN 2.0 Constructs](https://www.flowable.com/open-source/docs/bpmn/ch07b-BPMN-Constructs/)
9. [OMG - BPMN 2.0 Official Specification](http://www.omg.org/spec/BPMN/2.0/)
10. [Enterprise Architect - BPMN 2.0 Modeling Guide](https://sparxsystems.com/enterprise_architect_user_guide/14.0/model_domains/modeling_with_bpmn_2_0.html)

### Supplementary Resources
- Modeling Guidelines: https://www.modeling-guidelines.org/
- BPMN Tips: https://bpmtips.com/
- Good E-Learning: https://goodelearning.com/
- Heflo Blog: https://www.heflo.com/blog/

---

## Document Organization

All research materials are organized in `/Users/guyelisha/NGWorkshopContext/`:

```
BPMN2.0_RESEARCH_SUMMARY.md           ← This file (overview & links)
BPMN2.0_DETAILED_SPECS.md             ← Technical specifications
BPMN2.0_COMPONENT_INTERFACES.ts       ← TypeScript interfaces
BPMN2.0_VISUAL_REFERENCE.md           ← Visual & styling guide
BPMN2.0_IMPLEMENTATION_EXAMPLES.md    ← Code examples
```

**Total Documentation**: ~6,000 lines of specifications
**Code Examples**: 40+ complete implementations
**Interfaces**: 60+ TypeScript definitions
**Visual Diagrams**: 30+ ASCII and reference diagrams

---

## Next Steps

1. **Review Specifications**: Start with BPMN2.0_DETAILED_SPECS.md
2. **Set Up TypeScript**: Use BPMN2.0_COMPONENT_INTERFACES.ts as foundation
3. **Implement Components**: Follow BPMN2.0_IMPLEMENTATION_EXAMPLES.md
4. **Style with Reference**: Use BPMN2.0_VISUAL_REFERENCE.md for accurate rendering
5. **Test & Validate**: Ensure compliance with BPMN 2.0 specification
6. **Deploy**: Integrate into your React application

---

**Research Completed**: January 2026
**Status**: Ready for Implementation
**Quality Level**: Production-Ready Specifications
**Compliance**: BPMN 2.0 Official Specification
