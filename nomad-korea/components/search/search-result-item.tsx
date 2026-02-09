import { City } from '@/types';
import { MapPin, Star } from 'lucide-react';
import { SearchHighlight } from './search-highlight';

interface SearchResultItemProps {
  city: City;
  query: string;
  onClick: () => void;
  isSelected?: boolean;
}

/**
 * 개별 도시 검색 결과 아이템
 */
export function SearchResultItem({
  city,
  query,
  onClick,
  isSelected = false,
}: SearchResultItemProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors ${
        isSelected ? 'bg-gray-100' : ''
      }`}
    >
      <div className="flex items-start gap-3">
        {/* 도시 이미지 */}
        <div
          className="w-12 h-12 rounded-lg bg-cover bg-center flex-shrink-0"
          style={{ backgroundImage: `url(${city.imageUrl})` }}
        />

        {/* 도시 정보 */}
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm">
            <SearchHighlight text={city.name} query={query} />
          </div>
          <div className="text-xs text-muted-foreground flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            <SearchHighlight text={city.region} query={query} />
          </div>
        </div>

        {/* 평점 */}
        <div className="flex items-center gap-1 text-sm flex-shrink-0">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span className="font-semibold">{city.avgRating}</span>
        </div>
      </div>
    </button>
  );
}
