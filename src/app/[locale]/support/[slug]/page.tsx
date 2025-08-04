import { getPageBySlug } from '@/lib/sanity.queries';
import { notFound } from 'next/navigation';
import { localize } from '@/lib/utils';
import RichTextBlock from '@/components/RichTextBlock';
import { ReceiptText } from 'lucide-react';

type Props = {
  params: Promise<{ locale: string; slug: string }>;
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