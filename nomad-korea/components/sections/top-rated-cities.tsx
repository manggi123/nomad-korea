"use client";

import { Star, SlidersHorizontal, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import CityCard from "@/components/city-card";
import { City } from "@/types";
import { useHomeFilters } from "@/hooks/use-home-filters";
import { filterCities } from "@/lib/city-filters";
import { useMemo } from "react";

interface TopRatedCitiesProps {
  cities: City[];
}

export default function TopRatedCities({ cities }: TopRatedCitiesProps) {
  const { filters, hasActiveFilters, setRegion, setBudget, setAmenity } = useHomeFilters();

  // 필터 적용
  const topRatedCities = useMemo(() => {
    const filtered = hasActiveFilters
      ? filterCities(cities, filters)
      : cities;

    return [...filtered]
      .sort((a, b) => b.avgRating - a.avgRating)
      .slice(0, 9);
  }, [cities, filters, hasActiveFilters]);

  const regionFilterOptions = [
    { label: "전체", value: "all" as const },
    { label: "서울", value: "seoul" as const },
    { label: "경기", value: "gyeonggi" as const },
    { label: "부산", value: "busan" as const },
    { label: "제주", value: "jeju" as const },
    { label: "강원", value: "gangwon" as const },
  ];

  const sortOptions = [
    { label: "평점 높은순", value: "rating" },
    { label: "리뷰 많은순", value: "reviews" },
    { label: "월세 낮은순", value: "rent" },
    { label: "최신순", value: "recent" },
  ];

  return (
    <section className="py-16 bg-gray-50" data-testid="top-rated-cities">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Star className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">평점 높은 도시</h2>
              <p className="text-muted-foreground">노마드들이 선택한 베스트 도시</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filter Sidebar - Desktop */}
          <aside className="hidden lg:block">
            <Card>
              <CardContent className="p-6 space-y-6">
                {/* Region Filter */}
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <SlidersHorizontal className="h-4 w-4" />
                    지역
                  </h3>
                  <div className="space-y-2">
                    {regionFilterOptions.map((filter) => (
                      <button
                        key={filter.value}
                        onClick={() => setRegion(filter.value)}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                          filters.region === filter.value
                            ? "bg-primary text-white"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        {filter.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Budget Filter */}
                <div>
                  <h3 className="font-semibold mb-3">월 예산</h3>
                  <div className="space-y-2">
                    {[
                      { label: "전체", value: "all" as const },
                      { label: "100만원 이하", value: "budget" as const },
                      { label: "100-150만원", value: "mid" as const },
                      { label: "150-200만원", value: "premium" as const },
                      { label: "200만원 이상", value: "luxury" as const },
                    ].map((budget) => (
                      <button
                        key={budget.value}
                        onClick={() => setBudget(budget.value)}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                          filters.budget === budget.value
                            ? "bg-primary text-white"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        {budget.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Facilities Filter */}
                <div>
                  <h3 className="font-semibold mb-3">편의시설</h3>
                  <div className="space-y-2">
                    {[
                      { label: "전체", value: "all" as const },
                      { label: "코워킹 많음 (3개+)", value: "coworking" as const },
                      { label: "카페 많음 (5개+)", value: "cafe" as const },
                      { label: "빠른 인터넷 (100Mbps+)", value: "fast-internet" as const },
                      { label: "환경 점수 높음 (4.0+)", value: "high-environment" as const },
                    ].map((facility) => (
                      <button
                        key={facility.value}
                        onClick={() => setAmenity(facility.value)}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                          filters.amenity === facility.value
                            ? "bg-primary text-white"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        {facility.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 필터는 실시간으로 적용되므로 별도의 적용 버튼 불필요 */}
              </CardContent>
            </Card>
          </aside>

          {/* Cities Grid */}
          <div className="lg:col-span-3 space-y-6">
            {/* Mobile Filters & Sort */}
            <div className="flex gap-2 lg:hidden overflow-x-auto pb-2">
              {regionFilterOptions.slice(0, 5).map((filter) => (
                <Badge
                  key={filter.value}
                  variant={filters.region === filter.value ? "default" : "outline"}
                  className="cursor-pointer whitespace-nowrap"
                  onClick={() => setRegion(filter.value)}
                >
                  {filter.label}
                </Badge>
              ))}
            </div>

            {/* Sort Options */}
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                총 <span className="font-semibold text-foreground">9</span>개 도시
              </div>
              <select className="text-sm border rounded-md px-3 py-1.5">
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Cities Grid */}
            {topRatedCities.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {topRatedCities.map((city) => (
                  <CityCard key={city.id} city={city} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-muted/50 rounded-lg">
                <Filter className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">조건에 맞는 도시가 없습니다</h3>
                <p className="text-muted-foreground">필터 조건을 변경해보세요</p>
              </div>
            )}

            {/* Load More */}
            <div className="text-center pt-4">
              <Button variant="outline" size="lg">
                더 보기
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
