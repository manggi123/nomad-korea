import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types/database.types';

type TypedSupabaseClient = SupabaseClient<Database>;

// 리뷰 정렬 옵션
export type ReviewSortOption = 'latest' | 'rating' | 'likes';

// 직업군 필터
export type ReviewJobFilter = 'all' | 'developer' | 'designer' | 'marketer' | 'writer' | 'video-producer' | 'planner';

// 도시별 리뷰 가져오기 (사용자 정보 포함)
export async function getReviewsByCity(
  supabase: TypedSupabaseClient,
  cityId: string,
  options?: {
    sortBy?: ReviewSortOption;
    jobFilter?: ReviewJobFilter;
    page?: number;
    pageSize?: number;
  }
) {
  const { sortBy = 'latest', jobFilter = 'all', page = 1, pageSize = 10 } = options || {};

  let query = supabase
    .from('reviews_with_user')
    .select('*')
    .eq('city_id', cityId);

  // 직업군 필터 적용
  if (jobFilter !== 'all') {
    query = query.eq('job_category', jobFilter);
  }

  // 정렬 적용
  switch (sortBy) {
    case 'rating':
      query = query.order('rating', { ascending: false });
      break;
    case 'likes':
      query = query.order('likes_count', { ascending: false });
      break;
    case 'latest':
    default:
      query = query.order('created_at', { ascending: false });
      break;
  }

  // 페이지네이션
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  query = query.range(from, to);

  const { data, error, count } = await query;

  if (error) throw error;

  return {
    data: data || [],
    count: count || 0,
    page,
    pageSize,
    totalPages: count ? Math.ceil(count / pageSize) : 0,
  };
}

// 최신 리뷰 가져오기
export async function getLatestReviews(supabase: TypedSupabaseClient, limit: number = 4) {
  const { data, error } = await supabase
    .from('reviews_with_user')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
}

// 사용자의 리뷰 가져오기
export async function getReviewsByUser(
  supabase: TypedSupabaseClient,
  userId: string,
  options?: {
    page?: number;
    pageSize?: number;
  }
) {
  const { page = 1, pageSize = 10 } = options || {};

  let query = supabase
    .from('reviews_with_user')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  // 페이지네이션
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  query = query.range(from, to);

  const { data, error, count } = await query;

  if (error) throw error;

  return {
    data: data || [],
    count: count || 0,
    page,
    pageSize,
    totalPages: count ? Math.ceil(count / pageSize) : 0,
  };
}

// 리뷰 ID로 리뷰 가져오기
export async function getReviewById(supabase: TypedSupabaseClient, reviewId: string) {
  const { data, error } = await supabase
    .from('reviews_with_user')
    .select('*')
    .eq('id', reviewId)
    .single();

  if (error) throw error;
  return data;
}

// 사용자가 특정 리뷰에 좋아요를 눌렀는지 확인
export async function hasUserLikedReview(
  supabase: TypedSupabaseClient,
  reviewId: string,
  userId: string
) {
  const { data, error } = await supabase
    .from('review_likes')
    .select('id')
    .eq('review_id', reviewId)
    .eq('user_id', userId)
    .maybeSingle();

  if (error) throw error;
  return !!data;
}

interface ReviewStats {
  avgRating: number;
  totalReviews: number;
  distribution: Record<number, number>;
}

// 도시의 리뷰 통계 가져오기
export async function getCityReviewStats(supabase: TypedSupabaseClient, cityId: string): Promise<ReviewStats> {
  // 평균 평점 및 리뷰 수
  const { data: cityData } = await supabase
    .from('cities')
    .select('avg_rating, review_count')
    .eq('id', cityId)
    .single();

  // 평점별 분포
  const { data: ratingDistribution } = await supabase
    .from('reviews')
    .select('rating')
    .eq('city_id', cityId);

  // 평점별 카운트 계산
  const distribution = {
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0,
  };

  const ratingData = ratingDistribution as { rating: number }[] | null;
  ratingData?.forEach((review) => {
    distribution[review.rating as keyof typeof distribution]++;
  });

  const cityStatsData = cityData as { avg_rating: number; review_count: number } | null;
  return {
    avgRating: cityStatsData?.avg_rating || 0,
    totalReviews: cityStatsData?.review_count || 0,
    distribution,
  };
}

// 도시의 직업군별 리뷰 수
export async function getCityReviewsByJobCategory(
  supabase: TypedSupabaseClient,
  cityId: string
): Promise<Record<string, number>> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const client = supabase as any;
  const { data, error } = await client
    .from('reviews_with_user')
    .select('job_category')
    .eq('city_id', cityId);

  if (error) throw error;

  // 직업군별 카운트
  const jobCounts: Record<string, number> = {};
  const reviewData = data as { job_category: string | null }[] | null;
  reviewData?.forEach((review) => {
    const job = review.job_category || 'unknown';
    jobCounts[job] = (jobCounts[job] || 0) + 1;
  });

  return jobCounts;
}
