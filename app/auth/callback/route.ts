import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = createRouteHandlerClient({ cookies })
    
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.exchangeCodeForSession(code)
      
      if (sessionError) throw sessionError

      if (session?.user) {
        const username = session.user.email?.split('@')[0] || 'user'

        await supabase
          .from('profiles')
          .upsert({
            id: session.user.id,
            username: username,
            updated_at: new Date().toISOString(),
            avatar_url: session.user.user_metadata?.avatar_url
          }, {
            onConflict: 'id'
          })

        // Redireciona para a página de reviews no domínio principal
        return NextResponse.redirect('https://www.segundoinquilino.com.br/reviews')
      }
    } catch (error) {
      console.error('Erro no callback:', error)
    }
  }

  // Se algo der errado, volta para o login
  return NextResponse.redirect('https://www.segundoinquilino.com.br/auth')
} 