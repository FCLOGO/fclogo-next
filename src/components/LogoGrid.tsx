'use client';

import { useState, useEffect, useRef, useTransition, useCallback } from 'react';
import type { LogoCardQueryResult } from '@/types';
import { getLogosAction } from '@/app/actions/getLogosAction';
import LogoCard from './LogoCard';
import { useTranslations } from 'next-intl';
import { Loader } from 'lucide-react';

const PAGINATION_THRESHOLD = 5; // 自动加载 5 次

interface LogoGridProps {
  initialLogos: LogoCardQueryResult[];
  locale: string;
}

export default function LogoGrid({ initialLogos, locale }: LogoGridProps) {
  const t = useTranslations('LogosPage');
  const [logos, setLogos] = useState(initialLogos);
  const [page, setPage] = useState(1); // 我们已经加载了第0页，所以下一页是1
  const [hasMore, setHasMore] = useState(initialLogos.length === 20);
  const [isPending, startTransition] = useTransition();

  const loadMoreRef = useRef<HTMLDivElement>(null);

  const loadMoreLogos = useCallback(async () => {
    // 使用 isPending 代替 isLoading
    if (isPending || !hasMore) return;

    const newLogos = await getLogosAction(page);
    
    if (newLogos.length > 0) {
      setPage(prev => prev + 1);
      setLogos(prev => [...prev, ...newLogos]);
    }
    
    if (newLogos.length < 20) {
      setHasMore(false);
    }
  }, [page, hasMore, isPending]);

  // 使用 Intersection Observer 监听滚动
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // 当 ref 元素进入视口，并且我们处于自动加载阶段时
        if (entries[0].isIntersecting && hasMore && !isPending && page <= PAGINATION_THRESHOLD) {
          startTransition(() => {
            loadMoreLogos();
          });
        }
      },
      { threshold: 1.0 }
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [hasMore, isPending, page, loadMoreLogos]);

  return (
    <div className="w-full">
      <div className="overflow-hidden grid justify-between gap-6 grid-cols-2 md:grid-cols-[repeat(auto-fill,_minmax(240px,_1fr))]">
        {logos.map((logo) => (
          <LogoCard key={logo.slug.current} logo={logo} locale={locale} />
        ))}
      </div>

      {/* 加载状态和按钮 */}
      <div ref={loadMoreRef} className="flex justify-center py-10">
        {hasMore && (
          <>
            {page > PAGINATION_THRESHOLD ? (
              // 显示 "加载更多" 按钮
              <button 
                onClick={() => {
                  startTransition(() => {
                    loadMoreLogos();
                  });
                }}
                disabled={isPending}
                className="btn btn-primary rounded"
              >
                <Loader className='w-4 h-4' />
                {isPending ? t('loading') : t('loadMore')}
              </button>
            ) : (
              // 显示加载动画
              isPending && <div className="loading loading-dots loading-xl text-primary"></div>
            )}
          </>
        )}
        {!hasMore && logos.length > 0 && (
          // 显示全部加载完成
          <p className="text-base-content/60">{t('allLoaded')}</p>
        )}
      </div>
    </div>
  );
}