'use client';

import { createContext, useState, ReactNode } from 'react';
import type { Product } from '@/lib/products';
import { useToast } from '@/hooks/use-toast';

export type CartItem = {
  product: Product;
  quantity: number;
  customizations?: Record<string, string>;
};

export type CartContextType = {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number, customizations?: Record<string, string>) => void;
  removeFromCart: (productId: string, customizations?: Record<string, string>) => void;
  updateQuantity: (productId: string, quantity: number, customizations?: Record<string, string>) => void;
  cartTotal: number;
};

export const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { toast } = useToast();

  const areCustomizationsEqual = (c1?: Record<string, string>, c2?: Record<string, string>) => {
    if (!c1 && !c2) return true;
    if (!c1 || !c2) return false;
    const keys1 = Object.keys(c1);
    const keys2 = Object.keys(c2);
    if (keys1.length !== keys2.length) return false;
    return keys1.every(key => c1[key] === c2[key]);
  }

  const addToCart = (product: Product, quantity: number = 1, customizations?: Record<string, string>) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) => item.product.id === product.id && areCustomizationsEqual(item.customizations, customizations)
      );
      if (existingItem) {
        return prevItems.map((item) =>
          item.product.id === product.id && areCustomizationsEqual(item.customizations, customizations)
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevItems, { product, quantity, customizations }];
    });
    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const removeFromCart = (productId: string, customizations?: Record<string, string>) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => !(item.product.id === productId && areCustomizationsEqual(item.customizations, customizations)))
    );
    toast({
      title: "Item Removed",
      description: `Item has been removed from your cart.`,
    });
  };

  const updateQuantity = (productId: string, quantity: number, customizations?: Record<string, string>) => {
    if (quantity <= 0) {
      removeFromCart(productId, customizations);
    } else {
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.product.id === productId && areCustomizationsEqual(item.customizations, customizations) ? { ...item, quantity } : item
        )
      );
    }
  };

  const cartTotal = cartItems.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
