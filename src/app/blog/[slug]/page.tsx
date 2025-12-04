import { getBlogPostBySlug } from '@/lib/blog-server';
import BlogPostClient from '@/components/blog/BlogPostClient';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

type Props = {
    params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const post = await getBlogPostBySlug(slug);

    if (!post) {
        return {
            title: 'Post Not Found',
        };
    }

    return {
        title: post.seo?.title || post.title,
        description: post.seo?.description || post.content.substring(0, 160),
        keywords: post.seo?.keywords || [],
        openGraph: {
            title: post.seo?.title || post.title,
            description: post.seo?.description || post.content.substring(0, 160),
            type: 'article',
            publishedTime: post.createdAt ? new Date(post.createdAt.seconds * 1000).toISOString() : undefined,
            images: post.featuredImage ? [{ url: post.featuredImage }] : [],
        },
    };
}

export default async function BlogPostPage({ params }: Props) {
    const { slug } = await params;
    const post = await getBlogPostBySlug(slug);

    if (!post) {
        notFound();
    }

    return <BlogPostClient post={post} />;
}
