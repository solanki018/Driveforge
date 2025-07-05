/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config: any, { isServer }: { isServer: boolean }) => {
    if (isServer) {
      config.externals.push('pdf-parse');
    }

    return config;
  },
  reactStrictMode: true,
  experimental: {
    serverActions: {},
  },
};

module.exports = nextConfig;
