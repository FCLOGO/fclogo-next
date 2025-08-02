import { localize } from '@/lib/utils';
import { getOptimizedImage } from '@/lib/sanity.image';
import Image from 'next/image';
// import SuspenseImage from './SuspenseImage';
import { Link } from '@/i18n/navigation';
import type { LatestPackQueryResult } from '@/types';

type Props = {
  pack: LatestPackQueryResult;
  locale: string;
};

export default function LogoCard({ pack, locale }: Props) {
  const packTitle = localize(pack.title, locale);

  return (
    <Link href={`/pack/${pack.slug.current}`} className="card bg-base-100 shadow-box group overflow-hidden border border-base-200 hover:border-gray-300">
      <div className="grid grid-cols-3 p-6 gap-2 aspect-square bg-base-100">
        {pack.gridLogos.map((logo) => (
          <div key={logo._id} className="flex items-center justify-center p-2">
            <Image
              src={getOptimizedImage(logo.previewImage, 60)}
              alt="" // 装饰性图片，alt 留空
              width={60}
              height={60}
              className="w-full h-full object-contain"
            />
          </div>
        ))}
      </div>
      <div className="card-body gap-1 bg-base-100 h-20 w-full flex flex-row flex-nowrap justify-between items-center content-center border-t border-gray-300 border-dashed">
        <div className="flex items-center gap-2 flex-auto">
          <span className="badge badge-sm badge-success font-mono flex-none font-semibold px-1.5">{pack.season}</span>
          <h2 className="card-title text-sm line-clamp-1">{packTitle}</h2>
        </div>
        <div className="flex-shrink-0 w-12 h-12">
          <Image
            src={getOptimizedImage(pack.sourceLogo.previewImage, 48)}
            alt={packTitle}
            width={48}
            height={48}
            className="w-full h-full object-contain"
          />
        </div>
      </div>
    </Link>
  );
}