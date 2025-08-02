import type { FullLogoQueryResult } from '@/types';
import { getTranslations } from 'next-intl/server';
import { getOptimizedImage } from '@/lib/sanity.image';
import clsx from 'clsx';
// import Image from 'next/image';
import SuspenseImage from './SuspenseImage';
import { Link } from '@/i18n/navigation';
import { BadgeCheck } from 'lucide-react';

type Props = {
  history: FullLogoQueryResult['logoHistory'];
  currentLogoVersion: number;
  locale: string;
}

export default async function LogoTimeline({ history, currentLogoVersion }: Props) {
  const t = await getTranslations('DetailPage');
  const isTimelineComplete = history.length > 0 && history[0].subject?.timelineComplete;
  return (
    <section className="border-t border-t-gray-300/50 flex flex-col px-6 py-10 bg-base-200">
      <h3 className="uppercase font-semibold mb-6 flex flex-row items-center gap-2">
        {t('logoTimeline')}
        {isTimelineComplete && <BadgeCheck className='h-5 w-5 text-success'/>}
      </h3>
      <div className="w-full flex-auto grid justify-between grid-cols-[repeat(auto-fill,_minmax(120px,_1fr))] gap-6">
        {history.map(logo => (
          // 给当前徽标添加一个特殊样式
          <article key={logo._id} className={clsx(
            'bg-base-100 shadow-box rounded-lg',
            {'border-b-3 border-b-success': logo.version === currentLogoVersion}
          )}>
            <Link href={logo.slug.current} className='flex flex-col items-center'>
              <SuspenseImage
                src={getOptimizedImage(logo.previewImage, 80)}
                alt={logo.version.toString()}
                width={80}
                height={80}
                className="object-contain py-4"
              />
              <span className="w-full h-10 font-mono text-sm border-t border-dashed border-t-gray-300 inline-flex justify-center items-center">
                  {logo.version === 0 ? '????' : logo.version}
                  {logo.isDoubtful ? '?' : ''}
              </span>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}