import { getLocale, getTranslations } from 'next-intl/server';
import { getLogosAction } from '@/app/actions/getLogosAction';
import { type LogoListFilter } from '@/app/actions/getLogosAction.constants';
import LogoGrid from '@/components/LogoGrid';
import type { Metadata } from 'next';
import { siteConfig } from '@/config/site'; 
import LogoCategorySidebar from '@/components/LogoCategorySidebar';
import { subjectTypeKeys, type SubjectTypeKey } from '@/config/logoCategories';
import { getLogoCategorySidebarData } from '@/lib/logoCategory.queries';

export const runtime = "edge";
export const revalidate = 604800; //页面每周生成一次

type PageProps = {
  searchParams: Promise<{
    nation?: string;
    type?: string;
  }>;
};

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


export default async function AllLogosPage({ searchParams }: PageProps) {
  const t = await getTranslations('LogosPage');
  const locale = await getLocale();
  const { nation, type } = await searchParams;
  const selectedNationCode = nation?.trim() || undefined;
  const selectedSubjectType = subjectTypeKeys.includes(type as SubjectTypeKey)
    ? (type as SubjectTypeKey)
    : undefined;
  const filter: LogoListFilter = {
    nationCode: selectedNationCode,
    subjectType: selectedSubjectType,
  };

  const [initialLogos, sidebarData] = await Promise.all([
    getLogosAction(0, filter),
    getLogoCategorySidebarData(filter),
  ]);

  return (
    <main className="container mx-auto px-6 py-10 flex-grow w-full">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[23rem_minmax(0,1fr)]">
        <LogoCategorySidebar
          locale={locale}
          selectedNationCode={selectedNationCode}
          selectedSubjectType={selectedSubjectType}
          sidebarData={sidebarData}
        />

        <section className="relative z-0 min-w-0">
          {initialLogos.length > 0 ? (
            <LogoGrid
              key={`${selectedNationCode ?? 'all'}-${selectedSubjectType ?? 'all'}`}
              initialLogos={initialLogos}
              locale={locale}
              filter={filter}
            />
          ) : (
            <p className="text-center text-base-content/60">{t('noData')}</p>
          )}
        </section>
      </div>
    </main>
  );
}
