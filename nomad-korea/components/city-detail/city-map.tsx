'use client';

import { MapPin } from 'lucide-react';

interface CityMapProps {
  latitude: number | null;
  longitude: number | null;
  cityName: string;
}

export function CityMap({ latitude, longitude, cityName }: CityMapProps) {
  if (!latitude || !longitude) {
    return (
      <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <MapPin className="h-12 w-12 mx-auto mb-2" />
          <p>위치 정보 없음</p>
        </div>
      </div>
    );
  }

  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${longitude - 0.02},${latitude - 0.015},${longitude + 0.02},${latitude + 0.015}&layer=mapnik&marker=${latitude},${longitude}`;
  const externalMapUrl = `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=15/${latitude}/${longitude}`;

  return (
    <div className="space-y-2">
      <div className="aspect-square rounded-lg overflow-hidden border">
        <iframe
          width="100%"
          height="100%"
          frameBorder="0"
          scrolling="no"
          src={mapUrl}
          title={`${cityName} 위치`}
          className="w-full h-full"
        />
      </div>
      <a
        href={externalMapUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-primary hover:underline flex items-center gap-1"
      >
        <MapPin className="h-3 w-3" />
        큰 지도에서 보기
      </a>
    </div>
  );
}
