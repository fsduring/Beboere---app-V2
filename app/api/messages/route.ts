import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { assertRole, requireSession } from '../../../lib/auth-helpers';

export async function GET() {
  const session = await requireSession();
  const role = session.user.role;

  if (role === 'ADMIN' || role === 'VIEWER') {
    const messages = await prisma.message.findMany({ include: { targets: true, reads: true } });
    return NextResponse.json(messages);
  }

  const units = await prisma.tenantUnit.findMany({ where: { userId: session.user.id } });
  const unitIds = units.map((t) => t.unitId);
  const messages = await prisma.message.findMany({
    where: {
      OR: [
        { targets: { some: { unitId: { in: unitIds } } } },
        { targets: { some: { role: 'BEBOER' } } }
      ]
    },
    include: { targets: true, reads: true }
  });
  return NextResponse.json(messages);
}

export async function POST(request: Request) {
  const session = await requireSession();
  assertRole(session.user.role, ['ADMIN']);
  const body = await request.json();
  const { title, content, phaseId, unitIds, roles } = body;
  const message = await prisma.message.create({
    data: {
      title,
      content,
      phaseId,
      createdById: session.user.id,
      targets: {
        create: [
          ...(unitIds || []).map((unitId: string) => ({ unitId })),
          ...(roles || []).map((role: any) => ({ role }))
        ]
      }
    },
    include: { targets: true }
  });
  await prisma.auditLog.create({ data: { action: 'MESSAGE_CREATE', userId: session.user.id, details: { messageId: message.id } } });
  return NextResponse.json(message);
}

export async function PUT(request: Request) {
  const session = await requireSession();
  const body = await request.json();
  const { messageId } = body;
  await prisma.messageRead.upsert({
    where: { messageId_userId: { messageId, userId: session.user.id } },
    update: {},
    create: { messageId, userId: session.user.id }
  });
  return NextResponse.json({ success: true });
}
