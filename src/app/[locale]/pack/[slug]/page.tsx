import { getPackBySlug } from '@/lib/sanity.queries';
import { notFound } from 'next/navigation';
import PackGallery from '@/components/PackGallery';
import PackSidebar from '@/components/PackSidebar';

type Props = {
  params: Promise<{ 
    slug: string; 
    locale: string;
  }>;
}

export const revalidate = 3600 * 24; // 页面每天重新生成一次

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