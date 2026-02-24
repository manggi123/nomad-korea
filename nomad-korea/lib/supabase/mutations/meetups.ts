import { SupabaseClient } from '@supabase/supabase-js';
import { Database, Inserts, Updates, Tables } from '@/types/database.types';

type TypedSupabaseClient = SupabaseClient<Database>;

// 모임 생성
export async function createMeetup(
  supabase: TypedSupabaseClient,
  meetup: Omit<Inserts<'meetups'>, 'id' | 'participants' | 'created_at' | 'updated_at'>
): Promise<Tables<'meetups'>> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const client = supabase as any;
  const { data, error } = await client
    .from('meetups')
    .insert(meetup)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// 모임 수정
export async function updateMeetup(
  supabase: TypedSupabaseClient,
  meetupId: string,
  updates: Updates<'meetups'>
): Promise<Tables<'meetups'>> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const client = supabase as any;
  const { data, error } = await client
    .from('meetups')
    .update(updates)
    .eq('id', meetupId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// 모임 삭제
export async function deleteMeetup(supabase: TypedSupabaseClient, meetupId: string): Promise<boolean> {
  const { error } = await supabase
    .from('meetups')
    .delete()
    .eq('id', meetupId);

  if (error) throw error;
  return true;
}

// 모임 참가자 증가
export async function incrementMeetupParticipants(
  supabase: TypedSupabaseClient,
  meetupId: string
): Promise<Tables<'meetups'>> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any).rpc('increment', {
    row_id: meetupId,
  });

  if (error) {
    // RPC가 없으면 수동으로 증가
    const { data: meetup } = await supabase
      .from('meetups')
      .select('participants, max_participants')
      .eq('id', meetupId)
      .single();

    const meetupData = meetup as { participants: number; max_participants: number } | null;

    if (meetupData && meetupData.participants < meetupData.max_participants) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const client = supabase as any;
      const { data: updated, error: updateError } = await client
        .from('meetups')
        .update({ participants: meetupData.participants + 1 })
        .eq('id', meetupId)
        .select()
        .single();

      if (updateError) throw updateError;
      return updated;
    } else {
      throw new Error('모임 정원이 가득 찼습니다.');
    }
  }

  return data;
}
