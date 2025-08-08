import { getLogoBySlug } from '@/lib/sanity.queries';
import { getCountAction } from '@/app/actions/getCountsAction'; 
import { notFound } from 'next/navigation';
import { localize } from '@/lib/utils';
import type { Metadata, ResolvingMetadata } from 'next';
import { getTranslations } from 'next-intl/server';
import LogoGallery from '@/components/LogoGallery';
import LogoSidebar from '@/components/LogoSidebar';
import LogoTimeline from '@/components/LogoTimeline';
import { siteConfig } from '@/config/site'; 

type Props = {
  params: Promise<{ 
    slug: string[]; 
    locale: string;
  }>;
}

export async function generateMetadata({ params }: Omit<Props, 'children'>, parent: ResolvingMetadata): Promise<Metadata> {
  const t = await getTranslations('DetailPage');
  const { locale, slug } = await params;
  const fullSlug = `/${slug.join('/')}`;
  const logo = await getLogoBySlug(fullSlug);

  if (!logo) {
    return { title: 'Logo Not Found' };
  }

  const subjectName = localize(logo.subject.name, locale);

  // 获取父级布局的 OpenGraph 图片
  const parentMetadata = await parent;
  const parentKeywords = parentMetadata.keywords || [];
  const previousImages = parentMetadata.openGraph?.images || [];

  const currentPageKeywords = [
    subjectName, 
    localize(logo.subject.info.shortName, locale),
    logo.subject.info.localName,
    ...(logo.alternateNames || []) // 将曾用名也加入关键词
  ].filter(Boolean); // 过滤掉空值
  
  const combinedKeywords = [
    // 使用 Set 来自动处理重复的关键词
    ...new Set([...parentKeywords, ...currentPageKeywords])
  ];
  return {
    title: `${subjectName}${t('titleVector')}`,
    description: t('pageDescription', { name: subjectName}),
    // keywords: combinedKeywords,
    openGraph: {
      title: `${subjectName}${t('titleVector')} - FCLOGO`,
      description: t('pageDescription', { name: subjectName}),
      images: [logo.pngUrl, ...previousImages],
    },
    alternates: {
      canonical: `${siteConfig.baseUrl}${fullSlug}`,
      languages: {
        'en-US': `${siteConfig.baseUrl}${fullSlug}`,
        'zh-CN': `${siteConfig.baseUrl}/zh-cn${fullSlug}`,
        'x-default': `${siteConfig.baseUrl}${fullSlug}`,
      },
    },
  };
}

export const revalidate = 86400; // 页面每天重新生成一次

export default async function LogoDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  const fullSlug = `/${slug.join('/')}`;
  const logo = await getLogoBySlug(fullSlug);

  if (!logo) {
    notFound(); // 如果找不到徽标，显示 404 页面
  }

  const initialDownloadCount = await getCountAction(logo._id);

  return (
    <main className="w-full h-auto mx-auto flex-grow flex flex-col">
      <div className='flex h-full flex-col lg:flex-row flex-nowrap items-center justify-between'>
        <LogoGallery logo={logo} locale={locale} />
        <LogoSidebar logo={logo} locale={locale} initialDownloadCount={initialDownloadCount} />
      </div>
      {logo.logoHistory.length > 1 && (
        <LogoTimeline history={logo.logoHistory} currentLogoVersion={logo.version} locale={locale} />
      )}
    </main>
  );
}