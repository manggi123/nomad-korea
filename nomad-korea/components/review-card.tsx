import { Star, ThumbsUp, MessageCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Review } from '@/types';

interface ReviewCardProps {
  review: Review;
}

const jobCategoryLabels: Record<string, string> = {
  developer: '개발자',
  designer: '디자이너',
  marketer: '마케터',
  writer: '작가',
  'video-producer': '영상PD',
  planner: '기획자',
};

export default function ReviewCard({ review }: ReviewCardProps) {
  const timeAgo = getTimeAgo(review.createdAt);

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        {/* 작성자 정보 */}
        <div className="flex items-start gap-3 mb-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={review.avatarUrl} alt={review.username} />
            <AvatarFallback>{review.username.slice(0, 2)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium">{review.username}</span>
              <Badge variant="secondary" className="text-xs">
                {jobCategoryLabels[review.jobCategory] || review.jobCategory}
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{review.cityName}</span>
              <span>·</span>
              <span>{timeAgo}</span>
            </div>
          </div>
        </div>

        {/* 별점 */}
        <div className="flex items-center gap-1 mb-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${
                i < review.rating
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          ))}
        </div>

        {/* 리뷰 내용 */}
        <p className="text-sm mb-3 line-clamp-2">{review.comment}</p>

        {/* 좋아요, 댓글 */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <button className="flex items-center gap-1 hover:text-foreground transition-colors">
            <ThumbsUp className="h-4 w-4" />
            <span>{review.likesCount}</span>
          </button>
          <button className="flex items-center gap-1 hover:text-foreground transition-colors">
            <MessageCircle className="h-4 w-4" />
            <span>{review.commentsCount}</span>
          </button>
        </div>
      </CardContent>
    </Card>
  );
}

function getTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInMinutes < 60) {
    return `${diffInMinutes}분 전`;
  } else if (diffInHours < 24) {
    return `${diffInHours}시간 전`;
  } else if (diffInDays < 30) {
    return `${diffInDays}일 전`;
  } else {
    return date.toLocaleDateString('ko-KR');
  }
}
