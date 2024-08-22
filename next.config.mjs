/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/kaiawallet/:path*",
        destination: `https://api.kaiawallet.io/:path*`,
      },
    ];
  },
};

export default nextConfig;
