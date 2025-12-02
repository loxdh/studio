'use client';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import type { Product } from '@/lib/products';
import { collection } from 'firebase/firestore';
import { Button } from '../ui/button';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';

export default function ProductManager() {
  const firestore = useFirestore();
  const productsCollection = useMemoFirebase(
    () => collection(firestore, 'products'),
    [firestore]
  );
  const { data: products, isLoading } = useCollection<Product>(productsCollection);

  if (isLoading) {
    return <div>Loading products...</div>;
  }

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button asChild>
          <Link href="/admin/products/add">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Product
          </Link>
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="hidden w-[100px] sm:table-cell">
              <span className="sr-only">Image</span>
            </TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="hidden md:table-cell">Price</TableHead>
            <TableHead>
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products?.map((product) => {
            const productImage = PlaceHolderImages.find(
              (img) => img.id === product.image
            );
            return (
              <TableRow key={product.id}>
                <TableCell className="hidden sm:table-cell">
                  {(productImage || product.image.startsWith('http')) && (
                    <Image
                      alt={product.name}
                      className="aspect-square rounded-md object-cover"
                      height="64"
                      src={productImage ? productImage.imageUrl : product.image}
                      width="64"
                      data-ai-hint={productImage?.imageHint}
                    />
                  )}
                </TableCell>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>
                  <Badge variant="outline">{product.category}</Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  ${product.price.toFixed(2)}
                </TableCell>
                <TableCell>
                  {/* Actions would go here, e.g., Edit, Delete */}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </>
  );
}
