'use client';

import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Link from 'next/link';
import { useUser, useFirestore } from '@/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe
const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise = stripeKey ? loadStripe(stripeKey) : null;

if (!stripeKey) {
    console.error("Stripe Publishable Key is missing. Checkout will not work.");
}

const checkoutSchema = z.object({
    firstName: z.string().min(2, 'First name is required'),
    lastName: z.string().min(2, 'Last name is required'),
    email: z.string().email('Invalid email address'),
    address: z.string().min(5, 'Address is required'),
    city: z.string().min(2, 'City is required'),
    zipCode: z.string().min(5, 'Valid Zip Code is required'),
    // Removed card details as Stripe handles them
});

export default function CheckoutPage() {
    const { cartItems, cartTotal } = useCart();
    const { toast } = useToast();
    const router = useRouter();
    const { user } = useUser();
    const firestore = useFirestore();

    const form = useForm<z.infer<typeof checkoutSchema>>({
        resolver: zodResolver(checkoutSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            email: user?.email || '',
            address: '',
            city: '',
            zipCode: '',
        },
    });

    const onSubmit = async (values: z.infer<typeof checkoutSchema>) => {
        try {
            if (!firestore || !user) {
                toast({
                    title: "Error",
                    description: "You must be logged in to checkout.",
                    variant: "destructive"
                });
                router.push('/login');
                return;
            }

            // 1. Create Order in Firestore (Pending Payment)
            const orderRef = await addDoc(collection(firestore, 'orders'), {
                userId: user.uid,
                items: cartItems,
                total: cartTotal,
                status: 'pending_payment',
                shippingDetails: {
                    firstName: values.firstName,
                    lastName: values.lastName,
                    email: values.email,
                    address: values.address,
                    city: values.city,
                    zipCode: values.zipCode
                },
                createdAt: serverTimestamp()
            });

            // 2. Create Stripe Checkout Session
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    items: cartItems,
                    orderId: orderRef.id,
                    customerEmail: values.email,
                }),
            });

            const { sessionId, error } = await response.json();

            if (error) {
                throw new Error(error);
            }

            // 3. Redirect to Stripe
            // 3. Redirect to Stripe
            if (!stripePromise) {
                throw new Error("Stripe is not configured. Please check your environment variables.");
            }

            const stripe = await stripePromise;
            if (stripe) {
                const { error: stripeError } = await stripe.redirectToCheckout({ sessionId });
                if (stripeError) {
                    throw new Error(stripeError.message);
                }
            }

        } catch (error: any) {
            console.error("Error placing order:", error);
            toast({
                title: "Error",
                description: error.message || "Failed to initiate checkout.",
                variant: "destructive"
            });
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <h1 className="text-3xl font-headline mb-4">Your Cart is Empty</h1>
                <p className="text-muted-foreground mb-8">Add some beautiful stationery to your cart to proceed.</p>
                <Button asChild>
                    <Link href="/products">Shop Now</Link>
                </Button>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-16">
            <h1 className="font-headline text-4xl mb-8 text-center">Checkout</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Checkout Form */}
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Shipping Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="firstName"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>First Name</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="John" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="lastName"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Last Name</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Doe" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="john.doe@example.com" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="address"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Address</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="123 Main St" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="city"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>City</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="New York" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="zipCode"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Zip Code</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="10001" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <Separator className="my-4" />

                                    <div className="bg-muted/30 p-4 rounded-lg">
                                        <p className="text-sm text-muted-foreground mb-2">
                                            You will be redirected to Stripe to securely complete your payment.
                                        </p>
                                    </div>

                                    <Button type="submit" className="w-full" size="lg" disabled={form.formState.isSubmitting}>
                                        {form.formState.isSubmitting ? 'Processing...' : `Proceed to Payment ($${cartTotal.toFixed(2)})`}
                                    </Button>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                </div>

                {/* Order Summary */}
                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {cartItems.map((item, index) => {
                                const productImage = PlaceHolderImages.find(
                                    (img) => img.id === item.product.image
                                );
                                return (
                                    <div key={`${item.product.id}-${index}`} className="flex gap-4">
                                        <div className="relative h-16 w-16 overflow-hidden rounded-md border">
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
                                            <h4 className="font-medium text-sm line-clamp-2">{item.product.name}</h4>
                                            <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                                            {item.customizations && Object.keys(item.customizations).length > 0 && (
                                                <div className="mt-1 text-xs text-muted-foreground">
                                                    {Object.entries(item.customizations).map(([key, value]) => (
                                                        <span key={key} className="block">{key}: {value}</span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        <div className="text-sm font-medium">
                                            ${(item.product.price * item.quantity).toFixed(2)}
                                        </div>
                                    </div>
                                )
                            })}
                            <Separator />
                            <div className="flex justify-between font-medium">
                                <span>Total</span>
                                <span>${cartTotal.toFixed(2)}</span>
                            </div>
                        </CardContent>
                        <CardFooter className="bg-muted/50 p-4 text-xs text-muted-foreground">
                            <p>Secure checkout powered by Stripe.</p>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    );
}
