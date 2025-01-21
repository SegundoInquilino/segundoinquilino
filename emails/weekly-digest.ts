export const weeklyDigestTemplate = (data: {
  userName: string
  newReviewsCount: number
  topReviews: Array<{title: string, rating: number}>
}) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Resumo Semanal - Segundo Inquilino</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #F9FAFB;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <!-- Cabeçalho -->
    <div style="text-align: center; margin-bottom: 30px;">
      <h2 style="color: #8B5CF6; font-size: 28px; font-weight: 700; margin: 0; letter-spacing: -0.5px;">
        Segundo<span style="color: #1F2937;">Inquilino</span>
      </h2>
    </div>

    <!-- Conteúdo Principal -->
    <div style="background-color: white; border-radius: 8px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
      <h1 style="color: #1F2937; margin-bottom: 20px; font-size: 24px; text-align: center;">
        Resumo Semanal 📊
      </h1>

      <!-- Saudação -->
      <div style="background-color: #F3F4F6; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <p style="color: #4B5563; font-size: 16px; line-height: 24px; margin: 0;">
          Olá, <strong>${data.userName}</strong>!
        </p>
        <p style="color: #4B5563; font-size: 16px; line-height: 24px;">
          Confira as novidades desta semana no Segundo Inquilino.
        </p>
      </div>

      <!-- Estatísticas -->
      <div style="text-align: center; margin: 30px 0;">
        <div style="background-color: #F5F3FF; padding: 20px; border-radius: 8px;">
          <h3 style="color: #6D28D9; margin: 0; font-size: 36px;">${data.newReviewsCount}</h3>
          <p style="color: #7C3AED; margin: 5px 0 0;">Novas Reviews</p>
        </div>
      </div>

      <!-- Top Reviews -->
      ${data.topReviews.length > 0 ? `
        <div style="margin-top: 30px;">
          <h2 style="color: #4B5563; font-size: 18px; margin-bottom: 15px;">Reviews em Destaque:</h2>
          ${data.topReviews.map(review => `
            <div style="border-left: 4px solid #8B5CF6; padding: 15px; background-color: #F5F3FF; margin: 10px 0; border-radius: 0 8px 8px 0;">
              <p style="color: #6B7280; margin: 0;">
                ${review.title} - ${'⭐'.repeat(review.rating)}
              </p>
            </div>
          `).join('')}
        </div>
      ` : ''}

      <!-- Botão de Ação -->
      <div style="text-align: center; margin: 30px 0;">
        <a href="https://segundoinquilino.com.br/reviews" 
           style="background-color: #8B5CF6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
          Ver Todas as Reviews
        </a>
      </div>
    </div>

    <!-- Rodapé -->
    <div style="margin-top: 30px; text-align: center;">
      <p style="color: #9CA3AF; font-size: 12px; margin-bottom: 10px;">
        Você está recebendo este email porque está cadastrado no Segundo Inquilino.
      </p>
      <div style="margin-top: 15px;">
        <a href="https://segundoinquilino.com.br" style="color: #8B5CF6; text-decoration: none; font-size: 12px;">
          Segundo Inquilino
        </a>
        <span style="color: #9CA3AF; margin: 0 10px;">|</span>
        <a href="https://segundoinquilino.com.br/termos" style="color: #8B5CF6; text-decoration: none; font-size: 12px;">
          Termos
        </a>
        <span style="color: #9CA3AF; margin: 0 10px;">|</span>
        <a href="https://segundoinquilino.com.br/sobre" style="color: #8B5CF6; text-decoration: none; font-size: 12px;">
          Sobre
        </a>
      </div>
    </div>
  </div>
</body>
</html>
` 