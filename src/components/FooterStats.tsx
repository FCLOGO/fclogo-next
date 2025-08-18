import { sanityFetch } from '@/lib/sanity.client';
import { getTranslations } from 'next-intl/server';
import LogoIcon from './_icons/Logo';
import ClubIcon from './_icons/Club';
import CompetitionIcon from './_icons/Competition';
import NationIcon from './_icons/Nation';

interface StatsQueryResult {
  logoCount: number;
  clubCount: number;
  compCount: number;
  nationCount: number;
}

async function getSiteStats() {
  // 使用一个高效的 GROQ 查询，一次性获取所有统计数据
  const query = `{
    "logoCount": count(*[_type == "logo"]),
    "clubCount": count(*[_type == "club"]),
    "compCount": count(*[_type == "comp"]),
    "nationCount": count(*[_type == "nation"]),
  }`;
  try {
    const stats = await sanityFetch<StatsQueryResult>({
      query,
      revalidate: 604800, // 缓存 1 周
      tags: ['footer-stats'], // 为这个特定的查询打上标签
    });
    return stats;
  } catch (error) {
    console.error("Failed to fetch total logo stats:", error);
    return { logoCount: 0, clubCount: 0, compCount: 0, nationCount: 0 }; // 出错时优雅地返回 0
  }
}

// 格式化数字的辅助函数
const formatNumber = (num: number, locale: string) => new Intl.NumberFormat(locale).format(num);

export default async function FooterStats({ locale }: { locale: string }) {
  const t = await getTranslations('Footer');
  const stats = await getSiteStats();

  const statsItems = [
    { label: t('logos'), value: formatNumber(stats.logoCount, locale), Icon: LogoIcon },
    { label: t('clubs'), value: formatNumber(stats.clubCount, locale), Icon: ClubIcon },
    { label: t('competitions'), value: formatNumber(stats.compCount, locale), Icon: CompetitionIcon },
    { label: t('nations'), value: formatNumber(stats.nationCount, locale), Icon: NationIcon },
  ];

  return (
    <div className="flex justify-center gap-6 lg:justify-start lg:gap-10 bg-neutral text-neutral-content">
      {statsItems.map((item, index) => (
        <div key={index} className="flex flex-col items-start gap-2">
          <div className='flex items-start gap-2'>
            <div className="font-extralight text-3xl lg:text-5xl xl:6xl">
              {item.value}
            </div>
            <div className="text-success">
              <item.Icon className="h-6 w-6 stroke-16 mt-1.5" />
            </div>
          </div>
          <div className="text-sm text-neutral-content/60 uppercase">{item.label}</div>
        </div>
      ))}
    </div>
  );
}
