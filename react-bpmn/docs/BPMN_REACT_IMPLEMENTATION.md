# BPMN 2.0 Artifacts and Data Elements - React Implementation Guide

This document provides practical React component implementations for BPMN 2.0 artifacts and data elements.

---

## 1. Core Type Definitions

```typescript
// types/bpmn-artifacts.ts

export type ElementType = 'dataObject' | 'dataStore' | 'group' | 'textAnnotation' | 'property';
export type DataElementType = 'dataInput' | 'dataOutput' | 'dataObjectRef' | 'dataStoreRef';

// Base interfaces
export interface BPMNElement {
  id: string;
  name?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  attributes?: Record<string, any>;
}

// DATA OBJECTS
export interface DataObject extends BPMNElement {
  type: 'dataObject';
  itemSubjectRef?: string;
  isCollection?: boolean;
  states?: DataObjectState[];
  currentState?: string;
}

export interface DataObjectState {
  id: string;
  name: string;
}

export interface DataObjectReference extends BPMNElement {
  type: 'dataObjectRef';
  dataObjectRef: string;
  state?: string;
}

// DATA STORES
export interface DataStore {
  id: string;
  name: string;
  capacity?: number;
  isUnlimited?: boolean;
  itemSubjectRef?: string;
}

export interface DataStoreReference extends BPMNElement {
  type: 'dataStoreRef';
  dataStoreRef: string;
}

// GROUPS
export interface Group extends BPMNElement {
  type: 'group';
  categoryValueRef?: string;
  color?: string;
  elements?: string[];
}

export interface CategoryValue {
  id: string;
  value: string;
}

export interface Category {
  id: string;
  name: string;
  categoryValues: CategoryValue[];
}

// TEXT ANNOTATIONS
export interface TextAnnotation extends BPMNElement {
  type: 'textAnnotation';
  text: string;
  textFormat?: 'plain' | 'html';
}

export interface Association {
  id: string;
  sourceRef: string;
  targetRef: string;
  direction?: 'One' | 'Both' | 'None';
}

// DATA ELEMENTS
export interface DataInput {
  id: string;
  name: string;
  itemSubjectRef: string;
  isCollection?: boolean;
  optional?: boolean;
}

export interface DataOutput {
  id: string;
  name: string;
  itemSubjectRef: string;
  isCollection?: boolean;
}

export interface IOSpecification {
  id: string;
  dataInputs: DataInput[];
  dataOutputs: DataOutput[];
  inputSets: InputSet[];
  outputSets: OutputSet[];
}

export interface InputSet {
  id: string;
  dataInputRefs: string[];
}

export interface OutputSet {
  id: string;
  dataOutputRefs: string[];
}

export interface DataAssociation {
  id: string;
  sourceRef: string;
  targetRef: string;
  transformation?: Transformation;
}

export interface Transformation {
  id: string;
  body: string;
}

export interface Property {
  id: string;
  name: string;
  itemSubjectRef: string;
  value?: any;
  isReadonly?: boolean;
}

export interface ItemDefinition {
  id: string;
  name: string;
  structureRef: string;
  isCollection?: boolean;
}

// STORE
export interface BPMNArtifactStore {
  dataObjects: Map<string, DataObject>;
  dataObjectReferences: Map<string, DataObjectReference>;
  dataStores: Map<string, DataStore>;
  dataStoreReferences: Map<string, DataStoreReference>;
  groups: Map<string, Group>;
  textAnnotations: Map<string, TextAnnotation>;
  properties: Map<string, Property>;
  itemDefinitions: Map<string, ItemDefinition>;
  associations: Map<string, Association>;
  dataAssociations: Map<string, DataAssociation>;
}
```

---

## 2. Data Object Component

