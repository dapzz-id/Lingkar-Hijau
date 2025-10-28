/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },

  transpilePackages: [
    '@tensorflow/tfjs',
    '@tensorflow-models/coco-ssd',
  ],
}

module.exports = nextConfig