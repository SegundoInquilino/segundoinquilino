import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const error = requestUrl.searchParams.get('error')
  const error_description = requestUrl.searchParams.get('error_description')

  // Se houver erro de link expirado
  if (error === 'access_denied' && error_description?.includes('expired')) {
    // Redirecionar para página de reenvio de confirmação
    return NextResponse.redirect(`${requestUrl.origin}/auth/resend-confirmation`)
  }

  if (code) {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    
    try {
      // Verificar se o email foi confirmado
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        console.error('Erro na confirmação:', error)
        return NextResponse.redirect(`${requestUrl.origin}/auth/error`)
      }

      // Atualizar o status de verificação
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        await supabase.from('profiles')
          .update({ email_confirmed_at: new Date().toISOString() })
          .eq('id', user.id)
      }

      return NextResponse.redirect(`${requestUrl.origin}/auth/success`)
    } catch (error) {
      console.error('Erro no callback:', error)
      return NextResponse.redirect(`${requestUrl.origin}/auth/error`)
    }
  }

  // Se não houver código, redirecionar para página de erro
  return NextResponse.redirect(`${requestUrl.origin}/auth/error`)
} 