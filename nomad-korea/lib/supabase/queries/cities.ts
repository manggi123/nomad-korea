import { SupabaseClient } from '@supabase/supabase-js';
import { Database, Tables } from '@/types/database.types';

type TypedSupabaseClient = SupabaseClient<Database>;

// 도시와 관련 데이터 타입
export type CityWithRelations = Tables<'cities'> & {
  cafes: Tables<'cafes'>[];
  coworking_spaces: Tables<'coworking_spaces'>[];
};

// 모든 도시 가져오기
export async function getAllCities(supabase: TypedSupabaseClient): Promise<Tables<'cities'>[]> {
  const { data, error } = await supabase
    .from('cities')
    .select('*')
    .order('avg_rating', { ascending: false });

  if (error) throw error;
  return data || [];
}

// Slug로 도시 찾기
export async function getCityBySlug(supabase: TypedSupabaseClient, slug: string): Promise<CityWithRelations> {
  const { data, error } = await supabase
    .from('cities')
    .select(`
      *,
      cafes(*),
      coworking_spaces(*)
    `)
    .eq('slug', slug)
    .single();

  if (error) throw error;
  return data as CityWithRelations;
}

// 도시 ID로 도시 찾기
export async function getCityById(supabase: TypedSupabaseClient, cityId: string): Promise<Tables<'cities'>> {
  const { data, error } = await supabase
    .from('cities')
    .select('*')
    .eq('id', cityId)
    .single();

  if (error) throw error;
  return data;
}

// 트렌딩 도시 가져오기 (trending_score 높은 순)
export async function getTrendingCities(supabase: TypedSupabaseClient, limit: number = 5): Promise<Tables<'cities'>[]> {
  const { data, error } = await supabase
    .from('cities')
    .select('*')
    .order('trending_score', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data || [];
}

// 평점 높은 도시 가져오기
export async function getTopRatedCities(supabase: TypedSupabaseClient, limit?: number): Promise<Tables<'cities'>[]> {
  let query = supabase
    .from('cities')
    .select('*')
    .order('avg_rating', { ascending: false });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data || [];
}

// 예산별 도시 필터링
export async function getCitiesByBudget(
  supabase: TypedSupabaseClient,
  minBudget: number,
  maxBudget: number,
  limit: number = 3
): Promise<Tables<'cities'>[]> {
  const { data, error } = await supabase
    .from('cities')
    .select('*')
    .gte('avg_monthly_cost', minBudget)
    .lt('avg_monthly_cost', maxBudget)
    .order('avg_rating', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data || [];
}

// 직업군별 추천 도시
export async function getCitiesByJobCategory(
  supabase: TypedSupabaseClient,
  jobCategory: 'developer' | 'designer',
  limit: number = 5
): Promise<Tables<'cities'>[]> {
  const scoreColumn = jobCategory === 'developer' ? 'dev_score' : 'design_score';

  const { data, error } = await supabase
    .from('cities')
    .select('*')
    .order(scoreColumn, { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data || [];
}

// 지역별 도시 필터링
export async function getCitiesByRegion(supabase: TypedSupabaseClient, region: string): Promise<Tables<'cities'>[]> {
  const { data, error } = await supabase
    .from('cities')
    .select('*')
    .eq('region', region)
    .order('avg_rating', { ascending: false });

  if (error) throw error;
  return data || [];
}

// 도시 검색 (이름 또는 지역)
export async function searchCities(supabase: TypedSupabaseClient, searchQuery: string): Promise<Tables<'cities'>[]> {
  // Supabase 함수 사용 (타입 단언 필요)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const client = supabase as any;
  const { data, error } = await client.rpc('search_cities', {
    search_query: searchQuery
  });

  if (error) throw error;
  return (data as Tables<'cities'>[]) || [];
}

// 복합 필터로 도시 검색
interface CityFilters {
  regions?: string[];
  minBudget?: number;
  maxBudget?: number;
  minRating?: number;
  minInternetSpeed?: number;
  minCafeCount?: number;
  minCoworkingCount?: number;
}

export async function getFilteredCities(
  supabase: TypedSupabaseClient,
  filters: CityFilters
): Promise<Tables<'cities'>[]> {
  let query = supabase.from('cities').select('*');

  // 지역 필터
  if (filters.regions && filters.regions.length > 0) {
    query = query.in('region', filters.regions);
  }

  // 예산 필터
  if (filters.minBudget) {
    query = query.gte('avg_monthly_cost', filters.minBudget);
  }
  if (filters.maxBudget) {
    query = query.lte('avg_monthly_cost', filters.maxBudget);
  }

  // 평점 필터
  if (filters.minRating) {
    query = query.gte('avg_rating', filters.minRating);
  }

  // 인터넷 속도 필터
  if (filters.minInternetSpeed) {
    query = query.gte('avg_internet_speed', filters.minInternetSpeed);
  }

  // 카페 수 필터
  if (filters.minCafeCount) {
    query = query.gte('cafe_count', filters.minCafeCount);
  }

  // 코워킹 수 필터
  if (filters.minCoworkingCount) {
    query = query.gte('coworking_count', filters.minCoworkingCount);
  }

  query = query.order('avg_rating', { ascending: false });

  const { data, error } = await query;

  if (error) throw error;
  return data || [];
}

// 관련 도시 추천 (같은 지역 또는 비슷한 가격대)
export async function getRelatedCities(
  supabase: TypedSupabaseClient,
  cityId: string,
  limit: number = 3
): Promise<Tables<'cities'>[]> {
  // 현재 도시 정보 가져오기
  const { data: currentCity } = await supabase
    .from('cities')
    .select('region, avg_monthly_cost')
    .eq('id', cityId)
    .single();

  if (!currentCity) return [];

  // 타입 단언
  const cityData = currentCity as { region: string; avg_monthly_cost: number };

  // 같은 지역 또는 비슷한 가격대의 도시 찾기 (현재 도시 제외)
  const priceRange = cityData.avg_monthly_cost * 0.2; // ±20%

  const { data, error } = await supabase
    .from('cities')
    .select('*')
    .neq('id', cityId)
    .or(
      `region.eq.${cityData.region},` +
      `and(avg_monthly_cost.gte.${cityData.avg_monthly_cost - priceRange},` +
      `avg_monthly_cost.lte.${cityData.avg_monthly_cost + priceRange})`
    )
    .order('avg_rating', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data || [];
}

// 도시별 카페 가져오기
export async function getCafesByCity(supabase: TypedSupabaseClient, cityId: string): Promise<Tables<'cafes'>[]> {
  const { data, error } = await supabase
    .from('cafes')
    .select('*')
    .eq('city_id', cityId)
    .order('rating', { ascending: false });

  if (error) throw error;
  return data || [];
}

// 도시별 코워킹 스페이스 가져오기
export async function getCoworkingSpacesByCity(supabase: TypedSupabaseClient, cityId: string): Promise<Tables<'coworking_spaces'>[]> {
  const { data, error } = await supabase
    .from('coworking_spaces')
    .select('*')
    .eq('city_id', cityId)
    .order('rating', { ascending: false });

  if (error) throw error;
  return data || [];
}
