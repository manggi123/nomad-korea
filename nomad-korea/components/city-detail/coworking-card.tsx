import type { CoworkingSpace } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, MapPin, Calendar, CreditCard } from 'lucide-react';

interface CoworkingCardProps {
  coworking: CoworkingSpace;
}

/**
 * 코워킹 스페이스 정보 카드 컴포넌트 (서버 컴포넌트)
 */
export function CoworkingCard({ coworking }: CoworkingCardProps) {
  // 가격 포맷팅
  const formatPrice = (price: number) => {
    return `${(price / 1000).toFixed(0)}천원`;
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">
          {coworking.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">{coworking.rating.toFixed(1)}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{formatPrice(coworking.dailyPrice)}/일</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <CreditCard className="h-4 w-4" />
            <span>{formatPrice(coworking.monthlyPrice)}/월</span>
          </div>
        </div>

        {coworking.amenities.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {coworking.amenities.slice(0, 4).map((amenity) => (
              <span
                key={amenity}
                className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-secondary text-secondary-foreground"
              >
                {amenity}
              </span>
            ))}
            {coworking.amenities.length > 4 && (
              <span className="inline-flex items-center px-2 py-0.5 text-xs text-muted-foreground">
                +{coworking.amenities.length - 4}
              </span>
            )}
          </div>
        )}

        <div className="flex items-start gap-1 text-xs text-muted-foreground">
          <MapPin className="h-3 w-3 mt-0.5 flex-shrink-0" />
          <span className="line-clamp-1">{coworking.address}</span>
        </div>
      </CardContent>
    </Card>
  );
}
