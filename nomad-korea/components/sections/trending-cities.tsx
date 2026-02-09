"use client";

import { TrendingUp, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import CityCard from "@/components/city-card";
import { mockCities } from "@/lib/mock-data";

export default function TrendingCities() {
  const trendingCities = mockCities.filter((city) => city.trendingScore).slice(0, 5);

  return (
    <section className="py-16 bg-white">
      <div className="container px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">인기 급상승 도시</h2>
              <p className="text-muted-foreground">지금 가장 핫한 노마드 도시</p>
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
          <div className="flex md:grid md:grid-cols-2 lg:grid-cols-5 gap-4 overflow-x-auto md:overflow-visible pb-4 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide">
            {trendingCities.map((city) => (
              <div key={city.id} className="min-w-[280px] md:min-w-0">
                <CityCard city={city} />
              </div>
            ))}
          </div>
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
