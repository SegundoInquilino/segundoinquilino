/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['seu-dominio.com'],
  },
  poweredByHeader: false,
  compress: true,
  i18n: {
    locales: ['pt-BR'],
    defaultLocale: 'pt-BR',
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          }
        ],
      },
    ]
  }
}

module.exports = nextConfig 