import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const url = new URL(req.url);
  const isProtected = url.pathname.startsWith('/protected');
  if (!isProtected) return NextResponse.next();

  const cookie = req.cookies.get('etc_session')?.value;
  if (!cookie) return NextResponse.redirect(new URL('/login', req.url));
  try {
    const payload = JSON.parse(decodeURIComponent(cookie));
    if (!payload?.user) throw new Error('no user');
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL('/login', req.url));
  }
}

export const config = {
  matcher: ['/protected/:path*']
};


