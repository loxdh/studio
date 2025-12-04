'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '../ui/textarea';
import {
    useFirestore,
    addDocumentNonBlocking,
    updateDocumentNonBlocking,
    useMemoFirebase,
    useCollection
} from '@/firebase';
import { collection, serverTimestamp, query, orderBy, doc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import ImageSelector from './ImageSelector';
import RichTextEditor from './RichTextEditor';
import { Separator } from '../ui/separator';
import { categoriesForSelect, Product } from '@/lib/products';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import Link from 'next/link';
import { useEffect } from 'react';

const formSchema = z.object({
    name: z.string().min(3, 'Name must be at least 3 characters.'),
    description: z.string().min(10, 'Description must be at least 10 characters.'),
    price: z.coerce.number().positive('Price must be a positive number.'),
    category: z.string().min(1, 'Category is required.'),
    image: z.string().min(1, 'Please select an image.'),
    gallery: z.array(z.string()).optional(),
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
    metaKeywords: z.string().optional(),
});

type ProductFormProps = {
    initialData?: Product;
    productId?: string;
    onSuccess: () => void;
}

type Category = {
    id: string;
    name: string;
};

export default function ProductForm({ initialData, productId, onSuccess }: ProductFormProps) {
    const firestore = useFirestore();
    const productsCollection = useMemoFirebase(
        () => collection(firestore, 'products'),
        [firestore]
    );

    const categoriesCollection = useMemoFirebase(
        () => query(collection(firestore, 'categories'), orderBy('name')),
        [firestore]
    );

    const { data: dbCategories, isLoading: isLoadingCategories } = useCollection<Category>(categoriesCollection);

    const { toast } = useToast();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: initialData?.name || '',
            description: initialData?.description || '',
            price: initialData?.price || 0,
            category: initialData?.category || '',
            image: initialData?.image || '',
            gallery: initialData?.gallery || [],
            metaTitle: initialData?.metaTitle || '',
            metaDescription: initialData?.metaDescription || '',
            metaKeywords: initialData?.metaKeywords || '',
        },
    });

    // Reset form when initialData changes (e.g. after fetch)
    useEffect(() => {
        if (initialData) {
            form.reset({
                name: initialData.name || '',
                description: initialData.description || '',
                price: initialData.price || 0,
                category: initialData.category || '',
                image: initialData.image || '',
                gallery: initialData.gallery || [],
                metaTitle: initialData.metaTitle || '',
                metaDescription: initialData.metaDescription || '',
                metaKeywords: initialData.metaKeywords || '',
            });
        }
    }, [initialData, form]);

    function onSubmit(values: z.infer<typeof formSchema>) {
        const productData = {
            ...values,
            slug: values.name
                .toLowerCase()
                .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
                .trim()
                .replace(/\s+/g, '-') // Replace spaces with hyphens
                .replace(/-+/g, '-'), // Prevent multiple hyphens
            updatedAt: serverTimestamp(),
        };

        if (productId && firestore) {
            // Update existing
            const docRef = doc(firestore, 'products', productId);
            updateDocumentNonBlocking(docRef, productData);
            toast({
                title: "Product Updated",
                description: `${values.name} has been updated.`
            });
        } else {
            // Create new
            const newProduct = {
                ...productData,
                createdAt: serverTimestamp(),
            };
            addDocumentNonBlocking(productsCollection, newProduct);
            toast({
                title: "Product Added",
                description: `${values.name} has been added to the catalog.`
            });
        }

        onSuccess();
        if (!productId) {
            form.reset();
        }
    }

    // Merge hardcoded and DB categories, preferring DB
    const availableCategories = dbCategories && dbCategories.length > 0
        ? dbCategories.map(c => ({ label: c.name, value: c.name }))
        : categoriesForSelect;

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Product Name</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g., Classic Monogram Invitation" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <RichTextEditor
                                    content={field.value}
                                    onChange={field.onChange}
                                    placeholder="A detailed description of the product..."
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Price</FormLabel>
                            <FormControl>
                                <Input type="number" step="0.01" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Category</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder={isLoadingCategories ? "Loading categories..." : "Select a category"} />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {availableCategories.map(category => (
                                        <SelectItem key={category.value} value={category.value}>
                                            {category.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <div className="text-xs text-muted-foreground mt-1">
                                Don't see your category? <Link href="/admin/categories" className="text-primary hover:underline">Add it here</Link>.
                            </div>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Product Image</FormLabel>
                            <FormControl>
                                <ImageSelector
                                    selectedImageId={field.value}
                                    galleryImages={form.watch('gallery')}
                                    onImageSelect={(main, gallery) => {
                                        form.setValue('image', main);
                                        form.setValue('gallery', gallery);
                                    }}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Separator className="my-6" />

                <h3 className="text-lg font-medium">SEO Details</h3>
                <p className="text-sm text-muted-foreground -mt-2 mb-4">Optional, but recommended for better search ranking.</p>

                <FormField
                    control={form.control}
                    name="metaTitle"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Meta Title</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g., Elegant Wedding Invitations | United Love Luxe" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="metaDescription"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Meta Description</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Brief summary for search engine results." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="metaKeywords"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Meta Keywords</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g., wedding invitations, luxury stationery, custom invites" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit">{productId ? 'Update Product' : 'Add Product'}</Button>
            </form>
        </Form>
    );
}
