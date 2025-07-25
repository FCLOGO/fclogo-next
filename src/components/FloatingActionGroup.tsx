'use client'; 
import React from 'react';
import { useTranslations } from 'next-intl';
import { useScroll } from '@/hooks/useScroll';
import clsx from 'clsx';
import LanguageSwitcher from './LanguageSwitcher';
import { ChevronUpIcon, ChevronDownIcon } from 'lucide-react';

export default function FloatingActionGroup() {
  const t = useTranslations('HomePage');
  const scrolled = useScroll();
  // 功能：平滑滚动到页面顶部
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 功能：平滑滚动到页面底部
  const scrollToBottom = () => {
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
  };
  return (
    <div className="fixed bottom-80 right-6 z-90 hidden lg:block">
      <div className="flex flex-col items-center rounded-md">
        <LanguageSwitcher 
          className={clsx({
            'rounded-t-md': true, // 主题按钮永远有顶部圆角
            'rounded-b-md': !scrolled, // 只有在滚动按钮隐藏时才有底部圆角
          })}
        />
        <div 
          className={clsx(
            'transition-all duration-300 ease-in-out bg-base-100 shadow-lg rounded-b-md',
            {
              'opacity-100 scale-100 pointer-events-auto': scrolled,
              'opacity-0 scale-95 pointer-events-none': !scrolled,
            }
          )}
        >
          <div className="w-full h-px bg-base-300"></div>

          <button
            onClick={scrollToTop}
            className="w-10 h-10 cursor-pointer flex items-center justify-center text-base-content/60 hover:bg-base-200 transition-colors"
            aria-label={t('backToTop')}
          >
            <ChevronUpIcon className="h-5 w-5" />
          </button>
          
          <div className="w-full h-px bg-base-300"></div>
          
          <button
            onClick={scrollToBottom}
            className="w-10 h-10 cursor-pointer flex items-center justify-center text-base-content/60 hover:bg-base-200 transition-colors rounded-b-md"
            aria-label={t('scrollToBottom')}
          >
            <ChevronDownIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}