import { getPageBySlug } from '@/lib/sanity.queries';
import { notFound } from 'next/navigation';
import { localize } from '@/lib/utils';
import { getTranslations } from "next-intl/server";
import PageHero from "@/components/PageHero";
import RichTextBlock from '@/components/RichTextBlock';
import TimelineBlock from '@/components/TimelineBlock';
import { Sparkles, PartyPopper } from 'lucide-react';

type Props = {
  params: Promise<{ locale: string }>;
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