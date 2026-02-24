import { describe, it, expect } from 'vitest';
import { sortReviews, filterReviewsByJob, paginateReviews } from './review-utils';
import { mockReviews, createMockReview } from '@/test/fixtures/reviews';
import type { Review, ReviewSortOption, ReviewJobFilter } from '@/types';

describe('review-utils', () => {
  describe('sortReviews', () => {
    describe('latest 정렬', () => {
      it('최신순으로 정렬해야 함', () => {
        const reviews = [...mockReviews];
        const sorted = sortReviews(reviews, 'latest');

        // 내림차순으로 정렬 확인
        for (let i = 0; i < sorted.length - 1; i++) {
          const currentDate = new Date(sorted[i].createdAt).getTime();
          const nextDate = new Date(sorted[i + 1].createdAt).getTime();
          expect(currentDate).toBeGreaterThanOrEqual(nextDate);
        }
      });

      it('가장 최신 리뷰가 첫 번째로 와야 함', () => {
        const sorted = sortReviews(mockReviews, 'latest');
        expect(sorted[0].id).toBe('review-1'); // 2024-01-15 (가장 최신)
      });

      it('빈 배열을 처리해야 함', () => {
        const sorted = sortReviews([], 'latest');
        expect(sorted).toEqual([]);
      });

      it('원본 배열을 변경하지 않아야 함', () => {
        const original = [...mockReviews];
        const originalFirstId = original[0].id;
        sortReviews(original, 'latest');
        expect(original[0].id).toBe(originalFirstId);
      });
    });

    describe('rating 정렬', () => {
      it('평점 순으로 정렬해야 함', () => {
        const sorted = sortReviews(mockReviews, 'rating');

        for (let i = 0; i < sorted.length - 1; i++) {
          expect(sorted[i].rating).toBeGreaterThanOrEqual(sorted[i + 1].rating);
        }
      });

      it('가장 높은 평점이 첫 번째로 와야 함', () => {
        const sorted = sortReviews(mockReviews, 'rating');
        expect(sorted[0].rating).toBe(5);
      });

      it('동일한 평점을 가진 리뷰들을 처리해야 함', () => {
        const reviews = [
          createMockReview({ id: '1', rating: 4 }),
          createMockReview({ id: '2', rating: 4 }),
          createMockReview({ id: '3', rating: 4 }),
        ];
        const sorted = sortReviews(reviews, 'rating');
        expect(sorted).toHaveLength(3);
        sorted.forEach((review) => expect(review.rating).toBe(4));
      });
    });

    describe('likes 정렬', () => {
      it('좋아요 순으로 정렬해야 함', () => {
        const sorted = sortReviews(mockReviews, 'likes');

        for (let i = 0; i < sorted.length - 1; i++) {
          expect(sorted[i].likesCount).toBeGreaterThanOrEqual(sorted[i + 1].likesCount);
        }
      });

      it('가장 많은 좋아요가 첫 번째로 와야 함', () => {
        const sorted = sortReviews(mockReviews, 'likes');
        expect(sorted[0].likesCount).toBe(20); // review-4
      });

      it('좋아요가 0인 리뷰도 처리해야 함', () => {
        const reviews = [
          createMockReview({ id: '1', likesCount: 0 }),
          createMockReview({ id: '2', likesCount: 5 }),
        ];
        const sorted = sortReviews(reviews, 'likes');
        expect(sorted[0].likesCount).toBe(5);
        expect(sorted[1].likesCount).toBe(0);
      });
    });

    describe('기본 동작', () => {
      it('알 수 없는 정렬 옵션은 원본 순서를 유지해야 함', () => {
        const reviews = [...mockReviews];
        // @ts-expect-error - 테스트용 잘못된 값
        const sorted = sortReviews(reviews, 'unknown');
        expect(sorted.map((r) => r.id)).toEqual(reviews.map((r) => r.id));
      });

      it('단일 리뷰 배열을 처리해야 함', () => {
        const singleReview = [mockReviews[0]];
        const sorted = sortReviews(singleReview, 'latest');
        expect(sorted).toHaveLength(1);
        expect(sorted[0].id).toBe(mockReviews[0].id);
      });
    });
  });

  describe('filterReviewsByJob', () => {
    describe('all 필터', () => {
      it('all 필터는 모든 리뷰를 반환해야 함', () => {
        const filtered = filterReviewsByJob(mockReviews, 'all');
        expect(filtered).toHaveLength(mockReviews.length);
      });

      it('빈 배열에 all 필터를 적용해도 빈 배열을 반환해야 함', () => {
        const filtered = filterReviewsByJob([], 'all');
        expect(filtered).toEqual([]);
      });
    });

    describe('직업군별 필터', () => {
      it('developer 필터가 동작해야 함', () => {
        const filtered = filterReviewsByJob(mockReviews, 'developer');
        expect(filtered.every((r) => r.jobCategory === 'developer')).toBe(true);
        expect(filtered.length).toBeGreaterThan(0);
      });

      it('designer 필터가 동작해야 함', () => {
        const filtered = filterReviewsByJob(mockReviews, 'designer');
        expect(filtered.every((r) => r.jobCategory === 'designer')).toBe(true);
        expect(filtered.length).toBeGreaterThan(0);
      });

      it('marketer 필터가 동작해야 함', () => {
        const filtered = filterReviewsByJob(mockReviews, 'marketer');
        expect(filtered.every((r) => r.jobCategory === 'marketer')).toBe(true);
      });

      it('writer 필터가 동작해야 함', () => {
        const filtered = filterReviewsByJob(mockReviews, 'writer');
        expect(filtered.every((r) => r.jobCategory === 'writer')).toBe(true);
      });

      it('video-producer 필터가 동작해야 함', () => {
        const filtered = filterReviewsByJob(mockReviews, 'video-producer');
        expect(filtered.every((r) => r.jobCategory === 'video-producer')).toBe(true);
      });

      it('존재하지 않는 직업군은 빈 배열을 반환해야 함', () => {
        const filtered = filterReviewsByJob(mockReviews, 'planner');
        expect(filtered).toHaveLength(0);
      });
    });

    describe('엣지 케이스', () => {
      it('원본 배열을 변경하지 않아야 함', () => {
        const original = [...mockReviews];
        filterReviewsByJob(original, 'developer');
        expect(original).toHaveLength(mockReviews.length);
      });

      it('단일 리뷰 배열에서 매칭되는 경우', () => {
        const singleReview = [createMockReview({ jobCategory: 'developer' })];
        const filtered = filterReviewsByJob(singleReview, 'developer');
        expect(filtered).toHaveLength(1);
      });

      it('단일 리뷰 배열에서 매칭되지 않는 경우', () => {
        const singleReview = [createMockReview({ jobCategory: 'developer' })];
        const filtered = filterReviewsByJob(singleReview, 'designer');
        expect(filtered).toHaveLength(0);
      });
    });
  });

  describe('paginateReviews', () => {
    describe('기본 페이지네이션', () => {
      it('기본 페이지 크기(5)로 페이지네이션해야 함', () => {
        const { items, totalPages } = paginateReviews(mockReviews, 1);
        expect(items).toHaveLength(5);
        expect(totalPages).toBe(1);
      });

      it('첫 번째 페이지를 반환해야 함', () => {
        const { items } = paginateReviews(mockReviews, 1, 2);
        expect(items).toHaveLength(2);
        expect(items[0].id).toBe(mockReviews[0].id);
        expect(items[1].id).toBe(mockReviews[1].id);
      });

      it('두 번째 페이지를 반환해야 함', () => {
        const { items } = paginateReviews(mockReviews, 2, 2);
        expect(items).toHaveLength(2);
        expect(items[0].id).toBe(mockReviews[2].id);
        expect(items[1].id).toBe(mockReviews[3].id);
      });

      it('마지막 페이지의 남은 항목만 반환해야 함', () => {
        const { items } = paginateReviews(mockReviews, 3, 2); // 5개 중 3번째 페이지
        expect(items).toHaveLength(1);
        expect(items[0].id).toBe(mockReviews[4].id);
      });
    });

    describe('총 페이지 수 계산', () => {
      it('정확한 총 페이지 수를 계산해야 함', () => {
        // 5개 리뷰, 페이지당 2개 = 3페이지
        const { totalPages } = paginateReviews(mockReviews, 1, 2);
        expect(totalPages).toBe(3);
      });

      it('정확히 나누어 떨어지는 경우', () => {
        const reviews = mockReviews.slice(0, 4); // 4개 리뷰
        const { totalPages } = paginateReviews(reviews, 1, 2);
        expect(totalPages).toBe(2);
      });

      it('빈 배열은 최소 1페이지를 반환해야 함', () => {
        const { totalPages } = paginateReviews([], 1, 5);
        expect(totalPages).toBe(1);
      });
    });

    describe('다양한 페이지 크기', () => {
      it('페이지 크기 1', () => {
        const { items, totalPages } = paginateReviews(mockReviews, 1, 1);
        expect(items).toHaveLength(1);
        expect(totalPages).toBe(5);
      });

      it('페이지 크기가 배열 길이와 같음', () => {
        const { items, totalPages } = paginateReviews(mockReviews, 1, 5);
        expect(items).toHaveLength(5);
        expect(totalPages).toBe(1);
      });

      it('페이지 크기가 배열 길이보다 큼', () => {
        const { items, totalPages } = paginateReviews(mockReviews, 1, 10);
        expect(items).toHaveLength(5);
        expect(totalPages).toBe(1);
      });

      it('페이지 크기 10', () => {
        const manyReviews = Array(25)
          .fill(null)
          .map((_, i) => createMockReview({ id: `review-${i}` }));
        const { items, totalPages } = paginateReviews(manyReviews, 1, 10);
        expect(items).toHaveLength(10);
        expect(totalPages).toBe(3);
      });
    });

    describe('엣지 케이스', () => {
      it('존재하지 않는 페이지는 빈 배열을 반환해야 함', () => {
        const { items } = paginateReviews(mockReviews, 100, 5);
        expect(items).toHaveLength(0);
      });

      it('페이지 0은 빈 배열을 반환해야 함 (유효하지 않은 페이지)', () => {
        const { items } = paginateReviews(mockReviews, 0, 5);
        // 페이지 0은 (0-1)*5 = -5 인덱스부터 시작하므로 빈 배열
        expect(items).toHaveLength(0);
      });

      it('음수 페이지는 빈 배열을 반환해야 함', () => {
        const { items } = paginateReviews(mockReviews, -1, 5);
        expect(items).toHaveLength(0);
      });

      it('단일 리뷰 배열', () => {
        const singleReview = [mockReviews[0]];
        const { items, totalPages } = paginateReviews(singleReview, 1, 5);
        expect(items).toHaveLength(1);
        expect(totalPages).toBe(1);
      });
    });
  });

  describe('함수 조합', () => {
    it('정렬 후 필터링이 올바르게 동작해야 함', () => {
      const sorted = sortReviews(mockReviews, 'rating');
      const filtered = filterReviewsByJob(sorted, 'developer');

      expect(filtered.every((r) => r.jobCategory === 'developer')).toBe(true);
      // 정렬 순서 유지 확인
      for (let i = 0; i < filtered.length - 1; i++) {
        expect(filtered[i].rating).toBeGreaterThanOrEqual(filtered[i + 1].rating);
      }
    });

    it('필터링 후 페이지네이션이 올바르게 동작해야 함', () => {
      const filtered = filterReviewsByJob(mockReviews, 'all');
      const { items, totalPages } = paginateReviews(filtered, 1, 2);

      expect(items).toHaveLength(2);
      expect(totalPages).toBe(3);
    });

    it('정렬, 필터링, 페이지네이션 전체 파이프라인', () => {
      const sorted = sortReviews(mockReviews, 'likes');
      const filtered = filterReviewsByJob(sorted, 'all');
      const { items } = paginateReviews(filtered, 1, 3);

      expect(items).toHaveLength(3);
      // 좋아요 내림차순 정렬 확인
      expect(items[0].likesCount).toBeGreaterThanOrEqual(items[1].likesCount);
      expect(items[1].likesCount).toBeGreaterThanOrEqual(items[2].likesCount);
    });
  });
});
