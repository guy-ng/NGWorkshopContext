# BPMN 2.0 Implementation Examples

Practical code examples for implementing BPMN 2.0 connecting objects and swimlanes as React components.

---

## 1. SEQUENCE FLOW IMPLEMENTATIONS

### 1.1 Normal Sequence Flow Component

```typescript
import React from 'react';

interface NormalSequenceFlowProps {
  id: string;
  sourceRef: string;
  targetRef: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  name?: string;
  color?: string;
  strokeWidth?: number;
  isSelected?: boolean;
}

export const NormalSequenceFlow: React.FC<NormalSequenceFlowProps> = ({
  id,
  startX,
  startY,
  endX,
  endY,
  name,
  color = '#000000',
  strokeWidth = 2,
  isSelected = false,
}) => {
  // Calculate line path
  const pathD = `M ${startX},${startY} L ${endX},${endY}`;

  // Calculate label position (midpoint, offset above)
  const midX = (startX + endX) / 2;
  const midY = (startY + endY) / 2;
  const offset = 15;

  // Calculate angle for label rotation
  const angle = Math.atan2(endY - startY, endX - startX) * (180 / Math.PI);
  const labelRotate = angle > 90 || angle < -90 ? angle + 180 : angle;

  return (
    <g id={id} className="sequence-flow">
      {/* Invisible hitbox for easier clicking */}
      <path
        d={pathD}
        stroke="transparent"
        strokeWidth={Math.max(6, strokeWidth * 3)}
        fill="none"
        style={{ cursor: 'pointer' }}
        pointerEvents="stroke"
      />

      {/* Visible line */}
      <path
        d={pathD}
        stroke={isSelected ? '#0066CC' : color}
        strokeWidth={isSelected ? strokeWidth + 1 : strokeWidth}
        fill="none"
        markerEnd="url(#arrowSolid)"
        strokeLinecap="butt"
        strokeLinejoin="miter"
      />

      {/* Label */}
      {name && (
        <g>
          {/* Label background */}
          <rect
            x={midX - 40}
            y={midY - offset - 15}
            width={80}
            height={20}
            fill="#FFFFFF"
            stroke="#F0F0F0"
            strokeWidth={1}
            rx={2}
          />

          {/* Label text */}
          <text
            x={midX}
            y={midY - offset}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={12}
            fontFamily="Arial"
            fill={color}
          >
            {name}
          </text>
        </g>
      )}
    </g>
  );
};
```

---

### 1.2 Conditional Sequence Flow Component

```typescript
interface ConditionalSequenceFlowProps {
  id: string;
  sourceRef: string;
  targetRef: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  conditionExpression: string;
  color?: string;
  strokeWidth?: number;
  diamondMarkerSize?: number;
  isSelected?: boolean;
}

export const ConditionalSequenceFlow: React.FC<ConditionalSequenceFlowProps> =
  ({
    id,
    startX,
    startY,
    endX,
    endY,
    conditionExpression,
    color = '#000000',
    strokeWidth = 2,
    diamondMarkerSize = 8,
    isSelected = false,
  }) => {
    const pathD = `M ${startX},${startY} L ${endX},${endY}`;

    // Diamond marker position (slightly offset from start)
    const diamondX = startX + 10;
    const diamondY = startY;

    // Label calculation
    const midX = (startX + endX) / 2;
    const midY = (startY + endY) / 2 - 15;

    // Diamond path (rotated square)
    const diamondPath = `
      M ${diamondX},${diamondY - diamondMarkerSize / 2}
      L ${diamondX + diamondMarkerSize / 2},${diamondY}
      L ${diamondX},${diamondY + diamondMarkerSize / 2}
      L ${diamondX - diamondMarkerSize / 2},${diamondY}
      Z
    `;

    return (
      <g id={id} className="conditional-sequence-flow">
        {/* Invisible hitbox */}
        <path
          d={pathD}
          stroke="transparent"
          strokeWidth={Math.max(6, strokeWidth * 3)}
          fill="none"
          pointerEvents="stroke"
          style={{ cursor: 'pointer' }}
        />

        {/* Main line */}
        <path
          d={pathD}
          stroke={isSelected ? '#0066CC' : color}
          strokeWidth={isSelected ? strokeWidth + 1 : strokeWidth}
          fill="none"
          markerEnd="url(#arrowSolid)"
        />

        {/* Diamond marker */}
        <path
          d={diamondPath}
          fill="#FFFFFF"
          stroke={isSelected ? '#0066CC' : color}
          strokeWidth={2}
        />

        {/* Condition expression label */}
        <g>
          {/* Label background */}
          <rect
            x={midX - 70}
            y={midY - 12}
            width={140}
            height={24}
            fill="#FFFFFF"
            stroke="#E0E0E0"
            strokeWidth={1}
            rx={3}
          />

          {/* Condition text */}
          <text
            x={midX}
            y={midY}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={11}
            fontFamily="Arial"
            fill={color}
            fontWeight="normal"
          >
            {conditionExpression.length > 20
              ? conditionExpression.substring(0, 17) + '...'
              : conditionExpression}
          </text>

          {/* Full condition as tooltip (SVG title) */}
          <title>{conditionExpression}</title>
        </g>
      </g>
    );
  };
```

