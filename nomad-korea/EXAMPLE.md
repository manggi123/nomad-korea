# Phase 3: 리뷰 작성 및 상호작용 기능

## 📋 개요

### 목표
사용자가 도시에 대한 리뷰를 작성하고, 다른 사용자의 리뷰에 좋아요를 누를 수 있는 상호작용 기능을 구현합니다.

### 비즈니스 가치
- **사용자 가치**: 디지털 노마드가 실제 경험을 공유하고, 직업별로 유용한 정보를 얻을 수 있음
- **기술적 가치**: 상태 관리, 폼 처리, 유효성 검사 패턴을 확립하여 향후 기능(Q&A, 댓글 등)에 재사용 가능
- **차별화 요소**: 직업별 리뷰 필터링으로 타겟 사용자에게 맞춤형 정보 제공

### 예상 시간 & 우선순위
- **예상 시간**: M (4일)
- **우선순위**: P0 (필수)
- **난이도**: 보통

---

## 🔍 문제 분해

### 사용자 여정
1. 사용자가 도시 상세 페이지에서 다른 사용자의 리뷰를 확인
2. "리뷰 작성" 버튼 클릭하여 폼 표시
3. 별점(1-5), 직업(developer/designer/etc), 리뷰 텍스트 입력
4. "제출" 버튼 클릭
5. 유효성 검사 통과 후 리뷰가 목록에 추가됨
6. 다른 사용자 리뷰에 좋아요 클릭 (선택)

### 기능 분해 트리
```
Phase 3: 리뷰 작성 및 상호작용
├── UI 레이어
│   ├── ReviewForm               # 리뷰 작성 폼
│   │   ├── StarRating           # 별점 입력 (1-5)
│   │   ├── JobSelector          # 직업 선택 드롭다운
│   │   ├── TextArea             # 리뷰 텍스트 입력
│   │   └── SubmitButton         # 제출 버튼
│   ├── ReviewList               # 리뷰 목록 표시
│   │   └── ReviewCard           # 개별 리뷰 카드
│   │       ├── StarDisplay      # 별점 표시
│   │       ├── JobBadge         # 직업 뱃지
│   │       └── LikeButton       # 좋아요 버튼
│   └── ReviewFilters            # 직업별 필터
├── 로직 레이어
│   ├── validateReview()         # 리뷰 유효성 검사
│   ├── calculateAverageRating() # 평균 별점 계산
│   ├── filterReviewsByJob()     # 직업별 필터링
│   └── sortReviewsByDate()      # 날짜순 정렬
└── 상태 레이어
    ├── useReviewForm()          # 폼 상태 관리
    ├── useReviewFilters()       # 필터 상태 (URL)
    └── useLike()                # 좋아요 상태 관리
```

---

## ⚙️ 구현 계획

### Task 3.1: 리뷰 타입 정의 및 유효성 검사

**예상 시간**: 2시간

**파일 경로**:
- `types/review.ts` (생성)
- `lib/review-validation.ts` (생성)

**구현 단계**:
- [ ] 1. Review 타입 정의 (30분)
  - id, citySlug, rating, job, text, likes, createdAt
- [ ] 2. ReviewInput 타입 정의 (15분)
  - rating, job, text (id, citySlug는 서버에서 생성)
- [ ] 3. Job 타입 정의 (15분)
  - 'developer' | 'designer' | 'student' | 'teacher' | 'etc'
- [ ] 4. validateReview 함수 구현 (45분)
  - 별점 1-5 검증
  - 텍스트 최소 10자, 최대 500자 검증
  - 직업 유효성 검증
- [ ] 5. 유효성 검사 테스트 (15분)

**검증 기준**:
- [ ] TypeScript 컴파일 에러 없음
- [ ] 유효성 검사 함수가 올바른 에러 메시지 반환
- [ ] Job 타입이 정확히 5가지만 허용

