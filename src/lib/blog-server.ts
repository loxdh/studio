import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, query, where, getDocs, limit } from 'firebase/firestore';
import { firebaseConfig } from '@/firebase/config';

// Initialize Firebase for Server Side
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

export type BlogPost = {
    id: string;
    title: string;
    slug: string;
    content: string;
    createdAt: any;
    published: boolean;
    seo?: {
        title?: string;
        description?: string;
        keywords?: string[];
    };
    featuredImage?: string;
};

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
    try {
        const q = query(
            collection(db, 'blog_posts'),
            where('slug', '==', slug),
            limit(1)
        );

        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            return null;
        }

        const doc = querySnapshot.docs[0];
        const data = doc.data();

        // Safety checks for required fields
        if (!data.title || !data.content) {
            console.error('Blog post missing title or content:', doc.id);
            return null;
        }

        return {
            id: doc.id,
            ...data,
            // Serializable dates for Next.js server components
            createdAt: data.createdAt?.seconds ? { seconds: data.createdAt.seconds, nanoseconds: data.createdAt.nanoseconds || 0 } : null,
        } as BlogPost;
    } catch (error) {
        console.error('Error fetching blog post:', error);
        return null;
    }
}
