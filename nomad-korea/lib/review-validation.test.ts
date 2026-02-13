import { describe, it, expect } from 'vitest';
import { validateReview, validateField } from './review-validation';
import {
  validReviewInput,
  invalidReviewInputs,
  createMockReviewInput,
} from '@/test/fixtures/reviews';

describe('review-validation', () => {
  describe('validateReview', () => {
    describe('유효한 입력', () => {
      it('모든 필드가 유효하면 isValid: true를 반환한다', () => {
        const result = validateReview(validReviewInput);

        expect(result.isValid).toBe(true);
        expect(Object.keys(result.errors)).toHaveLength(0);
      });

      it('경계값 평점(1, 5)을 허용한다', () => {
        const rating1 = validateReview(createMockReviewInput({ rating: 1 }));
        const rating5 = validateReview(createMockReviewInput({ rating: 5 }));

        expect(rating1.isValid).toBe(true);
        expect(rating5.isValid).toBe(true);
      });

      it('최소 길이(10자) 코멘트를 허용한다', () => {
        const result = validateReview(createMockReviewInput({ comment: '1234567890' }));

        expect(result.isValid).toBe(true);
      });

      it('최대 길이(500자) 코멘트를 허용한다', () => {
        const result = validateReview(createMockReviewInput({ comment: 'a'.repeat(500) }));

        expect(result.isValid).toBe(true);
      });

      it('모든 유효한 직업군을 허용한다', () => {
        const jobCategories = ['developer', 'designer', 'marketer', 'writer', 'video-producer', 'planner'];

        jobCategories.forEach(jobCategory => {
          const result = validateReview(createMockReviewInput({
            jobCategory: jobCategory as 'developer',
          }));
          expect(result.isValid).toBe(true);
        });
      });
    });

    describe('별점 검증', () => {
      it('별점이 없으면 에러를 반환한다', () => {
        const result = validateReview(invalidReviewInputs.emptyRating);

        expect(result.isValid).toBe(false);
        expect(result.errors.rating).toBe('별점을 선택해주세요');
      });

      it('별점이 0이면 에러를 반환한다', () => {
        const result = validateReview({ ...validReviewInput, rating: 0 });

        expect(result.isValid).toBe(false);
        // rating이 0이면 falsy하므로 '별점을 선택해주세요' 에러가 발생
        expect(result.errors.rating).toBe('별점을 선택해주세요');
      });

      it('별점이 음수이면 에러를 반환한다', () => {
        const result = validateReview({ ...validReviewInput, rating: -1 });

        expect(result.isValid).toBe(false);
        expect(result.errors.rating).toBe('별점은 1-5 사이여야 합니다');
      });

      it('별점이 5 초과이면 에러를 반환한다', () => {
        const result = validateReview(invalidReviewInputs.invalidRating);

        expect(result.isValid).toBe(false);
        expect(result.errors.rating).toBe('별점은 1-5 사이여야 합니다');
      });

      it('별점이 소수이면 에러를 반환한다', () => {
        const result = validateReview({ ...validReviewInput, rating: 3.5 });

        expect(result.isValid).toBe(false);
        expect(result.errors.rating).toBe('별점은 정수여야 합니다');
      });
    });

    describe('코멘트 검증', () => {
      it('코멘트가 없으면 에러를 반환한다', () => {
        const result = validateReview({ ...validReviewInput, comment: undefined });

        expect(result.isValid).toBe(false);
        expect(result.errors.comment).toBe('리뷰 내용을 입력해주세요');
      });

      it('코멘트가 빈 문자열이면 에러를 반환한다', () => {
        const result = validateReview({ ...validReviewInput, comment: '' });

        expect(result.isValid).toBe(false);
        expect(result.errors.comment).toBe('리뷰 내용을 입력해주세요');
      });

      it('코멘트가 10자 미만이면 에러를 반환한다', () => {
        const result = validateReview(invalidReviewInputs.shortComment);

        expect(result.isValid).toBe(false);
        expect(result.errors.comment).toBe('리뷰는 최소 10자 이상이어야 합니다');
      });

      it('코멘트가 500자 초과이면 에러를 반환한다', () => {
        const result = validateReview(invalidReviewInputs.longComment);

        expect(result.isValid).toBe(false);
        expect(result.errors.comment).toBe('리뷰는 최대 500자까지 입력 가능합니다');
      });

      it('공백만 있는 코멘트는 에러를 반환한다', () => {
        const result = validateReview({ ...validReviewInput, comment: '         ' });

        expect(result.isValid).toBe(false);
        expect(result.errors.comment).toBe('리뷰는 최소 10자 이상이어야 합니다');
      });
    });

    describe('직업군 검증', () => {
      it('직업군이 없으면 에러를 반환한다', () => {
        const result = validateReview({ ...validReviewInput, jobCategory: undefined });

        expect(result.isValid).toBe(false);
        expect(result.errors.jobCategory).toBe('직업군을 선택해주세요');
      });

      it('유효하지 않은 직업군이면 에러를 반환한다', () => {
        const result = validateReview(invalidReviewInputs.invalidJobCategory);

        expect(result.isValid).toBe(false);
        expect(result.errors.jobCategory).toBe('유효하지 않은 직업군입니다');
      });
    });

    describe('도시 ID 검증', () => {
      it('도시 ID가 없으면 에러를 반환한다', () => {
        const result = validateReview({ ...validReviewInput, cityId: undefined });

        expect(result.isValid).toBe(false);
        expect(result.errors.cityId).toBe('도시 정보가 필요합니다');
      });

      it('도시 ID가 빈 문자열이면 에러를 반환한다', () => {
        const result = validateReview(invalidReviewInputs.emptyCityId);

        expect(result.isValid).toBe(false);
        // 빈 문자열은 falsy하므로 '도시 정보가 필요합니다' 에러가 발생
        expect(result.errors.cityId).toBe('도시 정보가 필요합니다');
      });

      it('도시 ID가 공백만 있으면 에러를 반환한다', () => {
        const result = validateReview({ ...validReviewInput, cityId: '   ' });

        expect(result.isValid).toBe(false);
        expect(result.errors.cityId).toBe('유효하지 않은 도시 정보입니다');
      });
    });

    describe('복합 에러', () => {
      it('여러 필드가 유효하지 않으면 모든 에러를 반환한다', () => {
        const result = validateReview({
          rating: 0,
          comment: '짧음',
          jobCategory: undefined,
          cityId: '',
        });

        expect(result.isValid).toBe(false);
        expect(Object.keys(result.errors).length).toBeGreaterThanOrEqual(3);
      });
    });
  });

  describe('validateField', () => {
    it('rating 필드를 검증한다', () => {
      expect(validateField('rating', 5)).toBe('');
      expect(validateField('rating', 6)).toBe('별점은 1-5 사이여야 합니다');
    });

    it('comment 필드를 검증한다', () => {
      expect(validateField('comment', '1234567890')).toBe('');
      expect(validateField('comment', '짧음')).toBe('리뷰는 최소 10자 이상이어야 합니다');
    });

    it('jobCategory 필드를 검증한다', () => {
      expect(validateField('jobCategory', 'developer')).toBe('');
      expect(validateField('jobCategory', 'invalid')).toBe('유효하지 않은 직업군입니다');
    });

    it('cityId 필드를 검증한다', () => {
      expect(validateField('cityId', 'city-1')).toBe('');
      // 빈 문자열은 falsy하므로 '도시 정보가 필요합니다' 에러가 발생
      expect(validateField('cityId', '')).toBe('도시 정보가 필요합니다');
    });

    it('유효한 값은 빈 문자열을 반환한다', () => {
      const error = validateField('rating', 5);

      expect(error).toBe('');
    });
  });
});