**코드 스니펫**:
```typescript
// types/review.ts
export type Job = 'developer' | 'designer' | 'student' | 'teacher' | 'etc';

export interface Review {
  id: string;
  citySlug: string;
  rating: number; // 1-5
  job: Job;
  text: string;
  likes: number;
  createdAt: Date;
}

export interface ReviewInput {
  rating: number;
  job: Job;
  text: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

// lib/review-validation.ts
import { ReviewInput, ValidationResult } from '@/types/review';

export function validateReview(review: ReviewInput): ValidationResult {
  const errors: string[] = [];

  if (!review.rating || review.rating < 1 || review.rating > 5) {
    errors.push('별점은 1-5 사이여야 합니다');
  }

  if (!review.text || review.text.trim().length < 10) {
    errors.push('리뷰는 최소 10자 이상이어야 합니다');
  }

  if (review.text && review.text.length > 500) {
    errors.push('리뷰는 최대 500자까지 작성 가능합니다');
  }

  const validJobs: Job[] = ['developer', 'designer', 'student', 'teacher', 'etc'];
  if (!review.job || !validJobs.includes(review.job)) {
    errors.push('유효한 직업을 선택해주세요');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}
```

---

### Task 3.2: 리뷰 유틸리티 함수 구현

**예상 시간**: 2시간

**파일 경로**:
- `lib/review-utils.ts` (생성)

**구현 단계**:
- [ ] 1. calculateAverageRating 함수 (30분)
  - 빈 배열 처리
  - 소수점 1자리 반올림
- [ ] 2. filterReviewsByJob 함수 (30분)
  - job이 null이면 전체 반환
  - job이 있으면 필터링
- [ ] 3. sortReviewsByDate 함수 (30분)
  - 'latest' (최신순) 또는 'oldest' (오래된순)
- [ ] 4. paginateReviews 함수 (30분)
  - 페이지당 10개씩 분할

**검증 기준**:
- [ ] 빈 배열 입력 시 올바른 기본값 반환
- [ ] 필터링 결과가 정확함
- [ ] 정렬 순서가 올바름

**코드 스니펫**:
```typescript
// lib/review-utils.ts
import { Review, Job } from '@/types/review';

export function calculateAverageRating(reviews: Review[]): number {
  if (reviews.length === 0) return 0;

  const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
  return Math.round((sum / reviews.length) * 10) / 10; // 소수점 1자리
}

export function filterReviewsByJob(
  reviews: Review[],
  job: Job | null
): Review[] {
  if (!job) return reviews;
  return reviews.filter(review => review.job === job);
}

export function sortReviewsByDate(
  reviews: Review[],
  order: 'latest' | 'oldest'
): Review[] {
  return [...reviews].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return order === 'latest' ? dateB - dateA : dateA - dateB;
  });
}

export function paginateReviews(
  reviews: Review[],
  page: number,
  perPage: number = 10
): Review[] {
  const start = (page - 1) * perPage;
  const end = start + perPage;
  return reviews.slice(start, end);
}
```

---

### Task 3.3: 리뷰 폼 상태 관리 훅

**예상 시간**: 3시간

**파일 경로**:
- `hooks/use-review-form.ts` (생성)

**구현 단계**:
- [ ] 1. useState로 폼 필드 관리 (1시간)
  - rating, job, text, errors, isSubmitting
- [ ] 2. 유효성 검사 통합 (30분)
  - validateReview 호출
- [ ] 3. submitReview 함수 구현 (1시간)
  - 유효성 검사
  - 로컬스토리지에 저장 (임시, Phase 4에서 API로 변경)
  - 성공 시 폼 초기화
- [ ] 4. 에러 처리 (30분)

**검증 기준**:
- [ ] 유효성 검사 실패 시 에러 메시지 표시
- [ ] 제출 성공 시 폼 초기화
- [ ] isSubmitting 상태가 올바르게 변경됨

