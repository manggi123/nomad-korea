import type { City } from '@/types';
import { createClient } from '@/lib/supabase/server';
import { getRelatedCities as getRelatedCitiesFromDb } from '@/lib/supabase/queries/cities';
import { transformDbCitiesToCities } from '@/lib/utils/type-transformers';
import CityCard from '@/components/city-card';

interface RelatedCitiesProps {
  currentCityId: string;
}

/**
 * 관련 도시 추천 컴포넌트 (서버 컴포넌트)
 * Supabase에서 관련 도시를 가져옵니다
 */
export async function RelatedCities({ currentCityId }: RelatedCitiesProps) {
  const supabase = await createClient();

  let relatedCities: City[] = [];
  try {
    const dbCities = await getRelatedCitiesFromDb(supabase, currentCityId, 3);
    relatedCities = transformDbCitiesToCities(dbCities || []);
  } catch {
    // 에러 발생 시 빈 배열
    relatedCities = [];
  }

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
