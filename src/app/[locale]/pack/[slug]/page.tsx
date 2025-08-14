import { getPackBySlug } from '@/lib/sanity.queries';
import { notFound } from 'next/navigation';
import { localize } from '@/lib/utils';
import { getTranslations } from 'next-intl/server';
import type { Metadata, ResolvingMetadata } from 'next';
import PackGallery from '@/components/PackGallery';
import PackSidebar from '@/components/PackSidebar';
import { siteConfig } from '@/config/site'; 

export const revalidate = 604800; // 页面每周重新生成一次

type Props = {
  params: Promise<{ 
    slug: string; 
    locale: string;
  }>;
}

export async function generateMetadata({ params }: Omit<Props, 'children'>, parent: ResolvingMetadata): Promise<Metadata> {
  const t = await getTranslations('DetailPage');
  const { locale, slug } = await params;
  const pack = await getPackBySlug(slug);

  if (!pack) { return { title: 'Pack Not Found' }; }

  const parentMetadata = await parent;
  // const previousImages = (await parent).openGraph?.images || [];
  const previousKeywords = parentMetadata.keywords || [];
  const imageUrl = `${siteConfig.assetsUrl}/${pack.sourceLogo.pngUrl}`;
  const packTitle = localize(pack.title, locale);

  return {
    title: t('packTitle', { season: pack.season, name: packTitle,}),
    description: t('packDescription', { season: pack.season, name: packTitle,}),
    keywords: [...previousKeywords, packTitle],
    openGraph: {
      title: t('packTitle', { season: pack.season, name: packTitle,}),
      description: t('packDescription', { season: pack.season, name: packTitle,}),
      images: imageUrl,
    },
    alternates: {
      canonical: `${siteConfig.baseUrl}/pack/${slug}`,
      languages: {
        'en-US': `${siteConfig.baseUrl}/pack/${slug}`,
        'zh-CN': `${siteConfig.baseUrl}/zh-cn/pack/${slug}`,
        'x-default': `${siteConfig.baseUrl}/pack/${slug}`
      },
    },
  };
}

export default async function PackDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  const pack = await getPackBySlug(slug);

  if (!pack) {
    notFound(); // 如果找不到徽标，显示 404 页面
  }

  return (
    <main className="w-full h-auto mx-auto flex-grow flex flex-col">
      <div className='flex h-full flex-col lg:flex-row flex-nowrap items-center justify-between'>
        <PackGallery items={pack.items} />
        <PackSidebar pack={pack} locale={locale} />
      </div>
    </main>
  );
}