import { NextResponse } from 'next/server'

const RISK_FACTORS = {
  minScore: 0.7,
  suspiciousHeaders: ['headless', 'selenium', 'phantom', 'puppet'],
  maxRequestsPerIP: 5
}

export async function POST(request: Request) {
  try {
    const { token, minScore = RISK_FACTORS.minScore } = await request.json()
    
    // Verificar headers suspeitos
    const userAgent = request.headers.get('user-agent') || ''
    if (RISK_FACTORS.suspiciousHeaders.some(h => userAgent.toLowerCase().includes(h))) {
      return NextResponse.json({ success: false, error: 'Acesso não permitido' })
    }

    const response = await fetch(
      `https://recaptchaenterprise.googleapis.com/v1/projects/segundoinquilino/assessments?key=${process.env.RECAPTCHA_SECRET_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: {
            token,
            expectedAction: 'SIGNUP',
            siteKey: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
          }
        })
      }
    )

    const result = await response.json()
    
    // Análise mais detalhada do risco
    const isValid = result.riskAnalysis?.score > minScore && 
                   !result.riskAnalysis?.reasons?.includes('AUTOMATION')

    return NextResponse.json({ 
      success: isValid,
      score: result.riskAnalysis?.score
    })
  } catch (error) {
    console.error('Erro ao verificar captcha:', error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
} 