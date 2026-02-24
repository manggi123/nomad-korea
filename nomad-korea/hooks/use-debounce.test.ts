import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDebounce } from './use-debounce';

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('초기값을 즉시 반환한다', () => {
    const { result } = renderHook(() => useDebounce('initial', 300));

    expect(result.current).toBe('initial');
  });

  it('지연 시간 이전에는 값이 변경되지 않는다', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 300 } }
    );

    rerender({ value: 'updated', delay: 300 });

    // 200ms 경과 (지연 시간 이전)
    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(result.current).toBe('initial');
  });

  it('지연 시간 이후에 값이 변경된다', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 300 } }
    );

    rerender({ value: 'updated', delay: 300 });

    // 300ms 경과 (지연 시간 이후)
    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current).toBe('updated');
  });

  it('기본 지연 시간은 300ms이다', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value),
      { initialProps: { value: 'initial' } }
    );

    rerender({ value: 'updated' });

    // 299ms 경과
    act(() => {
      vi.advanceTimersByTime(299);
    });
    expect(result.current).toBe('initial');

    // 1ms 더 경과 (총 300ms)
    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(result.current).toBe('updated');
  });

  it('연속된 변경 시 마지막 값만 반영된다', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 300 } }
    );

    // 여러 번 연속 변경
    rerender({ value: 'first', delay: 300 });
    act(() => {
      vi.advanceTimersByTime(100);
    });

    rerender({ value: 'second', delay: 300 });
    act(() => {
      vi.advanceTimersByTime(100);
    });

    rerender({ value: 'third', delay: 300 });
    act(() => {
      vi.advanceTimersByTime(100);
    });

    // 아직 값이 변경되지 않음
    expect(result.current).toBe('initial');

    // 마지막 변경 후 300ms 경과
    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(result.current).toBe('third');
  });

  it('다양한 타입의 값을 처리한다', () => {
    // 숫자
    const { result: numberResult, rerender: numberRerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 0, delay: 300 } }
    );

    numberRerender({ value: 42, delay: 300 });
    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(numberResult.current).toBe(42);

    // 객체
    const { result: objectResult, rerender: objectRerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: { name: 'test' }, delay: 300 } }
    );

    objectRerender({ value: { name: 'updated' }, delay: 300 });
    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(objectResult.current).toEqual({ name: 'updated' });

    // 배열
    const { result: arrayResult, rerender: arrayRerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: [1, 2, 3], delay: 300 } }
    );

    arrayRerender({ value: [4, 5, 6], delay: 300 });
    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(arrayResult.current).toEqual([4, 5, 6]);
  });

  it('지연 시간이 변경되면 새 지연 시간이 적용된다', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 500 } }
    );

    // 지연 시간을 100ms로 변경하고 값도 변경
    rerender({ value: 'updated', delay: 100 });

    // 100ms 경과
    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(result.current).toBe('updated');
  });

  it('컴포넌트 언마운트 시 타이머가 정리된다', () => {
    const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');

    const { unmount, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 300 } }
    );

    rerender({ value: 'updated', delay: 300 });
    unmount();

    expect(clearTimeoutSpy).toHaveBeenCalled();
    clearTimeoutSpy.mockRestore();
  });

  it('null과 undefined 값을 처리한다', () => {
    const { result: nullResult, rerender: nullRerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: null as string | null, delay: 300 } }
    );

    nullRerender({ value: 'updated', delay: 300 });
    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(nullResult.current).toBe('updated');

    const { result: undefinedResult, rerender: undefinedRerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: undefined as string | undefined, delay: 300 } }
    );

    undefinedRerender({ value: 'updated', delay: 300 });
    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(undefinedResult.current).toBe('updated');
  });
});
