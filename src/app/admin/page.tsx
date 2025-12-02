'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Package, FileText, Users, ShoppingBag, DollarSign } from 'lucide-react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';

export default function AdminDashboardPage() {
  const firestore = useFirestore();

  // Products
  const productsCollection = useMemoFirebase(() => collection(firestore, 'products'), [firestore]);
  const { data: products } = useCollection(productsCollection);

  // Orders
  const ordersCollection = useMemoFirebase(() => collection(firestore, 'orders'), [firestore]);
  const { data: orders } = useCollection(ordersCollection);

  // Blog Posts
  const blogCollection = useMemoFirebase(() => collection(firestore, 'blog_posts'), [firestore]);
  const { data: blogPosts } = useCollection(blogCollection);

  // Calculate Revenue (Mock logic: sum of all orders for now, ideally filter by status 'paid')
  const totalRevenue = orders?.reduce((acc, order) => acc + (order.total || 0), 0) || 0;

  return (
    <div>
      <h1 className="font-headline text-4xl mb-8">Admin Dashboard</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Across {orders?.length || 0} orders
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              Total orders placed
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              Active in catalog
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Blog Posts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{blogPosts?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              Published posts
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Welcome, Administrator!</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Use the navigation on the left to manage products, view orders, and generate blog content using AI. This dashboard provides a central hub for all your e-commerce management needs.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
