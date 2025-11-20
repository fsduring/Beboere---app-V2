import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { assertRole, requireSession } from '../../../lib/auth-helpers';

export async function GET() {
  const session = await requireSession();
  assertRole(session.user.role, ['ADMIN', 'VIEWER']);
  const jobs = await prisma.exportJob.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json(jobs);
}

export async function POST() {
  const session = await requireSession();
  assertRole(session.user.role, ['ADMIN', 'VIEWER']);
  const job = await prisma.exportJob.create({
    data: {
      requestedById: session.user.id,
      status: 'COMPLETED',
      fileKey: `export_${Date.now()}.json`
    }
  });
  await prisma.auditLog.create({ data: { action: 'EXPORT_REQUEST', userId: session.user.id, details: { exportId: job.id } } });
  return NextResponse.json(job);
}
