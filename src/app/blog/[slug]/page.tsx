'use client';

import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where, limit } from 'firebase/firestore';
import { useParams } from 'next/navigation';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

type BlogPost = {
    id: string;
    title: string;
    slug: string;
    content: string;
    createdAt: any;
    published: boolean;
};

export default function BlogPostPage() {
    const params = useParams();
    const slug = params.slug as string;
    const firestore = useFirestore();

    const postQuery = useMemoFirebase(
        () => query(collection(firestore, 'posts'), where('slug', '==', slug), limit(1)),
        [firestore, slug]
    );

    const { data: posts, isLoading } = useCollection<BlogPost>(postQuery);
    const post = posts?.[0];

    if (isLoading) {
        return <div className="container mx-auto px-4 py-16 text-center">Loading post...</div>;
    }

    if (!post) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <h1 className="text-2xl font-bold mb-4">Post Not Found</h1>
                <Button asChild>
                    <Link href="/blog">Back to Blog</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-16 max-w-3xl">
            <Button asChild variant="ghost" className="mb-8 pl-0 hover:bg-transparent hover:text-primary">
                <Link href="/blog" className="flex items-center gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Blog
                </Link>
            </Button>

            <article>
                <header className="mb-8">
                    <h1 className="font-headline text-4xl md:text-5xl mb-4">{post.title}</h1>
                    <div className="text-muted-foreground">
                        {post.createdAt?.seconds ? format(new Date(post.createdAt.seconds * 1000), 'MMMM d, yyyy') : 'Recently'}
                    </div>
                </header>

                <div
                    className="prose prose-lg dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                />
            </article>
        </div>
    );
}
