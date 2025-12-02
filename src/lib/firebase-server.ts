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
    const productsRef = collection(db, 'products');
    const q = query(productsRef, where('slug', '==', slug), limit(1));
    const snapshot = await getDocs(q);

    if (snapshot.empty) return null;
    return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Product;
}

export async function getAllBlogPosts(): Promise<any[]> {
    const blogRef = collection(db, 'blog_articles');
    const snapshot = await getDocs(blogRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}
