'use client';

import type { Tables } from '@/types/database.types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';

interface CityRadarChartProps {
  city: Tables<'cities'>;
}

/**
 * 도시 평가 레이더 차트 컴포넌트 (클라이언트 컴포넌트)
 */
export function CityRadarChart({ city }: CityRadarChartProps) {
  const data = [
    { subject: '교통', score: Number(city.transport_score) },
    { subject: '환경', score: Number(city.environment_score) },
    { subject: '개발자', score: Number(city.dev_score) },
    { subject: '디자이너', score: Number(city.design_score) },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>도시 종합 평가</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart data={data}>
            <PolarGrid />
            <PolarAngleAxis dataKey="subject" />
            <PolarRadiusAxis angle={90} domain={[0, 10]} />
            <Radar
              dataKey="score"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.6}
            />
          </RadarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
