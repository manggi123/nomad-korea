'use client';

import { useState, useCallback } from 'react';
import { ReviewInput, JobCategory } from '@/types';
import { validateReview } from '@/lib/review-validation';
import { addReview, getCurrentUser } from '@/lib/review-storage';

export interface UseReviewFormOptions {
  cityId: string;
  cityName: string;
  onSuccess?: (reviewId: string) => void;
  onError?: (error: Error) => void;
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

  /**
   * 폼 초기화
   */
  const resetForm = useCallback(() => {
    setRating(0);
    setComment('');
    setJobCategory('');
    setErrors({});
    setIsSubmitting(false);
  }, []);

  /**
   * 리뷰 제출
   */
  const submitReview = useCallback(async () => {
    setIsSubmitting(true);
    setErrors({});

    try {
      // 1. 유효성 검사
      const reviewInput: Partial<ReviewInput> = {
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

      // 2. 리뷰 저장
      const newReview = addReview({
        cityId,
        rating,
        comment: comment.trim(),
        jobCategory: jobCategory as JobCategory,
      });

      // cityName 업데이트 (localStorage에서는 cityName이 빈 문자열로 저장됨)
      newReview.cityName = cityName;

      // 3. 성공 콜백 호출
      if (onSuccess) {
        onSuccess(newReview.id);
      }

      // 4. 폼 초기화
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
  }, [cityId, cityName, rating, comment, jobCategory, onSuccess, onError, resetForm]);

  /**
   * 특정 필드의 에러 메시지 가져오기
   */
  const getFieldError = useCallback(
    (field: string): string => {
      return errors[field] || '';
    },
    [errors]
  );

  /**
   * 현재 사용자 정보 가져오기
   */
  const user = getCurrentUser();

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
  };
}
