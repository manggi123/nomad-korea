import { City, Review, RealtimeStats, CommunityMeetup, User, Cafe, CoworkingSpace } from '@/types';

// 15개 도시 Mock 데이터
export const mockCities: City[] = [
  {
    id: '1',
    name: '강남구',
    region: '서울',
    slug: 'seoul-gangnam',
    imageUrl: 'https://placehold.co/800x450/3b82f6/ffffff?text=Seoul+Gangnam',
    avgRating: 4.5,
    reviewCount: 128,
    avgMonthlyCost: 1800000,
    avgInternetSpeed: 950,
    cafeCount: 450,
    coworkingCount: 35,
    transportScore: 9.5,
    environmentScore: 8.2,
    devScore: 9.0,
    designScore: 8.5,
    trendingScore: 15,
    likes: 432,
    dislikes: 28,
  },
  {
    id: '2',
    name: '성수동',
    region: '서울',
    slug: 'seoul-seongsu',
    imageUrl: 'https://placehold.co/800x450/10b981/ffffff?text=Seoul+Seongsu',
    avgRating: 4.7,
    reviewCount: 95,
    avgMonthlyCost: 1600000,
    avgInternetSpeed: 920,
    cafeCount: 280,
    coworkingCount: 28,
    transportScore: 8.8,
    environmentScore: 9.0,
    devScore: 8.8,
    designScore: 9.2,
    trendingScore: 28,
    likes: 521,
    dislikes: 15,
  },
  {
    id: '3',
    name: '홍대',
    region: '서울',
    slug: 'seoul-hongdae',
    imageUrl: 'https://placehold.co/800x450/f59e0b/ffffff?text=Seoul+Hongdae',
    avgRating: 4.4,
    reviewCount: 156,
    avgMonthlyCost: 1500000,
    avgInternetSpeed: 900,
    cafeCount: 380,
    coworkingCount: 22,
    transportScore: 9.0,
    environmentScore: 7.8,
    devScore: 8.2,
    designScore: 8.8,
    trendingScore: 12,
    likes: 384,
    dislikes: 32,
  },
  {
    id: '4',
    name: '제주시',
    region: '제주',
    slug: 'jeju-city',
    imageUrl: 'https://placehold.co/800x450/06b6d4/ffffff?text=Jeju+City',
    avgRating: 4.6,
    reviewCount: 142,
    avgMonthlyCost: 1300000,
    avgInternetSpeed: 750,
    cafeCount: 180,
    coworkingCount: 15,
    transportScore: 6.5,
    environmentScore: 9.5,
    devScore: 7.5,
    designScore: 8.0,
    trendingScore: 22,
    likes: 498,
    dislikes: 22,
  },
  {
    id: '5',
    name: '해운대',
    region: '부산',
    slug: 'busan-haeundae',
    imageUrl: 'https://placehold.co/800x450/8b5cf6/ffffff?text=Busan+Haeundae',
    avgRating: 4.5,
    reviewCount: 89,
    avgMonthlyCost: 1400000,
    avgInternetSpeed: 850,
    cafeCount: 220,
    coworkingCount: 18,
    transportScore: 8.0,
    environmentScore: 9.0,
    devScore: 7.8,
    designScore: 7.5,
    trendingScore: 18,
    likes: 356,
    dislikes: 28,
  },
  {
    id: '6',
    name: '광안리',
    region: '부산',
    slug: 'busan-gwangalli',
    imageUrl: 'https://placehold.co/800x450/ec4899/ffffff?text=Busan+Gwangalli',
    avgRating: 4.3,
    reviewCount: 76,
    avgMonthlyCost: 1350000,
    avgInternetSpeed: 830,
    cafeCount: 190,
    coworkingCount: 12,
    transportScore: 7.5,
    environmentScore: 8.8,
    devScore: 7.2,
    designScore: 7.8,
    trendingScore: 8,
    likes: 289,
    dislikes: 35,
  },
  {
    id: '7',
    name: '판교',
    region: '경기',
    slug: 'gyeonggi-pangyo',
    imageUrl: 'https://placehold.co/800x450/f97316/ffffff?text=Gyeonggi+Pangyo',
    avgRating: 4.4,
    reviewCount: 102,
    avgMonthlyCost: 1700000,
    avgInternetSpeed: 980,
    cafeCount: 250,
    coworkingCount: 32,
    transportScore: 8.5,
    environmentScore: 8.0,
    devScore: 9.5,
    designScore: 8.2,
    trendingScore: 10,
    likes: 405,
    dislikes: 25,
  },
  {
    id: '8',
    name: '분당',
    region: '경기',
    slug: 'gyeonggi-bundang',
    imageUrl: 'https://placehold.co/800x450/14b8a6/ffffff?text=Gyeonggi+Bundang',
    avgRating: 4.2,
    reviewCount: 68,
    avgMonthlyCost: 1650000,
    avgInternetSpeed: 920,
    cafeCount: 210,
    coworkingCount: 20,
    transportScore: 8.2,
    environmentScore: 8.5,
    devScore: 8.8,
    designScore: 7.5,
    trendingScore: 5,
    likes: 267,
    dislikes: 41,
  },
  {
    id: '9',
    name: '전주',
    region: '전북',
    slug: 'jeonbuk-jeonju',
    imageUrl: 'https://placehold.co/800x450/84cc16/ffffff?text=Jeonbuk+Jeonju',
    avgRating: 4.1,
    reviewCount: 54,
    avgMonthlyCost: 1100000,
    avgInternetSpeed: 700,
    cafeCount: 150,
    coworkingCount: 8,
    transportScore: 7.0,
    environmentScore: 8.2,
    devScore: 6.5,
    designScore: 7.0,
    trendingScore: 7,
    likes: 198,
    dislikes: 47,
  },
  {
    id: '10',
    name: '춘천',
    region: '강원',
    slug: 'gangwon-chuncheon',
    imageUrl: 'https://placehold.co/800x450/22c55e/ffffff?text=Gangwon+Chuncheon',
    avgRating: 4.3,
    reviewCount: 62,
    avgMonthlyCost: 1050000,
    avgInternetSpeed: 680,
    cafeCount: 120,
    coworkingCount: 6,
    transportScore: 6.8,
    environmentScore: 9.2,
    devScore: 6.8,
    designScore: 7.2,
    trendingScore: 14,
    likes: 312,
    dislikes: 29,
  },
  {
    id: '11',
    name: '경주',
    region: '경북',
    slug: 'gyeongbuk-gyeongju',
    imageUrl: 'https://placehold.co/800x450/a855f7/ffffff?text=Gyeongbuk+Gyeongju',
    avgRating: 4.0,
    reviewCount: 48,
    avgMonthlyCost: 1000000,
    avgInternetSpeed: 650,
    cafeCount: 100,
    coworkingCount: 5,
    transportScore: 6.5,
    environmentScore: 8.8,
    devScore: 6.0,
    designScore: 6.5,
    trendingScore: 6,
    likes: 176,
    dislikes: 52,
  },
  {
    id: '12',
    name: '강릉',
    region: '강원',
    slug: 'gangwon-gangneung',
    imageUrl: 'https://placehold.co/800x450/06b6d4/ffffff?text=Gangwon+Gangneung',
    avgRating: 4.4,
    reviewCount: 85,
    avgMonthlyCost: 1200000,
    avgInternetSpeed: 720,
    cafeCount: 160,
    coworkingCount: 10,
    transportScore: 7.2,
    environmentScore: 9.3,
    devScore: 7.0,
    designScore: 7.8,
    trendingScore: 20,
    likes: 421,
    dislikes: 24,
  },
  {
    id: '13',
    name: '여수',
    region: '전남',
    slug: 'jeonnam-yeosu',
    imageUrl: 'https://placehold.co/800x450/f43f5e/ffffff?text=Jeonnam+Yeosu',
    avgRating: 4.2,
    reviewCount: 58,
    avgMonthlyCost: 1150000,
    avgInternetSpeed: 690,
    cafeCount: 130,
    coworkingCount: 7,
    transportScore: 6.8,
    environmentScore: 9.0,
    devScore: 6.8,
    designScore: 7.3,
    trendingScore: 9,
    likes: 234,
    dislikes: 38,
  },
  {
    id: '14',
    name: '속초',
    region: '강원',
    slug: 'gangwon-sokcho',
    imageUrl: 'https://placehold.co/800x450/14b8a6/ffffff?text=Gangwon+Sokcho',
    avgRating: 4.1,
    reviewCount: 52,
    avgMonthlyCost: 1080000,
    avgInternetSpeed: 670,
    cafeCount: 110,
    coworkingCount: 6,
    transportScore: 6.5,
    environmentScore: 9.1,
    devScore: 6.5,
    designScore: 7.0,
    trendingScore: 11,
    likes: 245,
    dislikes: 36,
  },
  {
    id: '15',
    name: '대전',
    region: '대전',
    slug: 'daejeon-city',
    imageUrl: 'https://placehold.co/800x450/3b82f6/ffffff?text=Daejeon+City',
    avgRating: 4.3,
    reviewCount: 72,
    avgMonthlyCost: 1250000,
    avgInternetSpeed: 880,
    cafeCount: 200,
    coworkingCount: 16,
    transportScore: 8.0,
    environmentScore: 8.0,
    devScore: 8.5,
    designScore: 7.5,
    trendingScore: 13,
    likes: 328,
    dislikes: 31,
  },
];