---

### 1.3 Default Sequence Flow Component

```typescript
interface DefaultSequenceFlowProps {
  id: string;
  sourceRef: string;
  targetRef: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  color?: string;
  strokeWidth?: number;
  slashMarkerSize?: number;
  isSelected?: boolean;
}

export const DefaultSequenceFlow: React.FC<DefaultSequenceFlowProps> = ({
  id,
  startX,
  startY,
  endX,
  endY,
  color = '#000000',
  strokeWidth = 2,
  slashMarkerSize = 6,
  isSelected = false,
}) => {
  const pathD = `M ${startX},${startY} L ${endX},${endY}`;

  // Slash marker position and angle
  const offset = 10;
  const slashX = startX + offset;
  const slashY = startY;
  const slashLength = slashMarkerSize;

  // 45-degree slash
  const slashX1 = slashX - slashLength / 2;
  const slashY1 = slashY - slashLength / 2;
  const slashX2 = slashX + slashLength / 2;
  const slashY2 = slashY + slashLength / 2;

  return (
    <g id={id} className="default-sequence-flow">
      {/* Invisible hitbox */}
      <path
        d={pathD}
        stroke="transparent"
        strokeWidth={Math.max(6, strokeWidth * 3)}
        fill="none"
        pointerEvents="stroke"
        style={{ cursor: 'pointer' }}
      />

      {/* Main line */}
      <path
        d={pathD}
        stroke={isSelected ? '#0066CC' : color}
        strokeWidth={isSelected ? strokeWidth + 1 : strokeWidth}
        fill="none"
        markerEnd="url(#arrowSolid)"
      />

      {/* Slash marker */}
      <line
        x1={slashX1}
        y1={slashY1}
        x2={slashX2}
        y2={slashY2}
        stroke={isSelected ? '#0066CC' : color}
        strokeWidth={2}
        strokeLinecap="round"
      />

      {/* Visual indicator label */}
      <text
        x={slashX}
        y={slashY - 12}
        textAnchor="middle"
        fontSize={10}
        fontFamily="Arial"
        fill="#999999"
        pointerEvents="none"
      >
        default
      </text>
    </g>
  );
};
```

---

## 2. MESSAGE FLOW IMPLEMENTATION

