'use client';

import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import Link from 'next/link';
import { format } from 'date-fns';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, Loader2, FileText } from 'lucide-react';

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

export default function AdminQuotesPage() {
    const firestore = useFirestore();

    const quotesQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return query(collection(firestore, 'quotes'), orderBy('createdAt', 'desc'));
    }, [firestore]);

    const { data: quotes, isLoading } = useCollection<Quote>(quotesQuery);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Design Quotes</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Quotes</CardTitle>
                </CardHeader>
                <CardContent>
                    {quotes && quotes.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Quote ID</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Quantity</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {quotes.map((quote) => (
                                    <TableRow key={quote.id}>
                                        <TableCell className="font-medium">
                                            #{quote.id.slice(0, 8).toUpperCase()}
                                        </TableCell>
                                        <TableCell>
                                            {quote.createdAt?.seconds
                                                ? format(new Date(quote.createdAt.seconds * 1000), 'MMM d, yyyy')
                                                : 'N/A'}
                                        </TableCell>
                                        <TableCell>
                                            {quote.details?.invitationType || 'Custom'}
                                        </TableCell>
                                        <TableCell>
                                            {quote.details?.quantity || 0}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline">
                                                {quote.status ? quote.status.charAt(0).toUpperCase() + quote.status.slice(1) : 'Pending'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button asChild variant="ghost" size="icon">
                                                <Link href={`/admin/quotes/${quote.id}`}>
                                                    <Eye className="h-4 w-4" />
                                                    <span className="sr-only">View Quote</span>
                                                </Link>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <div className="text-center py-12 text-muted-foreground">
                            No quotes found.
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
