'use client';

import ProductManager from '@/components/admin/ProductManager';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useUser } from '@/firebase';
import { useRouter }from 'next/navigation';
import { useEffect } from 'react';


export default function AdminProductsPage() {
    const { user, isUserLoading } = useUser();
    const router = useRouter();

    useEffect(() => {
        if (!isUserLoading && !user) {
            router.push('/login');
        }
    }, [user, isUserLoading, router]);

    if (isUserLoading || !user) {
        return <div>Loading...</div>;
    }

  return (
    <div>
      <h1 className="font-headline text-4xl mb-8">Product Management</h1>
      <Card>
        <CardHeader>
          <CardTitle>Product Catalog</CardTitle>
        </CardHeader>
        <CardContent>
            <ProductManager />
        </CardContent>
      </Card>
    </div>
  );
}
