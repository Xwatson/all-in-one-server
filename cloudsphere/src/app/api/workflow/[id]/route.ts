import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const workflow = await prisma.workflow.findUnique({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    if (!workflow) {
      return new NextResponse('Workflow not found', { status: 404 });
    }

    return NextResponse.json(workflow);
  } catch (error) {
    console.error('Error fetching workflow:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
