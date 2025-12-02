'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

export default function SearchBar() {
    const [query, setQuery] = useState('');
    const router = useRouter();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/products?search=${encodeURIComponent(query)}`);
        }
    };

    return (
        <form onSubmit={handleSearch} className="relative w-full max-w-sm hidden md:flex items-center">
            <Input
                type="search"
                placeholder="Search products..."
                className="pr-10"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
            <Button
                type="submit"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full hover:bg-transparent"
            >
                <Search className="h-4 w-4 text-muted-foreground" />
                <span className="sr-only">Search</span>
            </Button>
        </form>
    );
}
