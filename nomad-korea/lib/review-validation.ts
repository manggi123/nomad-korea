import { ReviewInput, ValidationResult, JobCategory } from '@/types';

/**
 * 리뷰 입력 데이터의 유효성을 검사합니다.
 * @param review - 검사할 리뷰 입력 데이터
 * @returns 유효성 검사 결과 (isValid, errors)
 */
export function validateReview(review: Partial<ReviewInput>): ValidationResult {
  const errors: Record<string, string> = {};

  // 1. 별점 검사
  if (!review.rating) {
    errors.rating = '별점을 선택해주세요';
  } else if (review.rating < 1 || review.rating > 5) {
    errors.rating = '별점은 1-5 사이여야 합니다';
  } else if (!Number.isInteger(review.rating)) {
    errors.rating = '별점은 정수여야 합니다';
  }

  // 2. 댓글 검사
  if (!review.comment) {
    errors.comment = '리뷰 내용을 입력해주세요';
  } else if (review.comment.trim().length < 10) {
    errors.comment = '리뷰는 최소 10자 이상이어야 합니다';
  } else if (review.comment.trim().length > 500) {
    errors.comment = '리뷰는 최대 500자까지 입력 가능합니다';
  }

  // 3. 직업군 검사
  if (!review.jobCategory) {
    errors.jobCategory = '직업군을 선택해주세요';
  } else {
    const validJobCategories: JobCategory[] = [
      'developer',
      'designer',
      'marketer',
      'writer',
      'video-producer',
      'planner',
    ];
    if (!validJobCategories.includes(review.jobCategory as JobCategory)) {
      errors.jobCategory = '유효하지 않은 직업군입니다';
    }
  }

  // 4. 도시 ID 검사
  if (!review.cityId) {
    errors.cityId = '도시 정보가 필요합니다';
  } else if (typeof review.cityId !== 'string' || review.cityId.trim() === '') {
    errors.cityId = '유효하지 않은 도시 정보입니다';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * 특정 필드의 유효성을 검사합니다.
 * @param field - 검사할 필드명
 * @param value - 검사할 값
 * @returns 에러 메시지 (유효한 경우 빈 문자열)
 */
export function validateField(
  field: keyof ReviewInput,
  value: string | number
): string {
  const partialReview: Partial<ReviewInput> = { [field]: value };
  const result = validateReview(partialReview);
  return result.errors[field] || '';
}
