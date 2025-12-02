'use client';

import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where, orderBy } from 'firebase/firestore';
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

    const reviewsQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return query(
            collection(firestore, 'reviews'),
            where('productId', '==', productId),
            orderBy('createdAt', 'desc')
        );
    }, [firestore, productId]);

    const { data: reviews, isLoading } = useCollection<Review>(reviewsQuery);

    if (isLoading) return <p>Loading reviews...</p>;

    if (!reviews || reviews.length === 0) {
        return (
            <div className="text-center py-8 text-muted-foreground">
                No reviews yet. Be the first to review this product!
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {reviews.map((review) => (
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
