import { getLogoBySlug } from '@/lib/sanity.queries';
// import { getCountAction } from '@/app/actions/getCountsAction'; 
import { getSupabaseCountAction } from '@/app/actions/supabaseActions';
import { notFound } from 'next/navigation';
import { localize } from '@/lib/utils';
import type { Metadata, ResolvingMetadata } from 'next';
import { getTranslations } from 'next-intl/server';
import LogoGallery from '@/components/LogoGallery';
import LogoSidebar from '@/components/LogoSidebar';
import LogoTimeline from '@/components/LogoTimeline';
import { siteConfig } from '@/config/site'; 

export const runtime = "edge";
export const revalidate = 604800; // 页面每周重新生成一次

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
  // const previousImages = parentMetadata.openGraph?.images || [];
  const imageUrl = `${siteConfig.assetsUrl}/${logo.pngUrl}`;

  const previousKeywords = parentMetadata.keywords || [];
  
  return {
    title: `${subjectName}${t('titleVector')}`,
    description: t('pageDescription', { name: subjectName}),
    keywords: [...previousKeywords, subjectName],
    openGraph: {
      title: `${subjectName}${t('titleVector')} - FCLOGO`,
      description: t('pageDescription', { name: subjectName}),
      images: imageUrl,
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

export default async function LogoDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  const fullSlug = `/${slug.join('/')}`;
  const logo = await getLogoBySlug(fullSlug);

  if (!logo) {
    notFound(); // 如果找不到徽标，显示 404 页面
  }

  const initialDownloadCount = await getSupabaseCountAction(logo._id);

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