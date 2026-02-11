import type { City, HomeFilters, BudgetFilter, RegionFilter, EnvironmentFilter, SeasonFilter, AmenityFilter } from '@/types';

/**
 * 예산 필터에 따라 도시를 필터링
 */
function filterByBudget(city: City, budget: BudgetFilter): boolean {
  if (budget === 'all') return true;

  const monthlyCost = city.avgMonthlyCost;

  switch (budget) {
    case 'budget':
      return monthlyCost <= 1000000;
    case 'mid':
      return monthlyCost > 1000000 && monthlyCost <= 1500000;
    case 'premium':
      return monthlyCost > 1500000 && monthlyCost <= 2000000;
    case 'luxury':
      return monthlyCost > 2000000;
    default:
      return true;
  }
}

/**
 * 지역 필터에 따라 도시를 필터링
 */
function filterByRegion(city: City, region: RegionFilter): boolean {
  if (region === 'all') return true;

  const cityRegion = city.region.toLowerCase();

  switch (region) {
    case 'seoul':
      return cityRegion.includes('서울');
    case 'gyeonggi':
      return cityRegion.includes('경기');
    case 'busan':
      return cityRegion.includes('부산');
    case 'jeju':
      return cityRegion.includes('제주');
    case 'gangwon':
      return cityRegion.includes('강원');
    case 'chungcheong':
      return cityRegion.includes('충청') || cityRegion.includes('충남') || cityRegion.includes('충북');
    case 'jeolla':
      return cityRegion.includes('전라') || cityRegion.includes('전남') || cityRegion.includes('전북') || cityRegion.includes('광주');
    case 'gyeongsang':
      return cityRegion.includes('경상') || cityRegion.includes('경남') || cityRegion.includes('경북') || cityRegion.includes('대구') || cityRegion.includes('울산');
    default:
      return true;
  }
}

/**
 * 환경 필터에 따라 도시를 필터링
 * (환경 점수를 기반으로 판단)
 */
function filterByEnvironment(city: City, environment: EnvironmentFilter): boolean {
  if (environment === 'all') return true;

  const { environmentScore, region } = city;
  const regionLower = region.toLowerCase();

  switch (environment) {
    case 'urban':
      // 도심: 서울, 부산, 대구 등 대도시
      return regionLower.includes('서울') || regionLower.includes('강남') ||
             regionLower.includes('부산') || regionLower.includes('대구');
    case 'suburb':
      // 교외: 경기, 인천 등
      return regionLower.includes('경기') || regionLower.includes('인천') ||
             regionLower.includes('수원') || regionLower.includes('성남');
    case 'nature':
      // 자연: 환경 점수가 높은 지역
      return environmentScore >= 4.0;
    case 'beach':
      // 해변: 부산, 제주, 강릉 등
      return regionLower.includes('제주') || regionLower.includes('부산') ||
             regionLower.includes('강릉') || regionLower.includes('속초');
    case 'mountain':
      // 산악: 강원, 충청 등
      return regionLower.includes('강원') || regionLower.includes('충청') ||
             regionLower.includes('경북');
    default:
      return true;
  }
}

/**
 * 계절 필터에 따라 도시를 필터링
 * (모든 도시가 연중 가능하므로, 계절별 추천 점수로 판단)
 */
function filterBySeason(city: City, season: SeasonFilter): boolean {
  if (season === 'all') return true;

  // 계절별로 특정 도시를 추천하는 로직
  // 현재는 모든 도시를 반환하지만, 나중에 계절별 점수를 추가할 수 있음
  const regionLower = city.region.toLowerCase();

  switch (season) {
    case 'spring':
      // 봄: 제주, 경주 등 꽃놀이 명소
      return true; // 모든 도시가 봄에 적합
    case 'summer':
      // 여름: 해변 도시 추천
      return regionLower.includes('제주') || regionLower.includes('부산') ||
             regionLower.includes('강릉') || true;
    case 'fall':
      // 가을: 단풍 명소
      return true; // 모든 도시가 가을에 적합
    case 'winter':
      // 겨울: 스키 리조트 인근
      return true; // 모든 도시가 겨울에 적합
    default:
      return true;
  }
}

/**
 * 편의시설 필터에 따라 도시를 필터링
 */
function filterByAmenity(city: City, amenity: AmenityFilter): boolean {
  if (amenity === 'all') return true;

  switch (amenity) {
    case 'coworking':
      // 코워킹 스페이스 3개 이상
      return city.coworkingCount >= 3;
    case 'cafe':
      // 카페 5개 이상
      return city.cafeCount >= 5;
    case 'fast-internet':
      // 인터넷 속도 100Mbps 이상
      return city.avgInternetSpeed >= 100;
    case 'high-environment':
      // 환경 점수 4.0 이상
      return city.environmentScore >= 4.0;
    default:
      return true;
  }
}

/**
 * 모든 필터를 적용하여 도시 목록을 필터링
 */
export function filterCities(cities: City[], filters: HomeFilters): City[] {
  return cities.filter(city => {
    return (
      filterByBudget(city, filters.budget) &&
      filterByRegion(city, filters.region) &&
      filterByEnvironment(city, filters.environment) &&
      filterBySeason(city, filters.season) &&
      filterByAmenity(city, filters.amenity)
    );
  });
}

/**
 * 필터가 기본값인지 확인
 */
export function isDefaultFilters(filters: HomeFilters): boolean {
  return (
    filters.budget === 'all' &&
    filters.region === 'all' &&
    filters.environment === 'all' &&
    filters.season === 'all' &&
    filters.amenity === 'all'
  );
}

/**
 * 활성화된 필터 개수 계산
 */
export function getActiveFilterCount(filters: HomeFilters): number {
  let count = 0;
  if (filters.budget !== 'all') count++;
  if (filters.region !== 'all') count++;
  if (filters.environment !== 'all') count++;
  if (filters.season !== 'all') count++;
  if (filters.amenity !== 'all') count++;
  return count;
}
