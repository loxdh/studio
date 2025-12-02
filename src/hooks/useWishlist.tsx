import { useContext } from 'react';
import { WishlistContext, WishlistContextType } from '@/components/wishlist/WishlistProvider';

export function useWishlist(): WishlistContextType {
    const context = useContext(WishlistContext);
    if (!context) {
        throw new Error('useWishlist must be used within a WishlistProvider');
    }
    return context;
}
