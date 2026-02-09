import { City, SearchHistory } from '@/types';
import { SearchResultItem } from './search-result-item';
import { SearchHistory as SearchHistoryComponent } from './search-history';
import { Search } from 'lucide-react';

interface SearchResultsDropdownProps {
  results: City[];
  query: string;
  history: SearchHistory[];
  isLoading: boolean;
  isOpen: boolean;
  onResultClick: (city: City) => void;
  onHistoryClick: (query: string) => void;
  onHistoryDelete: (id: string) => void;
}

/**
 * 검색 결과 드롭다운 컴포넌트
 */
export function SearchResultsDropdown({
  results,
  query,
  history,
  isLoading,
  isOpen,
  onResultClick,
  onHistoryClick,
  onHistoryDelete,
}: SearchResultsDropdownProps) {
  if (!isOpen) return null;

  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-[400px] overflow-y-auto z-50">
      {/* 빈 검색어 - 히스토리 표시 */}
      {!query && (
        <>
          {history.length > 0 ? (
            <SearchHistoryComponent
              items={history}
              onItemClick={onHistoryClick}
              onDelete={onHistoryDelete}
            />
          ) : (
            <div className="px-4 py-8 text-center text-sm text-muted-foreground">
              도시나 지역명을 입력해주세요
            </div>
          )}
        </>
      )}

      {/* 로딩 상태 */}
      {query && isLoading && (
        <div className="p-4 space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3 animate-pulse">
              <div className="w-12 h-12 bg-gray-200 rounded-lg" />
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-32 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-24" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 검색 결과 표시 */}
      {query && !isLoading && results.length > 0 && (
        <div className="py-2">
          <div className="px-4 py-2 text-xs font-semibold text-muted-foreground">
            검색 결과 ({results.length})
          </div>
          {results.slice(0, 8).map((city) => (
            <SearchResultItem
              key={city.id}
              city={city}
              query={query}
              onClick={() => onResultClick(city)}
            />
          ))}
          {results.length > 8 && (
            <div className="px-4 py-3 text-center text-sm text-muted-foreground border-t">
              {results.length - 8}개 더 보기
            </div>
          )}
        </div>
      )}

      {/* 검색 결과 없음 */}
      {query && !isLoading && results.length === 0 && (
        <div className="px-4 py-8 text-center">
          <Search className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            &quot;{query}&quot;에 대한 검색 결과가 없습니다
          </p>
        </div>
      )}
    </div>
  );
}
