'use client';

import FadeIn from '@/components/ui/fade-in';
import Image from 'next/image';

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="relative py-24 overflow-hidden">
                <div className="absolute inset-0 bg-muted/30 -z-10" />
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <FadeIn>
                            <h1 className="font-headline text-5xl md:text-7xl mb-6">
                                Crafting Love Stories on Paper
                            </h1>
                            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                                At United Love Luxe, we believe that every love story deserves a beautiful beginning.
                                Our passion is creating exquisite stationery that sets the perfect tone for your special day.
                            </p>
                        </FadeIn>
                        <FadeIn delay={0.2} direction="left">
                            <div className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl">
                                <Image
                                    src="https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=2000&auto=format&fit=crop"
                                    alt="Wedding Stationery Flatlay"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </FadeIn>
                    </div>
                </div>
            </section>

            {/* Our Story */}
            <section className="py-24">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center space-y-8">
                        <FadeIn>
                            <h2 className="font-headline text-4xl mb-6">Our Story</h2>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                Founded in 2023, United Love Luxe began with a simple idea: that wedding invitations should be more than just dates and times.
                                They should be keepsakes, tangible memories of the moment you decided to share your forever with someone.
                            </p>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                What started as a small studio in New York has grown into a beloved brand for couples worldwide who value
                                quality, elegance, and modern design. We combine traditional printing techniques with contemporary aesthetics
                                to create pieces that are both timeless and fresh.
                            </p>
                        </FadeIn>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="py-24 bg-primary text-primary-foreground">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                        <FadeIn delay={0.1}>
                            <h3 className="font-headline text-2xl mb-4">Quality First</h3>
                            <p className="opacity-90">We source only the finest papers and materials from around the world.</p>
                        </FadeIn>
                        <FadeIn delay={0.2}>
                            <h3 className="font-headline text-2xl mb-4">Personal Touch</h3>
                            <p className="opacity-90">Every order is handled with care, from design to packaging.</p>
                        </FadeIn>
                        <FadeIn delay={0.3}>
                            <h3 className="font-headline text-2xl mb-4">Sustainability</h3>
                            <p className="opacity-90">We are committed to eco-friendly practices and responsible sourcing.</p>
                        </FadeIn>
                    </div>
                </div>
            </section>
        </div>
    );
}
