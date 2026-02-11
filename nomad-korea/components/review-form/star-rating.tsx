'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  value: number;
  onChange: (rating: number) => void;
  disabled?: boolean;
  className?: string;
}

export function StarRating({
  value,
  onChange,
  disabled = false,
  className,
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState<number>(0);

  const handleClick = (rating: number) => {
    if (!disabled) {
      onChange(rating);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>, index: number) => {
    if (disabled) return;

    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        onChange(index + 1);
        break;
      case 'ArrowRight':
      case 'ArrowUp':
        e.preventDefault();
        if (index < 4) {
          onChange(index + 2);
        }
        break;
      case 'ArrowLeft':
      case 'ArrowDown':
        e.preventDefault();
        if (index > 0) {
          onChange(index);
        }
        break;
    }
  };

  return (
    <div
      className={cn('flex items-center gap-1', className)}
      role="radiogroup"
      aria-label="별점 선택"
    >
      {[1, 2, 3, 4, 5].map((rating) => {
        const isActive = (hoverRating || value) >= rating;

        return (
          <div
            key={rating}
            role="radio"
            aria-checked={value === rating}
            aria-label={`${rating}점`}
            tabIndex={disabled ? -1 : 0}
            className={cn(
              'cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded',
              disabled && 'cursor-not-allowed opacity-50'
            )}
            onClick={() => handleClick(rating)}
            onMouseEnter={() => !disabled && setHoverRating(rating)}
            onMouseLeave={() => !disabled && setHoverRating(0)}
            onKeyDown={(e) => handleKeyDown(e, rating - 1)}
          >
            <Star
              className={cn(
                'w-8 h-8 transition-colors',
                isActive
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300 dark:text-gray-600'
              )}
            />
          </div>
        );
      })}
      {value > 0 && (
        <span className="ml-2 text-sm text-muted-foreground">{value}점</span>
      )}
    </div>
  );
}
