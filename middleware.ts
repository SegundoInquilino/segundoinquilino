import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req: request, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Se não houver sessão e o usuário estiver tentando acessar uma rota protegida
  if (!session && (
    request.nextUrl.pathname.startsWith('/reviews') ||
    request.nextUrl.pathname.startsWith('/new-review')
  )) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Se houver sessão e o usuário estiver na página inicial
  if (session && request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/reviews', request.url))
  }

  return res
}

export const config = {
  matcher: ['/', '/reviews/:path*', '/new-review/:path*']
}