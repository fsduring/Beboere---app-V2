import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { assertRole, requireSession } from '../../../lib/auth-helpers';

export async function GET() {
  const session = await requireSession();
  assertRole(session.user.role, ['ADMIN']);
  const logs = await prisma.auditLog.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json(logs);
}
