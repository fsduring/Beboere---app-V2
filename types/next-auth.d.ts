import NextAuth from 'next-auth';
import { Role } from '@prisma/client';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email?: string | null;
      role: Role;
      language: 'da' | 'en';
      seniorMode: boolean;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: Role;
    language?: 'da' | 'en';
    seniorMode?: boolean;
  }
}
