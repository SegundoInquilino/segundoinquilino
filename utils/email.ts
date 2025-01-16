import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendEmail(to: string, subject: string, html: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Segundo Inquilino <contato@segundoinquilino.com.br>',
      to,
      subject,
      html,
      // Configurações adicionais para melhorar entregabilidade
      reply_to: 'contato@segundoinquilino.com.br',
      text: html.replace(/<[^>]*>/g, ''), // versão texto do email
    })

    if (error) {
      console.error('Erro ao enviar email:', error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Erro no serviço de email:', error)
    return { success: false, error }
  }
} 