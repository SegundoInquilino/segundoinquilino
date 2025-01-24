import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    console.log('Iniciando busca de posts...')

    // Buscar posts usando o nome completo da tabela
    const { data: posts, error: postsError } = await supabase
      .from('forum_posts')  // View no schema public
      .select(`
        id,
        title,
        content,
        created_at,
        user_id,
        category,
        user:profiles(username, avatar_url)
      `)
      .order('created_at', { ascending: false })

    if (postsError) {
      console.error('Erro ao buscar posts:', postsError)
      return NextResponse.json({
        error: 'Erro ao buscar posts',
        details: postsError.message
      }, { status: 500 })
    }

    if (!posts?.length) {
      return NextResponse.json({ posts: [] })
    }

    // Buscar usuários
    const userIds = [...new Set(posts.map(post => post.user_id))]
    const { data: users, error: usersError } = await supabase
      .from('profiles')
      .select('id, username, avatar_url')
      .in('id', userIds)

    if (usersError) {
      console.error('Erro ao buscar usuários:', usersError)
      return NextResponse.json({
        error: 'Erro ao buscar usuários',
        details: usersError.message
      }, { status: 500 })
    }

    // Combinar dados
    const postsWithUsers = posts.map(post => ({
      ...post,
      user: users?.find(user => user.id === post.user_id)
    }))

    return NextResponse.json({ posts: postsWithUsers })
  } catch (error) {
    console.error('Erro inesperado:', error)
    return NextResponse.json({
      error: 'Erro interno do servidor',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 })
  }
} 