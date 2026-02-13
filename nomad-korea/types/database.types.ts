// Supabase 데이터베이스 타입 정의
// 이 파일은 Supabase 스키마와 동기화되어야 합니다

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      cities: {
        Row: {
          id: string
          name: string
          region: string
          slug: string
          image_url: string
          avg_rating: number
          review_count: number
          avg_monthly_cost: number
          avg_internet_speed: number
          cafe_count: number
          coworking_count: number
          transport_score: number
          environment_score: number
          dev_score: number
          design_score: number
          trending_score: number
          likes: number
          dislikes: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          region: string
          slug: string
          image_url: string
          avg_rating?: number
          review_count?: number
          avg_monthly_cost: number
          avg_internet_speed: number
          cafe_count?: number
          coworking_count?: number
          transport_score: number
          environment_score: number
          dev_score: number
          design_score: number
          trending_score?: number
          likes?: number
          dislikes?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          region?: string
          slug?: string
          image_url?: string
          avg_rating?: number
          review_count?: number
          avg_monthly_cost?: number
          avg_internet_speed?: number
          cafe_count?: number
          coworking_count?: number
          transport_score?: number
          environment_score?: number
          dev_score?: number
          design_score?: number
          trending_score?: number
          likes?: number
          dislikes?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          id: string
          username: string
          avatar_url: string | null
          job_category: 'developer' | 'designer' | 'marketer' | 'writer' | 'video-producer' | 'planner' | null
          review_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username: string
          avatar_url?: string | null
          job_category?: 'developer' | 'designer' | 'marketer' | 'writer' | 'video-producer' | 'planner' | null
          review_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string
          avatar_url?: string | null
          job_category?: 'developer' | 'designer' | 'marketer' | 'writer' | 'video-producer' | 'planner' | null
          review_count?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'profiles_id_fkey'
            columns: ['id']
            referencedRelation: 'users'
            referencedColumns: ['id']
          }
        ]
      }
      reviews: {
        Row: {
          id: string
          city_id: string
          user_id: string
          rating: number
          comment: string
          likes_count: number
          comments_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          city_id: string
          user_id: string
          rating: number
          comment: string
          likes_count?: number
          comments_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          city_id?: string
          user_id?: string
          rating?: number
          comment?: string
          likes_count?: number
          comments_count?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'reviews_city_id_fkey'
            columns: ['city_id']
            referencedRelation: 'cities'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'reviews_user_id_fkey'
            columns: ['user_id']
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          }
        ]
      }
      cafes: {
        Row: {
          id: string
          name: string
          city_id: string
          rating: number
          price_level: 1 | 2 | 3
          wifi_speed: number
          has_outlet: boolean
          address: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          city_id: string
          rating: number
          price_level: 1 | 2 | 3
          wifi_speed: number
          has_outlet?: boolean
          address: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          city_id?: string
          rating?: number
          price_level?: 1 | 2 | 3
          wifi_speed?: number
          has_outlet?: boolean
          address?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'cafes_city_id_fkey'
            columns: ['city_id']
            referencedRelation: 'cities'
            referencedColumns: ['id']
          }
        ]
      }
      coworking_spaces: {
        Row: {
          id: string
          name: string
          city_id: string
          rating: number
          daily_price: number
          monthly_price: number
          amenities: string[]
          address: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          city_id: string
          rating: number
          daily_price: number
          monthly_price: number
          amenities?: string[]
          address: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          city_id?: string
          rating?: number
          daily_price?: number
          monthly_price?: number
          amenities?: string[]
          address?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'coworking_spaces_city_id_fkey'
            columns: ['city_id']
            referencedRelation: 'cities'
            referencedColumns: ['id']
          }
        ]
      }
      city_likes: {
        Row: {
          id: string
          city_id: string
          user_id: string
          reaction: 'like' | 'dislike'
          created_at: string
        }
        Insert: {
          id?: string
          city_id: string
          user_id: string
          reaction: 'like' | 'dislike'
          created_at?: string
        }
        Update: {
          id?: string
          city_id?: string
          user_id?: string
          reaction?: 'like' | 'dislike'
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'city_likes_city_id_fkey'
            columns: ['city_id']
            referencedRelation: 'cities'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'city_likes_user_id_fkey'
            columns: ['user_id']
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          }
        ]
      }
      review_likes: {
        Row: {
          id: string
          review_id: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          review_id: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          review_id?: string
          user_id?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'review_likes_review_id_fkey'
            columns: ['review_id']
            referencedRelation: 'reviews'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'review_likes_user_id_fkey'
            columns: ['user_id']
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          }
        ]
      }
      bookmarks: {
        Row: {
          id: string
          city_id: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          city_id: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          city_id?: string
          user_id?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'bookmarks_city_id_fkey'
            columns: ['city_id']
            referencedRelation: 'cities'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'bookmarks_user_id_fkey'
            columns: ['user_id']
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          }
        ]
      }
      meetups: {
        Row: {
          id: string
          title: string
          city_id: string
          organizer_id: string
          date: string
          participants: number
          max_participants: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          city_id: string
          organizer_id: string
          date: string
          participants?: number
          max_participants: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          city_id?: string
          organizer_id?: string
          date?: string
          participants?: number
          max_participants?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'meetups_city_id_fkey'
            columns: ['city_id']
            referencedRelation: 'cities'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'meetups_organizer_id_fkey'
            columns: ['organizer_id']
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          }
        ]
      }
    }
    Views: {
      reviews_with_user: {
        Row: {
          id: string
          city_id: string
          user_id: string
          rating: number
          comment: string
          likes_count: number
          comments_count: number
          created_at: string
          updated_at: string
          username: string
          avatar_url: string | null
          job_category: 'developer' | 'designer' | 'marketer' | 'writer' | 'video-producer' | 'planner' | null
          city_name: string
        }
      }
    }
    Functions: {
      search_cities: {
        Args: {
          search_query: string
        }
        Returns: {
          id: string
          name: string
          region: string
          slug: string
          image_url: string
          avg_rating: number
          review_count: number
          avg_monthly_cost: number
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// 헬퍼 타입
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Inserts<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type Updates<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T]

// 기존 타입과 호환성을 위한 타입 별칭
export type City = Tables<'cities'>
export type Profile = Tables<'profiles'>
export type Review = Tables<'reviews'>
export type Cafe = Tables<'cafes'>
export type CoworkingSpace = Tables<'coworking_spaces'>
export type CityLike = Tables<'city_likes'>
export type ReviewLike = Tables<'review_likes'>
export type Bookmark = Tables<'bookmarks'>
export type Meetup = Tables<'meetups'>

// 확장된 리뷰 타입 (뷰에서 가져온 것)
export type ReviewWithUser = Database['public']['Views']['reviews_with_user']['Row']
