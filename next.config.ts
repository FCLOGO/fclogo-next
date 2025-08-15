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
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // 优化客户端的打包策略
      config.optimization.splitChunks = {
        ...config.optimization.splitChunks,
        // 将大的库强制拆分到单独的文件中
        cacheGroups: {
          ...config.optimization.splitChunks.cacheGroups,
          mapboxgl: {
            test: /[\\/]node_modules[\\/](mapbox-gl|@mapbox)[\\/]/,
            name: 'mapboxgl',
            chunks: 'all',
            priority: 10,
          },
          supabase: {
            test: /[\\/]node_modules[\\/]@supabase[\\/]/,
            name: 'supabase',
            chunks: 'all',
            priority: 10,
          },
        },
      };
    }

    return config;
  },
};

// export default nextConfig;
const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);