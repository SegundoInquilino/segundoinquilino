import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  // Verifica e atualiza a sessão
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Se estiver na raiz e estiver logado, redireciona para /reviews
  if (req.nextUrl.pathname === '/' && session) {
    return NextResponse.redirect(new URL('/reviews', req.url))
  }

  // Se tentar acessar rotas protegidas sem estar logado
  if (!session && req.nextUrl.pathname.startsWith('/reviews')) {
    return NextResponse.redirect(new URL('/auth', req.url))
  }

  return res
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|auth/callback).*)',
  ],
}