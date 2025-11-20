import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { assertRole, requireSession } from '../../../lib/auth-helpers';

export async function GET(request: Request) {
  const session = await requireSession();
  const { searchParams } = new URL(request.url);
  const unitId = searchParams.get('unitId');

  if (session.user.role === 'ADMIN' || session.user.role === 'VIEWER') {
    const photos = await prisma.photo.findMany({ where: unitId ? { unitId } : undefined });
    return NextResponse.json(photos);
  }
  const allowedUnits = await prisma.tenantUnit.findMany({ where: { userId: session.user.id } });
  const unitIds = allowedUnits.map((t) => t.unitId);
  if (unitId && !unitIds.includes(unitId)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const photos = await prisma.photo.findMany({ where: { unitId: unitId ?? undefined, unit: { tenants: { some: { userId: session.user.id } } } } });
  return NextResponse.json(photos);
}

export async function POST(request: Request) {
  const session = await requireSession();
  assertRole(session.user.role, ['ADMIN']);
  const body = await request.json();
  const { unitId, title } = body;
  const fileKey = `photo_${Date.now()}`;
  const photo = await prisma.photo.create({ data: { unitId, title, fileKey, createdById: session.user.id } });
  await prisma.auditLog.create({ data: { action: 'PHOTO_UPLOAD', userId: session.user.id, details: { photoId: photo.id } } });
  return NextResponse.json(photo);
}

export async function PUT(request: Request) {
  const session = await requireSession();
  assertRole(session.user.role, ['ADMIN']);
  const body = await request.json();
  const { photoId, pinned } = body;
  const photo = await prisma.photo.update({ where: { id: photoId }, data: { pinned } });
  await prisma.auditLog.create({ data: { action: 'PHOTO_PIN', userId: session.user.id, details: { photoId, pinned } } });
  return NextResponse.json(photo);
}
