# Phase 2: 도시 상세 페이지 완성도 향상

## 📋 개요

### 목표
사용자가 도시에 대한 풍부한 정보를 한눈에 파악하고, 다른 사용자의 리뷰를 통해 실제 경험을 확인할 수 있는 완성도 높은 상세 페이지를 구현합니다.

### 비즈니스 가치
- **사용자 가치**: 디지털 노마드가 도시 선택에 필요한 모든 정보(생활비, 인터넷 속도, 실제 리뷰)를 한 곳에서 확인 가능
- **기술적 가치**: 재사용 가능한 차트, 통계 카드, 리뷰 컴포넌트를 구축하여 향후 다른 페이지에서 활용 가능
- **차별화 요소**: 레이더 차트를 통한 도시별 특성 시각화, 직업군별 리뷰 필터링으로 타겟 정보 제공

### 예상 시간 & 우선순위
- **예상 시간**: M (4일)
- **우선순위**: P0 (필수 - 서비스의 핵심 페이지)
- **난이도**: 보통

---

## 🔍 문제 분해

### 사용자 여정
1. 사용자가 검색 결과 또는 홈페이지에서 도시 카드 클릭
2. 도시 상세 페이지(`/cities/[slug]`)로 이동
3. 히어로 이미지와 기본 정보 확인 (위치, 평점, 리뷰 수)
4. 스크롤하여 통계 카드 확인 (생활비, 인터넷 속도, 카페 수 등)
5. 레이더 차트로 도시 특성 파악 (교통, 환경, 개발자 점수 등)
6. 리뷰 목록을 직업별로 필터링하거나 정렬하여 확인
7. 관련 도시 추천 섹션에서 비슷한 도시 탐색
8. 공유 버튼으로 친구에게 도시 정보 공유

### 기능 분해 트리
```
Phase 2: 도시 상세 페이지
├── UI 레이어
│   ├── CityHero                 # 히어로 섹션 (이미지, 제목, 기본 정보)
│   ├── StatsGrid                # 통계 카드 그리드
│   │   └── StatCard             # 개별 통계 카드
│   ├── RadarChart               # 도시 평가 레이더 차트
│   ├── ReviewSection            # 리뷰 섹션
│   │   ├── ReviewFilters        # 정렬/필터 컨트롤
│   │   └── ReviewCard           # 개별 리뷰 카드 (재사용)
│   ├── RelatedCities            # 관련 도시 추천
│   │   └── CityCard             # 도시 카드 (재사용)
│   └── ShareButton              # 공유 버튼
├── 로직 레이어
│   ├── calculateCityStats()     # 도시 통계 계산
│   ├── filterReviewsByJob()     # 직업별 리뷰 필터링
│   ├── sortReviews()            # 리뷰 정렬
│   ├── findRelatedCities()      # 관련 도시 찾기
│   └── generateShareUrl()       # 공유 URL 생성
└── 상태 레이어
    ├── useReviewFilters()       # 리뷰 필터 상태 (URL)
    └── useShare()               # 공유 기능 상태
```

---

## ⚙️ 구현 계획

### Task 2.1: 도시 타입 정의 및 목 데이터 준비

**예상 시간**: 2시간

**파일 경로**:
- `types/city.ts` (생성)
- `data/cities.ts` (수정)

**구현 단계**:
- [ ] 1. City 타입 정의 (1시간)
  - 기본 정보: id, slug, name, region, description
  - 통계: monthlyBudget, internetSpeed, cafeCount, coworkingSpaces
  - 평가: scores (transportation, environment, developer, designer, etc)
  - 이미지: heroImage, thumbnailImage
- [ ] 2. CityStats 타입 정의 (30분)
- [ ] 3. 15개 도시 목 데이터 업데이트 (30분)
  - 실제 데이터 조사 및 입력

**검증 기준**:
- [ ] TypeScript 컴파일 에러 없음
- [ ] 모든 도시가 필수 필드를 포함함
- [ ] scores 값이 0-100 범위 내

