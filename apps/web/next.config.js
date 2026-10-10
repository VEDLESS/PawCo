/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@petco/shared'],
  images: {
    domains: ['images.unsplash.com', 'api.dicebear.com'],
  },
};

module.exports = nextConfig;
