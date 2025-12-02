'use client';
import { useCart } from '@/hooks/useCart';
import {
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Input } from '../ui/input';
import { X } from 'lucide-react';
import Link from 'next/link';

export default function CartSheet() {
  const { cartItems, cartTotal, updateQuantity, removeFromCart } = useCart();

  return (
    <SheetContent className="flex w-full flex-col pr-0 sm:max-w-lg">
      <SheetHeader className="px-6">
        <SheetTitle>Shopping Cart</SheetTitle>
      </SheetHeader>
      <Separator />
      {cartItems.length > 0 ? (
        <>
          <ScrollArea className="flex-1">
            <div className="flex flex-col gap-6 px-6 py-4">
              {cartItems.map((item, index) => {
                const productImage = PlaceHolderImages.find(
                  (img) => img.id === item.product.image
                );
                return (
                  <div key={`${item.product.id}-${index}`} className="flex items-start gap-4">
                    <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md">
                      {(productImage || item.product.image.startsWith('http')) && (
                        <Image
                          src={productImage ? productImage.imageUrl : item.product.image}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                          sizes="96px"
                          data-ai-hint={productImage?.imageHint}
                        />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-headline text-lg">
                        {item.product.name}
                      </h4>
                      <p className="text-sm text-primary">
                        ${item.product.price.toFixed(2)}
                      </p>

                      {/* Display Customizations */}
                      {item.customizations && Object.keys(item.customizations).length > 0 && (
                        <div className="mt-2 text-xs text-muted-foreground space-y-1 bg-muted/50 p-2 rounded">
                          {Object.entries(item.customizations).map(([key, value]) => (
                            <div key={key} className="flex gap-1">
                              <span className="font-semibold">{key}:</span>
                              <span>{value}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="mt-2 flex items-center gap-2">
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) =>
                            updateQuantity(
                              item.product.id,
                              parseInt(e.target.value),
                              item.customizations
                            )
                          }
                          className="h-8 w-16"
                        />
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={() => removeFromCart(item.product.id, item.customizations)}>
                          <X className="h-4 w-4" />
                          <span className="sr-only">Remove item</span>
                        </Button>
                      </div>
                    </div>
                    <p className="font-semibold">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
          <Separator />
          <SheetFooter className="px-6 py-4">
            <div className="w-full space-y-4">
              <div className="flex justify-between text-lg font-semibold">
                <span>Subtotal</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <Button className="w-full" size="lg" asChild>
                <Link href="/checkout">Proceed to Checkout</Link>
              </Button>
            </div>
          </SheetFooter>
        </>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
          <h3 className='font-headline text-2xl'>Your cart is empty</h3>
          <p className='text-muted-foreground'>Add some beautiful stationery to get started.</p>
          <Button asChild>
            <Link href="/products">Continue Shopping</Link>
          </Button>
        </div>
      )}
    </SheetContent>
  );
}