// 리뷰 Mock 데이터
export const mockReviews: Review[] = [
  {
    id: '1',
    cityId: '2',
    cityName: '성수동',
    username: '김디자이너',
    avatarUrl: 'https://placehold.co/100x100/10b981/ffffff?text=KD',
    rating: 5,
    comment: '카페 분위기가 정말 좋아요. 창가 자리에서 작업하기 최고입니다!',
    likesCount: 24,
    commentsCount: 5,
    createdAt: '2024-01-28T10:30:00Z',
    jobCategory: 'designer',
  },
  {
    id: '2',
    cityId: '4',
    cityName: '제주시',
    username: '박개발자',
    avatarUrl: 'https://placehold.co/100x100/3b82f6/ffffff?text=PD',
    rating: 4,
    comment: '인터넷이 조금 느리지만 환경이 너무 좋아서 집중이 잘 돼요.',
    likesCount: 18,
    commentsCount: 3,
    createdAt: '2024-01-27T15:20:00Z',
    jobCategory: 'developer',
  },
  {
    id: '3',
    cityId: '1',
    cityName: '강남구',
    username: '이마케터',
    avatarUrl: 'https://placehold.co/100x100/f59e0b/ffffff?text=LM',
    rating: 5,
    comment: '코워킹 스페이스가 많아서 좋고, 네트워킹 기회도 많습니다.',
    likesCount: 32,
    commentsCount: 8,
    createdAt: '2024-01-26T09:15:00Z',
    jobCategory: 'marketer',
  },
  {
    id: '4',
    cityId: '12',
    cityName: '강릉',
    username: '최작가',
    avatarUrl: 'https://placehold.co/100x100/06b6d4/ffffff?text=CW',
    rating: 5,
    comment: '바다 보면서 작업하니 영감이 샘솟아요. 최고의 워케이션 장소!',
    likesCount: 28,
    commentsCount: 6,
    createdAt: '2024-01-25T14:40:00Z',
    jobCategory: 'writer',
  },
  {
    id: '5',
    cityId: '7',
    cityName: '판교',
    username: '정개발자',
    avatarUrl: 'https://placehold.co/100x100/3b82f6/ffffff?text=JD',
    rating: 4,
    comment: '개발자 커뮤니티가 활발하고 인프라가 정말 좋습니다.',
    likesCount: 21,
    commentsCount: 4,
    createdAt: '2024-01-24T11:20:00Z',
    jobCategory: 'developer',
  },
  {
    id: '6',
    cityId: '3',
    cityName: '홍대',
    username: '강영상PD',
    avatarUrl: 'https://placehold.co/100x100/f59e0b/ffffff?text=KV',
    rating: 4,
    comment: '젊은 에너지가 넘치고 촬영 스팟도 많아요.',
    likesCount: 15,
    commentsCount: 2,
    createdAt: '2024-01-23T16:50:00Z',
    jobCategory: 'video-producer',
  },
  {
    id: '7',
    cityId: '5',
    cityName: '해운대',
    username: '윤기획자',
    avatarUrl: 'https://placehold.co/100x100/8b5cf6/ffffff?text=YP',
    rating: 5,
    comment: '워라벨이 완벽해요. 일과 후 해변 산책이 최고입니다.',
    likesCount: 26,
    commentsCount: 7,
    createdAt: '2024-01-22T13:30:00Z',
    jobCategory: 'planner',
  },
  {
    id: '8',
    cityId: '10',
    cityName: '춘천',
    username: '한디자이너',
    avatarUrl: 'https://placehold.co/100x100/10b981/ffffff?text=HD',
    rating: 4,
    comment: '조용하고 집중하기 좋은 환경. 생활비도 저렴해요.',
    likesCount: 19,
    commentsCount: 5,
    createdAt: '2024-01-21T10:10:00Z',
    jobCategory: 'designer',
  },
  // 서울 강남 추가 리뷰 (페이지네이션 테스트용)
  {
    id: '9',
    cityId: '1',
    cityName: '강남구',
    username: '정개발자',
    avatarUrl: 'https://placehold.co/100x100/3b82f6/ffffff?text=JD',
    rating: 5,
    comment: '스타트업이 많아서 네트워킹하기 좋아요. 카페도 많고 인프라가 최고입니다!',
    likesCount: 45,
    commentsCount: 12,
    createdAt: '2024-02-01T14:20:00Z',
    jobCategory: 'developer',
  },
  {
    id: '10',
    cityId: '1',
    cityName: '강남구',
    username: '송디자이너',
    avatarUrl: 'https://placehold.co/100x100/10b981/ffffff?text=SD',
    rating: 4,
    comment: '디자인 스튜디오가 많아서 영감을 얻기 좋습니다. 다만 생활비가...',
    likesCount: 28,
    commentsCount: 6,
    createdAt: '2024-01-31T09:15:00Z',
    jobCategory: 'designer',
  },
  {
    id: '11',
    cityId: '1',
    cityName: '강남구',
    username: '윤마케터',
    avatarUrl: 'https://placehold.co/100x100/f59e0b/ffffff?text=YM',
    rating: 5,
    comment: '마케팅 이벤트와 세미나가 자주 열려요. 인사이트 얻기 좋은 곳!',
    likesCount: 38,
    commentsCount: 9,
    createdAt: '2024-01-30T16:45:00Z',
    jobCategory: 'marketer',
  },
  {
    id: '12',
    cityId: '1',
    cityName: '강남구',
    username: '강작가',
    avatarUrl: 'https://placehold.co/100x100/8b5cf6/ffffff?text=KW',
    rating: 3,
    comment: '너무 시끄럽고 복잡해서 집중이 잘 안 됩니다. 조용한 곳을 찾기 힘들어요.',
    likesCount: 12,
    commentsCount: 4,
    createdAt: '2024-01-29T11:30:00Z',
    jobCategory: 'writer',
  },
  {
    id: '13',
    cityId: '1',
    cityName: '강남구',
    username: '박개발자2',
    avatarUrl: 'https://placehold.co/100x100/3b82f6/ffffff?text=PD2',
    rating: 5,
    comment: '테헤란로에 IT 기업이 밀집되어 있어서 개발자로 일하기 최적의 장소입니다.',
    likesCount: 52,
    commentsCount: 15,
    createdAt: '2024-01-28T13:20:00Z',
    jobCategory: 'developer',
  },
  {
    id: '14',
    cityId: '1',
    cityName: '강남구',
    username: '최디자이너',
    avatarUrl: 'https://placehold.co/100x100/10b981/ffffff?text=CD',
    rating: 4,
    comment: '트렌디한 카페에서 작업하기 좋아요. 디자인 영감이 샘솟습니다.',
    likesCount: 31,
    commentsCount: 7,
    createdAt: '2024-01-27T10:10:00Z',
    jobCategory: 'designer',
  },
  {
    id: '15',
    cityId: '1',
    cityName: '강남구',
    username: '임개발자',
    avatarUrl: 'https://placehold.co/100x100/3b82f6/ffffff?text=LD',
    rating: 4,
    comment: '코워킹 스페이스가 잘 되어있고, 기가인터넷이 빵빵합니다!',
    likesCount: 41,
    commentsCount: 11,
    createdAt: '2024-01-26T15:40:00Z',
    jobCategory: 'developer',
  },
  {
    id: '16',
    cityId: '1',
    cityName: '강남구',
    username: '신마케터',
    avatarUrl: 'https://placehold.co/100x100/f59e0b/ffffff?text=SM',
    rating: 5,
    comment: '광고 대행사들이 많아서 미팅하기 편하고, 맛집도 많아요!',
    likesCount: 35,
    commentsCount: 8,
    createdAt: '2024-01-25T12:25:00Z',
    jobCategory: 'marketer',
  },
  {
    id: '17',
    cityId: '1',
    cityName: '강남구',
    username: '오작가',
    avatarUrl: 'https://placehold.co/100x100/8b5cf6/ffffff?text=OW',
    rating: 4,
    comment: '24시간 카페가 많아서 밤샘 작업할 때 좋습니다.',
    likesCount: 22,
    commentsCount: 5,
    createdAt: '2024-01-24T08:50:00Z',
    jobCategory: 'writer',
  },
  {
    id: '18',
    cityId: '1',
    cityName: '강남구',
    username: '조디자이너',
    avatarUrl: 'https://placehold.co/100x100/10b981/ffffff?text=JD2',
    rating: 5,
    comment: 'UI/UX 커뮤니티가 활발해서 스터디 모임 참여하기 좋아요.',
    likesCount: 48,
    commentsCount: 13,
    createdAt: '2024-01-23T17:15:00Z',
    jobCategory: 'designer',
  },
  {
    id: '19',
    cityId: '1',
    cityName: '강남구',
    username: '하개발자',
    avatarUrl: 'https://placehold.co/100x100/3b82f6/ffffff?text=HD2',
    rating: 3,
    comment: '인프라는 좋지만 생활비가 너무 비싸서 부담됩니다.',
    likesCount: 18,
    commentsCount: 3,
    createdAt: '2024-01-22T14:30:00Z',
    jobCategory: 'developer',
  },
  {
    id: '20',
    cityId: '1',
    cityName: '강남구',
    username: '서마케터',
    avatarUrl: 'https://placehold.co/100x100/f59e0b/ffffff?text=SM2',
    rating: 4,
    comment: '다양한 업종의 사람들을 만날 수 있어서 네트워킹에 최고예요.',
    likesCount: 29,
    commentsCount: 6,
    createdAt: '2024-01-21T09:20:00Z',
    jobCategory: 'marketer',
  },
];

