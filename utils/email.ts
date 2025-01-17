import sgMail from '@sendgrid/mail'

sgMail.setApiKey(process.env.SENDGRID_API_KEY!)

export async function sendEmail(to: string, subject: string, html: string) {
  try {
    await sgMail.send({
      from: 'Segundo Inquilino <contato@segundoinquilino.com.br>',
      to,
      subject,
      html,
      // Configurações adicionais para melhorar entregabilidade
      replyTo: 'contato@segundoinquilino.com.br',
      text: html.replace(/<[^>]*>/g, ''), // versão texto do email
    })

    return { success: true }
  } catch (error) {
    console.error('Erro no serviço de email:', error)
    return { success: false, error }
  }
} 