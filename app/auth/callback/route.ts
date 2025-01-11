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

        // Força redirecionamento com script e cookie de sessão
        const html = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <title>Redirecionando...</title>
              <script>
                // Força o redirecionamento para o domínio com www
                window.location.replace('https://www.segundoinquilino.com.br/reviews');
                // Se não redirecionar em 1 segundo, tenta novamente
                setTimeout(function() {
                  if (window.location.hostname !== 'www.segundoinquilino.com.br') {
                    window.location.href = 'https://www.segundoinquilino.com.br/reviews';
                  }
                }, 1000);
              </script>
            </head>
            <body>
              <p>Redirecionando para a página de reviews...</p>
            </body>
          </html>
        `

        return new NextResponse(html, {
          headers: {
            'Content-Type': 'text/html; charset=utf-8',
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
            'Set-Cookie': `sb-access-token=${session.access_token}; Path=/; HttpOnly; Secure; SameSite=Lax; Domain=.segundoinquilino.com.br`
          }
        })
      }
    } catch (error) {
      console.error('Erro no callback:', error)
    }
  }

  return NextResponse.redirect('https://www.segundoinquilino.com.br/auth')
} 