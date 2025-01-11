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

        // Força o redirecionamento com a URL completa e recarrega a página
        return NextResponse.redirect('https://www.segundoinquilino.com.br/reviews', {
          status: 302,
          headers: {
            'Cache-Control': 'no-store, max-age=0',
            'Refresh': '0;url=https://www.segundoinquilino.com.br/reviews'
          }
        })
      }
    } catch (error) {
      console.error('Erro no callback:', error)
    }
  }

  return NextResponse.redirect('https://www.segundoinquilino.com.br/auth')
} 