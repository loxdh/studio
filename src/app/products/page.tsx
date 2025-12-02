'use client';

import { useState, useEffect, Suspense } from 'react';
import ProductGrid from '@/components/products/ProductGrid';
import { Button } from '@/components/ui/button';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import type { Product } from '@/lib/products';
import { useSearchParams, useRouter } from 'next/navigation';

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const categoryParam = searchParams.get('category');
  const searchParam = searchParams.get('search');

  const [selectedCategory, setSelectedCategory] = useState<string | null>(categoryParam);

  // Sync state with URL param
  useEffect(() => {
    setSelectedCategory(categoryParam);
  }, [categoryParam]);

  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category);
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (searchParam) params.set('search', searchParam); // Keep search if exists

    // If clearing category but keeping search
    if (!category && searchParam) {
      router.push(`/products?search=${encodeURIComponent(searchParam)}`);
    } else if (params.toString()) {
      router.push(`/products?${params.toString()}`);
    } else {
      router.push('/products');
    }
  };

  const firestore = useFirestore();
  const productsCollection = useMemoFirebase(() => collection(firestore, 'products'), [firestore]);
  const { data: products, isLoading } = useCollection<Product>(productsCollection);

  const categories = products ? [...new Set(products.map((p) => p.category))] : [];

  const filteredProducts = products?.filter((p) => {
    const matchesCategory = selectedCategory ? p.category === selectedCategory : true;
    const matchesSearch = searchParam
      ? p.name.toLowerCase().includes(searchParam.toLowerCase()) || p.description.toLowerCase().includes(searchParam.toLowerCase())
      : true;
    return matchesCategory && matchesSearch;
  });

  if (isLoading) {
    return <p className="text-center py-16">Loading products...</p>
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <header className="text-center mb-12">
        <h1 className="font-headline text-5xl">Our Collection</h1>
        <p className="mt-2 text-lg text-muted-foreground">Discover the perfect stationery for your special occasion.</p>
        {searchParam && (
          <p className="mt-4 text-sm text-muted-foreground">
            Showing results for "{searchParam}"
            <Button variant="link" onClick={() => router.push('/products')} className="pl-2">Clear Search</Button>
          </p>
        )}
      </header>

      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-64">
          <h2 className="font-headline text-2xl mb-4">Categories</h2>
          <div className="flex flex-col items-start gap-2">
            <Button
              variant={!selectedCategory ? 'secondary' : 'ghost'}
              className="w-full justify-start"
              onClick={() => handleCategoryChange(null)}
            >
              All Products
            </Button>
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'secondary' : 'ghost'}
                className="w-full justify-start"
                onClick={() => handleCategoryChange(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </aside>

        <main className="flex-1">
          <ProductGrid products={filteredProducts || []} />
          {filteredProducts?.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              No products found matching your criteria.
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<p className="text-center py-16">Loading...</p>}>
      <ProductsContent />
    </Suspense>
  )
}
