'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import FadeIn from '@/components/ui/fade-in';

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="relative py-20 bg-muted/30">
                <div className="container mx-auto px-4 text-center">
                    <FadeIn>
                        <h1 className="font-headline text-5xl md:text-6xl mb-6">Get in Touch</h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            We'd love to hear from you. Whether you have a question about our products,
                            need help with an order, or just want to say hello.
                        </p>
                    </FadeIn>
                </div>
            </section>

            <div className="container mx-auto px-4 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Contact Form */}
                    <FadeIn delay={0.2}>
                        <Card>
                            <CardHeader>
                                <CardTitle>Send us a Message</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label htmlFor="name" className="text-sm font-medium">Name</label>
                                            <Input id="name" placeholder="Your name" />
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="email" className="text-sm font-medium">Email</label>
                                            <Input id="email" type="email" placeholder="your@email.com" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="subject" className="text-sm font-medium">Subject</label>
                                        <Input id="subject" placeholder="How can we help?" />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="message" className="text-sm font-medium">Message</label>
                                        <Textarea id="message" placeholder="Your message..." className="min-h-[150px]" />
                                    </div>
                                    <Button type="submit" className="w-full">Send Message</Button>
                                </form>
                            </CardContent>
                        </Card>
                    </FadeIn>

                    {/* Contact Info */}
                    <div className="space-y-8">
                        <FadeIn delay={0.3}>
                            <div className="grid gap-8">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 rounded-full bg-primary/10 text-primary">
                                        <MapPin className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg mb-1">Visit Us</h3>
                                        <p className="text-muted-foreground">
                                            123 Love Lane, Suite 100<br />
                                            New York, NY 10012
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="p-3 rounded-full bg-primary/10 text-primary">
                                        <Phone className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg mb-1">Call Us</h3>
                                        <p className="text-muted-foreground">
                                            +1 (555) 123-4567
                                        </p>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            Mon-Fri from 9am to 6pm EST
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="p-3 rounded-full bg-primary/10 text-primary">
                                        <Mail className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg mb-1">Email Us</h3>
                                        <p className="text-muted-foreground">
                                            hello@unitedloveluxe.com
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </FadeIn>

                        <FadeIn delay={0.4}>
                            <div className="w-full h-[300px] bg-muted rounded-lg overflow-hidden relative">
                                {/* Placeholder for Map */}
                                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                                    <span className="flex items-center gap-2">
                                        <MapPin className="h-5 w-5" />
                                        Map View Coming Soon
                                    </span>
                                </div>
                            </div>
                        </FadeIn>
                    </div>
                </div>
            </div>
        </div>
    );
}
