import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db/prisma';
import { hashPassword, setSession } from '@/lib/auth/session';
import { getRegistrationEnabled } from '@/lib/site-settings';

const schema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email(),
  password: z.string().min(8).max(128),
});

export async function POST(req: Request) {
  try {
    const registrationEnabled = await getRegistrationEnabled();

    if (!registrationEnabled) {
      return NextResponse.json(
        { error: 'New account creation is currently disabled by the admin.' },
        { status: 403 },
      );
    }

    const body = schema.parse(await req.json());
    const email = body.email.toLowerCase();

    if (await prisma.user.findUnique({ where: { email } })) {
      return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 409 });
    }

    const user = await prisma.user.create({
      data: {
        name: body.name,
        email,
        passwordHash: await hashPassword(body.password),
      },
    });

    await setSession(user.id);

    return NextResponse.json({ user: { id: user.id, name: user.name, email: user.email } });
  } catch (e) {
    return NextResponse.json(
      {
        error:
          e instanceof z.ZodError
            ? 'Please enter a valid name, email and password (8+ characters).'
            : 'Could not create account.',
      },
      { status: 400 },
    );
  }
}
