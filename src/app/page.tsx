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
      <section className="relative min-h-screen w-full flex items-center justify-center text-foreground bg-background overflow-hidden pt-16">
        <Aurora
          colorStops={['#FFD700', '#DAA520', '#B8860B']}
          blend={0.5}
          amplitude={1.0}
          speed={0.5}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/10 via-background/30 to-background z-10" />

        <div className="relative z-20 container mx-auto px-4 flex flex-col items-center text-center space-y-8 animate-in fade-in zoom-in duration-1000">
          <div className="inline-block px-3 py-1 mb-4 text-xs font-medium tracking-widest text-primary uppercase border border-primary/20 rounded-full bg-primary/5 backdrop-blur-sm">
            Est. 2024
          </div>
          <h1 className="font-headline text-6xl md:text-8xl lg:text-9xl tracking-tight drop-shadow-sm">
            United by Love
          </h1>
          <p className="max-w-2xl text-xl md:text-2xl text-muted-foreground font-light leading-relaxed">
            Crafting exquisite stationery for life's most cherished moments.
            <br />Where elegance meets modern design.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 mt-8">
            <Button asChild size="lg" className="text-lg px-10 py-7 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <Link href="/products">Shop Collection</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-10 py-7 rounded-full backdrop-blur-md bg-background/30 border-primary/20 hover:bg-background/50 transition-all duration-300">
              <Link href="/custom-order">Custom Order</Link>
            </Button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-muted-foreground/50">
          <ArrowRight className="h-6 w-6 rotate-90" />
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-headline text-4xl md:text-5xl mb-4">How It Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">From your first click to the final seal, we make creating your dream stationery effortless.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

            {[
              { step: '01', title: 'Choose Your Style', desc: 'Browse our curated collections or start a custom order from scratch.' },
              { step: '02', title: 'Customize Details', desc: 'Select your colors, paper types, and add personal touches with our design tool.' },
              { step: '03', title: 'We Create & Ship', desc: 'Our artisans craft your order with care and ship it directly to your door.' }
            ].map((item, i) => (
              <FadeIn key={i} delay={i * 0.2}>
                <div className="relative flex flex-col items-center text-center space-y-4 bg-background p-6">
                  <div className="w-24 h-24 rounded-full bg-secondary/30 flex items-center justify-center text-3xl font-serif text-primary mb-4 shadow-inner border border-primary/10 z-10">
                    {item.step}
                  </div>
                  <h3 className="text-2xl font-headline">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Category Grid */}
      <CategoryGrid />

      {/* Features Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FadeIn delay={0.1}>
              <div className="group p-8 rounded-2xl bg-background border border-border/50 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                <div className="mb-6 p-4 rounded-full bg-primary/5 w-fit group-hover:bg-primary/10 transition-colors">
                  <Star className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-headline mb-3">Premium Quality</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We source only the finest cardstocks and materials from around the globe, ensuring every piece feels as luxurious as it looks.
                </p>
              </div>
            </FadeIn>
            <FadeIn delay={0.2}>
              <div className="group p-8 rounded-2xl bg-background border border-border/50 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                <div className="mb-6 p-4 rounded-full bg-primary/5 w-fit group-hover:bg-primary/10 transition-colors">
                  <Heart className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-headline mb-3">Made with Love</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Every design is crafted with passion. We treat your wedding stationery with the same care we would our own.
                </p>
              </div>
            </FadeIn>
            <FadeIn delay={0.3}>
              <div className="group p-8 rounded-2xl bg-background border border-border/50 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                <div className="mb-6 p-4 rounded-full bg-primary/5 w-fit group-hover:bg-primary/10 transition-colors">
                  <ShieldCheck className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-headline mb-3">Satisfaction Guaranteed</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We stand behind our work. If you're not absolutely thrilled with your order, we'll work with you to make it right.
                </p>
              </div>
            </FadeIn>
          </div>
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