// 실시간 통계 Mock 데이터
export const mockRealtimeStats: RealtimeStats = {
  currentWorking: [
    { cityName: '성수동', count: 42 },
    { cityName: '강남구', count: 38 },
    { cityName: '제주시', count: 28 },
    { cityName: '판교', count: 24 },
    { cityName: '강릉', count: 18 },
  ],
  monthlyPopular: [
    { rank: 1, cityName: '성수동', reviewCount: 95, change: 2 },
    { rank: 2, cityName: '강남구', reviewCount: 128, change: -1 },
    { rank: 3, cityName: '제주시', reviewCount: 142, change: 1 },
    { rank: 4, cityName: '홍대', reviewCount: 156, change: -2 },
    { rank: 5, cityName: '판교', reviewCount: 102, change: 0 },
  ],
};

// 커뮤니티 모임 Mock 데이터
export const mockMeetups: CommunityMeetup[] = [
  {
    id: '1',
    title: '성수동 노마드 월간 밋업',
    cityName: '성수동',
    date: '2024-02-10',
    participants: 12,
    maxParticipants: 15,
  },
  {
    id: '2',
    title: '제주 워케이션 그룹',
    cityName: '제주시',
    date: '2024-02-15',
    participants: 8,
    maxParticipants: 10,
  },
  {
    id: '3',
    title: '강릉 개발자 모임',
    cityName: '강릉',
    date: '2024-02-20',
    participants: 6,
    maxParticipants: 12,
  },
];

