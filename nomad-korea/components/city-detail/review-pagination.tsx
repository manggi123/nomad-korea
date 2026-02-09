'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ReviewPaginationProps {
  currentPage: number;
  totalPages: number;
}

/**
 * 리뷰 페이지네이션 컴포넌트 (클라이언트 컴포넌트)
 */
export function ReviewPagination({
  currentPage,
  totalPages,
}: ReviewPaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <Button
        variant="outline"
        size="sm"
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        이전
      </Button>

      <span className="text-sm text-muted-foreground">
        {currentPage} / {totalPages}
      </span>

      <Button
        variant="outline"
        size="sm"
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        다음
        <ChevronRight className="h-4 w-4 ml-1" />
      </Button>
    </div>
  );
}
