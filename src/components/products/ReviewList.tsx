'use client';

import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where, orderBy, limit } from 'firebase/firestore';
import StarRating from './StarRating';
import { formatDistanceToNow } from 'date-fns';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface Review {
    id: string;
    userName: string;
    rating: number;
    comment: string;
    createdAt: any;
}

interface ReviewListProps {
    productId: string;
}

export default function ReviewList({ productId }: ReviewListProps) {
    const firestore = useFirestore();

    const productReviewsQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return query(
            collection(firestore, 'reviews'),
            where('productId', '==', productId),
            orderBy('createdAt', 'desc')
        );
    }, [firestore, productId]);

    const generalReviewsQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return query(
            collection(firestore, 'reviews'),
            where('rating', '>=', 5),
            orderBy('rating', 'desc'),
            orderBy('createdAt', 'desc'),
            limit(3)
        );
    }, [firestore]);

    const { data: productReviews, isLoading: isLoadingProduct } = useCollection<Review>(productReviewsQuery);
    const { data: generalReviews, isLoading: isLoadingGeneral } = useCollection<Review>(generalReviewsQuery);

    if (isLoadingProduct || isLoadingGeneral) return <p>Loading reviews...</p>;

    const hasProductReviews = productReviews && productReviews.length > 0;
    const displayReviews = hasProductReviews ? productReviews : (generalReviews || []);
    const isShowingGeneral = !hasProductReviews && displayReviews.length > 0;

    if (!displayReviews || displayReviews.length === 0) {
        return (
            <div className="text-center py-8 text-muted-foreground">
                No reviews yet. Be the first to review this product!
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {isShowingGeneral && (
                <p className="text-sm text-muted-foreground italic mb-4">
                    Here are some recent 5-star reviews from our happy couples:
                </p>
            )}
            {displayReviews.map((review) => (
                <div key={review.id} className="flex gap-4 border-b pb-6 last:border-0">
                    <Avatar>
                        <AvatarFallback>{review.userName.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <span className="font-semibold">{review.userName}</span>
                            <span className="text-xs text-muted-foreground">
                                {review.createdAt?.toDate ? formatDistanceToNow(review.createdAt.toDate(), { addSuffix: true }) : 'Just now'}
                            </span>
                        </div>
                        <StarRating rating={review.rating} size={14} />
                        <p className="text-sm text-foreground mt-2">{review.comment}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}
