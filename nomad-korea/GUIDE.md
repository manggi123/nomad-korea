# 문제 분해 템플릿 사용 가이드

## 📚 목차
1. [개요](#개요)
2. [문제 분해 4단계](#문제-분해-4단계)
3. [파일 생성 결정 트리](#파일-생성-결정-트리)
4. [Task 작성 패턴](#task-작성-패턴)
5. [함수 작성 패턴](#함수-작성-패턴)
6. [검증 시나리오 작성법](#검증-시나리오-작성법)
7. [자주 하는 실수](#자주-하는-실수)
8. [베스트 프랙티스](#베스트-프랙티스)

---

## 개요

이 가이드는 **TEMPLATE.md**를 사용하여 새로운 Phase를 계획하는 방법을 설명합니다.

### 사용 방법
1. `TEMPLATE.md`를 복사하여 새 파일 생성 (예: `phase-3-review.md`)
2. 이 가이드를 참고하여 각 섹션 작성
3. `EXAMPLE.md`에서 실제 예시 확인
4. 작성 완료 후 팀원과 리뷰

### 템플릿의 목적
- **일관성**: 모든 Phase가 동일한 구조를 따름
- **완전성**: 놓치기 쉬운 부분(보안, 접근성 등)을 체크리스트로 확인
- **추적성**: 기술 부채와 의존성을 명확히 문서화
- **실용성**: 1-4시간 단위 Task로 분해하여 즉시 실행 가능

---

## 문제 분해 4단계

### 1단계: 사용자 여정 파악

**질문**:
- 사용자가 이 기능을 사용하는 시작점은?
- 중간에 어떤 행동을 하는가?
- 최종 결과는 무엇인가?

**예시**: 리뷰 작성 기능
```
1. 사용자가 도시 상세 페이지에서 "리뷰 작성" 버튼 클릭
2. 리뷰 폼에서 별점, 직업, 텍스트 입력
3. "제출" 버튼 클릭
4. 리뷰가 도시 상세 페이지에 표시됨
```

**Tip**: 실제 사용자처럼 생각하고, 스크린샷이나 와이어프레임을 그려보세요.

---

### 2단계: UI 레이어 분해

**질문**:
- 어떤 컴포넌트가 필요한가?
- 각 컴포넌트의 책임은 무엇인가?
- 재사용 가능한 컴포넌트는?

**분해 원칙**:
- **Container/Presenter 패턴**: 상태 관리와 UI를 분리
- **단일 책임**: 하나의 컴포넌트는 하나의 역할만
- **재사용성**: 버튼, 입력창 등은 공통 컴포넌트로

**예시**: 리뷰 작성 폼
```
UI 레이어
├── ReviewForm              # 폼 전체 (Container)
│   ├── StarRating          # 별점 입력
│   ├── JobSelector         # 직업 선택
│   ├── TextArea            # 텍스트 입력
│   └── SubmitButton        # 제출 버튼
└── ReviewList              # 리뷰 목록 표시
    └── ReviewCard          # 개별 리뷰 카드
```

**파일 위치**:
```typescript
components/
├── review-form.tsx         # "use client"
├── star-rating.tsx         # "use client" (상호작용)
├── job-selector.tsx        # "use client"
└── review-card.tsx         # Server Component (표시만)
```

---

### 3단계: 로직 레이어 분해

**질문**:
- 어떤 계산/변환이 필요한가?
- 순수 함수로 분리 가능한가?
- 유효성 검사는 어디서?

**분해 원칙**:
- **순수 함수**: 같은 입력 → 같은 출력, 부수 효과 없음
- **테스트 가능성**: 함수 단위로 테스트
- **재사용성**: 여러 곳에서 사용 가능

**예시**: 리뷰 관련 로직
```
로직 레이어
├── validateReview()        # 유효성 검사
├── calculateAverageRating()# 평균 별점 계산
├── filterReviewsByJob()    # 직업별 필터링
└── sortReviewsByDate()     # 날짜순 정렬
```

**파일 위치**:
```typescript
lib/
├── review-validation.ts
│   └── validateReview(review: ReviewInput): ValidationResult
├── review-utils.ts
│   ├── calculateAverageRating(reviews: Review[]): number
│   └── filterReviewsByJob(reviews: Review[], job: Job): Review[]
└── review-sort.ts
    └── sortReviewsByDate(reviews: Review[], order: 'asc' | 'desc'): Review[]
```

**Good 예시**:
```typescript
// lib/review-validation.ts
export function validateReview(review: ReviewInput): ValidationResult {
  const errors: string[] = [];

  if (!review.rating || review.rating < 1 || review.rating > 5) {
    errors.push('별점은 1-5 사이여야 합니다');
  }

  if (!review.text || review.text.length < 10) {
    errors.push('리뷰는 최소 10자 이상이어야 합니다');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}
```

**Bad 예시** (컴포넌트 안에 로직 포함):
```typescript
// components/review-form.tsx ❌
export function ReviewForm() {
  const handleSubmit = () => {
    // 유효성 검사 로직이 컴포넌트 안에...
    if (!rating || rating < 1 || rating > 5) {
      // ...
    }
  };
}
```

---

### 4단계: 상태 레이어 분해

**질문**:
- 어떤 상태가 필요한가?
- 상태는 어디서 관리하는가?
- URL 쿼리 파라미터로 관리할 수 있는가?

**분해 원칙**:
- **Custom Hook**: 상태 로직을 재사용 가능하게
- **URL State**: 필터, 정렬 등은 URL에 저장
- **Local State**: 폼 입력 등은 컴포넌트 내부

**예시**: 리뷰 관련 상태
```
상태 레이어
├── useReviewForm()         # 폼 상태 관리
│   ├── rating              # 별점
│   ├── job                 # 직업
│   ├── text                # 텍스트
│   └── submitReview()      # 제출 액션
└── useReviewFilters()      # 필터 상태 관리 (URL)
    ├── jobFilter           # 직업 필터
    ├── sortOrder           # 정렬 순서
    └── setJobFilter()      # 필터 변경
```

**파일 위치**:
```typescript
hooks/
├── use-review-form.ts
└── use-review-filters.ts
```

**Good 예시** (URL 상태 관리):
```typescript
// hooks/use-review-filters.ts
import { useSearchParams } from 'next/navigation';

export function useReviewFilters() {
  const searchParams = useSearchParams();

  const jobFilter = searchParams.get('job') as Job | null;
  const sortOrder = searchParams.get('sort') as 'latest' | 'oldest' || 'latest';

  const setJobFilter = (job: Job | null) => {
    const params = new URLSearchParams(searchParams);
    if (job) {
      params.set('job', job);
    } else {
      params.delete('job');
    }
    window.history.pushState({}, '', `?${params.toString()}`);
  };

  return { jobFilter, sortOrder, setJobFilter };
}
```

---

## 파일 생성 결정 트리

새로운 파일을 생성할 때 이 플로우차트를 따르세요:

```
질문: 이 코드는 무엇을 하나요?

├─ 순수 함수 (입력 → 출력, 부수 효과 없음)
│  └─ lib/[기능명].ts
│     예: lib/review-validation.ts
│
├─ 상태 관리 (useState, useSearchParams 등)
│  └─ hooks/use-[기능명].ts
│     예: hooks/use-review-form.ts
│
├─ UI 컴포넌트 (JSX 반환)
│  ├─ 상호작용 필요? (클릭, 입력 등)
│  │  └─ components/[컴포넌트명].tsx ("use client")
│  │     예: components/review-form.tsx
│  │
│  └─ 표시만? (상호작용 없음)
│     └─ components/[컴포넌트명].tsx (Server Component)
│        예: components/review-card.tsx
│
├─ 페이지 (라우팅)
│  └─ app/[경로]/page.tsx
│     예: app/cities/[slug]/reviews/page.tsx
│
└─ 타입 정의
   └─ types/[도메인명].ts
      예: types/review.ts
```

### 예시: 리뷰 작성 기능

**질문**: 리뷰 유효성 검사 함수는 어디에?
- 순수 함수? ✅ (입력: ReviewInput, 출력: ValidationResult)
- → `lib/review-validation.ts`

**질문**: 리뷰 폼 상태는 어디에?
- 상태 관리? ✅ (useState로 rating, text 관리)
- → `hooks/use-review-form.ts`

**질문**: 리뷰 폼 UI는 어디에?
- UI 컴포넌트? ✅
- 상호작용 필요? ✅ (입력, 클릭)
- → `components/review-form.tsx` ("use client")

---

## Task 작성 패턴

### 1-4시간 단위로 분해

**원칙**:
- 하나의 Task는 **1-4시간** 안에 완료 가능
- 한 사람이 하루에 2-3개 Task 완료 목표
- Task가 4시간 이상이면 더 작게 분해

**Good 예시** ✅:
```markdown
### Task 3.1: 리뷰 타입 정의 및 유효성 검사 (2시간)

**파일 경로**:
- `types/review.ts` (생성)
- `lib/review-validation.ts` (생성)

**구현 단계**:
- [ ] 1. Review 타입 정의 (30분)
- [ ] 2. ReviewInput 타입 정의 (15분)
- [ ] 3. validateReview 함수 구현 (45분)
- [ ] 4. 유효성 검사 테스트 (30분)
```

**Bad 예시** ❌:
```markdown
### Task 3.1: 리뷰 기능 구현 (4일)

**구현 단계**:
- [ ] 타입, 유효성, 폼, UI, 페이지 모두 구현
```
→ 너무 크고 추상적! 1-4시간 단위로 분해하세요.

---

### Task 순서 정하기

**의존성 순서**:
```
1. 타입 정의 (다른 파일에서 import 필요)
   ↓
2. 순수 함수 (lib/, 타입 사용)
   ↓
3. 상태 관리 (hooks/, 순수 함수 사용)
   ↓
4. UI 컴포넌트 (components/, 훅 사용)
   ↓
5. 페이지 통합 (app/, 컴포넌트 사용)
```

**예시**:
```markdown
### Task 3.1: 타입 정의 (1시간)
└─ types/review.ts

### Task 3.2: 유효성 검사 (2시간)
└─ lib/review-validation.ts (Task 3.1 완료 필요)

### Task 3.3: 리뷰 폼 훅 (3시간)
└─ hooks/use-review-form.ts (Task 3.1, 3.2 완료 필요)

### Task 3.4: 리뷰 폼 UI (3시간)
└─ components/review-form.tsx (Task 3.3 완료 필요)

### Task 3.5: 페이지 통합 (1시간)
└─ app/cities/[slug]/page.tsx (Task 3.4 완료 필요)
```

---

## 함수 작성 패턴

### lib/ (순수 함수)

**특징**:
- 같은 입력 → 같은 출력
- 부수 효과 없음 (API 호출, DOM 조작 금지)
- 테스트 용이

**템플릿**:
```typescript
// lib/[기능명].ts

/**
 * [함수 설명]
 * @param input - [파라미터 설명]
 * @returns [반환값 설명]
 */
export function functionName(input: InputType): OutputType {
  // 1. 입력 검증
  if (!input) {
    return defaultValue;
  }

  // 2. 변환/계산
  const result = transform(input);

  // 3. 반환
  return result;
}
```

**Good 예시** ✅:
```typescript
// lib/review-utils.ts

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
```

**Bad 예시** ❌:
```typescript
// lib/review-utils.ts ❌
export function saveReview(review: Review) {
  // API 호출 (부수 효과!) → hooks/로 이동
  fetch('/api/reviews', { method: 'POST', body: JSON.stringify(review) });
}
```

---

### hooks/ (상태 관리)

**특징**:
- React Hooks 사용 (useState, useEffect 등)
- 부수 효과 허용 (API 호출, localStorage)
- "use"로 시작

**템플릿**:
```typescript
// hooks/use-[기능명].ts
"use client";

import { useState } from 'react';

export function useFeatureName() {
  // 1. 상태 정의
  const [state, setState] = useState(initialValue);

  // 2. 액션 함수
  const actionFunction = () => {
    // 상태 업데이트
    setState(newValue);
  };

  // 3. 반환
  return {
    state,
    actionFunction
  };
}
```

**Good 예시** ✅:
```typescript
// hooks/use-review-form.ts
"use client";

import { useState } from 'react';
import { validateReview } from '@/lib/review-validation';

export function useReviewForm() {
  const [rating, setRating] = useState<number>(0);
  const [text, setText] = useState<string>('');
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const submitReview = async () => {
    // 1. 유효성 검사
    const validation = validateReview({ rating, text });
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    // 2. API 호출
    setIsSubmitting(true);
    try {
      await fetch('/api/reviews', {
        method: 'POST',
        body: JSON.stringify({ rating, text })
      });
      // 성공 시 초기화
      setRating(0);
      setText('');
    } catch (error) {
      setErrors(['제출 중 오류가 발생했습니다']);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    rating,
    setRating,
    text,
    setText,
    errors,
    isSubmitting,
    submitReview
  };
}
```

---

### components/ (UI 컴포넌트)

**특징**:
- JSX 반환
- Server Component (기본) vs Client Component ("use client")
- 재사용 가능

**결정 기준**:
- 상호작용 필요? → Client Component
- 표시만? → Server Component

**템플릿**:
```typescript
// components/[컴포넌트명].tsx
"use client"; // 필요시만

import { ComponentProps } from '@/types';

export function ComponentName({ prop1, prop2 }: ComponentProps) {
  return (
    <div>
      {/* UI */}
    </div>
  );
}
```

**Good 예시** ✅:
```typescript
// components/review-form.tsx
"use client";

import { useReviewForm } from '@/hooks/use-review-form';

export function ReviewForm() {
  const { rating, setRating, text, setText, errors, submitReview } = useReviewForm();

  return (
    <form onSubmit={(e) => { e.preventDefault(); submitReview(); }}>
      <StarRating value={rating} onChange={setRating} />
      <textarea value={text} onChange={(e) => setText(e.target.value)} />
      {errors.map(error => <p key={error} className="text-red-500">{error}</p>)}
      <button type="submit">제출</button>
    </form>
  );
}
```

---

## 검증 시나리오 작성법

### Given-When-Then 패턴

**구조**:
```
Given: [초기 상태]
When: [사용자 행동]
Then: [예상 결과]
```

**예시 1: 정상 케이스**
```
Given: 사용자가 도시 상세 페이지에 있고, 리뷰 폼이 표시됨
When: 별점 4점, 직업 "개발자", 텍스트 "좋은 도시입니다" 입력 후 제출
Then:
  - 리뷰가 성공적으로 저장됨
  - 리뷰 목록에 새 리뷰가 표시됨
  - 평균 별점이 업데이트됨
```

**예시 2: 유효성 검사 실패**
```
Given: 사용자가 리뷰 폼에 있음
When: 별점 0점, 텍스트 "짧음" (10자 미만) 입력 후 제출
Then:
  - 에러 메시지 "별점은 1-5 사이여야 합니다" 표시
  - 에러 메시지 "리뷰는 최소 10자 이상이어야 합니다" 표시
  - 리뷰가 저장되지 않음
```

**예시 3: 네트워크 에러**
```
Given: 사용자가 유효한 리뷰를 입력함
When: 제출 버튼 클릭 시 네트워크 에러 발생
Then:
  - 에러 메시지 "제출 중 오류가 발생했습니다" 표시
  - 입력한 내용은 유지됨 (사용자가 다시 입력할 필요 없음)
```

---

## 자주 하는 실수

### 1. 너무 큰 Task

**❌ Bad**:
```markdown
### Task 3.1: 리뷰 기능 완성 (4일)
```

**✅ Good**:
```markdown
### Task 3.1: 리뷰 타입 정의 (1시간)
### Task 3.2: 유효성 검사 (2시간)
### Task 3.3: 리뷰 폼 훅 (3시간)
### Task 3.4: 리뷰 폼 UI (3시간)
### Task 3.5: 페이지 통합 (1시간)
```

---

### 2. lib/에 부수 효과 포함

**❌ Bad**:
```typescript
// lib/review.ts
export function saveReview(review: Review) {
  fetch('/api/reviews', { method: 'POST', body: JSON.stringify(review) });
}
```

**✅ Good**:
```typescript
// hooks/use-review-form.ts
export function useReviewForm() {
  const submitReview = async () => {
    await fetch('/api/reviews', { method: 'POST', body: JSON.stringify(review) });
  };

  return { submitReview };
}
```

---

### 3. Server Component에 "use client" 추가

**❌ Bad**:
```typescript
// components/review-card.tsx
"use client"; // 불필요! 표시만 하는 컴포넌트

export function ReviewCard({ review }: { review: Review }) {
  return <div>{review.text}</div>;
}
```

**✅ Good**:
```typescript
// components/review-card.tsx
// "use client" 제거 (Server Component)

export function ReviewCard({ review }: { review: Review }) {
  return <div>{review.text}</div>;
}
```

---

### 4. 기술 부채 미문서화

**❌ Bad**:
```typescript
// TODO: 나중에 i18n 추가
export function ReviewForm() {
  return <button>제출</button>;
}
```

**✅ Good**:
```markdown
## 🧾 기술 부채

| ID | 설명 | 우선순위 | 해결 Phase |
|----|------|----------|------------|
| TD-301 | 리뷰 폼 i18n 미적용 | P2 | Phase 10 |
```

---

### 5. 검증 시나리오 누락

**❌ Bad**:
```markdown
### 최종 검증
- [ ] 리뷰 작성 테스트
```

**✅ Good**:
```markdown
### 최종 검증

**시나리오 1: 정상 케이스**
Given: 사용자가 도시 상세 페이지에 있고, 리뷰 폼이 표시됨
When: 별점 4점, 텍스트 "좋은 도시입니다" 입력 후 제출
Then: 리뷰가 목록에 표시됨

**시나리오 2: 유효성 검사**
Given: 사용자가 리뷰 폼에 있음
When: 별점 0점 입력 후 제출
Then: 에러 메시지 "별점은 1-5 사이여야 합니다" 표시
```

---

## 베스트 프랙티스

### 1. URL 상태 관리 우선

**원칙**: 필터, 정렬, 페이지네이션은 URL에 저장

**Good 예시** ✅:
```typescript
// hooks/use-review-filters.ts
import { useSearchParams } from 'next/navigation';

export function useReviewFilters() {
  const searchParams = useSearchParams();
  const jobFilter = searchParams.get('job') as Job | null;

  // URL: /cities/seoul?job=developer&sort=latest
}
```

**이유**:
- 북마크 가능
- 공유 가능
- 뒤로 가기 동작

---

### 2. 함수형 파이프라인

**원칙**: 여러 변환을 순차적으로 적용

**Good 예시** ✅:
```typescript
// lib/review-utils.ts
export function processReviews(
  reviews: Review[],
  job: Job | null,
  sortOrder: 'latest' | 'oldest'
): Review[] {
  return pipe(
    reviews,
    (r) => filterReviewsByJob(r, job),
    (r) => sortReviewsByDate(r, sortOrder),
    (r) => paginateReviews(r, 10)
  );
}

function pipe<T>(value: T, ...fns: Array<(arg: T) => T>): T {
  return fns.reduce((acc, fn) => fn(acc), value);
}
```

---

### 3. 조기 반환 (Early Return)

**원칙**: 예외 케이스를 먼저 처리하고 반환

**Good 예시** ✅:
```typescript
export function calculateAverageRating(reviews: Review[]): number {
  if (reviews.length === 0) return 0; // 조기 반환

  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  return sum / reviews.length;
}
```

**Bad 예시** ❌:
```typescript
export function calculateAverageRating(reviews: Review[]): number {
  if (reviews.length > 0) {
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return sum / reviews.length;
  } else {
    return 0; // 중첩된 조건
  }
}
```

---

### 4. 타입 안전성

**원칙**: any 금지, 명시적 타입 사용

**Good 예시** ✅:
```typescript
// types/review.ts
export type Job = 'developer' | 'designer' | 'student' | 'teacher' | 'etc';

export interface Review {
  id: string;
  citySlug: string;
  rating: number;
  job: Job;
  text: string;
  createdAt: Date;
}
```

---

### 5. 품질 체크리스트 활용

**매 Task 완료 시 확인**:
- [ ] TypeScript 에러 없음
- [ ] ESLint 경고 없음
- [ ] 함수 길이 50줄 이하
- [ ] 테스트 시나리오 통과

---

## 요약

### 문제 분해 4단계
1. **사용자 여정** → 2. **UI 레이어** → 3. **로직 레이어** → 4. **상태 레이어**

### 파일 위치
- 순수 함수 → `lib/`
- 상태 관리 → `hooks/`
- UI 컴포넌트 → `components/`
- 페이지 → `app/`
- 타입 → `types/`

### Task 크기
- **1-4시간** 단위로 분해
- 하루 2-3개 Task 완료 목표

### 검증
- **Given-When-Then** 시나리오 작성
- 정상 케이스 + 에러 케이스

---

## 다음 단계

1. `TEMPLATE.md` 복사하여 새 Phase 파일 생성
2. 이 가이드를 참고하여 각 섹션 작성
3. `EXAMPLE.md`에서 실제 예시 확인
4. 팀원과 리뷰 후 구현 시작

**질문이 있으면**: GitHub Issue 또는 팀 채널에서 문의하세요!
