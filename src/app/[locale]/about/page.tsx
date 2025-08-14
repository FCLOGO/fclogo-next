import { getPageBySlug } from '@/lib/sanity.queries';
import { notFound } from 'next/navigation';
import { localize } from '@/lib/utils';
import { getTranslations } from "next-intl/server";
import PageHero from "@/components/PageHero";
import RichTextBlock from '@/components/RichTextBlock';
import TimelineBlock from '@/components/TimelineBlock';
import { Sparkles, PartyPopper } from 'lucide-react';
import type { Metadata } from 'next';
import { siteConfig } from '@/config/site'; 

export const revalidate = false; 

type Props = {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();

  return {
    title: `${t('AboutPage.pageTitle')} | ${t('HomePage.pageTitle')}`,
    description: t('HomePage.pageDescription'),
    openGraph: {
      title: `${t('AboutPage.pageTitle')} | ${t('HomePage.pageTitle')}`,
      description: t('HomePage.pageDescription'),
      images: [
        {
          url: `${siteConfig.baseUrl}/logo-share.png`,
          width: 1200, // 推荐的 OG 图片宽度
          height: 630, // 推荐的 OG 图片高度
          alt: 'FCLOGO Website Share Image',
        },
      ],
    },
    alternates: {
      canonical: `${siteConfig.baseUrl}/about/`,
      languages: {
        'en-US': `${siteConfig.baseUrl}/about/`,
        'zh-CN': `${siteConfig.baseUrl}/zh-cn/about/`,
        'x-default': `${siteConfig.baseUrl}/about/`,
      },
    },
  };
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations('AboutPage');
  const page = await getPageBySlug('about');

  if (!page) { notFound(); }

  const richTextContent = locale === 'zh-cn' ? page.zhContent : page.enContent;

  return (
    <>
      <PageHero pageSlogan={t('aboutSlogan')} subTitle={t('aboutText')} />
      <main className="container mx-auto max-w-6xl px-6 py-10 flex-grow flex flex-col">
        <h1 className="text-2xl font-bold mb-6 uppercase flex items-center gap-4">
          <Sparkles className='text-gray-300'/>
          {localize(page.title, locale)}
        </h1>
        {richTextContent && richTextContent.length > 0 && (
          <RichTextBlock content={richTextContent} />
        )}
        {page.timeline && page.timeline.events && (
        <div className="mt-12">
          <h1 className="text-2xl font-bold mb-6 uppercase flex items-center gap-4">
            <PartyPopper className='text-gray-300'/>
            {t('milestone')}
          </h1>
          <TimelineBlock events={page.timeline.events} locale={locale} />
        </div>
      )}
      </main>
    </>
  )
}