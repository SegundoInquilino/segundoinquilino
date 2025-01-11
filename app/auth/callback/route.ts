import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = createRouteHandlerClient({ cookies })
    
    // Troca o código pelo token
    await supabase.auth.exchangeCodeForSession(code)

    // Pega os dados do usuário atual
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      // Verifica se já existe um perfil
      const { data: profile } = await supabase
        .from('profiles')
        .select()
        .eq('id', user.id)
        .single()

      // Se não existir perfil, cria um novo
      if (!profile) {
        const username = user.email?.split('@')[0] || 'user'
        
        await supabase
          .from('profiles')
          .insert([
            {
              id: user.id,
              username: username,
              email: user.email,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
          ])
      }
    }
  }

  // Redireciona para reviews após criar/verificar perfil
  return NextResponse.redirect(new URL('/reviews', requestUrl.origin))
} 