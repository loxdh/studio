'use client';

import { Star } from 'lucide-react';
import FadeIn from '@/components/ui/fade-in';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";

const testimonials = [
    {
        id: 1,
        name: "Sarah & James",
        text: "The invitations were absolutely stunning. We received so many compliments from our guests. The quality of the paper and the print was beyond our expectations.",
        location: "New York, NY"
    },
    {
        id: 2,
        name: "Emily R.",
        text: "Working with United Love Luxe was a dream. They understood my vision perfectly and created a custom design that felt so 'us'. Highly recommend!",
        location: "Los Angeles, CA"
    },
    {
        id: 3,
        name: "Michael & David",
        text: "From the save the dates to the thank you cards, everything was cohesive and beautiful. The team was responsive and helpful throughout the entire process.",
        location: "Chicago, IL"
    },
    {
        id: 4,
        name: "Jessica T.",
        text: "I was hesitant to order online, but the sample pack convinced me. The textures and colors are even better in person. Truly luxury stationery.",
        location: "London, UK"
    }
];

export default function Testimonials() {
    return (
        <section className="py-24 bg-muted/30">
            <div className="container mx-auto px-4">
                <FadeIn>
                    <div className="text-center mb-16">
                        <h2 className="font-headline text-4xl md:text-5xl mb-4">Love Notes</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Kind words from our cherished couples.
                        </p>
                    </div>
                </FadeIn>

                <div className="max-w-4xl mx-auto">
                    <Carousel
                        opts={{
                            align: "start",
                            loop: true,
                        }}
                        className="w-full"
                    >
                        <CarouselContent>
                            {testimonials.map((testimonial) => (
                                <CarouselItem key={testimonial.id} className="md:basis-1/2 lg:basis-1/2 pl-6">
                                    <div className="bg-background p-8 rounded-xl shadow-sm h-full flex flex-col">
                                        <div className="flex gap-1 mb-4 text-primary">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <Star key={star} className="h-4 w-4 fill-current" />
                                            ))}
                                        </div>
                                        <blockquote className="text-lg italic mb-6 flex-grow text-muted-foreground">
                                            "{testimonial.text}"
                                        </blockquote>
                                        <div className="mt-auto">
                                            <p className="font-semibold font-headline text-xl">{testimonial.name}</p>
                                            <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                                        </div>
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious className="hidden md:flex -left-12" />
                        <CarouselNext className="hidden md:flex -right-12" />
                    </Carousel>
                </div>
            </div>
        </section>
    );
}
