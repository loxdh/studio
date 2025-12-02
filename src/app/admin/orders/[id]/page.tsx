'use client';

import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Loader2, Package, Truck, MapPin, CreditCard, Printer } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';

type Order = {
    id: string;
    total: number;
    status: string;
    createdAt: any;
    shippingDetails: {
        firstName: string;
        lastName: string;
        email: string;
        address: string;
        city: string;
        zipCode: string;
    };
    items: any[];
};

export default function AdminOrderDetailPage() {
    const params = useParams();
    const id = params?.id as string;
    const firestore = useFirestore();
    const router = useRouter();
    const { toast } = useToast();
    const [isUpdating, setIsUpdating] = useState(false);

    const docRef = useMemoFirebase(() => {
        if (!firestore || !id) return null;
        return doc(firestore, 'orders', id);
    }, [firestore, id]);

    const { data: order, isLoading } = useDoc<Order>(docRef);

    const handleStatusChange = async (newStatus: string) => {
        if (!firestore || !id) return;
        setIsUpdating(true);
        try {
            await updateDoc(doc(firestore, 'orders', id), {
                status: newStatus
            });
            toast({
                title: "Status Updated",
                description: `Order status changed to ${newStatus}.`
            });
        } catch (error) {
            console.error("Error updating status:", error);
            toast({
                title: "Error",
                description: "Failed to update status.",
                variant: "destructive"
            });
        } finally {
            setIsUpdating(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (!order) {
        return (
            <div className="flex flex-col items-center justify-center h-96 gap-4">
                <h2 className="text-xl font-semibold">Order not found</h2>
                <Button asChild variant="outline">
                    <Link href="/admin/orders">Back to Orders</Link>
                </Button>
            </div>
        )
    }

    return (
        <div className="space-y-6 max-w-5xl mx-auto pb-16">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/admin/orders">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div className="flex-1">
                    <h1 className="text-2xl font-bold tracking-tight">Order #{order.id.slice(0, 8).toUpperCase()}</h1>
                    <p className="text-muted-foreground">
                        Placed on {order.createdAt?.seconds ? format(new Date(order.createdAt.seconds * 1000), 'MMMM d, yyyy h:mm a') : 'N/A'}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" asChild>
                        <Link href={`/admin/orders/${id}/packing-slip`} target="_blank">
                            <Printer className="h-4 w-4 mr-2" />
                            Print Slip
                        </Link>
                    </Button>
                    <Select
                        defaultValue={order.status}
                        onValueChange={handleStatusChange}
                        disabled={isUpdating}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="processing">Processing</SelectItem>
                            <SelectItem value="shipped">Shipped</SelectItem>
                            <SelectItem value="delivered">Delivered</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Order Items */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Package className="h-5 w-5" />
                                Order Items
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {order.items.map((item: any, index: number) => {
                                const productImage = PlaceHolderImages.find(
                                    (img) => img.id === item.product.image
                                );
                                return (
                                    <div key={index} className="flex gap-4">
                                        <div className="relative h-24 w-24 rounded-md overflow-hidden border bg-muted flex-shrink-0">
                                            {(productImage || item.product.image.startsWith('http')) && (
                                                <Image
                                                    src={productImage ? productImage.imageUrl : item.product.image}
                                                    alt={item.product.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            )}
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <div className="flex justify-between items-start">
                                                <h4 className="font-semibold">{item.product.name}</h4>
                                                <p className="font-medium">${(item.product.price * item.quantity).toFixed(2)}</p>
                                            </div>
                                            <p className="text-sm text-muted-foreground">Qty: {item.quantity} × ${item.product.price}</p>

                                            {/* Customizations Display */}
                                            {item.customizations && Object.keys(item.customizations).length > 0 && (
                                                <div className="mt-2 text-sm bg-muted/50 p-3 rounded-md space-y-1">
                                                    <p className="font-semibold text-xs uppercase tracking-wider text-muted-foreground mb-1">Customization Details</p>
                                                    {Object.entries(item.customizations).map(([key, value]) => (
                                                        <div key={key} className="grid grid-cols-3 gap-2">
                                                            <span className="font-medium text-muted-foreground col-span-1">{key}:</span>
                                                            <span className="col-span-2">{value as string}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )
                            })}
                            <Separator />
                            <div className="flex justify-between items-center font-bold text-lg">
                                <span>Total</span>
                                <span>${order.total.toFixed(2)}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Customer & Shipping Info */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Truck className="h-5 w-5" />
                                Shipping Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-start gap-3">
                                <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                                <div>
                                    <p className="font-medium">{order.shippingDetails.firstName} {order.shippingDetails.lastName}</p>
                                    <p className="text-muted-foreground">{order.shippingDetails.address}</p>
                                    <p className="text-muted-foreground">{order.shippingDetails.city}, {order.shippingDetails.zipCode}</p>
                                </div>
                            </div>
                            <Separator />
                            <div>
                                <p className="text-sm font-medium text-muted-foreground mb-1">Email Address</p>
                                <p>{order.shippingDetails.email}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CreditCard className="h-5 w-5" />
                                Payment Info
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">Paid</Badge>
                                <span className="text-sm">via Credit Card (Mock)</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
