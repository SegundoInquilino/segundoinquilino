import sgMail from '@sendgrid/mail'
import { commentNotificationTemplate } from '@/emails/comment-notification'
import { weeklyDigestTemplate } from '@/emails/weekly-digest'

// Verificar se a API key está definida
if (!process.env.SENDGRID_API_KEY) {
  console.error('SENDGRID_API_KEY não está configurada')
}

sgMail.setApiKey(process.env.SENDGRID_API_KEY!)

const FROM_EMAIL = 'contato@segundoinquilino.com.br'

export const sendCommentNotification = async ({
  to,
  reviewAuthor,
  commenterName,
  reviewTitle,
  commentText
}: {
  to: string
  reviewAuthor: string
  commenterName: string
  reviewTitle: string
  commentText: string
}) => {
  const msg = {
    to,
    from: {
      email: FROM_EMAIL,
      name: 'Segundo Inquilino'
    },
    subject: `${commenterName} comentou na sua review`,
    html: commentNotificationTemplate({
      reviewAuthor,
      commenterName,
      reviewTitle,
      commentText
    })
  }

  try {
    await sgMail.send(msg)
  } catch (error) {
    console.error('Erro ao enviar email:', error)
  }
}

export const sendWeeklyDigest = async ({
  to,
  userName,
  newReviewsCount,
  topReviews
}: {
  to: string
  userName: string
  newReviewsCount: number
  topReviews: Array<{title: string, rating: number}>
}) => {
  const msg = {
    to,
    from: {
      email: FROM_EMAIL,
      name: 'Segundo Inquilino'
    },
    subject: 'Veja as novidades desta semana no Segundo Inquilino!',
    html: weeklyDigestTemplate({
      userName,
      newReviewsCount,
      topReviews
    })
  }

  try {
    await sgMail.send(msg)
  } catch (error) {
    console.error('Erro ao enviar email:', error)
  }
} 