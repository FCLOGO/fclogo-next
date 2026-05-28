'use client';
import { localize } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import type { FullLogoQueryResult } from '@/types';
import Image from 'next/image';
import { getOptimizedImage } from '@/lib/sanity.image';
import { Link } from '@/i18n/navigation';
import { ChevronRight } from 'lucide-react';

type Props = {
  logo: FullLogoQueryResult;
  locale: string;
};

export default function LogoDetailPage({ logo, locale}: Props) {
  const t = useTranslations('DetailPage');
  const tHeader = useTranslations('Header');
  const subjectName = localize(logo.subject.name, locale);
  const nationName = logo.subject.nation?.name ? localize(logo.subject.nation.name, locale) : '';
  const hasNation = Boolean(logo.subject.nation?.name);
  const subjectType = t(logo.subject._type).trim();
  const nationHref = logo.subject.nation?.code ? `/logos?nation=${logo.subject.nation.code}` : '/logos';
  const typeHref = `/logos?type=${logo.subject._type}`;
  return (
    <header className='flex flex-col gap-2 px-6 pt-6'>
      <nav aria-label="Breadcrumb" className="mb-2 text-xs uppercase">
        <ol className="flex flex-wrap items-center gap-1.5 text-base-content/60">
          <li>
            <Link href="/" className="transition-colors hover:text-success">
              {tHeader('home')}
            </Link>
          </li>
          <li aria-hidden="true" className="text-base-content/40">
            <ChevronRight className="h-3.5 w-3.5" />
          </li>
          {hasNation && (
            <li>
              <Link href={nationHref} className="transition-colors hover:text-success">
                {nationName}
              </Link>
            </li>
          )}
          {hasNation && <li aria-hidden="true" className="text-base-content/40">·</li>}
          <li>
            <Link href={typeHref} className="transition-colors hover:text-success">
              {subjectType}
            </Link>
          </li>
        </ol>
      </nav>
      <section className='flex items-center gap-2'>
        {logo.subject.nation?.flagRectangle && (
          <Image
            src={getOptimizedImage(logo.subject.nation.flagRectangle, 28)}
            alt={localize(logo.subject.nation?.name, locale)}
            width={28}
            height={28}
            className="object-contain"
          />
        )}
        {logo.version === 0 ? '' : (
          <span className="badge badge-sm badge-outline badge-success font-mono flex-none font-semibold py-2.5">
            {`v${logo.version}${logo.isDoubtful ? ('?') : ('')}`}
          </span>
        )}
        {logo.isOutdated && (
          <span className="badge badge-sm badge-outline badge-success flex-none font-semibold uppercase py-2.5">
            {t('outdated')}
          </span>
        )}
      </section>
      <section className='flex items-center justify-between gap-2'>
        <h1 className="text-lg capitalize flex-auto font-bold">{`${subjectName}${t('titleVector')}`}</h1>
        {logo.subject.status === "inactive" && (
          <span className='badge badge-sm badge-outline badge-error flex-none font-semibold py-2.5 uppercase'>
            {t('inactive')}
          </span>
        )}
      </section>
    </header>
  );
}
