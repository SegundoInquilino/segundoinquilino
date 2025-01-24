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

    // Verificar se o post existe e pertence ao usuário
    const { data: post } = await supabase
      .from('forum_posts')
      .select('user_id')
      .eq('id', params.id)
      .single()

    if (!post) {
      return NextResponse.json(
        { error: 'Post não encontrado' },
        { status: 404 }
      )
    }

    if (post.user_id !== session.user.id) {
      return NextResponse.json(
        { error: 'Não autorizado a excluir este post' },
        { status: 403 }
      )
    }

    // Excluir o post
    const { error } = await supabase
      .from('forum_posts')
      .delete()
      .eq('id', params.id)

    if (error) {
      throw error
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao excluir post:', error)
    return NextResponse.json(
      { error: 'Erro ao excluir post' },
      { status: 500 }
    )
  }
} 