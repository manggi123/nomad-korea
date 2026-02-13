import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types/database.types';

type TypedSupabaseClient = SupabaseClient<Database>;

// 사용자 프로필 가져오기
export async function getProfile(supabase: TypedSupabaseClient, userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data;
}

// 현재 로그인한 사용자 프로필 가져오기
export async function getCurrentUserProfile(supabase: TypedSupabaseClient) {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  return getProfile(supabase, user.id);
}

// 사용자명으로 프로필 찾기
export async function getProfileByUsername(supabase: TypedSupabaseClient, username: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
    .single();

  if (error) throw error;
  return data;
}

// 이달의 리뷰왕 가져오기
export async function getTopReviewers(supabase: TypedSupabaseClient, limit: number = 3) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('review_count', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
}

// 사용자가 북마크한 도시 목록
export async function getUserBookmarkedCities(
  supabase: TypedSupabaseClient,
  userId: string
) {
  const { data, error } = await supabase
    .from('bookmarks')
    .select(`
      id,
      created_at,
      cities (*)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

// 사용자가 특정 도시를 북마크했는지 확인
export async function hasUserBookmarkedCity(
  supabase: TypedSupabaseClient,
  cityId: string,
  userId: string
) {
  const { data, error } = await supabase
    .from('bookmarks')
    .select('id')
    .eq('city_id', cityId)
    .eq('user_id', userId)
    .maybeSingle();

  if (error) throw error;
  return !!data;
}

// 사용자의 도시 좋아요/싫어요 반응 가져오기
export async function getUserCityReaction(
  supabase: TypedSupabaseClient,
  cityId: string,
  userId: string
): Promise<'like' | 'dislike' | null> {
  const { data, error } = await supabase
    .from('city_likes')
    .select('reaction')
    .eq('city_id', cityId)
    .eq('user_id', userId)
    .maybeSingle();

  if (error) throw error;
  const reactionData = data as { reaction: 'like' | 'dislike' } | null;
  return reactionData?.reaction || null;
}

// 사용자가 좋아요한 도시 목록
export async function getUserLikedCities(
  supabase: TypedSupabaseClient,
  userId: string
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const client = supabase as any;
  const { data, error } = await client
    .from('city_likes')
    .select(`
      id,
      reaction,
      created_at,
      cities (*)
    `)
    .eq('user_id', userId)
    .eq('reaction', 'like')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}
