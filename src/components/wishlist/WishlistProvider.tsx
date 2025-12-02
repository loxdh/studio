'use client';

import { createContext, useState, ReactNode, useEffect } from 'react';
import type { Product } from '@/lib/products';
import { useToast } from '@/hooks/use-toast';
import { useUser, useFirestore } from '@/firebase';
import { doc, setDoc, getDoc, arrayUnion, arrayRemove, updateDoc } from 'firebase/firestore';

export type WishlistContextType = {
    wishlistItems: Product[];
    addToWishlist: (product: Product) => void;
    removeFromWishlist: (productId: string) => void;
    isInWishlist: (productId: string) => boolean;
};

export const WishlistContext = createContext<WishlistContextType | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
    const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
    const { toast } = useToast();
    const { user } = useUser();
    const firestore = useFirestore();

    // Load wishlist from local storage on mount
    useEffect(() => {
        const savedWishlist = localStorage.getItem('wishlist');
        if (savedWishlist) {
            setWishlistItems(JSON.parse(savedWishlist));
        }
    }, []);

    // Sync with Firestore when user logs in
    useEffect(() => {
        const syncWishlist = async () => {
            if (user && firestore) {
                const docRef = doc(firestore, 'users', user.uid);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    if (data.wishlist) {
                        // Merge local and remote? For now, let's prioritize remote if it exists, or merge unique.
                        // Let's just set it to remote for simplicity, or merge if local has items.
                        // Merging logic:
                        const remoteWishlist = data.wishlist as Product[];
                        setWishlistItems((prev) => {
                            const combined = [...prev, ...remoteWishlist];
                            // Deduplicate by ID
                            const unique = Array.from(new Map(combined.map(item => [item.id, item])).values());
                            return unique;
                        });
                    }
                }
            }
        };
        syncWishlist();
    }, [user, firestore]);

    // Save to local storage whenever wishlist changes
    useEffect(() => {
        localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
    }, [wishlistItems]);

    const addToWishlist = async (product: Product) => {
        if (wishlistItems.some((item) => item.id === product.id)) {
            toast({
                title: "Already in Wishlist",
                description: `${product.name} is already in your wishlist.`,
            });
            return;
        }

        const newItems = [...wishlistItems, product];
        setWishlistItems(newItems);

        toast({
            title: "Added to Wishlist",
            description: `${product.name} has been added to your wishlist.`,
        });

        if (user && firestore) {
            const docRef = doc(firestore, 'users', user.uid);
            // Ensure document exists
            await setDoc(docRef, { wishlist: newItems }, { merge: true });
        }
    };

    const removeFromWishlist = async (productId: string) => {
        const newItems = wishlistItems.filter((item) => item.id !== productId);
        setWishlistItems(newItems);

        toast({
            title: "Removed from Wishlist",
            description: `Item has been removed from your wishlist.`,
        });

        if (user && firestore) {
            const docRef = doc(firestore, 'users', user.uid);
            await updateDoc(docRef, { wishlist: newItems });
        }
    };

    const isInWishlist = (productId: string) => {
        return wishlistItems.some((item) => item.id === productId);
    };

    return (
        <WishlistContext.Provider
            value={{
                wishlistItems,
                addToWishlist,
                removeFromWishlist,
                isInWishlist,
            }}
        >
            {children}
        </WishlistContext.Provider>
    );
}
