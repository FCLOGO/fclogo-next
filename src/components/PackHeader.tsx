'use client';
import { localize } from '@/lib/utils';
import type { FullPackQueryResult } from '@/types';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import SuspenseImage from './SuspenseImage';
import { getOptimizedImage } from '@/lib/sanity.image';
import { SplinePointer } from 'lucide-react';

type Props = {
  pack: FullPackQueryResult;
  locale: string;
}

export default function PackHeader({ pack, locale }: Props) {
  const t = useTranslations('DetailPage');
  const packTitle = localize(pack.title, locale);
  return (
    <>
      <header className="flex flex-col gap-2 px-6 pt-6 items-start justify-center content-start">
        <SuspenseImage
          src={getOptimizedImage(pack.sourceLogo.previewImage, 150)}
          alt={packTitle}
          width={150}
          height={150}
          className="object-contain mb-6"
          loadingSpinnerSize="loading-md"
        />
        <section className='flex flex-col items-start gap-2'>
          <span className="font-mono text-4xl text-primary font-bold">{pack.season}</span>
          <h1 className="text-lg capitalize flex-auto font-bold">{`${packTitle}${t('titleVectorPack')}`}</h1>
        </section>
      </header>
      <div className='flex flex-col gap-4 px-6 border-t border-t-base-300'>
        <section className='flex flex-col gap-2 mt-2'>
          <h3 className="font-semibold text-sm">{t('termTitle')}</h3>
          <p className='text-xs'>
            {t.rich(`termText`, { 
              name: packTitle,
              important: (chunks: React.ReactNode) => (
                <span className="font-bold">
                  {chunks}
                </span>
              )
            })}
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