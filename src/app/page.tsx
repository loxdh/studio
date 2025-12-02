'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import ProductGrid from '@/components/products/ProductGrid';
import Aurora from '@/components/ui/aurora';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import type { Product } from '@/lib/products';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import { ArrowRight, Star, Heart, ShieldCheck } from 'lucide-react';
import FadeIn from '@/components/ui/fade-in';

import CategoryGrid from '@/components/home/CategoryGrid';
import Testimonials from '@/components/home/Testimonials';

export default function Home() {
  const firestore = useFirestore();
  const featuredQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'products'), limit(4));
  }, [firestore]);

  const { data: featuredProducts, isLoading } = useCollection<Product>(featuredQuery);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[80vh] w-full flex items-center justify-center text-foreground bg-background overflow-hidden">
        <Aurora
          colorStops={['#FFD700', '#DAA520', '#B8860B']}
          blend={0.5}
          amplitude={1.0}
          speed={0.5}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/50 to-background z-10" />

        <div className="relative z-20 container mx-auto px-4 flex flex-col items-center text-center space-y-8 animate-in fade-in zoom-in duration-1000">
          <h1 className="font-headline text-6xl md:text-8xl tracking-tight drop-shadow-sm">
            United by Love
          </h1>
          <p className="max-w-2xl text-xl md:text-2xl text-muted-foreground font-light">
            Crafting exquisite stationery for life's most cherished moments.
            Where elegance meets modern design.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Button asChild size="lg" className="text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all">
              <Link href="/products">Shop Collection</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6 rounded-full backdrop-blur-sm bg-background/50">
              <Link href="/blog">Read Our Journal</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Category Grid */}
      <CategoryGrid />

      {/* Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <FadeIn delay={0.1}>
            <div className="flex flex-col items-center space-y-4 p-6 rounded-xl bg-background shadow-sm h-full">
              <div className="p-3 rounded-full bg-primary/10 text-primary">
                <Star className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold">Premium Quality</h3>
              <p className="text-muted-foreground">Printed on the finest cardstock with luxurious finishes.</p>
            </div>
          </FadeIn>
          <FadeIn delay={0.2}>
            <div className="flex flex-col items-center space-y-4 p-6 rounded-xl bg-background shadow-sm h-full">
              <div className="p-3 rounded-full bg-primary/10 text-primary">
                <Heart className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold">Made with Love</h3>
              <p className="text-muted-foreground">Every design is crafted with passion and attention to detail.</p>
            </div>
          </FadeIn>
          <FadeIn delay={0.3}>
            <div className="flex flex-col items-center space-y-4 p-6 rounded-xl bg-background shadow-sm h-full">
              <div className="p-3 rounded-full bg-primary/10 text-primary">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold">Satisfaction Guaranteed</h3>
              <p className="text-muted-foreground">We ensure you are 100% happy with your stationery.</p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Featured Products */}
      <section id="featured-products" className="w-full py-24">
        <div className="container mx-auto px-4">
          <FadeIn>
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
              <div>
                <h2 className="font-headline text-4xl md:text-5xl mb-4">
                  Featured Collection
                </h2>
                <p className="text-muted-foreground max-w-lg">
                  Discover our most loved designs, perfect for setting the tone for your special day.
                </p>
              </div>
              <Button asChild variant="ghost" className="group">
                <Link href="/products" className="flex items-center gap-2">
                  View All <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </FadeIn>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-96 bg-muted animate-pulse rounded-lg" />
              ))}
            </div>
          ) : (
            <FadeIn delay={0.2}>
              <ProductGrid products={featuredProducts || []} />
            </FadeIn>
          )}
        </div>
      </section>

      {/* Testimonials */}
      <Testimonials />

      {/* CTA Section */}
      <section className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519225421980-715cb0202128?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay" />
        <div className="container mx-auto px-4 relative z-10 text-center space-y-8">
          <h2 className="font-headline text-4xl md:text-6xl">Ready to Create Something Beautiful?</h2>
          <p className="text-xl max-w-2xl mx-auto opacity-90">
            Let us help you tell your love story through paper. Start your journey with us today.
          </p>
          <Button asChild size="lg" variant="secondary" className="text-lg px-8 py-6 rounded-full">
            <Link href="/products">Start Shopping</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
