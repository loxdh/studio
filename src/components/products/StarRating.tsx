import { Star, StarHalf } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
    rating: number;
    max?: number;
    size?: number;
    className?: string;
    onRatingChange?: (rating: number) => void;
    editable?: boolean;
}

export default function StarRating({
    rating,
    max = 5,
    size = 16,
    className,
    onRatingChange,
    editable = false
}: StarRatingProps) {
    const stars = [];

    for (let i = 1; i <= max; i++) {
        const isFull = i <= rating;
        const isHalf = !isFull && i - 0.5 <= rating;

        stars.push(
            <button
                key={i}
                type="button"
                disabled={!editable}
                onClick={() => editable && onRatingChange?.(i)}
                className={cn(
                    "focus:outline-none transition-transform hover:scale-110",
                    editable ? "cursor-pointer" : "cursor-default"
                )}
            >
                {isFull ? (
                    <Star size={size} className="fill-yellow-400 text-yellow-400" />
                ) : isHalf ? (
                    <StarHalf size={size} className="fill-yellow-400 text-yellow-400" />
                ) : (
                    <Star size={size} className="text-gray-300" />
                )}
            </button>
        );
    }

    return <div className={cn("flex gap-1", className)}>{stars}</div>;
}