**코드 스니펫**:
```typescript
// hooks/use-review-form.ts
"use client";

import { useState } from 'react';
import { ReviewInput, Job } from '@/types/review';
import { validateReview } from '@/lib/review-validation';

export function useReviewForm(citySlug: string) {
  const [rating, setRating] = useState<number>(0);
  const [job, setJob] = useState<Job | null>(null);
  const [text, setText] = useState<string>('');
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const submitReview = async () => {
    // 1. 유효성 검사
    if (!job) {
      setErrors(['직업을 선택해주세요']);
      return;
    }

    const reviewInput: ReviewInput = { rating, job, text };
    const validation = validateReview(reviewInput);

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    // 2. 제출
    setIsSubmitting(true);
    setErrors([]);

    try {
      // 임시: 로컬스토리지에 저장 (Phase 4에서 API로 변경)
      const newReview = {
        id: Date.now().toString(),
        citySlug,
        rating,
        job,
        text,
        likes: 0,
        createdAt: new Date().toISOString()
      };

      const existingReviews = localStorage.getItem(`reviews-${citySlug}`);
      const reviews = existingReviews ? JSON.parse(existingReviews) : [];
      reviews.push(newReview);
      localStorage.setItem(`reviews-${citySlug}`, JSON.stringify(reviews));

      // 3. 폼 초기화
      setRating(0);
      setJob(null);
      setText('');
    } catch (error) {
      setErrors(['리뷰 제출 중 오류가 발생했습니다']);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    rating,
    setRating,
    job,
    setJob,
    text,
    setText,
    errors,
    isSubmitting,
    submitReview
  };
}
```

---

### Task 3.4: 리뷰 필터 상태 관리 훅 (URL)

**예상 시간**: 2시간

**파일 경로**:
- `hooks/use-review-filters.ts` (생성)

**구현 단계**:
- [ ] 1. useSearchParams로 URL 파라미터 읽기 (30분)
  - job, sort
- [ ] 2. setJobFilter 함수 구현 (1시간)
  - URL 업데이트
- [ ] 3. setSortOrder 함수 구현 (30분)

**검증 기준**:
- [ ] URL이 올바르게 업데이트됨 (/cities/seoul?job=developer&sort=latest)
- [ ] 뒤로 가기/앞으로 가기 동작 정상

**코드 스니펫**:
```typescript
// hooks/use-review-filters.ts
"use client";

import { useSearchParams, useRouter } from 'next/navigation';
import { Job } from '@/types/review';

export function useReviewFilters() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const jobFilter = searchParams.get('job') as Job | null;
  const sortOrder = (searchParams.get('sort') as 'latest' | 'oldest') || 'latest';

  const setJobFilter = (job: Job | null) => {
    const params = new URLSearchParams(searchParams);
    if (job) {
      params.set('job', job);
    } else {
      params.delete('job');
    }
    router.push(`?${params.toString()}`);
  };

  const setSortOrder = (sort: 'latest' | 'oldest') => {
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

### Task 3.5: 별점 입력 컴포넌트

**예상 시간**: 2시간

**파일 경로**:
- `components/star-rating.tsx` (생성)

**구현 단계**:
- [ ] 1. 별 아이콘 5개 렌더링 (30분)
  - Lucide React 사용 (Star, StarOff)
- [ ] 2. 클릭 이벤트 처리 (1시간)
  - 클릭한 별까지 채워짐
- [ ] 3. 호버 효과 (30분)
  - 마우스 올릴 때 미리보기

**검증 기준**:
- [ ] 클릭 시 별점이 올바르게 변경됨
- [ ] 호버 시 미리보기 표시
- [ ] 접근성: 키보드 네비게이션 지원

**코드 스니펫**:
```typescript
// components/star-rating.tsx
"use client";

import { Star } from 'lucide-react';
import { useState } from 'react';

interface StarRatingProps {
  value: number;
  onChange: (rating: number) => void;
}

