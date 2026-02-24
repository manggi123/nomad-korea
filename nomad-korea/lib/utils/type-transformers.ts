/**
 * Supabase 데이터베이스 타입 → 프론트엔드 타입 변환 유틸리티
 */

import type { City, Review, Cafe, CoworkingSpace } from '@/types';
import type {
  Tables,
  ReviewWithUser
} from '@/types/database.types';

/**
 * DB City 타입을 프론트엔드 City 타입으로 변환
 */
export function transformDbCityToCity(dbCity: Tables<'cities'>): City {
  return {
    id: dbCity.id,
    name: dbCity.name,
    region: dbCity.region,
    slug: dbCity.slug,
    imageUrl: dbCity.image_url,
    avgRating: Number(dbCity.avg_rating),
    reviewCount: dbCity.review_count,
    avgMonthlyCost: dbCity.avg_monthly_cost,
    avgInternetSpeed: dbCity.avg_internet_speed,
    cafeCount: dbCity.cafe_count,
    coworkingCount: dbCity.coworking_count,
    transportScore: Number(dbCity.transport_score),
    environmentScore: Number(dbCity.environment_score),
    devScore: Number(dbCity.dev_score),
    designScore: Number(dbCity.design_score),
    trendingScore: dbCity.trending_score,
    likes: dbCity.likes,
    dislikes: dbCity.dislikes,
    latitude: dbCity.latitude,
    longitude: dbCity.longitude,
  };
}

/**
 * DB City 배열을 프론트엔드 City 배열로 변환
 */
export function transformDbCitiesToCities(dbCities: Tables<'cities'>[]): City[] {
  return dbCities.map(transformDbCityToCity);
}

/**
 * ReviewWithUser 뷰 데이터를 프론트엔드 Review 타입으로 변환
 */
export function transformReviewWithUserToReview(reviewWithUser: ReviewWithUser): Review {
  return {
    id: reviewWithUser.id,
    cityId: reviewWithUser.city_id,
    cityName: reviewWithUser.city_name,
    username: reviewWithUser.username,
    avatarUrl: reviewWithUser.avatar_url || undefined,
    rating: reviewWithUser.rating,
    comment: reviewWithUser.comment,
    likesCount: reviewWithUser.likes_count,
    commentsCount: reviewWithUser.comments_count,
    createdAt: reviewWithUser.created_at,
    jobCategory: reviewWithUser.job_category || 'developer',
  };
}

/**
 * ReviewWithUser 배열을 프론트엔드 Review 배열로 변환
 */
export function transformReviewsWithUserToReviews(reviews: ReviewWithUser[]): Review[] {
  return reviews.map(transformReviewWithUserToReview);
}

/**
 * DB Cafe 타입을 프론트엔드 Cafe 타입으로 변환
 */
export function transformDbCafeToCafe(dbCafe: Tables<'cafes'>): Cafe {
  return {
    id: dbCafe.id,
    name: dbCafe.name,
    cityId: dbCafe.city_id,
    rating: Number(dbCafe.rating),
    priceLevel: dbCafe.price_level,
    wifiSpeed: dbCafe.wifi_speed,
    hasOutlet: dbCafe.has_outlet,
    address: dbCafe.address,
  };
}

/**
 * DB Cafe 배열을 프론트엔드 Cafe 배열로 변환
 */
export function transformDbCafesToCafes(dbCafes: Tables<'cafes'>[]): Cafe[] {
  return dbCafes.map(transformDbCafeToCafe);
}

/**
 * DB CoworkingSpace 타입을 프론트엔드 CoworkingSpace 타입으로 변환
 */
export function transformDbCoworkingToCoworking(dbCoworking: Tables<'coworking_spaces'>): CoworkingSpace {
  return {
    id: dbCoworking.id,
    name: dbCoworking.name,
    cityId: dbCoworking.city_id,
    rating: Number(dbCoworking.rating),
    dailyPrice: dbCoworking.daily_price,
    monthlyPrice: dbCoworking.monthly_price,
    amenities: dbCoworking.amenities,
    address: dbCoworking.address,
  };
}

/**
 * DB CoworkingSpace 배열을 프론트엔드 CoworkingSpace 배열로 변환
 */
export function transformDbCoworkingsToCoworkings(dbCoworkings: Tables<'coworking_spaces'>[]): CoworkingSpace[] {
  return dbCoworkings.map(transformDbCoworkingToCoworking);
}

/**
 * 검색 결과 (search_cities 함수 반환값)를 프론트엔드 City 타입으로 변환
 * 참고: 검색 결과는 일부 필드만 포함하므로 기본값 사용
 */
export interface SearchCityResult {
  id: string;
  name: string;
  region: string;
  slug: string;
  image_url: string;
  avg_rating: number;
  review_count: number;
  avg_monthly_cost: number;
}

export function transformSearchResultToCity(result: SearchCityResult): City {
  return {
    id: result.id,
    name: result.name,
    region: result.region,
    slug: result.slug,
    imageUrl: result.image_url,
    avgRating: Number(result.avg_rating),
    reviewCount: result.review_count,
    avgMonthlyCost: result.avg_monthly_cost,
    // 검색 결과에 없는 필드는 기본값 사용
    avgInternetSpeed: 0,
    cafeCount: 0,
    coworkingCount: 0,
    transportScore: 0,
    environmentScore: 0,
    devScore: 0,
    designScore: 0,
    trendingScore: 0,
    likes: 0,
    dislikes: 0,
  };
}

/**
 * 검색 결과 배열 변환
 */
export function transformSearchResultsToCities(results: SearchCityResult[]): City[] {
  return results.map(transformSearchResultToCity);
}
