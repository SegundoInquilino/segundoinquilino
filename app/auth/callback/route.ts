import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = createRouteHandlerClient({ cookies })
    
    // Troca o código por uma sessão
    const { data: { session }, error: sessionError } = await supabase.auth.exchangeCodeForSession(code)
    
    if (sessionError) {
      console.error('Erro na sessão:', sessionError)
      return NextResponse.redirect(new URL('/auth', requestUrl.origin))
    }

    if (session?.user) {
      const username = session.user.email?.split('@')[0] || 'user'

      // Atualiza ou cria o perfil
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: session.user.id,
          username: username,
          updated_at: new Date().toISOString(),
          avatar_url: session.user.user_metadata?.avatar_url
        }, {
          onConflict: 'id'
        })

      if (profileError) {
        console.error('Erro ao criar perfil:', profileError)
      }

      // Define o cookie de sessão
      cookies().set('sb-auth-token', session.access_token, {
        path: '/',
        secure: true,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7 // 7 dias
      })

      // Redireciona para reviews com a sessão ativa
      return NextResponse.redirect(new URL('/reviews', requestUrl.origin))
    }
  }

  // Se algo der errado, volta para o login
  return NextResponse.redirect(new URL('/auth', requestUrl.origin))
} 