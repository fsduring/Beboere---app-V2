import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { assertRole, requireSession } from '../../../lib/auth-helpers';

export async function GET(request: Request) {
  const session = await requireSession();
  const { searchParams } = new URL(request.url);
  const unitId = searchParams.get('unitId');

  if (session.user.role === 'ADMIN' || session.user.role === 'VIEWER') {
    const documents = await prisma.document.findMany({
      where: unitId ? { unitId } : undefined,
      include: { versions: true }
    });
    return NextResponse.json(documents);
  }

  const allowedUnits = await prisma.tenantUnit.findMany({ where: { userId: session.user.id } });
  const unitIds = allowedUnits.map((t) => t.unitId);
  if (unitId && !unitIds.includes(unitId)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const documents = await prisma.document.findMany({
    where: { unitId: unitId ?? undefined, unit: { tenants: { some: { userId: session.user.id } } } },
    include: { versions: true }
  });
  return NextResponse.json(documents);
}

export async function POST(request: Request) {
  const session = await requireSession();
  assertRole(session.user.role, ['ADMIN']);
  const body = await request.json();
  const { unitId, title } = body;
  const versionNumber = 1;
  const fileKey = `doc_${Date.now()}`;
  const document = await prisma.document.create({
    data: {
      unitId,
      title,
      createdById: session.user.id,
      versions: {
        create: {
          version: versionNumber,
          fileKey
        }
      }
    },
    include: { versions: true }
  });
  await prisma.auditLog.create({ data: { action: 'DOCUMENT_UPLOAD', userId: session.user.id, details: { documentId: document.id } } });
  return NextResponse.json(document);
}

export async function PUT(request: Request) {
  const session = await requireSession();
  const body = await request.json();
  const { documentId, action } = body;
  assertRole(session.user.role, ['ADMIN']);
  const status = action === 'restore' ? 'ACTIVE' : 'DELETED';
  const document = await prisma.document.update({ where: { id: documentId }, data: { status } });
  await prisma.auditLog.create({ data: { action: 'DOCUMENT_STATUS', userId: session.user.id, details: { documentId, status } } });
  return NextResponse.json(document);
}
