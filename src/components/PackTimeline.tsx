import clsx from 'clsx';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { getOptimizedImage } from '@/lib/sanity.image';
import { localize } from '@/lib/utils';
import type { FullPackQueryResult } from '@/types';
import SuspenseImage from './SuspenseImage';

type Props = {
  packs: FullPackQueryResult['relatedPacks'];
  locale: string;
};

export default async function PackTimeline({ packs, locale }: Props) {
  const t = await getTranslations('DetailPage');

  if (!packs.length) {
    return null;
  }

  return (
    <section className="border-t border-t-gray-300/50 flex flex-col px-6 py-10 bg-base-200">
      <h3 className="uppercase font-semibold mb-6 flex flex-row items-center gap-2">
        {t('packTimeline')}
      </h3>
      <div className="w-full flex-auto grid justify-between grid-cols-[repeat(auto-fill,_minmax(120px,_1fr))] gap-6">
        {packs.map((pack) => {
          const packTitle = localize(pack.title, locale);

          return (
            <article
              key={pack._id}
              className={clsx('bg-base-100 shadow-box rounded-lg')}
            >
              <Link href={`/pack/${pack.slug.current}`} className="flex flex-col items-center">
                <SuspenseImage
                  src={getOptimizedImage(pack.sourceLogo.previewImage, 80)}
                  placeholderType="comp"
                  iconClassName="stroke-20"
                  alt={packTitle}
                  width={80}
                  height={80}
                  className="object-contain py-4"
                />
                <span className="w-full h-10 font-mono text-sm border-t border-dashed border-t-gray-300 inline-flex justify-center items-center">
                  {pack.season}
                </span>
              </Link>
            </article>
          );
        })}
      </div>
    </section>
  );
}
