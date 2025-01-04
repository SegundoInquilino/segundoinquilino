/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['ejoivntarqlinulkiure.supabase.co'],
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
  }
}

module.exports = nextConfig 