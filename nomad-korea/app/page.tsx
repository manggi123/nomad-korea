import HeroSection from '@/components/sections/hero-section';
import TrendingCities from '@/components/sections/trending-cities';
import TopRatedCities from '@/components/sections/top-rated-cities';
import BudgetRecommendations from '@/components/sections/budget-recommendations';
import LatestReviews from '@/components/sections/latest-reviews';
import RealtimeStats from '@/components/sections/realtime-stats';
import JobRecommendations from '@/components/sections/job-recommendations';
import CommunitySection from '@/components/sections/community-section';
import CTASection from '@/components/sections/cta-section';

export default function Home() {
  return (
    <>
      <HeroSection />
      <TrendingCities />
      <TopRatedCities />
      <BudgetRecommendations />
      <LatestReviews />
      <RealtimeStats />
      <JobRecommendations />
      <CommunitySection />
      <CTASection />
    </>
  );
}
