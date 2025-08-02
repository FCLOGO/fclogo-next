import { getLocale, getTranslations } from 'next-intl/server';
import { getPacksAction } from '@/app/actions/getPacksAction';
import PackGrid from '@/components/PackGrid';

export default async function AllLogosPage() {
  const t = await getTranslations('LogosPage');
  const locale = await getLocale();

  // 只获取第一页 (page 0) 的数据作为初始数据
  const initialPacks = await getPacksAction(0);

  return (
    <main className="container mx-auto px-6 py-10 flex-grow flex flex-col">
      {initialPacks.length > 0 ? (
        <PackGrid initialPacks={initialPacks} locale={locale} />
      ) : (
        <p className="text-center text-base-content/60">{t('noData')}</p>
      )}
    </main>
  );
}