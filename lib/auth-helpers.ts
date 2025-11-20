import { getServerSession } from 'next-auth';
import { authOptions } from './auth';
import { Role } from '@prisma/client';

export async function requireSession() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    throw new Error('Unauthorized');
  }
  return session;
}

export function assertRole(role: Role, allowed: Role[]) {
  if (!allowed.includes(role)) {
    throw new Error('Forbidden');
  }
}
