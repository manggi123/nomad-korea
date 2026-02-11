'use client';

import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import type { Review, ReviewSortOption, ReviewJobFilter } from '@/types';
import { sortReviews, filterReviewsByJob, paginateReviews } from '@/lib/review-utils';
import { ReviewFilters } from '@/components/city-detail/review-filters';
import { ReviewPagination } from '@/components/city-detail/review-pagination';
import ReviewCard from '@/components/review-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ReviewFormModal } from '@/components/review-form/review-form-modal';
import { PenSquare } from 'lucide-react';
import { toast } from 'sonner';

interface ReviewSectionProps {
  initialReviews: Review[];
  cityId: string;
  cityName: string;
}

/**
 * 리뷰 섹션 통합 컴포넌트 (클라이언트 컴포넌트)
 */
export function ReviewSection({
  initialReviews,
  cityId,
  cityName,
}: ReviewSectionProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // URL 쿼리 파라미터에서 필터 값 추출
  const sortBy = (searchParams.get('sort') || 'latest') as ReviewSortOption;
  const jobFilter = (searchParams.get('job') || 'all') as ReviewJobFilter;
  const page = parseInt(searchParams.get('page') || '1', 10);

  // 함수형 파이프라인: filter → sort → paginate
  const filtered = filterReviewsByJob(initialReviews, jobFilter);
  const sorted = sortReviews(filtered, sortBy);
  const { items, totalPages } = paginateReviews(sorted, page, 5);

  // 리뷰 작성 성공 시 페이지 새로고침 및 토스트 표시
  const handleSuccess = () => {
    toast.success('리뷰가 성공적으로 작성되었습니다!', {
      description: '소중한 의견 감사합니다.',
    });
    router.refresh();
  };

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">리뷰 ({sorted.length})</h2>
        <Button onClick={() => setIsModalOpen(true)}>
          <PenSquare className="w-4 h-4 mr-2" />
          리뷰 작성하기
        </Button>
      </div>

      {/* 리뷰 작성 모달 */}
      <ReviewFormModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        cityId={cityId}
        cityName={cityName}
        onSuccess={handleSuccess}
      />

      {/* 필터/정렬 UI */}
      <ReviewFilters className="mb-6" />

      {/* 리뷰 목록 */}
      <div className="space-y-4">
        {items.length > 0 ? (
          items.map((review) => <ReviewCard key={review.id} review={review} />)
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">
                해당 조건의 리뷰가 없습니다.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* 페이지네이션 (페이지가 2개 이상일 때만 표시) */}
      {totalPages > 1 && (
        <ReviewPagination currentPage={page} totalPages={totalPages} />
      )}
    </section>
  );
}