export function StarRating({ value, onChange }: StarRatingProps) {
  const [hover, setHover] = useState<number>(0);

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          className="focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
          aria-label={`${star}점`}
        >
          <Star
            className={`w-6 h-6 ${
              star <= (hover || value)
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        </button>
      ))}
    </div>
  );
}
```

---

### Task 3.6: 리뷰 폼 UI 컴포넌트

**예상 시간**: 3시간

**파일 경로**:
- `components/review-form.tsx` (생성)

**구현 단계**:
- [ ] 1. 폼 레이아웃 구성 (1시간)
  - StarRating, select, textarea, button
- [ ] 2. useReviewForm 훅 연결 (1시간)
- [ ] 3. 에러 메시지 표시 (30분)
- [ ] 4. 로딩 상태 표시 (30분)

**검증 기준**:
- [ ] 모든 필드가 올바르게 동작
- [ ] 에러 메시지가 빨간색으로 표시
- [ ] 제출 중 버튼 비활성화

**코드 스니펫**:
```typescript
// components/review-form.tsx
"use client";

import { useReviewForm } from '@/hooks/use-review-form';
import { StarRating } from './star-rating';
import { Job } from '@/types/review';

const JOB_OPTIONS: { value: Job; label: string }[] = [
  { value: 'developer', label: '개발자' },
  { value: 'designer', label: '디자이너' },
  { value: 'student', label: '학생' },
  { value: 'teacher', label: '교사' },
  { value: 'etc', label: '기타' }
];

export function ReviewForm({ citySlug }: { citySlug: string }) {
  const {
    rating,
    setRating,
    job,
    setJob,
    text,
    setText,
    errors,
    isSubmitting,
    submitReview
  } = useReviewForm(citySlug);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submitReview();
      }}
      className="space-y-4 p-4 border rounded-lg"
    >
      <h2 className="text-xl font-bold">리뷰 작성</h2>

      {/* 별점 */}
      <div>
        <label className="block text-sm font-medium mb-2">별점</label>
        <StarRating value={rating} onChange={setRating} />
      </div>

      {/* 직업 */}
      <div>
        <label htmlFor="job" className="block text-sm font-medium mb-2">
          직업
        </label>
        <select
          id="job"
          value={job || ''}
          onChange={(e) => setJob(e.target.value as Job)}
          className="w-full p-2 border rounded"
        >
          <option value="">선택해주세요</option>
          {JOB_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* 리뷰 텍스트 */}
      <div>
        <label htmlFor="text" className="block text-sm font-medium mb-2">
          리뷰 ({text.length}/500)
        </label>
        <textarea
          id="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="이 도시에서의 경험을 공유해주세요 (최소 10자)"
          className="w-full p-2 border rounded h-32 resize-none"
          maxLength={500}
        />
      </div>

      {/* 에러 메시지 */}
      {errors.length > 0 && (
        <div className="space-y-1">
          {errors.map((error, index) => (
            <p key={index} className="text-red-500 text-sm">
              {error}
            </p>
          ))}
        </div>
      )}

      {/* 제출 버튼 */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
      >
        {isSubmitting ? '제출 중...' : '리뷰 제출'}
      </button>
    </form>
  );
}
```

---

### Task 3.7: 리뷰 카드 및 목록 컴포넌트

**예상 시간**: 2시간

**파일 경로**:
- `components/review-card.tsx` (생성)
- `components/review-list.tsx` (생성)

**구현 단계**:
- [ ] 1. ReviewCard 컴포넌트 (1시간)
  - 별점 표시, 직업 뱃지, 텍스트, 좋아요 버튼
- [ ] 2. ReviewList 컴포넌트 (1시간)
  - 필터 적용, 정렬 적용, 빈 상태 처리

**검증 기준**:
- [ ] 리뷰가 올바르게 표시됨
- [ ] 빈 상태 메시지 표시 ("아직 리뷰가 없습니다")

**코드 스니펫**:
```typescript
// components/review-card.tsx
import { Review } from '@/types/review';
import { Star, Heart } from 'lucide-react';

const JOB_LABELS: Record<Job, string> = {
  developer: '개발자',
  designer: '디자이너',
  student: '학생',
  teacher: '교사',
  etc: '기타'
};

export function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="p-4 border rounded-lg space-y-2">
      {/* 별점 */}
      <div className="flex items-center gap-2">
        <div className="flex">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-4 h-4 ${
                star <= review.rating
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          ))}
        </div>
        <span className="text-sm text-gray-500">
          {new Date(review.createdAt).toLocaleDateString('ko-KR')}
        </span>
      </div>

      {/* 직업 뱃지 */}
      <div>
        <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
          {JOB_LABELS[review.job]}
        </span>
      </div>

      {/* 리뷰 텍스트 */}
      <p className="text-gray-700">{review.text}</p>

      {/* 좋아요 버튼 */}
      <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-500">
        <Heart className="w-4 h-4" />
        <span>{review.likes}</span>
      </button>
    </div>
  );
}

// components/review-list.tsx
"use client";

import { Review, Job } from '@/types/review';
import { ReviewCard } from './review-card';
import { filterReviewsByJob, sortReviewsByDate } from '@/lib/review-utils';

interface ReviewListProps {
  reviews: Review[];
  jobFilter: Job | null;
  sortOrder: 'latest' | 'oldest';
}

export function ReviewList({ reviews, jobFilter, sortOrder }: ReviewListProps) {
  const filteredReviews = filterReviewsByJob(reviews, jobFilter);
  const sortedReviews = sortReviewsByDate(filteredReviews, sortOrder);

  if (sortedReviews.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        아직 리뷰가 없습니다. 첫 번째 리뷰를 작성해보세요!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sortedReviews.map((review) => (
        <ReviewCard key={review.id} review={review} />
      ))}
    </div>
  );
}
```

---

### Task 3.8: 도시 상세 페이지에 리뷰 섹션 통합

**예상 시간**: 1시간

**파일 경로**:
- `app/cities/[slug]/page.tsx` (수정)

**구현 단계**:
- [ ] 1. 로컬스토리지에서 리뷰 불러오기 (30분)
- [ ] 2. ReviewForm, ReviewList 컴포넌트 배치 (20분)
- [ ] 3. 평균 별점 표시 (10분)

**검증 기준**:
- [ ] 리뷰 작성 후 목록에 즉시 표시
- [ ] 평균 별점이 올바르게 계산됨

**코드 스니펫**:
```typescript
// app/cities/[slug]/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { Review } from '@/types/review';
import { ReviewForm } from '@/components/review-form';
import { ReviewList } from '@/components/review-list';
import { useReviewFilters } from '@/hooks/use-review-filters';
import { calculateAverageRating } from '@/lib/review-utils';

export default function CityDetailPage({ params }: { params: { slug: string } }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const { jobFilter, sortOrder } = useReviewFilters();

  // 로컬스토리지에서 리뷰 불러오기
  useEffect(() => {
    const storedReviews = localStorage.getItem(`reviews-${params.slug}`);
    if (storedReviews) {
      setReviews(JSON.parse(storedReviews));
    }
  }, [params.slug]);

  const averageRating = calculateAverageRating(reviews);

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-8">
      {/* 도시 정보 (기존 코드) */}

      {/* 리뷰 섹션 */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">
            리뷰 ({reviews.length})
          </h2>
          {reviews.length > 0 && (
            <div className="text-lg">
              평균 별점: <span className="font-bold">{averageRating}</span>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* 리뷰 작성 폼 */}
          <ReviewForm citySlug={params.slug} />

          {/* 리뷰 목록 */}
          <div>
            <ReviewList
              reviews={reviews}
              jobFilter={jobFilter}
              sortOrder={sortOrder}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
```

---

## 📁 파일 구조

### 신규 생성 파일
```
lib/
├── review-validation.ts      # 리뷰 유효성 검사
└── review-utils.ts            # 리뷰 관련 유틸리티

hooks/
├── use-review-form.ts         # 리뷰 폼 상태 관리
└── use-review-filters.ts      # 리뷰 필터 상태 관리 (URL)

components/
├── review-form.tsx            # 리뷰 작성 폼 (Client)
├── review-card.tsx            # 리뷰 카드 (Server)
├── review-list.tsx            # 리뷰 목록 (Client)
└── star-rating.tsx            # 별점 입력 (Client)

types/
└── review.ts                  # 리뷰 관련 타입
```

### 수정할 파일
- `app/cities/[slug]/page.tsx` - 리뷰 섹션 추가

---

## 📐 구현 원칙

### SOLID 원칙 적용
- **단일 책임 원칙 (SRP)**:
  - `review-validation.ts`: 유효성 검사만
  - `review-utils.ts`: 계산/필터/정렬만
  - `use-review-form.ts`: 폼 상태 관리만

- **개방-폐쇄 원칙 (OCP)**:
  - Job 타입 추가 시 JOB_OPTIONS만 수정
  - 새로운 필터 추가 시 기존 함수 수정 불필요

### 함수형 패턴
```typescript
// 파이프라인 패턴
const processedReviews = pipe(
  reviews,
  (r) => filterReviewsByJob(r, job),
  (r) => sortReviewsByDate(r, sortOrder),
  (r) => paginateReviews(r, page)
);
```

### Server vs Client 컴포넌트
- **Server Component**: `ReviewCard` (표시만)
- **Client Component**: `ReviewForm`, `ReviewList`, `StarRating` (상호작용)

---

## 🔗 의존성

### Phase 간 의존성
- **필수 완료**: Phase 2 (도시 상세 페이지)
- **권장 완료**: Phase 1 (검색 기능)
- **차단됨**: 없음

### Task 간 의존성
```
Task 3.1 (타입 정의)
  └─ Task 3.2 (유틸리티 함수)
      └─ Task 3.3 (리뷰 폼 훅)
          └─ Task 3.4 (필터 훅)
              └─ Task 3.5 (별점 컴포넌트)
                  └─ Task 3.6 (리뷰 폼 UI)
                      └─ Task 3.7 (리뷰 목록)
                          └─ Task 3.8 (페이지 통합)
```

---

## 🧾 기술 부채

### 현재 Phase에서 발생 가능한 기술 부채
| ID | 설명 | 우선순위 | 해결 Phase |
|----|------|----------|------------|
| TD-301 | 로컬스토리지 사용 (API로 변경 필요) | P0 | Phase 4 |
| TD-302 | i18n 미적용 (한국어만 지원) | P2 | Phase 10 |
| TD-303 | 좋아요 기능 UI만 구현 (실제 동작 없음) | P1 | Phase 5 |
| TD-304 | 로컬스토리지 5MB 제한 | P1 | Phase 8 |

### 이전 Phase 기술 부채 해결
- 해당 없음 (Phase 3가 첫 상호작용 기능)

---

## ✅ 품질 체크리스트

### 성능
- [ ] useMemo로 불필요한 재계산 방지 (filterReviewsByJob, sortReviewsByDate)
- [ ] useCallback로 불필요한 함수 재생성 방지
- [ ] 번들 크기 확인 (Next.js 빌드 분석)
- [ ] 이미지 최적화 (필요시)

### 접근성 (a11y)
- [ ] ARIA 레이블 추가 (별점 버튼: `aria-label="3점"`)
- [ ] 키보드 네비게이션 지원 (Tab, Enter, Esc)
- [ ] 색상 대비 4.5:1 이상 (에러 메시지 빨간색)
- [ ] 스크린 리더 테스트

### 보안
- [ ] XSS 방지 (리뷰 텍스트 이스케이프)
- [ ] 입력값 검증 (maxLength, validateReview)
- [ ] 민감 정보 노출 금지 (없음)

### 사용자 경험 (UX)
- [ ] 로딩 상태 표시 (isSubmitting)
- [ ] 에러 메시지 명확성 ("별점은 1-5 사이여야 합니다")
- [ ] 모바일 반응형 디자인 (grid md:grid-cols-2)
- [ ] 빈 상태 처리 ("아직 리뷰가 없습니다")

### 코드 품질
- [ ] TypeScript 타입 안전성 (any 사용 금지)
- [ ] ESLint 경고 없음
- [ ] 함수 길이 50줄 이하
- [ ] 컴포넌트 복잡도 관리

---

## 🧪 최종 검증

### Given-When-Then 시나리오

**시나리오 1: 정상적인 리뷰 작성**
```
Given: 사용자가 도시 상세 페이지(/cities/seoul)에 있고, 리뷰 폼이 표시됨
When:
  - 별점 4점 클릭
  - 직업 "개발자" 선택
  - 텍스트 "서울은 개발자로 일하기 좋은 도시입니다. 카페가 많고 인터넷이 빠릅니다." 입력
  - "리뷰 제출" 버튼 클릭
Then:
  - 리뷰가 로컬스토리지에 저장됨
  - 리뷰 목록에 새 리뷰가 즉시 표시됨
  - 평균 별점이 업데이트됨
  - 폼이 초기화됨 (별점 0, 직업 선택 안됨, 텍스트 빈 문자열)
```

**시나리오 2: 유효성 검사 실패 (별점 미선택)**
```
Given: 사용자가 리뷰 폼에 있음
When:
  - 별점 선택하지 않음 (0점)
  - 직업 "디자이너" 선택
  - 텍스트 "좋은 도시입니다" 입력
  - "리뷰 제출" 버튼 클릭
Then:
  - 에러 메시지 "별점은 1-5 사이여야 합니다" 표시 (빨간색)
  - 리뷰가 저장되지 않음
  - 입력한 내용은 유지됨
```

**시나리오 3: 유효성 검사 실패 (텍스트 너무 짧음)**
```
Given: 사용자가 리뷰 폼에 있음
When:
  - 별점 5점 선택
  - 직업 "학생" 선택
  - 텍스트 "좋아요" (5자) 입력
  - "리뷰 제출" 버튼 클릭
Then:
  - 에러 메시지 "리뷰는 최소 10자 이상이어야 합니다" 표시
  - 리뷰가 저장되지 않음
```

**시나리오 4: 직업별 필터링**
```
Given:
  - 도시에 3개 리뷰가 있음 (개발자 2개, 디자이너 1개)
  - 리뷰 목록이 표시됨
When: URL을 /cities/seoul?job=developer로 변경
Then:
  - 개발자 리뷰 2개만 표시됨
  - 디자이너 리뷰는 숨겨짐
```

**시나리오 5: 날짜순 정렬**
```
Given:
  - 도시에 3개 리뷰가 있음 (2024-01-01, 2024-01-05, 2024-01-03)
  - 기본 정렬: 최신순
When: 정렬을 "오래된순"으로 변경
Then:
  - 리뷰가 2024-01-01 → 2024-01-03 → 2024-01-05 순서로 표시됨
```

**시나리오 6: 빈 상태**
```
Given: 도시에 리뷰가 없음
When: 리뷰 목록 섹션 확인
Then:
  - "아직 리뷰가 없습니다. 첫 번째 리뷰를 작성해보세요!" 메시지 표시
```

**시나리오 7: 별점 호버 효과**
```
Given: 사용자가 리뷰 폼의 별점 입력 영역에 있음
When: 3번째 별에 마우스 올림
Then:
  - 1-3번째 별이 노란색으로 채워짐 (미리보기)
When: 마우스를 별에서 뗌
Then:
  - 별이 원래 상태로 돌아감 (선택된 별점만 채워짐)
```

### 수동 테스트 체크리스트
- [ ] 리뷰 작성 후 목록에 즉시 표시됨
- [ ] 유효성 검사 에러 메시지가 올바르게 표시됨
- [ ] 별점 호버 효과가 정상 동작함
- [ ] 직업 필터가 URL에 반영되고 뒤로 가기 동작함
- [ ] 모바일 화면에서 폼과 목록이 세로로 배치됨 (md:grid-cols-2)
- [ ] 다양한 브라우저 테스트 (Chrome, Safari, Firefox)
- [ ] 키보드만으로 폼 작성 가능 (Tab, Enter)

---

## 📊 완료 기준

### 기능 완료
- [ ] 모든 Task (3.1 ~ 3.8) 완료
- [ ] 모든 검증 시나리오 통과
- [ ] 품질 체크리스트 통과

### 문서화
- [ ] 기술 부채 문서화 (TD-301 ~ TD-304)
- [ ] README 업데이트 (필요시)

### 배포 준비
- [ ] 빌드 성공 (`npm run build`)
- [ ] 타입 체크 통과 (`npx tsc --noEmit`)
- [ ] Lint 통과 (`npm run lint`)

---

## 📝 참고 자료

- Next.js App Router 문서: https://nextjs.org/docs
- Tailwind CSS 문서: https://tailwindcss.com/docs
- Lucide React 아이콘: https://lucide.dev/
- WCAG 접근성 가이드: https://www.w3.org/WAI/WCAG21/quickref/
