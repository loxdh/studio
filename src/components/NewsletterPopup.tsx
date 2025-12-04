'use client';

import { useState, useEffect } from 'react';
import { X, ArrowRight, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useFirestore } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { AnimatePresence, motion } from 'framer-motion';

export function NewsletterPopup() {
    const [isOpen, setIsOpen] = useState(false);
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const firestore = useFirestore();
    const { toast } = useToast();

    useEffect(() => {
        // Check if user has already seen/dismissed the popup
        const hasSeenPopup = localStorage.getItem('newsletter_popup_dismissed');

        if (!hasSeenPopup) {
            // Show popup after 5 seconds
            const timer = setTimeout(() => {
                setIsOpen(true);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleClose = () => {
        setIsOpen(false);
        localStorage.setItem('newsletter_popup_dismissed', 'true');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !email.includes('@')) return;

        setIsLoading(true);
        try {
            if (firestore) {
                await addDoc(collection(firestore, 'subscribers'), {
                    email,
                    createdAt: serverTimestamp(),
                    source: 'popup',
                });

                toast({
                    title: "Welcome to the family",
                    description: "You've successfully subscribed to our newsletter.",
                });

                handleClose();
            }
        } catch (error) {
            console.error('Subscription error:', error);
            toast({
                title: "Something went wrong",
                description: "Please try again later.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="relative w-full max-w-md bg-background border border-border shadow-2xl rounded-xl overflow-hidden"
                    >
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-2 top-2 z-10 hover:bg-transparent"
                            onClick={handleClose}
                        >
                            <X className="h-4 w-4 text-muted-foreground" />
                            <span className="sr-only">Close</span>
                        </Button>

                        <div className="p-8 flex flex-col items-center text-center space-y-6">
                            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                                <Mail className="h-6 w-6 text-primary" />
                            </div>

                            <div className="space-y-2">
                                <h2 className="font-headline text-3xl font-bold tracking-tight">Join the Inner Circle</h2>
                                <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mx-auto">
                                    Be the first to know about new collections, exclusive offers, and wedding inspiration.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="w-full space-y-4">
                                <div className="space-y-2">
                                    <Input
                                        type="email"
                                        placeholder="Enter your email address"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="h-11 text-center bg-muted/50 border-transparent focus:border-primary focus:bg-background transition-all"
                                        required
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    className="w-full h-11 font-medium"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Joining...' : 'Subscribe'}
                                    {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
                                </Button>
                            </form>

                            <p className="text-[10px] text-muted-foreground/60 uppercase tracking-widest">
                                No spam, just love. Unsubscribe anytime.
                            </p>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
