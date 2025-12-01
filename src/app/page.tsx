import Link from 'next/link';
import { Button } from '@/components/ui/button';
import ProductGrid from '@/components/products/ProductGrid';
import { products } from '@/lib/products';
import Aurora from '@/components/ui/aurora';

export default function Home() {
  const featuredProducts = products.slice(0, 4);

  return (
    <div className="flex flex-col">
      <section className="relative h-[60vh] w-full flex items-center justify-center text-white bg-black">
        <Aurora
          colorStops={["#3A29FF", "#FF94B4", "#FF3232"]}
          blend={0.5}
          amplitude={1.0}
          speed={0.5}
        />
        <div className="absolute inset-0 bg-black/40 z-10" />
        <div className="relative z-20 flex h-full flex-col items-center justify-center text-center">
          <h1 className="font-headline text-5xl md:text-7xl">
            United by Love Invitations
          </h1>
          <p className="mt-4 max-w-2xl text-lg md:text-xl">
            Exquisite stationery for life's most cherished moments.
          </p>
          <Button asChild size="lg" className="mt-8 bg-primary text-primary-foreground hover:bg-primary/90">
            <Link href="#featured-products">Shop the Collection</Link>
          </Button>
        </div>
      </section>

      <section id="featured-products" className="w-full py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center font-headline text-4xl">
            Featured Products
          </h2>
          <ProductGrid products={featuredProducts} />
           <div className="mt-12 text-center">
            <Button asChild variant="outline" size="lg" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                <Link href="/products">View All Products</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
