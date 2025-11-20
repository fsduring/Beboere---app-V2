import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

const protectedPaths = ['/admin', '/viewer', '/beboer', '/settings'];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const requiresAuth = protectedPaths.some((path) => pathname.startsWith(path));
  if (!requiresAuth) return NextResponse.next();

  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  if (pathname.startsWith('/admin') && token.role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/', req.url));
  }
  if (pathname.startsWith('/viewer') && token.role !== 'VIEWER') {
    return NextResponse.redirect(new URL('/', req.url));
  }
  if (pathname.startsWith('/beboer') && token.role !== 'BEBOER') {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/viewer/:path*', '/beboer/:path*', '/settings']
};
