import { client } from '@/lib/sanity.client';
import { Link } from '@/i18n/navigation';
import { getLocale, getTranslations } from 'next-intl/server';
import LogoCard from './LogoCard';
import type { LogoCardQueryResult } from '@/types';
import { ArrowUpRight } from 'lucide-react';

async function getLatestLogos(): Promise<LogoCardQueryResult[]> {
  const query = `*[_type == "logo"] | order(dateOriginal desc) [0...12] {
    slug,
    version,
    isBgDark,
    previewImage,
    subject->{
      name,
      nation->{
        flagSquare
      },
      info {
        shortName
      }
    },
    style->{
      title
    }
  }`;
  try {
    const logos = await client.fetch(query);
    return logos;
  } catch (error) {
    console.error("Failed to fetch latest logos:", error);
    return [];
  }
}

export default async function LatestLogos() {
  const t = await getTranslations('HomePage');
  const locale = await getLocale();
  const logos = await getLatestLogos();

  return (
    <section className="flex-auto flex flex-col flex-nowrap mb-16">
      <div className="flex flex-row flex-nowrap items-center justify-between w-full font-semibold uppercase leading-none mb-6">
        <h2 className="font-bold flex-auto">
          {t('latestLogos')}
        </h2>
        <button className="btn btn-success rounded-full uppercase">
          <Link href="/logos" className='flex flex-row items-center gap-1'>
            {t('viewAllLogos')}
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </button>
      </div>
      {logos.length > 0 ? (
        <div className="w-full overflow-hidden grid justify-between gap-8 grid-cols-2 md:grid-cols-[repeat(auto-fill,_minmax(280px,_1fr))]">
          {logos.map((logo: LogoCardQueryResult) => (
            <LogoCard key={logo.slug.current} logo={logo} locale={locale} />
          ))}
        </div>
      ) : (
        <p className="text-center text-base-content/60">
          {t('noData')}
        </p>
      )}
    </section>
  );
}