import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { requireSession } from '../../../../lib/auth-helpers';
import { hash, compare } from 'bcryptjs';

export async function PUT(request: Request) {
  const session = await requireSession();
  const body = await request.json();
  const { language, seniorMode, currentPassword, newPassword } = body;

  if (language || typeof seniorMode === 'boolean') {
    await prisma.user.update({ where: { id: session.user.id }, data: { language, seniorMode } });
  }

  if (newPassword) {
    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    const ok = await compare(currentPassword || '', user.passwordHash);
    if (!ok) return NextResponse.json({ error: 'Invalid password' }, { status: 400 });
    const passwordHash = await hash(newPassword, 10);
    await prisma.user.update({ where: { id: user.id }, data: { passwordHash } });
  }

  return NextResponse.json({ success: true });
}
