import { getOptimizedImage } from '@/lib/sanity.image';
import type { FullLogoQueryResult } from '@/types';
// import Image from 'next/image';
import SuspenseImage from './SuspenseImage';
import { getTranslations } from 'next-intl/server';
// import { Link as NavLink } from '@/i18n/navigation';
import NavLink from './NavLink';
import { Info } from 'lucide-react';
import { localize } from '@/lib/utils';

type Props = {
  logo: FullLogoQueryResult;
  locale: string;
}

export default async function LogoGallery({ logo, locale }: Props) {
  const t = await getTranslations('LogoDetailPage');
  const subjectName = localize(logo.subject.name, locale);
  return (
    <div className={`flex-grow h-full p-6 flex flex-col items-center justify-center relative ${logo.isBgDark ? 'bg-neutral' : ''}`}>
      <figure className="w-full flex-grow h-auto flex items-center justify-center">
        {/* 主图 */}
        <SuspenseImage
          src={getOptimizedImage(logo.previewImage, 400)}
          alt={`${subjectName} - v${logo.version}`}
          width={400}
          height={400}
          className="object-contain"
        />
      </figure>
      {/* 其他徽标样式 */}
      {logo.otherStyles && logo.otherStyles.length > 0 && (
        <div className='w-full h-20 my-10'>
          <ul className='flex flex-row items-start justify-center gap-6'>
            {logo.otherStyles.map((styleLogo) =>(
              <NavLink 
                key={styleLogo._id}
                href={`${styleLogo.slug.current}`}
                className={`rounded border border-gray-300 flex-shrink-0 ${styleLogo.isBgDark ? 'bg-neutral' : 'bg-base-300'}`}
                activeClassName="border-b-3 border-b-success"
                exact
              >
                <li key={styleLogo._id} className="m-3">
                  <SuspenseImage
                    src={getOptimizedImage(styleLogo.previewImage, 64)}
                    alt={`${subjectName} - v${styleLogo.version}`}
                    width={64}
                    height={64}
                    className="object-contain"
                  /> 
                </li>
              </NavLink>
            ))}
          </ul>
        </div>
      )}
      {/* 参考资料 */}
      {logo.referenceInfo && (
        <div className="absolute top-8 left-8 group flex flex-row items-center p-1.5 bg-white rounded-md shadow max-w-[400px]">
          <Info className="h-5 w-5 flex-shrink-0 cursor-pointer" />
          <span className="text-xs whitespace-nowrap overflow-hidden text-ellipsis ml-2 hidden group-hover:inline-block">
            {t('referenceInfo')}:
            <a
              rel="noopener noreferrer"
              target="_blank"
              href={logo.referenceInfo}
              className="underline underline-offset-2 ml-2"
              title={logo.referenceInfo}
            >
              {logo.referenceInfo}
            </a>
          </span>
        </div>
      )}
    </div>
  );
}