```typescript
interface MessageFlowProps {
  id: string;
  sourceRef: string;
  targetRef: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  messageRef?: string;
  name?: string;
  color?: string;
  strokeWidth?: number;
  isSelected?: boolean;
}

export const MessageFlow: React.FC<MessageFlowProps> = ({
  id,
  startX,
  startY,
  endX,
  endY,
  messageRef,
  name,
  color = '#000000',
  strokeWidth = 2,
  isSelected = false,
}) => {
  const pathD = `M ${startX},${startY} L ${endX},${endY}`;

  // Label position
  const midX = (startX + endX) / 2;
  const midY = (startY + endY) / 2 - 15;

  return (
    <g id={id} className="message-flow">
      {/* Invisible hitbox */}
      <path
        d={pathD}
        stroke="transparent"
        strokeWidth={Math.max(6, strokeWidth * 3)}
        fill="none"
        pointerEvents="stroke"
        style={{ cursor: 'pointer' }}
      />

      {/* Dotted line */}
      <path
        d={pathD}
        stroke={isSelected ? '#0066CC' : color}
        strokeWidth={isSelected ? strokeWidth + 1 : strokeWidth}
        strokeDasharray="5,3"
        fill="none"
        markerStart="url(#messageCircle)"
        markerEnd="url(#arrowSolid)"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Message name label */}
      {name && (
        <g>
          {/* Background */}
          <rect
            x={midX - 50}
            y={midY - 12}
            width={100}
            height={20}
            fill="#FFFFFF"
            stroke="#F0F0F0"
            strokeWidth={1}
            rx={2}
          />

          {/* Text */}
          <text
            x={midX}
            y={midY}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={12}
            fontFamily="Arial"
            fill={color}
          >
            {name}
          </text>
        </g>
      )}

      {/* Message ref as title */}
      {messageRef && <title>Message: {messageRef}</title>}
    </g>
  );
};
```

---

## 3. ASSOCIATION IMPLEMENTATION

```typescript
interface AssociationProps {
  id: string;
  sourceRef: string;
  targetRef: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  direction?: 'None' | 'One' | 'Both';
  color?: string;
  strokeWidth?: number;
  isSelected?: boolean;
}

export const Association: React.FC<AssociationProps> = ({
  id,
  startX,
  startY,
  endX,
  endY,
  direction = 'None',
  color = '#999999',
  strokeWidth = 1.5,
  isSelected = false,
}) => {
  const pathD = `M ${startX},${startY} L ${endX},${endY}`;

  const markerStart = direction === 'Both' ? 'url(#associationArrow)' : 'none';
  const markerEnd = direction !== 'None' ? 'url(#associationArrow)' : 'none';

  return (
    <g id={id} className="association">
      {/* Invisible hitbox */}
      <path
        d={pathD}
        stroke="transparent"
        strokeWidth={Math.max(4, strokeWidth * 3)}
        fill="none"
        pointerEvents="stroke"
        style={{ cursor: 'pointer' }}
      />

      {/* Dotted line */}
      <path
        d={pathD}
        stroke={isSelected ? '#0066CC' : color}
        strokeWidth={isSelected ? strokeWidth + 0.5 : strokeWidth}
        strokeDasharray="3,2"
        fill="none"
        markerStart={markerStart}
        markerEnd={markerEnd}
        strokeLinecap="butt"
      />
    </g>
  );
};
```

---

## 4. DATA ASSOCIATION IMPLEMENTATION

