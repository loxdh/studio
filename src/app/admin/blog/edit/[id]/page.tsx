'use client';

import { useParams } from 'next/navigation';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { BlogPostForm } from '@/components/admin/BlogPostForm';
import { Loader2 } from 'lucide-react';

export default function EditBlogPostPage() {
    const params = useParams();
    const id = params.id as string;
    const firestore = useFirestore();

    const docRef = useMemoFirebase(() => {
        if (!firestore || !id) return null;
        return doc(firestore, 'blog_posts', id);
    }, [firestore, id]);

    const { data: post, isLoading } = useDoc(docRef);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (!post) {
        return <div>Post not found</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Edit Blog Post</h1>
            </div>
            <BlogPostForm post={{ id, ...post }} />
        </div>
    );
}
