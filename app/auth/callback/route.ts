import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')

    if (code) {
      const supabase = createRouteHandlerClient({ cookies })
      
      // Troca o código pelo token e estabelece a sessão
      const { data: { session }, error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) throw error
      
      if (session?.user) {
        // Verifica se já existe um perfil
        const { data: profile } = await supabase
          .from('profiles')
          .select()
          .eq('id', session.user.id)
          .single()

        // Se não existir perfil, cria um novo
        if (!profile) {
          const username = session.user.email?.split('@')[0] || 'user'
          
          await supabase
            .from('profiles')
            .insert([
              {
                id: session.user.id,
                username: username,
                email: session.user.email,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              }
            ])
        }

        // Define um cookie de sessão
        cookies().set('supabase-auth-token', session.access_token, {
          path: '/',
          maxAge: 60 * 60 * 24 * 7, // 7 dias
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production'
        })
      }
    }

    // Redireciona para reviews após criar/verificar perfil
    return NextResponse.redirect(new URL('/reviews', requestUrl.origin))
  } catch (error) {
    console.error('Erro no callback de autenticação:', error)
    return NextResponse.redirect(new URL('/auth/error', requestUrl.origin))
  }
} 