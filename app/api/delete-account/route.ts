import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies })

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return new NextResponse(
        JSON.stringify({ error: 'Não autorizado' }),
        { status: 401 }
      )
    }

    const userId = session.user.id

    // 1. Deletar reviews
    await supabase
      .from('reviews')
      .delete()
      .eq('user_id', userId)

    // 2. Deletar perfil
    await supabase
      .from('profiles')
      .delete()
      .eq('id', userId)

    // 3. Deletar usuário
    await supabase.auth.admin.deleteUser(userId)

    // 4. Fazer logout
    await supabase.auth.signOut()

    return new NextResponse(
      JSON.stringify({ message: 'Conta deletada com sucesso' }),
      { status: 200 }
    )
  } catch (error) {
    console.error('Erro ao deletar conta:', error)
    return new NextResponse(
      JSON.stringify({ error: 'Erro ao deletar conta' }),
      { status: 500 }
    )
  }
} 