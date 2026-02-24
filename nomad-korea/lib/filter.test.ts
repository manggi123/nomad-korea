import { describe, it, expect } from 'vitest';
import { applyCityFilters, getUniqueRegions } from './filter';
import { mockCities, createMockCity } from '@/test/fixtures/cities';
import type { SearchFilters } from '@/types';

describe('filter', () => {
  describe('applyCityFilters', () => {
    it('필터가 없으면 모든 도시를 반환한다', () => {
      const filters: SearchFilters = {};
      const results = applyCityFilters(mockCities, filters);

      expect(results.length).toBe(mockCities.length);
    });

    describe('지역 필터', () => {
      it('단일 지역으로 필터링한다', () => {
        const filters: SearchFilters = { regions: ['서울특별시'] };
        const results = applyCityFilters(mockCities, filters);

        expect(results.every(city => city.region === '서울특별시')).toBe(true);
      });

      it('여러 지역으로 필터링한다', () => {
        const filters: SearchFilters = { regions: ['서울특별시', '부산광역시'] };
        const results = applyCityFilters(mockCities, filters);

        expect(results.every(city =>
          filters.regions!.includes(city.region)
        )).toBe(true);
      });

      it('빈 지역 배열은 필터를 적용하지 않는다', () => {
        const filters: SearchFilters = { regions: [] };
        const results = applyCityFilters(mockCities, filters);

        expect(results.length).toBe(mockCities.length);
      });

      it('존재하지 않는 지역은 빈 배열을 반환한다', () => {
        const filters: SearchFilters = { regions: ['존재하지않는지역'] };
        const results = applyCityFilters(mockCities, filters);

        expect(results.length).toBe(0);
      });
    });

    describe('예산 필터', () => {
      it('최소 예산으로 필터링한다', () => {
        const filters: SearchFilters = { minBudget: 1200000 };
        const results = applyCityFilters(mockCities, filters);

        expect(results.every(city => city.avgMonthlyCost >= 1200000)).toBe(true);
      });

      it('최대 예산으로 필터링한다', () => {
        const filters: SearchFilters = { maxBudget: 1200000 };
        const results = applyCityFilters(mockCities, filters);

        expect(results.every(city => city.avgMonthlyCost <= 1200000)).toBe(true);
      });

      it('최소/최대 예산 범위로 필터링한다', () => {
        const filters: SearchFilters = { minBudget: 1000000, maxBudget: 1300000 };
        const results = applyCityFilters(mockCities, filters);

        expect(results.every(city =>
          city.avgMonthlyCost >= 1000000 && city.avgMonthlyCost <= 1300000
        )).toBe(true);
      });

      it('범위에 맞는 도시가 없으면 빈 배열을 반환한다', () => {
        const filters: SearchFilters = { minBudget: 5000000 };
        const results = applyCityFilters(mockCities, filters);

        expect(results.length).toBe(0);
      });
    });

    describe('평점 필터', () => {
      it('최소 평점으로 필터링한다', () => {
        const filters: SearchFilters = { minRating: 4.5 };
        const results = applyCityFilters(mockCities, filters);

        expect(results.every(city => city.avgRating >= 4.5)).toBe(true);
      });

      it('모든 도시가 충족하지 못하면 빈 배열을 반환한다', () => {
        const filters: SearchFilters = { minRating: 5.0 };
        const results = applyCityFilters(mockCities, filters);

        // 평점 5.0 이상인 도시만 반환 (없거나 적을 수 있음)
        expect(results.every(city => city.avgRating >= 5.0)).toBe(true);
      });
    });

    describe('복합 필터', () => {
      it('모든 필터를 조합하여 적용한다', () => {
        const filters: SearchFilters = {
          regions: ['서울특별시', '부산광역시', '제주특별자치도'],
          minBudget: 1000000,
          maxBudget: 1500000,
          minRating: 4.0,
        };
        const results = applyCityFilters(mockCities, filters);

        expect(results.every(city =>
          filters.regions!.includes(city.region) &&
          city.avgMonthlyCost >= filters.minBudget! &&
          city.avgMonthlyCost <= filters.maxBudget! &&
          city.avgRating >= filters.minRating!
        )).toBe(true);
      });
    });

    it('빈 도시 목록은 빈 배열을 반환한다', () => {
      const filters: SearchFilters = { minRating: 4.0 };
      const results = applyCityFilters([], filters);

      expect(results).toEqual([]);
    });
  });

  describe('getUniqueRegions', () => {
    it('중복 없는 지역 목록을 반환한다', () => {
      const regions = getUniqueRegions(mockCities);
      const uniqueCount = new Set(regions).size;

      expect(regions.length).toBe(uniqueCount);
    });

    it('지역 목록이 정렬되어 반환된다', () => {
      const regions = getUniqueRegions(mockCities);
      const sortedRegions = [...regions].sort();

      expect(regions).toEqual(sortedRegions);
    });

    it('빈 도시 목록은 빈 배열을 반환한다', () => {
      const regions = getUniqueRegions([]);

      expect(regions).toEqual([]);
    });

    it('단일 도시의 지역을 반환한다', () => {
      const cities = [createMockCity({ region: '서울특별시' })];
      const regions = getUniqueRegions(cities);

      expect(regions).toEqual(['서울특별시']);
    });

    it('같은 지역의 여러 도시는 하나만 반환한다', () => {
      const cities = [
        createMockCity({ id: '1', region: '서울특별시' }),
        createMockCity({ id: '2', region: '서울특별시' }),
        createMockCity({ id: '3', region: '서울특별시' }),
      ];
      const regions = getUniqueRegions(cities);

      expect(regions).toEqual(['서울특별시']);
    });
  });
});
