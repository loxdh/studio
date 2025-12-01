// This page will require significant changes to fetch data from Firestore.
// For now, we leave it as is to avoid breaking it, but it will only show static data.
// In a future step, we will make this page dynamic with Firestore.

import { products } from '@/lib/products';
import { notFound } from 'next/navigation';
import ProductDetailClient from '@/components/products/ProductDetailClient';
import type { Metadata } from 'next';

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // This part remains static for now
  const product = products.find((p) => p.slug === params.slug);

  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

  return {
    title: `${product.name} | United Love Luxe`,
    description: product.description,
  };
}


export default function ProductPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  // This part remains static for now
  const product = products.find((p) => p.slug === slug);

  if (!product) {
    notFound();
  }

  return <ProductDetailClient product={product} />;
}

// This needs to be dynamic based on Firestore data in the future
export async function generateStaticParams() {
    // This part remains static for now
  return products.map((product) => ({
    slug: product.slug,
  }));
}
