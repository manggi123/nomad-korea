import type { City } from '@/types';
import { getRelatedCities } from '@/lib/city-utils';
import { mockCities } from '@/lib/mock-data';
import CityCard from '@/components/city-card';

interface RelatedCitiesProps {
  currentCity: City;
}

/**
 * 관련 도시 추천 컴포넌트 (서버 컴포넌트)
 */
export function RelatedCities({ currentCity }: RelatedCitiesProps) {
  const relatedCities = getRelatedCities(currentCity, mockCities, 3);

  // 관련 도시가 없으면 렌더링하지 않음
  if (relatedCities.length === 0) {
    return null;
  }

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold mb-6">이런 도시는 어떠세요?</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {relatedCities.map((city) => (
          <CityCard key={city.id} city={city} />
        ))}
      </div>
    </section>
  );
}
