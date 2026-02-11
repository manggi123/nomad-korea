import type { Cafe } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, Wifi, Zap, MapPin } from 'lucide-react';

interface CafeCardProps {
  cafe: Cafe;
}

/**
 * 카페 정보 카드 컴포넌트 (서버 컴포넌트)
 */
export function CafeCard({ cafe }: CafeCardProps) {
  // 가격대 표시 (1: 저렴, 2: 보통, 3: 비싼)
  const priceDisplay = '₩'.repeat(cafe.priceLevel);

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-start justify-between">
          <span className="flex-1">{cafe.name}</span>
          <span className="text-sm font-normal text-muted-foreground ml-2">
            {priceDisplay}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">{cafe.rating.toFixed(1)}</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Wifi className="h-4 w-4" />
            <span>{cafe.wifiSpeed}Mbps</span>
          </div>
          {cafe.hasOutlet && (
            <div className="flex items-center gap-1 text-green-600">
              <Zap className="h-4 w-4" />
              <span className="text-xs">콘센트</span>
            </div>
          )}
        </div>
        <div className="flex items-start gap-1 text-xs text-muted-foreground">
          <MapPin className="h-3 w-3 mt-0.5 flex-shrink-0" />
          <span className="line-clamp-1">{cafe.address}</span>
        </div>
      </CardContent>
    </Card>
  );
}
