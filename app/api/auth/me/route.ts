import { NextResponse } from 'next/server';
import { getCurrentUser, requireUser } from '@/lib/auth/session';
import { prisma } from '@/lib/db/prisma';

export async function GET() {
  const user = await getCurrentUser();
  return NextResponse.json({ user });
}

export async function PUT(req: Request) {
  const user = await requireUser();
  const body = await req.json().catch(() => ({}));

  const profile = await prisma.user.update({
    where: { id: user.id },
    data: {
      name: typeof body.name === 'string' ? body.name.trim() : undefined,
      email: typeof body.email === 'string' ? body.email.trim().toLowerCase() : undefined,
      image: typeof body.image === 'string' ? body.image.trim() : undefined,
      githubUrl: typeof body.githubUrl === 'string' ? body.githubUrl.trim() : undefined,
      xUrl: typeof body.xUrl === 'string' ? body.xUrl.trim() : undefined,
      linkedinUrl: typeof body.linkedinUrl === 'string' ? body.linkedinUrl.trim() : undefined,
    },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      githubUrl: true,
      xUrl: true,
      linkedinUrl: true,
    },
  });

  return NextResponse.json({ user: profile });
}