```typescript
interface DataAssociationProps {
  id: string;
  sourceRef: string | string[];
  targetRef: string;
  direction: 'input' | 'output';
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  transformation?: {
    expression: string;
    type: 'tFormalExpression' | 'tScript';
  };
  color?: string;
  strokeWidth?: number;
  isSelected?: boolean;
}

export const DataAssociation: React.FC<DataAssociationProps> = ({
  id,
  sourceRef,
  targetRef,
  direction,
  startX,
  startY,
  endX,
  endY,
  transformation,
  color = '#555555',
  strokeWidth = 1.5,
  isSelected = false,
}) => {
  const pathD = `M ${startX},${startY} L ${endX},${endY}`;

  // Arrow direction based on input/output
  const markerEnd = direction === 'input' ? 'url(#dataArrow)' : 'none';
  const markerStart = direction === 'output' ? 'url(#dataArrow)' : 'none';

  return (
    <g id={id} className="data-association">
      {/* Invisible hitbox */}
      <path
        d={pathD}
        stroke="transparent"
        strokeWidth={Math.max(4, strokeWidth * 3)}
        fill="none"
        pointerEvents="stroke"
        style={{ cursor: 'pointer' }}
      />

      {/* Fine dotted line */}
      <path
        d={pathD}
        stroke={isSelected ? '#0066CC' : color}
        strokeWidth={isSelected ? strokeWidth + 0.5 : strokeWidth}
        strokeDasharray="2,2"
        fill="none"
        markerStart={markerStart}
        markerEnd={markerEnd}
        strokeLinecap="butt"
      />

      {/* Transformation indicator */}
      {transformation && (
        <title>
          Transformation: {transformation.expression} ({transformation.type})
        </title>
      )}
    </g>
  );
};
```

---

## 5. POOL COMPONENT IMPLEMENTATION

```typescript
interface PoolProps {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  processRef: string;
  isCollapsed?: boolean;
  isExecutable?: boolean;
  participantMultiplicity?: {
    minimum: number;
    maximum: number | null;
  };
  isSelected?: boolean;
  children?: React.ReactNode;
}

export const Pool: React.FC<PoolProps> = ({
  id,
  name,
  x,
  y,
  width,
  height,
  isCollapsed = false,
  participantMultiplicity,
  isSelected = false,
  children,
}) => {
  const labelAreaWidth = 40;
  const borderWidth = isSelected ? 3 : 2;

  return (
    <g id={id} className="pool">
      {/* Main pool rectangle */}
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        stroke={isSelected ? '#0066CC' : '#000000'}
        strokeWidth={borderWidth}
        fill="#FFFFFF"
        rx={0}
      />

      {/* Label area background */}
      <rect
        x={x}
        y={y}
        width={labelAreaWidth}
        height={height}
        fill="#F0F0F0"
        stroke={isSelected ? '#0066CC' : '#000000'}
        strokeWidth={borderWidth}
      />

      {/* Vertical label */}
      <text
        x={x + labelAreaWidth / 2}
        y={y + height / 2}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={12}
        fontFamily="Arial"
        fill="#000000"
        transform={`rotate(-90 ${x + labelAreaWidth / 2} ${y + height / 2})`}
        fontWeight="normal"
      >
        {name}
      </text>

      {/* Multi-instance marker */}
      {participantMultiplicity && (
        <g className="multi-instance-marker">
          {/* Draw 3 parallel lines on right side */}
          {[0, 5, 10].map((offset) => (
            <line
              key={`instance-line-${offset}`}
              x1={x + width - 8 - offset}
              y1={y + height / 2 - 10}
              x2={x + width - 8 - offset}
              y2={y + height / 2 + 10}
              stroke="#000000"
              strokeWidth={2}
            />
          ))}
        </g>
      )}

      {/* Content (lanes and flow elements) */}
      {!isCollapsed && (
        <g className="pool-content" pointerEvents="none">
          {children}
        </g>
      )}

      {/* Collapsed indicator */}
      {isCollapsed && (
        <text
          x={x + labelAreaWidth + 10}
          y={y + height - 8}
          fontSize={10}
          fill="#999999"
          fontStyle="italic"
        >
          (External)
        </text>
      )}
    </g>
  );
};
```

---

## 6. LANE COMPONENT IMPLEMENTATION

