# Feature Breakdown Command

이 명령어는 새로운 Phase를 계획할 때 문제를 작은 단위로 분해하는 템플릿 시스템을 제공합니다.

## 사용 방법

### 1. 새로운 Phase 계획 시작

```bash
# TEMPLATE.md를 복사하여 새 Phase 파일 생성
cp TEMPLATE.md phase-[번호]-[기능명].md

# 예시
cp TEMPLATE.md phase-3-review.md
```

### 2. 템플릿 작성

1. **GUIDE.md** 참고하여 각 섹션 작성
2. **EXAMPLE.md**에서 실제 예시 확인
3. 문제 분해 4단계 적용:
   - 사용자 여정 파악
   - UI 레이어 분해
   - 로직 레이어 분해
   - 상태 레이어 분해

### 3. 파일 구조 결정

다음 결정 트리를 따라 파일 위치를 결정하세요:

```
질문: 이 코드는 무엇을 하나요?

├─ 순수 함수 (입력 → 출력, 부수 효과 없음)
│  └─ lib/[기능명].ts
│
├─ 상태 관리 (useState, useSearchParams 등)
│  └─ hooks/use-[기능명].ts
│
├─ UI 컴포넌트 (JSX 반환)
│  ├─ 상호작용 필요? → components/[컴포넌트명].tsx ("use client")
│  └─ 표시만? → components/[컴포넌트명].tsx (Server Component)
│
├─ 페이지 (라우팅)
│  └─ app/[경로]/page.tsx
│
└─ 타입 정의
   └─ types/[도메인명].ts
```

## 템플릿 파일

프로젝트 루트에 다음 파일들이 있습니다:

- **TEMPLATE.md**: 빈 템플릿 (복사하여 사용)
- **GUIDE.md**: 사용 가이드 (작성법 및 베스트 프랙티스)
- **EXAMPLE.md**: Phase 3 실제 예시 (리뷰 작성 기능)

## 핵심 원칙

### 1. Task 크기
- 1-4시간 단위로 분해
- 하루 2-3개 Task 완료 목표

### 2. 의존성 순서
```
1. 타입 정의 (types/)
   ↓
2. 순수 함수 (lib/)
   ↓
3. 상태 관리 (hooks/)
   ↓
4. UI 컴포넌트 (components/)
   ↓
5. 페이지 통합 (app/)
```

### 3. 함수형 패턴
- 순수 함수 우선
- 파이프라인 패턴 활용
- 부수 효과는 hooks/에서만

### 4. URL 상태 관리
- 필터, 정렬, 페이지네이션은 URL에 저장
- 북마크 가능, 공유 가능, 뒤로 가기 동작

## 품질 체크리스트

매 Task 완료 시:

### 성능
- [ ] useMemo/useCallback로 불필요한 재계산/재생성 방지
- [ ] 번들 크기 확인

### 접근성
- [ ] ARIA 레이블 추가
- [ ] 키보드 네비게이션 지원
- [ ] 색상 대비 4.5:1 이상

### 보안
- [ ] XSS 방지
- [ ] 입력값 검증
- [ ] 민감 정보 노출 금지

### 코드 품질
- [ ] TypeScript 타입 안전성 (any 금지)
- [ ] ESLint 경고 없음
- [ ] 함수 길이 50줄 이하

## 검증 시나리오

Given-When-Then 패턴 사용:

```
Given: [초기 상태]
When: [사용자 행동]
Then: [예상 결과]
```

최소 3가지 시나리오 작성:
1. 정상 케이스
2. 유효성 검사 실패
3. 에러 처리

## 기술 부채 추적

모든 기술 부채를 문서화:

```markdown
| ID | 설명 | 우선순위 | 해결 Phase |
|----|------|----------|------------|
| TD-XXX | [설명] | P0/P1/P2 | Phase X |
```

## 자주 하는 실수

### ❌ 너무 큰 Task
```markdown
### Task 3.1: 리뷰 기능 완성 (4일)
```

### ✅ 올바른 크기
```markdown
### Task 3.1: 리뷰 타입 정의 (1시간)
### Task 3.2: 유효성 검사 (2시간)
### Task 3.3: 리뷰 폼 훅 (3시간)
```

### ❌ lib/에 부수 효과
```typescript
// lib/review.ts ❌
export function saveReview(review: Review) {
  fetch('/api/reviews', ...); // 부수 효과!
}
```

### ✅ hooks/에서 처리
```typescript
// hooks/use-review-form.ts ✅
export function useReviewForm() {
  const submitReview = async () => {
    await fetch('/api/reviews', ...);
  };
  return { submitReview };
}
```

## 예시: Phase 3 리뷰 작성 기능

EXAMPLE.md 파일을 참고하면 다음을 확인할 수 있습니다:

1. **문제 분해**: 사용자 여정 → UI/로직/상태 레이어
2. **8개 Task**: 각 1-3시간 단위
3. **파일 구조**: lib/, hooks/, components/, types/
4. **검증 시나리오**: 7가지 Given-When-Then
5. **기술 부채**: 4개 항목 추적

## 다음 단계

1. `TEMPLATE.md` 복사
2. `GUIDE.md` 참고하여 작성
3. `EXAMPLE.md`에서 패턴 학습
4. 팀원과 리뷰
5. Task 단위로 구현 시작

---

**문서 위치**:
- `/nomad-korea/TEMPLATE.md`
- `/nomad-korea/GUIDE.md`
- `/nomad-korea/EXAMPLE.md`