**코드 스니펫**:
```typescript
// types/city.ts
export interface City {
  id: string;
  slug: string;
  name: string;
  region: 'Seoul' | 'Gyeonggi' | 'Busan' | 'Jeju' | 'etc';
  description: string;
  heroImage: string;
  thumbnailImage: string;

  // 통계
  monthlyBudget: number; // 원
  internetSpeed: number; // Mbps
  cafeCount: number;
  coworkingSpaces: number;

  // 평가 점수 (0-100)
  scores: {
    transportation: number;
    environment: number;
    developer: number;
    designer: number;
    student: number;
    overall: number;
  };

  // 메타
  reviewCount: number;
  averageRating: number;
}

export interface CityStats {
  label: string;
  value: string | number;
  icon: string;
  description?: string;
}
```

---

### Task 2.2: 도시 통계 유틸리티 함수 구현

**예상 시간**: 2시간

**파일 경로**:
- `lib/city-utils.ts` (생성)

**구현 단계**:
- [ ] 1. calculateCityStats 함수 (1시간)
  - City 객체를 받아 StatsGrid용 배열 반환
- [ ] 2. findRelatedCities 함수 (1시간)
  - 같은 지역 또는 비슷한 가격대 도시 찾기
  - 최대 3개 반환

**검증 기준**:
- [ ] 통계 계산이 정확함 (예산 포맷팅, 속도 단위 등)
- [ ] 관련 도시가 현재 도시를 제외하고 반환됨
- [ ] 빈 배열 입력 시 빈 배열 반환

**코드 스니펫**:
```typescript
// lib/city-utils.ts
import { City, CityStats } from '@/types/city';

export function calculateCityStats(city: City): CityStats[] {
  return [
    {
      label: '월 생활비',
      value: `${(city.monthlyBudget / 10000).toFixed(0)}만원`,
      icon: 'Wallet',
      description: '1인 기준 평균 생활비'
    },
    {
      label: '인터넷 속도',
      value: `${city.internetSpeed} Mbps`,
      icon: 'Wifi',
      description: '평균 다운로드 속도'
    },
    {
      label: '카페 수',
      value: city.cafeCount,
      icon: 'Coffee',
      description: '노마드 친화적 카페'
    },
    {
      label: '코워킹 스페이스',
      value: city.coworkingSpaces,
      icon: 'Building',
      description: '이용 가능한 공간'
    },
    {
      label: '평균 평점',
      value: city.averageRating.toFixed(1),
      icon: 'Star',
      description: `${city.reviewCount}개 리뷰 기준`
    }
  ];
}

export function findRelatedCities(
  currentCity: City,
  allCities: City[]
): City[] {
  // 1. 현재 도시 제외
  const otherCities = allCities.filter(c => c.id !== currentCity.id);

  // 2. 같은 지역 우선
  const sameRegion = otherCities.filter(c => c.region === currentCity.region);

  // 3. 비슷한 가격대 (±30%)
  const budgetRange = currentCity.monthlyBudget * 0.3;
  const similarBudget = otherCities.filter(c =>
    Math.abs(c.monthlyBudget - currentCity.monthlyBudget) <= budgetRange
  );

  // 4. 중복 제거 및 최대 3개
  const related = [...new Set([...sameRegion, ...similarBudget])];
  return related.slice(0, 3);
}
```

---

### Task 2.3: 리뷰 필터 및 정렬 상태 관리 훅

**예상 시간**: 2시간

**파일 경로**:
- `hooks/use-review-filters.ts` (생성)

**구현 단계**:
- [ ] 1. URL 쿼리 파라미터로 필터 상태 관리 (1시간)
  - job: Job | null
  - sort: 'latest' | 'rating' | 'likes'
- [ ] 2. setJobFilter, setSortOrder 함수 구현 (1시간)
  - URL 업데이트

**검증 기준**:
- [ ] URL이 /cities/seoul?job=developer&sort=latest 형식으로 업데이트됨
- [ ] 뒤로 가기/앞으로 가기 동작 정상

**코드 스니펫**:
```typescript
// hooks/use-review-filters.ts
"use client";

import { useSearchParams, useRouter } from 'next/navigation';
import { Job } from '@/types/review';

export type SortOption = 'latest' | 'rating' | 'likes';

export function useReviewFilters() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const jobFilter = searchParams.get('job') as Job | null;
  const sortOrder = (searchParams.get('sort') as SortOption) || 'latest';

  const setJobFilter = (job: Job | null) => {
    const params = new URLSearchParams(searchParams);
    if (job) {
      params.set('job', job);
    } else {
      params.delete('job');
    }
    router.push(`?${params.toString()}`);
  };

  const setSortOrder = (sort: SortOption) => {
    const params = new URLSearchParams(searchParams);
    params.set('sort', sort);
    router.push(`?${params.toString()}`);
  };

  return {
    jobFilter,
    sortOrder,
    setJobFilter,
    setSortOrder
  };
}
```

