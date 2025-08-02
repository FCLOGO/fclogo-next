'use client';
import { useTranslations } from 'next-intl';
import { UserRoundPlus, BugIcon } from 'lucide-react';
import type { FullLogoQueryResult } from '@/types';

type Props = {
  contributor?: FullLogoQueryResult['contributor'];
};

export default function LogoDetailPage({ contributor }: Props) {
  const t = useTranslations('DetailPage');
  return (
    <div className='flex flex-col gap-4 mt-2 p-6 border-t border-t-base-300'>
      {contributor && (
        <p className='text-xs font-semibold flex flex-nowrap items-center'>
          <UserRoundPlus className='w-4 h-4 mr-2' />
          {t('contributor')}
          {contributor.profileUrl ? (
            <a 
              href={contributor.profileUrl}
              rel="noopener noreferrer"
              target="_blank"
              className='ml-1 underline decoration-dotted hover:decoration-solid underline-offset-4 hover:text-primary'
            >
              @{contributor.name}
            </a>
          ) : (
            <span className='ml-1'>@{contributor.name}</span>
          )}
        </p>
      )}
      <p className='text-xs font-semibold flex flex-nowrap items-center'>
        <BugIcon className='w-4 h-4 mr-2' />
        {t('foundErr')}
        <a
          href="mailto:info@fclogo.top"
          rel="noopener noreferrer"
          target="_blank"
          className="ml-1 underline decoration-dotted hover:decoration-solid underline-offset-4 hover:text-primary"
        >
          {t('tellMe')}
        </a>
      </p>
    </div>
  );
}