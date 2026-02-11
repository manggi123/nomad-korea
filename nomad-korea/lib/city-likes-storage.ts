import { CityLikes, UserCityReaction } from '@/types';
import { mockCities } from './mock-data';

const CITY_LIKES_KEY = 'nomad-city-likes';
const USER_REACTIONS_KEY = 'nomad-user-reactions';

/**
 * localStorage에서 모든 도시의 좋아요/싫어요 데이터를 가져옵니다.
 * @returns 도시별 좋아요/싫어요 데이터 배열
 */
function getStoredCityLikes(): CityLikes[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(CITY_LIKES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load city likes from localStorage:', error);
    return [];
  }
}

/**
 * localStorage에서 사용자의 도시 반응 데이터를 가져옵니다.
 * @returns 사용자 반응 데이터 배열
 */
function getStoredUserReactions(): UserCityReaction[] {
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
 * 특정 도시의 좋아요/싫어요 개수를 가져옵니다.
 * @param cityId - 도시 ID
 * @returns 좋아요/싫어요 개수
 */
export function getCityLikes(cityId: string): CityLikes {
  const storedLikes = getStoredCityLikes();
  const stored = storedLikes.find((cl) => cl.cityId === cityId);

  if (stored) {
    return stored;
  }

  // localStorage에 없으면 mockCities에서 초기값 가져오기
  const city = mockCities.find((c) => c.id === cityId);
  return {
    cityId,
    likes: city?.likes || 0,
    dislikes: city?.dislikes || 0,
  };
}

/**
 * 사용자의 특정 도시에 대한 반응을 가져옵니다.
 * @param cityId - 도시 ID
 * @returns 사용자 반응 ('like', 'dislike', null)
 */
export function getUserReaction(cityId: string): 'like' | 'dislike' | null {
  const reactions = getStoredUserReactions();
  const reaction = reactions.find((r) => r.cityId === cityId);
  return reaction?.reaction || null;
}

/**
 * 도시에 좋아요를 토글합니다.
 * @param cityId - 도시 ID
 * @returns 업데이트된 좋아요/싫어요 개수
 */
export function toggleLike(cityId: string): CityLikes {
  const currentLikes = getCityLikes(cityId);
  const currentReaction = getUserReaction(cityId);

  let newLikes = { ...currentLikes };
  let newReaction: 'like' | 'dislike' | null = null;

  if (currentReaction === 'like') {
    // 이미 좋아요 → 취소
    newLikes.likes = Math.max(0, newLikes.likes - 1);
    newReaction = null;
  } else if (currentReaction === 'dislike') {
    // 싫어요 → 좋아요로 변경
    newLikes.dislikes = Math.max(0, newLikes.dislikes - 1);
    newLikes.likes += 1;
    newReaction = 'like';
  } else {
    // 반응 없음 → 좋아요
    newLikes.likes += 1;
    newReaction = 'like';
  }

  // localStorage 업데이트
  updateCityLikes(newLikes);
  updateUserReaction({ cityId, reaction: newReaction });

  return newLikes;
}

/**
 * 도시에 싫어요를 토글합니다.
 * @param cityId - 도시 ID
 * @returns 업데이트된 좋아요/싫어요 개수
 */
export function toggleDislike(cityId: string): CityLikes {
  const currentLikes = getCityLikes(cityId);
  const currentReaction = getUserReaction(cityId);

  let newLikes = { ...currentLikes };
  let newReaction: 'like' | 'dislike' | null = null;

  if (currentReaction === 'dislike') {
    // 이미 싫어요 → 취소
    newLikes.dislikes = Math.max(0, newLikes.dislikes - 1);
    newReaction = null;
  } else if (currentReaction === 'like') {
    // 좋아요 → 싫어요로 변경
    newLikes.likes = Math.max(0, newLikes.likes - 1);
    newLikes.dislikes += 1;
    newReaction = 'dislike';
  } else {
    // 반응 없음 → 싫어요
    newLikes.dislikes += 1;
    newReaction = 'dislike';
  }

  // localStorage 업데이트
  updateCityLikes(newLikes);
  updateUserReaction({ cityId, reaction: newReaction });

  return newLikes;
}

/**
 * localStorage에 도시 좋아요/싫어요 데이터를 저장합니다.
 * @param cityLikes - 업데이트할 도시 데이터
 */
function updateCityLikes(cityLikes: CityLikes): void {
  if (typeof window === 'undefined') return;

  try {
    const storedLikes = getStoredCityLikes();
    const index = storedLikes.findIndex((cl) => cl.cityId === cityLikes.cityId);

    if (index >= 0) {
      storedLikes[index] = cityLikes;
    } else {
      storedLikes.push(cityLikes);
    }

    localStorage.setItem(CITY_LIKES_KEY, JSON.stringify(storedLikes));
  } catch (error) {
    console.error('Failed to update city likes in localStorage:', error);
  }
}

/**
 * localStorage에 사용자 반응 데이터를 저장합니다.
 * @param userReaction - 업데이트할 사용자 반응
 */
function updateUserReaction(userReaction: UserCityReaction): void {
  if (typeof window === 'undefined') return;

  try {
    const reactions = getStoredUserReactions();
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

/**
 * 모든 도시의 좋아요/싫어요 데이터를 가져옵니다 (mockCities + localStorage 병합).
 * @returns 전체 도시 좋아요/싫어요 데이터
 */
export function getAllCityLikes(): CityLikes[] {
  return mockCities.map((city) => getCityLikes(city.id));
}
