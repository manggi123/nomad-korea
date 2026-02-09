import Image from 'next/image';
import Link from 'next/link';
import { Star, Wifi, Coffee, Users, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { City } from '@/types';

interface CityCardProps {
  city: City;
  showTrending?: boolean;
}

export default function CityCard({ city, showTrending = false }: CityCardProps) {
  return (
    <Link href={`/cities/${city.slug}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
        <div className="relative h-48 w-full">
          <Image
            src={city.imageUrl}
            alt={`${city.region} ${city.name}`}
            fill
            className="object-cover"
          />
          {showTrending && city.trendingScore && (
            <Badge className="absolute top-3 right-3 bg-orange-500 hover:bg-orange-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +{city.trendingScore}%
            </Badge>
          )}
        </div>

        <CardContent className="p-4">
          {/* 도시명 및 지역 */}
          <div className="mb-3">
            <h3 className="font-semibold text-lg mb-1">
              {city.region} · {city.name}
            </h3>
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                <span className="font-medium">{city.avgRating.toFixed(1)}</span>
              </div>
              <span className="text-sm text-muted-foreground">
                ({city.reviewCount}개 리뷰)
              </span>
            </div>
          </div>

          {/* 핵심 메트릭 */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">생활비</span>
              <span className="font-medium">
                {Math.floor(city.avgMonthlyCost / 10000)}만원
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Wifi className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{city.avgInternetSpeed}Mbps</span>
            </div>
            <div className="flex items-center gap-2">
              <Coffee className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{city.cafeCount}개</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{city.coworkingCount}개</span>
            </div>
          </div>

          {/* 점수 */}
          <div className="mt-3 pt-3 border-t grid grid-cols-4 gap-2 text-xs">
            <div className="text-center">
              <div className="text-muted-foreground mb-1">교통</div>
              <div className="font-medium">{city.transportScore}</div>
            </div>
            <div className="text-center">
              <div className="text-muted-foreground mb-1">환경</div>
              <div className="font-medium">{city.environmentScore}</div>
            </div>
            <div className="text-center">
              <div className="text-muted-foreground mb-1">개발</div>
              <div className="font-medium">{city.devScore}</div>
            </div>
            <div className="text-center">
              <div className="text-muted-foreground mb-1">디자인</div>
              <div className="font-medium">{city.designScore}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
