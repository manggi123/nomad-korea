import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useReviewForm } from './use-review-form';

// Supabase 모킹
const mockProfile = {
  id: 'user-1',
  username: 'testuser',
  avatar_url: '/avatars/user1.jpg',
  job_category: 'developer',
};

const mockAuthUser = {
  id: 'user-1',
  email: 'test@example.com',
};

const mockCreatedReview = {
  id: 'new-review-1',
  city_id: 'city-1',
  user_id: 'user-1',
  rating: 5,
  comment: '정말 좋은 도시입니다. 추천합니다!',
};

let mockGetUser = vi.fn();
let mockSelect = vi.fn();
let mockInsert = vi.fn();
let mockUpdate = vi.fn();

vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    auth: {
      getUser: mockGetUser,
    },
    from: vi.fn((table: string) => {
      if (table === 'profiles') {
        return {
          select: mockSelect,
          update: mockUpdate,
        };
      }
      return {};
    }),
  }),
}));

vi.mock('@/lib/supabase/mutations/reviews', () => ({
  createReview: vi.fn(() => Promise.resolve(mockCreatedReview)),
}));

describe('useReviewForm', () => {
  const defaultOptions = {
    cityId: 'city-1',
    cityName: '서울',
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // 기본 모킹 설정
    mockGetUser.mockResolvedValue({ data: { user: null }, error: null });
    mockSelect.mockReturnValue({
      eq: vi.fn().mockReturnValue({
        single: vi.fn().mockResolvedValue({ data: null, error: null }),
      }),
    });
    mockUpdate.mockReturnValue({
      eq: vi.fn().mockResolvedValue({ data: null, error: null }),
    });
    mockInsert.mockReturnValue({
      select: vi.fn().mockReturnValue({
        single: vi.fn().mockResolvedValue({ data: mockCreatedReview, error: null }),
      }),
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('초기 상태', () => {
    it('초기 상태 값이 올바르게 설정되어야 함', () => {
      const { result } = renderHook(() => useReviewForm(defaultOptions));

      expect(result.current.rating).toBe(0);
      expect(result.current.comment).toBe('');
      expect(result.current.jobCategory).toBe('');
      expect(result.current.errors).toEqual({});
      expect(result.current.isSubmitting).toBe(false);
      expect(result.current.isLoggedIn).toBe(false);
      expect(result.current.user).toBeNull();
    });

    it('로그인한 사용자의 프로필을 가져와야 함', async () => {
      mockGetUser.mockResolvedValue({ data: { user: mockAuthUser }, error: null });
      mockSelect.mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({ data: mockProfile, error: null }),
        }),
      });

      const { result } = renderHook(() => useReviewForm(defaultOptions));

      await waitFor(() => {
        expect(result.current.user).not.toBeNull();
      });

      expect(result.current.user?.id).toBe('user-1');
      expect(result.current.user?.username).toBe('testuser');
      expect(result.current.isLoggedIn).toBe(true);
    });

    it('로그인한 사용자의 직업군이 기본값으로 설정되어야 함', async () => {
      mockGetUser.mockResolvedValue({ data: { user: mockAuthUser }, error: null });
      mockSelect.mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({ data: mockProfile, error: null }),
        }),
      });

      const { result } = renderHook(() => useReviewForm(defaultOptions));

      await waitFor(() => {
        expect(result.current.jobCategory).toBe('developer');
      });
    });
  });

  describe('폼 필드 변경', () => {
    it('rating 변경이 동작해야 함', () => {
      const { result } = renderHook(() => useReviewForm(defaultOptions));

      act(() => {
        result.current.setRating(4);
      });

      expect(result.current.rating).toBe(4);
    });

    it('comment 변경이 동작해야 함', () => {
      const { result } = renderHook(() => useReviewForm(defaultOptions));

      act(() => {
        result.current.setComment('테스트 코멘트입니다.');
      });

      expect(result.current.comment).toBe('테스트 코멘트입니다.');
    });

    it('jobCategory 변경이 동작해야 함', () => {
      const { result } = renderHook(() => useReviewForm(defaultOptions));

      act(() => {
        result.current.setJobCategory('designer');
      });

      expect(result.current.jobCategory).toBe('designer');
    });

    it('여러 필드 연속 변경이 동작해야 함', () => {
      const { result } = renderHook(() => useReviewForm(defaultOptions));

      act(() => {
        result.current.setRating(5);
        result.current.setComment('좋은 도시입니다!');
        result.current.setJobCategory('developer');
      });

      expect(result.current.rating).toBe(5);
      expect(result.current.comment).toBe('좋은 도시입니다!');
      expect(result.current.jobCategory).toBe('developer');
    });
  });

  describe('resetForm', () => {
    it('폼을 초기 상태로 리셋해야 함', async () => {
      const { result } = renderHook(() => useReviewForm(defaultOptions));

      act(() => {
        result.current.setRating(5);
        result.current.setComment('테스트 코멘트');
        result.current.setJobCategory('designer');
      });

      act(() => {
        result.current.resetForm();
      });

      expect(result.current.rating).toBe(0);
      expect(result.current.comment).toBe('');
      expect(result.current.errors).toEqual({});
    });

    it('로그인한 사용자의 직업군으로 리셋해야 함', async () => {
      mockGetUser.mockResolvedValue({ data: { user: mockAuthUser }, error: null });
      mockSelect.mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({ data: mockProfile, error: null }),
        }),
      });

      const { result } = renderHook(() => useReviewForm(defaultOptions));

      await waitFor(() => {
        expect(result.current.user).not.toBeNull();
      });

      act(() => {
        result.current.setJobCategory('marketer');
      });

      act(() => {
        result.current.resetForm();
      });

      expect(result.current.jobCategory).toBe('developer');
    });
  });

  describe('getFieldError', () => {
    it('존재하지 않는 필드는 빈 문자열을 반환해야 함', () => {
      const { result } = renderHook(() => useReviewForm(defaultOptions));

      expect(result.current.getFieldError('nonexistent')).toBe('');
    });
  });

  describe('submitReview - 비로그인 상태', () => {
    it('비로그인 상태에서 제출하면 에러를 설정해야 함', async () => {
      const { result } = renderHook(() => useReviewForm(defaultOptions));

      act(() => {
        result.current.setRating(5);
        result.current.setComment('정말 좋은 도시입니다. 추천합니다!');
        result.current.setJobCategory('developer');
      });

      await act(async () => {
        await result.current.submitReview();
      });

      expect(result.current.errors.submit).toBe('리뷰를 작성하려면 로그인이 필요합니다.');
      expect(result.current.isSubmitting).toBe(false);
    });
  });

  describe('submitReview - 유효성 검사 실패', () => {
    it('유효성 검사 실패 시 에러를 설정해야 함', async () => {
      mockGetUser.mockResolvedValue({ data: { user: mockAuthUser }, error: null });
      mockSelect.mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({ data: mockProfile, error: null }),
        }),
      });

      const { result } = renderHook(() => useReviewForm(defaultOptions));

      await waitFor(() => {
        expect(result.current.user).not.toBeNull();
      });

      // 유효하지 않은 데이터로 제출 (짧은 코멘트)
      act(() => {
        result.current.setRating(5);
        result.current.setComment('짧음');
        result.current.setJobCategory('developer');
      });

      await act(async () => {
        await result.current.submitReview();
      });

      expect(Object.keys(result.current.errors).length).toBeGreaterThan(0);
      expect(result.current.isSubmitting).toBe(false);
    });

    it('rating이 0이면 유효성 검사 실패', async () => {
      mockGetUser.mockResolvedValue({ data: { user: mockAuthUser }, error: null });
      mockSelect.mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({ data: mockProfile, error: null }),
        }),
      });

      const { result } = renderHook(() => useReviewForm(defaultOptions));

      await waitFor(() => {
        expect(result.current.user).not.toBeNull();
      });

      act(() => {
        result.current.setComment('충분히 긴 코멘트입니다. 테스트용.');
        result.current.setJobCategory('developer');
        // rating은 0으로 유지
      });

      await act(async () => {
        await result.current.submitReview();
      });

      expect(Object.keys(result.current.errors).length).toBeGreaterThan(0);
    });
  });

  describe('submitReview - 성공', () => {
    it('성공 시 onSuccess 콜백을 호출해야 함', async () => {
      const onSuccess = vi.fn();
      mockGetUser.mockResolvedValue({ data: { user: mockAuthUser }, error: null });
      mockSelect.mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({ data: mockProfile, error: null }),
        }),
      });

      const { result } = renderHook(() =>
        useReviewForm({
          ...defaultOptions,
          onSuccess,
        })
      );

      await waitFor(() => {
        expect(result.current.user).not.toBeNull();
      });

      act(() => {
        result.current.setRating(5);
        result.current.setComment('정말 좋은 도시입니다. 추천합니다!');
        result.current.setJobCategory('developer');
      });

      await act(async () => {
        await result.current.submitReview();
      });

      expect(onSuccess).toHaveBeenCalledWith('new-review-1');
    });

    it('성공 후 폼이 리셋되어야 함', async () => {
      mockGetUser.mockResolvedValue({ data: { user: mockAuthUser }, error: null });
      mockSelect.mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({ data: mockProfile, error: null }),
        }),
      });

      const { result } = renderHook(() => useReviewForm(defaultOptions));

      await waitFor(() => {
        expect(result.current.user).not.toBeNull();
      });

      act(() => {
        result.current.setRating(5);
        result.current.setComment('정말 좋은 도시입니다. 추천합니다!');
        result.current.setJobCategory('developer');
      });

      await act(async () => {
        await result.current.submitReview();
      });

      expect(result.current.rating).toBe(0);
      expect(result.current.comment).toBe('');
    });
  });

  describe('submitReview - 실패', () => {
    it('API 에러 시 onError 콜백을 호출해야 함', async () => {
      const { createReview } = await import('@/lib/supabase/mutations/reviews');
      vi.mocked(createReview).mockRejectedValueOnce(new Error('서버 에러'));

      const onError = vi.fn();
      mockGetUser.mockResolvedValue({ data: { user: mockAuthUser }, error: null });
      mockSelect.mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({ data: mockProfile, error: null }),
        }),
      });

      const { result } = renderHook(() =>
        useReviewForm({
          ...defaultOptions,
          onError,
        })
      );

      await waitFor(() => {
        expect(result.current.user).not.toBeNull();
      });

      act(() => {
        result.current.setRating(5);
        result.current.setComment('정말 좋은 도시입니다. 추천합니다!');
        result.current.setJobCategory('developer');
      });

      await act(async () => {
        await result.current.submitReview();
      });

      expect(onError).toHaveBeenCalled();
      expect(result.current.errors.submit).toBe('서버 에러');
    });

    it('에러 발생 시 isSubmitting이 false로 설정되어야 함', async () => {
      const { createReview } = await import('@/lib/supabase/mutations/reviews');
      vi.mocked(createReview).mockRejectedValueOnce(new Error('에러'));

      mockGetUser.mockResolvedValue({ data: { user: mockAuthUser }, error: null });
      mockSelect.mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({ data: mockProfile, error: null }),
        }),
      });

      const { result } = renderHook(() => useReviewForm(defaultOptions));

      await waitFor(() => {
        expect(result.current.user).not.toBeNull();
      });

      act(() => {
        result.current.setRating(5);
        result.current.setComment('정말 좋은 도시입니다. 추천합니다!');
        result.current.setJobCategory('developer');
      });

      await act(async () => {
        await result.current.submitReview();
      });

      expect(result.current.isSubmitting).toBe(false);
    });
  });

  describe('isLoggedIn 상태', () => {
    it('user가 null이면 isLoggedIn은 false', () => {
      const { result } = renderHook(() => useReviewForm(defaultOptions));

      expect(result.current.isLoggedIn).toBe(false);
    });

    it('user가 있으면 isLoggedIn은 true', async () => {
      mockGetUser.mockResolvedValue({ data: { user: mockAuthUser }, error: null });
      mockSelect.mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({ data: mockProfile, error: null }),
        }),
      });

      const { result } = renderHook(() => useReviewForm(defaultOptions));

      await waitFor(() => {
        expect(result.current.isLoggedIn).toBe(true);
      });
    });
  });

  describe('직업군 변경 시 프로필 업데이트', () => {
    it('직업군이 변경되면 프로필 업데이트를 시도해야 함', async () => {
      const updateMock = vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ data: null, error: null }),
      });

      mockGetUser.mockResolvedValue({ data: { user: mockAuthUser }, error: null });
      mockSelect.mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({ data: mockProfile, error: null }),
        }),
      });
      mockUpdate.mockImplementation(updateMock);

      const { result } = renderHook(() => useReviewForm(defaultOptions));

      await waitFor(() => {
        expect(result.current.user).not.toBeNull();
      });

      act(() => {
        result.current.setRating(5);
        result.current.setComment('정말 좋은 도시입니다. 추천합니다!');
        result.current.setJobCategory('designer'); // developer → designer 변경
      });

      await act(async () => {
        await result.current.submitReview();
      });

      // 직업군이 변경되었으므로 update가 호출되어야 함
      expect(updateMock).toHaveBeenCalled();
    });
  });
});
