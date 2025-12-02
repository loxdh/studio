'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useCart } from '@/hooks/useCart';
import { useFirestore } from '@/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

function SuccessContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { clearCart } = useCart();
    const firestore = useFirestore();

    const sessionId = searchParams.get('session_id');
    const orderId = searchParams.get('order_id');

    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (!sessionId || !orderId) {
            setStatus('error');
            setMessage('Invalid session or order ID.');
            return;
        }

        const verifyPayment = async () => {
            try {
                const response = await fetch(`/api/checkout/verify?session_id=${sessionId}`);
                const data = await response.json();

                if (data.status === 'paid') {
                    // Payment verified
                    if (firestore) {
                        // Update order status in Firestore
                        // Note: In a production app with strict security rules, this should be done via a Webhook or the API route using firebase-admin.
                        // Here we are doing it client-side for simplicity in this prototype.
                        const orderRef = doc(firestore, 'orders', orderId);
                        await updateDoc(orderRef, {
                            status: 'processing', // Or 'paid'
                            paymentStatus: 'paid',
                            stripeSessionId: sessionId
                        });
                    }

                    clearCart();
                    setStatus('success');
                } else {
                    setStatus('error');
                    setMessage(`Payment status: ${data.status}`);
                }
            } catch (error) {
                console.error('Verification error:', error);
                setStatus('error');
                setMessage('Failed to verify payment.');
            }
        };

        verifyPayment();
    }, [sessionId, orderId, firestore, clearCart]);

    if (status === 'loading') {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
                <h2 className="text-2xl font-semibold">Verifying your payment...</h2>
                <p className="text-muted-foreground">Please do not close this window.</p>
            </div>
        );
    }

    if (status === 'error') {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 text-center">
                <AlertCircle className="h-16 w-16 text-destructive" />
                <h2 className="text-2xl font-semibold text-destructive">Payment Verification Failed</h2>
                <p className="text-muted-foreground">{message}</p>
                <div className="flex gap-4 mt-4">
                    <Button asChild variant="outline">
                        <Link href="/contact">Contact Support</Link>
                    </Button>
                    <Button asChild>
                        <Link href="/">Return Home</Link>
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[60vh] text-center animate-in fade-in zoom-in duration-500">
            <div className="bg-primary/10 p-6 rounded-full mb-6">
                <CheckCircle className="h-16 w-16 text-primary" />
            </div>
            <h1 className="font-headline text-4xl md:text-5xl mb-4">Thank You!</h1>
            <p className="text-xl text-muted-foreground max-w-lg mb-8">
                Your order has been placed successfully. We have sent a confirmation email to you.
            </p>

            <Card className="w-full max-w-md mb-8">
                <CardHeader>
                    <CardTitle>Order Reference</CardTitle>
                    <CardDescription>Keep this for your records</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-2xl font-mono font-bold tracking-wider">#{orderId?.slice(0, 8).toUpperCase()}</p>
                </CardContent>
            </Card>

            <div className="flex gap-4">
                <Button asChild size="lg">
                    <Link href="/products">Continue Shopping</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                    <Link href="/account">View Order</Link>
                </Button>
            </div>
        </div>
    );
}

export default function SuccessPage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
            <SuccessContent />
        </Suspense>
    )
}
