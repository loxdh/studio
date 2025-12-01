'use client';
import { useState } from 'react';
import Image from 'next/image';
import type { Product } from '@/lib/products';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/hooks/useCart';
import { Minus, Plus } from 'lucide-react';

type ProductDetailClientProps = {
  product: Product;
};

export default function ProductDetailClient({
  product,
}: ProductDetailClientProps) {
  const productImage = PlaceHolderImages.find(
    (img) => img.id === product.image
  );
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };
  
  const increment = () => setQuantity(q => q + 1);
  const decrement = () => setQuantity(q => Math.max(1, q - 1));

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="relative aspect-[3/4] overflow-hidden rounded-lg shadow-lg">
          {productImage && (
            <Image
              src={productImage.imageUrl}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              data-ai-hint={productImage.imageHint}
              priority
            />
          )}
        </div>
        <div className="flex flex-col justify-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            {product.category}
          </p>
          <h1 className="font-headline text-4xl md:text-5xl mt-2">
            {product.name}
          </h1>
          <p className="mt-4 text-2xl font-semibold text-primary">
            ${product.price.toFixed(2)}
          </p>
          <p className="mt-6 text-lg text-muted-foreground">
            {product.description}
          </p>
          <div className="mt-8 flex items-center gap-4">
             <div className="flex items-center gap-2 rounded-md border p-1">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={decrement}>
                    <Minus className="h-4 w-4" />
                </Button>
                <Input 
                    type="number" 
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="h-8 w-12 border-0 text-center shadow-none focus-visible:ring-0"
                />
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={increment}>
                    <Plus className="h-4 w-4" />
                </Button>
            </div>
            <Button size="lg" onClick={handleAddToCart} className="flex-1">
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
