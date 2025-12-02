'use client';
import { useState } from 'react';
import Image from 'next/image';
import type { Product } from '@/lib/products';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCart } from '@/hooks/useCart';
import { Minus, Plus, Heart } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where, limit } from 'firebase/firestore';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useWishlist } from '@/hooks/useWishlist';

const ReviewForm = dynamic(() => import('./ReviewForm'), { ssr: false });
const ReviewList = dynamic(() => import('./ReviewList'), { ssr: false });
import { cn } from '@/lib/utils';
import SocialShare from './SocialShare';

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
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const [quantity, setQuantity] = useState(1);
  const [customizations, setCustomizations] = useState<Record<string, string>>({});

  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product, quantity, customizations);
  };

  const toggleWishlist = () => {
    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const increment = () => setQuantity(q => q + 1);
  const decrement = () => setQuantity(q => Math.max(1, q - 1));

  const handleCustomizationChange = (key: string, value: string) => {
    setCustomizations(prev => ({ ...prev, [key]: value }));
  }

  // Custom Builder State (Example)
  const [paperType, setPaperType] = useState('');
  const [printMethod, setPrintMethod] = useState('');

  // Fetch Related Products
  const firestore = useFirestore();
  const relatedProductsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    // Simple related logic: same category, exclude current, limit 4
    return query(
      collection(firestore, 'products'),
      where('category', '==', product.category),
      limit(5) // Fetch 5 to ensure we have 4 after filtering out current
    );
  }, [firestore, product.category]);

  const { data: relatedProductsRaw } = useCollection<Product>(relatedProductsQuery);
  const relatedProducts = relatedProductsRaw?.filter(p => p.id !== product.id).slice(0, 4);


  if (product.productType === 'custom') {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Section */}
          <div className="relative aspect-[3/4] overflow-hidden rounded-lg shadow-lg">
            <Image
              src={productImage ? productImage.imageUrl : product.image}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Builder Section */}
          <div className="space-y-8">
            <div>
              <h1 className="font-headline text-4xl mb-2">{product.name}</h1>
              <p className="text-muted-foreground">{product.description}</p>
              <SocialShare productUrl={`/products/${product.slug}`} productName={product.name} />
            </div>

            <div className="space-y-6 border p-6 rounded-lg bg-card">
              <h3 className="font-semibold text-lg">Build Your Suite</h3>

              <div className="space-y-2">
                <Label>Paper Type</Label>
                <Select onValueChange={(val) => { setPaperType(val); handleCustomizationChange('Paper Type', val); }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Paper" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cotton">100% Cotton (110lb)</SelectItem>
                    <SelectItem value="double-thick">Double Thick Cotton (220lb)</SelectItem>
                    <SelectItem value="handmade">Handmade Paper</SelectItem>
                    <SelectItem value="acrylic">Acrylic (Clear/Frosted)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Printing Method</Label>
                <Select onValueChange={(val) => { setPrintMethod(val); handleCustomizationChange('Printing Method', val); }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Printing" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="digital">Digital Printing</SelectItem>
                    <SelectItem value="letterpress">Letterpress</SelectItem>
                    <SelectItem value="foil">Gold/Silver Foil</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Additional Notes</Label>
                <Textarea
                  placeholder="Describe your vision, colors, and any specific requirements..."
                  onChange={(e) => handleCustomizationChange('Notes', e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
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
              <Button size="lg" onClick={handleAddToCart} className="flex-1" disabled={!paperType || !printMethod}>
                Add to Quote / Cart
              </Button>
              <Button size="icon" variant="outline" className="h-12 w-12" onClick={toggleWishlist}>
                <Heart className={cn("h-6 w-6", inWishlist && "fill-current text-red-500")} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24">
        <div className="relative aspect-[3/4] overflow-hidden rounded-lg shadow-lg group">
          {(productImage || product.image.startsWith('http')) && (
            <Dialog>
              <DialogTrigger asChild>
                <div className="cursor-zoom-in relative w-full h-full">
                  <Image
                    src={productImage ? productImage.imageUrl : product.image}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    data-ai-hint={productImage?.imageHint}
                    priority
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                </div>
              </DialogTrigger>
              <DialogContent className="max-w-4xl w-full h-[90vh] p-0 overflow-hidden bg-transparent border-none shadow-none">
                <div className="relative w-full h-full">
                  <Image
                    src={productImage ? productImage.imageUrl : product.image}
                    alt={product.name}
                    fill
                    className="object-contain"
                    sizes="100vw"
                    priority
                  />
                </div>
              </DialogContent>
            </Dialog>
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

          <SocialShare productUrl={`/products/${product.slug}`} productName={product.name} />

          {/* Customization Fields for Premade */}
          {product.customizationOptions && (
            <div className="mt-8 space-y-4 border-t pt-6">
              <h3 className="font-semibold text-lg">Personalize Your Design</h3>
              {product.customizationOptions.map((option) => (
                <div key={option} className="space-y-2">
                  <Label>{option}</Label>
                  <Input
                    placeholder={`Enter ${option}`}
                    onChange={(e) => handleCustomizationChange(option, e.target.value)}
                  />
                </div>
              ))}
            </div>
          )}

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
            <Button size="icon" variant="outline" className="h-12 w-12" onClick={toggleWishlist}>
              <Heart className={cn("h-6 w-6", inWishlist && "fill-current text-red-500")} />
            </Button>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts && relatedProducts.length > 0 && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 mb-24">
          <h2 className="font-headline text-3xl text-center">You May Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((related) => {
              const relatedImage = PlaceHolderImages.find(
                (img) => img.id === related.image
              );
              return (
                <Link key={related.id} href={`/products/${related.slug}`} className="group block">
                  <div className="relative aspect-[3/4] overflow-hidden rounded-md bg-muted mb-3">
                    {(relatedImage || related.image.startsWith('http')) && (
                      <Image
                        src={relatedImage ? relatedImage.imageUrl : related.image}
                        alt={related.name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    )}
                  </div>
                  <h3 className="font-medium truncate">{related.name}</h3>
                  <p className="text-sm text-muted-foreground">${related.price.toFixed(2)}</p>
                </Link>
              )
            })}
          </div>
        </div>
      )}

      {/* Reviews Section */}
      <div className="max-w-3xl mx-auto space-y-12 border-t pt-16">
        <div className="text-center">
          <h2 className="font-headline text-3xl mb-4">Customer Reviews</h2>
          <p className="text-muted-foreground">See what others are saying about this product.</p>
        </div>

        <ReviewList productId={product.id} />
        <ReviewForm productId={product.id} />
      </div>
    </div>
  );
}
