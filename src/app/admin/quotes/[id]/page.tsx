'use client';

import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Loader2, FileText, User } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';

type Quote = {
    id: string;
    userId: string;
    createdAt: any;
    status: string;
    details: {
        quantity: number;
        invitationType: string;
        shape: string;
        material: string;
        printMethod: string;
        printColor: string;
        envelopeColor: string;
        inserts: string;
        services: string;
        notes: string;
    };
};

export default function AdminQuoteDetailPage() {
    const params = useParams();
    const id = params?.id as string;
    const firestore = useFirestore();

    const docRef = useMemoFirebase(() => {
        if (!firestore || !id) return null;
        return doc(firestore, 'quotes', id);
    }, [firestore, id]);

    const { data: quote, isLoading } = useDoc<Quote>(docRef);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (!quote) {
        return (
            <div className="flex flex-col items-center justify-center h-96 gap-4">
                <h2 className="text-xl font-semibold">Quote not found</h2>
                <Button asChild variant="outline">
                    <Link href="/admin/quotes">Back to Quotes</Link>
                </Button>
            </div>
        )
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto pb-16">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/admin/quotes">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div className="flex-1">
                    <h1 className="text-2xl font-bold tracking-tight">Quote #{quote.id.slice(0, 8).toUpperCase()}</h1>
                    <p className="text-muted-foreground">
                        Submitted on {quote.createdAt?.seconds ? format(new Date(quote.createdAt.seconds * 1000), 'MMMM d, yyyy h:mm a') : 'N/A'}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="h-5 w-5" />
                                Design Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Invitation Type</p>
                                    <p className="font-medium">{quote.details.invitationType}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Quantity</p>
                                    <p className="font-medium">{quote.details.quantity}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Shape</p>
                                    <p>{quote.details.shape}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Material</p>
                                    <p>{quote.details.material}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Print Method</p>
                                    <p>{quote.details.printMethod}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Print Color</p>
                                    <p>{quote.details.printColor}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Envelope Color</p>
                                    <p>{quote.details.envelopeColor}</p>
                                </div>
                            </div>

                            <Separator />

                            <div>
                                <p className="text-sm font-medium text-muted-foreground mb-1">Inserts</p>
                                <p>{quote.details.inserts || 'None'}</p>
                            </div>

                            <div>
                                <p className="text-sm font-medium text-muted-foreground mb-1">Additional Services</p>
                                <p>{quote.details.services || 'None'}</p>
                            </div>

                            <Separator />

                            <div>
                                <p className="text-sm font-medium text-muted-foreground mb-1">Customer Notes</p>
                                <p className="whitespace-pre-wrap text-sm">{quote.details.notes || 'No notes provided.'}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5" />
                                Customer Info
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <p className="text-sm font-medium text-muted-foreground">User ID</p>
                                <p className="text-xs font-mono bg-muted p-1 rounded">{quote.userId}</p>
                                {/* In a real app, we might fetch the user profile here to show name/email */}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
