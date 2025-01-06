/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['ejoivntarqlinulkiure.supabase.co', 'www.segundoinquilino.com.br'],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: `
              default-src 'self';
              connect-src 'self' https://*.supabase.co wss://*.supabase.co;
              img-src 'self' data: blob: https://*.supabase.co;
              script-src 'self' 'unsafe-inline' 'unsafe-eval';
              style-src 'self' 'unsafe-inline';
              frame-ancestors 'none';
            `.replace(/\s{2,}/g, ' ').trim()
          }
        ]
      }
    ]
  },
  webpack: (config) => {
    config.externals.push({
      'utf-8-validate': 'commonjs utf-8-validate',
      'bufferutil': 'commonjs bufferutil',
    })
    return config
  },
}

module.exports = nextConfig 