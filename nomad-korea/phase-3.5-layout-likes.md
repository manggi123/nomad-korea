# Phase 3.5: 레이아웃 중앙 정렬 및 좋아요/싫어요 기능

## 📋 목표

1. **레이아웃 중앙 정렬**: 전체 사이트 콘텐츠를 화면 중앙에 정렬하여 여백 최적화
2. **좋아요/싫어요 기능**: 도시별로 사용자가 좋아요/싫어요를 표시할 수 있는 기능 구현
3. **아이콘 및 UI**: 직관적인 아이콘과 개수 표시

---

## 🔍 문제 분석

### 현재 상태
- ✅ 기본 레이아웃 구조 존재
- ✅ 도시 카드 컴포넌트 구현됨
- ❌ 콘텐츠가 왼쪽으로 치우쳐져 있음
- ❌ 좋아요/싫어요 기능 없음
- ❌ 도시별 선호도 데이터 없음

### 문제점
1. **레이아웃**: container 클래스의 max-width가 적절하지 않거나 중앙 정렬이 안 됨
2. **사용자 피드백 부재**: 도시에 대한 간단한 선호도 표시 방법 없음
3. **데이터 관리**: 좋아요/싫어요 개수를 저장할 구조 필요

---

## 💡 해결 방안

### 접근 방법 1: Tailwind container 클래스 최적화
- 장점: 간단하고 빠른 수정
- 단점: 일부 페이지에만 적용될 수 있음

### 접근 방법 2: 전역 레이아웃 컴포넌트 생성
- 장점: 모든 페이지에 일관되게 적용
- 단점: 기존 코드 수정 범위가 큼

### 선택한 방법 (추천)

**접근 방법 1 + 좋아요/싫어요 기능 추가**

**이유**:
1. 빠른 레이아웃 수정 가능
2. 좋아요/싫어요 기능은 독립적으로 구현
3. 단계적 개선 가능

---

## ⚙️ 구현 계획

### Task 3.5.1: 전역 레이아웃 중앙 정렬 수정 (1h)

**파일 경로**:
- `app/globals.css` (수정)
- `components/sections/*.tsx` (확인 및 수정)

**구현 단계**:
- [ ] 1. globals.css에서 container 스타일 확인 및 수정 (30min)
  - max-width 조정
  - margin: 0 auto 확인
  - padding 조정

- [ ] 2. 주요 섹션 컴포넌트 확인 (30min)
  - HeroSection
  - TrendingCities
  - TopRatedCities
  - 도시 상세 페이지

**검증 기준**:
- [ ] 모든 페이지가 화면 중앙에 정렬됨
- [ ] 양옆 여백이 균등함
- [ ] 모바일/태블릿/데스크톱에서 모두 정상

---

### Task 3.5.2: 좋아요/싫어요 타입 정의 (30min)

**파일 경로**:
- `types/index.ts` (수정)

**구현 단계**:
- [ ] 1. CityLikes 인터페이스 정의 (15min)
  ```typescript
  export interface CityLikes {
    cityId: string;
    likes: number;
    dislikes: number;
  }

  export interface UserCityReaction {
    cityId: string;
    reaction: 'like' | 'dislike' | null;
  }
  ```

- [ ] 2. City 타입에 likes/dislikes 필드 추가 (15min)
  ```typescript
  export interface City {
    // ... 기존 필드
    likes?: number;
    dislikes?: number;
  }
  ```

**검증 기준**:
- [ ] TypeScript 타입 에러 없음

---

### Task 3.5.3: localStorage 좋아요/싫어요 관리 구현 (2h)

**파일 경로**:
- `lib/city-likes-storage.ts` (생성)

**구현 단계**:
- [ ] 1. getCityLikes 함수 구현 (30min)
  - localStorage에서 읽기
  - 기본값 반환

- [ ] 2. toggleLike/toggleDislike 함수 구현 (1h)
  - 좋아요 토글 (이미 좋아요면 취소, 싫어요였으면 변경)
  - 싫어요 토글
  - localStorage에 저장
  - 사용자별 반응 저장 (중복 방지)

- [ ] 3. getUserReaction 함수 구현 (30min)
  - 현재 사용자의 반응 상태 가져오기

**검증 기준**:
- [ ] localStorage에 저장됨
- [ ] 새로고침 후에도 유지됨
- [ ] 좋아요/싫어요 상호 배타적 동작

---

### Task 3.5.4: 좋아요/싫어요 버튼 컴포넌트 구현 (2h)

**파일 경로**:
- `components/city-likes-button.tsx` (생성)

**구현 단계**:
- [ ] 1. LikeButton UI 구현 (1h)
  - ThumbsUp/ThumbsDown 아이콘 (lucide-react)
  - 활성/비활성 스타일
  - 개수 표시

