'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { generateBlogContent } from '@/ai/flows/generate-blog-content';
import { Skeleton } from '../ui/skeleton';

const formSchema = z.object({
  title: z.string().min(10, 'Title must be at least 10 characters long.'),
});

export default function BlogManager() {
  const [generatedContent, setGeneratedContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setGeneratedContent('');
    try {
      const result = await generateBlogContent({ title: values.title });
      setGeneratedContent(result.content);
    } catch (error) {
      console.error('Error generating content:', error);
      setGeneratedContent('<p class="text-destructive">Failed to generate content. Please try again.</p>');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <Card>
        <CardHeader>
            <CardTitle>Generate New Post</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Blog Post Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., The Art of the Perfect Wedding Invitation"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Generating...' : 'Generate Content'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
            <CardTitle>Generated Content</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="prose prose-sm dark:prose-invert max-w-none bg-muted/30 p-4 rounded-md min-h-[200px]">
                {isLoading ? (
                    <div className='space-y-2'>
                        <Skeleton className="h-4 w-4/5" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                    </div>
                ) : generatedContent ? (
                    <div dangerouslySetInnerHTML={{ __html: generatedContent }} />
                ) : (
                    <p className='text-muted-foreground'>Your generated blog post will appear here.</p>
                )}
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
