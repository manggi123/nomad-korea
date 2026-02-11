'use client';

import { useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { StarRating } from './star-rating';
import { JobSelector } from './job-selector';
import { useReviewForm } from '@/hooks/use-review-form';
import { JobCategory } from '@/types';
import { MapPin } from 'lucide-react';

interface ReviewFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cityId: string;
  cityName: string;
  onSuccess?: () => void;
}

export function ReviewFormModal({
  open,
  onOpenChange,
  cityId,
  cityName,
  onSuccess,
}: ReviewFormModalProps) {
  const {
    rating,
    setRating,
    comment,
    setComment,
    jobCategory,
    setJobCategory,
    isSubmitting,
    getFieldError,
    submitReview,
    resetForm,
  } = useReviewForm({
    cityId,
    cityName,
    onSuccess: () => {
      onOpenChange(false);
      if (onSuccess) {
        onSuccess();
      }
    },
    onError: (error) => {
      console.error('Failed to submit review:', error);
    },
  });

  // 모달이 닫힐 때 폼 초기화
  useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open, resetForm]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitReview();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-xl">리뷰 작성</DialogTitle>
            <DialogDescription className="flex items-center gap-1 text-base">
              <MapPin className="w-4 h-4" />
              {cityName}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-6">
            {/* 별점 입력 */}
            <div className="space-y-2">
              <Label htmlFor="rating" className="text-base">
                별점 <span className="text-red-500">*</span>
              </Label>
              <StarRating
                value={rating}
                onChange={setRating}
                disabled={isSubmitting}
              />
              {getFieldError('rating') && (
                <p className="text-sm text-red-500">{getFieldError('rating')}</p>
              )}
            </div>

            {/* 직업군 선택 */}
            <div className="space-y-2">
              <Label htmlFor="jobCategory" className="text-base">
                직업군 <span className="text-red-500">*</span>
              </Label>
              <JobSelector
                value={jobCategory}
                onChange={(val) => setJobCategory(val as JobCategory)}
                disabled={isSubmitting}
                className="w-full"
              />
              {getFieldError('jobCategory') && (
                <p className="text-sm text-red-500">
                  {getFieldError('jobCategory')}
                </p>
              )}
            </div>

            {/* 리뷰 내용 */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="comment" className="text-base">
                  리뷰 내용 <span className="text-red-500">*</span>
                </Label>
                <span className="text-sm text-muted-foreground">
                  {comment.length}/500
                </span>
              </div>
              <Textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="이 도시에서의 경험을 공유해주세요. (최소 10자)"
                disabled={isSubmitting}
                rows={5}
                maxLength={500}
                className="resize-none"
              />
              {getFieldError('comment') && (
                <p className="text-sm text-red-500">{getFieldError('comment')}</p>
              )}
            </div>

            {/* 전역 에러 메시지 */}
            {getFieldError('submit') && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{getFieldError('submit')}</p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              취소
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? '제출 중...' : '리뷰 작성'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