- [ ] 2. 클릭 핸들러 구현 (30min)
  - toggleLike/toggleDislike 호출
  - 상태 업데이트

- [ ] 3. 애니메이션 추가 (30min)
  - 클릭 시 bounce 효과
  - transition 효과

**검증 기준**:
- [ ] 버튼 클릭 시 상태 변경
- [ ] 아이콘 색상 변경 (활성/비활성)
- [ ] 개수가 즉시 업데이트됨

---

### Task 3.5.5: CityCard에 좋아요/싫어요 버튼 추가 (1h)

**파일 경로**:
- `components/city-card.tsx` (수정)

**구현 단계**:
- [ ] 1. CityLikesButton import 및 배치 (30min)
  - 카드 하단에 배치
  - 레이아웃 조정

- [ ] 2. 스타일링 (30min)
  - 카드 내 적절한 위치
  - 반응형 처리

**검증 기준**:
- [ ] 모든 도시 카드에 버튼 표시
- [ ] 클릭 시 정상 작동
- [ ] 레이아웃이 깨지지 않음

---

### Task 3.5.6: 도시 상세 페이지에 좋아요/싫어요 추가 (1.5h)

**파일 경로**:
- `app/cities/[slug]/page.tsx` (수정)

**구현 단계**:
- [ ] 1. 헤더 섹션에 버튼 추가 (1h)
  - 도시명 옆 또는 아래에 배치
  - 크게 표시

- [ ] 2. 통계 카드에 좋아요/싫어요 개수 표시 (30min)
  - StatsCards 컴포넌트 수정

**검증 기준**:
- [ ] 도시 상세 페이지에 버튼 표시
- [ ] 통계 섹션에 개수 표시
- [ ] 반응형 레이아웃

---

### Task 3.5.7: Mock 데이터에 좋아요/싫어요 초기값 추가 (30min)

**파일 경로**:
- `lib/mock-data.ts` (수정)

**구현 단계**:
- [ ] 1. 15개 도시에 likes/dislikes 값 추가 (30min)
  - 랜덤한 값 (likes: 50-500, dislikes: 10-100)

**검증 기준**:
- [ ] 모든 도시에 초기값 존재
- [ ] 데이터가 자연스러움

---

### Task 3.5.8: 반응형 레이아웃 최종 확인 (1h)

**파일 경로**:
- 모든 페이지 확인

**구현 단계**:
- [ ] 1. 모바일 (~ 767px) 확인 (20min)
- [ ] 2. 태블릿 (768px ~ 1023px) 확인 (20min)
- [ ] 3. 데스크톱 (1024px ~) 확인 (20min)

**검증 기준**:
- [ ] 모든 디바이스에서 중앙 정렬
- [ ] 버튼이 정상 표시
- [ ] 레이아웃이 깨지지 않음

---

## 📁 영향받는 파일

### 수정할 파일
- `app/globals.css` - container 스타일 수정
- `types/index.ts` - CityLikes, UserCityReaction 타입 추가
- `lib/mock-data.ts` - 좋아요/싫어요 초기값 추가
- `components/city-card.tsx` - 버튼 추가
- `app/cities/[slug]/page.tsx` - 버튼 및 통계 추가

### 신규 생성 파일
- `lib/city-likes-storage.ts` - localStorage 관리
- `components/city-likes-button.tsx` - 버튼 컴포넌트

---

## 🧪 테스트 계획

### Given-When-Then 시나리오

**시나리오 1: 좋아요 클릭**
```
Given: 사용자가 도시 카드를 보고 있음
When: 좋아요 버튼 클릭
Then:
  - 좋아요 아이콘이 파란색으로 변경됨
  - 좋아요 개수가 1 증가함
  - localStorage에 저장됨
```

**시나리오 2: 좋아요 → 싫어요 변경**
```
Given: 사용자가 이미 좋아요를 누른 상태
When: 싫어요 버튼 클릭
Then:
  - 좋아요 아이콘이 비활성화됨
  - 좋아요 개수가 1 감소함
  - 싫어요 아이콘이 빨간색으로 변경됨
  - 싫어요 개수가 1 증가함
```

**시나리오 3: 좋아요 취소**
```
Given: 사용자가 이미 좋아요를 누른 상태
When: 좋아요 버튼 다시 클릭
Then:
  - 좋아요 아이콘이 비활성화됨
  - 좋아요 개수가 1 감소함
```

**시나리오 4: 페이지 새로고침 후 유지**
```
Given: 사용자가 좋아요를 누름
When: 페이지 새로고침 (F5)
Then:
  - 좋아요 상태가 유지됨
  - 좋아요 아이콘이 여전히 활성화 상태
  - 개수가 동일함
```