---

### Task 2.4: 통계 카드 컴포넌트 구현

**예상 시간**: 2시간

**파일 경로**:
- `components/stat-card.tsx` (생성)
- `components/stats-grid.tsx` (생성)

**구현 단계**:
- [ ] 1. StatCard 컴포넌트 (1시간)
  - 아이콘, 레이블, 값, 설명 표시
  - Lucide React 아이콘 사용
- [ ] 2. StatsGrid 컴포넌트 (1시간)
  - 반응형 그리드 레이아웃 (2열 → 3열 → 5열)
  - StatCard 배열 렌더링

**검증 기준**:
- [ ] 모바일(2열), 태블릿(3열), 데스크탑(5열) 레이아웃 확인
- [ ] 모든 아이콘이 올바르게 표시됨

**코드 스니펫**:
```typescript
// components/stat-card.tsx
import * as Icons from 'lucide-react';
import { CityStats } from '@/types/city';

export function StatCard({ stat }: { stat: CityStats }) {
  const Icon = Icons[stat.icon as keyof typeof Icons] as any;

  return (
    <div className="p-4 border rounded-lg bg-white hover:shadow-md transition-shadow">
      <div className="flex items-center gap-2 mb-2">
        {Icon && <Icon className="w-5 h-5 text-blue-600" />}
        <span className="text-sm text-gray-500">{stat.label}</span>
      </div>
      <div className="text-2xl font-bold mb-1">{stat.value}</div>
      {stat.description && (
        <p className="text-xs text-gray-400">{stat.description}</p>
      )}
    </div>
  );
}

// components/stats-grid.tsx
import { CityStats } from '@/types/city';
import { StatCard } from './stat-card';

export function StatsGrid({ stats }: { stats: CityStats[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {stats.map((stat, index) => (
        <StatCard key={index} stat={stat} />
      ))}
    </div>
  );
}
```

---

### Task 2.5: 레이더 차트 컴포넌트 구현

**예상 시간**: 3시간

**파일 경로**:
- `components/city-radar-chart.tsx` (생성)
- `package.json` (수정 - recharts 추가)

**구현 단계**:
- [ ] 1. recharts 라이브러리 설치 (10분)
  - `npm install recharts`
- [ ] 2. CityRadarChart 컴포넌트 (2시간)
  - RadarChart, PolarGrid, PolarAngleAxis 사용
  - 반응형 크기 조절
- [ ] 3. 범례 및 툴팁 추가 (50분)

**검증 기준**:
- [ ] 차트가 올바른 데이터로 렌더링됨
- [ ] 모바일에서도 차트가 읽기 쉬움
- [ ] 호버 시 툴팁 표시

**코드 스니펫**:
```typescript
// components/city-radar-chart.tsx
"use client";

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer
} from 'recharts';
import { City } from '@/types/city';

export function CityRadarChart({ city }: { city: City }) {
  const data = [
    { category: '교통', value: city.scores.transportation },
    { category: '환경', value: city.scores.environment },
    { category: '개발자', value: city.scores.developer },
    { category: '디자이너', value: city.scores.designer },
    { category: '학생', value: city.scores.student }
  ];

  return (
    <div className="w-full h-[300px] md:h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="category" />
          <PolarRadiusAxis domain={[0, 100]} />
          <Radar
            name={city.name}
            dataKey="value"
            stroke="#3b82f6"
            fill="#3b82f6"
            fillOpacity={0.6}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
```

---

### Task 2.6: 히어로 섹션 및 관련 도시 컴포넌트

**예상 시간**: 3시간

**파일 경로**:
- `components/city-hero.tsx` (생성)
- `components/related-cities.tsx` (생성)

**구현 단계**:
- [ ] 1. CityHero 컴포넌트 (2시간)
  - 배경 이미지 (Next.js Image)
  - 제목, 지역, 평점, 리뷰 수
  - 공유 버튼
