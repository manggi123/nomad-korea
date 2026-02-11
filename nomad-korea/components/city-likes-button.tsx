'use client';

import { useState, useEffect } from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  getCityLikes,
  getUserReaction,
  toggleLike,
  toggleDislike,
} from '@/lib/city-likes-storage';

interface CityLikesButtonProps {
  cityId: string;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
  className?: string;
}

export function CityLikesButton({
  cityId,
  size = 'sm',
  showCount = true,
  className,
}: CityLikesButtonProps) {
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [userReaction, setUserReaction] = useState<'like' | 'dislike' | null>(null);
  const [isAnimating, setIsAnimating] = useState<'like' | 'dislike' | null>(null);

  // 초기 데이터 로드
  useEffect(() => {
    const cityLikes = getCityLikes(cityId);
    setLikes(cityLikes.likes);
    setDislikes(cityLikes.dislikes);
    setUserReaction(getUserReaction(cityId));
  }, [cityId]);

  const handleLike = () => {
    const newLikes = toggleLike(cityId);
    setLikes(newLikes.likes);
    setDislikes(newLikes.dislikes);
    setUserReaction(getUserReaction(cityId));

    // 애니메이션
    setIsAnimating('like');
    setTimeout(() => setIsAnimating(null), 300);
  };

  const handleDislike = () => {
    const newLikes = toggleDislike(cityId);
    setLikes(newLikes.likes);
    setDislikes(newLikes.dislikes);
    setUserReaction(getUserReaction(cityId));

    // 애니메이션
    setIsAnimating('dislike');
    setTimeout(() => setIsAnimating(null), 300);
  };

  const sizeClasses = {
    sm: 'h-8 px-2 text-xs gap-1',
    md: 'h-10 px-3 text-sm gap-2',
    lg: 'h-12 px-4 text-base gap-2',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {/* 좋아요 버튼 */}
      <Button
        variant={userReaction === 'like' ? 'default' : 'outline'}
        size="sm"
        className={cn(
          sizeClasses[size],
          'transition-all',
          userReaction === 'like' && 'bg-blue-500 hover:bg-blue-600 text-white',
          isAnimating === 'like' && 'animate-bounce'
        )}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleLike();
        }}
      >
        <ThumbsUp
          className={cn(
            iconSizes[size],
            'transition-all',
            userReaction === 'like' && 'fill-white'
          )}
        />
        {showCount && <span className="font-medium">{likes}</span>}
      </Button>

      {/* 싫어요 버튼 */}
      <Button
        variant={userReaction === 'dislike' ? 'default' : 'outline'}
        size="sm"
        className={cn(
          sizeClasses[size],
          'transition-all',
          userReaction === 'dislike' && 'bg-red-500 hover:bg-red-600 text-white',
          isAnimating === 'dislike' && 'animate-bounce'
        )}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleDislike();
        }}
      >
        <ThumbsDown
          className={cn(
            iconSizes[size],
            'transition-all',
            userReaction === 'dislike' && 'fill-white'
          )}
        />
        {showCount && <span className="font-medium">{dislikes}</span>}
      </Button>
    </div>
  );
}
