import { Review, ReviewInput } from '@/types';
import { mockReviews } from './mock-data';

const STORAGE_KEY = 'nomad-reviews';
const USER_KEY = 'nomad-user';

/**
 * localStorage에서 사용자가 작성한 리뷰를 가져옵니다.
 * @returns 저장된 리뷰 배열
 */
function getStoredReviews(): Review[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load reviews from localStorage:', error);
    return [];
  }
}

/**
 * mockReviews와 localStorage 리뷰를 병합하여 반환합니다.
 * @returns 모든 리뷰 배열
 */
export function getReviews(): Review[] {
  const storedReviews = getStoredReviews();
  return [...mockReviews, ...storedReviews];
}

/**
 * 특정 도시의 리뷰를 가져옵니다.
 * @param cityId - 도시 ID
 * @returns 해당 도시의 리뷰 배열
 */
export function getReviewsByCity(cityId: string): Review[] {
  return getReviews().filter((review) => review.cityId === cityId);
}

/**
 * 고유한 리뷰 ID를 생성합니다.
 * @returns 고유 ID 문자열
 */
function generateReviewId(): string {
  return `review-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}

/**
 * 현재 로그인한 사용자 정보를 가져옵니다.
 * 로그인하지 않은 경우 mock 사용자를 반환합니다.
 * @returns 사용자 정보
 */
export function getCurrentUser(): {
  id: string;
  username: string;
  avatarUrl?: string;
  jobCategory: string;
} {
  if (typeof window === 'undefined') {
    return {
      id: 'mock-user',
      username: '익명 사용자',
      jobCategory: 'developer',
    };
  }

  try {
    const stored = localStorage.getItem(USER_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load user from localStorage:', error);
  }

  // Mock 사용자 생성 및 저장
  const mockUser = {
    id: `user-${Date.now()}`,
    username: '익명 사용자',
    avatarUrl: 'https://placehold.co/100x100/3b82f6/ffffff?text=U',
    jobCategory: 'developer',
  };

  try {
    localStorage.setItem(USER_KEY, JSON.stringify(mockUser));
  } catch (error) {
    console.error('Failed to save user to localStorage:', error);
  }

  return mockUser;
}

/**
 * 사용자 정보를 업데이트합니다.
 * @param username - 사용자 이름
 * @param jobCategory - 직업군
 */
export function updateCurrentUser(
  username: string,
  jobCategory: string
): void {
  if (typeof window === 'undefined') return;

  const currentUser = getCurrentUser();
  const updatedUser = {
    ...currentUser,
    username,
    jobCategory,
  };

  try {
    localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
  } catch (error) {
    console.error('Failed to update user in localStorage:', error);
  }
}

/**
 * 새로운 리뷰를 추가합니다.
 * @param input - 리뷰 입력 데이터
 * @returns 생성된 리뷰 객체
 */
export function addReview(input: ReviewInput): Review {
  const user = getCurrentUser();
  const newReview: Review = {
    id: generateReviewId(),
    cityId: input.cityId,
    cityName: '', // getCityBySlug로 채워야 함
    username: user.username,
    avatarUrl: user.avatarUrl,
    rating: input.rating,
    comment: input.comment,
    likesCount: 0,
    commentsCount: 0,
    createdAt: new Date().toISOString(),
    jobCategory: input.jobCategory,
  };

  const storedReviews = getStoredReviews();
  storedReviews.push(newReview);

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(storedReviews));
  } catch (error) {
    console.error('Failed to save review to localStorage:', error);
    throw new Error('리뷰 저장에 실패했습니다');
  }

  return newReview;
}

/**
 * 리뷰를 삭제합니다. (본인 리뷰만 삭제 가능)
 * @param reviewId - 삭제할 리뷰 ID
 * @returns 삭제 성공 여부
 */
export function deleteReview(reviewId: string): boolean {
  const user = getCurrentUser();
  const storedReviews = getStoredReviews();

  const reviewIndex = storedReviews.findIndex((r) => r.id === reviewId);
  if (reviewIndex === -1) {
    console.error('Review not found:', reviewId);
    return false;
  }

  // 본인 리뷰만 삭제 가능
  const review = storedReviews[reviewIndex];
  if (review.username !== user.username) {
    console.error('Cannot delete other users review');
    return false;
  }

  storedReviews.splice(reviewIndex, 1);

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(storedReviews));
    return true;
  } catch (error) {
    console.error('Failed to delete review from localStorage:', error);
    return false;
  }
}

/**
 * 도시의 평균 평점을 계산합니다.
 * @param cityId - 도시 ID
 * @returns 평균 평점 (소수점 1자리)
 */
export function calculateAverageRating(cityId: string): number {
  const reviews = getReviewsByCity(cityId);
  if (reviews.length === 0) return 0;

  const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
  return Math.round((sum / reviews.length) * 10) / 10;
}

/**
 * 도시의 리뷰 개수를 반환합니다.
 * @param cityId - 도시 ID
 * @returns 리뷰 개수
 */
export function getReviewCount(cityId: string): number {
  return getReviewsByCity(cityId).length;
}