- [ ] 2. RelatedCities 컴포넌트 (1시간)
  - CityCard 재사용
  - 가로 스크롤 또는 그리드

**검증 기준**:
- [ ] 이미지가 최적화되어 로드됨
- [ ] 공유 버튼 클릭 시 URL 복사됨
- [ ] 관련 도시 카드 클릭 시 해당 도시 페이지로 이동

**코드 스니펫**:
```typescript
// components/city-hero.tsx
import Image from 'next/image';
import { Star, MapPin, Share2 } from 'lucide-react';
import { City } from '@/types/city';

export function CityHero({ city }: { city: City }) {
  const handleShare = async () => {
    const url = window.location.href;
    await navigator.clipboard.writeText(url);
    alert('링크가 복사되었습니다!');
  };

  return (
    <div className="relative h-[300px] md:h-[400px] rounded-lg overflow-hidden">
      <Image
        src={city.heroImage}
        alt={city.name}
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
        <div className="flex items-center gap-2 mb-2">
          <MapPin className="w-4 h-4" />
          <span className="text-sm">{city.region}</span>
        </div>

        <h1 className="text-4xl font-bold mb-3">{city.name}</h1>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            <span className="font-semibold">{city.averageRating.toFixed(1)}</span>
            <span className="text-sm text-gray-300">({city.reviewCount})</span>
          </div>

          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition"
          >
            <Share2 className="w-4 h-4" />
            <span>공유</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// components/related-cities.tsx
import { City } from '@/types/city';
import { CityCard } from './city-card'; // 기존 컴포넌트 재사용

export function RelatedCities({ cities }: { cities: City[] }) {
  if (cities.length === 0) return null;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">관련 도시</h2>
      <div className="grid md:grid-cols-3 gap-4">
        {cities.map((city) => (
          <CityCard key={city.id} city={city} />
        ))}
      </div>
    </div>
  );
}
```

---

### Task 2.7: 리뷰 섹션 컴포넌트 (필터 및 정렬)

**예상 시간**: 2시간

**파일 경로**:
- `components/review-filters.tsx` (생성)
- `components/review-section.tsx` (생성)

**구현 단계**:
- [ ] 1. ReviewFilters 컴포넌트 (1시간)
  - 직업 필터 버튼 그룹
  - 정렬 드롭다운
- [ ] 2. ReviewSection 컴포넌트 (1시간)
  - 필터, 리뷰 목록 통합
  - 빈 상태 처리

**검증 기준**:
- [ ] 필터 버튼 클릭 시 URL 업데이트 및 리뷰 필터링
- [ ] 정렬 변경 시 리뷰 순서 변경
- [ ] 리뷰가 없을 때 "리뷰가 없습니다" 메시지 표시

