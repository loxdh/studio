'use client';

import { useUser, useAuth, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { signOut, updateProfile } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import UserFiles from '@/components/account/UserFiles';
import { User, Package, Settings, LogOut, Loader2, FileText, FolderOpen } from 'lucide-react';
import { collection, query, where, orderBy } from 'firebase/firestore';
import { format } from 'date-fns';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';




type Order = {
    id: string;
    total: number;
    status: string;
    createdAt: any;
    items: any[];
};

type Quote = {
    id: string;
    createdAt: any;
    status: string;
    totalPrice: number;
    displayDetails: Record<string, string>;
    configuration: any;
};

export default function AccountPage() {
    const { user, isUserLoading } = useUser();
    const auth = useAuth();
    const firestore = useFirestore();
    const router = useRouter();
    const { toast } = useToast();
    const [activeTab, setActiveTab] = useState('profile');
    const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
    const [displayName, setDisplayName] = useState('');

    // Fetch Orders
    const ordersQuery = useMemoFirebase(() => {
        if (!firestore || !user) return null;
        return query(
            collection(firestore, 'orders'),
            where('userId', '==', user.uid),
            orderBy('createdAt', 'desc')
        );
    }, [firestore, user]);

    const { data: orders, isLoading: isOrdersLoading } = useCollection<Order>(ordersQuery);

    // Fetch Quotes
    const quotesQuery = useMemoFirebase(() => {
        if (!firestore || !user) return null;
        return query(
            collection(firestore, 'quotes'),
            where('userId', '==', user.uid),
            orderBy('createdAt', 'desc')
        );
    }, [firestore, user]);

    const { data: quotes, isLoading: isQuotesLoading } = useCollection<Quote>(quotesQuery);

    useEffect(() => {
        if (!isUserLoading && !user) {
            router.push('/login');
        } else if (user) {
            setDisplayName(user.displayName || '');
        }
    }, [user, isUserLoading, router]);

    const handleLogout = async () => {
        try {
            if (auth) {
                await signOut(auth);
                toast({
                    title: "Logged out",
                    description: "You have been successfully logged out."
                });
                router.push('/');
            }
        } catch (error) {
            console.error("Logout error:", error);
            toast({
                title: "Error",
                description: "Failed to log out.",
                variant: "destructive"
            });
        }
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setIsUpdatingProfile(true);
        try {
            await updateProfile(user, { displayName });
            toast({
                title: "Profile Updated",
                description: "Your profile has been updated successfully."
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update profile.",
                variant: "destructive"
            });
        } finally {
            setIsUpdatingProfile(false);
        }
    }

    if (isUserLoading || !user) {
        return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    }

    return (
        <div className="container mx-auto px-4 py-16">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar */}
                <aside className="w-full md:w-64 space-y-4">
                    <Card>
                        <CardContent className="p-4 flex flex-col gap-2">
                            <Button
                                variant={activeTab === 'profile' ? 'secondary' : 'ghost'}
                                className="justify-start gap-2 w-full font-semibold"
                                onClick={() => setActiveTab('profile')}
                            >
                                <User className="h-4 w-4" />
                                Profile
                            </Button>
                            <Button
                                variant={activeTab === 'orders' ? 'secondary' : 'ghost'}
                                className="justify-start gap-2 w-full font-semibold"
                                onClick={() => setActiveTab('orders')}
                            >
                                <Package className="h-4 w-4" />
                                Orders
                            </Button>
                            <Button
                                variant={activeTab === 'quotes' ? 'secondary' : 'ghost'}
                                className="justify-start gap-2 w-full font-semibold"
                                onClick={() => setActiveTab('quotes')}
                            >
                                <FileText className="h-4 w-4" />
                                Saved Quotes
                            </Button>
                            <Button
                                variant={activeTab === 'files' ? 'secondary' : 'ghost'}
                                className="justify-start gap-2 w-full font-semibold"
                                onClick={() => setActiveTab('files')}
                            >
                                <FolderOpen className="h-4 w-4" />
                                Files & Guest Lists
                            </Button>

                            <Button
                                variant={activeTab === 'settings' ? 'secondary' : 'ghost'}
                                className="justify-start gap-2 w-full font-semibold"
                                onClick={() => setActiveTab('settings')}
                            >
                                <Settings className="h-4 w-4" />
                                Settings
                            </Button>
                            <Button variant="ghost" className="justify-start gap-2 w-full text-destructive hover:text-destructive/90" onClick={handleLogout}>
                                <LogOut className="h-4 w-4" />
                                Log Out
                            </Button>
                        </CardContent>
                    </Card>
                </aside>

                {/* Main Content */}
                <div className="flex-1">
                    <h1 className="font-headline text-3xl mb-8">My Account</h1>

                    {activeTab === 'profile' && (
                        <div className="grid gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Profile Information</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center gap-4">
                                        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">
                                            {user.displayName ? user.displayName[0].toUpperCase() : user.email?.[0].toUpperCase()}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-semibold">{user.displayName || 'Valued Customer'}</h3>
                                            <p className="text-muted-foreground">{user.email}</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                        <div className="p-4 rounded-lg border bg-muted/50">
                                            <p className="text-sm font-medium text-muted-foreground">Member Since</p>
                                            <p className="font-medium">{user.metadata.creationTime ? format(new Date(user.metadata.creationTime), 'MMMM d, yyyy') : 'N/A'}</p>
                                        </div>
                                        <div className="p-4 rounded-lg border bg-muted/50">
                                            <p className="text-sm font-medium text-muted-foreground">Last Sign In</p>
                                            <p className="font-medium">{user.metadata.lastSignInTime ? format(new Date(user.metadata.lastSignInTime), 'MMMM d, yyyy') : 'N/A'}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {activeTab === 'orders' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Order History</CardTitle>
                                    <CardDescription>View and track your recent orders.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {isOrdersLoading ? (
                                        <div className="text-center py-8">Loading orders...</div>
                                    ) : orders && orders.length > 0 ? (
                                        <div className="space-y-8">
                                            {orders.map((order) => (
                                                <div key={order.id} className="border rounded-lg p-6 space-y-4">
                                                    <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 border-b pb-4">
                                                        <div>
                                                            <p className="font-semibold">Order #{order.id.slice(0, 8).toUpperCase()}</p>
                                                            <p className="text-sm text-muted-foreground">
                                                                Placed on {order.createdAt?.seconds ? format(new Date(order.createdAt.seconds * 1000), 'MMMM d, yyyy') : 'Recently'}
                                                            </p>
                                                        </div>
                                                        <div className="flex items-center gap-4">
                                                            <Badge variant={order.status === 'delivered' ? 'default' : 'secondary'}>
                                                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                            </Badge>
                                                            <p className="font-bold">${order.total.toFixed(2)}</p>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-4">
                                                        {order.items.map((item: any, index: number) => {
                                                            const productImage = PlaceHolderImages.find(
                                                                (img) => img.id === item.product.image
                                                            );
                                                            return (
                                                                <div key={index} className="flex items-center gap-4">
                                                                    <div className="relative h-16 w-16 rounded-md overflow-hidden border bg-muted">
                                                                        {(productImage || item.product.image.startsWith('http')) && (
                                                                            <Image
                                                                                src={productImage ? productImage.imageUrl : item.product.image}
                                                                                alt={item.product.name}
                                                                                fill
                                                                                className="object-cover"
                                                                            />
                                                                        )}
                                                                    </div>
                                                                    <div className="flex-1">
                                                                        <p className="font-medium text-sm">{item.product.name}</p>
                                                                        <p className="text-sm text-muted-foreground">Qty: {item.quantity} × ${item.product.price}</p>
                                                                        {item.customizations && Object.keys(item.customizations).length > 0 && (
                                                                            <div className="mt-1 text-xs text-muted-foreground">
                                                                                {Object.entries(item.customizations).map(([key, value]) => (
                                                                                    <span key={key} className="block">{key}: {value as string}</span>
                                                                                ))}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-12">
                                            <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                                            <h3 className="text-lg font-semibold">No orders yet</h3>
                                            <p className="text-muted-foreground mb-4">You haven't placed any orders yet.</p>
                                            <Button onClick={() => router.push('/products')}>Start Shopping</Button>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {activeTab === 'quotes' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Saved Quotes</CardTitle>
                                    <CardDescription>Review your saved custom design configurations.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {isQuotesLoading ? (
                                        <div className="text-center py-8">Loading quotes...</div>
                                    ) : quotes && quotes.length > 0 ? (
                                        <div className="space-y-8">
                                            {quotes.map((quote) => (
                                                <div key={quote.id} className="border rounded-lg p-6 space-y-4">
                                                    <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 border-b pb-4">
                                                        <div>
                                                            <p className="font-semibold">Quote Saved</p>
                                                            <p className="text-sm text-muted-foreground">
                                                                {quote.createdAt?.seconds ? format(new Date(quote.createdAt.seconds * 1000), 'MMMM d, yyyy') : 'Recently'}
                                                            </p>
                                                        </div>
                                                        <div className="flex items-center gap-4">
                                                            <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                                                                Saved
                                                            </Badge>
                                                            <p className="font-bold text-lg">${quote.totalPrice.toFixed(2)}</p>
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm">
                                                        {quote.displayDetails && Object.entries(quote.displayDetails).map(([key, value]) => (
                                                            <div key={key} className="flex justify-between border-b border-dashed py-1 last:border-0">
                                                                <span className="text-muted-foreground">{key}</span>
                                                                <span className="font-medium text-right">{value}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className="pt-2 flex justify-end">
                                                        {/* Future: Add button to load this quote back into the designer */}
                                                        <Button variant="outline" size="sm" onClick={() => router.push('/custom-design')}>
                                                            Start New Design
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-12">
                                            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                                            <h3 className="text-lg font-semibold">No saved quotes</h3>
                                            <p className="text-muted-foreground mb-4">You haven't saved any custom designs yet.</p>
                                            <Button onClick={() => router.push('/custom-design')}>Create Custom Design</Button>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {activeTab === 'files' && (
                        <UserFiles />
                    )}

                    {activeTab === 'settings' && (
                        <div className="grid gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Account Settings</CardTitle>
                                    <CardDescription>Update your personal information.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleUpdateProfile} className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="displayName">Display Name</Label>
                                            <Input
                                                id="displayName"
                                                value={displayName}
                                                onChange={(e) => setDisplayName(e.target.value)}
                                                placeholder="Your Name"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email Address</Label>
                                            <Input
                                                id="email"
                                                value={user.email || ''}
                                                disabled
                                                className="bg-muted"
                                            />
                                            <p className="text-xs text-muted-foreground">Email cannot be changed.</p>
                                        </div>
                                        <Button type="submit" disabled={isUpdatingProfile}>
                                            {isUpdatingProfile ? 'Saving...' : 'Save Changes'}
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
