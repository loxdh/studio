'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/products';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { useWishlist } from '@/hooks/useWishlist';
import { cn } from '@/lib/utils';

type ProductCardProps = {
  product: Product;
};

const ProductCard = ({ product }: ProductCardProps) => {
  const productImage = PlaceHolderImages.find(
    (img) => img.id === product.image
  );
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const inWishlist = isInWishlist(product.id);

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <Link href={`/products/${product.slug}`} className="block relative group">
      <Card className="overflow-hidden rounded-lg border-2 border-transparent transition-all hover:border-primary hover:shadow-xl">
        <CardHeader className="p-0">
          <div className="relative h-96 w-full">
            {(productImage || product.image.startsWith('http')) && (
              <Image
                src={productImage ? productImage.imageUrl : product.image}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                data-ai-hint={productImage?.imageHint}
              />
            )}
            <Button
              size="icon"
              variant="secondary"
              className={cn(
                "absolute top-2 right-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity",
                inWishlist && "opacity-100 text-red-500 bg-white/90 hover:bg-white"
              )}
              onClick={toggleWishlist}
            >
              <Heart className={cn("h-5 w-5", inWishlist && "fill-current")} />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <h3 className="truncate font-headline text-lg">{product.name}</h3>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <p className="text-base font-semibold text-primary">
            ${product.price.toFixed(2)}
          </p>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default ProductCard;
