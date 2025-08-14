import { getLocale, getTranslations } from 'next-intl/server';
import { getPacksAction } from '@/app/actions/getPacksAction';
import PackGrid from '@/components/PackGrid';
import type { Metadata } from 'next';
import { siteConfig } from '@/config/site'; 

export const revalidate = 86400

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();

  return {
    title: `${t('LogosPage.packTitle')} | ${t('HomePage.pageTitle')}`,
    description: t('HomePage.pageDescription'),
    openGraph: {
      title: `${t('LogosPage.packTitle')} | ${t('HomePage.pageTitle')}`,
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
      canonical: `${siteConfig.baseUrl}/packs`,
      languages: {
        'en-US': `${siteConfig.baseUrl}/packs/`,
        'zh-CN': `${siteConfig.baseUrl}/zh-cn/packs/`,
        'x-default': `${siteConfig.baseUrl}/packs/`,
      },
    },
  };
}

export default async function AllLogosPage() {
  const t = await getTranslations('LogosPage');
  const locale = await getLocale();

  // 只获取第一页 (page 0) 的数据作为初始数据
  const initialPacks = await getPacksAction(0);

  return (
    <main className="container mx-auto px-6 py-10 flex-grow flex flex-col">
      {initialPacks.length > 0 ? (
        <PackGrid initialPacks={initialPacks} locale={locale} />
      ) : (
        <p className="text-center text-base-content/60">{t('noData')}</p>
      )}
    </main>
  );
}