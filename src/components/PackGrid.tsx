'use client';

import { useState, useEffect, useRef, useTransition, useCallback } from 'react';
import type { LatestPackQueryResult } from '@/types';
import { getPacksAction } from '@/app/actions/getPacksAction';
import PackCard from './PackCard';
import { useTranslations } from 'next-intl';
import { Loader } from 'lucide-react';
import AdUnit from './AdUnit';

const PAGINATION_THRESHOLD = 4; // 自动加载 5 次

interface PackGridProps {
  initialPacks: LatestPackQueryResult[];
  locale: string;
}

export default function PackGrid({ initialPacks, locale }: PackGridProps) {
  const t = useTranslations('LogosPage');
  const [packs, setPacks] = useState(initialPacks);
  const [page, setPage] = useState(1); // 我们已经加载了第0页，所以下一页是1
  const [hasMore, setHasMore] = useState(initialPacks.length === 20);
  const [isPending, startTransition] = useTransition();

  const loadMoreRef = useRef<HTMLDivElement>(null);

  const loadMorePacks = useCallback(async () => {
    // 使用 isPending 代替 isLoading
    if (isPending || !hasMore) return;

    const newPacks = await getPacksAction(page);
    
    if (newPacks.length > 0) {
      setPage(prev => prev + 1);
      setPacks(prev => [...prev, ...newPacks]);
    }
    
    if (newPacks.length < 20) {
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
            loadMorePacks();
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
  }, [hasMore, isPending, page, loadMorePacks]);

  return (
    <div className="w-full">
      <div className="mb-8 flex items-center justify-center">
        <AdUnit adSlot="1229678468" /> 
      </div>
      <div className="overflow-hidden grid justify-between gap-6 grid-cols-2 md:grid-cols-[repeat(auto-fill,_minmax(240px,_1fr))]">
        {packs.map((pack) => (
          <PackCard key={pack.slug.current} pack={pack} locale={locale} />
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
                    loadMorePacks();
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
        {!hasMore && packs.length > 0 && (
          // 显示全部加载完成
          <p className="text-base-content/60 text-sm">{t('allLoaded')}</p>
        )}
      </div>
    </div>
  );
}