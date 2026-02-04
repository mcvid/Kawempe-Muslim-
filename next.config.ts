import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'qijflrtpcxolyxxsczrv.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: "https",
        hostname: "api.dicebear.com",
        port: '',
        pathname: '/**',
      },
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
        port: '',
        pathname: '/**',
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: '',
        pathname: '/**',
      },
      {
        protocol: "https",
        hostname: "as2.ftcdn.net",
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
