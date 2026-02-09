import type { Review, ReviewSortOption, ReviewJobFilter } from '@/types';

/**
 * 리뷰 정렬 함수 (SRP: 정렬만 담당)
 * @param reviews - 정렬할 리뷰 목록
 * @param sortBy - 정렬 기준
 * @returns 정렬된 리뷰 목록
 */
export function sortReviews(
  reviews: Review[],
  sortBy: ReviewSortOption
): Review[] {
  const sorted = [...reviews];

  switch (sortBy) {
    case 'latest':
      // 최신순: createdAt 내림차순
      return sorted.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

    case 'rating':
      // 평점순: rating 내림차순
      return sorted.sort((a, b) => b.rating - a.rating);

    case 'likes':
      // 좋아요순: likesCount 내림차순
      return sorted.sort((a, b) => b.likesCount - a.likesCount);

    default:
      return sorted;
  }
}

/**
 * 직업군별 리뷰 필터링 함수 (SRP: 필터링만 담당)
 * @param reviews - 필터링할 리뷰 목록
 * @param jobFilter - 직업군 필터
 * @returns 필터링된 리뷰 목록
 */
export function filterReviewsByJob(
  reviews: Review[],
  jobFilter: ReviewJobFilter
): Review[] {
  // 'all'인 경우 모든 리뷰 반환
  if (jobFilter === 'all') {
    return reviews;
  }

  // 특정 직업군만 필터링
  return reviews.filter((review) => review.jobCategory === jobFilter);
}

/**
 * 리뷰 페이지네이션 함수 (SRP: 페이징만 담당)
 * @param reviews - 페이징할 리뷰 목록
 * @param page - 현재 페이지 번호 (1부터 시작)
 * @param pageSize - 페이지당 항목 수 (기본값: 5)
 * @returns 페이징된 리뷰 목록과 총 페이지 수
 */
export function paginateReviews(
  reviews: Review[],
  page: number,
  pageSize: number = 5
): { items: Review[]; totalPages: number } {
  const totalPages = Math.ceil(reviews.length / pageSize);
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  return {
    items: reviews.slice(startIndex, endIndex),
    totalPages: totalPages || 1, // 최소 1 페이지
  };
}
