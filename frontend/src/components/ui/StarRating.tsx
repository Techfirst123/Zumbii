'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';
import clsx from 'clsx';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onChange?: (rating: number) => void;
  showValue?: boolean;
  className?: string;
}

const sizeStyles = {
  sm: 'w-3.5 h-3.5',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
};

const gapStyles = {
  sm: 'gap-0.5',
  md: 'gap-1',
  lg: 'gap-1.5',
};

function StarRating({
  rating,
  maxRating = 5,
  size = 'md',
  interactive = false,
  onChange,
  showValue = false,
  className,
}: StarRatingProps) {
  const [hovered, setHovered] = useState<number | null>(null);

  const displayRating = hovered ?? rating;

  const handleClick = (value: number) => {
    if (interactive && onChange) {
      onChange(value);
    }
  };

  return (
    <div className={clsx('inline-flex items-center', className)}>
      <div
        className={clsx('inline-flex', gapStyles[size])}
        role={interactive ? 'radiogroup' : 'img'}
        aria-label={`Rating: ${rating} out of ${maxRating}`}
      >
        {Array.from({ length: maxRating }, (_, i) => {
          const value = i + 1;
          const filled = displayRating >= value;
          const partial = !filled && displayRating >= value - 0.5 && displayRating < value;

          return (
            <button
              key={value}
              type="button"
              disabled={!interactive}
              onClick={() => handleClick(value)}
              onMouseEnter={() => interactive && setHovered(value)}
              onMouseLeave={() => interactive && setHovered(null)}
              className={clsx(
                'transition-all duration-150',
                interactive
                  ? 'cursor-pointer hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 rounded-sm'
                  : 'cursor-default',
                filled && 'text-gold-500',
                partial && 'text-gold-500',
                !filled && !partial && 'text-border'
              )}
              aria-label={interactive ? `${value} star${value > 1 ? 's' : ''}` : undefined}
              role={interactive ? 'radio' : undefined}
              aria-checked={interactive ? value === displayRating : undefined}
              tabIndex={interactive ? 0 : -1}
            >
              <div className="relative">
                <Star
                  className={clsx(
                    sizeStyles[size],
                    'transition-transform duration-150',
                    filled && 'fill-current',
                    partial && 'fill-current'
                  )}
                />
                {partial && (
                  <div
                    className="absolute inset-0 overflow-hidden"
                    style={{ width: `${(displayRating - value + 1) * 100}%` }}
                  >
                    <Star className={clsx(sizeStyles[size], 'fill-current')} />
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
      {showValue && (
        <span className="ml-1.5 text-sm font-medium text-text-primary">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}

export { StarRating };
export type { StarRatingProps };
