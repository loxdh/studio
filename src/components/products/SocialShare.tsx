'use client';

import { Button } from '@/components/ui/button';
import { Copy, Check, Share2 } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface SocialShareProps {
    productUrl: string;
    productName: string;
}

export default function SocialShare({ productUrl, productName }: SocialShareProps) {
    const { toast } = useToast();
    const [copied, setCopied] = useState(false);

    const fullUrl = typeof window !== 'undefined' ? `${window.location.origin}${productUrl}` : productUrl;

    const handleCopy = () => {
        navigator.clipboard.writeText(fullUrl);
        setCopied(true);
        toast({
            title: "Link Copied",
            description: "Product link copied to clipboard.",
        });
        setTimeout(() => setCopied(false), 2000);
    };

    const shareToFacebook = () => {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`, '_blank');
    };

    const shareToTwitter = () => {
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(productName)}&url=${encodeURIComponent(fullUrl)}`, '_blank');
    };

    const shareToPinterest = () => {
        window.open(`https://pinterest.com/pin/create/button/?url=${encodeURIComponent(fullUrl)}&description=${encodeURIComponent(productName)}`, '_blank');
    };

    return (
        <div className="flex items-center gap-2 mt-6">
            <span className="text-sm font-medium text-muted-foreground mr-2 flex items-center gap-1">
                <Share2 className="h-4 w-4" /> Share:
            </span>

            <Button variant="outline" size="icon" className="h-8 w-8 rounded-full" onClick={shareToFacebook} title="Share on Facebook">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036c-2.148 0-2.797 1.603-2.797 2.898v1.074h3.77l-.502 3.667h-3.268v7.98h-4.997z" />
                </svg>
                <span className="sr-only">Facebook</span>
            </Button>

            <Button variant="outline" size="icon" className="h-8 w-8 rounded-full" onClick={shareToTwitter} title="Share on X (Twitter)">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
                </svg>
                <span className="sr-only">Twitter</span>
            </Button>

            <Button variant="outline" size="icon" className="h-8 w-8 rounded-full" onClick={shareToPinterest} title="Share on Pinterest">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.399.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.951-7.252 4.173 0 7.41 2.967 7.41 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.367 18.62 0 12.017 0z" />
                </svg>
                <span className="sr-only">Pinterest</span>
            </Button>

            <Button variant="outline" size="icon" className="h-8 w-8 rounded-full ml-2" onClick={handleCopy} title="Copy Link">
                {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                <span className="sr-only">Copy Link</span>
            </Button>
        </div>
    );
}
