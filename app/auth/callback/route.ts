import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')

    if (code) {
      const cookieStore = cookies()
      const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
      await supabase.auth.exchangeCodeForSession(code)
    }

    // Redirecionando para a página de reviews após o login
    return NextResponse.redirect(new URL('/reviews', requestUrl.origin))
  } catch (error) {
    console.error('Erro no callback de autenticação:', error)
    return NextResponse.redirect(new URL('/auth/error', request.url))
  }
} 