```typescript
// components/DataObject.tsx
import React, { useState } from 'react';
import { DataObject as DataObjectType } from '../types/bpmn-artifacts';

interface DataObjectProps {
  element: DataObjectType;
  selected?: boolean;
  onSelect?: (id: string) => void;
  onUpdate?: (element: DataObjectType) => void;
  isCollection?: boolean;
}

export const DataObject: React.FC<DataObjectProps> = ({
  element,
  selected = false,
  onSelect,
  onUpdate,
  isCollection = element.isCollection
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(element.name || '');

  const handleNameChange = (newName: string) => {
    setName(newName);
    if (onUpdate) {
      onUpdate({ ...element, name: newName });
    }
  };

  return (
    <g
      onClick={() => onSelect?.(element.id)}
      style={{ cursor: 'pointer' }}
    >
      {/* Main rectangle for data object */}
      <rect
        x={element.x}
        y={element.y}
        width={element.width}
        height={element.height}
        fill={selected ? '#e3f2fd' : '#ffffff'}
        stroke={selected ? '#1976d2' : '#333333'}
        strokeWidth={selected ? 2 : 1}
        rx={2}
        ry={2}
      />

      {/* Text label */}
      <text
        x={element.x + element.width / 2}
        y={element.y + element.height / 2}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="12"
        fontFamily="Arial, sans-serif"
        onClick={() => isEditing && setIsEditing(false)}
      >
        {isEditing ? (
          <input
            autoFocus
            type="text"
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            onBlur={() => setIsEditing(false)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') setIsEditing(false);
            }}
            style={{
              border: 'none',
              padding: '2px',
              width: element.width - 8,
              textAlign: 'center'
            }}
          />
        ) : (
          <tspan
            onDoubleClick={() => setIsEditing(true)}
            style={{ cursor: 'text' }}
          >
            {name}
          </tspan>
        )}
      </text>

      {/* Collection marker - three horizontal lines at bottom */}
      {isCollection && (
        <g>
          <line
            x1={element.x + 10}
            y1={element.y + element.height - 15}
            x2={element.x + element.width - 10}
            y2={element.y + element.height - 15}
            stroke="#333333"
            strokeWidth="2"
          />
          <line
            x1={element.x + 10}
            y1={element.y + element.height - 10}
            x2={element.x + element.width - 10}
            y2={element.y + element.height - 10}
            stroke="#333333"
            strokeWidth="2"
          />
          <line
            x1={element.x + 10}
            y1={element.y + element.height - 5}
            x2={element.x + element.width - 10}
            y2={element.y + element.height - 5}
            stroke="#333333"
            strokeWidth="2"
          />
        </g>
      )}

      {/* State indicator (if present) */}
      {element.currentState && (
        <text
          x={element.x + element.width / 2}
          y={element.y + element.height + 15}
          textAnchor="middle"
          fontSize="10"
          fontStyle="italic"
          fill="#666666"
        >
          [{element.currentState}]
        </text>
      )}
    </g>
  );
};
```

---

## 3. Data Store Component

```typescript
// components/DataStore.tsx
import React from 'react';
import { DataStoreReference as DataStoreRefType } from '../types/bpmn-artifacts';

interface DataStoreProps {
  element: DataStoreRefType;
  selected?: boolean;
  onSelect?: (id: string) => void;
  capacity?: string;
}

export const DataStore: React.FC<DataStoreProps> = ({
  element,
  selected = false,
  onSelect,
  capacity
}) => {
  const cylinderHeight = 15;
  const topY = element.y;
  const middleY = element.y + cylinderHeight;
  const bottomY = element.y + element.height;

  return (
    <g
      onClick={() => onSelect?.(element.id)}
      style={{ cursor: 'pointer' }}
    >
      {/* Top ellipse */}
      <ellipse
        cx={element.x + element.width / 2}
        cy={topY + 5}
        rx={element.width / 2}
        ry={5}
        fill={selected ? '#e3f2fd' : '#ffffff'}
        stroke={selected ? '#1976d2' : '#333333'}
        strokeWidth={selected ? 2 : 1}
      />

      {/* Main rectangle body */}
      <rect
        x={element.x}
        y={topY + 5}
        width={element.width}
        height={element.height - cylinderHeight}
        fill={selected ? '#e3f2fd' : '#ffffff'}
        stroke={selected ? '#1976d2' : '#333333'}
        strokeWidth={selected ? 2 : 1}
      />

      {/* Bottom ellipse */}
      <ellipse
        cx={element.x + element.width / 2}
        cy={bottomY - 5}
        rx={element.width / 2}
        ry={5}
        fill={selected ? '#cce5ff' : '#f5f5f5'}
        stroke={selected ? '#1976d2' : '#333333'}
        strokeWidth={selected ? 2 : 1}
      />

      {/* Text label */}
      <text
        x={element.x + element.width / 2}
        y={element.y + element.height / 2}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="12"
        fontFamily="Arial, sans-serif"
      >
        {element.name}
      </text>

      {/* Capacity indicator */}
      {capacity && (
        <text
          x={element.x + element.width / 2}
          y={element.y + element.height + 15}
          textAnchor="middle"
          fontSize="10"
          fill="#999999"
        >
          {capacity}
        </text>
      )}
    </g>
  );
};
```

