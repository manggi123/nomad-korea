import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useHomeFilters } from './use-home-filters';

// Next.js navigation 모킹
const mockPush = vi.fn();
const mockPathname = '/';
let mockSearchParams = new URLSearchParams();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    prefetch: vi.fn(),
    refresh: vi.fn(),
  }),
  usePathname: () => mockPathname,
  useSearchParams: () => mockSearchParams,
}));

describe('useHomeFilters', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSearchParams = new URLSearchParams();
  });

  describe('초기 상태', () => {
    it('URL에 파라미터가 없으면 기본 필터를 반환한다', () => {
      const { result } = renderHook(() => useHomeFilters());

      expect(result.current.filters).toEqual({
        budget: 'all',
        region: 'all',
        environment: 'all',
        season: 'all',
        amenity: 'all',
      });
    });

    it('URL 파라미터에서 필터 값을 읽는다', () => {
      mockSearchParams = new URLSearchParams({
        budget: 'mid',
        region: 'seoul',
      });

      const { result } = renderHook(() => useHomeFilters());

      expect(result.current.filters.budget).toBe('mid');
      expect(result.current.filters.region).toBe('seoul');
      expect(result.current.filters.environment).toBe('all');
    });

    it('hasActiveFilters가 올바르게 계산된다', () => {
      const { result: defaultResult } = renderHook(() => useHomeFilters());
      expect(defaultResult.current.hasActiveFilters).toBe(false);

      mockSearchParams = new URLSearchParams({ budget: 'mid' });
      const { result: activeResult } = renderHook(() => useHomeFilters());
      expect(activeResult.current.hasActiveFilters).toBe(true);
    });

    it('activeFilterCount가 올바르게 계산된다', () => {
      const { result: defaultResult } = renderHook(() => useHomeFilters());
      expect(defaultResult.current.activeFilterCount).toBe(0);

      mockSearchParams = new URLSearchParams({
        budget: 'mid',
        region: 'seoul',
        environment: 'urban',
      });
      const { result: activeResult } = renderHook(() => useHomeFilters());
      expect(activeResult.current.activeFilterCount).toBe(3);
    });
  });

  describe('setBudget', () => {
    it('budget 필터를 업데이트한다', () => {
      const { result } = renderHook(() => useHomeFilters());

      act(() => {
        result.current.setBudget('mid');
      });

      expect(mockPush).toHaveBeenCalledWith('/?budget=mid', { scroll: false });
    });

    it('budget이 "all"이면 파라미터를 제거한다', () => {
      mockSearchParams = new URLSearchParams({ budget: 'mid' });
      const { result } = renderHook(() => useHomeFilters());

      act(() => {
        result.current.setBudget('all');
      });

      expect(mockPush).toHaveBeenCalledWith('/', { scroll: false });
    });
  });

  describe('setRegion', () => {
    it('region 필터를 업데이트한다', () => {
      const { result } = renderHook(() => useHomeFilters());

      act(() => {
        result.current.setRegion('seoul');
      });

      expect(mockPush).toHaveBeenCalledWith('/?region=seoul', { scroll: false });
    });
  });

  describe('setEnvironment', () => {
    it('environment 필터를 업데이트한다', () => {
      const { result } = renderHook(() => useHomeFilters());

      act(() => {
        result.current.setEnvironment('urban');
      });

      expect(mockPush).toHaveBeenCalledWith('/?environment=urban', { scroll: false });
    });
  });

  describe('setSeason', () => {
    it('season 필터를 업데이트한다', () => {
      const { result } = renderHook(() => useHomeFilters());

      act(() => {
        result.current.setSeason('summer');
      });

      expect(mockPush).toHaveBeenCalledWith('/?season=summer', { scroll: false });
    });
  });

  describe('setAmenity', () => {
    it('amenity 필터를 업데이트한다', () => {
      const { result } = renderHook(() => useHomeFilters());

      act(() => {
        result.current.setAmenity('cafe');
      });

      expect(mockPush).toHaveBeenCalledWith('/?amenity=cafe', { scroll: false });
    });
  });

  describe('resetFilters', () => {
    it('모든 필터를 초기화한다', () => {
      mockSearchParams = new URLSearchParams({
        budget: 'mid',
        region: 'seoul',
        environment: 'urban',
      });
      const { result } = renderHook(() => useHomeFilters());

      act(() => {
        result.current.resetFilters();
      });

      expect(mockPush).toHaveBeenCalledWith('/', { scroll: false });
    });
  });

  describe('복합 필터 업데이트', () => {
    it('기존 필터를 유지하면서 새 필터를 추가한다', () => {
      mockSearchParams = new URLSearchParams({ budget: 'mid' });
      const { result } = renderHook(() => useHomeFilters());

      act(() => {
        result.current.setRegion('seoul');
      });

      expect(mockPush).toHaveBeenCalledWith(
        expect.stringContaining('budget=mid'),
        { scroll: false }
      );
      expect(mockPush).toHaveBeenCalledWith(
        expect.stringContaining('region=seoul'),
        { scroll: false }
      );
    });
  });
});
