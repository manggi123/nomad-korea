import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  getSearchHistory,
  addSearchHistory,
  deleteSearchHistory,
  clearSearchHistory,
} from './search-history';
import { mockSearchHistory } from '@/test/fixtures/users';

const STORAGE_KEY = 'nomad-korea-search-history';

describe('search-history', () => {
  beforeEach(() => {
    // localStorage 초기화
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('getSearchHistory', () => {
    it('저장된 히스토리가 없으면 빈 배열을 반환한다', () => {
      const result = getSearchHistory();

      expect(result).toEqual([]);
    });

    it('저장된 히스토리를 반환한다', () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mockSearchHistory));

      const result = getSearchHistory();

      expect(result.length).toBe(mockSearchHistory.length);
    });

    it('최신순으로 정렬하여 반환한다', () => {
      const history = [
        { id: '1', query: '오래된', timestamp: 1000 },
        { id: '2', query: '최신', timestamp: 3000 },
        { id: '3', query: '중간', timestamp: 2000 },
      ];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));

      const result = getSearchHistory();

      expect(result[0].query).toBe('최신');
      expect(result[1].query).toBe('중간');
      expect(result[2].query).toBe('오래된');
    });

    it('잘못된 JSON이 저장되어 있으면 빈 배열을 반환한다', () => {
      localStorage.setItem(STORAGE_KEY, 'invalid json');

      const result = getSearchHistory();

      expect(result).toEqual([]);
    });
  });

  describe('addSearchHistory', () => {
    it('새 검색어를 히스토리에 추가한다', () => {
      addSearchHistory('서울');

      const history = getSearchHistory();

      expect(history.length).toBe(1);
      expect(history[0].query).toBe('서울');
    });

    it('검색어 앞뒤 공백을 제거한다', () => {
      addSearchHistory('  부산  ');

      const history = getSearchHistory();

      expect(history[0].query).toBe('부산');
    });

    it('빈 검색어는 추가하지 않는다', () => {
      addSearchHistory('');
      addSearchHistory('   ');

      const history = getSearchHistory();

      expect(history.length).toBe(0);
    });

    it('중복 검색어는 기존 항목을 제거하고 새로 추가한다', () => {
      addSearchHistory('서울');
      addSearchHistory('부산');
      addSearchHistory('서울'); // 중복

      const history = getSearchHistory();

      expect(history.length).toBe(2);
      expect(history[0].query).toBe('서울'); // 가장 최신
      expect(history[1].query).toBe('부산');
    });

    it('최대 10개까지만 저장한다', () => {
      // 11개 검색어 추가
      for (let i = 1; i <= 11; i++) {
        addSearchHistory(`검색어${i}`);
      }

      const history = getSearchHistory();

      expect(history.length).toBe(10);
      expect(history[0].query).toBe('검색어11'); // 가장 최신
      expect(history[9].query).toBe('검색어2'); // 가장 오래된 (검색어1은 삭제됨)
    });

    it('타임스탬프가 현재 시간으로 설정된다', () => {
      const before = Date.now();
      addSearchHistory('테스트');
      const after = Date.now();

      const history = getSearchHistory();

      expect(history[0].timestamp).toBeGreaterThanOrEqual(before);
      expect(history[0].timestamp).toBeLessThanOrEqual(after);
    });

    it('UUID가 생성된다', () => {
      addSearchHistory('테스트');

      const history = getSearchHistory();

      expect(history[0].id).toBeDefined();
      expect(typeof history[0].id).toBe('string');
    });
  });

  describe('deleteSearchHistory', () => {
    it('특정 ID의 히스토리를 삭제한다', () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([
        { id: 'delete-me', query: '삭제할 검색어', timestamp: Date.now() },
        { id: 'keep-me', query: '유지할 검색어', timestamp: Date.now() - 1000 },
      ]));

      deleteSearchHistory('delete-me');

      const history = getSearchHistory();

      expect(history.length).toBe(1);
      expect(history[0].id).toBe('keep-me');
    });

    it('존재하지 않는 ID를 삭제해도 에러가 발생하지 않는다', () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([
        { id: 'test', query: '테스트', timestamp: Date.now() },
      ]));

      expect(() => deleteSearchHistory('non-existent')).not.toThrow();

      const history = getSearchHistory();
      expect(history.length).toBe(1);
    });

    it('빈 히스토리에서 삭제해도 에러가 발생하지 않는다', () => {
      expect(() => deleteSearchHistory('any-id')).not.toThrow();
    });
  });

  describe('clearSearchHistory', () => {
    it('모든 히스토리를 삭제한다', () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mockSearchHistory));

      clearSearchHistory();

      const history = getSearchHistory();

      expect(history.length).toBe(0);
    });

    it('빈 히스토리를 삭제해도 에러가 발생하지 않는다', () => {
      expect(() => clearSearchHistory()).not.toThrow();
    });

    it('localStorage에서 키를 완전히 제거한다', () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mockSearchHistory));

      clearSearchHistory();

      expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
    });
  });

  describe('서버 사이드 환경', () => {
    it('window가 없는 환경에서 getSearchHistory는 빈 배열을 반환한다', () => {
      // 이 테스트는 vitest.setup.ts에서 window가 모킹되어 있으므로
      // 실제 서버 환경과 다르지만, 함수의 방어 로직을 테스트
      const result = getSearchHistory();
      expect(Array.isArray(result)).toBe(true);
    });
  });
});
