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

type ProductCardProps = {
  product: Product;
};

const ProductCard = ({ product }: ProductCardProps) => {
  const productImage = PlaceHolderImages.find(
    (img) => img.id === product.image
  );

  return (
    <Link href={`/products/${product.slug}`}>
      <Card className="group overflow-hidden rounded-lg border-2 border-transparent transition-all hover:border-primary hover:shadow-xl">
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
