// 도시 데이터 타입
export interface City {
  id: string;
  name: string;
  region: string;
  slug: string;
  imageUrl: string;
  avgRating: number;
  reviewCount: number;
  avgMonthlyCost: number;
  avgInternetSpeed: number;
  cafeCount: number;
  coworkingCount: number;
  transportScore: number;
  environmentScore: number;
  devScore: number;
  designScore: number;
  trendingScore?: number;
  likes?: number;
  dislikes?: number;
}

// 리뷰 데이터 타입
export interface Review {
  id: string;
  cityId: string;
  cityName: string;
  username: string;
  avatarUrl?: string;
  rating: number;
  comment: string;
  likesCount: number;
  commentsCount: number;
  createdAt: string;
  jobCategory: string;
}

// 사용자 타입
export interface User {
  id: string;
  username: string;
  avatarUrl?: string;
  jobCategory: string;
  reviewCount: number;
}

// 예산 범위 타입
export type BudgetRange = 'under-100' | '100-150' | '150-200' | 'over-200';

// 도시 분위기 타입
export type CityVibe = 'energetic' | 'calm' | 'modern' | 'traditional';

// 직업군 타입
export type JobCategory = 'developer' | 'designer' | 'marketer' | 'writer' | 'video-producer' | 'planner';

// 필터 타입
export interface CityFilter {
  budget?: BudgetRange;
  minInternetSpeed?: number;
  minCafeCount?: number;
  minCoworkingCount?: number;
  cityVibe?: CityVibe;
  jobCategory?: JobCategory;
}

// 통계 데이터 타입
export interface RealtimeStats {
  currentWorking: {
    cityName: string;
    count: number;
  }[];
  monthlyPopular: {
    rank: number;
    cityName: string;
    reviewCount: number;
    change: number;
  }[];
}

// 커뮤니티 모임 타입
export interface CommunityMeetup {
  id: string;
  title: string;
  cityName: string;
  date: string;
  participants: number;
  maxParticipants: number;
}

// 검색 필터 타입
export interface SearchFilters {
  regions?: string[];      // 선택된 지역 목록
  minBudget?: number;      // 최소 예산
  maxBudget?: number;      // 최대 예산
  minRating?: number;      // 최소 평점
}

// 검색 히스토리 타입
export interface SearchHistory {
  id: string;
  query: string;
  timestamp: number;
}

// 리뷰 정렬 옵션
export type ReviewSortOption = 'latest' | 'rating' | 'likes';

// 리뷰 직업군 필터
export type ReviewJobFilter = 'all' | JobCategory;

// 리뷰 필터 상태
export interface ReviewFilterState {
  sortBy: ReviewSortOption;
  jobFilter: ReviewJobFilter;
  page: number;
}

// 카페 데이터 타입
export interface Cafe {
  id: string;
  name: string;
  cityId: string;
  rating: number;
  priceLevel: 1 | 2 | 3;
  wifiSpeed: number;
  hasOutlet: boolean;
  address: string;
}

// 코워킹 스페이스 데이터 타입
export interface CoworkingSpace {
  id: string;
  name: string;
  cityId: string;
  rating: number;
  dailyPrice: number;
  monthlyPrice: number;
  amenities: string[];
  address: string;
}

// 리뷰 입력 데이터 타입
export interface ReviewInput {
  cityId: string;
  rating: number;
  comment: string;
  jobCategory: JobCategory;
}

// 유효성 검사 결과 타입
export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

// 도시 좋아요/싫어요 데이터 타입
export interface CityLikes {
  cityId: string;
  likes: number;
  dislikes: number;
}

// 사용자의 도시 반응 타입
export interface UserCityReaction {
  cityId: string;
  reaction: 'like' | 'dislike' | null;
}

// 홈페이지 필터 타입
export type BudgetFilter = 'all' | 'budget' | 'mid' | 'premium' | 'luxury';
export type RegionFilter = 'all' | 'seoul' | 'gyeonggi' | 'busan' | 'jeju' | 'gangwon' | 'chungcheong' | 'jeolla' | 'gyeongsang';
export type EnvironmentFilter = 'all' | 'urban' | 'suburb' | 'nature' | 'beach' | 'mountain';
export type SeasonFilter = 'all' | 'spring' | 'summer' | 'fall' | 'winter';
export type AmenityFilter = 'all' | 'coworking' | 'cafe' | 'fast-internet' | 'high-environment';

// 홈페이지 필터 상태
export interface HomeFilters {
  budget: BudgetFilter;
  region: RegionFilter;
  environment: EnvironmentFilter;
  season: SeasonFilter;
  amenity: AmenityFilter;
}
