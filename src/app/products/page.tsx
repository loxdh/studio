'use client';

import { useState } from 'react';
import ProductGrid from '@/components/products/ProductGrid';
import { Button } from '@/components/ui/button';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import type { Product } from '@/lib/products';

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const firestore = useFirestore();
  const productsCollection = useMemoFirebase(() => collection(firestore, 'products'), [firestore]);
  const { data: products, isLoading } = useCollection<Product>(productsCollection);

  const categories = products ? [...new Set(products.map((p) => p.category))] : [];

  const filteredProducts = selectedCategory
    ? products?.filter((p) => p.category === selectedCategory)
    : products;

  if (isLoading) {
    return <p className="text-center py-16">Loading products...</p>
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <header className="text-center mb-12">
        <h1 className="font-headline text-5xl">Our Collection</h1>
        <p className="mt-2 text-lg text-muted-foreground">Discover the perfect stationery for your special occasion.</p>
      </header>

      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-64">
          <h2 className="font-headline text-2xl mb-4">Categories</h2>
          <div className="flex flex-col items-start gap-2">
            <Button 
              variant={!selectedCategory ? 'secondary' : 'ghost'} 
              className="w-full justify-start"
              onClick={() => setSelectedCategory(null)}
            >
              All Products
            </Button>
            {categories.map(category => (
              <Button 
                key={category}
                variant={selectedCategory === category ? 'secondary' : 'ghost'} 
                className="w-full justify-start"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </aside>

        <main className="flex-1">
          <ProductGrid products={filteredProducts || []} />
        </main>
      </div>
    </div>
  );
}
