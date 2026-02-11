"use client";

import { Search, DollarSign, MapPin, Cloud, Calendar, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useHomeFilters } from "@/hooks/use-home-filters";
import { Badge } from "@/components/ui/badge";

export default function HeroSection() {
  const {
    filters,
    setBudget,
    setRegion,
    setEnvironment,
    setSeason,
    resetFilters,
    hasActiveFilters,
    activeFilterCount,
  } = useHomeFilters();

  return (
    <section className="relative bg-gradient-to-br from-primary/5 via-primary/10 to-purple-50 py-16 md:py-24">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          {/* Main Heading */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              한국 최고의 노마드 도시는?
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              실제 디지털 노마드들이 평가한 도시별 리뷰와 정보를 확인하세요
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <div className="relative flex items-center">
              <Search className="absolute left-4 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="도시 이름, 지역, 태그로 검색..."
                className="w-full h-14 pl-12 pr-32 text-base shadow-lg"
              />
              <Button className="absolute right-2 h-10" size="lg">
                검색
              </Button>
            </div>
          </div>

          {/* Filter Selects - 각각 최대 너비 */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 max-w-4xl mx-auto">
              {/* 예산 필터 */}
              <Select value={filters.budget} onValueChange={setBudget}>
                <SelectTrigger className="w-full h-12 shadow-md hover:shadow-lg transition-shadow">
                  <DollarSign className="h-4 w-4 mr-2 text-primary" />
                  <SelectValue placeholder="예산" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체 예산</SelectItem>
                  <SelectItem value="budget">~100만원</SelectItem>
                  <SelectItem value="mid">100-150만원</SelectItem>
                  <SelectItem value="premium">150-200만원</SelectItem>
                  <SelectItem value="luxury">200만원 이상</SelectItem>
                </SelectContent>
              </Select>

              {/* 지역 필터 */}
              <Select value={filters.region} onValueChange={setRegion}>
                <SelectTrigger className="w-full h-12 shadow-md hover:shadow-lg transition-shadow">
                  <MapPin className="h-4 w-4 mr-2 text-primary" />
                  <SelectValue placeholder="지역" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체 지역</SelectItem>
                  <SelectItem value="seoul">서울</SelectItem>
                  <SelectItem value="gyeonggi">경기</SelectItem>
                  <SelectItem value="busan">부산</SelectItem>
                  <SelectItem value="jeju">제주</SelectItem>
                  <SelectItem value="gangwon">강원</SelectItem>
                  <SelectItem value="chungcheong">충청</SelectItem>
                  <SelectItem value="jeolla">전라</SelectItem>
                  <SelectItem value="gyeongsang">경상</SelectItem>
                </SelectContent>
              </Select>

              {/* 환경 필터 */}
              <Select value={filters.environment} onValueChange={setEnvironment}>
                <SelectTrigger className="w-full h-12 shadow-md hover:shadow-lg transition-shadow">
                  <Cloud className="h-4 w-4 mr-2 text-primary" />
                  <SelectValue placeholder="환경" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체 환경</SelectItem>
                  <SelectItem value="urban">도심</SelectItem>
                  <SelectItem value="suburb">교외</SelectItem>
                  <SelectItem value="nature">자연</SelectItem>
                  <SelectItem value="beach">해변</SelectItem>
                  <SelectItem value="mountain">산악</SelectItem>
                </SelectContent>
              </Select>

              {/* 계절 필터 */}
              <Select value={filters.season} onValueChange={setSeason}>
                <SelectTrigger className="w-full h-12 shadow-md hover:shadow-lg transition-shadow">
                  <Calendar className="h-4 w-4 mr-2 text-primary" />
                  <SelectValue placeholder="계절" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">연중</SelectItem>
                  <SelectItem value="spring">봄 (3-5월)</SelectItem>
                  <SelectItem value="summer">여름 (6-8월)</SelectItem>
                  <SelectItem value="fall">가을 (9-11월)</SelectItem>
                  <SelectItem value="winter">겨울 (12-2월)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 활성 필터 표시 및 초기화 버튼 */}
            {hasActiveFilters && (
              <div className="flex items-center justify-center gap-2 flex-wrap">
                <Badge variant="secondary" className="text-sm">
                  {activeFilterCount}개 필터 적용 중
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetFilters}
                  className="h-8 text-sm"
                >
                  <X className="h-3 w-3 mr-1" />
                  필터 초기화
                </Button>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 max-w-xl mx-auto pt-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">15+</div>
              <div className="text-sm text-muted-foreground">도시</div>
            </div>
            <div className="text-center border-x">
              <div className="text-3xl font-bold text-primary">2,300+</div>
              <div className="text-sm text-muted-foreground">리뷰</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">1,247</div>
              <div className="text-sm text-muted-foreground">현재 작업 중</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
