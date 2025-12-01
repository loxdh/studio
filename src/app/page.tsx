'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import ProductGrid from '@/components/products/ProductGrid';
import Aurora from '@/components/ui/aurora';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import type { Product } from '@/lib/products';
import { collection } from 'firebase/firestore';

export default function Home() {
    const firestore = useFirestore();
    const productsCollection = useMemoFirebase(() => collection(firestore, 'products'), [firestore]);
    const { data: products, isLoading } = useCollection<Product>(productsCollection);

  const featuredProducts = products ? products.slice(0, 4) : [];

  return (
    <div className="flex flex-col">
       <section className="relative h-[60vh] w-full flex items-center justify-center text-foreground bg-background">
        <Aurora
          colorStops={['#FFD700', '#DAA520', '#B8860B']}
          blend={0.5}
          amplitude={1.0}
          speed={0.5}
        />
        <div className="absolute inset-0 bg-background/40 z-10" />
        <div className="relative z-20 flex h-full flex-col items-center justify-center text-center">
          <h1 className="font-headline text-5xl md:text-7xl">
            United by Love Invitations
          </h1>
          <p className="mt-4 max-w-2xl text-lg md:text-xl">
            Exquisite stationery for life's most cherished moments.
          </p>
          <Button asChild size="lg" className="mt-8">
            <Link href="#featured-products">Shop the Collection</Link>
          </Button>
        </div>
      </section>

      <section id="featured-products" className="w-full py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center font-headline text-4xl">
            Featured Products
          </h2>
          {isLoading ? <p>Loading...</p> : <ProductGrid products={featuredProducts} />}
           <div className="mt-12 text-center">
            <Button asChild variant="outline" size="lg">
                <Link href="/products">View All Products</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
