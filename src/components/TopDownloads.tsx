'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase.client';
import type { LogoSearchResult } from '@/types';
import SearchResultItem from './SearchResultItem';
import { useLocale, useTranslations } from 'next-intl';

export default function TopDownloads() {
  const t = useTranslations('Search');
  const locale = useLocale();
  const [topLogos, setTopLogos] = useState<LogoSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 使用 useEffect 在组件挂载时获取一次数据
  useEffect(() => {
    async function fetchTopLogos() {
      setIsLoading(true);
      const { data, error } = await supabase.rpc('get_top_10_downloaded_logos');
      
      if (error) {
        console.error("Failed to fetch top logos:", error);
      } else {
        setTopLogos(data || []);
      }
      setIsLoading(false);
    }
    
    fetchTopLogos();
  }, []); // 空依赖数组意味着这个 effect 只在组件首次挂载时运行一次

  // 加载状态的 UI (骨架屏)
  if (isLoading) {
    return (
      <div className="space-y-4">
        <h3 className="font-semibold text-left uppercase text-sm text-base-content/60 mb-4">{t('topDownloads')}</h3>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-4 rounded-lg bg-base-100 animate-pulse">
            <div className="w-12 h-12 bg-base-300 rounded-md"></div>
            <div className="flex-1 space-y-2">
              <div className="h-5 bg-base-300 rounded w-full"></div>
              <div className="h-5 bg-base-300 rounded w-full"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  if (topLogos.length === 0) {
    return null; // 如果没有数据，不显示任何内容
  }

  // 成功获取数据后的 UI
  return (
    <div>
      <h3 className="font-semibold text-left uppercase text-sm text-base-content/60 mb-4">{t('topDownloads')}</h3>
      <div className="space-y-4">
        {topLogos.map(result => (
          <SearchResultItem key={result.logo_id} result={result} locale={locale} />
        ))}
      </div>
    </div>   
  );
}