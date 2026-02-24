import type { Tables } from '@/types/database.types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wifi, Coffee, Briefcase, DollarSign } from 'lucide-react';

interface StatsCardsProps {
  city: Tables<'cities'>;
}

/**
 * 도시 통계 카드 컴포넌트 (서버 컴포넌트)
 */
export function StatsCards({ city }: StatsCardsProps) {
  const stats = [
    {
      title: '평균 생활비',
      value: `${Math.round(city.avg_monthly_cost / 10000)}만원`,
      icon: DollarSign,
      description: '월 평균',
    },
    {
      title: '인터넷 속도',
      value: `${city.avg_internet_speed}Mbps`,
      icon: Wifi,
      description: '평균',
    },
    {
      title: '카페 수',
      value: `${city.cafe_count}개`,
      icon: Coffee,
      description: '주변',
    },
    {
      title: '코워킹 스페이스',
      value: `${city.coworking_count}개`,
      icon: Briefcase,
      description: '이용 가능',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Icon className="h-4 w-4" />
                {stat.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
