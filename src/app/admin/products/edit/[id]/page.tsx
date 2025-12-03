'use client';

import ProductForm from '@/components/admin/ProductForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Product } from '@/lib/products';

export default function EditProductPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const firestore = useFirestore();
    const docRef = useMemoFirebase(
        () => firestore ? doc(firestore, 'products', params.id) : null,
        [firestore, params.id]
    );

    const { data: product, isLoading } = useDoc<Product>(docRef);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!product) {
        return <div>Product not found</div>;
    }

    return (
        <div>
            <div className="flex items-center gap-4 mb-8">
                <Button asChild variant="outline" size="icon" className="h-7 w-7">
                    <Link href="/admin/products">
                        <ArrowLeft className="h-4 w-4" />
                        <span className="sr-only">Back</span>
                    </Link>
                </Button>
                <h1 className="font-headline text-4xl">Edit Product</h1>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Product Details</CardTitle>
                    <CardDescription>
                        Update the details of your product.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ProductForm
                        initialData={product}
                        productId={params.id}
                        onSuccess={() => router.push('/admin/products')}
                    />
                </CardContent>
            </Card>
        </div>
    );
}
