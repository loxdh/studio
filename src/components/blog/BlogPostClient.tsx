'use client';

import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import type { BlogPost } from '@/lib/blog-server';
import Image from 'next/image';

export default function BlogPostClient({ post }: { post: BlogPost }) {
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
                    <div className="text-muted-foreground mb-6">
                        {post.createdAt?.seconds ? format(new Date(post.createdAt.seconds * 1000), 'MMMM d, yyyy') : 'Recently'}
                    </div>
                    {post.featuredImage && (
                        <div className="relative aspect-video w-full overflow-hidden rounded-xl mb-8">
                            <Image
                                src={post.featuredImage}
                                alt={post.title}
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                    )}
                </header>

                <div
                    className="prose prose-lg dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                />
            </article>
        </div>
    );
}
