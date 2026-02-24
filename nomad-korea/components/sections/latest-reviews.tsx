import { MessageSquare, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ReviewCard from "@/components/review-card";
import { createClient } from "@/lib/supabase/server";
import { getLatestReviews } from "@/lib/supabase/queries/reviews";
import { transformReviewsWithUserToReviews } from "@/lib/utils/type-transformers";
import type { Review } from "@/types";

export default async function LatestReviews() {
  const supabase = await createClient();

  let reviews: Review[];
  try {
    const dbReviews = await getLatestReviews(supabase, 4);
    reviews = transformReviewsWithUserToReviews(dbReviews || []);
  } catch {
    reviews = [];
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <MessageSquare className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">최신 리뷰</h2>
              <p className="text-muted-foreground">
                노마드들의 생생한 경험을 확인하세요
              </p>
            </div>
          </div>
          <Link href="/reviews" className="hidden md:block">
            <Button variant="ghost">
              전체 리뷰 보기
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        {reviews.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>아직 작성된 리뷰가 없습니다.</p>
            <Link href="/reviews/new">
              <Button variant="outline" className="mt-4">
                첫 리뷰 작성하기
              </Button>
            </Link>
          </div>
        )}

        {/* Mobile View All Button */}
        {reviews.length > 0 && (
          <div className="mt-8 text-center md:hidden">
            <Link href="/reviews">
              <Button variant="outline" className="w-full">
                전체 리뷰 보기
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
