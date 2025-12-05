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
import { User, Package, Settings, LogOut, Loader2, FileText, FolderOpen, MapPin, ShoppingBag } from 'lucide-react';
import { collection, query, where, orderBy, doc, setDoc, getDoc } from 'firebase/firestore';
import { format } from 'date-fns';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import type { Order } from '@/lib/orders';
import type { Quote } from '@/lib/quotes';




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

    const [address, setAddress] = useState({
        line1: '',
        line2: '',
        city: '',
        state: '',
        postal_code: '',
        country: 'US'
    });
    const [isSavingAddress, setIsSavingAddress] = useState(false);

    // Fetch User Data (including address)
    useEffect(() => {
        const fetchUserData = async () => {
            if (user && firestore) {
                try {
                    const docRef = doc(firestore, 'users', user.uid);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        if (data.shippingAddress) {
                            setAddress(data.shippingAddress);
                        }
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                }
            }
        };
        fetchUserData();
    }, [user, firestore]);

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

    const handleUpdateAddress = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !firestore) return;
        setIsSavingAddress(true);
        try {
            const docRef = doc(firestore, 'users', user.uid);
            await setDoc(docRef, { shippingAddress: address }, { merge: true });
            toast({
                title: "Address Saved",
                description: "Your shipping address has been updated."
            });
        } catch (error) {
            console.error("Error saving address:", error);
            toast({
                title: "Error",
                description: "Failed to save address.",
                variant: "destructive"
            });
        } finally {
            setIsSavingAddress(false);
        }
    };

    if (isUserLoading || !user) {
        return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    }

    return (
        <div className="container mx-auto px-4 py-16">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar */}
                <aside className="w-full md:w-64 space-y-4">
                    <Card className="border-none shadow-md">
                        <CardContent className="p-4 flex flex-col gap-2">
                            <div className="px-4 py-2 mb-2">
                                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Account</p>
                            </div>
                            <Button
                                variant={activeTab === 'profile' ? 'secondary' : 'ghost'}
                                className="justify-start gap-3 w-full font-medium"
                                onClick={() => setActiveTab('profile')}
                            >
                                <User className="h-4 w-4" />
                                Profile
                            </Button>
                            <Button
                                variant={activeTab === 'addresses' ? 'secondary' : 'ghost'}
                                className="justify-start gap-3 w-full font-medium"
                                onClick={() => setActiveTab('addresses')}
                            >
                                <MapPin className="h-4 w-4" />
                                Address Book
                            </Button>
                            <Button
                                variant={activeTab === 'orders' ? 'secondary' : 'ghost'}
                                className="justify-start gap-3 w-full font-medium"
                                onClick={() => setActiveTab('orders')}
                            >
                                <Package className="h-4 w-4" />
                                Orders
                            </Button>
                            <Button
                                variant={activeTab === 'quotes' ? 'secondary' : 'ghost'}
                                className="justify-start gap-3 w-full font-medium"
                                onClick={() => setActiveTab('quotes')}
                            >
                                <FileText className="h-4 w-4" />
                                Saved Quotes
                            </Button>
                            <Button
                                variant={activeTab === 'files' ? 'secondary' : 'ghost'}
                                className="justify-start gap-3 w-full font-medium"
                                onClick={() => setActiveTab('files')}
                            >
                                <FolderOpen className="h-4 w-4" />
                                Files & Guest Lists
                            </Button>

                            <div className="px-4 py-2 mt-4 mb-2 border-t pt-4">
                                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Preferences</p>
                            </div>
                            <Button
                                variant={activeTab === 'settings' ? 'secondary' : 'ghost'}
                                className="justify-start gap-3 w-full font-medium"
                                onClick={() => setActiveTab('settings')}
                            >
                                <Settings className="h-4 w-4" />
                                Settings
                            </Button>
                            <Button variant="ghost" className="justify-start gap-3 w-full text-destructive hover:text-destructive/90 hover:bg-destructive/10" onClick={handleLogout}>
                                <LogOut className="h-4 w-4" />
                                Log Out
                            </Button>
                        </CardContent>
                    </Card>
                </aside>

                {/* Main Content */}
                <div className="flex-1 min-h-[500px]">
                    <h1 className="font-headline text-3xl mb-2">My Account</h1>
                    <p className="text-muted-foreground mb-8">Manage your profile, orders, and preferences.</p>

                    {activeTab === 'profile' && (
                        <div className="grid gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Profile Information</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="flex items-center gap-6">
                                        <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center text-3xl font-bold text-primary border-2 border-primary/20">
                                            {user.displayName ? user.displayName[0].toUpperCase() : user.email?.[0].toUpperCase()}
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-headline">{user.displayName || 'Valued Customer'}</h3>
                                            <p className="text-muted-foreground">{user.email}</p>
                                            <Badge variant="outline" className="mt-2">Member</Badge>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                                        <div className="p-4 rounded-lg border bg-muted/30">
                                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Member Since</p>
                                            <p className="font-medium">{user.metadata.creationTime ? format(new Date(user.metadata.creationTime), 'MMMM d, yyyy') : 'N/A'}</p>
                                        </div>
                                        <div className="p-4 rounded-lg border bg-muted/30">
                                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Last Sign In</p>
                                            <p className="font-medium">{user.metadata.lastSignInTime ? format(new Date(user.metadata.lastSignInTime), 'MMMM d, yyyy') : 'N/A'}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {activeTab === 'addresses' && (
                        <div className="grid gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Shipping Address</CardTitle>
                                    <CardDescription>Save your shipping address for faster checkout.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleUpdateAddress} className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="line1">Address Line 1</Label>
                                            <Input
                                                id="line1"
                                                placeholder="123 Love Lane"
                                                value={address.line1}
                                                onChange={(e) => setAddress({ ...address, line1: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="line2">Address Line 2 (Optional)</Label>
                                            <Input
                                                id="line2"
                                                placeholder="Apt 4B"
                                                value={address.line2}
                                                onChange={(e) => setAddress({ ...address, line2: e.target.value })}
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="city">City</Label>
                                                <Input
                                                    id="city"
                                                    placeholder="New York"
                                                    value={address.city}
                                                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="state">State</Label>
                                                <Input
                                                    id="state"
                                                    placeholder="NY"
                                                    value={address.state}
                                                    onChange={(e) => setAddress({ ...address, state: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="postal_code">Zip Code</Label>
                                                <Input
                                                    id="postal_code"
                                                    placeholder="10012"
                                                    value={address.postal_code}
                                                    onChange={(e) => setAddress({ ...address, postal_code: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="country">Country</Label>
                                                <Input
                                                    id="country"
                                                    value="United States"
                                                    disabled
                                                    className="bg-muted"
                                                />
                                            </div>
                                        </div>
                                        <div className="pt-4">
                                            <Button type="submit" disabled={isSavingAddress}>
                                                {isSavingAddress ? (
                                                    <>
                                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                        Saving...
                                                    </>
                                                ) : (
                                                    'Save Address'
                                                )}
                                            </Button>
                                        </div>
                                    </form>
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
                                        <div className="text-center py-12">
                                            <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
                                            <p className="mt-2 text-muted-foreground">Loading orders...</p>
                                        </div>
                                    ) : orders && orders.length > 0 ? (
                                        <div className="space-y-6">
                                            {orders.map((order) => (
                                                <div key={order.id} className="border rounded-lg overflow-hidden">
                                                    <div className="bg-muted/30 p-4 flex flex-col md:flex-row justify-between md:items-center gap-4 border-b">
                                                        <div className="flex gap-6">
                                                            <div>
                                                                <p className="text-xs font-medium text-muted-foreground uppercase">Order Placed</p>
                                                                <p className="font-medium text-sm">
                                                                    {order.createdAt?.seconds ? format(new Date(order.createdAt.seconds * 1000), 'MMM d, yyyy') : 'Recently'}
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <p className="text-xs font-medium text-muted-foreground uppercase">Total</p>
                                                                <p className="font-medium text-sm">${order.total.toFixed(2)}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-xs font-medium text-muted-foreground uppercase">Order #</p>
                                                                <p className="font-medium text-sm">{order.id.slice(0, 8).toUpperCase()}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            <Badge variant={order.status === 'delivered' ? 'default' : 'secondary'} className="capitalize">
                                                                {order.status}
                                                            </Badge>
                                                            {/* <Button variant="outline" size="sm">View Invoice</Button> */}
                                                        </div>
                                                    </div>
                                                    <div className="p-4 space-y-4">
                                                        {order.items.map((item: any, index: number) => {
                                                            const productImage = PlaceHolderImages.find(
                                                                (img) => img.id === item.product.image
                                                            );
                                                            return (
                                                                <div key={index} className="flex items-start gap-4">
                                                                    <div className="relative h-20 w-20 rounded-md overflow-hidden border bg-muted shrink-0">
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
                                                                        <h4 className="font-medium text-base">{item.product.name}</h4>
                                                                        <p className="text-sm text-muted-foreground mt-1">Qty: {item.quantity} × ${item.product.price}</p>
                                                                        {item.customizations && Object.keys(item.customizations).length > 0 && (
                                                                            <div className="mt-2 text-xs text-muted-foreground bg-muted/50 p-2 rounded">
                                                                                {Object.entries(item.customizations).map(([key, value]) => (
                                                                                    <span key={key} className="block"><span className="font-medium">{key}:</span> {value as string}</span>
                                                                                ))}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                    {/* <Button variant="ghost" size="sm">Write Review</Button> */}
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-16 px-4">
                                            <div className="bg-muted/50 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                                                <ShoppingBag className="h-8 w-8 text-muted-foreground" />
                                            </div>
                                            <h3 className="text-lg font-semibold mb-2">No orders yet</h3>
                                            <p className="text-muted-foreground mb-6 max-w-sm mx-auto">Looks like you haven't placed any orders yet. Start exploring our collection to find something you love.</p>
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
                                    <CardDescription>Review your saved custom order configurations.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {isQuotesLoading ? (
                                        <div className="text-center py-12">
                                            <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
                                            <p className="mt-2 text-muted-foreground">Loading quotes...</p>
                                        </div>
                                    ) : quotes && quotes.length > 0 ? (
                                        <div className="grid grid-cols-1 gap-6">
                                            {quotes.map((quote) => (
                                                <div key={quote.id} className="border rounded-lg p-6 hover:border-primary/50 transition-colors">
                                                    <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 border-b pb-4 mb-4">
                                                        <div>
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <FileText className="h-4 w-4 text-primary" />
                                                                <p className="font-semibold">Custom Order Quote</p>
                                                            </div>
                                                            <p className="text-xs text-muted-foreground">
                                                                Saved on {quote.createdAt?.seconds ? format(new Date(quote.createdAt.seconds * 1000), 'MMMM d, yyyy') : 'Recently'}
                                                            </p>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                                                                Saved
                                                            </Badge>
                                                            <p className="font-headline text-xl">${quote.totalPrice.toFixed(2)}</p>
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-sm mb-6">
                                                        {quote.displayDetails && Object.entries(quote.displayDetails).map(([key, value]) => (
                                                            <div key={key} className="flex justify-between border-b border-dashed py-1 last:border-0 border-muted">
                                                                <span className="text-muted-foreground">{key}</span>
                                                                <span className="font-medium text-right">{value}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className="flex justify-end gap-2">
                                                        <Button variant="outline" size="sm" onClick={() => router.push('/custom-order')}>
                                                            Edit Design
                                                        </Button>
                                                        <Button size="sm" onClick={() => router.push('/custom-order')}>
                                                            Order Now
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-16 px-4">
                                            <div className="bg-muted/50 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                                                <FileText className="h-8 w-8 text-muted-foreground" />
                                            </div>
                                            <h3 className="text-lg font-semibold mb-2">No saved quotes</h3>
                                            <p className="text-muted-foreground mb-6 max-w-sm mx-auto">You haven't saved any custom orders yet. Use our custom designer to create your dream stationery.</p>
                                            <Button onClick={() => router.push('/custom-order')}>Create Custom Order</Button>
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
                                    <form onSubmit={handleUpdateProfile} className="space-y-4 max-w-md">
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
                                        <div className="pt-2">
                                            <Button type="submit" disabled={isUpdatingProfile}>
                                                {isUpdatingProfile ? (
                                                    <>
                                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                        Saving...
                                                    </>
                                                ) : 'Save Changes'}
                                            </Button>
                                        </div>
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
