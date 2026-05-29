import { getPackBySlug, getRelatedPacksBySubjectRef } from '@/lib/sanity.queries';
import { notFound } from 'next/navigation';
import { localize } from '@/lib/utils';
import { getTranslations } from 'next-intl/server';
import type { Metadata, ResolvingMetadata } from 'next';
import PackGallery from '@/components/PackGallery';
import PackSidebar from '@/components/PackSidebar';
import PackTimeline from '@/components/PackTimeline';
import { siteConfig } from '@/config/site'; 

function normalizeSeasonYear(value: string) {
  const raw = value.trim();
  const fourDigitMatch = raw.match(/^(\d{4})/);
  if (fourDigitMatch) {
    return fourDigitMatch[1];
  }

  const twoDigitMatch = raw.match(/^(\d{2})/);
  if (twoDigitMatch) {
    return `20${twoDigitMatch[1]}`;
  }

  return raw;
}

export const runtime = "edge";
export const revalidate = 2592000; // 缓存时间 30 天

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

  const relatedPacks = await getRelatedPacksBySubjectRef(pack.sourceSubjectRef, pack._id);
  const sortedRelatedPacks = [...relatedPacks].sort((a, b) => {
    const aSeason = normalizeSeasonYear(a.season);
    const bSeason = normalizeSeasonYear(b.season);
    const yearDiff = Number(bSeason) - Number(aSeason);

    if (Number.isFinite(yearDiff) && yearDiff !== 0) {
      return yearDiff;
    }

    return bSeason.localeCompare(aSeason);
  });

  return (
    <main className="w-full h-auto mx-auto flex-grow flex flex-col">
      <div className='flex h-full flex-col lg:flex-row flex-nowrap items-center justify-between'>
        <PackGallery items={pack.items} />
        <PackSidebar pack={pack} locale={locale} />
      </div>
      {sortedRelatedPacks.length > 0 && (
        <PackTimeline packs={sortedRelatedPacks} locale={locale} />
      )}
    </main>
  );
}
