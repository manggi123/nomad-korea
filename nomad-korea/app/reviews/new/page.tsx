"use client";

import { useState } from "react";
import { Star, MapPin, Briefcase, MessageSquare, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { mockCities } from "@/lib/mock-data";

const jobCategories = [
  { value: "developer", label: "개발자" },
  { value: "designer", label: "디자이너" },
  { value: "marketer", label: "마케터" },
  { value: "writer", label: "작가" },
  { value: "video-producer", label: "영상PD" },
  { value: "planner", label: "기획자" },
];

export default function NewReviewPage() {
  const [selectedCity, setSelectedCity] = useState("");
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [selectedJob, setSelectedJob] = useState("");
  const [comment, setComment] = useState("");
  const [username, setUsername] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCity || !rating || !selectedJob || !comment || !username) {
      alert("모든 필드를 입력해주세요.");
      return;
    }

    setIsSubmitting(true);

    // 시뮬레이션: 실제로는 서버로 전송
    await new Promise(resolve => setTimeout(resolve, 1500));

    alert("리뷰가 성공적으로 작성되었습니다!");

    // 폼 초기화
    setSelectedCity("");
    setRating(0);
    setSelectedJob("");
    setComment("");
    setUsername("");
    setIsSubmitting(false);
  };

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
                2,300+ 리뷰
              </Badge>
              <Badge variant="secondary" className="px-4 py-2 text-sm">
                <MapPin className="h-4 w-4 mr-1" />
                15개 도시
              </Badge>
              <Badge variant="secondary" className="px-4 py-2 text-sm">
                <Briefcase className="h-4 w-4 mr-1" />
                활발한 커뮤니티
              </Badge>
            </div>

            {/* 리뷰 작성 폼 */}
            <Card className="shadow-xl">
              <CardContent className="p-6 md:p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* 사용자 이름 */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      이름 또는 닉네임 <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="text"
                      placeholder="예: 김노마드"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="h-12"
                    />
                  </div>

                  {/* 도시 선택 */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      리뷰할 도시 <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={selectedCity}
                      onChange={(e) => setSelectedCity(e.target.value)}
                      className="w-full h-12 px-4 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    >
                      <option value="">도시를 선택하세요</option>
                      {mockCities.map((city) => (
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
                      직업군 <span className="text-red-500">*</span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {jobCategories.map((job) => (
                        <Badge
                          key={job.value}
                          variant={selectedJob === job.value ? "default" : "secondary"}
                          className="px-4 py-2 text-sm cursor-pointer transition-colors"
                          onClick={() => setSelectedJob(job.value)}
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
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="이 도시에서의 노마드 경험을 자세히 공유해주세요. 인터넷 속도, 카페 환경, 생활비, 커뮤니티 등 다양한 측면을 언급해주시면 도움이 됩니다."
                      className="w-full min-h-[200px] px-4 py-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 resize-y"
                      maxLength={1000}
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
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "작성 중..." : "리뷰 작성 완료"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

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
