import type { City } from '@/types';

/**
 * 관련 도시 추천 함수 (OCP: 확장 가능한 추천 로직)
 * @param currentCity - 현재 도시
 * @param allCities - 전체 도시 목록
 * @param limit - 반환할 도시 개수 (기본값: 3)
 * @returns 추천 도시 목록
 */
export function getRelatedCities(
  currentCity: City,
  allCities: City[],
  limit: number = 3
): City[] {
  // 현재 도시 제외
  const otherCities = allCities.filter((city) => city.id !== currentCity.id);

  // 같은 지역 도시
  const sameRegionCities = otherCities.filter(
    (city) => city.region === currentCity.region
  );

  // 비슷한 가격대 도시 (±30만원)
  const similarPriceCities = otherCities.filter((city) => {
    const priceDiff = Math.abs(city.avgMonthlyCost - currentCity.avgMonthlyCost);
    return priceDiff <= 300000;
  });

  // 같은 지역 + 비슷한 가격대 조합 (중복 제거)
  const relatedCities = Array.from(
    new Set([...sameRegionCities, ...similarPriceCities])
  );

  // 평점순 정렬
  const sortedCities = relatedCities.sort(
    (a, b) => b.avgRating - a.avgRating
  );

  // 상위 limit개 반환
  return sortedCities.slice(0, limit);
}

/**
 * 공유 URL 생성 함수
 * @param citySlug - 도시 slug
 * @returns 공유 URL
 */
export function generateShareUrl(citySlug: string): string {
  if (typeof window === 'undefined') {
    // 서버 사이드에서는 상대 경로만 반환
    return `/cities/${citySlug}`;
  }

  // 클라이언트 사이드에서는 전체 URL 반환
  const baseUrl = window.location.origin;
  return `${baseUrl}/cities/${citySlug}`;
}
