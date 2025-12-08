import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/giris-yap', request.url));
  }
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/company/me`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  if (!response.ok) {
    return NextResponse.redirect(new URL('/giris-yap', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/panel/:path*'],
};
