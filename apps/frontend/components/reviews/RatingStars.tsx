'use client';

import { useState } from 'react';

interface RatingStarsProps {
  rating: number;
  onRate?: (rating: number) => void;
  readOnly?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function RatingStars({ rating, onRate, readOnly = false, size = 'md' }: RatingStarsProps) {
  const [hovered, setHovered] = useState(0);

  const sizeClass = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl',
  }[size];

  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = readOnly ? star <= rating : star <= (hovered || rating);
        return (
          <span
            key={star}
            className={`${sizeClass} cursor-pointer select-none ${
              filled ? 'text-yellow-500' : 'text-gray-300'
            } ${readOnly ? 'cursor-default' : ''}`}
            onMouseEnter={() => !readOnly && setHovered(star)}
            onMouseLeave={() => !readOnly && setHovered(0)}
            onClick={() => !readOnly && onRate?.(star)}
          >
            ★
          </span>
        );
      })}
    </div>
  );
}
