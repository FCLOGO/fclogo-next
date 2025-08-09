'use client';

import { useEffect, useRef } from 'react';
import { useSearchStore } from '@/store/useSearchStore';
import { useShortcut } from '@/hooks/useShortcut';
import { usePathname } from '@/i18n/navigation';
import SearchResultItem from './SearchResultItem';
import TopDownloads from './TopDownloads';
import { useTranslations } from 'next-intl';
import { useSearch } from '@/hooks/useSearch';
import { Search, X } from 'lucide-react';

export default function SearchModal() {
  const { isOpen, open, close } = useSearchStore();
  const modalRef = useRef<HTMLDialogElement>(null);
  const pathname = usePathname();
  const inputRef = useRef<HTMLInputElement>(null);
  const t = useTranslations('Search');

  const { 
    searchTerm, 
    setSearchTerm, 
    results, 
    isLoading, 
    debouncedSearchTerm, 
    clearSearch,
    locale
  } = useSearch();

  useShortcut('k', open, { meta: true });
  useShortcut('k', open, { ctrl: true });

  useEffect(() => {
    const modal = modalRef.current;
    if (modal) {
      if (isOpen && !modal.open) {
        modal.showModal();
        clearSearch();
        setTimeout(() => inputRef.current?.focus(), 100);
      } else if (!isOpen && modal.open) {
        modal.close();
      }
    }
  }, [isOpen, clearSearch]);

  useEffect(() => {
    // 当路径发生变化时，关闭模态框
    close();
  }, [pathname, close]);

  const handleClear = () => {
    clearSearch();
    inputRef.current?.focus();
  }

  useShortcut('escape', () => {
    if (searchTerm) handleClear();
    else close(); // 如果输入框为空，ESC 关闭模态框
  });

  return (
    <dialog ref={modalRef} className="modal" onClose={close}>
      <div className="modal-box w-11/12 max-w-4xl p-0 flex flex-col h-[50vh] mb-50">
        {/* 头部：渲染 SearchBox */}
        <div className="relative flex items-center p-2 border-b border-gray-300 border-dashed">
          <input 
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t('placeholder')}
            className="border-none text-base w-full h-14 rounded flex-auto order-1 px-12 text-base-content outline-none focus:outline-0 focus:border-0"
            autoFocus
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
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
        
        {/* 主体：结果列表，使用 flex-grow 填充剩余空间 */}
        <div className="flex-grow overflow-y-auto p-6">
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
          {!isLoading && results.length > 0 ? (
            <div className="space-y-4">
              {results.map(result => (
                <SearchResultItem key={result.logo_id} result={result} locale={locale} />
              ))}
            </div>
          ) : (
            <TopDownloads />
          )}
          {/* {!isLoading && results.length === 0 && (
            <div className="text-left text-base-content/60">
              <p className='text-sm'>{t('searchTips')}</p> 
              <TopDownloads />
            </div>
          )} */}
        </div>
      </div>
      <form method="dialog" className="modal-backdrop backdrop-blur">
        <button>close</button>
      </form>
    </dialog>
  );
}