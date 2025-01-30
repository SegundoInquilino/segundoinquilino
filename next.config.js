/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
  },
  transpilePackages: [
    '@radix-ui/react-alert-dialog',
    '@radix-ui/react-dialog',
    '@radix-ui/react-primitive',
    '@heroicons/react',
    '@sendgrid/mail',
    'react-slick'
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
  images: {
    domains: [
      'ejoivntarqlinulkiure.supabase.co', // Domínio do Supabase Storage
      'lh3.googleusercontent.com', // Para avatares do Google
      'avatars.githubusercontent.com' // Para avatares do GitHub
    ]
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
  webpack: (config) => {
    config.module.rules.push({
      test: /\.css$/,
      use: ['style-loader', 'css-loader'],
    })
    return config
  },
}

module.exports = nextConfig 