// 이달의 리뷰왕 Mock 데이터
export const mockTopReviewers: User[] = [
  {
    id: '1',
    username: '김디자이너',
    avatarUrl: 'https://placehold.co/100x100/10b981/ffffff?text=KD',
    jobCategory: 'designer',
    reviewCount: 18,
  },
  {
    id: '2',
    username: '박개발자',
    avatarUrl: 'https://placehold.co/100x100/3b82f6/ffffff?text=PD',
    jobCategory: 'developer',
    reviewCount: 15,
  },
  {
    id: '3',
    username: '이마케터',
    avatarUrl: 'https://placehold.co/100x100/f59e0b/ffffff?text=LM',
    jobCategory: 'marketer',
    reviewCount: 12,
  },
];

// 인기 급상승 도시 (trendingScore로 정렬)
export const getTrendingCities = (): City[] => {
  return [...mockCities]
    .sort((a, b) => (b.trendingScore || 0) - (a.trendingScore || 0))
    .slice(0, 5);
};

// 평점 높은 도시 (avgRating으로 정렬)
export const getTopRatedCities = (): City[] => {
  return [...mockCities].sort((a, b) => b.avgRating - a.avgRating);
};

// 예산별 추천 도시
export const getCitiesByBudget = (budget: 'under-100' | '100-150' | '150-200'): City[] => {
  const ranges = {
    'under-100': [0, 1000000],
    '100-150': [1000000, 1500000],
    '150-200': [1500000, 2000000],
  };

  const [min, max] = ranges[budget];
  return mockCities
    .filter(city => city.avgMonthlyCost >= min && city.avgMonthlyCost < max)
    .sort((a, b) => b.avgRating - a.avgRating)
    .slice(0, 3);
};

