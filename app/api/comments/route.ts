import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { assertRole, requireSession } from '../../../lib/auth-helpers';

export async function GET() {
  const session = await requireSession();
  assertRole(session.user.role, ['ADMIN', 'VIEWER']);
  const comments = await prisma.comment.findMany({ include: { createdBy: true } });
  return NextResponse.json(comments);
}

export async function POST(request: Request) {
  const session = await requireSession();
  assertRole(session.user.role, ['ADMIN', 'VIEWER']);
  const body = await request.json();
  const { content, messageId, documentId, photoId } = body;
  const comment = await prisma.comment.create({ data: { content, messageId, documentId, photoId, createdById: session.user.id } });
  await prisma.auditLog.create({ data: { action: 'COMMENT_CREATE', userId: session.user.id, details: { commentId: comment.id } } });
  return NextResponse.json(comment);
}
