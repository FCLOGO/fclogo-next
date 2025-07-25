'use client'; 
import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { useTransition } from 'react';
import clsx from 'clsx';

// 简单的图标组件
const ZhIcon = () => <span className="text-md font-bold">中</span>;
const EnIcon = () => <span className="text-md font-bold">EN</span>;

export default function LanguageSwitcher( { className }: { className?: string }) {
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
    <div className="tooltip tooltip-left" data-tip={locale === 'en' ? '切换到中文' : 'Switch to English'}>
      <button
        onClick={onSwitchLanguage}
        disabled={isPending}
        className={clsx(
        'w-10 h-10 flex items-center justify-center transition-colors duration-300 cursor-pointer shadow-md bg-gray-700 text-neutral-content hover:bg-neutral',
        className,
        )}
      >
        {locale === 'en' ? <ZhIcon /> : <EnIcon />}
      </button>
    </div>
  );
}