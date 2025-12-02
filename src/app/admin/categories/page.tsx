'use client';

import CategoryManager from '@/components/admin/CategoryManager';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminCategoriesPage() {
    return (
        <div>
            <h1 className="font-headline text-4xl mb-8">Category Management</h1>
            <Card>
                <CardHeader>
                    <CardTitle>Manage Categories</CardTitle>
                </CardHeader>
                <CardContent>
                    <CategoryManager />
                </CardContent>
            </Card>
        </div>
    );
}
