'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useCallback, useMemo } from 'react';
import type { HomeFilters, BudgetFilter, RegionFilter, EnvironmentFilter, SeasonFilter, AmenityFilter } from '@/types';

/**
 * 홈페이지 필터 상태를 관리하는 훅
 * URL 쿼리 파라미터를 통해 상태를 관리하여 북마크/공유 가능
 */
export function useHomeFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // URL에서 필터 값 읽기
  const filters: HomeFilters = useMemo(() => ({
    budget: (searchParams.get('budget') as BudgetFilter) || 'all',
    region: (searchParams.get('region') as RegionFilter) || 'all',
    environment: (searchParams.get('environment') as EnvironmentFilter) || 'all',
    season: (searchParams.get('season') as SeasonFilter) || 'all',
    amenity: (searchParams.get('amenity') as AmenityFilter) || 'all',
  }), [searchParams]);

  // URL 업데이트 함수
  const updateURL = useCallback((newFilters: Partial<HomeFilters>) => {
    const params = new URLSearchParams(searchParams.toString());

    // 각 필터 업데이트
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value === 'all') {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    // URL 업데이트 (페이지 리로드 없이)
    const newURL = params.toString() ? `${pathname}?${params.toString()}` : pathname;
    router.push(newURL, { scroll: false });
  }, [searchParams, pathname, router]);

  // 개별 필터 업데이트 함수들
  const setBudget = useCallback((budget: BudgetFilter) => {
    updateURL({ budget });
  }, [updateURL]);

  const setRegion = useCallback((region: RegionFilter) => {
    updateURL({ region });
  }, [updateURL]);

  const setEnvironment = useCallback((environment: EnvironmentFilter) => {
    updateURL({ environment });
  }, [updateURL]);

  const setSeason = useCallback((season: SeasonFilter) => {
    updateURL({ season });
  }, [updateURL]);

  const setAmenity = useCallback((amenity: AmenityFilter) => {
    updateURL({ amenity });
  }, [updateURL]);

  // 모든 필터 초기화
  const resetFilters = useCallback(() => {
    router.push(pathname, { scroll: false });
  }, [pathname, router]);

  // 필터가 활성화되어 있는지 확인
  const hasActiveFilters = useMemo(() => {
    return filters.budget !== 'all' ||
           filters.region !== 'all' ||
           filters.environment !== 'all' ||
           filters.season !== 'all' ||
           filters.amenity !== 'all';
  }, [filters]);

  // 활성화된 필터 개수
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.budget !== 'all') count++;
    if (filters.region !== 'all') count++;
    if (filters.environment !== 'all') count++;
    if (filters.season !== 'all') count++;
    if (filters.amenity !== 'all') count++;
    return count;
  }, [filters]);

  return {
    filters,
    setBudget,
    setRegion,
    setEnvironment,
    setSeason,
    setAmenity,
    resetFilters,
    hasActiveFilters,
    activeFilterCount,
  };
}
