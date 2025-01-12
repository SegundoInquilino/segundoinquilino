import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Se tiver uma sessão, permite o acesso
  if (session) {
    return res
  }

  // Se não tiver sessão e estiver tentando acessar uma rota protegida
  if (req.nextUrl.pathname.startsWith('/reviews')) {
    return NextResponse.redirect(new URL('/auth', req.url))
  }

  return res
}

export const config = {
  matcher: ['/reviews/:path*', '/new-review/:path*']
}