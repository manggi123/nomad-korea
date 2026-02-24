import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types/database.types';

type TypedSupabaseClient = SupabaseClient<Database>;
type CityLikeReaction = 'like' | 'dislike';

interface ToggleCityLikeResult {
  action: 'added' | 'removed' | 'updated';
  reaction: CityLikeReaction | null;
}

// 도시 좋아요/싫어요 토글
export async function toggleCityLike(
  supabase: TypedSupabaseClient,
  cityId: string,
  userId: string,
  reaction: CityLikeReaction
): Promise<ToggleCityLikeResult> {
  // 기존 반응 확인
  const { data: existing } = await supabase
    .from('city_likes')
    .select('id, reaction')
    .eq('city_id', cityId)
    .eq('user_id', userId)
    .maybeSingle();

  if (existing) {
    const existingData = existing as { id: string; reaction: CityLikeReaction };
    // 같은 반응이면 제거
    if (existingData.reaction === reaction) {
      const { error } = await supabase
        .from('city_likes')
        .delete()
        .eq('id', existingData.id);

      if (error) throw error;
      return { action: 'removed', reaction: null };
    } else {
      // 다른 반응이면 업데이트 (타입 단언 사용)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const client = supabase as any;
      const { data, error } = await client
        .from('city_likes')
        .update({ reaction })
        .eq('id', existingData.id)
        .select()
        .single();

      if (error) throw error;
      return { action: 'updated', reaction: data.reaction };
    }
  } else {
    // 새로운 반응 추가 (타입 단언 사용)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const client = supabase as any;
    const { data, error } = await client
      .from('city_likes')
      .insert({ city_id: cityId, user_id: userId, reaction })
      .select()
      .single();

    if (error) throw error;
    return { action: 'added', reaction: data.reaction };
  }
}

interface ToggleReviewLikeResult {
  action: 'added' | 'removed';
  liked: boolean;
}

// 리뷰 좋아요 토글
export async function toggleReviewLike(
  supabase: TypedSupabaseClient,
  reviewId: string,
  userId: string
): Promise<ToggleReviewLikeResult> {
  // 기존 좋아요 확인
  const { data: existing } = await supabase
    .from('review_likes')
    .select('id')
    .eq('review_id', reviewId)
    .eq('user_id', userId)
    .maybeSingle();

  if (existing) {
    const existingData = existing as { id: string };
    // 이미 좋아요를 눌렀으면 제거
    const { error } = await supabase
      .from('review_likes')
      .delete()
      .eq('id', existingData.id);

    if (error) throw error;
    return { action: 'removed', liked: false };
  } else {
    // 좋아요 추가 (타입 단언 사용)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const client = supabase as any;
    const { error } = await client
      .from('review_likes')
      .insert({ review_id: reviewId, user_id: userId })
      .select()
      .single();

    if (error) throw error;
    return { action: 'added', liked: true };
  }
}

interface ToggleBookmarkResult {
  action: 'added' | 'removed';
  bookmarked: boolean;
}

// 북마크 토글
export async function toggleBookmark(
  supabase: TypedSupabaseClient,
  cityId: string,
  userId: string
): Promise<ToggleBookmarkResult> {
  // 기존 북마크 확인
  const { data: existing } = await supabase
    .from('bookmarks')
    .select('id')
    .eq('city_id', cityId)
    .eq('user_id', userId)
    .maybeSingle();

  if (existing) {
    const existingData = existing as { id: string };
    // 이미 북마크했으면 제거
    const { error } = await supabase
      .from('bookmarks')
      .delete()
      .eq('id', existingData.id);

    if (error) throw error;
    return { action: 'removed', bookmarked: false };
  } else {
    // 북마크 추가 (타입 단언 사용)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const client = supabase as any;
    const { error } = await client
      .from('bookmarks')
      .insert({ city_id: cityId, user_id: userId })
      .select()
      .single();

    if (error) throw error;
    return { action: 'added', bookmarked: true };
  }
}
