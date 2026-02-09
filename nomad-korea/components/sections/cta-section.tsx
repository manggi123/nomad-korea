"use client";

import { Star, Award, Gift, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function CTASection() {
  const benefits = [
    {
      icon: Star,
      title: "포인트 적립",
      description: "리뷰 작성 시 최대 1,000P",
    },
    {
      icon: Award,
      title: "뱃지 획득",
      description: "활동에 따른 특별 뱃지",
    },
    {
      icon: Gift,
      title: "월별 리워드",
      description: "우수 리뷰어 특별 혜택",
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-primary via-purple-600 to-pink-600 text-white">
      <div className="container px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              첫 리뷰를 작성하고 혜택을 받으세요
            </h2>
            <p className="text-lg text-white/90">
              당신의 노마드 경험이 다른 이들에게 큰 도움이 됩니다
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {benefits.map((benefit) => (
              <Card
                key={benefit.title}
                className="bg-white/10 backdrop-blur border-white/20 text-white"
              >
                <CardContent className="pt-6 text-center">
                  <div className="inline-flex p-3 bg-white/20 rounded-full mb-4">
                    <benefit.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{benefit.title}</h3>
                  <p className="text-sm text-white/80">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/reviews/new">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-white text-primary hover:bg-white/90 font-semibold px-8"
              >
                <Star className="mr-2 h-5 w-5" />
                첫 리뷰 작성하기
              </Button>
            </Link>
            <Link href="/cities">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-white text-white hover:bg-white/10"
              >
                도시 둘러보기
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-12 pt-8 border-t border-white/20">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-3xl font-bold mb-1">500P</div>
                <div className="text-sm text-white/80">첫 리뷰 보너스</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-1">24시간</div>
                <div className="text-sm text-white/80">평균 답변 시간</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-1">98%</div>
                <div className="text-sm text-white/80">만족도</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
