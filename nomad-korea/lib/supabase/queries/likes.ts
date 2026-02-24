import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types/database.types';

type TypedSupabaseClient = SupabaseClient<Database>;

interface CityLikeStats {
  likes: number;
  dislikes: number;
}

// 도시의 좋아요/싫어요 통계 가져오기
export async function getCityLikeStats(supabase: TypedSupabaseClient, cityId: string): Promise<CityLikeStats> {
  const { data, error } = await supabase
    .from('cities')
    .select('likes, dislikes')
    .eq('id', cityId)
    .single();

  if (error) throw error;

  const cityData = data as { likes: number; dislikes: number } | null;
  return {
    likes: cityData?.likes || 0,
    dislikes: cityData?.dislikes || 0,
  };
}

// 리뷰의 좋아요 수 가져오기
export async function getReviewLikeCount(supabase: TypedSupabaseClient, reviewId: string): Promise<number> {
  const { data, error } = await supabase
    .from('reviews')
    .select('likes_count')
    .eq('id', reviewId)
    .single();

  if (error) throw error;

  const reviewData = data as { likes_count: number } | null;
  return reviewData?.likes_count || 0;
}

// 사용자가 좋아요한 리뷰 목록
export async function getUserLikedReviews(
  supabase: TypedSupabaseClient,
  userId: string
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const client = supabase as any;
  const { data, error } = await client
    .from('review_likes')
    .select(`
      id,
      created_at,
      reviews_with_user (*)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}
