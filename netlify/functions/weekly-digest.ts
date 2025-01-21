import { Handler } from '@netlify/functions'
import { createClient } from '@supabase/supabase-js'
import { weeklyDigestTemplate } from '../../emails/weekly-digest'
import sgMail from '@sendgrid/mail'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

sgMail.setApiKey(process.env.SENDGRID_API_KEY!)

export const handler: Handler = async (event) => {
  // Roda toda segunda-feira às 10h
  if (event.headers['x-trigger'] !== 'SCHEDULED') {
    return { statusCode: 400 }
  }

  try {
    // Busca usuários ativos
    const { data: users } = await supabase
      .from('profiles')
      .select('*')
      .eq('email_notifications', true)

    // Busca reviews da última semana
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

    const { data: newReviews } = await supabase
      .from('reviews')
      .select('*, apartments(*)')
      .gte('created_at', oneWeekAgo.toISOString())
      .order('rating', { ascending: false })

    // Envia email para cada usuário
    for (const user of users) {
      const msg = {
        to: user.email,
        from: {
          email: 'contato@segundoinquilino.com.br',
          name: 'Segundo Inquilino'
        },
        subject: 'Resumo Semanal - Segundo Inquilino',
        html: weeklyDigestTemplate({
          userName: user.full_name || 'Usuário',
          newReviewsCount: newReviews.length,
          topReviews: newReviews.slice(0, 3).map(review => ({
            title: review.apartments.building_name,
            rating: review.rating
          }))
        })
      }

      try {
        await sgMail.send(msg)
        console.log(`Email enviado com sucesso para ${user.email}`)
      } catch (error) {
        console.error(`Erro ao enviar email para ${user.email}:`, error)
      }
    }

    return { statusCode: 200 }
  } catch (error) {
    console.error('Erro ao enviar digest:', error)
    return { statusCode: 500 }
  }
} 