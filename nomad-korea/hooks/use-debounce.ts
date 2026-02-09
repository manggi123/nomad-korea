import { useState, useEffect } from 'react';

/**
 * 입력값을 지정된 시간만큼 디바운싱하는 훅
 * @param value - 디바운싱할 값
 * @param delay - 지연 시간 (밀리초, 기본값: 300ms)
 * @returns 디바운싱된 값
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // 타이머 설정
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // 클린업: 다음 effect 실행 전 또는 언마운트 시 타이머 제거
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
