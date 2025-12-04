'use client';

import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from '@/components/ui/table';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { format } from 'date-fns';
import { Loader2, Mail } from 'lucide-react';

type Subscriber = {
    id: string;
    email: string;
    source: string;
    createdAt: any;
};

export default function SubscribersPage() {
    const firestore = useFirestore();

    const subscribersQuery = useMemoFirebase(
        () => {
            if (!firestore) return null;
            return query(collection(firestore, 'subscribers'), orderBy('createdAt', 'desc'));
        },
        [firestore]
    );

    const { data: subscribers, isLoading } = useCollection<Subscriber>(subscribersQuery);

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
                <h1 className="text-3xl font-bold tracking-tight">Subscribers</h1>
                <div className="text-muted-foreground">
                    Total: {subscribers?.length || 0}
                </div>
            </div>

            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Email</TableHead>
                            <TableHead>Source</TableHead>
                            <TableHead>Joined Date</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {subscribers && subscribers.length > 0 ? (
                            subscribers.map((subscriber) => (
                                <TableRow key={subscriber.id}>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-2">
                                            <Mail className="h-4 w-4 text-muted-foreground" />
                                            {subscriber.email}
                                        </div>
                                    </TableCell>
                                    <TableCell className="capitalize">{subscriber.source || 'Unknown'}</TableCell>
                                    <TableCell>
                                        {subscriber.createdAt?.seconds
                                            ? format(new Date(subscriber.createdAt.seconds * 1000), 'PPP p')
                                            : 'N/A'}
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={3} className="h-24 text-center">
                                    No subscribers found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
