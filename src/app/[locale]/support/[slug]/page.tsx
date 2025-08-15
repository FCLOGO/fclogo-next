import { getPageBySlug } from '@/lib/sanity.queries';
import { notFound } from 'next/navigation';
import { localize } from '@/lib/utils';
import RichTextBlock from '@/components/RichTextBlock';
import { ReceiptText } from 'lucide-react';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { siteConfig } from '@/config/site';

export const runtime = "edge";
export const revalidate = 604800; 

type Props = {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const t = await getTranslations();
  const page = await getPageBySlug(slug);
  if (!page) { notFound(); }

  const pageTitle = localize(page.title, locale)

  return {
    title: `${pageTitle} | ${t('HomePage.pageTitle')}`,
    description: t('HomePage.pageDescription'),
    openGraph: {
      title: `${pageTitle} | ${t('HomePage.pageTitle')}`,
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
      canonical: `${siteConfig.baseUrl}/support/${slug}`,
      languages: {
        'en-US': `${siteConfig.baseUrl}/support/${slug}`,
        'zh-CN': `${siteConfig.baseUrl}/zh-cn/support/${slug}`,
        'x-default': `${siteConfig.baseUrl}/support/${slug}`
      },
    },
  };
}

export default async function SupportPage({ params }: Props) {
  const { locale, slug } = await params;
  const page = await getPageBySlug(slug);

  if (!page) { notFound(); }

  const richTextContent = locale === 'zh-cn' ? page.zhContent : page.enContent;

  if (!richTextContent || richTextContent.length === 0) {
    // 如果这个页面没有任何对应语言的内容，也可以选择显示 404
    notFound();
  }

  return (
    <main className="container mx-auto max-w-6xl px-6 py-10 flex-grow flex flex-col">
      <h1 className="text-2xl font-bold mb-8 uppercase flex items-center gap-4">
        <ReceiptText className='text-gray-300'/>
        {localize(page.title, locale)}
      </h1>
      {richTextContent && richTextContent.length > 0 && (
        <RichTextBlock content={richTextContent} />
      )}
    </main>
  )
}