import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  try {
    // Verifica e atualiza a sessão
    const { data: { session }, error } = await supabase.auth.getSession()

    if (error) {
      console.error('Erro na sessão:', error)
      return NextResponse.redirect('https://www.segundoinquilino.com.br/auth')
    }

    // Se estiver na raiz e estiver logado, redireciona para /reviews
    if (req.nextUrl.pathname === '/' && session) {
      return NextResponse.redirect('https://www.segundoinquilino.com.br/reviews')
    }

    // Se tentar acessar rotas protegidas sem estar logado
    if (!session && req.nextUrl.pathname.startsWith('/reviews')) {
      return NextResponse.redirect('https://www.segundoinquilino.com.br/auth')
    }

    // Atualiza o token se necessário
    if (session) {
      const { error: refreshError } = await supabase.auth.refreshSession()
      if (refreshError) {
        console.error('Erro ao atualizar token:', refreshError)
        return NextResponse.redirect('https://www.segundoinquilino.com.br/auth')
      }
    }

    return res
  } catch (error) {
    console.error('Erro no middleware:', error)
    return NextResponse.redirect('https://www.segundoinquilino.com.br/auth')
  }
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|auth/callback).*)',
  ],
}