**코드 스니펫**:
```typescript
// components/review-filters.tsx
"use client";

import { useReviewFilters, SortOption } from '@/hooks/use-review-filters';
import { Job } from '@/types/review';

const JOB_OPTIONS: { value: Job | null; label: string }[] = [
  { value: null, label: '전체' },
  { value: 'developer', label: '개발자' },
  { value: 'designer', label: '디자이너' },
  { value: 'student', label: '학생' },
  { value: 'teacher', label: '교사' },
  { value: 'etc', label: '기타' }
];

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'latest', label: '최신순' },
  { value: 'rating', label: '평점순' },
  { value: 'likes', label: '좋아요순' }
];

export function ReviewFilters() {
  const { jobFilter, sortOrder, setJobFilter, setSortOrder } = useReviewFilters();

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      {/* 직업 필터 */}
      <div className="flex gap-2 flex-wrap">
        {JOB_OPTIONS.map((option) => (
          <button
            key={option.label}
            onClick={() => setJobFilter(option.value)}
            className={`px-4 py-2 rounded-lg border transition ${
              jobFilter === option.value
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-700 border-gray-300 hover:border-blue-600'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* 정렬 */}
      <select
        value={sortOrder}
        onChange={(e) => setSortOrder(e.target.value as SortOption)}
        className="px-4 py-2 border rounded-lg bg-white"
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
```

---

### Task 2.8: 도시 상세 페이지 통합

**예상 시간**: 2시간

**파일 경로**:
- `app/cities/[slug]/page.tsx` (수정)

**구현 단계**:
- [ ] 1. slug로 도시 데이터 가져오기 (30분)
- [ ] 2. 모든 섹션 컴포넌트 배치 (1시간)
  - CityHero, StatsGrid, CityRadarChart, ReviewSection, RelatedCities
- [ ] 3. 메타 태그 추가 (SEO) (30분)

**검증 기준**:
- [ ] 모든 섹션이 올바르게 렌더링됨
- [ ] 존재하지 않는 slug 접근 시 404 페이지 표시
- [ ] 메타 태그가 올바르게 설정됨

**코드 스니펫**:
```typescript
// app/cities/[slug]/page.tsx
import { notFound } from 'next/navigation';
import { getCityBySlug, getAllCities } from '@/lib/cities';
import { calculateCityStats, findRelatedCities } from '@/lib/city-utils';
import { CityHero } from '@/components/city-hero';
import { StatsGrid } from '@/components/stats-grid';
import { CityRadarChart } from '@/components/city-radar-chart';
import { ReviewSection } from '@/components/review-section';
import { RelatedCities } from '@/components/related-cities';

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const city = getCityBySlug(params.slug);

  if (!city) {
    return {
      title: '도시를 찾을 수 없습니다'
    };
  }

  return {
    title: `${city.name} - Nomad Korea`,
    description: city.description,
    openGraph: {
      title: `${city.name} - Nomad Korea`,
      description: city.description,
      images: [city.heroImage]
    }
  };
}

export default function CityDetailPage({ params }: { params: { slug: string } }) {
  const city = getCityBySlug(params.slug);

  if (!city) {
    notFound();
  }

  const stats = calculateCityStats(city);
  const allCities = getAllCities();
  const relatedCities = findRelatedCities(city, allCities);

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-12">
      {/* 히어로 섹션 */}
      <CityHero city={city} />

      {/* 도시 설명 */}
      <section>
        <p className="text-lg text-gray-700 leading-relaxed">{city.description}</p>
      </section>

      {/* 통계 카드 */}
      <section>
        <h2 className="text-2xl font-bold mb-6">주요 정보</h2>
        <StatsGrid stats={stats} />
      </section>

      {/* 레이더 차트 */}
      <section>
        <h2 className="text-2xl font-bold mb-6">도시 특성</h2>
        <CityRadarChart city={city} />
      </section>

      {/* 리뷰 섹션 */}
      <ReviewSection citySlug={city.slug} />

      {/* 관련 도시 */}
      <RelatedCities cities={relatedCities} />
    </div>
  );
}
```

---

## 📁 파일 구조

### 신규 생성 파일
```
lib/
├── city-utils.ts              # 도시 관련 유틸리티 함수
└── cities.ts                  # 도시 데이터 가져오기 함수

hooks/
└── use-review-filters.ts      # 리뷰 필터 상태 관리 (URL)

components/
├── city-hero.tsx              # 히어로 섹션 (Client)
├── stat-card.tsx              # 통계 카드 (Server)
├── stats-grid.tsx             # 통계 그리드 (Server)
├── city-radar-chart.tsx       # 레이더 차트 (Client)
├── review-filters.tsx         # 리뷰 필터 (Client)
├── review-section.tsx         # 리뷰 섹션 (Client)
└── related-cities.tsx         # 관련 도시 (Server)

types/
└── city.ts                    # 도시 관련 타입

app/
└── cities/
    └── [slug]/
        └── page.tsx           # 도시 상세 페이지
