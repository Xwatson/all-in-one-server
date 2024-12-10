'use client';

import React from 'react';
import { WorkflowEditor } from '@/components/workflow/WorkflowEditor';
import { Node, Edge } from 'reactflow';
import 'reactflow/dist/style.css';
import { Layout, Typography } from 'antd';

const { Header, Content } = Layout;
const { Title } = Typography;

export default function WorkflowPage() {
  const handleSave = async (nodes: Node[], edges: Edge[]) => {
    try {
      const response = await fetch('/api/workflow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nodes, edges }),
      });

      if (!response.ok) {
        throw new Error('Failed to save workflow');
      }
    } catch (error) {
      console.error('Error saving workflow:', error);
    }
  };

  const handleExecute = async () => {
    try {
      const response = await fetch('/api/workflow/execute', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to execute workflow');
      }
    } catch (error) {
      console.error('Error executing workflow:', error);
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ background: '#fff', padding: '0 24px' }}>
        <Title level={3}>工作流编辑器</Title>
      </Header>
      <Content>
        <WorkflowEditor onSave={handleSave} onExecute={handleExecute} />
      </Content>
    </Layout>
  );
}
