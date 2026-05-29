import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { getOptimizedImage } from '@/lib/sanity.image';
import { localize } from '@/lib/utils';
import type { PackSidebarData } from '@/lib/packCategory.queries';
import { FunnelPlus } from 'lucide-react';
import CompIcon from './_icons/Competition';
import PackSeasonDropdown from './PackSeasonDropdown';

type Props = {
  locale: string;
  title?: string;
  description?: string;
  basePath?: string;
  selectedNationCode?: string;
  selectedSeason?: string;
  sidebarData: PackSidebarData;
};

export default async function PackCategorySidebar({
  locale,
  title,
  description,
  basePath = '/packs',
  selectedNationCode,
  selectedSeason,
  sidebarData,
}: Props) {
  const t = await getTranslations('PacksPage');
  const headerTitle = title ?? t('pageTitle');
  const headerDescription = description ?? t('pageDescription');
  const { nations, seasons } = sidebarData;
  const totalPacksCount = seasons.reduce((sum, item) => sum + item.count, 0);

  const toggleNationHref = (nationCode: string) => {
    const params = new URLSearchParams();
    const nextNation = selectedNationCode === nationCode ? null : nationCode;

    if (nextNation) {
      params.set('nation', nextNation);
    }

    if (selectedSeason) {
      params.set('season', selectedSeason);
    }

    const query = params.toString();
    return query ? `${basePath}?${query}` : basePath;
  };

  const selectedSeasonLabel = selectedSeason ?? t('allPacks');
  const selectedSeasonCount = selectedSeason
    ? seasons.find((item) => item.key === selectedSeason)?.count ?? 0
    : totalPacksCount;

  return (
    <aside className="relative w-full rounded-lg shrink-0 lg:w-[23rem] lg:sticky lg:top-24 self-start overflow-visible lg:overflow-hidden">
      <div className="flex max-h-[calc(100vh-8rem)] min-h-0 flex-col overflow-visible rounded-lg bg-base-100 shadow lg:overflow-hidden">
        <div className="relative z-10 flex flex-col justify-center gap-3 border-none border-neutral/20 p-6 lg:border-b lg:border-dashed">
          <CompIcon className="h-12 w-12 flex-none stroke-[24] text-success" />
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold">{headerTitle}</h1>
            <p className="mt-2 max-w-sm text-sm leading-6 text-base-content/70">{headerDescription}</p>
          </div>
          <div className="absolute -bottom-1.5 -left-2 hidden h-3 w-3 rounded-full bg-base-300 lg:block" />
          <div className="absolute -bottom-1.5 -right-2 hidden h-3 w-3 rounded-full bg-base-300 lg:block" />
        </div>
        <FunnelPlus className="absolute right-0 top-0 z-0 h-40 w-40 text-base-200" />

        <div className="relative z-20 shrink-0 p-6">
          <section className="space-y-3">
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-base-content/50">
              {t('years')}
            </h3>
            <PackSeasonDropdown
              basePath={basePath}
              selectedNationCode={selectedNationCode}
              selectedSeason={selectedSeason}
              allPacksLabel={t('allPacks')}
              selectedSeasonLabel={selectedSeasonLabel}
              selectedSeasonCount={selectedSeasonCount}
              totalPacksCount={totalPacksCount}
              seasons={seasons}
            />
          </section>
        </div>

        <section className="hidden lg:flex min-h-0 flex-1 flex-col border-t border-dashed border-neutral/10 py-6">
          <div className="flex items-center justify-between gap-3 px-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-base-content/50">
              {t('nations')}
            </h3>
          </div>

          <div className="mt-4 min-h-0 flex-1 overflow-y-auto">
            <div className="space-y-0.5">
              {nations.map((nation) => {
                const nationName = localize(nation.name, locale);
                const active = selectedNationCode === nation.code;

                return (
                  <Link
                    key={nation.code}
                    href={toggleNationHref(nation.code)}
                    className={`flex items-center gap-2 px-6 py-2.5 text-sm transition-colors ${
                      active
                        ? 'bg-success/10 font-semibold text-success'
                        : 'text-base-content/75 hover:bg-base-200 hover:text-base-content'
                    }`}
                  >
                    <span className="relative flex shrink-0 items-center justify-center overflow-hidden">
                      <span className="absolute inset-0 animate-pulse bg-base-200/70" />
                      {nation.flagRectangle ? (
                        <Image
                          src={getOptimizedImage(nation.flagRectangle, 24)}
                          alt={nationName}
                          width={24}
                          height={24}
                          className="relative z-10 h-full w-full object-cover"
                        />
                      ) : (
                        <span className="relative z-10 text-[10px] font-mono text-base-content/40">
                          {nation.code.slice(0, 2).toUpperCase()}
                        </span>
                      )}
                    </span>
                    <span className="min-w-0 flex-1 truncate">{nationName}</span>
                    <span className="ml-auto shrink-0 rounded-full bg-neutral/5 px-2 py-0.5 text-xs font-mono text-base-content/70">
                      {nation.count}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    </aside>
  );
}
