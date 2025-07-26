import { client } from '@/lib/sanity.client';
import { Search } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

async function getTotalCount() {
  // GROQ 查询，计算所有类型的徽标总数
  const query = `count(*[_type == "logo"])`;
  try {
    const count = await client.fetch(query);
    return count;
  } catch (error) {
    console.error("Failed to fetch total logo count:", error);
    return 0;
  }
}

export default async function Hero() {
  const t = await getTranslations('HomePage');
  const totalCount = await getTotalCount();
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
          <section className="relative flex-auto z-20">
            <input
              type="text"
              placeholder={t(`searchPlaceholder`)}
              className="input input-bordered w-full text-gray-700 h-14 rounded-lg flex-auto order-1 px-xl"
            />
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-neutral z-30" />
          </section>
          <p className="my-4 lg:text-base text-sm font-medium">{t(`searchTips`)}</p>
        </div>
      </div>
    </div>
  );
}