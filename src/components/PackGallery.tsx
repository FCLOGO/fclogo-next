import { getOptimizedImage } from '@/lib/sanity.image';
import type { FullPackQueryResult, LogoCardQueryResult } from '@/types';
import SuspenseImage from './SuspenseImage';
import { Link } from '@/i18n/navigation';
import { normalizeLogoPath } from '@/lib/utils';

type PackGalleryProps = {
  items: FullPackQueryResult['items'];
}

function PackItem({ logo }: { logo: LogoCardQueryResult }) {
  return (
    <Link 
      href={normalizeLogoPath(logo.slug.current)}
      className="aspect-square transition-transform duration-300 hover:-translate-y-1 group"
    >
      <SuspenseImage
        src={getOptimizedImage(logo.previewImage, 160)}
        placeholderType="club"
        iconClassName="stroke-24"
        alt={""} // 画廊中的图片是装饰性的，alt 为空是合适的
        width={160}
        height={160}
        className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
      />
    </Link>
  );
}

export default async function PackGallery({ items }: PackGalleryProps) {
  const dotPatternStyle = {
    backgroundImage: 'radial-gradient(rgba(15,23,42,0.16) 1.25px, transparent 1.25px)',
    backgroundSize: '24px 24px',
  } as const;

  return (
    <div
      className="flex-grow h-full p-6 flex flex-col items-center justify-center relative"
      style={dotPatternStyle}
    >
      <div className="w-full flex-grow h-auto flex items-center justify-center">
        <div className="w-full grid items-center justify-items-center gap-6 grid-cols-[repeat(auto-fill,_minmax(160px,_1fr))] md:grid-cols-[repeat(auto-fill,_minmax(200px,_1fr))]">
          {items.map((logo) => (
            <PackItem key={logo.slug.current} logo={logo} />
          ))}
        </div>
      </div>
    </div>
  );
}
