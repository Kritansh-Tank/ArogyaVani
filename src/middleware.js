import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || 'arogya-vani-secret-2026'
);

const PROTECTED = ['/assistant', '/dashboard', '/knowledge'];

export async function middleware(request) {
    const { pathname } = request.nextUrl;
    const isProtected = PROTECTED.some((p) => pathname.startsWith(p));
    if (!isProtected) return NextResponse.next();

    const token = request.cookies.get('auth_token')?.value;
    if (!token) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
    }

    try {
        await jwtVerify(token, JWT_SECRET);
        return NextResponse.next();
    } catch {
        const loginUrl = new URL('/login', request.url);
        return NextResponse.redirect(loginUrl);
    }
}

export const config = {
    matcher: ['/assistant/:path*', '/dashboard/:path*', '/knowledge/:path*'],
};
