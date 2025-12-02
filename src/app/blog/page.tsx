'use client';

import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, where } from 'firebase/firestore';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { format } from 'date-fns';
import FadeIn from '@/components/ui/fade-in';

type BlogPost = {
  id: string;
  title: string;
  slug: string;
  content: string;
  createdAt: any;
  published: boolean;
};

export default function BlogPage() {
  const firestore = useFirestore();
  const postsQuery = useMemoFirebase(
    () => query(collection(firestore, 'posts'), where('published', '==', true), orderBy('createdAt', 'desc')),
    [firestore]
  );

  const { data: posts, isLoading } = useCollection<BlogPost>(postsQuery);

  return (
    <div className="container mx-auto px-4 py-16">
      <header className="text-center mb-12">
        <h1 className="font-headline text-5xl">Our Blog</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Insights and inspiration for your special day.
        </p>
      </header>

      {isLoading ? (
        <div className="text-center">Loading posts...</div>
      ) : posts && posts.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, index) => (
            <FadeIn key={post.id} delay={index * 0.1}>
              <Link href={`/blog/${post.slug}`}>
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <CardTitle className="font-headline text-2xl">{post.title}</CardTitle>
                    <CardDescription>
                      {post.createdAt?.seconds ? format(new Date(post.createdAt.seconds * 1000), 'MMMM d, yyyy') : 'Recently'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="line-clamp-3 text-muted-foreground" dangerouslySetInnerHTML={{ __html: post.content.substring(0, 200) + '...' }} />
                  </CardContent>
                </Card>
              </Link>
            </FadeIn>
          ))}
        </div>
      ) : (
        <div className="flex justify-center">
          <p>No blog posts found. Check back soon!</p>
        </div>
      )}
    </div>
  );
}
