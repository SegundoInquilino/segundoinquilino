/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
  },
  transpilePackages: ['@headlessui/react', '@heroicons/react'],
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@headlessui/react': require.resolve('@headlessui/react')
    }
    return config
  }
}

module.exports = nextConfig 