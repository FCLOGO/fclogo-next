'use client';
import { localize } from '@/lib/utils';
import type { FullPackQueryResult } from '@/types';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import SuspenseImage from './SuspenseImage';
import { getOptimizedImage } from '@/lib/sanity.image';
import { ChevronRight, SplinePointer } from 'lucide-react';

type Props = {
  pack: FullPackQueryResult;
  locale: string;
}

export default function PackHeader({ pack, locale }: Props) {
  const t = useTranslations('DetailPage');
  const tHeader = useTranslations('Header');
  const packTitle = localize(pack.title, locale);
  const normalizeSeasonLabel = (value: string) => {
    const raw = value.trim();
    const fourDigitMatch = raw.match(/^(\d{4})/);
    if (fourDigitMatch) {
      return fourDigitMatch[1];
    }

    const twoDigitMatch = raw.match(/^(\d{2})/);
    if (twoDigitMatch) {
      return `20${twoDigitMatch[1]}`;
    }

    return raw;
  };
  const seasonLabel = normalizeSeasonLabel(pack.season);
  const nationName = pack.sourceSubject.nation?.name ? localize(pack.sourceSubject.nation.name, locale) : '';
  const hasNation = Boolean(pack.sourceSubject.nation?.code);
  const nationHref = pack.sourceSubject.nation?.code ? `/packs?nation=${pack.sourceSubject.nation.code}` : '/packs';
  const seasonHref = `/packs?season=${seasonLabel}`;
  return (
    <>
      <header className="flex flex-col gap-2 px-6 pt-6 items-start justify-center content-start">
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
              <Link href={seasonHref} className="transition-colors hover:text-success">
                {seasonLabel}
              </Link>
            </li>
          </ol>
        </nav>
        <SuspenseImage
          src={getOptimizedImage(pack.sourceLogo.previewImage, 150)}
          placeholderType="comp"
          iconClassName="stroke-24"
          alt={packTitle}
          width={150}
          height={150}
          className="object-contain mb-6"
        />
        <section className='flex flex-col items-start gap-2'>
          <span className="font-mono text-4xl text-primary font-bold">{pack.season}</span>
          <h1 className="text-lg capitalize flex-auto font-bold">{`${packTitle}${t('titleVectorPack')}`}</h1>
        </section>
      </header>
      <div className='flex flex-col gap-4 px-6 border-t border-t-base-300'>
        <section className='flex flex-col gap-2 mt-4'>
          <h3 className="font-semibold text-sm">{t('termTitle')}</h3>
          <p className='text-xs leading-loose'>
            {t.rich(`termText`, { 
              name: packTitle,
              important: (chunks: React.ReactNode) => (
                <span className="font-bold">
                  {chunks}
                </span>
              )
            })}
          </p>
          <p className='text-xs'>
            <Link href="/support/terms-of-use" className="underline decoration-dotted hover:decoration-solid underline-offset-4 hover:text-primary">
              <b>{t('termMore')}</b>
            </Link>
          </p>
        </section>
        <p className='flex items-center text-xs font-semibold gap-1.5'>
          <SplinePointer className='w-4 h-4' />
          {t('editTips')}
          <Link href="/support/how-to-edit-vector-file" className="underline decoration-dotted hover:decoration-solid underline-offset-4 hover:text-primary">
            {t('howToEdit')}
          </Link>
        </p>
      </div>
    </>
  );
}