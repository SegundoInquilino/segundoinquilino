import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createClient } from '@/utils/supabase-server'

// Configuração do rate limiting
const RATE_LIMIT = {
  window: 60 * 1000, // 1 minuto
  max: 30 // máximo de requisições por janela
}

// Armazenar tentativas
const ipRequests = new Map<string, { count: number; timestamp: number }>()

export async function middleware(request: NextRequest) {
  const url = new URL(request.url)
  
  // Se houver erro de link expirado na raiz
  if (url.pathname === '/' && url.searchParams.get('error') === 'access_denied') {
    // Redirecionar para a página de reenvio com os parâmetros
    const redirectUrl = new URL('/auth/resend-confirmation', request.url)
    redirectUrl.searchParams.set('error', url.searchParams.get('error') || '')
    redirectUrl.searchParams.set('error_code', url.searchParams.get('error_code') || '')
    redirectUrl.searchParams.set('error_description', url.searchParams.get('error_description') || '')
    
    return NextResponse.redirect(redirectUrl)
  }

  // Pegar IP real usando os headers corretos
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
             request.headers.get('x-real-ip') || 
             'unknown'
             
  const now = Date.now()

  // Limpar registros antigos
  if (ipRequests.has(ip)) {
    const record = ipRequests.get(ip)!
    if (now - record.timestamp > RATE_LIMIT.window) {
      ipRequests.delete(ip)
    }
  }

  // Verificar limite
  const currentRequests = ipRequests.get(ip)
  if (currentRequests && currentRequests.count >= RATE_LIMIT.max) {
    return new NextResponse('Too Many Requests', { status: 429 })
  }

  // Atualizar contagem
  ipRequests.set(ip, {
    count: (currentRequests?.count || 0) + 1,
    timestamp: now
  })

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
  matcher: [
    '/',
    '/auth/:path*',
    '/api/:path*',
    '/reviews/new',
    '/visit-reviews/new'
  ]
}