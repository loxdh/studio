'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { addDoc, collection, serverTimestamp, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from '@/components/ui/table';
import { Trash2 } from 'lucide-react';

const formSchema = z.object({
    name: z.string().min(2, 'Category name must be at least 2 characters.'),
});

export type Category = {
    id: string;
    name: string;
    slug: string;
    createdAt: any;
};

export default function CategoryManager() {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const categoriesCollection = useMemoFirebase(
        () => collection(firestore, 'categories'),
        [firestore]
    );

    const categoriesQuery = useMemoFirebase(
        () => query(categoriesCollection, orderBy('createdAt', 'desc')),
        [categoriesCollection]
    );

    const { data: categories, isLoading } = useCollection<Category>(categoriesQuery);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true);
        try {
            const slug = values.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

            await addDoc(categoriesCollection, {
                name: values.name,
                slug,
                createdAt: serverTimestamp(),
            });

            toast({
                title: "Success",
                description: "Category added successfully."
            });
            form.reset();
        } catch (error) {
            console.error("Error adding category:", error);
            toast({
                title: "Error",
                description: "Failed to add category.",
                variant: "destructive"
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    async function handleDelete(id: string) {
        if (!confirm("Are you sure you want to delete this category?")) return;

        try {
            await deleteDoc(doc(firestore, 'categories', id));
            toast({
                title: "Success",
                description: "Category deleted."
            });
        } catch (error) {
            console.error("Error deleting category:", error);
            toast({
                title: "Error",
                description: "Failed to delete category.",
                variant: "destructive"
            });
        }
    }

    return (
        <div className="grid gap-8 md:grid-cols-2">
            <div>
                <h2 className="text-xl font-semibold mb-4">Add New Category</h2>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Category Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., Wedding Invitations" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Adding...' : 'Add Category'}
                        </Button>
                    </form>
                </Form>
            </div>

            <div>
                <h2 className="text-xl font-semibold mb-4">Existing Categories</h2>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Slug</TableHead>
                                <TableHead className="w-[100px]">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={3} className="text-center">Loading...</TableCell>
                                </TableRow>
                            ) : categories && categories.length > 0 ? (
                                categories.map((category) => (
                                    <TableRow key={category.id}>
                                        <TableCell className="font-medium">{category.name}</TableCell>
                                        <TableCell className="text-muted-foreground">{category.slug}</TableCell>
                                        <TableCell>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleDelete(category.id)}
                                                className="text-destructive hover:text-destructive/90"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={3} className="text-center text-muted-foreground">No categories found.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}