---

## 4. Group Component

```typescript
// components/Group.tsx
import React from 'react';
import { Group as GroupType } from '../types/bpmn-artifacts';

interface GroupProps {
  element: GroupType;
  selected?: boolean;
  onSelect?: (id: string) => void;
}

export const Group: React.FC<GroupProps> = ({
  element,
  selected = false,
  onSelect
}) => {
  const dashArray = '5,5';

  return (
    <g
      onClick={() => onSelect?.(element.id)}
      style={{ cursor: 'pointer' }}
      opacity={0.8}
    >
      {/* Dashed rounded rectangle */}
      <rect
        x={element.x}
        y={element.y}
        width={element.width}
        height={element.height}
        fill={element.color || '#fffacd'}
        fillOpacity="0.1"
        stroke={selected ? '#1976d2' : '#888888'}
        strokeWidth={selected ? 2 : 1.5}
        strokeDasharray={dashArray}
        rx={8}
        ry={8}
      />

      {/* Label */}
      {element.name && (
        <text
          x={element.x + 10}
          y={element.y + 20}
          fontSize="12"
          fontWeight="bold"
          fontFamily="Arial, sans-serif"
          fill={selected ? '#1976d2' : '#666666'}
        >
          {element.name}
        </text>
      )}
    </g>
  );
};
```

---

## 5. Text Annotation Component

```typescript
// components/TextAnnotation.tsx
import React, { useState } from 'react';
import { TextAnnotation as TextAnnotationType } from '../types/bpmn-artifacts';

interface TextAnnotationProps {
  element: TextAnnotationType;
  selected?: boolean;
  onSelect?: (id: string) => void;
  onUpdate?: (element: TextAnnotationType) => void;
}

export const TextAnnotation: React.FC<TextAnnotationProps> = ({
  element,
  selected = false,
  onSelect,
  onUpdate
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(element.text);

  const handleTextChange = (newText: string) => {
    setText(newText);
    if (onUpdate) {
      onUpdate({ ...element, text: newText });
    }
  };

  const lineHeight = 14;
  const lines = element.text.split('\n');
  const textHeight = Math.max(lines.length * lineHeight, 20);

  return (
    <g
      onClick={() => onSelect?.(element.id)}
      style={{ cursor: 'pointer' }}
    >
      {/* Open rectangle (not filled) */}
      <rect
        x={element.x}
        y={element.y}
        width={element.width}
        height={Math.max(element.height, textHeight + 10)}
        fill="none"
        stroke={selected ? '#1976d2' : '#666666'}
        strokeWidth={selected ? 2 : 1}
      />

      {/* Text content */}
      <foreignObject
        x={element.x + 5}
        y={element.y + 5}
        width={element.width - 10}
        height={Math.max(element.height - 10, textHeight)}
      >
        {isEditing ? (
          <textarea
            autoFocus
            value={text}
            onChange={(e) => handleTextChange(e.target.value)}
            onBlur={() => setIsEditing(false)}
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              fontFamily: 'Arial, sans-serif',
              fontSize: '11px',
              padding: '2px',
              boxSizing: 'border-box'
            }}
          />
        ) : (
          <div
            onDoubleClick={() => setIsEditing(true)}
            style={{
              fontSize: '11px',
              fontFamily: 'Arial, sans-serif',
              wordWrap: 'break-word',
              padding: '2px',
              cursor: 'text',
              whiteSpace: 'pre-wrap'
            }}
          >
            {text}
          </div>
        )}
      </foreignObject>
    </g>
  );
};
```

---

## 6. Data Association Component

