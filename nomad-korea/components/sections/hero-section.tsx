"use client";

import { Search, MapPin, Briefcase, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function HeroSection() {
  const quickFilters = [
    { icon: MapPin, label: "서울", value: "seoul" },
    { icon: MapPin, label: "제주", value: "jeju" },
    { icon: MapPin, label: "부산", value: "busan" },
    { icon: Briefcase, label: "코워킹", value: "coworking" },
    { icon: DollarSign, label: "저렴한", value: "budget" },
  ];

  return (
    <section className="relative bg-gradient-to-br from-primary/5 via-primary/10 to-purple-50 py-16 md:py-24">
      <div className="container px-4">
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

          {/* Quick Filters */}
          <div className="flex flex-wrap justify-center gap-2">
            {quickFilters.map((filter) => (
              <Badge
                key={filter.value}
                variant="secondary"
                className="px-4 py-2 text-sm cursor-pointer hover:bg-primary hover:text-white transition-colors"
              >
                <filter.icon className="h-4 w-4 mr-1" />
                {filter.label}
              </Badge>
            ))}
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