// 직업군별 추천 도시
export const getCitiesByJobCategory = (jobCategory: string): City[] => {
  const scoreKey = jobCategory === 'developer' ? 'devScore' : 'designScore';
  return [...mockCities]
    .sort((a, b) => (b[scoreKey] || 0) - (a[scoreKey] || 0))
    .slice(0, 5);
};

// 최신 리뷰
export const getLatestReviews = (count: number = 4): Review[] => {
  return [...mockReviews]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, count);
};

// Slug로 도시 찾기
export const getCityBySlug = (slug: string): City | undefined => {
  return mockCities.find(city => city.slug === slug);
};

// 도시 ID로 리뷰 찾기
export const getReviewsByCity = (cityId: string): Review[] => {
  return mockReviews.filter(review => review.cityId === cityId);
};

// 카페 Mock 데이터
export const mockCafes: Cafe[] = [
  // 강남구 카페
  { id: 'cafe-1', name: '스타벅스 강남역점', cityId: '1', rating: 4.5, priceLevel: 3, wifiSpeed: 950, hasOutlet: true, address: '서울 강남구 강남대로 지하 396' },
  { id: 'cafe-2', name: '투썸플레이스 테헤란로점', cityId: '1', rating: 4.3, priceLevel: 3, wifiSpeed: 900, hasOutlet: true, address: '서울 강남구 테헤란로 152' },
  { id: 'cafe-3', name: '커피빈 역삼점', cityId: '1', rating: 4.2, priceLevel: 3, wifiSpeed: 920, hasOutlet: true, address: '서울 강남구 역삼로 165' },

  // 성수동 카페
  { id: 'cafe-4', name: '대림창고', cityId: '2', rating: 4.8, priceLevel: 2, wifiSpeed: 900, hasOutlet: true, address: '서울 성동구 연무장길 74' },
  { id: 'cafe-5', name: '카페 온더코너', cityId: '2', rating: 4.7, priceLevel: 2, wifiSpeed: 880, hasOutlet: true, address: '서울 성동구 성수이로 113' },
  { id: 'cafe-6', name: '어니언', cityId: '2', rating: 4.6, priceLevel: 2, wifiSpeed: 850, hasOutlet: false, address: '서울 성동구 왕십리로 83-21' },

  // 홍대 카페
  { id: 'cafe-7', name: '앤트러사이트 홍대점', cityId: '3', rating: 4.4, priceLevel: 2, wifiSpeed: 880, hasOutlet: true, address: '서울 마포구 양화로 188' },
  { id: 'cafe-8', name: '카페 연남동 239-20', cityId: '3', rating: 4.5, priceLevel: 2, wifiSpeed: 850, hasOutlet: true, address: '서울 마포구 연남동 239-20' },
  { id: 'cafe-9', name: '망원동 티라미수', cityId: '3', rating: 4.3, priceLevel: 1, wifiSpeed: 800, hasOutlet: false, address: '서울 마포구 망원로 11길 12' },

  // 제주시 카페
  { id: 'cafe-10', name: '카페 더클리프', cityId: '4', rating: 4.7, priceLevel: 2, wifiSpeed: 720, hasOutlet: true, address: '제주 제주시 애월읍 애월북서길 56' },
  { id: 'cafe-11', name: '델문도', cityId: '4', rating: 4.6, priceLevel: 2, wifiSpeed: 700, hasOutlet: true, address: '제주 제주시 애월읍 애월북서길 60' },
  { id: 'cafe-12', name: '카페 콤마', cityId: '4', rating: 4.5, priceLevel: 1, wifiSpeed: 680, hasOutlet: false, address: '제주 제주시 한림읍 협재리 2546' },

  // 해운대 카페
  { id: 'cafe-13', name: '테라로사 해운대점', cityId: '5', rating: 4.5, priceLevel: 2, wifiSpeed: 830, hasOutlet: true, address: '부산 해운대구 달맞이길 62번길 42' },
  { id: 'cafe-14', name: '블루보틀 해운대점', cityId: '5', rating: 4.6, priceLevel: 3, wifiSpeed: 850, hasOutlet: true, address: '부산 해운대구 달맞이길 117' },
  { id: 'cafe-15', name: '더베이101', cityId: '5', rating: 4.4, priceLevel: 2, wifiSpeed: 800, hasOutlet: false, address: '부산 해운대구 동백로 52' },

  // 광안리 카페
  { id: 'cafe-16', name: '카페 오르다', cityId: '6', rating: 4.3, priceLevel: 2, wifiSpeed: 820, hasOutlet: true, address: '부산 수영구 광안해변로 219' },
  { id: 'cafe-17', name: '더바이크', cityId: '6', rating: 4.4, priceLevel: 2, wifiSpeed: 810, hasOutlet: true, address: '부산 수영구 광남로 47번길 13' },
  { id: 'cafe-18', name: '써니스토리', cityId: '6', rating: 4.2, priceLevel: 1, wifiSpeed: 780, hasOutlet: false, address: '부산 수영구 광안해변로 267' },

  // 판교 카페
  { id: 'cafe-19', name: '스타벅스 판교테크노밸리점', cityId: '7', rating: 4.4, priceLevel: 3, wifiSpeed: 970, hasOutlet: true, address: '경기 성남시 분당구 판교역로 235' },
  { id: 'cafe-20', name: '커피에 반하다', cityId: '7', rating: 4.5, priceLevel: 2, wifiSpeed: 950, hasOutlet: true, address: '경기 성남시 분당구 삼평동 682' },
  { id: 'cafe-21', name: '투썸 판교점', cityId: '7', rating: 4.3, priceLevel: 3, wifiSpeed: 930, hasOutlet: true, address: '경기 성남시 분당구 대왕판교로 660' },

  // 분당 카페
  { id: 'cafe-22', name: '카페베네 분당점', cityId: '8', rating: 4.2, priceLevel: 2, wifiSpeed: 910, hasOutlet: true, address: '경기 성남시 분당구 정자일로 95' },
  { id: 'cafe-23', name: '할리스커피 분당점', cityId: '8', rating: 4.3, priceLevel: 2, wifiSpeed: 900, hasOutlet: true, address: '경기 성남시 분당구 성남대로 926번길 11' },
  { id: 'cafe-24', name: '폴바셋 분당점', cityId: '8', rating: 4.4, priceLevel: 3, wifiSpeed: 920, hasOutlet: false, address: '경기 성남시 분당구 황새울로 312' },

  // 전주 카페
  { id: 'cafe-25', name: '객리단길 카페거리', cityId: '9', rating: 4.3, priceLevel: 1, wifiSpeed: 680, hasOutlet: true, address: '전북 전주시 완산구 경원동 3가' },
  { id: 'cafe-26', name: '카페 삼삼오오', cityId: '9', rating: 4.2, priceLevel: 1, wifiSpeed: 670, hasOutlet: false, address: '전북 전주시 덕진구 온고을로 327' },

  // 춘천 카페
  { id: 'cafe-27', name: '카페 산토리니', cityId: '10', rating: 4.4, priceLevel: 1, wifiSpeed: 660, hasOutlet: true, address: '강원 춘천시 남산면 강촌로 894' },
  { id: 'cafe-28', name: '커피 박물관', cityId: '10', rating: 4.3, priceLevel: 2, wifiSpeed: 650, hasOutlet: true, address: '강원 춘천시 사북면 오봉산길 1153' },

  // 경주 카페
  { id: 'cafe-29', name: '카페 보문', cityId: '11', rating: 4.1, priceLevel: 1, wifiSpeed: 630, hasOutlet: false, address: '경북 경주시 보문로 424-45' },
  { id: 'cafe-30', name: '황리단길 카페', cityId: '11', rating: 4.2, priceLevel: 1, wifiSpeed: 640, hasOutlet: true, address: '경북 경주시 포석로 1019' },

  // 강릉 카페
  { id: 'cafe-31', name: '테라로사 강릉본점', cityId: '12', rating: 4.8, priceLevel: 2, wifiSpeed: 710, hasOutlet: true, address: '강원 강릉시 구정면 현천길 7' },
  { id: 'cafe-32', name: '보헤미안 박이추커피', cityId: '12', rating: 4.7, priceLevel: 2, wifiSpeed: 700, hasOutlet: true, address: '강원 강릉시 사천면 중앙서로 2323-16' },
  { id: 'cafe-33', name: '카페 안목', cityId: '12', rating: 4.5, priceLevel: 1, wifiSpeed: 680, hasOutlet: false, address: '강원 강릉시 창해로 14번길 20-1' },

  // 여수 카페
  { id: 'cafe-34', name: '카페 오동도', cityId: '13', rating: 4.3, priceLevel: 1, wifiSpeed: 670, hasOutlet: true, address: '전남 여수시 오동도로 222' },
  { id: 'cafe-35', name: '여수밤바다 카페', cityId: '13', rating: 4.4, priceLevel: 2, wifiSpeed: 680, hasOutlet: true, address: '전남 여수시 하멜로 97' },

  // 속초 카페
  { id: 'cafe-36', name: '속초 중앙시장 카페거리', cityId: '14', rating: 4.2, priceLevel: 1, wifiSpeed: 650, hasOutlet: false, address: '강원 속초시 중앙로 147' },
  { id: 'cafe-37', name: '아바이마을 카페', cityId: '14', rating: 4.1, priceLevel: 1, wifiSpeed: 640, hasOutlet: true, address: '강원 속초시 아바이마을길 46' },

  // 대전 카페
  { id: 'cafe-38', name: '스타벅스 대전둔산점', cityId: '15', rating: 4.3, priceLevel: 3, wifiSpeed: 870, hasOutlet: true, address: '대전 서구 둔산로 52' },
  { id: 'cafe-39', name: '카페 성심당', cityId: '15', rating: 4.5, priceLevel: 2, wifiSpeed: 850, hasOutlet: true, address: '대전 중구 은행동 145-2' },
  { id: 'cafe-40', name: '투썸 대전점', cityId: '15', rating: 4.2, priceLevel: 2, wifiSpeed: 860, hasOutlet: false, address: '대전 유성구 엑스포로 1' },
];

