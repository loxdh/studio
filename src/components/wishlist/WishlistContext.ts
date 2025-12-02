import { createContext } from 'react';
import type { Product } from '@/lib/products';

export type WishlistContextType = {
    wishlistItems: Product[];
    addToWishlist: (product: Product) => void;
    removeFromWishlist: (productId: string) => void;
    isInWishlist: (productId: string) => boolean;
};

export const WishlistContext = createContext<WishlistContextType | null>(null);
