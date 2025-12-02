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
import { Eye, Loader2 } from 'lucide-react';

type Order = {
    id: string;
    total: number;
    status: string;
    createdAt: any;
    shippingDetails: {
        firstName: string;
        lastName: string;
        email: string;
    };
    items: any[];
};

export default function AdminOrdersPage() {
    const firestore = useFirestore();

    const ordersQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return query(collection(firestore, 'orders'), orderBy('createdAt', 'desc'));
    }, [firestore]);

    const { data: orders, isLoading } = useCollection<Order>(ordersQuery);

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
                <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Orders</CardTitle>
                </CardHeader>
                <CardContent>
                    {orders && orders.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Order ID</TableHead>
                                    <TableHead>Customer</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Total</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {orders.map((order) => (
                                    <TableRow key={order.id}>
                                        <TableCell className="font-medium">
                                            #{order.id.slice(0, 8).toUpperCase()}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-medium">
                                                    {order.shippingDetails?.firstName} {order.shippingDetails?.lastName}
                                                </span>
                                                <span className="text-xs text-muted-foreground">
                                                    {order.shippingDetails?.email}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {order.createdAt?.seconds
                                                ? format(new Date(order.createdAt.seconds * 1000), 'MMM d, yyyy')
                                                : 'N/A'}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    order.status === 'delivered'
                                                        ? 'default'
                                                        : order.status === 'shipped'
                                                            ? 'secondary'
                                                            : 'outline'
                                                }
                                            >
                                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            ${order.total.toFixed(2)}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button asChild variant="ghost" size="icon">
                                                <Link href={`/admin/orders/${order.id}`}>
                                                    <Eye className="h-4 w-4" />
                                                    <span className="sr-only">View Order</span>
                                                </Link>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <div className="text-center py-12 text-muted-foreground">
                            No orders found.
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
