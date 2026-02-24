/**
 * 도시 좋아요/싫어요 스토리지
 *
 * Supabase를 사용하여 로그인 사용자의 좋아요/싫어요를 관리합니다.
 * 비로그인 사용자의 경우 localStorage를 폴백으로 사용합니다.
 */

import { CityLikes, UserCityReaction } from '@/types';
import { createClient } from '@/lib/supabase/client';
import { toggleCityLike } from '@/lib/supabase/mutations/likes';
import { getCityLikeStats } from '@/lib/supabase/queries/likes';

const USER_REACTIONS_KEY = 'nomad-user-reactions';

// ============================================
// localStorage 폴백 함수 (비로그인 사용자용)
// ============================================

/**
 * localStorage에서 사용자의 도시 반응 데이터를 가져옵니다.
 * @returns 사용자 반응 데이터 배열
 */
function getLocalUserReactions(): UserCityReaction[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(USER_REACTIONS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load user reactions from localStorage:', error);
    return [];
  }
}

/**
 * localStorage에 사용자 반응 데이터를 저장합니다.
 * @param userReaction - 업데이트할 사용자 반응
 */
function updateLocalUserReaction(userReaction: UserCityReaction): void {
  if (typeof window === 'undefined') return;

  try {
    const reactions = getLocalUserReactions();
    const index = reactions.findIndex((r) => r.cityId === userReaction.cityId);

    if (userReaction.reaction === null) {
      // 반응 취소 → 삭제
      if (index >= 0) {
        reactions.splice(index, 1);
      }
    } else {
      // 반응 추가 또는 업데이트
      if (index >= 0) {
        reactions[index] = userReaction;
      } else {
        reactions.push(userReaction);
      }
    }

    localStorage.setItem(USER_REACTIONS_KEY, JSON.stringify(reactions));
  } catch (error) {
    console.error('Failed to update user reaction in localStorage:', error);
  }
}

// ============================================
// 메인 API (Supabase + localStorage 폴백)
// ============================================

/**
 * 특정 도시의 좋아요/싫어요 개수를 가져옵니다.
 * @param cityId - 도시 ID
 * @returns 좋아요/싫어요 개수
 */
export async function getCityLikes(cityId: string): Promise<CityLikes> {
  const supabase = createClient();

  try {
    const stats = await getCityLikeStats(supabase, cityId);
    return {
      cityId,
      likes: stats.likes,
      dislikes: stats.dislikes,
    };
  } catch {
    // Supabase 실패 시 기본값 반환
    return {
      cityId,
      likes: 0,
      dislikes: 0,
    };
  }
}

/**
 * 사용자의 특정 도시에 대한 반응을 가져옵니다.
 * @param cityId - 도시 ID
 * @returns 사용자 반응 ('like', 'dislike', null)
 */
export async function getUserReaction(cityId: string): Promise<'like' | 'dislike' | null> {
  const supabase = createClient();

  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      // 로그인 사용자: Supabase에서 조회
      const { data } = await supabase
        .from('city_likes')
        .select('reaction')
        .eq('city_id', cityId)
        .eq('user_id', user.id)
        .maybeSingle();

      return (data?.reaction as 'like' | 'dislike') || null;
    } else {
      // 비로그인 사용자: localStorage에서 조회
      const reactions = getLocalUserReactions();
      const reaction = reactions.find((r) => r.cityId === cityId);
      return reaction?.reaction || null;
    }
  } catch {
    // 에러 시 localStorage 폴백
    const reactions = getLocalUserReactions();
    const reaction = reactions.find((r) => r.cityId === cityId);
    return reaction?.reaction || null;
  }
}

/**
 * 도시에 좋아요를 토글합니다.
 * @param cityId - 도시 ID
 * @returns 업데이트된 좋아요/싫어요 개수
 */
export async function toggleLike(cityId: string): Promise<CityLikes> {
  const supabase = createClient();

  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      // 로그인 사용자: Supabase에서 처리
      await toggleCityLike(supabase, cityId, user.id, 'like');

      // 업데이트된 값 가져오기
      return await getCityLikes(cityId);
    } else {
      // 비로그인 사용자: localStorage만 업데이트 (UI 표시용)
      const currentReaction = await getUserReaction(cityId);

      if (currentReaction === 'like') {
        updateLocalUserReaction({ cityId, reaction: null });
      } else {
        updateLocalUserReaction({ cityId, reaction: 'like' });
      }

      // localStorage는 카운트를 실제로 변경하지 않으므로 현재 값 반환
      return await getCityLikes(cityId);
    }
  } catch (error) {
    console.error('Toggle like failed:', error);
    throw error;
  }
}

/**
 * 도시에 싫어요를 토글합니다.
 * @param cityId - 도시 ID
 * @returns 업데이트된 좋아요/싫어요 개수
 */
export async function toggleDislike(cityId: string): Promise<CityLikes> {
  const supabase = createClient();

  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      // 로그인 사용자: Supabase에서 처리
      await toggleCityLike(supabase, cityId, user.id, 'dislike');

      // 업데이트된 값 가져오기
      return await getCityLikes(cityId);
    } else {
      // 비로그인 사용자: localStorage만 업데이트 (UI 표시용)
      const currentReaction = await getUserReaction(cityId);

      if (currentReaction === 'dislike') {
        updateLocalUserReaction({ cityId, reaction: null });
      } else {
        updateLocalUserReaction({ cityId, reaction: 'dislike' });
      }

      // localStorage는 카운트를 실제로 변경하지 않으므로 현재 값 반환
      return await getCityLikes(cityId);
    }
  } catch (error) {
    console.error('Toggle dislike failed:', error);
    throw error;
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
