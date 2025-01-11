import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  
  try {
    const code = requestUrl.searchParams.get('code')

    if (code) {
      const cookieStore = cookies()
      const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
      
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

        // Redireciona sempre para o domínio principal
        return NextResponse.redirect('https://segundoinquilino.com.br/reviews')
      }
    }

    // Se algo der errado, redireciona para página de erro no domínio principal
    return NextResponse.redirect('https://segundoinquilino.com.br/auth/error')
  } catch (error) {
    console.error('Erro no callback de autenticação:', error)
    return NextResponse.redirect(`${requestUrl.origin}/auth/error`)
  }
} 