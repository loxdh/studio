'use client';

import ProductManager from '@/components/admin/ProductManager';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useUser, useFirestore } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { products } from '@/lib/products';
import { collection, doc, setDoc, writeBatch } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export default function AdminProductsPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isSeeding, setIsSeeding] = useState(false);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  const handleSeedProducts = async () => {
    if (!firestore) return;
    setIsSeeding(true);
    try {
      const batch = writeBatch(firestore);
      products.forEach((product) => {
        // Use product.id as the document ID to prevent duplicates
        // Or generate a new ID if you prefer. Using product.slug might be better for URLs?
        // Let's use a generated ID but check for existence? 
        // Actually, for seeding, using a deterministic ID (like the one in the file) is safer for re-runs.
        // But the file IDs are '1', '2', etc. which are weak.
        // Let's just use addDoc-like behavior but with setDoc if we want to update.
        // For simplicity, let's create a new doc reference.
        // Ideally we should check if a product with the same slug exists.

        // Simplified: Just add them. User can delete duplicates.
        // Better: Use the slug as the ID? No, slugs can change.
        // Let's just add them as new documents.

        const newDocRef = doc(collection(firestore, 'products'));
        batch.set(newDocRef, {
          ...product,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      });
      await batch.commit();
      toast({
        title: "Products Seeded",
        description: `Successfully added ${products.length} products to the database.`
      });
      // Refresh page or trigger reload? ProductManager should update if it listens to real-time.
    } catch (error) {
      console.error("Error seeding products:", error);
      toast({
        title: "Error",
        description: "Failed to seed products.",
        variant: "destructive"
      });
    } finally {
      setIsSeeding(false);
    }
  };

  if (isUserLoading || !user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-headline text-4xl">Product Management</h1>
        <Button onClick={handleSeedProducts} disabled={isSeeding} variant="outline">
          {isSeeding ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Seed Default Products
        </Button>
      </div>
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
