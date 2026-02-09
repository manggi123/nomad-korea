'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { getUniqueRegions } from '@/lib/filter';
import { mockCities } from '@/lib/mock-data';

/**
 * 검색 필터 컴포넌트 (클라이언트)
 */
export function SearchFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const regions = getUniqueRegions(mockCities);
  const selectedRegion = searchParams.get('region');
  const minRating = searchParams.get('minRating');
  const maxBudget = searchParams.get('maxBudget');

  /**
   * 필터 값 업데이트
   */
  const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value === null || value === '') {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    router.push(`/search?${params.toString()}`);
  };

  /**
   * 모든 필터 초기화
   */
  const resetFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    const query = params.get('q');

    if (query) {
      router.push(`/search?q=${query}`);
    } else {
      router.push('/search');
    }
  };

  return (
    <div className="space-y-6">
      {/* 지역 필터 */}
      <div>
        <h3 className="font-semibold mb-3">지역</h3>
        <select
          value={selectedRegion || ''}
          onChange={(e) => updateFilter('region', e.target.value || null)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">전체 지역</option>
          {regions.map((region) => (
            <option key={region} value={region}>
              {region}
            </option>
          ))}
        </select>
      </div>

      {/* 예산 필터 */}
      <div>
        <h3 className="font-semibold mb-3">월 예산</h3>
        <select
          value={maxBudget || ''}
          onChange={(e) => updateFilter('maxBudget', e.target.value || null)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">전체</option>
          <option value="1000000">100만원 이하</option>
          <option value="1500000">150만원 이하</option>
          <option value="2000000">200만원 이하</option>
        </select>
      </div>

      {/* 평점 필터 */}
      <div>
        <h3 className="font-semibold mb-3">최소 평점</h3>
        <select
          value={minRating || ''}
          onChange={(e) => updateFilter('minRating', e.target.value || null)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">전체</option>
          <option value="3.0">3.0 이상</option>
          <option value="3.5">3.5 이상</option>
          <option value="4.0">4.0 이상</option>
          <option value="4.5">4.5 이상</option>
        </select>
      </div>

      {/* 초기화 버튼 */}
      <Button
        variant="outline"
        className="w-full"
        onClick={resetFilters}
        disabled={!selectedRegion && !minRating && !maxBudget}
      >
        필터 초기화
      </Button>
    </div>
  );
}
