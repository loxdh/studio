'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export function CookieConsent() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Check if user has already consented
        const consent = localStorage.getItem('cookie-consent');
        if (!consent) {
            // Show banner after a short delay for better UX
            const timer = setTimeout(() => setIsVisible(true), 1000);
            return () => clearTimeout(timer);
        }
    }, []);

    const acceptCookies = () => {
        localStorage.setItem('cookie-consent', 'accepted');
        setIsVisible(false);
    };

    const declineCookies = () => {
        // We still save a preference to not show it again for this session/user
        // In a real app with analytics, you would disable tracking scripts here
        localStorage.setItem('cookie-consent', 'declined');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className={cn(
            "fixed bottom-0 left-0 right-0 z-50 p-3 bg-background/95 backdrop-blur-md border-t shadow-lg transition-transform duration-500 ease-in-out",
            isVisible ? "translate-y-0" : "translate-y-full"
        )}>
            <div className="container mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-3">
                <div className="flex-1 text-center md:text-left">
                    <h3 className="text-base font-semibold">We use cookies</h3>
                    <p className="text-xs text-muted-foreground">
                        We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic.
                        By clicking "Accept", you consent to our use of cookies.
                    </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                    <Button variant="outline" size="sm" onClick={declineCookies}>
                        Decline
                    </Button>
                    <Button size="sm" onClick={acceptCookies}>
                        Accept
                    </Button>
                    <Button variant="ghost" size="icon" className="h-6 w-6 ml-1 md:hidden" onClick={declineCookies}>
                        <X className="h-3 w-3" />
                        <span className="sr-only">Close</span>
                    </Button>
                </div>
            </div>
        </div>
    );
}
