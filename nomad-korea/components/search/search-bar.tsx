'use client';

import { useRef, KeyboardEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useSearch } from '@/hooks/use-search';
import { useSearchHistory } from '@/hooks/use-search-history';
import { useClickOutside } from '@/hooks/use-click-outside';
import { SearchResultsDropdown } from './search-results-dropdown';
import { City } from '@/types';

interface SearchBarProps {
  placeholder?: string;
  className?: string;
}

/**
 * 검색창 메인 컴포넌트
 */
export function SearchBar({
  placeholder = '도시, 지역 검색...',
  className = '',
}: SearchBarProps) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  // 검색 상태
  const { query, setQuery, results, isOpen, setIsOpen, isLoading } =
    useSearch();

  // 검색 히스토리
  const { history, addHistory, deleteHistory } = useSearchHistory();

  // 드롭다운 외부 클릭 감지
  useClickOutside(containerRef, () => setIsOpen(false));

  // 검색 결과 클릭 핸들러
  const handleResultClick = (city: City) => {
    addHistory(query);
    setIsOpen(false);
    setQuery('');
    router.push(`/cities/${city.slug}`);
  };

  // 히스토리 클릭 핸들러
  const handleHistoryClick = (historyQuery: string) => {
    setQuery(historyQuery);
    setIsOpen(true);
  };

  // 키보드 이벤트 핸들러
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (results.length > 0) {
        // 첫 번째 결과로 이동
        handleResultClick(results[0]);
      } else if (query.trim()) {
        // 검색 페이지로 이동
        addHistory(query);
        setIsOpen(false);
        router.push(`/search?q=${encodeURIComponent(query)}`);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          maxLength={50}
          className="w-full pl-10"
        />
      </div>

      <SearchResultsDropdown
        results={results}
        query={query}
        history={history}
        isLoading={isLoading}
        isOpen={isOpen}
        onResultClick={handleResultClick}
        onHistoryClick={handleHistoryClick}
        onHistoryDelete={deleteHistory}
      />
    </div>
  );
}