```typescript
// components/DataAssociationLine.tsx
import React from 'react';

interface DataAssociationLineProps {
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  selected?: boolean;
  isInputAssociation?: boolean;
  hasTransformation?: boolean;
}

export const DataAssociationLine: React.FC<DataAssociationLineProps> = ({
  sourceX,
  sourceY,
  targetX,
  targetY,
  selected = false,
  isInputAssociation = false,
  hasTransformation = false
}) => {
  // Calculate arrow direction
  const dx = targetX - sourceX;
  const dy = targetY - sourceY;
  const distance = Math.sqrt(dx * dx + dy * dy);
  const angle = Math.atan2(dy, dx);

  // Arrowhead points
  const arrowSize = 8;
  const arrowX = targetX - arrowSize * Math.cos(angle);
  const arrowY = targetY - arrowSize * Math.sin(angle);
  const arrowPoints = `${targetX},${targetY} ${arrowX - 5 * Math.sin(angle)},${arrowY + 5 * Math.cos(angle)} ${arrowX + 5 * Math.sin(angle)},${arrowY - 5 * Math.cos(angle)}`;

  return (
    <g>
      {/* Association line - dotted style */}
      <line
        x1={sourceX}
        y1={sourceY}
        x2={targetX}
        y2={targetY}
        stroke={selected ? '#1976d2' : '#999999'}
        strokeWidth={selected ? 2 : 1.5}
        strokeDasharray="3,3"
        markerEnd={`url(#arrowhead-data-${selected ? 'selected' : 'default'})`}
      />

      {/* Transformation indicator */}
      {hasTransformation && (
        <circle
          cx={(sourceX + targetX) / 2}
          cy={(sourceY + targetY) / 2}
          r="4"
          fill={selected ? '#1976d2' : '#ff9800'}
          stroke="white"
          strokeWidth="1"
        />
      )}
    </g>
  );
};

// Arrow marker definitions (add to SVG defs)
export const DataAssociationMarkers = () => (
  <>
    <defs>
      <marker
        id="arrowhead-data-default"
        markerWidth="10"
        markerHeight="10"
        refX="8"
        refY="3"
        orient="auto"
      >
        <polygon points="0 0, 10 3, 0 6" fill="#999999" />
      </marker>
      <marker
        id="arrowhead-data-selected"
        markerWidth="10"
        markerHeight="10"
        refX="8"
        refY="3"
        orient="auto"
      >
        <polygon points="0 0, 10 3, 0 6" fill="#1976d2" />
      </marker>
    </defs>
  </>
);
```

---

## 7. IO Specification Component

```typescript
// components/IOSpecification.tsx
import React, { useState } from 'react';
import { IOSpecification, DataInput, DataOutput } from '../types/bpmn-artifacts';

interface IOSpecificationProps {
  ioSpec: IOSpecification;
  itemDefinitions: Map<string, any>;
  onUpdate?: (ioSpec: IOSpecification) => void;
}

