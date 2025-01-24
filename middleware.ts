import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  try {
    const { data: { session } } = await supabase.auth.getSession()

    // Rotas que requerem autenticação (removida rota do fórum)
    const protectedRoutes = ['/new-review', '/profile', '/settings']
    const isProtectedRoute = protectedRoutes.some(route => req.nextUrl.pathname.startsWith(route))

    if (isProtectedRoute && !session) {
      return NextResponse.redirect(new URL('/auth', req.url))
    }

    if (session) {
      res.headers.set('x-session-user', session.user.id)
    }
    
    res.headers.set('X-Robots-Tag', 'index, follow')
    res.headers.set('Cache-Control', 'public, max-age=3600')
    
    return res
  } catch (error) {
    console.error('Middleware error:', error)
    return res
  }
}

export const config = {
  matcher: [
    '/review-requests/:path*',
    '/api/protected/:path*'
  ]
}