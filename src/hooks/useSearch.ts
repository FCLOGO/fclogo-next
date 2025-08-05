'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase.client';
import { useDebounce } from 'use-debounce'; 
import type { LogoSearchResult } from '@/types';
import { useLocale } from 'next-intl';

export function useSearch() {
  const locale = useLocale();
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<LogoSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300);

  const performSearch = useCallback(async (term: string) => {
    if (!term.trim()) {
      setResults([]);
      return;
    }
    setIsLoading(true);
    
    const { data, error } = await supabase.rpc('search_logos', {
      search_term: term,
      language_code: locale,
    });

    if (error) {
      console.error('Search Error:', error);
      setResults([]);
    } else {
      setResults(data || []);
    }
    setIsLoading(false);
  }, [locale]);

  useEffect(() => {
    performSearch(debouncedSearchTerm);
  }, [debouncedSearchTerm, performSearch]);

  const clearSearch = useCallback(() => {
    setSearchTerm('');
    setResults([]);
  },[]);

  return {
    searchTerm,
    setSearchTerm,
    results,
    isLoading,
    debouncedSearchTerm,
    clearSearch,
    locale, // 也一并返回 locale，方便 UI 组件使用
  };
}