import { MapPin, Briefcase, MessageSquare, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/server";
import { getAllCities } from "@/lib/supabase/queries/cities";
import { transformDbCitiesToCities } from "@/lib/utils/type-transformers";
import NewReviewForm from "./new-review-form";
import type { City } from "@/types";

export default async function NewReviewPage() {
  const supabase = await createClient();

  // 도시 목록 가져오기
  let cities: City[];
  try {
    const dbCities = await getAllCities(supabase);
    cities = transformDbCitiesToCities(dbCities || []);
  } catch {
    cities = [];
  }

  // 현재 사용자 확인
  const { data: { user } } = await supabase.auth.getUser();
  const isLoggedIn = !!user;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-primary/10 to-purple-50">
      {/* Hero Section */}
      <section className="py-16 md:py-20">
        <div className="container px-4">
          <div className="max-w-3xl mx-auto">
            {/* 뒤로 가기 버튼 */}
            <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
              <ArrowLeft className="h-4 w-4" />
              홈으로 돌아가기
            </Link>

            {/* 타이틀 */}
            <div className="text-center space-y-4 mb-12">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                리뷰 작성하기
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground">
                당신의 노마드 경험을 다른 사람들과 공유해주세요
              </p>
            </div>

            {/* 통계 배지 */}
            <div className="flex flex-wrap justify-center gap-2 mb-12">
              <Badge variant="secondary" className="px-4 py-2 text-sm">
                <MessageSquare className="h-4 w-4 mr-1" />
                활발한 리뷰
              </Badge>
              <Badge variant="secondary" className="px-4 py-2 text-sm">
                <MapPin className="h-4 w-4 mr-1" />
                {cities.length}개 도시
              </Badge>
              <Badge variant="secondary" className="px-4 py-2 text-sm">
                <Briefcase className="h-4 w-4 mr-1" />
                활발한 커뮤니티
              </Badge>
            </div>

            {/* 리뷰 작성 폼 */}
            <NewReviewForm cities={cities} isLoggedIn={isLoggedIn} />

            {/* 안내 문구 */}
            <div className="mt-8 text-center">
              <p className="text-sm text-muted-foreground">
                작성하신 리뷰는 커뮤니티 가이드라인에 따라 검토 후 게시됩니다.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