```typescript
interface LaneProps {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  isNested?: boolean;
  isSelected?: boolean;
  children?: React.ReactNode;
}

export const Lane: React.FC<LaneProps> = ({
  id,
  name,
  x,
  y,
  width,
  height,
  isNested = false,
  isSelected = false,
  children,
}) => {
  const labelAreaWidth = 40;
  const borderWidth = isSelected ? 2 : 1;
  const borderColor = isSelected ? '#0066CC' : '#CCCCCC';
  const bgColor = isNested ? '#FFFFFF' : '#F5F5F5';
  const labelBgColor = isNested ? '#EFEFEF' : '#E8E8E8';

  return (
    <g id={id} className="lane">
      {/* Lane rectangle */}
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        stroke={borderColor}
        strokeWidth={borderWidth}
        fill={bgColor}
      />

      {/* Label area */}
      <rect
        x={x}
        y={y}
        width={labelAreaWidth}
        height={height}
        fill={labelBgColor}
        stroke={borderColor}
        strokeWidth={borderWidth}
      />

      {/* Vertical label */}
      <text
        x={x + labelAreaWidth / 2}
        y={y + height / 2}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={12}
        fontFamily="Arial"
        fill="#000000"
        transform={`rotate(-90 ${x + labelAreaWidth / 2} ${y + height / 2})`}
      >
        {name}
      </text>

      {/* Content (flow elements) */}
      <g className="lane-content" pointerEvents="none">
        {children}
      </g>
    </g>
  );
};
```

---

## 7. SVG MARKER DEFINITIONS

```typescript
export const SVGMarkers: React.FC = () => {
  return (
    <defs>
      {/* Solid arrow marker */}
      <marker
        id="arrowSolid"
        markerWidth="10"
        markerHeight="10"
        refX="9"
        refY="3"
        markerUnits="strokeWidth"
        orient="auto"
      >
        <path d="M 0 0 L 10 3 L 0 6 Z" fill="#000000" />
      </marker>

      {/* Message circle marker */}
      <marker
        id="messageCircle"
        markerWidth="12"
        markerHeight="12"
        refX="6"
        refY="6"
        markerUnits="userSpaceOnUse"
        orient="auto"
      >
        <circle cx="6" cy="6" r="4" fill="#FFFFFF" stroke="#000000" strokeWidth="2" />
      </marker>

      {/* Association arrow marker */}
      <marker
        id="associationArrow"
        markerWidth="10"
        markerHeight="10"
        refX="9"
        refY="3"
        markerUnits="strokeWidth"
        orient="auto"
      >
        <path d="M 0 0 L 10 3 L 0 6 Z" fill="#666666" />
      </marker>

      {/* Data arrow marker (darker) */}
      <marker
        id="dataArrow"
        markerWidth="10"
        markerHeight="10"
        refX="9"
        refY="3"
        markerUnits="strokeWidth"
        orient="auto"
      >
        <path d="M 0 0 L 10 3 L 0 6 Z" fill="#333333" />
      </marker>
    </defs>
  );
};
```

---

## 8. COMPLETE DIAGRAM EXAMPLE

```typescript
export const BPMNDiagramExample: React.FC = () => {
  return (
    <svg viewBox="0 0 1200 800" width="1200" height="800">
      <rect width="1200" height="800" fill="#FFFFFF" />

      {/* Define all markers */}
      <SVGMarkers />

      {/* Pool: Customer */}
      <Pool
        id="Participant_customer"
        name="Customer"
        x={50}
        y={50}
        width={500}
        height={250}
        processRef="Process_customer"
      >
        {/* Lane: Sales Rep */}
        <Lane id="Lane_sales" name="Sales Rep" x={90} y={50} width={460} height={100} />

        {/* Lane: Manager */}
        <Lane id="Lane_manager" name="Manager" x={90} y={150} width={460} height={150} />

        {/* Sequence flows within pool */}
        <NormalSequenceFlow
          id="SequenceFlow_1"
          sourceRef="Task_1"
          targetRef="Task_2"
          startX={150}
          startY={100}
          endX={250}
          endY={100}
          name="Process"
        />

        <ConditionalSequenceFlow
          id="SequenceFlow_2"
          sourceRef="Gateway_1"
          targetRef="Task_3"
          startX={300}
          startY={180}
          endX={400}
          endY={180}
          conditionExpression="amount > 1000"
        />
      </Pool>

      {/* Pool: Supplier (Collapsed) */}
      <Pool
        id="Participant_supplier"
        name="Supplier"
        x={50}
        y={350}
        width={500}
        height={100}
        processRef="Process_supplier"
        isCollapsed={true}
      />

      {/* Message flow between pools */}
      <MessageFlow
        id="MessageFlow_1"
        sourceRef="Task_send"
        targetRef="Event_receive"
        startX={350}
        startY={300}
        endX={350}
        endY={350}
        name="Send Order"
      />

      {/* Association to artifact */}
      <Association
        id="Association_1"
        sourceRef="Task_1"
        targetRef="TextAnnotation_1"
        startX={150}
        startY={100}
        endX={250}
        endY={50}
        direction="One"
      />

      {/* Data association */}
      <DataAssociation
        id="DataInputAssociation_1"
        sourceRef="DataObject_order"
        targetRef="Task_process"
        direction="input"
        startX={200}
        startY={200}
        endX={200}
        endY={100}
      />
    </svg>
  );
};
```

