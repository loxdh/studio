'use client';

import FadeIn from '@/components/ui/fade-in';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, Heart, Star, PenTool } from 'lucide-react';

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="relative py-32 overflow-hidden">
                <div className="absolute inset-0 bg-muted/20 -z-10" />
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center space-y-8">
                        <FadeIn>
                            <span className="text-sm font-medium tracking-widest text-primary uppercase mb-4 block">
                                Est. 2023
                            </span>
                            <h1 className="font-headline text-5xl md:text-7xl mb-6 leading-tight">
                                Where Love Meets <br />
                                <span className="italic text-muted-foreground">Timeless Design</span>
                            </h1>
                            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                                United Love Luxe is a boutique stationery studio dedicated to telling your unique love story through exquisite paper goods.
                            </p>
                        </FadeIn>
                    </div>
                </div>
            </section>

            {/* The Artist Section */}
            <section className="py-24">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <FadeIn direction="right">
                            <div className="relative aspect-[3/4] rounded-sm overflow-hidden shadow-xl max-w-md mx-auto lg:mx-0">
                                <Image
                                    src="https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=2071&auto=format&fit=crop"
                                    alt="The Artist"
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 border-[1px] border-white/20 m-4 rounded-sm" />
                            </div>
                        </FadeIn>
                        <FadeIn delay={0.2} direction="left">
                            <div className="space-y-6">
                                <h2 className="font-headline text-4xl mb-2">Meet the Artist</h2>
                                <h3 className="text-xl font-medium text-primary">Sarah Jenkins, Founder & Creative Director</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    "I believe that your wedding invitations are the very first glimpse your guests will have of your special day. They set the tone, build anticipation, and become cherished keepsakes long after the cake has been eaten."
                                </p>
                                <p className="text-muted-foreground leading-relaxed">
                                    With a background in fine arts and a passion for typography, Sarah founded United Love Luxe to bridge the gap between traditional etiquette and modern aesthetics. Her designs are characterized by clean lines, luxurious textures, and a romantic, airy feel.
                                </p>
                                <div className="pt-4">
                                    <Image
                                        src="/signature.png"
                                        alt="Signature"
                                        width={150}
                                        height={60}
                                        className="opacity-60"
                                        style={{ filter: 'invert(1)' }} // Invert if dark mode, handle via CSS ideally
                                    />
                                    {/* Fallback if no signature image */}
                                    <p className="font-handwriting text-3xl text-primary mt-2">Sarah J.</p>
                                </div>
                            </div>
                        </FadeIn>
                    </div>
                </div>
            </section>

            {/* Philosophy / Values */}
            <section className="py-24 bg-muted/30">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <FadeIn>
                            <h2 className="font-headline text-4xl mb-4">Our Philosophy</h2>
                            <p className="text-muted-foreground">
                                We don't just print invitations; we curate experiences. Every detail is intentionally chosen to reflect your style and vision.
                            </p>
                        </FadeIn>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <FadeIn delay={0.1}>
                            <div className="text-center space-y-4 p-6 rounded-lg hover:bg-background transition-colors duration-300">
                                <div className="w-12 h-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center text-primary">
                                    <PenTool className="h-6 w-6" />
                                </div>
                                <h3 className="font-headline text-2xl">Bespoke Design</h3>
                                <p className="text-muted-foreground text-sm leading-relaxed">
                                    From custom monograms to hand-drawn venue illustrations, we create elements that are uniquely yours.
                                </p>
                            </div>
                        </FadeIn>
                        <FadeIn delay={0.2}>
                            <div className="text-center space-y-4 p-6 rounded-lg hover:bg-background transition-colors duration-300">
                                <div className="w-12 h-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center text-primary">
                                    <Star className="h-6 w-6" />
                                </div>
                                <h3 className="font-headline text-2xl">Luxury Materials</h3>
                                <p className="text-muted-foreground text-sm leading-relaxed">
                                    We work with the finest cotton papers, rich velvets, and translucent vellums to ensure a premium tactile experience.
                                </p>
                            </div>
                        </FadeIn>
                        <FadeIn delay={0.3}>
                            <div className="text-center space-y-4 p-6 rounded-lg hover:bg-background transition-colors duration-300">
                                <div className="w-12 h-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center text-primary">
                                    <Heart className="h-6 w-6" />
                                </div>
                                <h3 className="font-headline text-2xl">Personal Service</h3>
                                <p className="text-muted-foreground text-sm leading-relaxed">
                                    We guide you through every step of the process, from wording etiquette to assembly and mailing.
                                </p>
                            </div>
                        </FadeIn>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-32 relative overflow-hidden">
                <div className="absolute inset-0">
                    <Image
                        src="https://images.unsplash.com/photo-1529636798458-92182e662485?q=80&w=2069&auto=format&fit=crop"
                        alt="Background"
                        fill
                        className="object-cover opacity-10"
                    />
                </div>
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <FadeIn>
                        <h2 className="font-headline text-4xl md:text-5xl mb-8">Ready to start your journey?</h2>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button size="lg" asChild className="rounded-full px-8">
                                <Link href="/products">Shop Collection</Link>
                            </Button>
                            <Button size="lg" variant="outline" asChild className="rounded-full px-8 bg-background/50 backdrop-blur-sm">
                                <Link href="/custom-design">Inquire Custom</Link>
                            </Button>
                        </div>
                    </FadeIn>
                </div>
            </section>
        </div>
    );
}
