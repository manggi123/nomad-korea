import { describe, it, expect } from 'vitest';
import {
  transformDbCityToCity,
  transformDbCitiesToCities,
  transformReviewWithUserToReview,
  transformReviewsWithUserToReviews,
  transformDbCafeToCafe,
  transformDbCafesToCafes,
  transformDbCoworkingToCoworking,
  transformDbCoworkingsToCoworkings,
  transformSearchResultToCity,
  transformSearchResultsToCities,
  type SearchCityResult,
} from './type-transformers';
import type { Tables, ReviewWithUser } from '@/types/database.types';

describe('type-transformers', () => {
  describe('transformDbCityToCity', () => {
    const mockDbCity: Tables<'cities'> = {
      id: 'city-1',
      name: '서울',
      region: '서울특별시',
      slug: 'seoul',
      image_url: '/images/seoul.jpg',
      avg_rating: 4.5,
      review_count: 150,
      avg_monthly_cost: 1500000,
      avg_internet_speed: 200,
      cafe_count: 100,
      coworking_count: 50,
      transport_score: 4.8,
      environment_score: 3.5,
      dev_score: 4.7,
      design_score: 4.2,
      trending_score: 85,
      likes: 120,
      dislikes: 15,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-15T00:00:00Z',
    };

    it('DB 도시를 프론트엔드 City 타입으로 변환해야 함', () => {
      const city = transformDbCityToCity(mockDbCity);

      expect(city.id).toBe('city-1');
      expect(city.name).toBe('서울');
      expect(city.region).toBe('서울특별시');
      expect(city.slug).toBe('seoul');
      expect(city.imageUrl).toBe('/images/seoul.jpg'); // snake_case → camelCase
      expect(city.avgRating).toBe(4.5);
      expect(city.reviewCount).toBe(150);
      expect(city.avgMonthlyCost).toBe(1500000);
      expect(city.avgInternetSpeed).toBe(200);
      expect(city.cafeCount).toBe(100);
      expect(city.coworkingCount).toBe(50);
      expect(city.transportScore).toBe(4.8);
      expect(city.environmentScore).toBe(3.5);
      expect(city.devScore).toBe(4.7);
      expect(city.designScore).toBe(4.2);
      expect(city.trendingScore).toBe(85);
      expect(city.likes).toBe(120);
      expect(city.dislikes).toBe(15);
    });

    it('숫자 타입 변환이 올바르게 동작해야 함', () => {
      const dbCity = { ...mockDbCity, avg_rating: '4.5' as unknown as number };
      const city = transformDbCityToCity(dbCity);

      expect(typeof city.avgRating).toBe('number');
      expect(city.avgRating).toBe(4.5);
    });

    it('소수점 점수를 Number로 변환해야 함', () => {
      const dbCity = {
        ...mockDbCity,
        transport_score: 3.333333,
        environment_score: 4.666666,
      };
      const city = transformDbCityToCity(dbCity);

      expect(city.transportScore).toBeCloseTo(3.333333);
      expect(city.environmentScore).toBeCloseTo(4.666666);
    });
  });

  describe('transformDbCitiesToCities', () => {
    const mockDbCities: Tables<'cities'>[] = [
      {
        id: 'city-1',
        name: '서울',
        region: '서울특별시',
        slug: 'seoul',
        image_url: '/images/seoul.jpg',
        avg_rating: 4.5,
        review_count: 150,
        avg_monthly_cost: 1500000,
        avg_internet_speed: 200,
        cafe_count: 100,
        coworking_count: 50,
        transport_score: 4.8,
        environment_score: 3.5,
        dev_score: 4.7,
        design_score: 4.2,
        trending_score: 85,
        likes: 120,
        dislikes: 15,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-15T00:00:00Z',
      },
      {
        id: 'city-2',
        name: '부산',
        region: '부산광역시',
        slug: 'busan',
        image_url: '/images/busan.jpg',
        avg_rating: 4.3,
        review_count: 80,
        avg_monthly_cost: 1200000,
        avg_internet_speed: 150,
        cafe_count: 70,
        coworking_count: 30,
        transport_score: 4.2,
        environment_score: 4.5,
        dev_score: 3.8,
        design_score: 4.0,
        trending_score: 72,
        likes: 85,
        dislikes: 10,
        created_at: '2024-01-02T00:00:00Z',
        updated_at: '2024-01-16T00:00:00Z',
      },
    ];

    it('DB 도시 배열을 프론트엔드 City 배열로 변환해야 함', () => {
      const cities = transformDbCitiesToCities(mockDbCities);

      expect(cities).toHaveLength(2);
      expect(cities[0].name).toBe('서울');
      expect(cities[1].name).toBe('부산');
    });

    it('빈 배열을 처리해야 함', () => {
      const cities = transformDbCitiesToCities([]);
      expect(cities).toEqual([]);
    });

    it('각 도시가 올바르게 변환되어야 함', () => {
      const cities = transformDbCitiesToCities(mockDbCities);

      cities.forEach((city) => {
        expect(city).toHaveProperty('imageUrl');
        expect(city).toHaveProperty('avgRating');
        expect(city).not.toHaveProperty('image_url');
        expect(city).not.toHaveProperty('avg_rating');
      });
    });
  });

  describe('transformReviewWithUserToReview', () => {
    const mockReviewWithUser: ReviewWithUser = {
      id: 'review-1',
      city_id: 'city-1',
      user_id: 'user-1',
      rating: 5,
      comment: '정말 좋은 도시입니다.',
      likes_count: 15,
      comments_count: 3,
      created_at: '2024-01-15T10:30:00Z',
      updated_at: '2024-01-15T10:30:00Z',
      username: 'testuser',
      avatar_url: '/avatars/user1.jpg',
      job_category: 'developer',
      city_name: '서울',
    };

    it('ReviewWithUser를 프론트엔드 Review 타입으로 변환해야 함', () => {
      const review = transformReviewWithUserToReview(mockReviewWithUser);

      expect(review.id).toBe('review-1');
      expect(review.cityId).toBe('city-1'); // snake_case → camelCase
      expect(review.cityName).toBe('서울');
      expect(review.username).toBe('testuser');
      expect(review.avatarUrl).toBe('/avatars/user1.jpg');
      expect(review.rating).toBe(5);
      expect(review.comment).toBe('정말 좋은 도시입니다.');
      expect(review.likesCount).toBe(15);
      expect(review.commentsCount).toBe(3);
      expect(review.createdAt).toBe('2024-01-15T10:30:00Z');
      expect(review.jobCategory).toBe('developer');
    });

    it('avatar_url이 null이면 undefined로 변환해야 함', () => {
      const reviewWithNullAvatar = { ...mockReviewWithUser, avatar_url: null };
      const review = transformReviewWithUserToReview(reviewWithNullAvatar);

      expect(review.avatarUrl).toBeUndefined();
    });

    it('job_category가 null이면 developer로 기본값 설정해야 함', () => {
      const reviewWithNullJob = { ...mockReviewWithUser, job_category: null };
      const review = transformReviewWithUserToReview(reviewWithNullJob);

      expect(review.jobCategory).toBe('developer');
    });

    it('모든 직업군 타입을 올바르게 변환해야 함', () => {
      const jobCategories = ['developer', 'designer', 'marketer', 'writer', 'video-producer', 'planner'] as const;

      jobCategories.forEach((jobCategory) => {
        const reviewWithJob = { ...mockReviewWithUser, job_category: jobCategory };
        const review = transformReviewWithUserToReview(reviewWithJob);
        expect(review.jobCategory).toBe(jobCategory);
      });
    });
  });

  describe('transformReviewsWithUserToReviews', () => {
    const mockReviewsWithUser: ReviewWithUser[] = [
      {
        id: 'review-1',
        city_id: 'city-1',
        user_id: 'user-1',
        rating: 5,
        comment: '정말 좋습니다.',
        likes_count: 15,
        comments_count: 3,
        created_at: '2024-01-15T10:30:00Z',
        updated_at: '2024-01-15T10:30:00Z',
        username: 'testuser',
        avatar_url: '/avatars/user1.jpg',
        job_category: 'developer',
        city_name: '서울',
      },
      {
        id: 'review-2',
        city_id: 'city-2',
        user_id: 'user-2',
        rating: 4,
        comment: '좋아요!',
        likes_count: 8,
        comments_count: 1,
        created_at: '2024-01-10T14:20:00Z',
        updated_at: '2024-01-10T14:20:00Z',
        username: 'designer_kim',
        avatar_url: null,
        job_category: 'designer',
        city_name: '부산',
      },
    ];

    it('ReviewWithUser 배열을 Review 배열로 변환해야 함', () => {
      const reviews = transformReviewsWithUserToReviews(mockReviewsWithUser);

      expect(reviews).toHaveLength(2);
      expect(reviews[0].username).toBe('testuser');
      expect(reviews[1].username).toBe('designer_kim');
    });

    it('빈 배열을 처리해야 함', () => {
      const reviews = transformReviewsWithUserToReviews([]);
      expect(reviews).toEqual([]);
    });
  });

  describe('transformDbCafeToCafe', () => {
    const mockDbCafe: Tables<'cafes'> = {
      id: 'cafe-1',
      name: '스타벅스 강남점',
      city_id: 'city-1',
      rating: 4.2,
      price_level: 2,
      wifi_speed: 100,
      has_outlet: true,
      address: '서울시 강남구 역삼동',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-15T00:00:00Z',
    };

    it('DB 카페를 프론트엔드 Cafe 타입으로 변환해야 함', () => {
      const cafe = transformDbCafeToCafe(mockDbCafe);

      expect(cafe.id).toBe('cafe-1');
      expect(cafe.name).toBe('스타벅스 강남점');
      expect(cafe.cityId).toBe('city-1'); // snake_case → camelCase
      expect(cafe.rating).toBe(4.2);
      expect(cafe.priceLevel).toBe(2);
      expect(cafe.wifiSpeed).toBe(100);
      expect(cafe.hasOutlet).toBe(true);
      expect(cafe.address).toBe('서울시 강남구 역삼동');
    });

    it('rating을 Number로 변환해야 함', () => {
      const dbCafe = { ...mockDbCafe, rating: '4.5' as unknown as number };
      const cafe = transformDbCafeToCafe(dbCafe);

      expect(typeof cafe.rating).toBe('number');
    });

    it('모든 price_level 값을 처리해야 함', () => {
      const priceLevels = [1, 2, 3] as const;

      priceLevels.forEach((priceLevel) => {
        const dbCafe = { ...mockDbCafe, price_level: priceLevel };
        const cafe = transformDbCafeToCafe(dbCafe);
        expect(cafe.priceLevel).toBe(priceLevel);
      });
    });

    it('hasOutlet false 값을 처리해야 함', () => {
      const dbCafe = { ...mockDbCafe, has_outlet: false };
      const cafe = transformDbCafeToCafe(dbCafe);
      expect(cafe.hasOutlet).toBe(false);
    });
  });

  describe('transformDbCafesToCafes', () => {
    const mockDbCafes: Tables<'cafes'>[] = [
      {
        id: 'cafe-1',
        name: '스타벅스',
        city_id: 'city-1',
        rating: 4.2,
        price_level: 2,
        wifi_speed: 100,
        has_outlet: true,
        address: '서울시 강남구',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-15T00:00:00Z',
      },
      {
        id: 'cafe-2',
        name: '투썸플레이스',
        city_id: 'city-1',
        rating: 4.0,
        price_level: 2,
        wifi_speed: 80,
        has_outlet: true,
        address: '서울시 강남구',
        created_at: '2024-01-02T00:00:00Z',
        updated_at: '2024-01-16T00:00:00Z',
      },
    ];

    it('DB 카페 배열을 프론트엔드 Cafe 배열로 변환해야 함', () => {
      const cafes = transformDbCafesToCafes(mockDbCafes);

      expect(cafes).toHaveLength(2);
      expect(cafes[0].name).toBe('스타벅스');
      expect(cafes[1].name).toBe('투썸플레이스');
    });

    it('빈 배열을 처리해야 함', () => {
      const cafes = transformDbCafesToCafes([]);
      expect(cafes).toEqual([]);
    });
  });

  describe('transformDbCoworkingToCoworking', () => {
    const mockDbCoworking: Tables<'coworking_spaces'> = {
      id: 'coworking-1',
      name: '위워크 강남점',
      city_id: 'city-1',
      rating: 4.5,
      daily_price: 30000,
      monthly_price: 500000,
      amenities: ['wifi', 'printer', 'meeting-room'],
      address: '서울시 강남구 테헤란로',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-15T00:00:00Z',
    };

    it('DB 코워킹을 프론트엔드 CoworkingSpace 타입으로 변환해야 함', () => {
      const coworking = transformDbCoworkingToCoworking(mockDbCoworking);

      expect(coworking.id).toBe('coworking-1');
      expect(coworking.name).toBe('위워크 강남점');
      expect(coworking.cityId).toBe('city-1'); // snake_case → camelCase
      expect(coworking.rating).toBe(4.5);
      expect(coworking.dailyPrice).toBe(30000);
      expect(coworking.monthlyPrice).toBe(500000);
      expect(coworking.amenities).toEqual(['wifi', 'printer', 'meeting-room']);
      expect(coworking.address).toBe('서울시 강남구 테헤란로');
    });

    it('rating을 Number로 변환해야 함', () => {
      const dbCoworking = { ...mockDbCoworking, rating: '4.5' as unknown as number };
      const coworking = transformDbCoworkingToCoworking(dbCoworking);

      expect(typeof coworking.rating).toBe('number');
    });

    it('빈 amenities 배열을 처리해야 함', () => {
      const dbCoworking = { ...mockDbCoworking, amenities: [] };
      const coworking = transformDbCoworkingToCoworking(dbCoworking);

      expect(coworking.amenities).toEqual([]);
    });
  });

  describe('transformDbCoworkingsToCoworkings', () => {
    const mockDbCoworkings: Tables<'coworking_spaces'>[] = [
      {
        id: 'coworking-1',
        name: '위워크',
        city_id: 'city-1',
        rating: 4.5,
        daily_price: 30000,
        monthly_price: 500000,
        amenities: ['wifi', 'printer'],
        address: '서울시 강남구',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-15T00:00:00Z',
      },
      {
        id: 'coworking-2',
        name: '패스트파이브',
        city_id: 'city-1',
        rating: 4.3,
        daily_price: 25000,
        monthly_price: 450000,
        amenities: ['wifi', 'locker'],
        address: '서울시 강남구',
        created_at: '2024-01-02T00:00:00Z',
        updated_at: '2024-01-16T00:00:00Z',
      },
    ];

    it('DB 코워킹 배열을 프론트엔드 CoworkingSpace 배열로 변환해야 함', () => {
      const coworkings = transformDbCoworkingsToCoworkings(mockDbCoworkings);

      expect(coworkings).toHaveLength(2);
      expect(coworkings[0].name).toBe('위워크');
      expect(coworkings[1].name).toBe('패스트파이브');
    });

    it('빈 배열을 처리해야 함', () => {
      const coworkings = transformDbCoworkingsToCoworkings([]);
      expect(coworkings).toEqual([]);
    });
  });

  describe('transformSearchResultToCity', () => {
    const mockSearchResult: SearchCityResult = {
      id: 'city-1',
      name: '서울',
      region: '서울특별시',
      slug: 'seoul',
      image_url: '/images/seoul.jpg',
      avg_rating: 4.5,
      review_count: 150,
      avg_monthly_cost: 1500000,
    };

    it('검색 결과를 프론트엔드 City 타입으로 변환해야 함', () => {
      const city = transformSearchResultToCity(mockSearchResult);

      expect(city.id).toBe('city-1');
      expect(city.name).toBe('서울');
      expect(city.region).toBe('서울특별시');
      expect(city.slug).toBe('seoul');
      expect(city.imageUrl).toBe('/images/seoul.jpg');
      expect(city.avgRating).toBe(4.5);
      expect(city.reviewCount).toBe(150);
      expect(city.avgMonthlyCost).toBe(1500000);
    });

    it('검색 결과에 없는 필드는 기본값 0을 사용해야 함', () => {
      const city = transformSearchResultToCity(mockSearchResult);

      expect(city.avgInternetSpeed).toBe(0);
      expect(city.cafeCount).toBe(0);
      expect(city.coworkingCount).toBe(0);
      expect(city.transportScore).toBe(0);
      expect(city.environmentScore).toBe(0);
      expect(city.devScore).toBe(0);
      expect(city.designScore).toBe(0);
      expect(city.trendingScore).toBe(0);
      expect(city.likes).toBe(0);
      expect(city.dislikes).toBe(0);
    });

    it('avg_rating을 Number로 변환해야 함', () => {
      const searchResult = { ...mockSearchResult, avg_rating: '4.5' as unknown as number };
      const city = transformSearchResultToCity(searchResult);

      expect(typeof city.avgRating).toBe('number');
    });
  });

  describe('transformSearchResultsToCities', () => {
    const mockSearchResults: SearchCityResult[] = [
      {
        id: 'city-1',
        name: '서울',
        region: '서울특별시',
        slug: 'seoul',
        image_url: '/images/seoul.jpg',
        avg_rating: 4.5,
        review_count: 150,
        avg_monthly_cost: 1500000,
      },
      {
        id: 'city-2',
        name: '부산',
        region: '부산광역시',
        slug: 'busan',
        image_url: '/images/busan.jpg',
        avg_rating: 4.3,
        review_count: 80,
        avg_monthly_cost: 1200000,
      },
    ];

    it('검색 결과 배열을 City 배열로 변환해야 함', () => {
      const cities = transformSearchResultsToCities(mockSearchResults);

      expect(cities).toHaveLength(2);
      expect(cities[0].name).toBe('서울');
      expect(cities[1].name).toBe('부산');
    });

    it('빈 배열을 처리해야 함', () => {
      const cities = transformSearchResultsToCities([]);
      expect(cities).toEqual([]);
    });

    it('각 도시가 기본값을 포함해야 함', () => {
      const cities = transformSearchResultsToCities(mockSearchResults);

      cities.forEach((city) => {
        expect(city.avgInternetSpeed).toBe(0);
        expect(city.cafeCount).toBe(0);
      });
    });
  });
});
