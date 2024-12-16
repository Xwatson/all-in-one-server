import React from 'react'
import { Handle, Position } from 'reactflow'
import { Card, Tag, Tooltip } from 'antd'
import { NodeType } from '@/lib/workflow/types'
import {
  RobotOutlined,
  ApiOutlined,
  TransactionOutlined,
  BranchesOutlined,
  FieldTimeOutlined,
  PlayCircleOutlined,
  StopOutlined,
} from '@ant-design/icons'

interface BaseNodeProps {
  data: {
    label: string
    type: NodeType
    url?: string
    method?: string
    script?: string
    condition?: string
    duration?: number
  }
  isConnectable: boolean
}

const nodeTypeIcons = {
  [NodeType.START]: <PlayCircleOutlined />,
  [NodeType.END]: <StopOutlined />,
  [NodeType.CRAWLER]: <RobotOutlined />,
  [NodeType.HTTP]: <ApiOutlined />,
  [NodeType.TRANSFORM]: <TransactionOutlined />,
  [NodeType.CONDITION]: <BranchesOutlined />,
  [NodeType.DELAY]: <FieldTimeOutlined />,
}

const nodeTypeColors = {
  [NodeType.START]: '#52c41a',
  [NodeType.END]: '#ff4d4f',
  [NodeType.CRAWLER]: '#1890ff',
  [NodeType.HTTP]: '#722ed1',
  [NodeType.TRANSFORM]: '#faad14',
  [NodeType.CONDITION]: '#13c2c2',
  [NodeType.DELAY]: '#eb2f96',
}

export function BaseNode({ data, isConnectable }: BaseNodeProps) {
  const showSourceHandle = data.type !== NodeType.END
  const showTargetHandle = data.type !== NodeType.START

  return (
    <div style={{ position: 'relative', width: 'fit-content' }}>
      {showTargetHandle && (
        <Handle type="target" position={Position.Left} isConnectable={isConnectable} id="target" />
      )}
      <Card
        size="small"
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Tag color={nodeTypeColors[data.type]} icon={nodeTypeIcons[data.type]}>
              {data.type}
            </Tag>
            <span>{data.label}</span>
          </div>
        }
        style={{ width: 240 }}
        className="workflow-node"
      >
        <div className="node-content">
          {data.type === NodeType.CRAWLER && (
            <Tooltip title={data.url}>
              <div className="node-info">URL: {data.url}</div>
            </Tooltip>
          )}
          {data.type === NodeType.HTTP && (
            <div className="node-info">
              {data.method} {data.url}
            </div>
          )}
          {data.type === NodeType.TRANSFORM && (
            <Tooltip title={data.script}>
              <div className="node-info">转换脚本</div>
            </Tooltip>
          )}
          {data.type === NodeType.CONDITION && (
            <Tooltip title={data.condition}>
              <div className="node-info">条件: {data.condition}</div>
            </Tooltip>
          )}
          {data.type === NodeType.DELAY && <div className="node-info">延时: {data.duration}ms</div>}
        </div>
      </Card>
      {showSourceHandle && (
        <Handle type="source" position={Position.Right} isConnectable={isConnectable} id="source" />
      )}
    </div>
  )
}
