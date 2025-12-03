import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where, limit } from 'firebase/firestore';
import { firebaseConfig } from '@/firebase/config';
import { Product } from '@/lib/products';

// Initialize Firebase for Server Side
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function getAllProducts(): Promise<Product[]> {
    const productsRef = collection(db, 'products');
    const snapshot = await getDocs(productsRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
    // 1. Try Firestore first
    const productsRef = collection(db, 'products');
    const q = query(productsRef, where('slug', '==', slug), limit(1));

    try {
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
            const data = snapshot.docs[0].data();
            return {
                id: snapshot.docs[0].id,
                ...data,
                // Serialize dates to plain strings/numbers to avoid "Only plain objects" error
                createdAt: data.createdAt?.toDate?.() ? data.createdAt.toDate().toISOString() : data.createdAt,
                updatedAt: data.updatedAt?.toDate?.() ? data.updatedAt.toDate().toISOString() : data.updatedAt,
            } as unknown as Product;
        }
    } catch (error) {
        console.warn("Firestore fetch failed, falling back to static data:", error);
    }

    // 2. Fallback to static data
    const { products } = await import('./products');
    const staticProduct = products.find(p => p.slug === slug);

    return staticProduct || null;
}

export async function getAllBlogPosts(): Promise<any[]> {
    const blogRef = collection(db, 'blog_articles');
    const snapshot = await getDocs(blogRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}
