'use client';

import { useFirestore, useCollection, useMemoFirebase, useUser } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import Link from 'next/link';
import { format } from 'date-fns';
import { useState } from 'react';
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
import { Eye, Loader2, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

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
    const { user } = useUser();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [sortOption, setSortOption] = useState('newest');

    const ordersQuery = useMemoFirebase(() => {
        if (!firestore || !user) return null;
        return query(collection(firestore, 'orders'), orderBy('createdAt', 'desc'));
    }, [firestore, user]);

    const { data: orders, isLoading } = useCollection<Order>(ordersQuery);

    const filteredOrders = orders?.filter((order) => {
        const matchesSearch =
            searchTerm === '' ||
            order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.shippingDetails?.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.shippingDetails?.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.shippingDetails?.email.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus =
            statusFilter === 'all' || order.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const sortedOrders = [...(filteredOrders || [])].sort((a, b) => {
        if (sortOption === 'newest') {
            return (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0);
        }
        if (sortOption === 'oldest') {
            return (a.createdAt?.seconds || 0) - (b.createdAt?.seconds || 0);
        }
        if (sortOption === 'amount-high') {
            return b.total - a.total;
        }
        if (sortOption === 'amount-low') {
            return a.total - b.total;
        }
        return 0;
    });

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
                <div className="text-muted-foreground">
                    {sortedOrders.length} orders found
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search orders..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="pending_payment">Pending Payment</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                </Select>
                <Select value={sortOption} onValueChange={setSortOption}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="newest">Newest</SelectItem>
                        <SelectItem value="oldest">Oldest</SelectItem>
                        <SelectItem value="amount-high">Amount: High to Low</SelectItem>
                        <SelectItem value="amount-low">Amount: Low to High</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Order List</CardTitle>
                </CardHeader>
                <CardContent>
                    {sortedOrders.length > 0 ? (
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
                                {sortedOrders.map((order) => (
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
                                                            : order.status === 'cancelled'
                                                                ? 'destructive'
                                                                : 'outline'
                                                }
                                            >
                                                {order.status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
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
                            No orders found matching your criteria.
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
