'use client'; 
import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { useTransition } from 'react';

// 简单的图标组件
const ZhIcon = () => <span className="text-md font-bold">中</span>;
const EnIcon = () => <span className="text-md font-mono font-bold">EN</span>;

export default function LanguageSwitcher() {
  const [isPending, startTransition] = useTransition();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  function onSwitchLanguage() {
    const nextLocale = locale === 'en' ? 'zh-cn' : 'en';
    startTransition(() => {
      router.replace(pathname, {locale: nextLocale});
    });
  }

  return (
    <button
      onClick={onSwitchLanguage}
      disabled={isPending}
      className="btn btn-ghost btn-circle"
    >
      {locale === 'en' ? <ZhIcon /> : <EnIcon />}
    </button>
  );
}