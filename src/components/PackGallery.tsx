import { getOptimizedImage } from '@/lib/sanity.image';
import type { FullPackQueryResult, LogoCardQueryResult } from '@/types';
import SuspenseImage from './SuspenseImage';
import { Link } from '@/i18n/navigation';

type PackGalleryProps = {
  items: FullPackQueryResult['items'];
}

function PackItem({ logo }: { logo: LogoCardQueryResult }) {
  return (
    <Link 
      href={`/${logo.slug.current}`} 
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
  return (
    <div className="w-full flex-grow h-full p-6 items-center justify-center relative mt-10">
      <div className="w-full flex-grow grid items-center justify-items-center gap-6 grid-cols-[repeat(auto-fill,_minmax(160px,_1fr))] md:grid-cols-[repeat(auto-fill,_minmax(200px,_1fr))]">
        {items.map((logo) => (
          <PackItem key={logo.slug.current} logo={logo} />
        ))}
      </div>
    </div>
  );
}