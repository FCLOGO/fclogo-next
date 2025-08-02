'use client';
import { localize } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import type { FullLogoQueryResult } from '@/types';
import Image from 'next/image';
import { getOptimizedImage } from '@/lib/sanity.image';

type Props = {
  logo: FullLogoQueryResult;
  locale: string;
};

export default function LogoDetailPage({ logo, locale}: Props) {
  const t = useTranslations('DetailPage');
  const subjectName = localize(logo.subject.name, locale);
  return (
    <header className='flex flex-col gap-2 px-6 pt-6'>
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