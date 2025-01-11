import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = createRouteHandlerClient({ cookies })
    
    await supabase.auth.exchangeCodeForSession(code)

    const { data: { user } } = await supabase.auth.getUser()

    if (user?.email) {
      const username = user.email.split('@')[0]

      await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          username: username,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'id'
        })
    }

    // Redireciona para /reviews após login bem-sucedido
    return NextResponse.redirect(new URL('/reviews', requestUrl.origin))
  }

  // Se algo der errado, redireciona para a home
  return NextResponse.redirect(new URL('/', requestUrl.origin))
} 