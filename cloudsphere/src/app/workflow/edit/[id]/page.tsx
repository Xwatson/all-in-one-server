'use client';

import React, { useEffect, useState } from 'react';
import { Layout, Spin, message } from 'antd';
import { WorkflowEditor } from '@/components/workflow/WorkflowEditor';
import { getWorkflow } from '@/services/workflow';
import { ReactFlowProvider } from 'reactflow';

const { Content } = Layout;

export default function WorkflowEditPage({
  params,
}: {
  params: { id: string };
}) {
  const [workflow, setWorkflow] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkflow = async () => {
      try {
        const data = await getWorkflow(params.id);
        setWorkflow(data);
      } catch (error) {
        message.error('获取工作流失败');
      } finally {
        setLoading(false);
      }
    };

    fetchWorkflow();
  }, [params.id]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!workflow) {
    return <div>工作流不存在</div>;
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Content>
        <ReactFlowProvider>
          <WorkflowEditor
            id={workflow.id}
            initialName={workflow.name}
            initialDescription={workflow.description}
            initialNodes={workflow.nodes}
            initialEdges={workflow.edges}
          />
        </ReactFlowProvider>
      </Content>
    </Layout>
  );
}
