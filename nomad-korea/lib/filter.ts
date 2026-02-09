import { City, SearchFilters } from '@/types';

/**
 * 도시 목록에 필터를 적용합니다
 * @param cities - 필터링할 도시 목록
 * @param filters - 적용할 필터 조건
 * @returns 필터링된 도시 목록
 */
export function applyCityFilters(
  cities: City[],
  filters: SearchFilters
): City[] {
  return cities.filter((city) => {
    // 지역 필터
    if (filters.regions && filters.regions.length > 0) {
      if (!filters.regions.includes(city.region)) {
        return false;
      }
    }

    // 최소 예산 필터
    if (filters.minBudget !== undefined) {
      if (city.avgMonthlyCost < filters.minBudget) {
        return false;
      }
    }

    // 최대 예산 필터
    if (filters.maxBudget !== undefined) {
      if (city.avgMonthlyCost > filters.maxBudget) {
        return false;
      }
    }

    // 최소 평점 필터
    if (filters.minRating !== undefined) {
      if (city.avgRating < filters.minRating) {
        return false;
      }
    }

    return true;
  });
}

/**
 * 도시 목록에서 중복 제거된 지역 목록을 추출합니다
 * @param cities - 도시 목록
 * @returns 정렬된 지역 목록
 */
export function getUniqueRegions(cities: City[]): string[] {
  const regions = Array.from(new Set(cities.map((city) => city.region)));
  return regions.sort();
}
