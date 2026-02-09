import { SearchHistory as SearchHistoryType } from '@/types';
import { Clock, X } from 'lucide-react';

interface SearchHistoryProps {
  items: SearchHistoryType[];
  onItemClick: (query: string) => void;
  onDelete: (id: string) => void;
}

/**
 * 검색 히스토리 목록 컴포넌트
 */
export function SearchHistory({
  items,
  onItemClick,
  onDelete,
}: SearchHistoryProps) {
  if (items.length === 0) {
    return (
      <div className="px-4 py-6 text-center text-sm text-muted-foreground">
        최근 검색 기록이 없습니다
      </div>
    );
  }

  return (
    <div className="py-2">
      <div className="px-4 py-2 text-xs font-semibold text-muted-foreground">
        최근 검색
      </div>
      {items.map((item) => (
        <div
          key={item.id}
          className="flex items-center justify-between px-4 py-2 hover:bg-gray-50 transition-colors group"
        >
          <button
            onClick={() => onItemClick(item.query)}
            className="flex items-center gap-3 flex-1 min-w-0 text-left"
          >
            <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <span className="text-sm truncate">{item.query}</span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(item.id);
            }}
            className="p-1 rounded-full hover:bg-gray-200 opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="삭제"
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
      ))}
    </div>
  );
}
