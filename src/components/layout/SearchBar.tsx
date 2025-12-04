'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import type { Product } from '@/lib/products';
import Link from 'next/link';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function SearchBar() {
    const [query, setQuery] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const router = useRouter();
    const containerRef = useRef<HTMLDivElement>(null);

    const firestore = useFirestore();
    const productsCollection = useMemoFirebase(
        () => firestore ? collection(firestore, 'products') : null,
        [firestore]
    );
    const { data: products } = useCollection<Product>(productsCollection);

    const filteredProducts = query.trim() === '' ? [] : products?.filter(product => {
        const searchLower = query.toLowerCase();
        const nameMatch = product.name.toLowerCase().includes(searchLower);
        const categoryMatch = product.category.toLowerCase().includes(searchLower);
        const descriptionMatch = product.description
            .replace(/<[^>]*>?/gm, '') // Strip HTML
            .toLowerCase()
            .includes(searchLower);

        return nameMatch || categoryMatch || descriptionMatch;
    }).slice(0, 5) || [];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsFocused(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            setIsFocused(false);
            router.push(`/products?search=${encodeURIComponent(query)}`);
        }
    };

    return (
        <div ref={containerRef} className="relative w-full max-w-sm hidden md:block">
            <form onSubmit={handleSearch} className="relative flex items-center">
                <Input
                    type="search"
                    placeholder="Search..."
                    className="pr-10 bg-transparent border-black text-black placeholder:text-black/60 focus-visible:ring-black focus-visible:ring-offset-0 rounded-full"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                />
                <Button
                    type="submit"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full hover:bg-transparent"
                >
                    <Search className="h-4 w-4 text-black" />
                    <span className="sr-only">Search</span>
                </Button>
            </form>

            {isFocused && query.trim() !== '' && (
                <div className="absolute top-full left-0 w-full bg-background border rounded-md shadow-lg mt-1 z-50 overflow-hidden">
                    {filteredProducts.length > 0 ? (
                        <ul>
                            {filteredProducts.map(product => {
                                const img = PlaceHolderImages.find(i => i.id === product.image)?.imageUrl || product.image;
                                const isVideo = typeof img === 'string' && (img.endsWith('.mp4') || img.endsWith('.webm') || img.includes('video'));

                                return (
                                    <li key={product.id} className="border-b last:border-0">
                                        <Link
                                            href={`/products/${product.slug}`}
                                            className="flex items-center gap-3 p-3 hover:bg-muted transition-colors"
                                            onClick={() => setIsFocused(false)}
                                        >
                                            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-sm bg-muted">
                                                {(img || product.image.startsWith('http')) && (
                                                    isVideo ? (
                                                        <video
                                                            src={img}
                                                            className="object-cover w-full h-full"
                                                            muted
                                                            playsInline
                                                            loop
                                                        />
                                                    ) : (
                                                        <Image
                                                            src={img}
                                                            alt={product.name}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    )
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium truncate">{product.name}</p>
                                                <p className="text-xs text-muted-foreground">${product.price.toFixed(2)}</p>
                                            </div>
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    ) : (
                        <div className="p-3 text-sm text-muted-foreground text-center">
                            No results found.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
