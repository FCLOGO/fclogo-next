import { client } from '@/lib/sanity.client';
import { Link } from '@/i18n/navigation';
import { getLocale, getTranslations } from 'next-intl/server';
import PackCard from './PackCard';
import type { LatestPackQueryResult } from '@/types';
import { ArrowUpRight } from 'lucide-react';

async function getLatestPacks(): Promise<LatestPackQueryResult[]> {
  const query = `*[_type == "logoPack"] | order(dateOriginal desc) [0...12] {
    title,
    season,
    slug,
    sourceLogo->{
      previewImage
    },
    "gridLogos": items[0...9]->{
      _id,
      previewImage
    }
  }`;
  try {
    const Packs = await client.fetch(query);
    return Packs;
  } catch (error) {
    console.error("Failed to fetch latest Packs:", error);
    return [];
  }
}

export default async function LatestPacks() {
  const t = await getTranslations('HomePage');
  const locale = await getLocale();
  const packs = await getLatestPacks();

  if (!packs || packs.length === 0) {
    return null; // 如果没有数据，则不渲染任何内容
  }
  return (
    <section className="flex-auto flex flex-col flex-nowrap mb-16">
      <div className="flex flex-row flex-nowrap items-center justify-between w-full font-semibold uppercase leading-none mb-6">
        <h2 className="font-bold flex-auto">
          {t('latestPacks')}
        </h2>
        <button className="btn btn-success rounded-full uppercase pl-4 pr-2.5">
          <Link href="/packs" className='flex flex-row items-center gap-1'>
            {t('viewAllPacks')}
            <ArrowUpRight className="h-5 w-5" />
          </Link>
        </button>
      </div>
      {packs.length > 0 ? (
        <div className="w-full overflow-hidden grid justify-between gap-8 grid-cols-2 md:grid-cols-[repeat(auto-fill,_minmax(280px,_1fr))]">
          {packs.map((pack) => (
            <PackCard key={pack.season} pack={pack} locale={locale} />
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