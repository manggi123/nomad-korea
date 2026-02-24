import { SupabaseClient } from '@supabase/supabase-js';
import { Database, Inserts, Updates, Tables } from '@/types/database.types';

type TypedSupabaseClient = SupabaseClient<Database>;

// 리뷰 생성
export async function createReview(
  supabase: TypedSupabaseClient,
  review: Omit<Inserts<'reviews'>, 'id' | 'likes_count' | 'comments_count' | 'created_at' | 'updated_at'>
): Promise<Tables<'reviews'>> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const client = supabase as any;
  const { data, error } = await client
    .from('reviews')
    .insert(review)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// 리뷰 수정
export async function updateReview(
  supabase: TypedSupabaseClient,
  reviewId: string,
  updates: Updates<'reviews'>
): Promise<Tables<'reviews'>> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const client = supabase as any;
  const { data, error } = await client
    .from('reviews')
    .update(updates)
    .eq('id', reviewId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// 리뷰 삭제
export async function deleteReview(supabase: TypedSupabaseClient, reviewId: string): Promise<boolean> {
  const { error } = await supabase
    .from('reviews')
    .delete()
    .eq('id', reviewId);

  if (error) throw error;
  return true;
}
