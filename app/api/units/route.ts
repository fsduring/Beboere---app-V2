import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { assertRole, requireSession } from '../../../lib/auth-helpers';

export async function GET() {
  const session = await requireSession();
  const role = session.user.role;

  if (role === 'ADMIN' || role === 'VIEWER') {
    const units = await prisma.unit.findMany({ include: { tenants: true } });
    return NextResponse.json(units);
  }

  const units = await prisma.unit.findMany({
    where: { tenants: { some: { userId: session.user.id } } },
    include: { tenants: true }
  });
  return NextResponse.json(units);
}

export async function POST(request: Request) {
  const session = await requireSession();
  assertRole(session.user.role, ['ADMIN']);
  const body = await request.json();
  const { name, address, houseCode } = body;
  const unit = await prisma.unit.create({ data: { name, address, houseCode } });
  await prisma.auditLog.create({ data: { action: 'UNIT_CREATE', userId: session.user.id, details: { unitId: unit.id } } });
  return NextResponse.json(unit);
}
