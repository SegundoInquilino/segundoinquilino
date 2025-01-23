/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
  },
  transpilePackages: [
    '@radix-ui/react-alert-dialog',
    '@radix-ui/react-dialog',
    '@radix-ui/react-primitive',
    '@heroicons/react',
    '@sendgrid/mail'
  ],
  env: {
    SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL
  },
  typescript: {
    // Ignora erros de TS durante o build em produção
    ignoreBuildErrors: true
  },
  eslint: {
    // Ignora erros de ESLint durante o build em produção
    ignoreDuringBuilds: true
  },
  async redirects() {
    return [
      // Remova ou comente o redirecionamento do blog
      // {
      //   source: '/blog',
      //   destination: '/blog',
      //   permanent: true,
      // },
    ]
  },
  pwa: {
    dest: 'public',
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV === 'development'
  }
}

const withPWA = require('next-pwa')({
  dest: 'public'
})

module.exports = withPWA(nextConfig) 