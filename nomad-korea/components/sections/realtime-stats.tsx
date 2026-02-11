"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, TrendingUp, TrendingDown } from 'lucide-react';
import { mockRealtimeStats } from '@/lib/mock-data';

export default function RealtimeStats() {
  const { currentWorking, monthlyPopular } = mockRealtimeStats;

  return (
    <section className="py-12 md:py-16">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 타이틀 */}
        <div className="mb-6">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">📊 실시간 통계</h2>
          <p className="text-muted-foreground">지금 이 순간의 노마드 활동</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 현재 작업 중 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-green-500" />
                현재 작업 중
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {currentWorking.map((stat, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-medium">
                        {index + 1}
                      </div>
                      <span className="font-medium">{stat.cityName}</span>
                    </div>
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {stat.count}명
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 이번 달 인기 도시 랭킹 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-orange-500" />
                이번 달 인기 도시
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {monthlyPopular.map((stat) => (
                  <div
                    key={stat.rank}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div
                        className={`flex items-center justify-center w-8 h-8 rounded-full font-medium ${
                          stat.rank === 1
                            ? 'bg-yellow-100 text-yellow-700'
                            : stat.rank === 2
                            ? 'bg-gray-100 text-gray-700'
                            : stat.rank === 3
                            ? 'bg-orange-100 text-orange-700'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {stat.rank}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{stat.cityName}</div>
                        <div className="text-sm text-muted-foreground">
                          {stat.reviewCount}개 리뷰
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {stat.change > 0 ? (
                        <>
                          <TrendingUp className="h-4 w-4 text-green-500" />
                          <span className="text-sm text-green-500">+{stat.change}</span>
                        </>
                      ) : stat.change < 0 ? (
                        <>
                          <TrendingDown className="h-4 w-4 text-red-500" />
                          <span className="text-sm text-red-500">{stat.change}</span>
                        </>
                      ) : (
                        <span className="text-sm text-muted-foreground">-</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
