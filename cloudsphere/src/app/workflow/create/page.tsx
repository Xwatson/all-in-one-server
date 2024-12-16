'use client';

import React from 'react';
import { Layout } from 'antd';
import { WorkflowEditor } from '@/components/workflow/WorkflowEditor';
import { ReactFlowProvider } from 'reactflow';

const { Content } = Layout;

export default function WorkflowCreatePage() {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Content>
        <ReactFlowProvider>
          <WorkflowEditor />
        </ReactFlowProvider>
      </Content>
    </Layout>
  );
}
