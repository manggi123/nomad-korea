'use client';

import { useState, useCallback, useEffect } from 'react';
import { JobCategory } from '@/types';
import { validateReview } from '@/lib/review-validation';
import { createClient } from '@/lib/supabase/client';
import { createReview } from '@/lib/supabase/mutations/reviews';

export interface UseReviewFormOptions {
  cityId: string;
  cityName: string;
  onSuccess?: (reviewId: string) => void;
  onError?: (error: Error) => void;
}

interface User {
  id: string;
  username: string;
  avatarUrl?: string;
  jobCategory?: string;
}

export function useReviewForm({
  cityId,
  cityName,
  onSuccess,
  onError,
}: UseReviewFormOptions) {
  // 폼 상태
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [jobCategory, setJobCategory] = useState<JobCategory | ''>('');

  // UI 상태
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // 사용자 상태
  const [user, setUser] = useState<User | null>(null);

  // 현재 로그인한 사용자 가져오기
  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const { data: { user: authUser } } = await supabase.auth.getUser();

      if (authUser) {
        // 프로필 정보 가져오기
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authUser.id)
          .single();

        if (profile) {
          setUser({
            id: profile.id,
            username: profile.username,
            avatarUrl: profile.avatar_url || undefined,
            jobCategory: profile.job_category || undefined,
          });

          // 저장된 직업군이 있으면 기본값으로 설정
          if (profile.job_category) {
            setJobCategory(profile.job_category as JobCategory);
          }
        }
      }
    };

    fetchUser();
  }, []);

  /**
   * 폼 초기화
   */
  const resetForm = useCallback(() => {
    setRating(0);
    setComment('');
    setJobCategory(user?.jobCategory as JobCategory || '');
    setErrors({});
    setIsSubmitting(false);
  }, [user?.jobCategory]);

  /**
   * 리뷰 제출 (Supabase)
   */
  const submitReview = useCallback(async () => {
    setIsSubmitting(true);
    setErrors({});

    try {
      // 0. 로그인 확인
      if (!user) {
        setErrors({ submit: '리뷰를 작성하려면 로그인이 필요합니다.' });
        setIsSubmitting(false);
        return;
      }

      // 1. 유효성 검사
      const reviewInput = {
        cityId,
        rating,
        comment: comment.trim(),
        jobCategory: jobCategory as JobCategory,
      };

      const validation = validateReview(reviewInput);

      if (!validation.isValid) {
        setErrors(validation.errors);
        setIsSubmitting(false);
        return;
      }

      // 2. Supabase에 리뷰 저장
      const supabase = createClient();
      const newReview = await createReview(supabase, {
        city_id: cityId,
        user_id: user.id,
        rating,
        comment: comment.trim(),
      });

      // 3. 사용자 직업군 업데이트 (선택한 직업군이 다르면)
      if (jobCategory && jobCategory !== user.jobCategory) {
        await supabase
          .from('profiles')
          .update({ job_category: jobCategory })
          .eq('id', user.id);
      }

      // 4. 성공 콜백 호출
      if (onSuccess) {
        onSuccess(newReview.id);
      }

      // 5. 폼 초기화
      resetForm();
    } catch (error) {
      console.error('Failed to submit review:', error);
      const err =
        error instanceof Error ? error : new Error('리뷰 저장에 실패했습니다');

      setErrors({
        submit: err.message,
      });

      if (onError) {
        onError(err);
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [cityId, cityName, rating, comment, jobCategory, user, onSuccess, onError, resetForm]);

  /**
   * 특정 필드의 에러 메시지 가져오기
   */
  const getFieldError = useCallback(
    (field: string): string => {
      return errors[field] || '';
    },
    [errors]
  );

  return {
    // 폼 상태
    rating,
    setRating,
    comment,
    setComment,
    jobCategory,
    setJobCategory,

    // UI 상태
    errors,
    isSubmitting,
    getFieldError,

    // 액션
    submitReview,
    resetForm,

    // 사용자 정보
    user,
    isLoggedIn: !!user,
  };
}
