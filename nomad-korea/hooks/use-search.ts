'use client';

import { useState, useMemo } from 'react';
import { useDebounce } from './use-debounce';
import { searchCities } from '@/lib/search';
import { mockCities } from '@/lib/mock-data';
import { City } from '@/types';

/**
 * 검색 상태 관리 훅
 * @returns 검색 상태 및 제어 함수들
 */
export function useSearch() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  // 300ms 디바운싱
  const debouncedQuery = useDebounce(query, 300);

  // 검색 실행 (메모이제이션)
  const results: City[] = useMemo(() => {
    if (!debouncedQuery.trim()) return [];
    return searchCities(mockCities, debouncedQuery);
  }, [debouncedQuery]);

  // 로딩 상태 (디바운싱 중)
  const isLoading = query !== debouncedQuery;

  return {
    query,
    setQuery,
    results,
    isOpen,
    setIsOpen,
    isLoading,
  };
}
