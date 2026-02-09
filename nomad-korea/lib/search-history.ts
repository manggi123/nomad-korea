import { SearchHistory } from '@/types';

const STORAGE_KEY = 'nomad-korea-search-history';
const MAX_HISTORY_COUNT = 10;

/**
 * 로컬스토리지에서 검색 히스토리를 조회합니다
 * @returns 최신순으로 정렬된 검색 히스토리 목록
 */
export function getSearchHistory(): SearchHistory[] {
  try {
    if (typeof window === 'undefined') return [];

    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];

    const history: SearchHistory[] = JSON.parse(data);

    // 최신순 정렬
    return history.sort((a, b) => b.timestamp - a.timestamp);
  } catch (error) {
    console.error('Failed to load search history:', error);
    return [];
  }
}

/**
 * 검색 히스토리에 새 항목을 추가합니다
 * @param query - 저장할 검색어
 */
export function addSearchHistory(query: string): void {
  if (!query.trim()) return;

  try {
    if (typeof window === 'undefined') return;

    const history = getSearchHistory();

    // 중복 제거 (같은 검색어가 있으면 제거)
    const filtered = history.filter((h) => h.query !== query.trim());

    // 새 항목 추가
    const newItem: SearchHistory = {
      id: crypto.randomUUID(),
      query: query.trim(),
      timestamp: Date.now(),
    };

    // 최대 개수 제한
    const updated = [newItem, ...filtered].slice(0, MAX_HISTORY_COUNT);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.warn('Failed to save search history:', error);
    // 로컬스토리지 접근 불가 시에도 기능은 계속 동작
  }
}

/**
 * 특정 검색 히스토리 항목을 삭제합니다
 * @param id - 삭제할 항목의 ID
 */
export function deleteSearchHistory(id: string): void {
  try {
    if (typeof window === 'undefined') return;

    const history = getSearchHistory();
    const updated = history.filter((h) => h.id !== id);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Failed to delete search history:', error);
  }
}

/**
 * 모든 검색 히스토리를 삭제합니다
 */
export function clearSearchHistory(): void {
  try {
    if (typeof window === 'undefined') return;

    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear search history:', error);
  }
}
