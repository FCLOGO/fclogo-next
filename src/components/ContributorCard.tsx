'use client'
import type { contributorQueryResult } from '@/types';
import Image from 'next/image';
import { getOptimizedImage } from '@/lib/sanity.image';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { SquareArrowOutUpRight, User } from 'lucide-react';

type Props = {
  contributor: contributorQueryResult;
  totalLogoCount: number;
};

export default function ContributorCard({ contributor, totalLogoCount }: Props) {
  const t = useTranslations('ContributionPage');
  const contributionPercentage = totalLogoCount > 0 
    ? ((contributor.contributionCount / totalLogoCount) * 100).toFixed(1) 
    : 0;

  return (
    <article className="bg-base-100 rounded-lg shadow-lg w-full relative overflow-hidden flex flex-col">
      {/* 头部区域 */}
      <div className='relative w-full h-32 overflow-hidden'>
        {contributor.avatar ? (
          <Image src={getOptimizedImage(contributor.avatar, 120)} alt="" fill className="object-cover blur-lg opacity-40" />
        ) : (
          <div className="bg-primary w-full h-full blur-md opacity-40"></div>
        )}
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 gap-2 text-primary-content">
          {contributor.avatar ? (
            <Image
              src={getOptimizedImage(contributor.avatar, 64)}
              alt={contributor.name}
              width={64}
              height={64}
              className="object-cover drop-shadow-lg w-16 h-16 rounded-full border-4 border-base-100/50"
            />
          ) : (
            <div className='w-16 h-16 flex-shrink-0 bg-primary rounded-full flex items-center justify-center drop-shadow-lg border-4 border-base-100/50'>
              <User className="w-10 h-10 text-primary-content" />
            </div>
          )}
          <div className='flex flex-row items-center justify-center w-full gap-2'>
            <h3 className="font-bold text-sm drop-shadow line-clamp-1">{contributor.name}</h3>
            {contributor.profileUrl && (
              <a href={contributor.profileUrl} target="_blank" rel="noopener noreferrer" className='rounded-full hover:bg-base-100/20 p-1 transition-colors'>
                <SquareArrowOutUpRight className='w-3.5 h-3.5'/>
              </a>
            )}
          </div>
        </div>
      </div>
      
      {/* 内容区域 */}
      <div className="w-full p-6 flex-grow flex flex-col gap-4">
        {/* 统计和最近贡献 */}
        <div className='flex items-center justify-between w-full text-sm'>
          <span className='uppercase font-bold text-base-content/80'>{t('recentContributions')}</span>
        </div>
        
        {contributor.recentContributions.length > 0 ? (
          <div className="grid grid-cols-[repeat(auto-fill,_minmax(48px,_1fr))] justify-between items-center w-full gap-2">
            {contributor.recentContributions.map(logo => (
              <Link key={logo._id} href={`/${logo.slug.current}`} className="bg-base-200 rounded p-2 hover:bg-base-300">
                <Image
                  src={getOptimizedImage(logo.previewImage, 48)}
                  alt=""
                  width={48}
                  height={48}
                  className="w-full h-full object-contain"
                />
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-xs text-base-content/50">{t('noSubmit')}</p>
        )}

        {/* 比例图 */}
        <div className="w-full mt-auto pt-4 flex flex-col items-center justify-between">
          <div className='flex items-center justify-between w-full text-sm mb-2'>
            <span className='uppercase font-bold text-base-content/80'>{t('totalContributions')}</span>
            <span className='font-mono font-bold text-primary'>{contributor.contributionCount}</span>
          </div>
          <div className="bg-base-200 w-full h-2 rounded-full overflow-hidden">
            <div
              className="bg-primary h-full rounded-full"
              style={{ width: `${contributionPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>
    </article>
  );
}