import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  productionBrowserSourceMaps: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        port: '',
        pathname: '/images/**', // 允许优化来自 Sanity CDN 的所有图片
      },
      {
        protocol: 'https',
        hostname: process.env.NEXT_PUBLIC_CLOUDFLARE_R2_HOSTNAME!, 
        port: '',
        pathname: '/**', // 允许优化来自 R2 的所有图片
      },
    ],
  },
};

// export default nextConfig;
const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);