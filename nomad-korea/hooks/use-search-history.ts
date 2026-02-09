'use client';

import { useState } from 'react';
import { SearchHistory } from '@/types';
import {
  getSearchHistory,
  addSearchHistory as addHistoryToStorage,
  deleteSearchHistory as deleteHistoryFromStorage,
  clearSearchHistory as clearHistoryFromStorage,
} from '@/lib/search-history';

/**
 * 검색 히스토리 관리 훅
 * @returns 히스토리 목록 및 CRUD 함수들
 */
export function useSearchHistory() {
  const [history, setHistory] = useState<SearchHistory[]>(() => {
    // 초기값을 lazy initialization으로 설정
    return getSearchHistory();
  });

  // 히스토리 추가
  const addHistory = (query: string) => {
    addHistoryToStorage(query);
    setHistory(getSearchHistory());
  };

  // 히스토리 삭제
  const deleteHistory = (id: string) => {
    deleteHistoryFromStorage(id);
    setHistory(getSearchHistory());
  };

  // 전체 히스토리 삭제
  const clearHistory = () => {
    clearHistoryFromStorage();
    setHistory([]);
  };

  return {
    history,
    addHistory,
    deleteHistory,
    clearHistory,
  };
}
