import { NextResponse } from 'next/server'
import { sendCommentNotification } from '@/services/email'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    await sendCommentNotification(body)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao enviar email:', error)
    return NextResponse.json(
      { error: 'Erro ao enviar email' },
      { status: 500 }
    )
  }
} 