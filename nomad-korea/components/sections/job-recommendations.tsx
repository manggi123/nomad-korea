"use client";

import { Briefcase, Code, Palette, Megaphone, PenTool, Video, Lightbulb } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockCities } from "@/lib/mock-data";

export default function JobRecommendations() {
  const jobTypes = [
    {
      id: "developer",
      label: "개발자",
      icon: Code,
      description: "코워킹 스페이스와 빠른 인터넷이 중요한 개발자를 위한 도시",
      priorities: ["코워킹", "인터넷", "카페"],
      cities: [
        { ...mockCities[6], reason: "IT 기업 밀집, 최고의 코워킹 인프라" },
        { ...mockCities[0], reason: "다양한 네트워킹, 24시간 카페" },
        { ...mockCities[1], reason: "스타트업 문화, 힙한 작업 환경" },
      ],
    },
    {
      id: "designer",
      label: "디자이너",
      icon: Palette,
      description: "영감을 주는 공간과 감각적인 카페가 있는 도시",
      priorities: ["카페", "문화", "분위기"],
      cities: [
        { ...mockCities[1], reason: "감각적인 카페, 전시 공간 많음" },
        { ...mockCities[2], reason: "예술적 분위기, 다양한 갤러리" },
        { ...mockCities[3], reason: "자연에서 얻는 영감, 힐링" },
      ],
    },
    {
      id: "marketer",
      label: "마케터",
      icon: Megaphone,
      description: "트렌드를 빠르게 읽을 수 있는 핫플레이스",
      priorities: ["트렌드", "네트워킹", "접근성"],
      cities: [
        { ...mockCities[0], reason: "트렌드의 중심, 다양한 미팅 공간" },
        { ...mockCities[1], reason: "새로운 브랜드 경험, 마케팅 인사이트" },
        { ...mockCities[4], reason: "관광 산업 발달, 다양한 케이스 스터디" },
      ],
    },
    {
      id: "writer",
      label: "작가",
      icon: PenTool,
      description: "조용하고 집중할 수 있는 환경의 도시",
      priorities: ["조용함", "자연", "카페"],
      cities: [
        { ...mockCities[3], reason: "바다 뷰, 조용한 카페, 힐링" },
        { ...mockCities[11], reason: "커피의 도시, 글쓰기 최적화" },
        { ...mockCities[8], reason: "한옥 카페, 전통적 분위기" },
      ],
    },
    {
      id: "video",
      label: "영상PD",
      icon: Video,
      description: "다양한 촬영 로케이션과 장비 대여가 가능한 도시",
      priorities: ["촬영지", "장비", "이동성"],
      cities: [
        { ...mockCities[3], reason: "자연 경관, 다양한 촬영 명소" },
        { ...mockCities[4], reason: "해변 촬영, 관광 콘텐츠" },
        { ...mockCities[8], reason: "전통 한옥, 문화 콘텐츠" },
      ],
    },
    {
      id: "planner",
      label: "기획자",
      icon: Lightbulb,
      description: "다양한 경험과 인사이트를 얻을 수 있는 도시",
      priorities: ["문화", "다양성", "네트워킹"],
      cities: [
        { ...mockCities[2], reason: "다양한 문화 활동, 창의적 환경" },
        { ...mockCities[0], reason: "비즈니스 미팅, 트렌드 체험" },
        { ...mockCities[1], reason: "혁신적 공간, 새로운 경험" },
      ],
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Briefcase className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">직업군별 추천</h2>
              <p className="text-muted-foreground">
                내 직업에 최적화된 도시를 찾아보세요
              </p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="developer" className="w-full">
          <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 h-auto">
            {jobTypes.map((job) => (
              <TabsTrigger
                key={job.id}
                value={job.id}
                className="flex flex-col md:flex-row items-center gap-1 md:gap-2 py-3"
              >
                <job.icon className="h-4 w-4" />
                <span className="text-xs md:text-sm">{job.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {jobTypes.map((job) => (
            <TabsContent key={job.id} value={job.id} className="mt-6">
              <Card className="mb-6 bg-gradient-to-br from-purple-50 to-blue-50 border-none">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-white rounded-lg shadow-sm">
                      <job.icon className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-2">{job.label} 추천 기준</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        {job.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {job.priorities.map((priority) => (
                          <Badge key={priority} variant="secondary">
                            {priority}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-3 gap-6">
                {job.cities.map((city, index) => (
                  <Link key={city.id} href={`/cities/${city.slug}`}>
                    <Card className="h-full hover:shadow-lg transition-shadow group">
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <Badge variant="outline" className="mb-2">
                              {city.region}
                            </Badge>
                            <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                              {city.name}
                            </h3>
                          </div>
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                              index === 0
                                ? "bg-gradient-to-br from-yellow-400 to-orange-400 text-white"
                                : index === 1
                                ? "bg-gradient-to-br from-gray-300 to-gray-400 text-white"
                                : "bg-gradient-to-br from-orange-300 to-orange-400 text-white"
                            }`}
                          >
                            {index + 1}
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">평점</span>
                            <div className="flex items-center gap-1">
                              <span className="font-semibold">{city.avgRating}</span>
                              <span className="text-yellow-400">★</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">월 예산</span>
                            <span className="font-semibold">{Math.round(city.avgMonthlyCost / 10000)}만원</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">코워킹</span>
                            <span className="font-semibold">{city.coworkingCount}곳</span>
                          </div>
                        </div>

                        <div className="mt-4 pt-4 border-t">
                          <div className="text-sm font-medium text-primary mb-1">
                            추천 이유
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {city.reason}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}
