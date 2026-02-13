import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSearch } from './use-search';
import { mockCities } from '@/test/fixtures/cities';

// Supabase 클라이언트 모킹
const mockSelect = vi.fn();
const mockOr = vi.fn();
const mockOrder = vi.fn();
const mockLimit = vi.fn();

vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    from: () => ({
      select: mockSelect,
    }),
  }),
}));

// type-transformers 모킹
vi.mock('@/lib/utils/type-transformers', () => ({
  transformDbCitiesToCities: vi.fn((data) => data),
}));

describe('useSearch', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();

    // 체이닝 메서드 설정
    mockSelect.mockReturnValue({ or: mockOr });
    mockOr.mockReturnValue({ order: mockOrder });
    mockOrder.mockReturnValue({ limit: mockLimit });
    mockLimit.mockResolvedValue({ data: [], error: null });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('초기 상태', () => {
    it('초기 상태가 올바르게 설정된다', () => {
      const { result } = renderHook(() => useSearch());

      expect(result.current.query).toBe('');
      expect(result.current.results).toEqual([]);
      expect(result.current.isOpen).toBe(false);
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('검색어 입력', () => {
    it('setQuery로 검색어를 설정할 수 있다', () => {
      const { result } = renderHook(() => useSearch());

      act(() => {
        result.current.setQuery('서울');
      });

      expect(result.current.query).toBe('서울');
    });

    it('검색어 변경 시 로딩 상태가 true가 된다', () => {
      const { result } = renderHook(() => useSearch());

      act(() => {
        result.current.setQuery('서울');
      });

      // 디바운싱 중이므로 isLoading이 true
      expect(result.current.isLoading).toBe(true);
    });
  });

  describe('디바운싱', () => {
    it('300ms 디바운싱이 적용된다', async () => {
      const { result } = renderHook(() => useSearch());

      act(() => {
        result.current.setQuery('서울');
      });

      // 200ms 경과 - 아직 검색 안됨
      act(() => {
        vi.advanceTimersByTime(200);
      });

      expect(mockSelect).not.toHaveBeenCalled();

      // 100ms 더 경과 (총 300ms) - 검색 실행
      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      expect(mockSelect).toHaveBeenCalled();
    });

    it('연속 입력 시 마지막 검색어만 검색한다', async () => {
      const { result } = renderHook(() => useSearch());

      act(() => {
        result.current.setQuery('서');
      });
      act(() => {
        vi.advanceTimersByTime(100);
      });

      act(() => {
        result.current.setQuery('서울');
      });
      act(() => {
        vi.advanceTimersByTime(100);
      });

      act(() => {
        result.current.setQuery('서울시');
      });

      // 300ms 경과
      await act(async () => {
        vi.advanceTimersByTime(300);
      });

      // 마지막 검색어로만 검색
      expect(mockOr).toHaveBeenCalledWith(
        expect.stringContaining('서울시')
      );
    });
  });

  describe('검색 결과', () => {
    it('검색 결과가 반환된다', async () => {
      mockLimit.mockResolvedValueOnce({ data: mockCities.slice(0, 2), error: null });

      const { result } = renderHook(() => useSearch());

      act(() => {
        result.current.setQuery('서울');
      });

      await act(async () => {
        vi.advanceTimersByTime(300);
        await Promise.resolve(); // 비동기 처리 대기
      });

      expect(result.current.results.length).toBe(2);
    });

    it('빈 검색어는 빈 결과를 반환한다', async () => {
      const { result } = renderHook(() => useSearch());

      act(() => {
        result.current.setQuery('서울');
      });

      await act(async () => {
        vi.advanceTimersByTime(300);
      });

      // 검색어 삭제
      act(() => {
        result.current.setQuery('');
      });

      await act(async () => {
        vi.advanceTimersByTime(300);
      });

      expect(result.current.results).toEqual([]);
    });

    it('공백만 있는 검색어는 검색하지 않는다', async () => {
      const { result } = renderHook(() => useSearch());

      act(() => {
        result.current.setQuery('   ');
      });

      await act(async () => {
        vi.advanceTimersByTime(300);
      });

      expect(mockSelect).not.toHaveBeenCalled();
      expect(result.current.results).toEqual([]);
    });
  });

  describe('에러 처리', () => {
    it('검색 에러 시 빈 결과를 반환한다', async () => {
      mockLimit.mockResolvedValueOnce({
        data: null,
        error: new Error('Search failed'),
      });

      const { result } = renderHook(() => useSearch());

      act(() => {
        result.current.setQuery('서울');
      });

      await act(async () => {
        vi.advanceTimersByTime(300);
        await Promise.resolve(); // 비동기 처리 대기
      });

      expect(result.current.results).toEqual([]);
    });
  });

  describe('isOpen 상태', () => {
    it('setIsOpen으로 열림 상태를 변경할 수 있다', () => {
      const { result } = renderHook(() => useSearch());

      act(() => {
        result.current.setIsOpen(true);
      });

      expect(result.current.isOpen).toBe(true);

      act(() => {
        result.current.setIsOpen(false);
      });

      expect(result.current.isOpen).toBe(false);
    });
  });

  describe('isLoading 상태', () => {
    it('디바운싱 중일 때 isLoading이 true이다', () => {
      const { result } = renderHook(() => useSearch());

      act(() => {
        result.current.setQuery('서울');
      });

      expect(result.current.isLoading).toBe(true);
    });

    it('검색 완료 후 isLoading이 false가 된다', async () => {
      mockLimit.mockResolvedValueOnce({ data: [], error: null });

      const { result } = renderHook(() => useSearch());

      act(() => {
        result.current.setQuery('서울');
      });

      await act(async () => {
        vi.advanceTimersByTime(300);
        await Promise.resolve(); // 비동기 처리 대기
      });

      expect(result.current.isLoading).toBe(false);
    });
  });
});
