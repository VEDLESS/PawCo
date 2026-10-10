import React from 'react';
import { Star } from 'lucide-react';

interface RatingStarsProps {
  rating: number;
  totalReviews?: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
}

export const RatingStars = ({
  rating,
  totalReviews,
  size = 'md',
  interactive = false,
  onRatingChange,
}: RatingStarsProps) => {
  const sizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-6 h-6',
  };

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = star <= Math.round(rating);
          return (
            <button
              key={star}
              type="button"
              disabled={!interactive}
              onClick={() => interactive && onRatingChange && onRatingChange(star)}
              className={interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'}
            >
              <Star
                className={`${sizes[size]} ${
                  isFilled ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                }`}
              />
            </button>
          );
        })}
      </div>
      {rating > 0 && (
        <span className="text-xs font-bold text-slate-700">
          {rating.toFixed(1)}
        </span>
      )}
      {totalReviews !== undefined && (
        <span className="text-xs text-slate-400">({totalReviews})</span>
      )}
    </div>
  );
};
