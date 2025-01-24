import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Garantir que cookies() seja await
    const cookieStore = await cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    // Primeiro verificar se o post existe
    const { data: postExists } = await supabase
      .from('forum_posts')
      .select('id')
      .eq('id', params.id)
      .limit(1)

    if (!postExists?.length) {
      return NextResponse.json({
        error: 'Post não encontrado'
      }, { status: 404 })
    }

    // Buscar post com todos os detalhes
    const { data: post, error: postError } = await supabase
      .from('forum_posts')
      .select(`
        id,
        title,
        content,
        created_at,
        user_id
      `)
      .eq('id', params.id)
      .limit(1)
      .single()

    if (postError) {
      console.error('Erro ao buscar post:', postError)
      return NextResponse.json({
        error: 'Erro ao buscar post',
        details: postError.message
      }, { status: 500 })
    }

    // Buscar informações do usuário separadamente
    const { data: userData, error: userError } = await supabase
      .from('profiles')
      .select('username, avatar_url')
      .eq('id', post.user_id)
      .limit(1)
      .single()

    if (userError) {
      console.error('Erro ao buscar usuário:', userError)
    }

    // Combinar os dados
    const postWithUser = {
      ...post,
      user: userData || null
    }

    return NextResponse.json({ post: postWithUser })
  } catch (error) {
    console.error('Erro inesperado:', error)
    return NextResponse.json({
      error: 'Erro interno do servidor',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 })
  }
} 