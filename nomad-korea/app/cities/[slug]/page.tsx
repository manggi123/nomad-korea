import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Coffee, Users, MapPin, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getCityBySlug, getReviewsByCity } from '@/lib/mock-data';
import { CityRadarChart } from '@/components/city-detail/city-radar-chart';
import { ShareButton } from '@/components/city-detail/share-button';
import { StatsCards } from '@/components/city-detail/stats-cards';
import { ReviewSection } from './review-section';
import { RelatedCities } from './related-cities';

interface CityPageProps {
  params: Promise<{ slug: string }>;
}

export default async function CityPage({ params }: CityPageProps) {
  const { slug } = await params;
  const city = getCityBySlug(slug);

  if (!city) {
    notFound();
  }

  const reviews = getReviewsByCity(city.id);

  return (
    <div className="min-h-screen">
      {/* 뒤로 가기 */}
      <div className="container px-4 py-4">
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
          <div className="container">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="h-5 w-5" />
              <span className="text-lg">{city.region}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{city.name}</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold text-lg">{city.avgRating.toFixed(1)}</span>
                <span className="text-white/80">({city.reviewCount}개 리뷰)</span>
              </div>
              <Badge className="text-base px-4 py-2">
                월 평균 {Math.floor(city.avgMonthlyCost / 10000)}만원
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container px-4 py-8">
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
            <ReviewSection initialReviews={reviews} />
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
                <div className="space-y-3">
                  {['카페 A', '카페 B', '카페 C'].map((cafe, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 rounded-lg border">
                      <Coffee className="h-5 w-5 text-muted-foreground" />
                      <div className="flex-1">
                        <div className="font-medium">{cafe}</div>
                        <div className="text-sm text-muted-foreground">
                          ⭐ 4.{5 - index}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 추천 코워킹 */}
            <Card>
              <CardHeader>
                <CardTitle>추천 코워킹 스페이스</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {['코워킹 A', '코워킹 B'].map((coworking, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 rounded-lg border">
                      <Users className="h-5 w-5 text-muted-foreground" />
                      <div className="flex-1">
                        <div className="font-medium">{coworking}</div>
                        <div className="text-sm text-muted-foreground">
                          일일 {15 + index * 5},000원
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
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
