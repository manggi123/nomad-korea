import { SupabaseClient } from '@supabase/supabase-js';
import { Database, Inserts, Updates, Tables } from '@/types/database.types';

type TypedSupabaseClient = SupabaseClient<Database>;

// 프로필 생성 (회원가입 시)
export async function createProfile(
  supabase: TypedSupabaseClient,
  profile: Inserts<'profiles'>
): Promise<Tables<'profiles'>> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const client = supabase as any;
  const { data, error } = await client
    .from('profiles')
    .insert(profile)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// 프로필 업데이트
export async function updateProfile(
  supabase: TypedSupabaseClient,
  userId: string,
  updates: Updates<'profiles'>
): Promise<Tables<'profiles'>> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const client = supabase as any;
  const { data, error } = await client
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// 프로필 삭제
export async function deleteProfile(supabase: TypedSupabaseClient, userId: string): Promise<boolean> {
  const { error } = await supabase
    .from('profiles')
    .delete()
    .eq('id', userId);

  if (error) throw error;
  return true;
}