**시나리오 5: 레이아웃 중앙 정렬**
```
Given: 사용자가 데스크톱에서 사이트 접속
When: 홈페이지 또는 도시 상세 페이지 접속
Then:
  - 콘텐츠가 화면 중앙에 정렬됨
  - 양옆 여백이 균등함
  - 최대 너비가 적절함 (예: 1280px)
```

---

## ✅ 완료 기준

- [ ] 모든 Task (3.5.1 ~ 3.5.8) 완료
- [ ] 모든 테스트 시나리오 통과
- [ ] TypeScript 타입 에러 없음 (`npx tsc --noEmit`)
- [ ] ESLint 경고 없음 (`npm run lint`)
- [ ] 레이아웃이 모든 페이지에서 중앙 정렬
- [ ] 좋아요/싫어요 버튼이 모든 도시에 표시
- [ ] localStorage에 데이터 영구 저장
- [ ] 모바일/태블릿/데스크톱 모두 정상 작동

---

## ⚠️ 주의사항

### 기술적 고려사항

1. **레이아웃 일관성**
   - 모든 섹션이 동일한 max-width 사용
   - container 클래스 일관되게 적용

2. **좋아요/싫어요 중복 방지**
   - 사용자당 1번만 클릭 가능
   - 좋아요와 싫어요는 상호 배타적

3. **성능 최적화**
   - localStorage 읽기/쓰기 최소화
   - debounce 적용 (필요시)

4. **아이콘 크기**
   - 도시 카드: 작은 아이콘 (w-4 h-4)
   - 도시 상세 페이지: 큰 아이콘 (w-6 h-6)

### 잠재적 부작용

- **localStorage 용량**: 많은 도시에 반응 시 용량 문제 가능
  - 해결: 최근 반응만 저장 (최대 100개)

- **여러 탭 동기화**: 다른 탭에서 변경 시 동기화 필요
  - 해결: storage 이벤트 리스너

---

## 🔗 Task 의존성

```
Task 3.5.1 (레이아웃 수정) [독립]

Task 3.5.2 (타입 정의)
  └─ Task 3.5.3 (localStorage 관리)
      └─ Task 3.5.4 (버튼 컴포넌트)
          ├─ Task 3.5.5 (CityCard 수정)
          ├─ Task 3.5.6 (상세 페이지 수정)
          └─ Task 3.5.7 (Mock 데이터) [병렬]

Task 3.5.8 (최종 확인) [모든 Task 완료 후]
```

---

## 📊 예상 시간

- Task 3.5.1: 1시간
- Task 3.5.2: 0.5시간
- Task 3.5.3: 2시간
- Task 3.5.4: 2시간
- Task 3.5.5: 1시간
- Task 3.5.6: 1.5시간
- Task 3.5.7: 0.5시간
- Task 3.5.8: 1시간

**총 예상 시간**: 9.5시간 (약 1-2일)
**우선순위**: P1 (높음)

---

## 🧾 기술 부채

| ID | 설명 | 우선순위 | 해결 Phase |
|----|------|----------|------------|
| TD-351 | localStorage 대신 DB 사용 | P0 | Phase 4 |
| TD-352 | 좋아요/싫어요 애니메이션 개선 | P2 | Phase 7 |
| TD-353 | 좋아요/싫어요 통계 차트 | P2 | Phase 8 |

---

## 📚 참고 자료

- [Tailwind Container](https://tailwindcss.com/docs/container)
- [localStorage API](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
- [Lucide Icons - ThumbsUp/ThumbsDown](https://lucide.dev/icons/thumbs-up)

---

## 🎨 디자인 가이드

### 좋아요 버튼
- **기본**: 회색 아이콘 (text-gray-400)
- **활성화**: 파란색 아이콘 (text-blue-500)
- **크기**: 도시 카드 - h-4 w-4, 상세 페이지 - h-6 w-6

### 싫어요 버튼
- **기본**: 회색 아이콘 (text-gray-400)
- **활성화**: 빨간색 아이콘 (text-red-500)
- **크기**: 도시 카드 - h-4 w-4, 상세 페이지 - h-6 w-6

### 레이아웃
- **최대 너비**: max-w-7xl (1280px)
- **여백**: px-4 sm:px-6 lg:px-8
- **중앙 정렬**: mx-auto

---

## 🚀 다음 단계

Phase 3.5가 완료되면 다음 Phase에서:
- 좋아요/싫어요 순위 페이지
- 좋아요 많은 도시 추천
- 사용자별 맞춤 추천

등을 진행할 예정입니다.
