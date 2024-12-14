import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
    const session = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })

    if (!session && (
        request.nextUrl.pathname.startsWith('/diary') ||
        request.nextUrl.pathname.startsWith('/food-calculator') ||
        request.nextUrl.pathname.startsWith('/activity') ||
        request.nextUrl.pathname.startsWith('/services')
    )) {
        return NextResponse.redirect(new URL('/member/login', request.url))
    }

    return NextResponse.next()
}

