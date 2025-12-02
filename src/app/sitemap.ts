import { MetadataRoute } from 'next';
import { getAllProducts, getAllBlogPosts } from '@/lib/firebase-server';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://unitedloveluxe.com'; // Replace with actual domain

    // Static routes
    const routes = [
        '',
        '/products',
        '/about',
        '/contact',
        '/blog',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    // Dynamic Product routes
    const products = await getAllProducts();
    const productRoutes = products.map((product) => ({
        url: `${baseUrl}/products/${product.slug}`,
        lastModified: new Date(), // Ideally use product.updatedAt
        changeFrequency: 'weekly' as const,
        priority: 0.9,
    }));

    // Dynamic Blog routes
    const posts = await getAllBlogPosts();
    const blogRoutes = posts.map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: post.createdAt ? new Date(post.createdAt.seconds * 1000) : new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
    }));

    return [...routes, ...productRoutes, ...blogRoutes];
}
