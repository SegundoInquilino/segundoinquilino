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

        // Força redirecionamento com script de redirecionamento
        return new NextResponse(
          `
          <!DOCTYPE html>
          <html>
            <head>
              <meta http-equiv="refresh" content="0; url=https://www.segundoinquilino.com.br/reviews">
              <script>
                window.location.replace('https://www.segundoinquilino.com.br/reviews');
              </script>
            </head>
            <body>
              Redirecionando...
            </body>
          </html>
          `,
          {
            headers: {
              'Content-Type': 'text/html',
              'Cache-Control': 'no-store, max-age=0'
            }
          }
        )
      }
    } catch (error) {
      console.error('Erro no callback:', error)
    }
  }

  return NextResponse.redirect('https://www.segundoinquilino.com.br/auth')
} 