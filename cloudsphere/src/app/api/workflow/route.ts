import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// 获取工作流列表
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const workflows = await prisma.workflow.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    return NextResponse.json(workflows);
  } catch (error) {
    console.error('Error fetching workflows:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// 创建或更新工作流
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { id, name, description, nodes, edges } = await request.json();

    const workflow = await prisma.workflow.upsert({
      where: {
        id: id || '',
      },
      create: {
        name: name || '未命名工作流',
        description,
        nodes,
        edges,
        userId: session.user.id,
      },
      update: {
        name,
        description,
        nodes,
        edges,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(workflow);
  } catch (error) {
    console.error('Error saving workflow:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// 删除工作流
export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { id } = await request.json();

    await prisma.workflow.delete({
      where: {
        id,
        userId: session.user.id,
      },
    });

    return new NextResponse('OK');
  } catch (error) {
    console.error('Error deleting workflow:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
