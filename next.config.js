/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pay.pocket-change.jp',
      },
      {
        protocol: 'https',
        hostname: 'pokepay-assets.s3.ap-northeast-1.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 's3.us-west-2.amazonaws.com',
      },
    ],
    experimental: {
      // Defaults to 50MB
      isrMemoryCacheSize: 0,
    },
  },
}

module.exports = nextConfig
