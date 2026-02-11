import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { SidebarSkeleton } from '@/components/city-detail/sidebar-skeleton';

/**
 * 도시 상세 페이지 로딩 스켈레톤
 */
export default function CityPageLoading() {
  return (
    <div className="min-h-screen">
      {/* 뒤로 가기 스켈레톤 */}
      <div className="container px-4 py-4">
        <Skeleton className="h-9 w-24" />
      </div>

      {/* 헤더 이미지 스켈레톤 */}
      <div className="relative h-[300px] md:h-[400px] w-full">
        <Skeleton className="h-full w-full" />
      </div>

      <div className="container px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 메인 컨텐츠 */}
          <div className="lg:col-span-2 space-y-8">
            {/* 핵심 정보 스켈레톤 */}
            <section>
              <Skeleton className="h-8 w-32 mb-4" />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <Card key={i}>
                    <CardHeader className="pb-2">
                      <Skeleton className="h-4 w-24" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-8 w-20 mb-2" />
                      <Skeleton className="h-3 w-16" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* 레이더 차트 스켈레톤 */}
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-[300px] w-full" />
              </CardContent>
            </Card>

            {/* 리뷰 섹션 스켈레톤 */}
            <section>
              <Skeleton className="h-8 w-48 mb-4" />
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <Skeleton className="h-10 w-10 rounded-full" />
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-3 w-32" />
                          </div>
                        </div>
                        <Skeleton className="h-5 w-16" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-16 w-full mb-3" />
                      <div className="flex items-center gap-4">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          </div>

          {/* 사이드바 스켈레톤 */}
          <div className="space-y-6">
            <SidebarSkeleton />
          </div>
        </div>

        {/* 관련 도시 스켈레톤 */}
        <section className="mt-12">
          <Skeleton className="h-8 w-48 mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <CardContent className="p-4">
                  <Skeleton className="h-6 w-32 mb-2" />
                  <Skeleton className="h-4 w-full mb-3" />
                  <Skeleton className="h-4 w-3/4" />
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
