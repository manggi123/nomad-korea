"use client";

import { DollarSign, Check } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mockCities } from "@/lib/mock-data";

export default function BudgetRecommendations() {
  const budgetTiers = [
    {
      title: "알뜰형",
      budget: "~100만원",
      description: "합리적인 비용으로 노마드 라이프 시작",
      color: "bg-green-100 text-green-700",
      cities: mockCities.filter((c) => c.avgMonthlyCost <= 1000000).slice(0, 3),
    },
    {
      title: "표준형",
      budget: "100-150만원",
      description: "편의성과 가성비의 균형",
      color: "bg-blue-100 text-blue-700",
      cities: mockCities
        .filter((c) => c.avgMonthlyCost > 1000000 && c.avgMonthlyCost <= 1500000)
        .slice(0, 3),
    },
    {
      title: "프리미엄",
      budget: "150-200만원",
      description: "최상의 환경에서 최고의 생산성",
      color: "bg-purple-100 text-purple-700",
      cities: mockCities.filter((c) => c.avgMonthlyCost > 1500000).slice(0, 3),
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">예산별 추천 도시</h2>
              <p className="text-muted-foreground">
                내 예산에 맞는 최적의 도시를 찾아보세요
              </p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {budgetTiers.map((tier, index) => (
            <Card
              key={tier.title}
              className={`relative overflow-hidden ${
                index === 1 ? "border-2 border-primary shadow-lg" : ""
              }`}
            >
              {index === 1 && (
                <Badge className="absolute top-4 right-4 bg-primary">
                  인기
                </Badge>
              )}

              <CardHeader>
                <div className={`inline-flex px-3 py-1 rounded-full ${tier.color} text-sm font-semibold mb-2 w-fit`}>
                  {tier.title}
                </div>
                <CardTitle className="text-3xl font-bold mb-2">
                  {tier.budget}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {tier.description}
                </p>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {tier.cities.map((city) => (
                    <Link
                      key={city.id}
                      href={`/cities/${city.slug}`}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <Check className="h-4 w-4 text-primary" />
                        <div>
                          <div className="font-medium group-hover:text-primary">
                            {city.name}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {city.region} · 월 {Math.round(city.avgMonthlyCost / 10000)}만원
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <span className="font-semibold">{city.avgRating}</span>
                        <span className="text-yellow-400">★</span>
                      </div>
                    </Link>
                  ))}
                </div>

                <Button
                  variant={index === 1 ? "default" : "outline"}
                  className="w-full"
                >
                  더 많은 도시 보기
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Budget Calculator CTA */}
        <Card className="mt-8 bg-gradient-to-r from-primary/5 to-purple-50 border-none">
          <CardContent className="p-8 text-center">
            <h3 className="text-xl font-bold mb-2">
              내 예산에 딱 맞는 도시 찾기
            </h3>
            <p className="text-muted-foreground mb-4">
              예상 지출을 입력하면 AI가 최적의 도시를 추천해드립니다
            </p>
            <Button size="lg">예산 계산기 시작하기</Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
