import { Node, Edge } from 'reactflow';

export interface WorkflowData {
  id?: string;
  name: string;
  description?: string;
  nodes: Node[];
  edges: Edge[];
}

export async function saveWorkflow(data: WorkflowData) {
  const response = await fetch('/api/workflow', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('保存工作流失败');
  }

  return response.json();
}

export async function getWorkflow(id: string) {
  const response = await fetch(`/api/workflow/${id}`);

  if (!response.ok) {
    throw new Error('获取工作流失败');
  }

  return response.json();
}

export async function listWorkflows() {
  const response = await fetch('/api/workflow');

  if (!response.ok) {
    throw new Error('获取工作流列表失败');
  }

  return response.json();
}

export async function deleteWorkflow(id: string) {
  const response = await fetch('/api/workflow', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id }),
  });

  if (!response.ok) {
    throw new Error('删除工作流失败');
  }
}

export async function executeWorkflow(workflowId: string) {
  const response = await fetch('/api/workflow/execute', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ workflowId }),
  });

  if (!response.ok) {
    throw new Error('执行工作流失败');
  }

  return response.json();
}
