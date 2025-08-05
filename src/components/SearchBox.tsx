'use client';

import { useRef } from 'react';
import SearchResultItem from './SearchResultItem';
import { useTranslations } from 'next-intl';
import { Search, X } from 'lucide-react';
import clsx from 'clsx';
import { useShortcut } from '@/hooks/useShortcut';
import { useSearch } from '@/hooks/useSearch';


export default function SearchBox() {
  const { 
    searchTerm, 
    setSearchTerm, 
    results, 
    isLoading, 
    debouncedSearchTerm, 
    clearSearch,
    locale 
  } = useSearch();
  const t = useTranslations('Search');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClear = () => {
    clearSearch();
    inputRef.current?.focus();
  };

  useShortcut('escape', () => {
    if (searchTerm) {
      handleClear();
    }
  });

  return (
    <div className="relative z-50">
      {/* 搜索输入框 */}
      <div className={clsx(
        "relativee h-16 bg-base-100 rounded flex flex-nowrap justify-between items-center shadow-box",
        {"rounded-b-none": (isLoading || results.length >0) }
      )}>
        <input 
          type="text"
          ref={inputRef}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={t('placeholder')}
          className="border-none text-base w-full h-16 rounded flex-auto order-1 px-12 text-base-content outline-none focus:outline-none focus:border-none"
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 z-30">
          {searchTerm && (
            <button
              type="button" // 设为 button 防止触发表单提交
              onClick={handleClear}
              className="btn btn-ghost btn-circle btn-sm text-base-content/50 hover:text-base-content"
              aria-label={t('clearSearch')}
            >
              <X />
            </button>
          )}
        </div>
        <Search className="text-base-content absolute left-4 top-1/2 -translate-y-1/2" />
      </div>
      {(isLoading || results.length >0) && (
        <div className="bg-base-100 min-h-[100px] w-full absolute top-16 rounded-b-lg flex flex-col shadow-box">
          <section className="w-full max-h-[300px] overflow-x-hidden overflow-y-auto p-6 border-t border-dashed border-gray-300">
            {/* 加载与结果状态 */}
            {isLoading && (
              <div className="flex justify-center">
                <div className="loading loading-dots text-primary"></div>
              </div>
            )}
            {!isLoading && debouncedSearchTerm && (
              <p className="text-sm text-center mb-4 text-base-content">
                {t.rich('resultsFound', {
                  count: results.length,
                  query: debouncedSearchTerm,
                  strong: (chunks) => <strong className="text-primary font-bold">{chunks}</strong>
                })}
              </p>
            )}
            {!isLoading && results.length > 0 && (
              <div className="space-y-4">
                {results.map(result => (
                  <SearchResultItem key={result.logo_id} result={result} locale={locale} />
                ))}
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}