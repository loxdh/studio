'use client';

import Link from 'next/link';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import FadeIn from '@/components/ui/fade-in';

const categories = [
    {
        title: 'Wedding Invitations',
        href: '/products?category=Wedding Invitations',
        imageId: 'prod-1',
        description: 'Timeless suites for your special day'
    },
    {
        title: 'Save the Dates',
        href: '/products?category=Save the Dates',
        imageId: 'prod-8',
        description: 'Announce your date in style'
    },
    {
        title: 'Custom Design',
        href: '/products?category=Custom Services',
        imageId: 'prod-6',
        description: 'Bespoke creations just for you'
    },
    {
        title: 'Day-Of Details',
        href: '/products?category=Inserts & Add-Ons',
        imageId: 'prod-4',
        description: 'Menus, place cards, and more'
    }
];

export default function CategoryGrid() {
    return (
        <section className="py-24 bg-background">
            <div className="container mx-auto px-4">
                <FadeIn>
                    <div className="text-center mb-16">
                        <h2 className="font-headline text-4xl md:text-5xl mb-4">Shop by Category</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Explore our curated collections designed to guide you through every step of your wedding journey.
                        </p>
                    </div>
                </FadeIn>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {categories.map((category, index) => {
                        const image = PlaceHolderImages.find(img => img.id === category.imageId);
                        return (
                            <FadeIn key={category.title} delay={index * 0.1}>
                                <Link href={category.href} className="group block relative overflow-hidden rounded-lg aspect-[3/4]">
                                    <div className="absolute inset-0">
                                        {image && (
                                            <Image
                                                src={image.imageUrl}
                                                alt={category.title}
                                                fill
                                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                            />
                                        )}
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />
                                    </div>

                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6 text-center">
                                        <h3 className="font-headline text-3xl mb-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                            {category.title}
                                        </h3>
                                        <p className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-75 text-sm font-light tracking-wide">
                                            {category.description}
                                        </p>
                                    </div>
                                </Link>
                            </FadeIn>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
