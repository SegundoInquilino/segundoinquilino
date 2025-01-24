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

    // Verificar se o comentário existe e pertence ao usuário
    const { data: comment } = await supabase
      .from('forum_comments')
      .select('user_id')
      .eq('id', params.id)
      .single()

    if (!comment) {
      return NextResponse.json(
        { error: 'Comentário não encontrado' },
        { status: 404 }
      )
    }

    if (comment.user_id !== session.user.id) {
      return NextResponse.json(
        { error: 'Não autorizado a excluir este comentário' },
        { status: 403 }
      )
    }

    // Excluir o comentário
    const { error } = await supabase
      .from('forum_comments')
      .delete()
      .eq('id', params.id)

    if (error) {
      throw error
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao excluir comentário:', error)
    return NextResponse.json(
      { error: 'Erro ao excluir comentário' },
      { status: 500 }
    )
  }
} 