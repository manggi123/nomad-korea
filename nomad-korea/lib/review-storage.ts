/**
 * 리뷰 스토리지
 *
 * Supabase를 사용하여 리뷰 데이터를 관리합니다.
 * localStorage 의존성을 제거하고 Supabase API를 사용합니다.
 */

import { Review, ReviewInput } from '@/types';
import { createClient } from '@/lib/supabase/client';
import { getLatestReviews, getReviewsByCity as getReviewsByCityQuery } from '@/lib/supabase/queries/reviews';
import { createReview as createReviewMutation, deleteReview as deleteReviewMutation } from '@/lib/supabase/mutations/reviews';
import { transformReviewsWithUserToReviews } from '@/lib/utils/type-transformers';

/**
 * 전체 리뷰를 가져옵니다 (최신순).
 * @param limit - 가져올 리뷰 수 (기본값: 20)
 * @returns 리뷰 배열
 */
export async function getReviews(limit: number = 20): Promise<Review[]> {
  const supabase = createClient();

  try {
    const dbReviews = await getLatestReviews(supabase, limit);
    return transformReviewsWithUserToReviews(dbReviews || []);
  } catch (error) {
    console.error('Failed to fetch reviews:', error);
    return [];
  }
}

/**
 * 특정 도시의 리뷰를 가져옵니다.
 * @param cityId - 도시 ID
 * @param options - 페이지네이션 옵션
 * @returns 해당 도시의 리뷰 배열
 */
export async function getReviewsByCity(
  cityId: string,
  options?: { page?: number; pageSize?: number }
): Promise<Review[]> {
  const supabase = createClient();

  try {
    const result = await getReviewsByCityQuery(supabase, cityId, {
      page: options?.page || 1,
      pageSize: options?.pageSize || 10,
    });
    return transformReviewsWithUserToReviews(result.data || []);
  } catch (error) {
    console.error('Failed to fetch reviews by city:', error);
    return [];
  }
}

/**
 * 현재 로그인한 사용자 정보를 가져옵니다.
 * @returns 사용자 정보 또는 null
 */
export async function getCurrentUser(): Promise<{
  id: string;
  username: string;
  avatarUrl?: string;
  jobCategory: string;
} | null> {
  const supabase = createClient();

  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return null;
    }

    // 프로필 정보 가져오기
    const { data: profile } = await supabase
      .from('profiles')
      .select('username, avatar_url, job_category')
      .eq('id', user.id)
      .single();

    return {
      id: user.id,
      username: profile?.username || user.email?.split('@')[0] || '익명',
      avatarUrl: profile?.avatar_url || undefined,
      jobCategory: profile?.job_category || 'developer',
    };
  } catch (error) {
    console.error('Failed to get current user:', error);
    return null;
  }
}

/**
 * 새로운 리뷰를 추가합니다.
 * @param input - 리뷰 입력 데이터
 * @returns 생성된 리뷰 객체 또는 null
 */
export async function addReview(input: ReviewInput): Promise<Review | null> {
  const supabase = createClient();

  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('로그인이 필요합니다');
    }

    const newReview = await createReviewMutation(supabase, {
      city_id: input.cityId,
      user_id: user.id,
      rating: input.rating,
      comment: input.comment,
    });

    // 생성된 리뷰 정보 반환 (기본값으로 필드 채움)
    return {
      id: newReview.id,
      cityId: newReview.city_id,
      cityName: '', // 이후 조회 시 채워짐
      username: '', // 이후 조회 시 채워짐
      rating: newReview.rating,
      comment: newReview.comment,
      likesCount: 0,
      commentsCount: 0,
      createdAt: newReview.created_at,
      jobCategory: input.jobCategory,
    };
  } catch (error) {
    console.error('Failed to add review:', error);
    throw error;
  }
}

/**
 * 리뷰를 삭제합니다. (본인 리뷰만 삭제 가능)
 * @param reviewId - 삭제할 리뷰 ID
 * @returns 삭제 성공 여부
 */
export async function deleteReview(reviewId: string): Promise<boolean> {
  const supabase = createClient();

  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      console.error('Not logged in');
      return false;
    }

    // RLS 정책에 의해 본인 리뷰만 삭제 가능
    await deleteReviewMutation(supabase, reviewId);
    return true;
  } catch (error) {
    console.error('Failed to delete review:', error);
    return false;
  }
}

/**
 * 도시의 평균 평점을 가져옵니다.
 * @param cityId - 도시 ID
 * @returns 평균 평점 (소수점 1자리)
 */
export async function calculateAverageRating(cityId: string): Promise<number> {
  const supabase = createClient();

  try {
    const { data } = await supabase
      .from('cities')
      .select('avg_rating')
      .eq('id', cityId)
      .single();

    return Number(data?.avg_rating) || 0;
  } catch (error) {
    console.error('Failed to get average rating:', error);
    return 0;
  }
}

/**
 * 도시의 리뷰 개수를 반환합니다.
 * @param cityId - 도시 ID
 * @returns 리뷰 개수
 */
export async function getReviewCount(cityId: string): Promise<number> {
  const supabase = createClient();

  try {
    const { data } = await supabase
      .from('cities')
      .select('review_count')
      .eq('id', cityId)
      .single();

    return data?.review_count || 0;
  } catch (error) {
    console.error('Failed to get review count:', error);
    return 0;
  }
}

/**
 * 사용자가 로그인 상태인지 확인합니다.
 * @returns 로그인 여부
 */
export async function isUserLoggedIn(): Promise<boolean> {
  const supabase = createClient();

  try {
    const { data: { user } } = await supabase.auth.getUser();
    return !!user;
  } catch {
    return false;
  }
}
