import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Star, Coffee, Users, MapPin, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getCityBySlug, getCafesByCity, getCoworkingSpacesByCity, mockCities } from '@/lib/mock-data';
import { getReviewsByCity } from '@/lib/review-storage';
import { CityRadarChart } from '@/components/city-detail/city-radar-chart';
import { ShareButton } from '@/components/city-detail/share-button';
import { StatsCards } from '@/components/city-detail/stats-cards';
import { CafeCard } from '@/components/city-detail/cafe-card';
import { CoworkingCard } from '@/components/city-detail/coworking-card';
import { EmptyState } from '@/components/city-detail/empty-state';
import { ReviewSection } from './review-section';
import { RelatedCities } from './related-cities';
import { CityLikesButton } from '@/components/city-likes-button';

interface CityPageProps {
  params: Promise<{ slug: string }>;
}

// 정적 생성을 위한 경로 생성
export async function generateStaticParams() {
  return mockCities.map((city) => ({
    slug: city.slug,
  }));
}

// SEO 메타데이터 생성
export async function generateMetadata({ params }: CityPageProps): Promise<Metadata> {
  const { slug } = await params;
  const city = getCityBySlug(slug);

  if (!city) {
    return {
      title: '도시를 찾을 수 없습니다',
      description: '요청하신 도시 정보를 찾을 수 없습니다.',
    };
  }

  const title = `${city.region} ${city.name} - 디지털 노마드 가이드 | Nomad Korea`;
  const description = `${city.region} ${city.name}에서의 디지털 노마드 생활 정보. 평균 생활비 ${Math.floor(city.avgMonthlyCost / 10000)}만원, ${city.reviewCount}개 리뷰, ${city.cafeCount}개 카페, ${city.coworkingCount}개 코워킹 스페이스. 평점 ${city.avgRating.toFixed(1)}/5.0`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: city.imageUrl,
          width: 800,
          height: 450,
          alt: `${city.region} ${city.name}`,
        },
      ],
      type: 'website',
      siteName: 'Nomad Korea',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [city.imageUrl],
    },
    alternates: {
      canonical: `/cities/${city.slug}`,
    },
  };
}

export default async function CityPage({ params }: CityPageProps) {
  const { slug } = await params;
  const city = getCityBySlug(slug);

  if (!city) {
    notFound();
  }

  const reviews = getReviewsByCity(city.id);
  const cafes = getCafesByCity(city.id);
  const coworkingSpaces = getCoworkingSpacesByCity(city.id);

  return (
    <div className="min-h-screen">
      {/* 뒤로 가기 */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/">
            <ChevronLeft className="h-4 w-4 mr-1" />
            돌아가기
          </Link>
        </Button>
      </div>

      {/* 도시 헤더 이미지 */}
      <div className="relative h-[300px] md:h-[400px] w-full">
        <Image
          src={city.imageUrl}
          alt={`${city.region} ${city.name}`}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute top-4 right-4">
          <ShareButton cityName={city.name} citySlug={city.slug} />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <div className="w-full max-w-7xl mx-auto">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="h-5 w-5" />
              <span className="text-lg">{city.region}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{city.name}</h1>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold text-lg">{city.avgRating.toFixed(1)}</span>
                <span className="text-white/80">({city.reviewCount}개 리뷰)</span>
              </div>
              <Badge className="text-base px-4 py-2">
                월 평균 {Math.floor(city.avgMonthlyCost / 10000)}만원
              </Badge>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1">
                <CityLikesButton cityId={city.id} size="md" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 메인 컨텐츠 */}
          <div className="lg:col-span-2 space-y-8">
            {/* 핵심 정보 */}
            <section>
              <h2 className="text-2xl font-bold mb-4">핵심 정보</h2>
              <StatsCards city={city} />
            </section>

            {/* 도시 종합 평가 레이더 차트 */}
            <CityRadarChart city={city} />

            {/* 리뷰 섹션 (필터/정렬/페이지네이션 포함) */}
            <ReviewSection
              initialReviews={reviews}
              cityId={city.id}
              cityName={`${city.region} ${city.name}`}
            />
          </div>

          {/* 사이드바 */}
          <div className="space-y-6">
            {/* 지도 플레이스홀더 */}
            <Card>
              <CardHeader>
                <CardTitle>위치</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <MapPin className="h-12 w-12 mx-auto mb-2" />
                    <p>지도 영역</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 추천 카페 */}
            <Card>
              <CardHeader>
                <CardTitle>추천 카페</CardTitle>
              </CardHeader>
              <CardContent>
                {cafes.length > 0 ? (
                  <div className="space-y-3">
                    {cafes.slice(0, 3).map((cafe) => (
                      <CafeCard key={cafe.id} cafe={cafe} />
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    icon={Coffee}
                    title="등록된 카페 정보가 없습니다"
                  />
                )}
              </CardContent>
            </Card>

            {/* 추천 코워킹 */}
            <Card>
              <CardHeader>
                <CardTitle>추천 코워킹 스페이스</CardTitle>
              </CardHeader>
              <CardContent>
                {coworkingSpaces.length > 0 ? (
                  <div className="space-y-3">
                    {coworkingSpaces.slice(0, 3).map((coworking) => (
                      <CoworkingCard key={coworking.id} coworking={coworking} />
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    icon={Users}
                    title="등록된 코워킹 스페이스 정보가 없습니다"
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* 관련 도시 추천 */}
        <RelatedCities currentCity={city} />
      </div>
    </div>
  );
}
