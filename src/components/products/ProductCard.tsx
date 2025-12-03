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

  const secondaryImage = product.gallery && product.gallery.length > 0 ? product.gallery[0] : null;

  return (
    <Link href={`/products/${product.slug}`} className="block relative group">
      <Card className="overflow-hidden rounded-lg border-none shadow-sm transition-all duration-300 hover:shadow-lg">
        <CardHeader className="p-0">
          <div className="relative h-[400px] w-full bg-muted overflow-hidden">
            {/* Main Image */}
            {(productImage || product.image.startsWith('http')) && (
              <Image
                src={productImage ? productImage.imageUrl : product.image}
                alt={product.name}
                fill
                className={cn(
                  "object-cover transition-all duration-500",
                  secondaryImage ? "group-hover:opacity-0" : "group-hover:scale-105"
                )}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                data-ai-hint={productImage?.imageHint}
              />
            )}

            {/* Secondary Image (on Hover) */}
            {secondaryImage && (
              <Image
                src={secondaryImage}
                alt={`${product.name} - Alternate View`}
                fill
                className="object-cover absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
            )}

            {/* Wishlist Button */}
            <Button
              size="icon"
              variant="secondary"
              className={cn(
                "absolute top-3 right-3 h-8 w-8 rounded-full opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 z-10",
                inWishlist && "opacity-100 translate-y-0 text-red-500 bg-white/90 hover:bg-white"
              )}
              onClick={toggleWishlist}
            >
              <Heart className={cn("h-4 w-4", inWishlist && "fill-current")} />
            </Button>

            {/* Quick Add Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/60 to-transparent">
              <Button className="w-full bg-white text-black hover:bg-white/90 font-medium shadow-lg">
                View Details
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-5 text-center">
          <p className="text-xs text-muted-foreground uppercase tracking-widest mb-2">{product.category}</p>
          <h3 className="truncate font-headline text-lg mb-1 group-hover:text-primary transition-colors">{product.name}</h3>
          <p className="text-base font-medium text-primary">
            ${product.price.toFixed(2)}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ProductCard;
