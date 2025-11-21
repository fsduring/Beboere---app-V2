import { compare, hash } from 'bcryptjs';
import crypto from 'crypto';
import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from './prisma';
import { Role } from '@prisma/client';

export const authOptions: NextAuthOptions = {
  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const user = await prisma.user.findUnique({ where: { email: credentials.email } });
        if (!user) return null;
        const valid = await compare(credentials.password, user.passwordHash);
        if (!valid) return null;
        return { id: user.id, email: user.email, role: user.role, language: user.language, seniorMode: user.seniorMode } as any;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.language = (user as any).language;
        token.seniorMode = (user as any).seniorMode;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!;
        session.user.role = token.role as Role;
        session.user.language = token.language as any;
        session.user.seniorMode = token.seniorMode as boolean;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login'
  }
};

export async function registerUser(email: string, password: string, name: string, houseCode: string) {
  const unit = await prisma.unit.findUnique({ where: { houseCode } });
  if (!unit) throw new Error('Invalid house code');
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new Error('User already exists');
  const passwordHash = await hash(password, 10);
  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      role: 'BEBOER',
      profile: { create: { name } },
      tenants: { create: { unitId: unit.id } }
    }
  });
  await prisma.auditLog.create({
    data: {
      action: 'USER_REGISTER',
      userId: user.id,
      details: { unitId: unit.id }
    }
  });
  return user;
}

export async function resetPassword(email: string, token: string, newPassword: string) {
  const resetToken = await prisma.passwordResetToken.findUnique({ where: { token }, include: { user: true } });
  if (!resetToken || resetToken.used || resetToken.expiresAt < new Date() || resetToken.user.email !== email) {
    throw new Error('Invalid token');
  }
  const passwordHash = await hash(newPassword, 10);
  await prisma.$transaction([
    prisma.user.update({ where: { id: resetToken.userId }, data: { passwordHash } }),
    prisma.passwordResetToken.update({ where: { id: resetToken.id }, data: { used: true } }),
    prisma.auditLog.create({ data: { action: 'PASSWORD_RESET', userId: resetToken.userId, details: {} } })
  ]);
}

export async function createResetToken(email: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error('User not found');
  const token = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60);
  await prisma.passwordResetToken.create({ data: { token, userId: user.id, expiresAt } });
  return token;
}
