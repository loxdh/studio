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
import { X, ShoppingBag, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { QUANTITY_OPTIONS } from '@/lib/pricing-data';

export default function CartSheet({ onClose }: { onClose?: () => void }) {
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
            <div className="flex flex-col gap-8 px-6 py-6">
              {cartItems.map((item, index) => {
                const productImage = PlaceHolderImages.find(
                  (img) => img.id === item.product.image
                );
                return (
                  <div key={`${item.product.id}-${index}`} className="flex gap-4 group">
                    <div className="relative h-28 w-24 flex-shrink-0 overflow-hidden rounded-md border bg-muted">
                      {(productImage || item.product.image.startsWith('http')) && (
                        <Image
                          src={productImage ? productImage.imageUrl : item.product.image}
                          alt={item.product.name}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                          sizes="96px"
                          data-ai-hint={productImage?.imageHint}
                        />
                      )}
                    </div>
                    <div className="flex flex-1 flex-col justify-between">
                      <div className="space-y-1">
                        <div className="flex justify-between items-start">
                          <h4 className="font-headline text-lg leading-tight pr-4">
                            {item.product.name}
                          </h4>
                          <button
                            onClick={() => removeFromCart(item.product.id, item.customizations)}
                            className="text-muted-foreground hover:text-destructive transition-colors p-1 -mr-2"
                          >
                            <X className="h-4 w-4" />
                            <span className="sr-only">Remove</span>
                          </button>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          ${item.product.price.toFixed(2)} each
                        </p>

                        {/* Display Customizations */}
                        {item.customizations && Object.keys(item.customizations).length > 0 && (
                          <div className="text-xs text-muted-foreground space-y-1 mt-2 border-l-2 border-muted pl-2">
                            {Object.entries(item.customizations).map(([key, value]) => (
                              <div key={key} className="flex gap-1">
                                <span className="font-medium opacity-70">{key}:</span>
                                <span>{value}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <div className="w-[140px]">
                          {item.product.name.toLowerCase().includes('deposit') ? (
                            <div className="h-9 flex items-center px-3 border rounded-md bg-muted/50 text-sm text-muted-foreground">
                              Qty: 1
                            </div>
                          ) : (
                            <Select
                              value={item.quantity.toString()}
                              onValueChange={(val) => updateQuantity(item.product.id, parseInt(val), item.customizations)}
                            >
                              <SelectTrigger className="h-9">
                                <SelectValue placeholder="Qty" />
                              </SelectTrigger>
                              <SelectContent>
                                {QUANTITY_OPTIONS.map((num) => (
                                  <SelectItem key={num} value={num.toString()}>
                                    Set of {num}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        </div>
                        <p className="font-semibold text-primary">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
          <Separator />
          <SheetFooter className="px-6 py-6 bg-muted/10">
            <div className="w-full space-y-4">
              {/* Free Shipping Progress */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Free Shipping ($500.00)</span>
                  <span>{Math.min(100, (cartTotal / 500) * 100).toFixed(0)}%</span>
                </div>
                <Progress value={Math.min(100, (cartTotal / 500) * 100)} className="h-1" />
                {cartTotal < 500 && (
                  <p className="text-xs text-center text-muted-foreground">
                    Add <span className="font-medium text-foreground">${(500 - cartTotal).toFixed(2)}</span> more to unlock free shipping
                  </p>
                )}
                {cartTotal >= 500 && (
                  <p className="text-xs text-center text-green-600 font-medium flex items-center justify-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-600" />
                    You've unlocked free shipping!
                  </p>
                )}
              </div>

              <div className="space-y-2 pt-2">
                <div className="flex justify-between text-base">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-semibold">${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
              </div>

              <Button className="w-full h-12 text-base rounded-full shadow-md hover:shadow-lg transition-all" size="lg" asChild>
                <Link href="/checkout" className="flex items-center justify-center gap-2" onClick={onClose}>
                  Proceed to Checkout <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </SheetFooter>
        </>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center p-8">
          <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center">
            <ShoppingBag className="h-10 w-10 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <h3 className='font-headline text-2xl'>Your cart is empty</h3>
            <p className='text-muted-foreground max-w-xs mx-auto'>
              Looks like you haven't added anything to your cart yet.
            </p>
          </div>
          <Button asChild size="lg" className="rounded-full px-8">
            <Link href="/products">Start Shopping</Link>
          </Button>
        </div>
      )}
    </SheetContent>
  );
}
