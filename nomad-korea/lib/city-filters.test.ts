import { describe, it, expect } from 'vitest';
import { filterCities, isDefaultFilters, getActiveFilterCount } from './city-filters';
import { mockCities, createMockCity } from '@/test/fixtures/cities';
import type { HomeFilters } from '@/types';

describe('city-filters', () => {
  const defaultFilters: HomeFilters = {
    budget: 'all',
    region: 'all',
    environment: 'all',
    season: 'all',
    amenity: 'all',
  };

  describe('filterCities', () => {
    it('기본 필터는 모든 도시를 반환한다', () => {
      const results = filterCities(mockCities, defaultFilters);
      expect(results.length).toBe(mockCities.length);
    });

    describe('예산 필터', () => {
      it('budget 필터: 100만원 이하', () => {
        const filters: HomeFilters = { ...defaultFilters, budget: 'budget' };
        const results = filterCities(mockCities, filters);

        expect(results.every(city => city.avgMonthlyCost <= 1000000)).toBe(true);
      });

      it('mid 필터: 100만원 초과 150만원 이하', () => {
        const filters: HomeFilters = { ...defaultFilters, budget: 'mid' };
        const results = filterCities(mockCities, filters);

        expect(results.every(city =>
          city.avgMonthlyCost > 1000000 && city.avgMonthlyCost <= 1500000
        )).toBe(true);
      });

      it('premium 필터: 150만원 초과 200만원 이하', () => {
        const filters: HomeFilters = { ...defaultFilters, budget: 'premium' };
        const results = filterCities(mockCities, filters);

        expect(results.every(city =>
          city.avgMonthlyCost > 1500000 && city.avgMonthlyCost <= 2000000
        )).toBe(true);
      });

      it('luxury 필터: 200만원 초과', () => {
        const cities = [
          ...mockCities,
          createMockCity({ avgMonthlyCost: 2500000 }),
        ];
        const filters: HomeFilters = { ...defaultFilters, budget: 'luxury' };
        const results = filterCities(cities, filters);

        expect(results.every(city => city.avgMonthlyCost > 2000000)).toBe(true);
      });
    });

    describe('지역 필터', () => {
      it('seoul 필터: 서울 지역', () => {
        const filters: HomeFilters = { ...defaultFilters, region: 'seoul' };
        const results = filterCities(mockCities, filters);

        expect(results.every(city =>
          city.region.toLowerCase().includes('서울')
        )).toBe(true);
      });

      it('gyeonggi 필터: 경기 지역', () => {
        const filters: HomeFilters = { ...defaultFilters, region: 'gyeonggi' };
        const results = filterCities(mockCities, filters);

        expect(results.every(city =>
          city.region.toLowerCase().includes('경기')
        )).toBe(true);
      });

      it('busan 필터: 부산 지역', () => {
        const filters: HomeFilters = { ...defaultFilters, region: 'busan' };
        const results = filterCities(mockCities, filters);

        expect(results.every(city =>
          city.region.toLowerCase().includes('부산')
        )).toBe(true);
      });

      it('jeju 필터: 제주 지역', () => {
        const filters: HomeFilters = { ...defaultFilters, region: 'jeju' };
        const results = filterCities(mockCities, filters);

        expect(results.every(city =>
          city.region.toLowerCase().includes('제주')
        )).toBe(true);
      });

      it('gangwon 필터: 강원 지역', () => {
        const filters: HomeFilters = { ...defaultFilters, region: 'gangwon' };
        const results = filterCities(mockCities, filters);

        expect(results.every(city =>
          city.region.toLowerCase().includes('강원')
        )).toBe(true);
      });

      it('jeolla 필터: 전라 지역', () => {
        const filters: HomeFilters = { ...defaultFilters, region: 'jeolla' };
        const results = filterCities(mockCities, filters);

        expect(results.every(city => {
          const region = city.region.toLowerCase();
          return region.includes('전라') || region.includes('전남') ||
                 region.includes('전북') || region.includes('광주');
        })).toBe(true);
      });

      it('gyeongsang 필터: 경상 지역', () => {
        const filters: HomeFilters = { ...defaultFilters, region: 'gyeongsang' };
        const results = filterCities(mockCities, filters);

        expect(results.every(city => {
          const region = city.region.toLowerCase();
          return region.includes('경상') || region.includes('경남') ||
                 region.includes('경북') || region.includes('대구') ||
                 region.includes('울산');
        })).toBe(true);
      });
    });

    describe('환경 필터', () => {
      it('urban 필터: 도심 환경', () => {
        const filters: HomeFilters = { ...defaultFilters, environment: 'urban' };
        const results = filterCities(mockCities, filters);

        expect(results.every(city => {
          const region = city.region.toLowerCase();
          return region.includes('서울') || region.includes('강남') ||
                 region.includes('부산') || region.includes('대구');
        })).toBe(true);
      });

      it('nature 필터: 환경 점수 4.0 이상', () => {
        const filters: HomeFilters = { ...defaultFilters, environment: 'nature' };
        const results = filterCities(mockCities, filters);

        expect(results.every(city => city.environmentScore >= 4.0)).toBe(true);
      });

      it('beach 필터: 해변 도시', () => {
        const filters: HomeFilters = { ...defaultFilters, environment: 'beach' };
        const results = filterCities(mockCities, filters);

        expect(results.every(city => {
          const region = city.region.toLowerCase();
          return region.includes('제주') || region.includes('부산') ||
                 region.includes('강릉') || region.includes('속초');
        })).toBe(true);
      });
    });

    describe('편의시설 필터', () => {
      it('coworking 필터: 코워킹 스페이스 3개 이상', () => {
        const filters: HomeFilters = { ...defaultFilters, amenity: 'coworking' };
        const results = filterCities(mockCities, filters);

        expect(results.every(city => city.coworkingCount >= 3)).toBe(true);
      });

      it('cafe 필터: 카페 5개 이상', () => {
        const filters: HomeFilters = { ...defaultFilters, amenity: 'cafe' };
        const results = filterCities(mockCities, filters);

        expect(results.every(city => city.cafeCount >= 5)).toBe(true);
      });

      it('fast-internet 필터: 인터넷 속도 100Mbps 이상', () => {
        const filters: HomeFilters = { ...defaultFilters, amenity: 'fast-internet' };
        const results = filterCities(mockCities, filters);

        expect(results.every(city => city.avgInternetSpeed >= 100)).toBe(true);
      });

      it('high-environment 필터: 환경 점수 4.0 이상', () => {
        const filters: HomeFilters = { ...defaultFilters, amenity: 'high-environment' };
        const results = filterCities(mockCities, filters);

        expect(results.every(city => city.environmentScore >= 4.0)).toBe(true);
      });
    });

    describe('복합 필터', () => {
      it('여러 필터를 조합하여 적용한다', () => {
        const filters: HomeFilters = {
          budget: 'mid',
          region: 'all',
          environment: 'all',
          season: 'all',
          amenity: 'cafe',
        };
        const results = filterCities(mockCities, filters);

        expect(results.every(city =>
          city.avgMonthlyCost > 1000000 &&
          city.avgMonthlyCost <= 1500000 &&
          city.cafeCount >= 5
        )).toBe(true);
      });
    });

    it('빈 도시 목록은 빈 배열을 반환한다', () => {
      const results = filterCities([], defaultFilters);
      expect(results).toEqual([]);
    });
  });

  describe('isDefaultFilters', () => {
    it('기본 필터는 true를 반환한다', () => {
      expect(isDefaultFilters(defaultFilters)).toBe(true);
    });

    it('budget이 변경되면 false를 반환한다', () => {
      const filters: HomeFilters = { ...defaultFilters, budget: 'mid' };
      expect(isDefaultFilters(filters)).toBe(false);
    });

    it('region이 변경되면 false를 반환한다', () => {
      const filters: HomeFilters = { ...defaultFilters, region: 'seoul' };
      expect(isDefaultFilters(filters)).toBe(false);
    });

    it('environment이 변경되면 false를 반환한다', () => {
      const filters: HomeFilters = { ...defaultFilters, environment: 'urban' };
      expect(isDefaultFilters(filters)).toBe(false);
    });

    it('season이 변경되면 false를 반환한다', () => {
      const filters: HomeFilters = { ...defaultFilters, season: 'summer' };
      expect(isDefaultFilters(filters)).toBe(false);
    });

    it('amenity가 변경되면 false를 반환한다', () => {
      const filters: HomeFilters = { ...defaultFilters, amenity: 'cafe' };
      expect(isDefaultFilters(filters)).toBe(false);
    });
  });

  describe('getActiveFilterCount', () => {
    it('기본 필터는 0을 반환한다', () => {
      expect(getActiveFilterCount(defaultFilters)).toBe(0);
    });

    it('하나의 필터가 활성화되면 1을 반환한다', () => {
      const filters: HomeFilters = { ...defaultFilters, budget: 'mid' };
      expect(getActiveFilterCount(filters)).toBe(1);
    });

    it('두 개의 필터가 활성화되면 2를 반환한다', () => {
      const filters: HomeFilters = {
        ...defaultFilters,
        budget: 'mid',
        region: 'seoul',
      };
      expect(getActiveFilterCount(filters)).toBe(2);
    });

    it('모든 필터가 활성화되면 5를 반환한다', () => {
      const filters: HomeFilters = {
        budget: 'mid',
        region: 'seoul',
        environment: 'urban',
        season: 'summer',
        amenity: 'cafe',
      };
      expect(getActiveFilterCount(filters)).toBe(5);
    });
  });
});
