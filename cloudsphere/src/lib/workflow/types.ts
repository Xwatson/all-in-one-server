export enum NodeType {
  START = 'start',
  END = 'end',
  CRAWLER = 'crawler',
  HTTP = 'http',
  TRANSFORM = 'transform',
  CONDITION = 'condition',
  DELAY = 'delay',
}

export interface NodeData {
  label: string
  [key: string]: any
}

export interface Node {
  id: string
  type: NodeType
  data: NodeData
  position: { x: number; y: number }
}

export interface Edge {
  id: string
  source: string
  target: string
  label?: string
}

export interface CrawlerNodeData extends NodeData {
  url: string
  selector?: string
  waitFor?: string
  apiKey: string
}

export interface HttpNodeData extends NodeData {
  url: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  headers?: Record<string, string>
  body?: any
}

export interface TransformNodeData extends NodeData {
  script: string // JavaScript 转换脚本
}

export interface ConditionNodeData extends NodeData {
  condition: string // JavaScript 条件表达式
}

export interface DelayNodeData extends NodeData {
  duration: number // 延迟时间（毫秒）
}
