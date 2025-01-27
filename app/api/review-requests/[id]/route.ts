import { createClient } from '@/utils/supabase-server'
import { NextResponse } from 'next/server'

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient()

    // Verificar autenticação
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    // Verificar se a solicitação existe e pertence ao usuário
    const { data: reviewRequest } = await supabase
      .from('review_requests')
      .select('user_email')
      .eq('id', params.id)
      .single()

    if (!reviewRequest) {
      return NextResponse.json(
        { error: 'Solicitação não encontrada' },
        { status: 404 }
      )
    }

    if (reviewRequest.user_email !== session.user.email) {
      return NextResponse.json(
        { error: 'Não autorizado a excluir esta solicitação' },
        { status: 403 }
      )
    }

    // Excluir a solicitação
    const { error } = await supabase
      .from('review_requests')
      .delete()
      .eq('id', params.id)

    if (error) {
      throw error
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao excluir solicitação:', error)
    return NextResponse.json(
      { error: 'Erro ao excluir solicitação' },
      { status: 500 }
    )
  }
} 