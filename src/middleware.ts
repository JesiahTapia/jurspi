import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Admin only routes
    if (path.startsWith('/api/admin') && token?.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 403 });
    }

    // Arbitrator only routes
    if (path.startsWith('/api/arbitrator') && token?.role !== 'ARBITRATOR') {
      return new NextResponse('Unauthorized', { status: 403 });
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    }
  }
);

export const config = {
  matcher: [
    '/api/cases/:path*',
    '/api/admin/:path*',
    '/api/arbitrator/:path*',
    '/api/documents/:path*'
  ]
}; 