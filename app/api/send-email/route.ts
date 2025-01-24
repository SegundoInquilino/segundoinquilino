import { NextResponse } from 'next/server'
import { sendCommentNotification } from '@/services/email'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Validar os campos necessários
    if (!body.to || !body.reviewAuthor || !body.commenterName || !body.reviewTitle || !body.commentText) {
      throw new Error('Campos obrigatórios faltando')
    }

    await sendCommentNotification(body)
    
    return NextResponse.json({ 
      success: true,
      message: 'Email enviado com sucesso'
    })
  } catch (error) {
    console.error('Erro ao enviar email:', error)
    return NextResponse.json(
      { 
        error: 'Erro ao enviar email',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    )
  }
} 