```

### 수정할 파일
- `data/cities.ts` - 15개 도시 목 데이터 업데이트
- `package.json` - recharts 의존성 추가

---

## 📐 구현 원칙

### SOLID 원칙 적용
- **단일 책임 원칙 (SRP)**:
  - `city-utils.ts`: 도시 관련 계산만
  - `StatCard`: 통계 카드 표시만
  - `CityHero`: 히어로 섹션 표시만

- **개방-폐쇄 원칙 (OCP)**:
  - 새로운 통계 항목 추가 시 `calculateCityStats` 함수만 수정
  - 새로운 정렬 옵션 추가 시 `SortOption` 타입과 `SORT_OPTIONS` 배열만 수정

### 함수형 패턴
```typescript
// 파이프라인 패턴 (리뷰 처리)
const processedReviews = pipe(
  reviews,
  (r) => filterReviewsByJob(r, jobFilter),
  (r) => sortReviews(r, sortOrder)
);
```

### Server vs Client 컴포넌트
- **Server Component**: `StatCard`, `StatsGrid`, `RelatedCities` (표시만)
- **Client Component**: `CityHero` (공유 버튼), `CityRadarChart` (recharts), `ReviewFilters` (상호작용)

---

## 🔗 의존성

### Phase 간 의존성
- **필수 완료**: Phase 1 (검색 기능 - CityCard 컴포넌트 재사용)
- **권장 완료**: 없음
- **차단됨**: 없음

### Task 간 의존성
```
Task 2.1 (타입 정의)
  └─ Task 2.2 (유틸리티 함수)
      ├─ Task 2.3 (상태 관리 훅)
      ├─ Task 2.4 (통계 카드)
      └─ Task 2.5 (레이더 차트)
          └─ Task 2.6 (히어로 & 관련 도시)
              └─ Task 2.7 (리뷰 섹션)
                  └─ Task 2.8 (페이지 통합)
```

---

## 🧾 기술 부채

### 현재 Phase에서 발생 가능한 기술 부채
| ID | 설명 | 우선순위 | 해결 Phase |
|----|------|----------|------------|
| TD-201 | 목 데이터 사용 (실제 API 연동 필요) | P1 | Phase 4 |
| TD-202 | recharts 번들 크기 큼 (대안 검토 필요) | P2 | Phase 9 |
| TD-203 | 이미지 최적화 미흡 (WebP 변환 필요) | P2 | Phase 9 |
| TD-204 | 공유 기능이 URL 복사만 지원 (SNS 공유 미지원) | P2 | Phase 6 |

### 이전 Phase 기술 부채 해결
- 없음 (Phase 2가 첫 상세 페이지 구현)

---

## ✅ 품질 체크리스트

### 성능
- [ ] Next.js Image 컴포넌트로 이미지 최적화
- [ ] recharts lazy loading 적용
- [ ] 번들 크기 확인 (Next.js 빌드 분석)
- [ ] LCP(Largest Contentful Paint) 2.5초 이하

### 접근성 (a11y)
- [ ] 모든 이미지에 alt 텍스트
- [ ] 버튼에 aria-label 추가 (공유 버튼 등)
- [ ] 키보드 네비게이션 지원 (Tab, Enter)
- [ ] 색상 대비 4.5:1 이상

### 보안
- [ ] XSS 방지 (도시 설명 텍스트 이스케이프)
- [ ] 외부 링크에 rel="noopener noreferrer"

### 사용자 경험 (UX)
- [ ] 공유 버튼 클릭 시 피드백 제공 (토스트 알림)
- [ ] 레이더 차트 로딩 상태 표시
- [ ] 모바일 반응형 디자인
- [ ] 빈 상태 처리 (리뷰 없음, 관련 도시 없음)

### 코드 품질
- [ ] TypeScript 타입 안전성 (any 사용 금지)
- [ ] ESLint 경고 없음
- [ ] 함수 길이 50줄 이하
- [ ] 컴포넌트 복잡도 관리

---

## 🧪 최종 검증

### Given-When-Then 시나리오

**시나리오 1: 정상적인 도시 상세 페이지 접근**
```
Given: 사용자가 홈페이지에 있음
When: "서울" 도시 카드 클릭
Then:
  - /cities/seoul 페이지로 이동
  - 히어로 이미지와 제목 표시
  - 통계 카드 5개 표시 (생활비, 인터넷 속도, 카페 수, 코워킹, 평점)
  - 레이더 차트 표시
  - 리뷰 목록 표시
  - 관련 도시 3개 표시 (경기도 도시들)
```

**시나리오 2: 존재하지 않는 도시 접근**
```
Given: 사용자가 브라우저 주소창에 입력
When: /cities/invalid-city 접근
Then:
  - 404 페이지 표시
  - "도시를 찾을 수 없습니다" 메시지 표시