---

## 9. XML TO REACT CONVERSION

```typescript
import { xml2js } from 'xml2js';

/**
 * Convert BPMN XML to React component props
 */
export async function parseBPMNXML(xmlString: string) {
  const parser = new xml2js.Parser();
  const result = await parser.parseStringPromise(xmlString);

  const definitions = result.definitions;

  // Extract collaboration
  const collaboration = definitions.collaboration[0];
  const participants = collaboration.participant.map((p: any) => ({
    id: p.$.id,
    processRef: p.$.processRef,
    name: p.$.name,
    multiplicityMin: p.participantMultiplicity?.[0]?.$.minimum || 1,
    multiplicityMax: p.participantMultiplicity?.[0]?.$.maximum || null,
  }));

  // Extract processes
  const processes = definitions.process.map((p: any) => ({
    id: p.$.id,
    name: p.$.name,
    isExecutable: p.$.isExecutable === 'true',
    lanes: p.laneSet?.[0]?.lane?.map((lane: any) => ({
      id: lane.$.id,
      name: lane.$.name,
      flowNodeRefs: lane.flowNodeRef || [],
    })) || [],
    flows: p.sequenceFlow?.map((sf: any) => ({
      id: sf.$.id,
      sourceRef: sf.$.sourceRef,
      targetRef: sf.$.targetRef,
      name: sf.$.name,
      conditionExpression: sf.conditionExpression?.[0]?._ || null,
      isDefault: sf.$.id === p.$.default,
    })) || [],
  }));

  // Extract message flows
  const messageFlows = collaboration.messageFlow?.map((mf: any) => ({
    id: mf.$.id,
    sourceRef: mf.$.sourceRef,
    targetRef: mf.$.targetRef,
    name: mf.$.name,
    messageRef: mf.$.messageRef,
  })) || [];

  return {
    participants,
    processes,
    messageFlows,
  };
}

/**
 * Convert React component state back to BPMN XML
 */
export function generateBPMNXML(data: {
  participants: Participant[];
  processes: ProcessElement[];
  messageFlows: MessageFlowProps[];
}): string {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL"
             xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL"
             id="Definitions_1"
             targetNamespace="http://example.com/bpmn">
`;

  // Collaboration
  xml += '  <collaboration id="Collaboration_1">\n';

  // Participants
  data.participants.forEach((p) => {
    xml += `    <participant id="${p.id}" processRef="${p.processRef}" name="${p.name}"`;
    if (p.participantMultiplicity) {
      xml += `>
      <participantMultiplicity minimum="${p.participantMultiplicity.minimum}"
                              maximum="${p.participantMultiplicity.maximum || ''}"/>
    </participant>\n`;
    } else {
      xml += ' />\n';
    }
  });

  // Message flows
  data.messageFlows.forEach((mf) => {
    xml += `    <messageFlow id="${mf.id}" sourceRef="${mf.sourceRef}" targetRef="${mf.targetRef}"`;
    if (mf.messageRef) {
      xml += ` messageRef="${mf.messageRef}"`;
    }
    xml += ` name="${mf.name || ''}"/>\n`;
  });

  xml += '  </collaboration>\n';

  // Processes
  data.processes.forEach((proc) => {
    xml += `  <process id="${proc.id}" name="${proc.name}" isExecutable="${proc.isExecutable}">\n`;

    // LaneSet
    if (proc.laneSet && proc.laneSet.lanes.length > 0) {
      xml += '    <laneSet id="' + proc.id + '_laneSet">\n';

      proc.laneSet.lanes.forEach((lane) => {
        xml += `      <lane id="${lane.id}" name="${lane.name}">\n`;
        lane.flowNodeRefs.forEach((ref) => {
          xml += `        <flowNodeRef>${ref}</flowNodeRef>\n`;
        });
        xml += '      </lane>\n';
      });

      xml += '    </laneSet>\n';
    }

    // Sequence flows
    const flows = proc.flowElements || [];
    flows.forEach((flow) => {
      if (flow.type === 'sequenceFlow') {
        xml += `    <sequenceFlow id="${flow.id}" sourceRef="${flow.incoming}" targetRef="${flow.outgoing}"`;
        if ((flow as any).conditionExpression) {
          xml += `>
      <conditionExpression xsi:type="tFormalExpression">${(flow as any).conditionExpression}</conditionExpression>
    </sequenceFlow>\n`;
        } else {
          xml += ' />\n';
        }
      }
    });

    xml += '  </process>\n';
  });

  xml += '</definitions>';

  return xml;
}
```

---

## 10. CANVAS RENDERING WITH COORDINATES

```typescript
interface DiagramLayout {
  pools: Map<string, Bounds>;
  lanes: Map<string, Bounds>;
  elements: Map<string, Bounds>;
  connectors: Map<string, { start: Point; end: Point; waypoints: Point[] }>;
}

