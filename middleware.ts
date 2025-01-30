import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req: request, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Se estiver na página inicial e já estiver logado, redireciona para /home
  if (request.nextUrl.pathname === '/' && session) {
    return NextResponse.redirect(new URL('/home', request.url))
  }

  // Rotas que requerem autenticação (removida rota do fórum)
  const protectedRoutes = ['/new-review', '/profile', '/settings']
  const isProtectedRoute = protectedRoutes.some(route => request.nextUrl.pathname.startsWith(route))

  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL('/auth', request.url))
  }

  if (session) {
    res.headers.set('x-session-user', session.user.id)
  }
  
  res.headers.set('X-Robots-Tag', 'index, follow')
  res.headers.set('Cache-Control', 'public, max-age=3600')
  
  return res
}

// Configurar para executar apenas na página inicial
export const config = {
  matcher: '/'
}