```

**시나리오 3: 리뷰 필터링 (직업별)**
```
Given: 서울 도시 상세 페이지에 있고, 10개 리뷰가 있음 (개발자 5개, 디자이너 3개, 학생 2개)
When: "개발자" 필터 버튼 클릭
Then:
  - URL이 /cities/seoul?job=developer로 변경
  - 개발자 리뷰 5개만 표시
  - 다른 직업 리뷰는 숨겨짐
```

**시나리오 4: 리뷰 정렬 (평점순)**
```
Given: 서울 도시 상세 페이지에 리뷰 5개가 있음 (평점: 4.5, 3.0, 5.0, 2.5, 4.0)
When: 정렬 드롭다운에서 "평점순" 선택
Then:
  - URL이 /cities/seoul?sort=rating으로 변경
  - 리뷰가 5.0 → 4.5 → 4.0 → 3.0 → 2.5 순서로 표시
```

**시나리오 5: 공유 버튼 클릭**
```
Given: 부산 도시 상세 페이지(/cities/busan)에 있음
When: 히어로 섹션의 "공유" 버튼 클릭
Then:
  - 클립보드에 "https://nomad-korea.com/cities/busan" 복사
  - "링크가 복사되었습니다!" 알림 표시
```

**시나리오 6: 레이더 차트 데이터 표시**
```
Given: 제주 도시 상세 페이지에 있음
When: "도시 특성" 섹션 확인
Then:
  - 레이더 차트 표시
  - 5개 축: 교통, 환경, 개발자, 디자이너, 학생
  - 각 점수가 0-100 범위 내에서 표시
  - 차트 영역이 파란색으로 채워짐
```

**시나리오 7: 관련 도시 추천**
```
Given: 인천 도시 상세 페이지에 있음 (지역: 경기도, 생활비: 150만원)
When: 페이지 하단의 "관련 도시" 섹션 확인
Then:
  - 같은 경기도 지역 도시 우선 표시 (수원, 성남 등)
  - 비슷한 가격대 도시 표시 (±30%)
  - 최대 3개 도시만 표시
  - 현재 도시(인천)는 제외
```

**시나리오 8: 모바일 반응형**
```
Given: 모바일 디바이스(375px)에서 접근
When: 도시 상세 페이지 확인
Then:
  - 히어로 이미지 높이 300px (데스크탑은 400px)
  - 통계 카드 2열 그리드 (데스크탑은 5열)
  - 레이더 차트 높이 300px (데스크탑은 400px)
  - 필터 버튼이 세로로 배치
```

### 수동 테스트 체크리스트
- [ ] 모든 도시(15개)의 상세 페이지가 올바르게 렌더링됨
- [ ] 통계 카드의 모든 값이 정확함 (생활비, 인터넷 속도 등)
- [ ] 레이더 차트가 올바른 데이터로 표시됨
- [ ] 리뷰 필터링 및 정렬이 올바르게 작동함
- [ ] 공유 버튼 클릭 시 URL이 클립보드에 복사됨
- [ ] 관련 도시가 현재 도시를 제외하고 표시됨
- [ ] 다양한 화면 크기에서 반응형 레이아웃 확인 (375px, 768px, 1024px, 1920px)
- [ ] 다양한 브라우저 테스트 (Chrome, Safari, Firefox)

---

## 📊 완료 기준

### 기능 완료
- [ ] 모든 Task (2.1 ~ 2.8) 완료
- [ ] 모든 검증 시나리오 통과
- [ ] 품질 체크리스트 통과

### 문서화
- [ ] 기술 부채 문서화 (TD-201 ~ TD-204)
- [ ] README 업데이트 (도시 데이터 구조 설명)

### 배포 준비
- [ ] 빌드 성공 (`npm run build`)
- [ ] 타입 체크 통과 (`npx tsc --noEmit`)
- [ ] Lint 통과 (`npm run lint`)
- [ ] Lighthouse 점수 확인 (Performance 80+, Accessibility 90+)

---

## 📝 참고 자료

- Next.js Image 최적화: https://nextjs.org/docs/app/building-your-application/optimizing/images
- Recharts 문서: https://recharts.org/
- Tailwind CSS 반응형: https://tailwindcss.com/docs/responsive-design
- WCAG 접근성 가이드: https://www.w3.org/WAI/WCAG21/quickref/
