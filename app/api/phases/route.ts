import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { assertRole, requireSession } from '../../../lib/auth-helpers';

export async function GET() {
  const session = await requireSession();
  if (session.user.role === 'ADMIN' || session.user.role === 'VIEWER') {
    const phases = await prisma.phase.findMany({ include: { unitPhases: true } });
    return NextResponse.json(phases);
  }
  const phases = await prisma.phase.findMany({
    where: {
      unitPhases: { some: { unit: { tenants: { some: { userId: session.user.id } } } } }
    },
    include: { unitPhases: true }
  });
  return NextResponse.json(phases);
}

export async function POST(request: Request) {
  const session = await requireSession();
  assertRole(session.user.role, ['ADMIN']);
  const body = await request.json();
  const { name, status, description, startDate, endDate, unitIds } = body;
  const phase = await prisma.phase.create({
    data: {
      name,
      status,
      description,
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null,
      unitPhases: unitIds ? { create: unitIds.map((unitId: string) => ({ unitId })) } : undefined
    }
  });
  await prisma.auditLog.create({ data: { action: 'PHASE_CREATE', userId: session.user.id, details: { phaseId: phase.id } } });
  return NextResponse.json(phase);
}
