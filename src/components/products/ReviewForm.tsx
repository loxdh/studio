'use client';

import { useState } from 'react';
import { useUser, useFirestore } from '@/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import StarRating from './StarRating';
import { useToast } from '@/hooks/use-toast';

interface ReviewFormProps {
    productId: string;
    onReviewSubmitted?: () => void;
}

export default function ReviewForm({ productId, onReviewSubmitted }: ReviewFormProps) {
    const { user } = useUser();
    const firestore = useFirestore();
    const { toast } = useToast();

    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [name, setName] = useState(user?.displayName || '');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!firestore) return;

        setIsSubmitting(true);
        try {
            await addDoc(collection(firestore, 'reviews'), {
                productId,
                userId: user?.uid || 'anonymous',
                userName: name || 'Anonymous',
                rating,
                comment,
                createdAt: serverTimestamp(),
            });

            toast({
                title: "Review Submitted",
                description: "Thank you for your feedback!",
            });

            setComment('');
            setRating(5);
            if (onReviewSubmitted) onReviewSubmitted();

        } catch (error) {
            console.error("Error submitting review:", error);
            toast({
                title: "Error",
                description: "Failed to submit review.",
                variant: "destructive"
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 border p-6 rounded-lg bg-card">
            <h3 className="font-semibold text-lg">Write a Review</h3>

            <div className="space-y-2">
                <Label>Rating</Label>
                <StarRating rating={rating} onRatingChange={setRating} editable size={24} />
            </div>

            <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your Name"
                    required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="comment">Review</Label>
                <Textarea
                    id="comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your thoughts..."
                    required
                />
            </div>

            <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </Button>
        </form>
    );
}
