import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    const baseUrl = 'https://unitedloveluxe.com'; // Replace with actual domain

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/admin/', '/account/', '/checkout/'],
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
