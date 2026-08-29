import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db/prisma';
import { requireUser } from '@/lib/auth/session';

const schema = z.object({ topicId: z.string().min(1), status: z.enum(['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED']) });

export async function POST(req: Request) {
  try {
    const user = await requireUser();
    const body = schema.parse(await req.json());
    const topic = await prisma.studyTopic.findUnique({ where: { id: body.topicId }, select: { id: true } });
    if (!topic) return NextResponse.json({ error: 'Topic not found' }, { status: 404 });

    const now = new Date();
    const existing = await prisma.studyProgress.findUnique({ where: { userId_topicId: { userId: user.id, topicId: body.topicId } } });
    const revisingCompletedTopic = body.status === 'COMPLETED' && existing?.status === 'COMPLETED';
    const progress = await prisma.studyProgress.upsert({
      where: { userId_topicId: { userId: user.id, topicId: body.topicId } },
      create: { userId: user.id, topicId: body.topicId, status: body.status, startedAt: body.status === 'NOT_STARTED' ? null : now, completedAt: body.status === 'COMPLETED' ? now : null },
      update: {
        status: body.status,
        startedAt: body.status === 'NOT_STARTED' ? null : existing?.startedAt || now,
        completedAt: body.status === 'COMPLETED' ? now : null,
        revisionCount: revisingCompletedTopic ? { increment: 1 } : undefined,
      },
    });
    return NextResponse.json(progress);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Invalid request' }, { status: 400 });
  }
}
