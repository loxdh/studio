'use client';

import { useWishlist } from '@/hooks/useWishlist';
import ProductGrid from '@/components/products/ProductGrid';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Heart } from 'lucide-react';

export default function WishlistPage() {
    const { wishlistItems } = useWishlist();

    if (wishlistItems.length === 0) {
        return (
            <div className="container mx-auto px-4 py-16 text-center min-h-[60vh] flex flex-col items-center justify-center">
                <div className="bg-muted p-6 rounded-full mb-6">
                    <Heart className="h-12 w-12 text-muted-foreground" />
                </div>
                <h1 className="font-headline text-4xl mb-4">Your Wishlist is Empty</h1>
                <p className="text-muted-foreground mb-8 max-w-md">
                    It looks like you haven't added any items to your wishlist yet.
                    Browse our collection and save your favorites for later!
                </p>
                <Button asChild size="lg">
                    <Link href="/products">Explore Collection</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-16">
            <header className="text-center mb-12">
                <h1 className="font-headline text-5xl">My Wishlist</h1>
                <p className="mt-2 text-lg text-muted-foreground">
                    {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved for later
                </p>
            </header>

            <ProductGrid products={wishlistItems} />
        </div>
    );
}
