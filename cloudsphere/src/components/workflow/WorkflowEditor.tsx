import React, { useState, useCallback } from 'react';
import ReactFlow, {
  Controls,
  Background,
  applyEdgeChanges,
  applyNodeChanges,
  addEdge,
  Node,
  Edge,
  Connection,
} from 'reactflow';
import { Layout, Card, Button, Drawer, Form, Input, Select, message } from 'antd';
import {
  PlusOutlined,
  SaveOutlined,
  PlayCircleOutlined,
} from '@ant-design/icons';
import { BaseNode } from './nodes/BaseNode';
import { NodeType } from '@/lib/workflow/types';

const { Sider, Content } = Layout;

const nodeTypes = {
  default: BaseNode,
};

interface WorkflowEditorProps {
  initialNodes?: Node[];
  initialEdges?: Edge[];
  onSave?: (nodes: Node[], edges: Edge[]) => void;
  onExecute?: () => void;
}

export const WorkflowEditor = ({
  initialNodes = [],
  initialEdges = [],
  onSave,
  onExecute,
}: WorkflowEditorProps) => {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [form] = Form.useForm();

  const onNodesChange = useCallback(
    (changes: any) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange = useCallback(
    (changes: any) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect = useCallback(
    (connection: Connection) => setEdges((eds) => addEdge(connection, eds)),
    []
  );

  const handleAddNode = (values: any) => {
    const newNode: Node = {
      id: Date.now().toString(),
      type: 'default',
      position: { x: 100, y: 100 },
      data: {
        label: values.label,
        type: values.type,
        ...values.config,
      },
    };

    setNodes((nds) => [...nds, newNode]);
    setDrawerVisible(false);
    form.resetFields();
  };

  const handleSave = () => {
    if (onSave) {
      onSave(nodes, edges);
      message.success('工作流已保存');
    }
  };

  const handleExecute = () => {
    if (onExecute) {
      onExecute();
      message.info('工作流开始执行');
    }
  };

  return (
    <Layout style={{ height: '100vh' }}>
      <Sider width={300} theme="light">
        <Card title="工具箱" bordered={false}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setDrawerVisible(true)}
            block
          >
            添加节点
          </Button>
          <div style={{ marginTop: 16 }}>
            <Button
              icon={<SaveOutlined />}
              onClick={handleSave}
              style={{ marginRight: 8 }}
            >
              保存
            </Button>
            <Button
              type="primary"
              icon={<PlayCircleOutlined />}
              onClick={handleExecute}
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
          nodeTypes={nodeTypes}
          fitView
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
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddNode}
        >
          <Form.Item
            name="label"
            label="节点名称"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="type"
            label="节点类型"
            rules={[{ required: true }]}
          >
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
    </Layout>
  );
};
