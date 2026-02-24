import { describe, it, expect } from 'vitest';
import { scoreSearchResult, searchCities } from './search';
import { mockCities, mockCity, createMockCity } from '@/test/fixtures/cities';

describe('search', () => {
  describe('scoreSearchResult', () => {
    it('완전 일치 시 최고 점수를 부여한다', () => {
      const city = createMockCity({ name: '서울', region: '서울특별시' });
      const score = scoreSearchResult(city, '서울');

      // 완전 일치(100) + 시작 일치(50) + 포함(20) + 평점 보너스 + 리뷰 보너스
      expect(score).toBeGreaterThan(150);
    });

    it('지역 완전 일치 시 높은 점수를 부여한다', () => {
      const city = createMockCity({ name: '강남', region: '서울특별시' });
      const score = scoreSearchResult(city, '서울특별시');

      // 지역 완전 일치(80) + 지역 시작 일치(40) + 지역 포함(15) + 보너스
      expect(score).toBeGreaterThan(100);
    });

    it('시작 일치 시 중간 점수를 부여한다', () => {
      const city = createMockCity({ name: '서울시', region: '서울특별시' });
      const score = scoreSearchResult(city, '서울');

      // 시작 일치(50) + 포함(20) + 지역 포함(15) + 보너스
      expect(score).toBeGreaterThan(50);
    });

    it('포함만 되는 경우 낮은 점수를 부여한다', () => {
      const city = createMockCity({ name: '수원시', region: '경기도' });
      const scoreContained = scoreSearchResult(city, '수원');
      const scoreNotContained = scoreSearchResult(city, '부산');

      expect(scoreContained).toBeGreaterThan(scoreNotContained);
    });

    it('평점이 높을수록 보너스 점수가 높다', () => {
      const highRatedCity = createMockCity({ avgRating: 5, reviewCount: 10 });
      const lowRatedCity = createMockCity({ avgRating: 2, reviewCount: 10 });

      const highScore = scoreSearchResult(highRatedCity, highRatedCity.name);
      const lowScore = scoreSearchResult(lowRatedCity, lowRatedCity.name);

      expect(highScore).toBeGreaterThan(lowScore);
    });

    it('리뷰 수가 많을수록 보너스 점수가 높다', () => {
      const manyReviewsCity = createMockCity({ avgRating: 4, reviewCount: 100 });
      const fewReviewsCity = createMockCity({ avgRating: 4, reviewCount: 1 });

      const manyScore = scoreSearchResult(manyReviewsCity, manyReviewsCity.name);
      const fewScore = scoreSearchResult(fewReviewsCity, fewReviewsCity.name);

      expect(manyScore).toBeGreaterThan(fewScore);
    });

    it('한글 정규화가 적용된다 (공백 제거, 소문자)', () => {
      const city = createMockCity({ name: '서 울', region: '서울특별시' });
      const scoreWithSpace = scoreSearchResult(city, '서울');
      const scoreNoSpace = scoreSearchResult(city, '서 울');

      // 공백이 제거되어 동일한 점수가 나와야 함
      expect(scoreWithSpace).toBe(scoreNoSpace);
    });
  });

  describe('searchCities', () => {
    it('빈 검색어는 빈 배열을 반환한다', () => {
      expect(searchCities(mockCities, '')).toEqual([]);
      expect(searchCities(mockCities, '   ')).toEqual([]);
    });

    it('특수문자만 있는 검색어는 빈 배열을 반환한다', () => {
      expect(searchCities(mockCities, '!!!')).toEqual([]);
      expect(searchCities(mockCities, '###')).toEqual([]);
    });

    it('도시 이름으로 검색할 수 있다', () => {
      const results = searchCities(mockCities, '서울');

      expect(results.length).toBeGreaterThan(0);
      expect(results[0].name).toBe('서울');
    });

    it('지역으로 검색할 수 있다', () => {
      const results = searchCities(mockCities, '강원');

      expect(results.length).toBeGreaterThan(0);
      expect(results.some(city => city.region.includes('강원'))).toBe(true);
    });

    it('부분 문자열로 검색할 수 있다', () => {
      const results = searchCities(mockCities, '울');

      // '서울'이 포함되어야 함
      expect(results.some(city => city.name.includes('울'))).toBe(true);
    });

    it('결과가 관련도 점수 순으로 정렬된다', () => {
      const cities = [
        createMockCity({ id: '1', name: '서울', avgRating: 4.0, reviewCount: 10 }),
        createMockCity({ id: '2', name: '서울특별시', avgRating: 5.0, reviewCount: 100 }),
        createMockCity({ id: '3', name: '신서울', avgRating: 3.0, reviewCount: 5 }),
      ];

      const results = searchCities(cities, '서울');

      // 완전 일치인 '서울'이 가장 먼저 나와야 함
      expect(results[0].name).toBe('서울');
    });

    it('매칭되지 않는 검색어는 빈 배열을 반환한다', () => {
      const results = searchCities(mockCities, '존재하지않는도시');

      expect(results).toEqual([]);
    });

    it('대소문자 구분 없이 검색한다', () => {
      const cities = [
        createMockCity({ name: 'Seoul', region: 'Korea' }),
      ];

      const resultsLower = searchCities(cities, 'seoul');
      const resultsUpper = searchCities(cities, 'SEOUL');

      expect(resultsLower.length).toBe(1);
      expect(resultsUpper.length).toBe(1);
    });

    it('빈 도시 목록에서는 빈 배열을 반환한다', () => {
      const results = searchCities([], '서울');

      expect(results).toEqual([]);
    });
  });
});
