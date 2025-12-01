import BlogManager from '@/components/admin/BlogManager';

export default function AdminBlogPage() {
  return (
    <div>
      <h1 className="font-headline text-4xl mb-8">AI Blog Content Generator</h1>
      <p className='text-muted-foreground mb-8 max-w-2xl'>
        Leverage the power of Google's Gemini AI to generate sophisticated, editorial-style blog posts. Simply provide a title, and our AI will craft an article for you, complete with HTML formatting.
      </p>
      <BlogManager />
    </div>
  );
}
