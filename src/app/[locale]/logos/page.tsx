import { getLocale, getTranslations } from 'next-intl/server';
import { getLogosAction } from '@/app/actions/getLogosAction';
import LogoGrid from '@/components/LogoGrid';
import type { Metadata } from 'next';
import { siteConfig } from '@/config/site'; 

export const runtime = "edge";
export const revalidate = 604800; //页面每周生成一次

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();

  return {
    title: `${t('LogosPage.pageTitle')} | ${t('HomePage.pageTitle')}`,
    description: t('HomePage.pageDescription'),
    openGraph: {
      title: `${t('LogosPage.pageTitle')} | ${t('HomePage.pageTitle')}`,
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
      canonical: `${siteConfig.baseUrl}/logos`,
      languages: {
        'en-US': `${siteConfig.baseUrl}/logos/`,
        'zh-CN': `${siteConfig.baseUrl}/zh-cn/logos/`,
        'x-default': `${siteConfig.baseUrl}/logos/`,
      },
    },
  };
}


export default async function AllLogosPage() {
  const t = await getTranslations('LogosPage');
  const locale = await getLocale();

  // 只获取第一页 (page 0) 的数据作为初始数据
  const initialLogos = await getLogosAction(0);

  return (
    <main className="container mx-auto px-6 py-10 flex-grow flex flex-col">
      {initialLogos.length > 0 ? (
        <LogoGrid initialLogos={initialLogos} locale={locale} />
      ) : (
        <p className="text-center text-base-content/60">{t('noData')}</p>
      )}
    </main>
  );
}