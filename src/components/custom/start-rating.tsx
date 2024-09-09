"use client";

import { cn } from "@/lib/utils";
import { Star } from "lucide-react";
import { ChangeEvent, useState } from "react";

interface StarRatingProps {
  rating?: number | null;
  onChange?: (value: number) => void;
  readonly?: boolean;
  className?: string;
}

export const StarRating = ({
  rating: controlledRating = null,
  onChange,
  readonly = false,
  className = "",
}: StarRatingProps) => {
  const [rating, setRating] = useState<number | null>(controlledRating);
  const [hover, setHover] = useState<number | null>(null);

  const handleClick = (currentRating: number) => {
    if (!readonly) {
      setRating(currentRating);
      if (onChange) {
        onChange(currentRating);
      }
    }
  };

  const handleMouseEnter = (currentRating: number) => {
    if (!readonly) {
      setHover(currentRating);
    }
  };

  const handleMouseLeave = () => {
    if (!readonly) {
      setHover(null);
    }
  };

  return (
    <div className="flex">
      {[...Array(5)].map((_, i) => {
        const currentRating = i + 1;
        const isFilled = currentRating <= Math.floor(hover ?? rating ?? 0);
        const isHalfFilled =
          currentRating === Math.ceil(hover ?? rating ?? 0) &&
          rating &&
          rating % 1 !== 0;

        return (
          <label key={i}>
            {!readonly && (
              <input
                type="radio"
                name="rating"
                className="hidden"
                value={currentRating}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleClick(Number(e.target.value))
                }
              />
            )}
            <Star
              className={cn(
                className,
                "stroke-current", // ensures the outline is visible
                isFilled
                  ? "fill-[#ffc107] text-[#ffc107]"
                  : isHalfFilled
                    ? "half-filled-star fill-[#ffc107] text-[#ffc107]"
                    : "text-[#ccc]",
                readonly ? "cursor-default" : "cursor-pointer",
              )}
              onMouseEnter={() => handleMouseEnter(currentRating)}
              onMouseLeave={handleMouseLeave}
              onClick={() => handleClick(currentRating)}
              style={{
                clipPath: isHalfFilled ? "inset(0 50% 0 0)" : undefined,
                strokeWidth: isHalfFilled ? "1.5px" : "0", // adds an outline when half-filled
              }}
            />
          </label>
        );
      })}
    </div>
  );
};
