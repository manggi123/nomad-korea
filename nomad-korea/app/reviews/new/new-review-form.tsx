"use client";

import { useState, useActionState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createReviewAction, type CreateReviewState } from "./actions";
import type { City } from "@/types";

interface NewReviewFormProps {
  cities: City[];
  isLoggedIn: boolean;
}

const initialState: CreateReviewState = {
  success: false,
};

export default function NewReviewForm({ cities, isLoggedIn }: NewReviewFormProps) {
  const [selectedCity, setSelectedCity] = useState("");
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [selectedJob, setSelectedJob] = useState("");
  const [comment, setComment] = useState("");

  const [state, formAction, isPending] = useActionState(
    createReviewAction,
    initialState
  );

  const jobCategories = [
    { value: "developer", label: "개발자" },
    { value: "designer", label: "디자이너" },
    { value: "marketer", label: "마케터" },
    { value: "writer", label: "작가" },
    { value: "video-producer", label: "영상PD" },
    { value: "planner", label: "기획자" },
  ];

  if (!isLoggedIn) {
    return (
      <Card className="shadow-xl">
        <CardContent className="p-6 md:p-8 text-center">
          <h3 className="text-xl font-bold mb-4">로그인이 필요합니다</h3>
          <p className="text-muted-foreground mb-6">
            리뷰를 작성하려면 먼저 로그인해주세요.
          </p>
          <Button asChild size="lg">
            <a href="/login">로그인하기</a>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-xl">
      <CardContent className="p-6 md:p-8">
        <form action={formAction} className="space-y-6">
          {/* 에러 메시지 */}
          {state.error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {state.error}
            </div>
          )}

          {/* 도시 선택 */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              리뷰할 도시 <span className="text-red-500">*</span>
            </label>
            <select
              name="cityId"
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full h-12 px-4 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              required
            >
              <option value="">도시를 선택하세요</option>
              {cities.map((city) => (
                <option key={city.id} value={city.id}>
                  {city.name} ({city.region})
                </option>
              ))}
            </select>
          </div>

          {/* 별점 */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              평점 <span className="text-red-500">*</span>
            </label>
            <input type="hidden" name="rating" value={rating} />
            <div className="flex items-center gap-2">
              {Array.from({ length: 5 }).map((_, i) => {
                const starValue = i + 1;
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setRating(starValue)}
                    onMouseEnter={() => setHoveredRating(starValue)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={`h-8 w-8 ${
                        starValue <= (hoveredRating || rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                );
              })}
              {rating > 0 && (
                <span className="ml-2 text-sm text-muted-foreground">
                  {rating}점
                </span>
              )}
            </div>
          </div>

          {/* 직업군 선택 */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              직업군 <span className="text-muted-foreground">(선택)</span>
            </label>
            <input type="hidden" name="jobCategory" value={selectedJob} />
            <div className="flex flex-wrap gap-2">
              {jobCategories.map((job) => (
                <Badge
                  key={job.value}
                  variant={selectedJob === job.value ? "default" : "secondary"}
                  className="px-4 py-2 text-sm cursor-pointer transition-colors"
                  onClick={() => setSelectedJob(selectedJob === job.value ? "" : job.value)}
                >
                  {job.label}
                </Badge>
              ))}
            </div>
          </div>

          {/* 리뷰 내용 */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              리뷰 내용 <span className="text-red-500">*</span>
            </label>
            <textarea
              name="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="이 도시에서의 노마드 경험을 자세히 공유해주세요. 인터넷 속도, 카페 환경, 생활비, 커뮤니티 등 다양한 측면을 언급해주시면 도움이 됩니다."
              className="w-full min-h-[200px] px-4 py-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 resize-y"
              maxLength={1000}
              required
              minLength={10}
            />
            <div className="text-xs text-muted-foreground text-right">
              {comment.length} / 1000
            </div>
          </div>

          {/* 제출 버튼 */}
          <div className="pt-4">
            <Button
              type="submit"
              size="lg"
              className="w-full h-12 text-base"
              disabled={isPending || !selectedCity || !rating || !comment}
            >
              {isPending ? "작성 중..." : "리뷰 작성 완료"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
