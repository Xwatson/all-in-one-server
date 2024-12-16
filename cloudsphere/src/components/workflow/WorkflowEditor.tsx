'use client'

import React, { useState, useCallback, useEffect } from 'react'
import ReactFlow, {
  Controls,
  Background,
  applyEdgeChanges,
  applyNodeChanges,
  addEdge,
  Node,
  Edge,
  Connection,
  useReactFlow,
  MarkerType,
  ConnectionMode,
  useNodesState,
  useEdgesState,
} from 'reactflow'
import { Layout, Card, Button, Drawer, Form, Input, Select, message } from 'antd'
import {
  PlusOutlined,
  SaveOutlined,
  PlayCircleOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons'
import { BaseNode } from './nodes/BaseNode'
import { NodeConfig } from './nodes/NodeConfig'
import { NodeType } from '@/lib/workflow/types'
import { useRouter } from 'next/navigation'
import { saveWorkflow, executeWorkflow } from '@/services/workflow'
import 'reactflow/dist/style.css'
import './styles.css'

const { Sider, Content } = Layout

const nodeTypes = {
  default: BaseNode,
}

interface WorkflowEditorProps {
  id?: string
  initialNodes?: Node[]
  initialEdges?: Edge[]
  initialName?: string
  initialDescription?: string
  onSave?: (nodes: Node[], edges: Edge[]) => void
  onExecute?: () => void
}

export const WorkflowEditor = ({
  id,
  initialNodes = [],
  initialEdges = [],
  initialName = '未命名工作流',
  initialDescription = '',
  onSave,
  onExecute,
}: WorkflowEditorProps) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [drawerVisible, setDrawerVisible] = useState(false)
  const [configDrawerVisible, setConfigDrawerVisible] = useState(false)
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const [workflowName, setWorkflowName] = useState(initialName)
  const [workflowDescription, setWorkflowDescription] = useState(initialDescription)
  const [saving, setSaving] = useState(false)
  const [executing, setExecuting] = useState(false)
  const [form] = Form.useForm()
  const { project } = useReactFlow()
  const router = useRouter()

  // const onNodesChange = useCallback(
  //   (changes: any) => setNodes(nds => applyNodeChanges(changes, nds)),
  //   []
  // )

  // const onEdgesChange = useCallback((changes: any) => {
  //   return setEdges(eds => applyEdgeChanges(changes, eds))
  // }, [])

  // const onConnect = useCallback((params: Connection) => {
  //   const newEdge = {
  //     ...params,
  //     type: 'smoothstep',
  //     animated: true,
  //     markerEnd: { type: MarkerType.ArrowClosed },
  //   }
  //   setEdges(eds => addEdge(newEdge, eds))
  // }, [])
  const onConnect = useCallback((params: any) => setEdges(eds => addEdge(params, eds)), [setEdges])

  const handleNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node)
    setConfigDrawerVisible(true)
  }, [])

  const handleNodeConfigUpdate = (values: any) => {
    if (selectedNode) {
      setNodes(nds =>
        nds.map(node => {
          if (node.id === selectedNode.id) {
            return {
              ...node,
              data: {
                ...node.data,
                ...values,
              },
            }
          }
          return node
        })
      )
      setConfigDrawerVisible(false)
      setSelectedNode(null)
      message.success('节点配置已更新')
    }
  }

  const handleNodeDelete = useCallback((nodeId: string) => {
    setNodes(nds => nds.filter(node => node.id !== nodeId))
    setEdges(eds => eds.filter(edge => edge.source !== nodeId && edge.target !== nodeId))
    setConfigDrawerVisible(false)
    setSelectedNode(null)
    message.success('节点已删除')
  }, [])

  const handleAddNode = (values: any) => {
    const position = project({ x: 0, y: 0 })
    const newNode: Node = {
      id: Date.now().toString(),
      type: 'default',
      position: { x: position.x + 100, y: position.y + 100 },
      data: {
        label: values.label,
        type: values.type,
      },
    }

    setNodes(nds => [...nds, newNode])
    setDrawerVisible(false)
    form.resetFields()
    message.success('节点已添加')
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      const data = {
        id,
        name: workflowName,
        description: workflowDescription,
        nodes,
        edges,
      }
      const savedWorkflow = await saveWorkflow(data)
      message.success('工作流已保存')

      // 如果是新建工作流，保存后跳转到编辑页
      if (!id) {
        router.push(`/workflow/edit/${savedWorkflow.id}`)
      }
    } catch (error) {
      message.error('保存失败')
    } finally {
      setSaving(false)
    }
  }

  const handleExecute = async () => {
    if (!id) {
      message.warning('请先保存工作流')
      return
    }

    try {
      setExecuting(true)
      await executeWorkflow(id)
      message.success('工作流开始执行')
    } catch (error) {
      message.error('执行失败')
    } finally {
      setExecuting(false)
    }
  }

  return (
    <Layout style={{ height: '100vh' }}>
      <Sider width={300} theme="light">
        <Card title="工作流信息" bordered={false}>
          <Form layout="vertical">
            <Form.Item label="名称">
              <Input
                value={workflowName}
                onChange={e => setWorkflowName(e.target.value)}
                placeholder="请输入工作流名称"
              />
            </Form.Item>
            <Form.Item label="描述">
              <Input.TextArea
                value={workflowDescription}
                onChange={e => setWorkflowDescription(e.target.value)}
                placeholder="请输入工作流描述"
                autoSize={{ minRows: 2, maxRows: 6 }}
              />
            </Form.Item>
          </Form>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setDrawerVisible(true)}
            block
            style={{ marginTop: 16 }}
          >
            添加节点
          </Button>
          <div style={{ marginTop: 16 }}>
            <Button
              icon={<SaveOutlined />}
              onClick={handleSave}
              style={{ marginRight: 8 }}
              loading={saving}
            >
              保存
            </Button>
            <Button
              type="primary"
              icon={<PlayCircleOutlined />}
              onClick={handleExecute}
              loading={executing}
              disabled={!id}
            >
              执行
            </Button>
          </div>
        </Card>
      </Sider>
      <Content>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={handleNodeClick}
          nodeTypes={nodeTypes}
          connectionMode={ConnectionMode.Loose}
          fitView
          deleteKeyCode={['Backspace', 'Delete']}
          multiSelectionKeyCode={['Control', 'Meta']}
          selectionKeyCode={['Shift']}
          proOptions={{ hideAttribution: true }}
        >
          <Background />
          <Controls />
        </ReactFlow>
      </Content>

      <Drawer
        title="添加节点"
        placement="right"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        width={400}
      >
        <Form form={form} layout="vertical" onFinish={handleAddNode}>
          <Form.Item name="label" label="节点名称" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="type" label="节点类型" rules={[{ required: true }]}>
            <Select>
              <Select.Option value={NodeType.START}>开始</Select.Option>
              <Select.Option value={NodeType.END}>结束</Select.Option>
              <Select.Option value={NodeType.CRAWLER}>爬虫</Select.Option>
              <Select.Option value={NodeType.HTTP}>HTTP请求</Select.Option>
              <Select.Option value={NodeType.TRANSFORM}>数据转换</Select.Option>
              <Select.Option value={NodeType.CONDITION}>条件判断</Select.Option>
              <Select.Option value={NodeType.DELAY}>延时</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              添加
            </Button>
          </Form.Item>
        </Form>
      </Drawer>

      <Drawer
        title="节点配置"
        placement="right"
        onClose={() => {
          setConfigDrawerVisible(false)
          setSelectedNode(null)
        }}
        open={configDrawerVisible}
        width={400}
      >
        {selectedNode && (
          <Form
            layout="vertical"
            initialValues={{
              label: selectedNode.data.label,
              type: selectedNode.data.type,
              config: { ...selectedNode.data },
            }}
            onFinish={handleNodeConfigUpdate}
          >
            <Form.Item name="label" label="节点名称" rules={[{ required: true }]}>
              <Input />
            </Form.Item>

            <Form.Item name="type" label="节点类型" rules={[{ required: true }]}>
              <Select disabled>
                <Select.Option value={NodeType.START}>开始</Select.Option>
                <Select.Option value={NodeType.END}>结束</Select.Option>
                <Select.Option value={NodeType.CRAWLER}>爬虫</Select.Option>
                <Select.Option value={NodeType.HTTP}>HTTP请求</Select.Option>
                <Select.Option value={NodeType.TRANSFORM}>数据转换</Select.Option>
                <Select.Option value={NodeType.CONDITION}>条件判断</Select.Option>
                <Select.Option value={NodeType.DELAY}>延时</Select.Option>
              </Select>
            </Form.Item>

            <NodeConfig type={selectedNode.data.type as NodeType} />

            <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
              <Button type="primary" htmlType="submit" icon={<EditOutlined />} block>
                更新配置
              </Button>
              <Button
                danger
                icon={<DeleteOutlined />}
                onClick={() => handleNodeDelete(selectedNode.id)}
                block
              >
                删除节点
              </Button>
            </div>
          </Form>
        )}
      </Drawer>
    </Layout>
  )
}
