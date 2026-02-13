import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useRef } from 'react';
import { useClickOutside } from './use-click-outside';

describe('useClickOutside', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
    vi.clearAllMocks();
  });

  describe('외부 클릭 감지', () => {
    it('요소 외부 mousedown 이벤트가 핸들러를 호출해야 함', () => {
      const handler = vi.fn();

      const TestComponent = () => {
        const ref = useRef<HTMLDivElement>(null);
        useClickOutside(ref, handler);
        return <div ref={ref} data-testid="target" />;
      };

      // 컴포넌트 렌더링
      const { unmount } = renderHook(() => {
        const ref = useRef<HTMLDivElement>(document.createElement('div'));
        container.appendChild(ref.current);
        useClickOutside(ref, handler);
        return ref;
      });

      // 외부 클릭 시뮬레이션
      const event = new MouseEvent('mousedown', { bubbles: true });
      document.body.dispatchEvent(event);

      expect(handler).toHaveBeenCalledTimes(1);

      unmount();
    });

    it('요소 외부 touchstart 이벤트가 핸들러를 호출해야 함', () => {
      const handler = vi.fn();

      const { unmount } = renderHook(() => {
        const ref = useRef<HTMLDivElement>(document.createElement('div'));
        container.appendChild(ref.current);
        useClickOutside(ref, handler);
        return ref;
      });

      // 외부 터치 시뮬레이션
      const event = new TouchEvent('touchstart', { bubbles: true });
      document.body.dispatchEvent(event);

      expect(handler).toHaveBeenCalledTimes(1);

      unmount();
    });
  });

  describe('내부 클릭 무시', () => {
    it('요소 내부 클릭은 핸들러를 호출하지 않아야 함', () => {
      const handler = vi.fn();
      const targetElement = document.createElement('div');
      container.appendChild(targetElement);

      const { unmount } = renderHook(() => {
        const ref = useRef<HTMLDivElement>(targetElement);
        useClickOutside(ref, handler);
        return ref;
      });

      // 내부 클릭 시뮬레이션
      const event = new MouseEvent('mousedown', { bubbles: true });
      targetElement.dispatchEvent(event);

      expect(handler).not.toHaveBeenCalled();

      unmount();
    });

    it('요소 자식 클릭은 핸들러를 호출하지 않아야 함', () => {
      const handler = vi.fn();
      const targetElement = document.createElement('div');
      const childElement = document.createElement('span');
      targetElement.appendChild(childElement);
      container.appendChild(targetElement);

      const { unmount } = renderHook(() => {
        const ref = useRef<HTMLDivElement>(targetElement);
        useClickOutside(ref, handler);
        return ref;
      });

      // 자식 요소 클릭 시뮬레이션
      const event = new MouseEvent('mousedown', { bubbles: true });
      childElement.dispatchEvent(event);

      expect(handler).not.toHaveBeenCalled();

      unmount();
    });
  });

  describe('ref가 null인 경우', () => {
    it('ref가 null이면 핸들러를 호출하지 않아야 함', () => {
      const handler = vi.fn();

      const { unmount } = renderHook(() => {
        const ref = useRef<HTMLDivElement>(null);
        useClickOutside(ref, handler);
        return ref;
      });

      // 클릭 시뮬레이션
      const event = new MouseEvent('mousedown', { bubbles: true });
      document.body.dispatchEvent(event);

      expect(handler).not.toHaveBeenCalled();

      unmount();
    });
  });

  describe('이벤트 리스너 클린업', () => {
    it('언마운트 시 이벤트 리스너가 제거되어야 함', () => {
      const handler = vi.fn();
      const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');

      const targetElement = document.createElement('div');
      container.appendChild(targetElement);

      const { unmount } = renderHook(() => {
        const ref = useRef<HTMLDivElement>(targetElement);
        useClickOutside(ref, handler);
        return ref;
      });

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        'mousedown',
        expect.any(Function),
        true
      );
      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        'touchstart',
        expect.any(Function),
        true
      );

      removeEventListenerSpy.mockRestore();
    });

    it('클린업 후 이벤트가 핸들러를 호출하지 않아야 함', () => {
      const handler = vi.fn();
      const targetElement = document.createElement('div');
      container.appendChild(targetElement);

      const { unmount } = renderHook(() => {
        const ref = useRef<HTMLDivElement>(targetElement);
        useClickOutside(ref, handler);
        return ref;
      });

      unmount();

      // 언마운트 후 클릭 시뮬레이션
      const event = new MouseEvent('mousedown', { bubbles: true });
      document.body.dispatchEvent(event);

      expect(handler).not.toHaveBeenCalled();
    });
  });

  describe('이벤트 리스너 등록', () => {
    it('마운트 시 이벤트 리스너가 등록되어야 함', () => {
      const handler = vi.fn();
      const addEventListenerSpy = vi.spyOn(document, 'addEventListener');

      const targetElement = document.createElement('div');
      container.appendChild(targetElement);

      const { unmount } = renderHook(() => {
        const ref = useRef<HTMLDivElement>(targetElement);
        useClickOutside(ref, handler);
        return ref;
      });

      expect(addEventListenerSpy).toHaveBeenCalledWith(
        'mousedown',
        expect.any(Function),
        true
      );
      expect(addEventListenerSpy).toHaveBeenCalledWith(
        'touchstart',
        expect.any(Function),
        true
      );

      unmount();
      addEventListenerSpy.mockRestore();
    });
  });

  describe('핸들러 변경', () => {
    it('핸들러가 변경되면 새 핸들러가 호출되어야 함', () => {
      const handler1 = vi.fn();
      const handler2 = vi.fn();

      const targetElement = document.createElement('div');
      container.appendChild(targetElement);

      const { rerender, unmount } = renderHook(
        ({ handler }) => {
          const ref = useRef<HTMLDivElement>(targetElement);
          useClickOutside(ref, handler);
          return ref;
        },
        { initialProps: { handler: handler1 } }
      );

      // 첫 번째 클릭
      const event1 = new MouseEvent('mousedown', { bubbles: true });
      document.body.dispatchEvent(event1);
      expect(handler1).toHaveBeenCalledTimes(1);
      expect(handler2).not.toHaveBeenCalled();

      // 핸들러 변경
      rerender({ handler: handler2 });

      // 두 번째 클릭
      const event2 = new MouseEvent('mousedown', { bubbles: true });
      document.body.dispatchEvent(event2);
      expect(handler2).toHaveBeenCalledTimes(1);

      unmount();
    });
  });

  describe('캡처 단계에서 처리', () => {
    it('이벤트가 캡처 단계에서 처리되어야 함', () => {
      const handler = vi.fn();
      const addEventListenerSpy = vi.spyOn(document, 'addEventListener');

      const targetElement = document.createElement('div');
      container.appendChild(targetElement);

      const { unmount } = renderHook(() => {
        const ref = useRef<HTMLDivElement>(targetElement);
        useClickOutside(ref, handler);
        return ref;
      });

      // 세 번째 인자(useCapture)가 true인지 확인
      expect(addEventListenerSpy).toHaveBeenCalledWith(
        'mousedown',
        expect.any(Function),
        true // useCapture = true
      );
      expect(addEventListenerSpy).toHaveBeenCalledWith(
        'touchstart',
        expect.any(Function),
        true // useCapture = true
      );

      unmount();
      addEventListenerSpy.mockRestore();
    });
  });
});