export const IOSpecificationPanel: React.FC<IOSpecificationProps> = ({
  ioSpec,
  itemDefinitions,
  onUpdate
}) => {
  const [expandedSection, setExpandedSection] = useState<'inputs' | 'outputs' | null>('inputs');

  const addDataInput = () => {
    const newInput: DataInput = {
      id: `DataInput_${Date.now()}`,
      name: 'New Input',
      itemSubjectRef: 'ItemDefinition_String',
      optional: false
    };
    const updated = {
      ...ioSpec,
      dataInputs: [...ioSpec.dataInputs, newInput]
    };
    onUpdate?.(updated);
  };

  const addDataOutput = () => {
    const newOutput: DataOutput = {
      id: `DataOutput_${Date.now()}`,
      name: 'New Output',
      itemSubjectRef: 'ItemDefinition_String'
    };
    const updated = {
      ...ioSpec,
      dataOutputs: [...ioSpec.dataOutputs, newOutput]
    };
    onUpdate?.(updated);
  };

  const removeDataInput = (id: string) => {
    const updated = {
      ...ioSpec,
      dataInputs: ioSpec.dataInputs.filter(di => di.id !== id)
    };
    onUpdate?.(updated);
  };

  const removeDataOutput = (id: string) => {
    const updated = {
      ...ioSpec,
      dataOutputs: ioSpec.dataOutputs.filter(do_ => do_.id !== id)
    };
    onUpdate?.(updated);
  };

  return (
    <div style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}>
      <h4>I/O Specification: {ioSpec.id}</h4>

      {/* Data Inputs Section */}
      <div style={{ marginBottom: '15px' }}>
        <div
          onClick={() => setExpandedSection(expandedSection === 'inputs' ? null : 'inputs')}
          style={{ cursor: 'pointer', fontWeight: 'bold', marginBottom: '10px' }}
        >
          {expandedSection === 'inputs' ? '▼' : '▶'} Data Inputs ({ioSpec.dataInputs.length})
        </div>

        {expandedSection === 'inputs' && (
          <div style={{ marginLeft: '20px' }}>
            {ioSpec.dataInputs.map((input) => (
              <div
                key={input.id}
                style={{
                  padding: '8px',
                  marginBottom: '8px',
                  background: '#f5f5f5',
                  borderRadius: '4px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <div style={{ fontWeight: 'bold' }}>{input.name}</div>
                  <div style={{ fontSize: '12px', color: '#999' }}>
                    ID: {input.id}
                  </div>
                  <div style={{ fontSize: '12px', color: '#666' }}>
                    Type: {input.itemSubjectRef}
                    {input.isCollection && ' (Collection)'}
                  </div>
                  {input.optional && (
                    <div style={{ fontSize: '12px', color: '#ff9800' }}>Optional</div>
                  )}
                </div>
                <button
                  onClick={() => removeDataInput(input.id)}
                  style={{ padding: '4px 8px' }}
                >
                  Remove
                </button>
              </div>
            ))}

            <button onClick={addDataInput} style={{ marginTop: '10px', padding: '6px 12px' }}>
              Add Data Input
            </button>
          </div>
        )}
      </div>

      {/* Data Outputs Section */}
      <div>
        <div
          onClick={() => setExpandedSection(expandedSection === 'outputs' ? null : 'outputs')}
          style={{ cursor: 'pointer', fontWeight: 'bold', marginBottom: '10px' }}
        >
          {expandedSection === 'outputs' ? '▼' : '▶'} Data Outputs ({ioSpec.dataOutputs.length})
        </div>

        {expandedSection === 'outputs' && (
          <div style={{ marginLeft: '20px' }}>
            {ioSpec.dataOutputs.map((output) => (
              <div
                key={output.id}
                style={{
                  padding: '8px',
                  marginBottom: '8px',
                  background: '#f5f5f5',
                  borderRadius: '4px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <div style={{ fontWeight: 'bold' }}>{output.name}</div>
                  <div style={{ fontSize: '12px', color: '#999' }}>
                    ID: {output.id}
                  </div>
                  <div style={{ fontSize: '12px', color: '#666' }}>
                    Type: {output.itemSubjectRef}
                    {output.isCollection && ' (Collection)'}
                  </div>
                </div>
                <button
                  onClick={() => removeDataOutput(output.id)}
                  style={{ padding: '4px 8px' }}
                >
                  Remove
                </button>
              </div>
            ))}

            <button onClick={addDataOutput} style={{ marginTop: '10px', padding: '6px 12px' }}>
              Add Data Output
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
```

---

## 8. XML Serialization

```typescript
// utils/bpmn-serializer.ts
import {
  DataObject,
  DataStore,
  Group,
  TextAnnotation,
  DataStoreReference,
  Association,
  DataAssociation,
  IOSpecification,
  ItemDefinition,
  BPMNArtifactStore
} from '../types/bpmn-artifacts';

export class BPMNSerializer {
  static serializeDataObject(obj: DataObject): string {
    const collectionAttr = obj.isCollection ? ' isCollection="true"' : '';
    const states = obj.states
      ? obj.states.map(s => `<dataState id="${s.id}" name="${s.name}"/>`).join('\n')
      : '';

    return `<dataObject id="${obj.id}" name="${obj.name}"${collectionAttr} itemSubjectRef="${obj.itemSubjectRef || ''}">
  ${states}
</dataObject>`;
  }

  static serializeDataStore(store: DataStore): string {
    const capacityAttr = store.capacity ? ` capacity="${store.capacity}"` : '';
    const unlimitedAttr = store.isUnlimited ? ` isUnlimited="true"` : '';
    const itemAttr = store.itemSubjectRef ? ` itemSubjectRef="${store.itemSubjectRef}"` : '';

    return `<dataStore id="${store.id}" name="${store.name}"${capacityAttr}${unlimitedAttr}${itemAttr}/>`;
  }

  static serializeDataStoreReference(ref: DataStoreReference): string {
    return `<dataStoreReference id="${ref.id}" dataStoreRef="${ref.dataStoreRef}" name="${ref.name}"/>`;
  }

  static serializeGroup(group: Group): string {
    const categoryAttr = group.categoryValueRef ? ` categoryValueRef="${group.categoryValueRef}"` : '';
    return `<group id="${group.id}" name="${group.name}"${categoryAttr}/>`;
  }

  static serializeTextAnnotation(annotation: TextAnnotation): string {
    return `<textAnnotation id="${annotation.id}">
  <text>${annotation.text}</text>
</textAnnotation>`;
  }

  static serializeAssociation(assoc: Association): string {
    const directionAttr = assoc.direction ? ` associationDirection="${assoc.direction}"` : '';
    return `<association id="${assoc.id}" sourceRef="${assoc.sourceRef}" targetRef="${assoc.targetRef}"${directionAttr}/>`;
  }

  static serializeIOSpecification(ioSpec: IOSpecification): string {
    const inputs = ioSpec.dataInputs
      .map(di => `<dataInput id="${di.id}" name="${di.name}" itemSubjectRef="${di.itemSubjectRef}"/>`)
      .join('\n  ');

    const outputs = ioSpec.dataOutputs
      .map(do_ => `<dataOutput id="${do_.id}" name="${do_.name}" itemSubjectRef="${do_.itemSubjectRef}"/>`)
      .join('\n  ');

    const inputSets = ioSpec.inputSets
      .map(
        is =>
          `<inputSet id="${is.id}">
    ${is.dataInputRefs.map(ref => `<dataInputRefs>${ref}</dataInputRefs>`).join('\n    ')}
  </inputSet>`
      )
      .join('\n  ');

    const outputSets = ioSpec.outputSets
      .map(
        os =>
          `<outputSet id="${os.id}">
    ${os.dataOutputRefs.map(ref => `<dataOutputRefs>${ref}</dataOutputRefs>`).join('\n    ')}
  </outputSet>`
      )
      .join('\n  ');

    return `<ioSpecification id="${ioSpec.id}">
  ${inputs}
  ${outputs}
  ${inputSets}
  ${outputSets}
</ioSpecification>`;
  }

  static serializeDataAssociation(assoc: DataAssociation): string {
    const transformation = assoc.transformation
      ? `<transformation id="${assoc.transformation.id}">
    <body>${assoc.transformation.body}</body>
  </transformation>`
      : '';

    return `<dataInputAssociation id="${assoc.id}">
  <sourceRef>${assoc.sourceRef}</sourceRef>
  <targetRef>${assoc.targetRef}</targetRef>
  ${transformation}
</dataInputAssociation>`;
  }

  static serializeItemDefinition(itemDef: ItemDefinition): string {
    const collectionAttr = itemDef.isCollection ? ' isCollection="true"' : '';
    return `<itemDefinition id="${itemDef.id}" name="${itemDef.name}" structureRef="${itemDef.structureRef}"${collectionAttr}/>`;
  }

  static generateDiagramShape(id: string, element: any): string {
    const bounds = `<dc:Bounds x="${element.x}" y="${element.y}" width="${element.width}" height="${element.height}"/>`;
    return `<bpmndi:BPMNShape id="${id}_di" bpmnElement="${id}">
  ${bounds}
</bpmndi:BPMNShape>`;
  }

  static generateDiagramEdge(id: string, sourceX: number, sourceY: number, targetX: number, targetY: number): string {
    return `<bpmndi:BPMNEdge id="${id}_di" bpmnElement="${id}">
  <di:waypoint x="${sourceX}" y="${sourceY}"/>
  <di:waypoint x="${targetX}" y="${targetY}"/>
</bpmndi:BPMNEdge>`;
  }
}
```

---

## 9. Canvas Manager Component

```typescript
// components/BPMNArtifactCanvas.tsx
import React, { useRef, useState } from 'react';
import { DataObject as DataObjectComponent } from './DataObject';
import { DataStore } from './DataStore';
import { Group } from './Group';
import { TextAnnotation } from './TextAnnotation';
import { DataAssociationLine, DataAssociationMarkers } from './DataAssociationLine';
import { BPMNArtifactStore, DataObject, DataStoreReference, Association } from '../types/bpmn-artifacts';

interface BPMNArtifactCanvasProps {
  store: BPMNArtifactStore;
  width?: number;
  height?: number;
  onElementSelect?: (id: string, type: string) => void;
  onUpdate?: (id: string, element: any) => void;
}

export const BPMNArtifactCanvas: React.FC<BPMNArtifactCanvasProps> = ({
  store,
  width = 1200,
  height = 800,
  onElementSelect,
  onUpdate
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleSelect = (id: string, type: string) => {
    setSelectedId(id);
    onElementSelect?.(id, type);
  };

  const handleElementUpdate = (element: any) => {
    onUpdate?.(element.id, element);
  };

  return (
    <svg
      ref={svgRef}
      width={width}
      height={height}
      style={{
        border: '1px solid #ddd',
        background: '#fafafa',
        fontFamily: 'Arial, sans-serif'
      }}
    >
      <DataAssociationMarkers />

      {/* Groups (drawn first, as background) */}
      {Array.from(store.groups.values()).map((group) => (
        <Group
          key={group.id}
          element={group}
          selected={selectedId === group.id}
          onSelect={handleSelect}
        />
      ))}

      {/* Data Objects */}
      {Array.from(store.dataObjects.values()).map((obj) => (
        <DataObjectComponent
          key={obj.id}
          element={obj}
          selected={selectedId === obj.id}
          onSelect={(id) => handleSelect(id, 'dataObject')}
          onUpdate={handleElementUpdate}
          isCollection={obj.isCollection}
        />
      ))}

      {/* Data Store References */}
      {Array.from(store.dataStoreReferences.values()).map((ref) => (
        <DataStore
          key={ref.id}
          element={ref}
          selected={selectedId === ref.id}
          onSelect={(id) => handleSelect(id, 'dataStoreRef')}
        />
      ))}

      {/* Text Annotations */}
      {Array.from(store.textAnnotations.values()).map((annotation) => (
        <TextAnnotation
          key={annotation.id}
          element={annotation}
          selected={selectedId === annotation.id}
          onSelect={(id) => handleSelect(id, 'textAnnotation')}
          onUpdate={handleElementUpdate}
        />
      ))}

      {/* Data Associations */}
      {Array.from(store.dataAssociations.values()).map((assoc) => {
        // Find source and target positions
        const source =
          store.dataObjects.get(assoc.sourceRef) ||
          store.dataStoreReferences.get(assoc.sourceRef) ||
          store.textAnnotations.get(assoc.sourceRef);
        const target =
          store.dataObjects.get(assoc.targetRef) ||
          store.dataStoreReferences.get(assoc.targetRef) ||
          store.textAnnotations.get(assoc.targetRef);

        if (!source || !target) return null;

        const sourceX = source.x + source.width / 2;
        const sourceY = source.y + source.height / 2;
        const targetX = target.x + target.width / 2;
        const targetY = target.y + target.height / 2;

        return (
          <DataAssociationLine
            key={assoc.id}
            sourceX={sourceX}
            sourceY={sourceY}
            targetX={targetX}
            targetY={targetY}
            selected={selectedId === assoc.id}
            hasTransformation={!!assoc.transformation}
          />
        );
      })}

      {/* Associations to annotations */}
      {Array.from(store.associations.values()).map((assoc) => {
        const source =
          store.dataObjects.get(assoc.sourceRef) ||
          store.dataStoreReferences.get(assoc.sourceRef);
        const target = store.textAnnotations.get(assoc.targetRef);

        if (!source || !target) return null;

        const sourceX = source.x + source.width;
        const sourceY = source.y + source.height / 2;
        const targetX = target.x;
        const targetY = target.y + target.height / 2;

        return (
          <DataAssociationLine
            key={assoc.id}
            sourceX={sourceX}
            sourceY={sourceY}
            targetX={targetX}
            targetY={targetY}
            selected={selectedId === assoc.id}
          />
        );
      })}
    </svg>
  );
};
```

---

## 10. Complete Example Usage

```typescript
// App.tsx
import React, { useState } from 'react';
import { BPMNArtifactCanvas } from './components/BPMNArtifactCanvas';
import { IOSpecificationPanel } from './components/IOSpecification';
import {
  BPMNArtifactStore,
  DataObject,
  DataStoreReference,
  TextAnnotation,
  IOSpecification,
  ItemDefinition
} from './types/bpmn-artifacts';

export const App: React.FC = () => {
  const [store, setStore] = useState<BPMNArtifactStore>(() => {
    const store: BPMNArtifactStore = {
      dataObjects: new Map(),
      dataObjectReferences: new Map(),
      dataStores: new Map(),
      dataStoreReferences: new Map(),
      groups: new Map(),
      textAnnotations: new Map(),
      properties: new Map(),
      itemDefinitions: new Map(),
      associations: new Map(),
      dataAssociations: new Map()
    };

    // Add sample data
    const order: DataObject = {
      id: 'DataObject_Order',
      name: 'Purchase Order',
      type: 'dataObject',
      x: 100,
      y: 100,
      width: 100,
      height: 80,
      itemSubjectRef: 'ItemDefinition_Order',
      isCollection: false,
      states: [
        { id: 'State_Pending', name: 'pending' },
        { id: 'State_Approved', name: 'approved' },
        { id: 'State_Shipped', name: 'shipped' }
      ]
    };

    const customerDB: DataStoreReference = {
      id: 'DataStoreRef_Customer',
      name: 'Customer DB',
      type: 'dataStoreRef',
      x: 300,
      y: 100,
      width: 100,
      height: 80,
      dataStoreRef: 'DataStore_CustomerDB'
    };

    const annotation: TextAnnotation = {
      id: 'TextAnnotation_1',
      name: 'Processing Details',
      type: 'textAnnotation',
      x: 500,
      y: 100,
      width: 200,
      height: 100,
      text: 'This task processes the order and updates inventory'
    };

    const itemDef: ItemDefinition = {
      id: 'ItemDefinition_Order',
      name: 'Order',
      structureRef: 'xs:string'
    };

    store.dataObjects.set(order.id, order);
    store.dataStoreReferences.set(customerDB.id, customerDB);
    store.textAnnotations.set(annotation.id, annotation);
    store.itemDefinitions.set(itemDef.id, itemDef);

    return store;
  });

  const [selectedElement, setSelectedElement] = useState<string | null>(null);

  const handleElementUpdate = (id: string, element: any) => {
    const newStore = { ...store };

    if (element.type === 'dataObject') {
      newStore.dataObjects.set(id, element);
    } else if (element.type === 'textAnnotation') {
      newStore.textAnnotations.set(id, element);
    }

    setStore(newStore);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>BPMN 2.0 Artifacts & Data Elements - React Editor</h1>

      <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
        <div style={{ flex: 1 }}>
          <h2>Canvas</h2>
          <BPMNArtifactCanvas
            store={store}
            width={800}
            height={600}
            onElementSelect={(id, type) => setSelectedElement(id)}
            onUpdate={handleElementUpdate}
          />
        </div>

        <div style={{ flex: 0.3, overflowY: 'auto', maxHeight: '600px' }}>
          <h2>Properties</h2>
          {selectedElement && (
            <div style={{ background: '#f5f5f5', padding: '10px', borderRadius: '4px' }}>
              <p>Selected: {selectedElement}</p>
              {/* Add property editor here */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
```

---

## Implementation Checklist

- [x] Type definitions for all artifacts and data elements
- [x] React components for visual rendering
- [x] SVG-based diagram elements
- [x] Data association visualization
- [x] XML serialization utilities
- [ ] XML deserialization/parsing
- [ ] Drag-and-drop canvas functionality
- [ ] Property editing dialogs
- [ ] Undo/redo support
- [ ] Export to BPMN 2.0 XML
- [ ] Import from BPMN 2.0 XML
- [ ] Validation rules
- [ ] Advanced features (transformations, expressions)

---

## Performance Considerations

1. **Large Diagrams:** Use virtualization for 100+ elements
2. **SVG Rendering:** Consider using canvas for very large diagrams
3. **State Management:** Use React Context or Redux for complex stores
4. **Memoization:** Memoize expensive component renders
5. **Re-renders:** Optimize by splitting store by element type

---

## Testing Strategy

```typescript
// __tests__/DataObject.test.tsx
import { render, screen } from '@testing-library/react';
import { DataObject } from '../components/DataObject';

describe('DataObject Component', () => {
  it('renders data object with name', () => {
    const element = {
      id: 'DO_1',
      name: 'Test Order',
      type: 'dataObject' as const,
      x: 100,
      y: 100,
      width: 100,
      height: 80
    };

    render(
      <svg>
        <DataObject element={element} />
      </svg>
    );

    expect(screen.getByText('Test Order')).toBeInTheDocument();
  });

  it('displays collection marker when isCollection is true', () => {
    const element = {
      id: 'DO_2',
      name: 'Items',
      type: 'dataObject' as const,
      x: 100,
      y: 100,
      width: 100,
      height: 80,
      isCollection: true
    };

    const { container } = render(
      <svg>
        <DataObject element={element} isCollection={true} />
      </svg>
    );

    const lines = container.querySelectorAll('line');
    expect(lines.length).toBeGreaterThanOrEqual(3); // Collection marker lines
  });
});
```

This comprehensive guide provides production-ready components for implementing BPMN 2.0 artifacts and data elements in React.
