import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NodeType } from '@/lib/workflow/types';

// 执行工作流
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { workflowId } = await request.json();

    // 获取工作流
    const workflow = await prisma.workflow.findUnique({
      where: {
        id: workflowId,
        userId: session.user.id,
      },
    });

    if (!workflow) {
      return new NextResponse('Workflow not found', { status: 404 });
    }

    // 创建执行记录
    const execution = await prisma.workflowExecution.create({
      data: {
        status: 'running',
        workflowId: workflow.id,
      },
    });

    // 开始异步执行工作流
    executeWorkflow(workflow, execution.id).catch(console.error);

    return NextResponse.json(execution);
  } catch (error) {
    console.error('Error executing workflow:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

async function executeWorkflow(workflow: any, executionId: string) {
  try {
    const nodes = workflow.nodes as any[];
    const edges = workflow.edges as any[];

    // 找到开始节点
    const startNode = nodes.find(node => node.data.type === NodeType.START);
    if (!startNode) {
      throw new Error('No start node found');
    }

    // 执行节点
    await executeNode(startNode, nodes, edges, new Map());

    // 更新执行状态为完成
    await prisma.workflowExecution.update({
      where: { id: executionId },
      data: {
        status: 'completed',
        endedAt: new Date(),
      },
    });
  } catch (error: any) {
    // 更新执行状态为失败
    await prisma.workflowExecution.update({
      where: { id: executionId },
      data: {
        status: 'failed',
        error: error.message,
        endedAt: new Date(),
      },
    });
    throw error;
  }
}

async function executeNode(
  node: any,
  nodes: any[],
  edges: any[],
  context: Map<string, any>
) {
  // 根据节点类型执行不同的操作
  switch (node.data.type) {
    case NodeType.CRAWLER:
      // 执行爬虫操作
      const response = await fetch('http://localhost:3001/api/crawl', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': node.data.apiKey,
        },
        body: JSON.stringify({
          url: node.data.url,
          selector: node.data.selector,
          waitFor: node.data.waitFor,
        }),
      });
      if (!response.ok) {
        throw new Error('Crawler request failed');
      }
      context.set(node.id, await response.json());
      break;

    case NodeType.HTTP:
      // 执行HTTP请求
      const httpResponse = await fetch(node.data.url, {
        method: node.data.method,
        headers: node.data.headers,
        body: node.data.method !== 'GET' ? JSON.stringify(node.data.body) : undefined,
      });
      if (!httpResponse.ok) {
        throw new Error('HTTP request failed');
      }
      context.set(node.id, await httpResponse.json());
      break;

    case NodeType.TRANSFORM:
      // 执行数据转换
      const script = new Function('data', 'context', node.data.script);
      const result = script(context.get(node.id), context);
      context.set(node.id, result);
      break;

    case NodeType.CONDITION:
      // 执行条件判断
      const condition = new Function('context', `return ${node.data.condition}`);
      const conditionResult = condition(context);
      context.set(node.id, conditionResult);
      break;

    case NodeType.DELAY:
      // 执行延时
      await new Promise(resolve => setTimeout(resolve, node.data.duration));
      break;
  }

  // 找到下一个节点
  const nextEdges = edges.filter(edge => edge.source === node.id);
  for (const edge of nextEdges) {
    const nextNode = nodes.find(n => n.id === edge.target);
    if (nextNode) {
      await executeNode(nextNode, nodes, edges, context);
    }
  }
}
