/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    domains: ['cdn.dummyjson.com', 'roomcode.my.id', 'https://api.upos-conn.com/master/v1/'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.dummyjson.com/', // Memperbolehkan semua subdomain dari example.com
      }
    ],
  },
};

export default nextConfig;
