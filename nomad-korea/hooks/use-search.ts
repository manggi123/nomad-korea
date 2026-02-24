'use client';

import { useState, useEffect } from 'react';
import { useDebounce } from './use-debounce';
import { createClient } from '@/lib/supabase/client';
import { City } from '@/types';
import { transformDbCitiesToCities } from '@/lib/utils/type-transformers';

/**
 * 검색 상태 관리 훅 (Supabase 연동)
 * @returns 검색 상태 및 제어 함수들
 */
export function useSearch() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<City[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // 300ms 디바운싱
  const debouncedQuery = useDebounce(query, 300);

  // Supabase 검색 실행
  useEffect(() => {
    const searchCities = async () => {
      if (!debouncedQuery.trim()) {
        setResults([]);
        return;
      }

      setIsSearching(true);
      const supabase = createClient();

      try {
        // Supabase RPC 함수 사용 또는 직접 쿼리
        const { data, error } = await supabase
          .from('cities')
          .select('*')
          .or(`name.ilike.%${debouncedQuery}%,region.ilike.%${debouncedQuery}%`)
          .order('avg_rating', { ascending: false })
          .limit(5);

        if (error) throw error;
        // DB 타입을 프론트엔드 타입으로 변환
        setResults(transformDbCitiesToCities(data || []));
      } catch (err) {
        console.error('Search error:', err);
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    searchCities();
  }, [debouncedQuery]);

  // 로딩 상태 (디바운싱 중 또는 검색 중)
  const isLoading = query !== debouncedQuery || isSearching;

  return {
    query,
    setQuery,
    results,
    isOpen,
    setIsOpen,
    isLoading,
  };
}