// 코워킹 스페이스 Mock 데이터
export const mockCoworkingSpaces: CoworkingSpace[] = [
  // 강남구 코워킹
  { id: 'cow-1', name: '위워크 강남역점', cityId: '1', rating: 4.6, dailyPrice: 35000, monthlyPrice: 550000, amenities: ['Wi-Fi', '회의실', '프린터', '커피무료', '24시간'], address: '서울 강남구 테헤란로 152 강남파이낸스센터' },
  { id: 'cow-2', name: '패스트파이브 강남점', cityId: '1', rating: 4.5, dailyPrice: 30000, monthlyPrice: 480000, amenities: ['Wi-Fi', '회의실', '프린터', '커피무료'], address: '서울 강남구 테헤란로 113 청원빌딩' },
  { id: 'cow-3', name: '스파크플러스 강남점', cityId: '1', rating: 4.4, dailyPrice: 28000, monthlyPrice: 450000, amenities: ['Wi-Fi', '회의실', '커피무료'], address: '서울 강남구 역삼로 180 BNK강남타워' },

  // 성수동 코워킹
  { id: 'cow-4', name: '헤이그라운드 성수', cityId: '2', rating: 4.8, dailyPrice: 25000, monthlyPrice: 420000, amenities: ['Wi-Fi', '회의실', '이벤트홀', '커피무료', '루프탑'], address: '서울 성동구 왕십리로 83-21' },
  { id: 'cow-5', name: '언더스탠드에비뉴', cityId: '2', rating: 4.7, dailyPrice: 22000, monthlyPrice: 380000, amenities: ['Wi-Fi', '회의실', '커피무료'], address: '서울 성동구 성수이로 7길 43' },

  // 홍대 코워킹
  { id: 'cow-6', name: '스파크플러스 홍대점', cityId: '3', rating: 4.3, dailyPrice: 25000, monthlyPrice: 400000, amenities: ['Wi-Fi', '회의실', '커피무료'], address: '서울 마포구 양화로 160' },
  { id: 'cow-7', name: '위워크 홍대점', cityId: '3', rating: 4.4, dailyPrice: 30000, monthlyPrice: 480000, amenities: ['Wi-Fi', '회의실', '프린터', '커피무료', '24시간'], address: '서울 마포구 양화로 45' },

  // 제주시 코워킹
  { id: 'cow-8', name: '제주코워킹스페이스', cityId: '4', rating: 4.5, dailyPrice: 15000, monthlyPrice: 250000, amenities: ['Wi-Fi', '회의실', '주차'], address: '제주 제주시 첨단로 213-65' },
  { id: 'cow-9', name: '마루끄레아', cityId: '4', rating: 4.4, dailyPrice: 18000, monthlyPrice: 300000, amenities: ['Wi-Fi', '회의실', '커피무료', '루프탑'], address: '제주 제주시 중앙로 217' },

  // 해운대 코워킹
  { id: 'cow-10', name: '부산창조경제혁신센터', cityId: '5', rating: 4.3, dailyPrice: 20000, monthlyPrice: 320000, amenities: ['Wi-Fi', '회의실', '프린터'], address: '부산 해운대구 센텀중앙로 78' },
  { id: 'cow-11', name: '마리나코워킹', cityId: '5', rating: 4.4, dailyPrice: 22000, monthlyPrice: 350000, amenities: ['Wi-Fi', '회의실', '커피무료', '오션뷰'], address: '부산 해운대구 우동 1470' },

  // 광안리 코워킹
  { id: 'cow-12', name: '광안리워크스페이스', cityId: '6', rating: 4.2, dailyPrice: 18000, monthlyPrice: 280000, amenities: ['Wi-Fi', '회의실', '오션뷰'], address: '부산 수영구 광안해변로 219' },

  // 판교 코워킹
  { id: 'cow-13', name: '위워크 판교점', cityId: '7', rating: 4.7, dailyPrice: 32000, monthlyPrice: 520000, amenities: ['Wi-Fi', '회의실', '프린터', '커피무료', '24시간'], address: '경기 성남시 분당구 판교로 242' },
  { id: 'cow-14', name: '판교스타트업캠퍼스', cityId: '7', rating: 4.6, dailyPrice: 28000, monthlyPrice: 450000, amenities: ['Wi-Fi', '회의실', '프린터', '커피무료'], address: '경기 성남시 분당구 삼평동 680' },
  { id: 'cow-15', name: '패스트파이브 판교점', cityId: '7', rating: 4.5, dailyPrice: 30000, monthlyPrice: 480000, amenities: ['Wi-Fi', '회의실', '커피무료'], address: '경기 성남시 분당구 판교역로 192번길 12' },

  // 분당 코워킹
  { id: 'cow-16', name: '스파크플러스 분당점', cityId: '8', rating: 4.3, dailyPrice: 26000, monthlyPrice: 420000, amenities: ['Wi-Fi', '회의실', '커피무료'], address: '경기 성남시 분당구 황새울로 312' },
  { id: 'cow-17', name: '분당코워킹스페이스', cityId: '8', rating: 4.2, dailyPrice: 24000, monthlyPrice: 380000, amenities: ['Wi-Fi', '회의실'], address: '경기 성남시 분당구 정자일로 95' },

  // 전주 코워킹
  { id: 'cow-18', name: '전주창조경제혁신센터', cityId: '9', rating: 4.0, dailyPrice: 12000, monthlyPrice: 200000, amenities: ['Wi-Fi', '회의실', '프린터'], address: '전북 전주시 덕진구 기린대로 390' },

  // 춘천 코워킹
  { id: 'cow-19', name: '춘천창조경제혁신센터', cityId: '10', rating: 4.1, dailyPrice: 10000, monthlyPrice: 180000, amenities: ['Wi-Fi', '회의실'], address: '강원 춘천시 평화로 25' },

  // 강릉 코워킹
  { id: 'cow-20', name: '강릉코워킹스페이스', cityId: '12', rating: 4.3, dailyPrice: 15000, monthlyPrice: 240000, amenities: ['Wi-Fi', '회의실', '커피무료'], address: '강원 강릉시 경강로 2021' },
  { id: 'cow-21', name: '커피창고코워킹', cityId: '12', rating: 4.4, dailyPrice: 18000, monthlyPrice: 280000, amenities: ['Wi-Fi', '회의실', '커피무료', '오션뷰'], address: '강원 강릉시 창해로 14번길 20-1' },

  // 여수 코워킹
  { id: 'cow-22', name: '여수코워킹스페이스', cityId: '13', rating: 4.1, dailyPrice: 14000, monthlyPrice: 220000, amenities: ['Wi-Fi', '회의실'], address: '전남 여수시 좌수영로 450' },

  // 대전 코워킹
  { id: 'cow-23', name: '대전창조경제혁신센터', cityId: '15', rating: 4.3, dailyPrice: 20000, monthlyPrice: 320000, amenities: ['Wi-Fi', '회의실', '프린터', '커피무료'], address: '대전 유성구 테크노2로 187' },
  { id: 'cow-24', name: '스파크플러스 대전점', cityId: '15', rating: 4.4, dailyPrice: 24000, monthlyPrice: 380000, amenities: ['Wi-Fi', '회의실', '커피무료', '주차'], address: '대전 서구 둔산로 52' },
];

// 도시 ID로 카페 찾기
export const getCafesByCity = (cityId: string): Cafe[] => {
  return mockCafes.filter(cafe => cafe.cityId === cityId);
};

// 도시 ID로 코워킹 스페이스 찾기
export const getCoworkingSpacesByCity = (cityId: string): CoworkingSpace[] => {
  return mockCoworkingSpaces.filter(space => space.cityId === cityId);
};
