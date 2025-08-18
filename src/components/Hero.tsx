import { getTotalLogoCount } from '@/lib/sanity.queries'
import { getTranslations } from 'next-intl/server';
import SearchBox from './SearchBox';

export default async function Hero() {
  const t = await getTranslations('HomePage');
  const totalCount = await getTotalLogoCount();
  const formattedCount = new Intl.NumberFormat('en-US').format(totalCount);

  return (
    <div className="hero min-h-[360px] bg-gradient-to-b from-primary to-secondary text-primary-content">
      <div className="text-center w-full">
        <div className="max-w-5xl mx-auto px-10 lg:px-24">
          <h2 className="text-3xl uppercase font-semibold">
            {t.rich(`heroTitle`, {
              totalCount: formattedCount,
              count: (chunks: React.ReactNode) => (
                <span className="lg:text-6xl lg:font-extralight">
                  {chunks}
                </span>
              )
              })}
          </h2>
          <p className="lg:text-base text-sm my-4 font-medium">{t(`heroSubtitle`)}</p>
          <SearchBox />
          <p className="my-4 lg:text-base text-sm font-medium">{t(`searchTips`)}</p>
        </div>
      </div>
    </div>
  );
}