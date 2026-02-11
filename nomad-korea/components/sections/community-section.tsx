"use client";

import { Users, Calendar, Trophy, MessageCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function CommunitySection() {
  const upcomingMeetups = [
    {
      id: "1",
      title: "성수 개발자 모닝 커피챗",
      date: "2025-02-06",
      time: "09:00",
      location: "성수",
      participants: 8,
      maxParticipants: 10,
      category: "개발",
    },
    {
      id: "2",
      title: "제주 워케이션 디자이너 밋업",
      date: "2025-02-08",
      time: "18:00",
      location: "제주시",
      participants: 12,
      maxParticipants: 15,
      category: "디자인",
    },
    {
      id: "3",
      title: "강남 프리랜서 네트워킹 데이",
      date: "2025-02-10",
      time: "14:00",
      location: "강남",
      participants: 15,
      maxParticipants: 20,
      category: "네트워킹",
    },
  ];

  const topReviewers = [
    {
      id: "1",
      name: "김노마드",
      avatar: "/avatars/user1.jpg",
      reviewCount: 24,
      helpfulVotes: 156,
      badge: "골드",
    },
    {
      id: "2",
      name: "이디지털",
      avatar: "/avatars/user2.jpg",
      reviewCount: 18,
      helpfulVotes: 132,
      badge: "실버",
    },
    {
      id: "3",
      name: "박테크",
      avatar: "/avatars/user3.jpg",
      reviewCount: 15,
      helpfulVotes: 98,
      badge: "실버",
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">커뮤니티</h2>
              <p className="text-muted-foreground">
                함께 성장하는 노마드 네트워크
              </p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Upcoming Meetups */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  이번 주 모임
                </div>
                <Link href="/community/meetups">
                  <Button variant="ghost" size="sm">
                    전체 보기
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingMeetups.map((meetup) => (
                <Link
                  key={meetup.id}
                  href={`/community/meetups/${meetup.id}`}
                  className="block"
                >
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <Badge variant="outline" className="mb-2">
                            {meetup.category}
                          </Badge>
                          <h4 className="font-semibold mb-1 group-hover:text-primary">
                            {meetup.title}
                          </h4>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {meetup.date} {meetup.time}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {meetup.participants}/{meetup.maxParticipants}명
                        </div>
                      </div>
                      <div className="mt-2 text-sm text-primary font-medium">
                        {meetup.location}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}

              <Button className="w-full" variant="outline">
                <MessageCircle className="mr-2 h-4 w-4" />
                새 모임 만들기
              </Button>
            </CardContent>
          </Card>

          {/* Top Reviewers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  이달의 리뷰왕
                </div>
                <Link href="/community/leaderboard">
                  <Button variant="ghost" size="sm">
                    랭킹 보기
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {topReviewers.map((reviewer, index) => (
                <Link
                  key={reviewer.id}
                  href={`/profile/${reviewer.id}`}
                  className="block"
                >
                  <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-white transition-colors">
                    <div className="relative">
                      <div
                        className={`absolute -top-1 -left-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          index === 0
                            ? "bg-gradient-to-br from-yellow-400 to-orange-400 text-white"
                            : index === 1
                            ? "bg-gradient-to-br from-gray-300 to-gray-400 text-white"
                            : "bg-gradient-to-br from-orange-300 to-orange-400 text-white"
                        }`}
                      >
                        {index + 1}
                      </div>
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={reviewer.avatar} alt={reviewer.name} />
                        <AvatarFallback>{reviewer.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold">{reviewer.name}</span>
                        <Badge
                          variant={
                            reviewer.badge === "골드" ? "default" : "secondary"
                          }
                          className={
                            reviewer.badge === "골드"
                              ? "bg-gradient-to-r from-yellow-400 to-orange-400"
                              : "bg-gradient-to-r from-gray-300 to-gray-400"
                          }
                        >
                          {reviewer.badge}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span>리뷰 {reviewer.reviewCount}개</span>
                        <span>도움 {reviewer.helpfulVotes}회</span>
                      </div>
                    </div>
                    <Trophy
                      className={`h-5 w-5 ${
                        index === 0
                          ? "text-yellow-500"
                          : index === 1
                          ? "text-gray-400"
                          : "text-orange-400"
                      }`}
                    />
                  </div>
                </Link>
              ))}

              <div className="pt-4 border-t">
                <Card className="bg-gradient-to-r from-primary/5 to-purple-100 border-none">
                  <CardContent className="pt-4 text-center">
                    <h4 className="font-semibold mb-2">
                      리뷰를 작성하고 포인트 받기
                    </h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      매월 최고의 리뷰어에게 특별 혜택을 드립니다
                    </p>
                    <Button size="sm" className="w-full">
                      리뷰 작성하기
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Community Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <Card className="text-center">
            <CardContent className="pt-6">
              <Users className="h-6 w-6 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold">12,450</div>
              <div className="text-sm text-muted-foreground">활동 멤버</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <Calendar className="h-6 w-6 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold">156</div>
              <div className="text-sm text-muted-foreground">이번 달 모임</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <MessageCircle className="h-6 w-6 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold">8,934</div>
              <div className="text-sm text-muted-foreground">채팅 메시지</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <Trophy className="h-6 w-6 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold">245</div>
              <div className="text-sm text-muted-foreground">뱃지 획득</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