/**
 * Calculate layout for all BPMN elements
 */
export function calculateDiagramLayout(
  participants: Participant[],
  processes: ProcessElement[]
): DiagramLayout {
  const layout: DiagramLayout = {
    pools: new Map(),
    lanes: new Map(),
    elements: new Map(),
    connectors: new Map(),
  };

  let currentY = 50;
  const POOL_WIDTH = 800;
  const POOL_MIN_HEIGHT = 100;
  const LANE_HEIGHT = 120;
  const ELEMENT_WIDTH = 100;
  const ELEMENT_HEIGHT = 60;

  // Layout pools
  participants.forEach((participant) => {
    const process = processes.find((p) => p.id === participant.processRef);
    const laneCount = process?.laneSet?.lanes.length || 1;
    const poolHeight = Math.max(POOL_MIN_HEIGHT, laneCount * LANE_HEIGHT);

    layout.pools.set(participant.id, {
      x: 50,
      y: currentY,
      width: POOL_WIDTH,
      height: poolHeight,
    });

    // Layout lanes within pool
    let currentLaneY = currentY;
    process?.laneSet?.lanes.forEach((lane) => {
      layout.lanes.set(lane.id, {
        x: 90,
        y: currentLaneY,
        width: POOL_WIDTH - 40,
        height: LANE_HEIGHT,
      });

      // Layout elements within lane
      let currentElementX = 150;
      lane.flowNodeRefs.forEach((nodeRef) => {
        layout.elements.set(nodeRef, {
          x: currentElementX,
          y: currentLaneY + LANE_HEIGHT / 2 - ELEMENT_HEIGHT / 2,
          width: ELEMENT_WIDTH,
          height: ELEMENT_HEIGHT,
        });
        currentElementX += ELEMENT_WIDTH + 50;
      });

      currentLaneY += LANE_HEIGHT;
    });

    currentY += poolHeight + 30;
  });

  return layout;
}
```

---

**Last Updated**: January 2026
**Version**: 1.0
**For**: React BPMN 2.0 Component Implementation
