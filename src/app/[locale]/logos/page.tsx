import { getLocale, getTranslations } from 'next-intl/server';
import { getLogosAction } from '@/app/actions/getLogosAction';
import LogoGrid from '@/components/LogoGrid';

export default async function AllLogosPage() {
  const t = await getTranslations('LogosPage');
  const locale = await getLocale();

  // 只获取第一页 (page 0) 的数据作为初始数据
  const initialLogos = await getLogosAction(0);

  return (
    <main className="container mx-auto px-6 py-10 flex-grow flex flex-col">
      {initialLogos.length > 0 ? (
        <LogoGrid initialLogos={initialLogos} locale={locale} />
      ) : (
        <p className="text-center text-base-content/60">{t('noData')}</p>
      )}
    </main>
  );
}