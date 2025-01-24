import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = await cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    // Buscar o post
    const { data: post, error: postError } = await supabase
      .from('forum_posts')
      .select(`
        id,
        title,
        content,
        created_at,
        user_id,
        category,
        user:profiles(username, avatar_url)
      `)
      .eq('id', params.id)
      .single()

    if (postError) {
      console.error('Erro ao buscar post:', postError)
      return NextResponse.json({
        error: postError.message || 'Erro ao buscar post'
      }, { status: 500 })
    }

    if (!post) {
      return NextResponse.json({
        error: 'Post não encontrado'
      }, { status: 404 })
    }

    // Buscar comentários do post
    const { data: comments, error: commentsError } = await supabase
      .from('forum_comments')
      .select(`
        id,
        content,
        created_at,
        user_id,
        user:profiles(username, avatar_url)
      `)
      .eq('post_id', params.id)
      .order('created_at', { ascending: true })

    if (commentsError) {
      console.error('Erro ao buscar comentários:', commentsError)
      // Não falhar completamente se os comentários derem erro
      return NextResponse.json({
        post,
        comments: [],
        error: 'Erro ao carregar comentários'
      })
    }

    return NextResponse.json({
      post,
      comments: comments || []
    })
  } catch (error) {
    console.error('Erro na API:', error)
    return NextResponse.json({
      error: 'Erro interno do servidor',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 })
  }
} 