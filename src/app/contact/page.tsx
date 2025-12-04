'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { MapPin, Phone, Mail, Clock, Send, Calendar, Users } from 'lucide-react';
import FadeIn from '@/components/ui/fade-in';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from '@/components/ui/label';
import Image from 'next/image';

export default function ContactPage() {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        toast({
            title: "Message Sent",
            description: "Thank you for reaching out! We'll get back to you within 24-48 hours.",
        });

        setIsSubmitting(false);
        // Ideally reset form here
        (e.target as HTMLFormElement).reset();
    };

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
                        <Card className="border-none shadow-lg">
                            <CardHeader>
                                <CardTitle className="text-2xl font-headline">Send us a Message</CardTitle>
                                <CardDescription>
                                    Fill out the form below and we'll be in touch shortly.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Name</Label>
                                            <Input id="name" placeholder="Your name" required />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email</Label>
                                            <Input id="email" type="email" placeholder="your@email.com" required />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="date">Event Date (Optional)</Label>
                                            <div className="relative">
                                                <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                                <Input id="date" type="date" className="pl-9" />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="guests">Guest Count (Optional)</Label>
                                            <div className="relative">
                                                <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                                <Input id="guests" type="number" placeholder="e.g. 150" className="pl-9" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="inquiry-type">Inquiry Type</Label>
                                        <Select>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a topic" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="general">General Inquiry</SelectItem>
                                                <SelectItem value="order">Order Support</SelectItem>
                                                <SelectItem value="custom">Custom Order Request</SelectItem>
                                                <SelectItem value="wholesale">Wholesale</SelectItem>
                                                <SelectItem value="press">Press & Collabs</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="message">Message</Label>
                                        <Textarea id="message" placeholder="Tell us more about your vision..." className="min-h-[150px]" required />
                                    </div>
                                    <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                                        {isSubmitting ? (
                                            "Sending..."
                                        ) : (
                                            <span className="flex items-center gap-2">
                                                Send Message <Send className="h-4 w-4" />
                                            </span>
                                        )}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </FadeIn>

                    {/* Contact Info */}
                    <div className="space-y-8">
                        <FadeIn delay={0.3}>
                            <div className="grid gap-8">
                                <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-muted/50 transition-colors">
                                    <div className="p-3 rounded-full bg-primary/10 text-primary shrink-0">
                                        <MapPin className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-headline text-xl mb-1">Visit Our Studio</h3>
                                        <p className="text-muted-foreground mb-2">
                                            123 Love Lane, Suite 100<br />
                                            New York, NY 10012
                                        </p>
                                        <p className="text-xs text-muted-foreground italic">By appointment only</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-muted/50 transition-colors">
                                    <div className="p-3 rounded-full bg-primary/10 text-primary shrink-0">
                                        <Phone className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-headline text-xl mb-1">Call Us</h3>
                                        <p className="text-muted-foreground">
                                            +1 (555) 123-4567
                                        </p>
                                        <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                                            <Clock className="h-3 w-3" /> Mon-Fri from 9am to 6pm EST
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-muted/50 transition-colors">
                                    <div className="p-3 rounded-full bg-primary/10 text-primary shrink-0">
                                        <Mail className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-headline text-xl mb-1">Email Us</h3>
                                        <p className="text-muted-foreground">
                                            hello@unitedloveluxe.com
                                        </p>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            We aim to respond to all emails within 24 hours.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </FadeIn>

                        <FadeIn delay={0.4}>
                            <div className="w-full h-[300px] bg-muted rounded-xl overflow-hidden relative shadow-inner">
                                {/* Placeholder for Map */}
                                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground bg-muted/50">
                                    <div className="text-center">
                                        <MapPin className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                        <span className="font-medium">Map View Coming Soon</span>
                                    </div>
                                </div>
                                <Image
                                    src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2074&auto=format&fit=crop"
                                    alt="Map Placeholder"
                                    fill
                                    className="object-cover opacity-20"
                                />
                            </div>
                        </FadeIn>
                    </div>
                </div>
            </div>
        </div>
    );
}
