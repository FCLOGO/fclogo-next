import { getLogoBySlug } from '@/lib/sanity.queries';
import { getCountAction } from '@/app/actions/getCountsAction'; 
import { notFound } from 'next/navigation';
import LogoGallery from '@/components/LogoGallery';
import LogoSidebar from '@/components/LogoSidebar';
import LogoTimeline from '@/components/LogoTimeline';

type Props = {
  params: Promise<{ 
    slug: string[]; 
    locale: string;
  }>;
}

export const revalidate = 3600 * 24; // 页面每天重新生成一次

export default async function LogoDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  const fullSlug = `/${slug.join('/')}`;
  // const logo = await getLogoBySlug(fullSlug);
  const [logo, initialDownloadCount] = await Promise.all([
    getLogoBySlug(fullSlug),
    getCountAction(fullSlug) // ★★★ 使用 Action 获取初始计数
  ]);

  if (!logo) {
    notFound(); // 如果找不到徽标，显示 404 页面
  }

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