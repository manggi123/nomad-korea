'use client';

import { useState, useEffect } from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import { toggleCityLike } from '@/lib/supabase/mutations/likes';

interface CityLikesButtonProps {
  cityId: string;
  initialLikes?: number;
  initialDislikes?: number;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
  className?: string;
}

export function CityLikesButton({
  cityId,
  initialLikes = 0,
  initialDislikes = 0,
  size = 'sm',
  showCount = true,
  className,
}: CityLikesButtonProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [dislikes, setDislikes] = useState(initialDislikes);
  const [userReaction, setUserReaction] = useState<'like' | 'dislike' | null>(null);
  const [isAnimating, setIsAnimating] = useState<'like' | 'dislike' | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  // 초기 데이터 로드
  useEffect(() => {
    const loadInitialData = async () => {
      const supabase = createClient();

      // 현재 사용자 확인
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id || null);

      // 도시 좋아요 수 가져오기
      const { data: city } = await supabase
        .from('cities')
        .select('likes, dislikes')
        .eq('id', cityId)
        .single();

      if (city) {
        setLikes(city.likes || 0);
        setDislikes(city.dislikes || 0);
      }

      // 사용자 반응 가져오기
      if (user) {
        const { data: reaction } = await supabase
          .from('city_likes')
          .select('reaction')
          .eq('city_id', cityId)
          .eq('user_id', user.id)
          .maybeSingle();

        setUserReaction(reaction?.reaction || null);
      }
    };

    loadInitialData();
  }, [cityId]);

  const handleReaction = async (reactionType: 'like' | 'dislike') => {
    if (!userId) {
      // 로그인 필요 알림
      alert('좋아요/싫어요를 누르려면 로그인이 필요합니다.');
      return;
    }

    if (isLoading) return;

    setIsLoading(true);

    // Optimistic UI 업데이트
    const prevLikes = likes;
    const prevDislikes = dislikes;
    const prevReaction = userReaction;

    if (userReaction === reactionType) {
      // 같은 반응 → 취소
      if (reactionType === 'like') {
        setLikes((prev) => Math.max(0, prev - 1));
      } else {
        setDislikes((prev) => Math.max(0, prev - 1));
      }
      setUserReaction(null);
    } else if (userReaction) {
      // 다른 반응으로 변경
      if (reactionType === 'like') {
        setLikes((prev) => prev + 1);
        setDislikes((prev) => Math.max(0, prev - 1));
      } else {
        setDislikes((prev) => prev + 1);
        setLikes((prev) => Math.max(0, prev - 1));
      }
      setUserReaction(reactionType);
    } else {
      // 새로운 반응
      if (reactionType === 'like') {
        setLikes((prev) => prev + 1);
      } else {
        setDislikes((prev) => prev + 1);
      }
      setUserReaction(reactionType);
    }

    // 애니메이션
    setIsAnimating(reactionType);
    setTimeout(() => setIsAnimating(null), 300);

    try {
      const supabase = createClient();
      await toggleCityLike(supabase, cityId, userId, reactionType);
    } catch (error) {
      console.error('Failed to toggle reaction:', error);
      // 롤백
      setLikes(prevLikes);
      setDislikes(prevDislikes);
      setUserReaction(prevReaction);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLike = () => handleReaction('like');
  const handleDislike = () => handleReaction('dislike');

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
