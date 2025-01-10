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
      const { data: { user } } = await supabase.auth.exchangeCodeForSession(code)

      if (user?.email) {
        // Verificar se usuário já tem username
        const { data: profile } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', user.id)
          .single()

        if (!profile?.username) {
          // Gerar username a partir do email
          let suggestedUsername = user.email.split('@')[0]
          
          // Verificar se username já existe
          const { data: existing } = await supabase
            .from('profiles')
            .select('username')
            .eq('username', suggestedUsername)
            .single()

          if (existing) {
            // Se já existe, adiciona números aleatórios
            suggestedUsername = `${suggestedUsername}${Math.floor(Math.random() * 1000)}`
          }

          // Criar perfil com username gerado
          await supabase
            .from('profiles')
            .upsert({
              id: user.id,
              username: suggestedUsername,
              email: user.email,
              updated_at: new Date().toISOString()
            })
        }
      }

      // Redirecionar para home
      return NextResponse.redirect(new URL('/', requestUrl.origin))
    }

    return NextResponse.redirect(new URL('/', requestUrl.origin))
  } catch (error) {
    console.error('Erro no callback:', error)
    return NextResponse.redirect(new URL('/auth/error', requestUrl.origin))
  }
} 