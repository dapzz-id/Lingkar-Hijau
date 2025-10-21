/** @type {import('next').NextConfig} */
const nextConfig = {
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