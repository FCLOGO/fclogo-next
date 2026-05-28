import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { getOptimizedImage } from '@/lib/sanity.image';
import { localize } from '@/lib/utils';
import { getLogoCategorySidebarData } from '@/lib/logoCategory.queries';
import { subjectTypeKeys, type SubjectTypeKey } from '@/config/logoCategories';
import type { Image as SanityImage } from '@/types';
import NationPickerModal from './NationPickerModal';
import { FunnelPlus } from 'lucide-react';
import LogoIcon from './_icons/Logo';
import ClubIcon from './_icons/Club';
import CompetitionIcon from './_icons/Competition';
import NationIcon from './_icons/Nation';

type Props = {
  locale: string;
  title?: string;
  description?: string;
  basePath?: string;
  selectedNationCode?: string;
  selectedSubjectType?: SubjectTypeKey;
  icon?: {
    type: 'generic' | 'nation' | 'subject';
    flag?: SanityImage;
    subjectType?: SubjectTypeKey;
    alt?: string;
  };
};

const subjectTypeMeta = {
  club: { icon: ClubIcon, labelKey: 'club' },
  comp: { icon: CompetitionIcon, labelKey: 'comp' },
  team: { icon: NationIcon, labelKey: 'team' },
  assn: { icon: LogoIcon, labelKey: 'assn' },
  conf: { icon: LogoIcon, labelKey: 'conf' },
} as const satisfies Record<SubjectTypeKey, { icon: typeof LogoIcon; labelKey: string }>;

export default async function LogoCategorySidebar({
  locale,
  title,
  description,
  basePath = '/logos',
  selectedNationCode,
  selectedSubjectType
}: Props) {
  const t = await getTranslations('CategorySidebar');
  const tDetail = await getTranslations('DetailPage');
  const { nations, allNations, subjectTypes } = await getLogoCategorySidebarData({
    nationCode: selectedNationCode,
    subjectType: selectedSubjectType,
  });

  const subjectTypeCountMap = new Map(subjectTypes.map((item) => [item.key, item.count]));
  const headerTitle = title ?? t('title');
  const headerDescription = description ?? t('pageDescription');

  const buildHref = (nationCode?: string | null, subjectType?: SubjectTypeKey | null) => {
    const params = new URLSearchParams();

    if (nationCode) {
      params.set('nation', nationCode);
    }

    if (subjectType) {
      params.set('type', subjectType);
    }

    const query = params.toString();
    return query ? `${basePath}?${query}` : basePath;
  };

  const toggleNationHref = (nationCode: string) => {
    const nextNation = selectedNationCode === nationCode ? null : nationCode;
    return buildHref(nextNation, selectedSubjectType ?? null);
  };

  const toggleTypeHref = (subjectType: SubjectTypeKey) => {
    const nextType = selectedSubjectType === subjectType ? null : subjectType;
    return buildHref(selectedNationCode ?? null, nextType);
  };

  return (
    <aside className="relative w-full rounded-lg shrink-0 lg:w-90 lg:sticky lg:top-24 self-start overflow-hidden">
      <div className="flex max-h-[calc(100vh-8rem)] min-h-0 flex-col overflow-hidden rounded-lg bg-base-100 shadow">
        <div className='z-10 flex flex-col justify-center p-6 gap-3 border-none border-neutral/20 lg:border-b lg:border-dashed relative'>
          <LogoIcon className='w-12 h-12 stroke-[24] text-success flex-none' />
          <div className='flex flex-col'>
            <h1 className="text-2xl font-bold">{headerTitle}</h1>
            <p className="mt-2 max-w-sm text-sm leading-6 text-base-content/70">{headerDescription}</p>
          </div>
          <div className='hidden lg:block w-3 h-3 bg-base-300 rounded-full absolute -bottom-1.5 -right-2'></div>
          <div className='hidden lg:block w-3 h-3 bg-base-300 rounded-full absolute -bottom-1.5 -left-2'></div>
        </div>
        <FunnelPlus className="z-0 w-40 h-40 text-base-200 absolute top-0 right-0" />
        
        <div className="shrink-0 p-6">
          <section className="space-y-3">
            <h3 className="text-sm mb-4 font-bold uppercase tracking-wider text-base-content/50">
              {t('subjectTypes')}
            </h3>

            <div className="grid grid-cols-2 gap-3">
              {subjectTypeKeys.map((key) => {
                const meta = subjectTypeMeta[key];
                const Icon = meta.icon;
                const active = selectedSubjectType === key;

                return (
                  <Link
                    key={key}
                    href={toggleTypeHref(key)}
                    className={`flex flex-row items-center gap-2 rounded border p-2 text-left transition-colors ${
                      active
                        ? 'border-success bg-success/10 text-success font-bold'
                        : 'border-base-300 hover:border-success hover:bg-success/5'
                    }`}
                  >
                    <Icon className="h-7 w-7 text-success shrink-0" />
                    <div className="flex flex-1 flex-row items-center gap-1 justify-between text-xs font-semibold leading-none">
                      <span className='truncate'>{tDetail(meta.labelKey)}</span>
                      <span className="font-mono text-base-content/50">
                        {subjectTypeCountMap.get(key) ?? 0}
                      </span>
                    </div>
                  </Link>
                );
              })}
              <Link
                href={buildHref(null, null)}
                className={`flex flex-row items-center gap-2 rounded border p-2 text-left transition-colors ${
                  !selectedNationCode && !selectedSubjectType
                    ? 'border-success bg-success/10 text-success'
                    : 'border-base-300 hover:border-success hover:bg-success/5'
                }`}
              >
                <FunnelPlus className="h-7 w-7 text-success shrink-0 stroke-[1.25] p-[0.2rem]" />
                <span className="flex-1 truncate text-xs font-semibold leading-none">
                  {t('allLogos')}
                </span>
              </Link>
            </div>
          </section>
        </div>

        <section className="flex min-h-0 flex-1 flex-col border-t border-neutral/10 border-dashed py-6">
          <div className="flex items-center justify-between gap-3 px-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-base-content/50">{t('nations')}</h3>
            <NationPickerModal
              locale={locale}
              nations={allNations}
              selectedNationCode={selectedNationCode}
              selectedSubjectType={selectedSubjectType}
            />
          </div>

          <div className="mt-4 min-h-0 flex-1 overflow-y-auto">
            <div className="space-y-0">
              {nations.map((nation) => {
                const nationName = localize(nation.name, locale);
                const active = selectedNationCode === nation.code;

                return (
                  <Link
                    key={nation._id}
                    href={toggleNationHref(nation.code)}
                    className={`flex items-center gap-2 py-2.5 px-6 text-sm transition-colors ${
                      active
                        ? 'bg-success/10 text-success font-semibold'
                        : 'text-base-content/75 hover:bg-base-200 hover:text-base-content'
                    }`}
                  >
                    <span className="flex shrink-0 items-center justify-center overflow-hidden">
                      {nation.flagRectangle ? (
                        <Image
                          src={getOptimizedImage(nation.flagRectangle, 24)}
                          alt={nationName}
                          width={24}
                          height={24}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-[10px] font-mono text-base-content/40">
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
