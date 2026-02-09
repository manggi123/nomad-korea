import { City } from '@/types';

/**
 * 한글 텍스트를 정규화합니다 (공백 제거, 소문자 변환)
 * @param text - 정규화할 텍스트
 * @returns 정규화된 텍스트
 */
function normalizeKorean(text: string): string {
  return text.replace(/\s+/g, '').toLowerCase().trim();
}

/**
 * 검색어를 정리합니다 (특수문자 제거, 연속 공백 정리)
 * @param query - 검색어
 * @returns 정리된 검색어
 */
function sanitizeQuery(query: string): string {
  return query
    .trim()
    .replace(/[^\w\sㄱ-ㅎㅏ-ㅣ가-힣]/g, '') // 특수문자 제거
    .replace(/\s+/g, ' '); // 연속 공백을 단일 공백으로
}

/**
 * 도시의 검색 관련도 점수를 계산합니다
 * @param city - 도시 객체
 * @param query - 검색어
 * @returns 관련도 점수 (높을수록 관련성 높음)
 */
export function scoreSearchResult(city: City, query: string): number {
  const normalizedQuery = normalizeKorean(query);
  const normalizedName = normalizeKorean(city.name);
  const normalizedRegion = normalizeKorean(city.region);

  let score = 0;

  // 완전 일치 (최고 점수)
  if (normalizedName === normalizedQuery) score += 100;
  if (normalizedRegion === normalizedQuery) score += 80;

  // 시작 위치 일치
  if (normalizedName.startsWith(normalizedQuery)) score += 50;
  if (normalizedRegion.startsWith(normalizedQuery)) score += 40;

  // 포함 여부
  if (normalizedName.includes(normalizedQuery)) score += 20;
  if (normalizedRegion.includes(normalizedQuery)) score += 15;

  // 평점 보너스 (0-10점)
  score += city.avgRating * 2;

  // 리뷰 수 보너스 (로그 스케일로 0-5점 정도)
  score += Math.min(5, Math.log(city.reviewCount + 1));

  return score;
}

/**
 * 도시 목록에서 검색어에 맞는 도시를 찾습니다
 * @param cities - 검색할 도시 목록
 * @param query - 검색어
 * @returns 검색 결과 (관련도 순으로 정렬됨)
 */
export function searchCities(cities: City[], query: string): City[] {
  // 빈 검색어 처리
  const sanitized = sanitizeQuery(query);
  if (!sanitized) return [];

  // 검색어와 매칭되는 도시 필터링
  const results = cities.filter((city) => {
    const normalizedQuery = normalizeKorean(sanitized);
    const normalizedName = normalizeKorean(city.name);
    const normalizedRegion = normalizeKorean(city.region);

    return (
      normalizedName.includes(normalizedQuery) ||
      normalizedRegion.includes(normalizedQuery)
    );
  });

  // 관련도 점수로 정렬
  return results.sort((a, b) => {
    const scoreA = scoreSearchResult(a, sanitized);
    const scoreB = scoreSearchResult(b, sanitized);
    return scoreB - scoreA;
  });
}
