import type { Metadata } from 'next';
import { getLocale, getTranslations } from 'next-intl/server';
import { getPacksAction } from '@/app/actions/getPacksAction';
import { type PackListFilter } from '@/app/actions/getPacksAction.constants';
import { getPackSidebarData, normalizePackSeasonKey } from '@/lib/packCategory.queries';
import PackGrid from '@/components/PackGrid';
import PackCategorySidebar from '@/components/PackCategorySidebar';
import { siteConfig } from '@/config/site';

export const runtime = 'edge';
export const revalidate = 604800;

type PageProps = {
  searchParams: Promise<{
    nation?: string;
    season?: string;
  }>;
};

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('PacksPage');

  return {
    title: `${t('pageTitle')} | FCLOGO`,
    description: t('pageDescription'),
    openGraph: {
      title: `${t('pageTitle')} | FCLOGO`,
      description: t('pageDescription'),
      images: [
        {
          url: `${siteConfig.baseUrl}/logo-share.png`,
          width: 1200,
          height: 630,
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

export default async function AllPacksPage({ searchParams }: PageProps) {
  const t = await getTranslations('PacksPage');
  const locale = await getLocale();
  const { nation, season } = await searchParams;
  const selectedNationCode = nation?.trim() || undefined;
  const selectedSeason = normalizePackSeasonKey(season);
  const filter: PackListFilter = {
    nationCode: selectedNationCode,
    season: selectedSeason,
  };

  const [initialPacks, sidebarData] = await Promise.all([
    getPacksAction(0, filter),
    getPackSidebarData(filter),
  ]);

  return (
    <main className="container mx-auto w-full flex-grow px-6 py-10">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[23rem_minmax(0,1fr)]">
        <PackCategorySidebar
          locale={locale}
          selectedNationCode={selectedNationCode}
          selectedSeason={selectedSeason}
          sidebarData={sidebarData}
        />

        <section className="relative z-0 min-w-0">
          {initialPacks.length > 0 ? (
            <PackGrid
              key={`${selectedNationCode ?? 'all'}-${selectedSeason ?? 'all'}`}
              initialPacks={initialPacks}
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
