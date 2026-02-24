"use client";

import { TrendingUp, ArrowRight, Filter } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import CityCard from "@/components/city-card";
import { City } from "@/types";
import { useHomeFilters } from "@/hooks/use-home-filters";
import { filterCities } from "@/lib/city-filters";
import { useMemo } from "react";

interface TrendingCitiesProps {
  cities: City[];
}

export default function TrendingCities({ cities }: TrendingCitiesProps) {
  const { filters, hasActiveFilters } = useHomeFilters();

  // 필터 적용
  const filteredCities = useMemo(() => {
    const filtered = hasActiveFilters
      ? filterCities(cities, filters)
      : cities.filter((city) => city.trendingScore && city.trendingScore > 0);

    return filtered
      .sort((a, b) => (b.trendingScore || 0) - (a.trendingScore || 0))
      .slice(0, 5);
  }, [cities, filters, hasActiveFilters]);

  return (
    <section className="py-16 bg-white" data-testid="trending-cities">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">
                {hasActiveFilters ? "필터 결과" : "인기 급상승 도시"}
              </h2>
              <p className="text-muted-foreground">
                {hasActiveFilters
                  ? `${filteredCities.length}개의 도시가 조건에 맞습니다`
                  : "지금 가장 핫한 노마드 도시"
                }
              </p>
            </div>
          </div>
          <Link href="/cities?filter=trending" className="hidden md:block">
            <Button variant="ghost">
              전체 보기
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Horizontal Scroll on Mobile, Grid on Desktop */}
        <div className="relative">
          {filteredCities.length > 0 ? (
            <div className="flex md:grid md:grid-cols-2 lg:grid-cols-5 gap-4 overflow-x-auto md:overflow-visible pb-4 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide">
              {filteredCities.map((city) => (
                <div key={city.id} className="min-w-[280px] md:min-w-0">
                  <CityCard city={city} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-muted/50 rounded-lg">
              <Filter className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">조건에 맞는 도시가 없습니다</h3>
              <p className="text-muted-foreground">필터 조건을 변경해보세요</p>
            </div>
          )}
        </div>

        {/* Mobile View All Button */}
        <div className="mt-6 md:hidden">
          <Link href="/cities?filter=trending" className="block">
            <Button variant="outline" className="w-full">
              전체 보기
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
