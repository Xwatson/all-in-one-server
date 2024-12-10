import React from 'react';
import { Handle, Position } from 'reactflow';
import { Card } from 'antd';
import { NodeType } from '@/lib/workflow/types';

interface BaseNodeProps {
  data: {
    label: string;
    type: NodeType;
  };
  isConnectable: boolean;
}

export function BaseNode({ data, isConnectable }: BaseNodeProps) {
  return (
    <Card
      size="small"
      title={data.label}
      style={{ width: 200 }}
      className="workflow-node"
    >
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
      />
      <div className="node-content">
        <div className="node-type">{data.type}</div>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
      />
    </Card>
  );
}
