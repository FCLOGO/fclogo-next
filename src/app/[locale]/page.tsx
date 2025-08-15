import Hero from '@/components/Hero';
import LatestLogos from '@/components/LatestLogos'
import LatestPacks from '@/components/LatestPacks';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { siteConfig } from '@/config/site'; 

export const runtime = 'edge';
export const revalidate = 86400

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('HomePage');

  return {
    title: `${t('pageTitle')} - FCLOGO`,
    description: t('pageDescription'),
    openGraph: {
      title: `${t('pageTitle')} - FCLOGO`,
      description: t('pageDescription'),
      images: [
        {
          url: `${siteConfig.baseUrl}/logo-share.png`,
          width: 1200, // 推荐的 OG 图片宽度
          height: 630, // 推荐的 OG 图片高度
          alt: 'FCLOGO Website Share Image',
        },
      ],
    },
  };
}

export default async function HomePage() {
  return (
    <>
      <Hero />
      <main className="container mx-auto px-6 py-10 flex-grow flex flex-col">
        <LatestLogos />
        <LatestPacks />
      </main>
    </>
  )
}