'use client'

import { useEffect } from 'react'

interface ReCaptchaProps {
  onVerify: (token: string | null) => void
}

export default function ReCaptcha({ onVerify }: ReCaptchaProps) {
  useEffect(() => {
    // Quando o script carregar
    const handleLoad = () => {
      if (window.grecaptcha) {
        window.grecaptcha.enterprise.ready(() => {
          window.grecaptcha.enterprise.execute(
            process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!,
            { action: 'SIGNUP' }
          ).then(onVerify)
        })
      }
    }

    // Se já carregou
    if (window.grecaptcha) {
      handleLoad()
    } else {
      // Se ainda não carregou, espera carregar
      window.addEventListener('grecaptchaLoaded', handleLoad)
    }

    return () => {
      window.removeEventListener('grecaptchaLoaded', handleLoad)
    }
  }, [onVerify])

  return (
    <div 
      className="g-recaptcha" 
      data-sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
      data-action="SIGNUP"
    />
  )
} 