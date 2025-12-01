
'use client';

import AddProductForm from '@/components/admin/AddProductForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AddProductPage() {
  const router = useRouter();

  return (
    <div>
       <div className="flex items-center gap-4 mb-8">
        <Button asChild variant="outline" size="icon" className="h-7 w-7">
             <Link href="/admin/products">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
             </Link>
        </Button>
        <h1 className="font-headline text-4xl">Add New Product</h1>
       </div>
      <Card>
        <CardHeader>
          <CardTitle>Product Details</CardTitle>
          <CardDescription>
            Fill out the details below to add a new product to your catalog.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AddProductForm onProductAdded={() => router.push('/admin/products')} />
        </CardContent>
      </Card>
    </div>
  );
}
