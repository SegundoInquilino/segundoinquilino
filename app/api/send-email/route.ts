import sgMail from '@sendgrid/mail'
import { NextResponse } from 'next/server'

sgMail.setApiKey(process.env.SENDGRID_API_KEY!)

export async function POST(request: Request) {
  try {
    const { to, buildingName, reviewerName } = await request.json()

    const msg = {
      to,
      from: process.env.SENDGRID_FROM_EMAIL!,
      subject: 'Sua solicitação de review foi respondida!',
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif; background-color: #F9FAFB;">
          <div style="background-color: white; border-radius: 8px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #1F2937; margin-bottom: 10px; font-size: 24px;">Sua Review Foi Respondida! 🎉</h1>
            </div>
            
            <div style="background-color: #F3F4F6; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <p style="color: #4B5563; font-size: 16px; line-height: 24px; margin: 0;">
                Olá!
              </p>
              <p style="color: #4B5563; font-size: 16px; line-height: 24px;">
                <strong>${reviewerName}</strong> acabou de publicar uma review sobre o imóvel <strong>${buildingName}</strong> que você solicitou.
              </p>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <p style="color: #4B5563; font-size: 16px; line-height: 24px; margin-bottom: 15px;">
                Para ver a review completa, faça login ou crie sua conta:
              </p>
              <a href="${process.env.NEXT_PUBLIC_BASE_URL}/auth?redirect=/my-reviews" 
                 style="background-color: #3B82F6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                Acessar Review
              </a>
            </div>

            <div style="border-top: 1px solid #E5E7EB; margin: 30px 0; padding-top: 20px;">
              <p style="color: #6B7280; font-size: 14px; text-align: center; margin-bottom: 15px;">
                Ainda não tem uma conta no Segundo Inquilino?
              </p>
              <div style="text-align: center;">
                <a href="${process.env.NEXT_PUBLIC_BASE_URL}/auth" 
                   style="background-color: #10B981; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-size: 14px; display: inline-block;">
                  Criar Conta Grátis
                </a>
              </div>
            </div>

            <div style="margin-top: 30px; text-align: center;">
              <p style="color: #9CA3AF; font-size: 12px; margin-bottom: 10px;">
                Você está recebendo este email porque solicitou uma review para este imóvel.
              </p>
              <div style="margin-top: 15px;">
                <a href="${process.env.NEXT_PUBLIC_BASE_URL}" style="color: #3B82F6; text-decoration: none; font-size: 12px;">
                  Segundo Inquilino
                </a>
                <span style="color: #9CA3AF; margin: 0 10px;">|</span>
                <a href="${process.env.NEXT_PUBLIC_BASE_URL}/terms" style="color: #3B82F6; text-decoration: none; font-size: 12px;">
                  Termos de Uso
                </a>
                <span style="color: #9CA3AF; margin: 0 10px;">|</span>
                <a href="${process.env.NEXT_PUBLIC_BASE_URL}/privacy" style="color: #3B82F6; text-decoration: none; font-size: 12px;">
                  Política de Privacidade
                </a>
              </div>
            </div>
          </div>
        </div>
      `
    }

    await sgMail.send(msg)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao enviar email:', error)
    return NextResponse.json({ error: 'Erro ao enviar email' }, { status: 500 })
  }
} 