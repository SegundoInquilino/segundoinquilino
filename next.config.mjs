/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    '@radix-ui/react-alert-dialog',
    '@radix-ui/react-dialog',
    '@radix-ui/react-primitive',
    '@heroicons/react',
    '@sendgrid/mail',
    'react-slick'
  ],
  images: {
    domains: [
      'ejoivntarqlinulkiure.supabase.co',
      'lh3.googleusercontent.com',
      'avatars.githubusercontent.com'
    ]
  }
}

export default nextConfig 