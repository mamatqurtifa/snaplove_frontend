import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Check if this is an admin route
  if (pathname.startsWith('/official-admin-snaplove')) {
    // Set a custom header to indicate this is an admin route
    const response = NextResponse.next();
    response.headers.set('x-is-admin-route', 'true');
    return response;
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/official-admin-snaplove/:path*'],
};