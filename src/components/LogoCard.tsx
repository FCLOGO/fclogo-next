import { localize } from '@/lib/utils';
import { getOptimizedImage } from '@/lib/sanity.image';
import Image from 'next/image';
import SuspenseImage from './SuspenseImage';
import { Link } from '@/i18n/navigation';
import type { InternationalizedString, Image as SanityImageType } from '@/types';

// 定义卡片所需的数据类型
type LogoCardProps = {
  logo: {
    slug: { current: string };
    version: number;
    isBgDark?: boolean;
    previewImage: SanityImageType;
    subject: {
      name: InternationalizedString;
      info: {
        shortName: InternationalizedString;
      };
      nation?: {
        flagSquare: SanityImageType;
      };
    };
    style: {
      title: InternationalizedString;
    };
  };
  locale: string;
};

export default function LogoCard({ logo, locale }: LogoCardProps) {
  const subjectName = localize(logo.subject.name, locale);
  const subjectShortName = localize(logo.subject.info.shortName, locale);
  const styleName = localize(logo.style.title, locale);

  return (
    <Link href={`${logo.slug.current}`} className="card bg-base-100 shadow-box group overflow-hidden border border-base-200 hover:border-gray-300">
      <figure className={`relative aspect-square p-16 ${logo.isBgDark ? 'bg-neutral' : 'bg-base-100'}`}>
        <SuspenseImage
          src={getOptimizedImage(logo.previewImage, 300)}
          alt={subjectName}
          width={300}
          height={300}
          className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
        />
        {logo.subject.nation?.flagSquare && (
          <div className="absolute top-4 right-4 w-6 h-6 rounded-full overflow-hidden">
            <Image
              src={getOptimizedImage(logo.subject.nation.flagSquare, 40)}
              alt={`Flag of ${subjectName}`}
              width={40}
              height={40}
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </figure>
      <div className="card-body bg-base-100 h-16 w-full flex flex-row flex-nowrap justify-between items-center content-center border-t border-gray-300 border-dashed">
        <h2 className="card-title flex-auto justify-center text-base line-clamp-1">{subjectShortName}</h2>
        {logo.version === 0 ? '' : (
          <span className="badge badge-sm badge-success font-mono flex-none font-semibold">
            {String(logo.version)}
          </span>
        )}
        <span className='badge badge-sm badge-success font-mono uppercase flex-none font-semibold'>{styleName}</span>
      </div>
    </Link>
  );
}