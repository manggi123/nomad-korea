"use client";

import { Star, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import CityCard from "@/components/city-card";
import { mockCities } from "@/lib/mock-data";

export default function TopRatedCities() {
  const topRatedCities = [...mockCities]
    .sort((a, b) => b.avgRating - a.avgRating)
    .slice(0, 9);

  const filters = [
    { label: "전체", value: "all", active: true },
    { label: "서울", value: "seoul" },
    { label: "경기", value: "gyeonggi" },
    { label: "부산", value: "busan" },
    { label: "제주", value: "jeju" },
    { label: "강원", value: "gangwon" },
  ];

  const sortOptions = [
    { label: "평점 높은순", value: "rating" },
    { label: "리뷰 많은순", value: "reviews" },
    { label: "월세 낮은순", value: "rent" },
    { label: "최신순", value: "recent" },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container px-4">
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
                    {filters.map((filter) => (
                      <button
                        key={filter.value}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                          filter.active
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
                      "100만원 이하",
                      "100-150만원",
                      "150-200만원",
                      "200만원 이상",
                    ].map((budget) => (
                      <label
                        key={budget}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input type="checkbox" className="rounded" />
                        <span className="text-sm">{budget}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Facilities Filter */}
                <div>
                  <h3 className="font-semibold mb-3">편의시설</h3>
                  <div className="space-y-2">
                    {["코워킹 스페이스", "카페", "빠른 인터넷", "24시간 이용"].map(
                      (facility) => (
                        <label
                          key={facility}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <input type="checkbox" className="rounded" />
                          <span className="text-sm">{facility}</span>
                        </label>
                      )
                    )}
                  </div>
                </div>

                <Button className="w-full">필터 적용</Button>
              </CardContent>
            </Card>
          </aside>

          {/* Cities Grid */}
          <div className="lg:col-span-3 space-y-6">
            {/* Mobile Filters & Sort */}
            <div className="flex gap-2 lg:hidden overflow-x-auto pb-2">
              <Button variant="outline" size="sm">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                필터
              </Button>
              {filters.slice(0, 4).map((filter) => (
                <Badge
                  key={filter.value}
                  variant={filter.active ? "default" : "outline"}
                  className="cursor-pointer whitespace-nowrap"
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
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {topRatedCities.map((city) => (
                <CityCard key={city.id} city={city} />
              ))}
            </div>

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
