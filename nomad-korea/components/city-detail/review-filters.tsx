'use client';

import { useRouter, useSearchParams } from 'next/navigation';

interface ReviewFiltersProps {
  className?: string;
}

/**
 * 리뷰 필터/정렬 UI 컴포넌트 (클라이언트 컴포넌트)
 */
export function ReviewFilters({ className }: ReviewFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const sortBy = searchParams.get('sort') || 'latest';
  const jobFilter = searchParams.get('job') || 'all';

  /**
   * URL 쿼리 파라미터 업데이트
   */
  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, value);
    params.set('page', '1'); // 필터 변경 시 첫 페이지로
    router.push(`?${params.toString()}`);
  };

  return (
    <div className={`flex flex-col md:flex-row gap-4 justify-between ${className || ''}`}>
      {/* 정렬 드롭다운 */}
      <div className="flex items-center gap-2">
        <label htmlFor="sort-select" className="text-sm font-medium">
          정렬:
        </label>
        <select
          id="sort-select"
          value={sortBy}
          onChange={(e) => updateParam('sort', e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="latest">최신순</option>
          <option value="rating">평점순</option>
          <option value="likes">좋아요순</option>
        </select>
      </div>

      {/* 직업군 필터 탭 */}
      <div className="flex items-center gap-2 overflow-x-auto">
        <span className="text-sm font-medium whitespace-nowrap">직업군:</span>
        <div className="flex gap-2">
          {[
            { value: 'all', label: '전체' },
            { value: 'developer', label: '개발자' },
            { value: 'designer', label: '디자이너' },
            { value: 'marketer', label: '마케터' },
            { value: 'writer', label: '작가' },
          ].map((job) => (
            <button
              key={job.value}
              onClick={() => updateParam('job', job.value)}
              className={`px-3 py-1.5 text-sm rounded-md whitespace-nowrap transition-colors ${
                jobFilter === job.value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              {job.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
