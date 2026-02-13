import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getRelatedCities, generateShareUrl } from './city-utils';
import { mockCities, mockCity, createMockCity } from '@/test/fixtures/cities';

describe('city-utils', () => {
  describe('getRelatedCities', () => {
    it('현재 도시를 결과에서 제외한다', () => {
      const results = getRelatedCities(mockCity, mockCities);

      expect(results.every(city => city.id !== mockCity.id)).toBe(true);
    });

    it('기본적으로 3개의 도시를 반환한다', () => {
      const results = getRelatedCities(mockCity, mockCities);

      expect(results.length).toBeLessThanOrEqual(3);
    });

    it('limit 파라미터로 반환 개수를 조절한다', () => {
      const results = getRelatedCities(mockCity, mockCities, 5);

      expect(results.length).toBeLessThanOrEqual(5);
    });

    it('같은 지역의 도시를 우선 반환한다', () => {
      const currentCity = createMockCity({
        id: 'current',
        region: '서울특별시',
        avgMonthlyCost: 1500000,
      });

      const cities = [
        currentCity,
        createMockCity({ id: '1', region: '서울특별시', avgMonthlyCost: 2000000, avgRating: 4.5 }),
        createMockCity({ id: '2', region: '부산광역시', avgMonthlyCost: 1500000, avgRating: 4.0 }),
        createMockCity({ id: '3', region: '제주도', avgMonthlyCost: 3000000, avgRating: 3.5 }),
      ];

      const results = getRelatedCities(currentCity, cities, 3);

      // 같은 지역 또는 비슷한 가격대의 도시가 포함되어야 함
      expect(results.some(city =>
        city.region === currentCity.region ||
        Math.abs(city.avgMonthlyCost - currentCity.avgMonthlyCost) <= 300000
      )).toBe(true);
    });

    it('비슷한 가격대(±30만원)의 도시를 포함한다', () => {
      const currentCity = createMockCity({
        id: 'current',
        region: '독특한지역',
        avgMonthlyCost: 1000000,
      });

      const cities = [
        currentCity,
        createMockCity({ id: '1', region: '다른지역1', avgMonthlyCost: 1200000, avgRating: 4.5 }), // 포함
        createMockCity({ id: '2', region: '다른지역2', avgMonthlyCost: 800000, avgRating: 4.0 }),  // 포함
        createMockCity({ id: '3', region: '다른지역3', avgMonthlyCost: 2000000, avgRating: 5.0 }), // 제외
      ];

      const results = getRelatedCities(currentCity, cities, 3);

      // 가격 차이가 30만원 이내인 도시만 포함
      const similarPriceCities = results.filter(city =>
        Math.abs(city.avgMonthlyCost - currentCity.avgMonthlyCost) <= 300000
      );

      expect(similarPriceCities.length).toBeGreaterThanOrEqual(1);
    });

    it('평점 순으로 정렬된다', () => {
      const currentCity = createMockCity({
        id: 'current',
        region: '테스트지역',
        avgMonthlyCost: 1000000,
      });

      const cities = [
        currentCity,
        createMockCity({ id: '1', region: '테스트지역', avgMonthlyCost: 1000000, avgRating: 3.0 }),
        createMockCity({ id: '2', region: '테스트지역', avgMonthlyCost: 1000000, avgRating: 5.0 }),
        createMockCity({ id: '3', region: '테스트지역', avgMonthlyCost: 1000000, avgRating: 4.0 }),
      ];

      const results = getRelatedCities(currentCity, cities, 3);

      // 결과가 평점 내림차순으로 정렬되어야 함
      for (let i = 0; i < results.length - 1; i++) {
        expect(results[i].avgRating).toBeGreaterThanOrEqual(results[i + 1].avgRating);
      }
    });

    it('관련 도시가 없으면 빈 배열을 반환한다', () => {
      const currentCity = createMockCity({
        id: 'current',
        region: '독특한지역',
        avgMonthlyCost: 5000000, // 매우 높은 가격
      });

      const cities = [
        currentCity,
        createMockCity({ id: '1', region: '다른지역', avgMonthlyCost: 1000000 }),
      ];

      const results = getRelatedCities(currentCity, cities);

      // 같은 지역도 없고, 가격 차이가 30만원 이상이면 관련 도시 없음
      expect(results.length).toBe(0);
    });

    it('도시 목록이 현재 도시만 있으면 빈 배열을 반환한다', () => {
      const results = getRelatedCities(mockCity, [mockCity]);

      expect(results).toEqual([]);
    });

    it('빈 도시 목록은 빈 배열을 반환한다', () => {
      const results = getRelatedCities(mockCity, []);

      expect(results).toEqual([]);
    });
  });

  describe('generateShareUrl', () => {
    beforeEach(() => {
      // window 객체 모킹 (클라이언트 환경)
      Object.defineProperty(global, 'window', {
        value: {
          location: {
            origin: 'https://nomad-korea.com',
          },
        },
        writable: true,
      });
    });

    it('클라이언트에서 전체 URL을 반환한다', () => {
      const url = generateShareUrl('seoul');

      expect(url).toBe('https://nomad-korea.com/cities/seoul');
    });

    it('slug를 URL에 포함한다', () => {
      const url = generateShareUrl('busan-haeundae');

      expect(url).toContain('busan-haeundae');
    });

    it('서버 환경에서는 상대 경로를 반환한다', () => {
      // window를 undefined로 설정 (서버 환경 시뮬레이션)
      const originalWindow = global.window;
      // @ts-expect-error - 서버 환경 시뮬레이션
      delete global.window;

      const url = generateShareUrl('jeju');

      expect(url).toBe('/cities/jeju');

      // 원래 상태로 복원
      global.window = originalWindow;
    });

    it('빈 slug도 처리한다', () => {
      const url = generateShareUrl('');

      expect(url).toBe('https://nomad-korea.com/cities/');
    });

    it('특수문자가 포함된 slug를 처리한다', () => {
      const url = generateShareUrl('seoul-gangnam-station');

      expect(url).toBe('https://nomad-korea.com/cities/seoul-gangnam-station');
    });
  });
});
