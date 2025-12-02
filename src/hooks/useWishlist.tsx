import { useContext } from 'react';
import { WishlistContext, type WishlistContextType } from '@/components/wishlist/WishlistContext';

export function useWishlist(): WishlistContextType {
    const context = useContext(WishlistContext);
    if (!context) {
        throw new Error('useWishlist must be used within a WishlistProvider');
    }
    return context;
}
