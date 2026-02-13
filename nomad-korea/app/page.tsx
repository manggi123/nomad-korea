import { Suspense } from 'react';
import { createClient } from '@/lib/supabase/server';
import { getAllCities } from '@/lib/supabase/queries/cities';
import { transformDbCitiesToCities } from '@/lib/utils/type-transformers';
import HeroSection from '@/components/sections/hero-section';
import TrendingCities from '@/components/sections/trending-cities';
import TopRatedCities from '@/components/sections/top-rated-cities';
import BudgetRecommendations from '@/components/sections/budget-recommendations';
import LatestReviews from '@/components/sections/latest-reviews';
import RealtimeStats from '@/components/sections/realtime-stats';
import JobRecommendations from '@/components/sections/job-recommendations';
import CommunitySection from '@/components/sections/community-section';
import CTASection from '@/components/sections/cta-section';
import type { City } from '@/types';

// 빌드 시점 prerendering 비활성화 - cookies() 함수 사용을 위해 동적 렌더링 필요
export const dynamic = 'force-dynamic';

export default async function Home() {
  const supabase = await createClient();

  // 도시 데이터 가져오기 (DB 타입을 프론트엔드 타입으로 변환)
  let cities: City[];
  try {
    const dbCities = await getAllCities(supabase);
    cities = transformDbCitiesToCities(dbCities);
  } catch {
    cities = [];
  }

  return (
    <>
      <Suspense fallback={null}>
        <HeroSection />
      </Suspense>
      <Suspense fallback={null}>
        <TrendingCities cities={cities} />
      </Suspense>
      <Suspense fallback={null}>
        <TopRatedCities cities={cities} />
      </Suspense>
      <Suspense fallback={null}>
        <BudgetRecommendations />
      </Suspense>
      <LatestReviews />
      <RealtimeStats />
      <JobRecommendations />
      <CommunitySection />
      <CTASection />
    </>
  );
}
