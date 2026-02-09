import { useEffect, RefObject } from 'react';

/**
 * 지정된 ref 외부 클릭을 감지하는 훅
 * @param ref - 감지할 요소의 ref
 * @param handler - 외부 클릭 시 실행할 핸들러
 */
export function useClickOutside<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T | null>,
  handler: (event: MouseEvent | TouchEvent) => void
): void {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      const el = ref.current;

      // ref가 없거나, 클릭한 요소가 ref 내부인 경우 무시
      if (!el || el.contains(event.target as Node)) {
        return;
      }

      // 외부 클릭 시 핸들러 실행
      handler(event);
    };

    // 이벤트 리스너 등록 (캡처 단계에서 처리)
    document.addEventListener('mousedown', listener, true);
    document.addEventListener('touchstart', listener, true);

    // 클린업: 언마운트 시 이벤트 리스너 제거
    return () => {
      document.removeEventListener('mousedown', listener, true);
      document.removeEventListener('touchstart', listener, true);
    };
  }, [ref, handler]);
}
