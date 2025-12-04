
'use client';

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useCollection, useFirestore, useMemoFirebase, deleteDocumentNonBlocking } from '@/firebase';
import type { BlogPost } from '@/lib/blog'; // Assuming you have a type for blog posts
import { collection, doc, query, orderBy } from 'firebase/firestore';
import { Button } from '../ui/button';
import Link from 'next/link';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

export default function BlogManager() {
  const firestore = useFirestore();
  const postsCollection = useMemoFirebase(
    () => collection(firestore, 'blog_posts'),
    [firestore]
  );
  const postsQuery = useMemoFirebase(
    () => (postsCollection ? query(postsCollection, orderBy('createdAt', 'desc')) : null),
    [postsCollection]
  );
  const { data: posts, isLoading } = useCollection<BlogPost>(postsQuery);

  if (isLoading) {
    return <div>Loading posts...</div>;
  }

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button asChild>
          <Link href="/admin/blog/add">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Post
          </Link>
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden md:table-cell">Created At</TableHead>
            <TableHead>
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts?.map((post) => (
            <TableRow key={post.id}>
              <TableCell className="font-medium">{post.title}</TableCell>
              <TableCell>
                <Badge variant={post.published ? 'default' : 'outline'}>
                  {post.published ? 'Published' : 'Draft'}
                </Badge>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {post.createdAt ? format(post.createdAt.toDate(), 'PPP') : ''}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={`/admin/blog/edit/${post.id}`}>
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive/90"
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this post?')) {
                        if (firestore) {
                          deleteDocumentNonBlocking(doc(firestore, 'blog_posts', post.id));
                        }
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
