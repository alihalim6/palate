import { sessionConfig } from '@/lib/session.config';
import { User } from '@/types';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const session = await getIronSession<User>(cookies(), sessionConfig);

  if (!session['palate-user-id']) {
    return NextResponse.redirect(new URL('/passphrase', request.url));
  };

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - passphrase (login)
     * - public assets
     */
    '/((?!api|_next/static|_next/image|favicon.ico|passphrase|images|audio).*)',
  ],
};