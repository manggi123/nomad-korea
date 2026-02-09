import { searchCities } from '@/lib/search';
import { applyCityFilters } from '@/lib/filter';
import { mockCities } from '@/lib/mock-data';
import { SearchFilters } from './search-filters';
import CityCard from '@/components/city-card';
import { Search } from 'lucide-react';

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
    region?: string;
    minRating?: string;
    minBudget?: string;
    maxBudget?: string;
  }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params.q || '';
  const selectedRegion = params.region;
  const minRating = params.minRating ? parseFloat(params.minRating) : undefined;
  const minBudget = params.minBudget
    ? parseInt(params.minBudget)
    : undefined;
  const maxBudget = params.maxBudget
    ? parseInt(params.maxBudget)
    : undefined;

  // 검색 실행
  let results = query ? searchCities(mockCities, query) : mockCities;

  // 필터 적용
  results = applyCityFilters(results, {
    regions: selectedRegion ? [selectedRegion] : undefined,
    minRating,
    minBudget,
    maxBudget,
  });

  return (
    <div className="container py-8">
      {/* 검색 헤더 */}
      <div className="mb-8">
        {query ? (
          <>
            <h1 className="text-3xl font-bold mb-2">
              &quot;{query}&quot; 검색 결과
            </h1>
            <p className="text-muted-foreground">
              {results.length}개의 도시를 찾았습니다
            </p>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold mb-2">모든 도시</h1>
            <p className="text-muted-foreground">
              {results.length}개의 도시가 있습니다
            </p>
          </>
        )}
      </div>

      {/* 레이아웃 */}
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
        {/* 필터 사이드바 (Desktop) */}
        <aside className="hidden lg:block">
          <div className="sticky top-4">
            <h2 className="text-lg font-semibold mb-4">필터</h2>
            <SearchFilters />
          </div>
        </aside>

        {/* 결과 목록 */}
        <main>
          {results.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {results.map((city) => (
                <CityCard key={city.id} city={city} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Search className="h-16 w-16 text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold mb-2">
                검색 결과가 없습니다
              </h2>
              <p className="text-muted-foreground max-w-md">
                다른 검색어를 시도하거나 필터를 변경해보세요
              </p>
            </div>
          )}
        </main>
      </div>

      {/* 모바일 필터 버튼 (나중에 모달로 구현 가능) */}
      <div className="lg:hidden fixed bottom-4 left-4 right-4">
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4">
          <h3 className="font-semibold mb-3">필터</h3>
          <SearchFilters />
        </div>
      </div>
    </div>
  );
}
