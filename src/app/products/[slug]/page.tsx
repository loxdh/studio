
'use client';
import { notFound } from 'next/navigation';
import ProductDetailClient from '@/components/products/ProductDetailClient';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import type { Product } from '@/lib/products';
import { collection, query, where, limit } from 'firebase/firestore';

// This function can't be used with a client component that fetches data.
// We will manage metadata within the client component or move to a server component structure later.
// export async function generateMetadata({ params }: Props): Promise<Metadata> {
// }


export default function ProductPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const firestore = useFirestore();

  const productsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'products'), where('slug', '==', slug), limit(1));
  }, [firestore, slug]);

  const { data: products, isLoading } = useCollection<Product>(productsQuery);
  const product = products?.[0];

  // Update metadata dynamically
  if (product?.metaTitle) {
     if (typeof document !== 'undefined') {
      document.title = product.metaTitle;
    }
  }
   if (product?.metaDescription) {
    let metaDescElement = document.querySelector('meta[name="description"]');
    if (!metaDescElement) {
      metaDescElement = document.createElement('meta');
      metaDescElement.setAttribute('name', 'description');
      document.head.appendChild(metaDescElement);
    }
    metaDescElement.setAttribute('content', product.metaDescription);
  }


  if (isLoading) {
    return <div>Loading product...</div>;
  }

  if (!product) {
    notFound();
  }

  return <ProductDetailClient product={product} />;
}

    