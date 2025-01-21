/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
  },
  transpilePackages: [
    '@radix-ui/react-alert-dialog',
    '@radix-ui/react-dialog',
    '@radix-ui/react-primitive',
    '@heroicons/react'
  ],
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@radix-ui/react-alert-dialog': require.resolve('@radix-ui/react-alert-dialog')
    }
    return config
  }
}

module.exports = nextConfig 