'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Package, FileText, Users, ShoppingBag, DollarSign } from 'lucide-react';
import { useCollection, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';

import AdminCharts from '@/components/admin/AdminCharts';

export default function AdminDashboardPage() {
  const firestore = useFirestore();
  const { user } = useUser();

  // Products
  const productsCollection = useMemoFirebase(() => collection(firestore, 'products'), [firestore]);
  const { data: products } = useCollection(productsCollection);

  // Orders - Only fetch if user is authenticated
  const ordersCollection = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return collection(firestore, 'orders');
  }, [firestore, user]);

  const { data: orders } = useCollection(ordersCollection);

  // Calculate Stats
  const totalRevenue = orders?.reduce((acc, order) => acc + (order.total || 0), 0) || 0;
  const totalOrders = orders?.length || 0;
  const pendingOrders = orders?.filter(o => o.status === 'pending').length || 0;
  const processingOrders = orders?.filter(o => o.status === 'processing').length || 0;
  const deliveredOrders = orders?.filter(o => o.status === 'delivered').length || 0;

  // Mock data for SalesOverview (replace with real aggregations later)
  const salesData = {
    today: 0,
    yesterday: 0,
    thisMonth: totalRevenue, // Just using total for now
    lastMonth: 0,
    allTime: totalRevenue
  };

  return (
    <div className="space-y-6">
      <h1 className="font-headline text-4xl mb-8">Admin Dashboard</h1>

      {/* Status Overview */}
      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
        <Card>
          <CardContent className="flex items-center gap-3 p-6">
            <div className="size-12 rounded-full grid place-items-center [&>svg]:size-5 text-orange-600 bg-orange-100">
              <ShoppingBag />
            </div>
            <div className="flex flex-col gap-y-1">
              <span className="text-sm text-muted-foreground">Total Orders</span>
              <span className="text-2xl font-semibold">{totalOrders}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-6">
            <div className="size-12 rounded-full grid place-items-center [&>svg]:size-5 text-teal-600 bg-teal-100">
              <Package />
            </div>
            <div className="flex flex-col gap-y-1">
              <span className="text-sm text-muted-foreground">Pending</span>
              <span className="text-2xl font-semibold">{pendingOrders}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-6">
            <div className="size-12 rounded-full grid place-items-center [&>svg]:size-5 text-blue-600 bg-blue-100">
              <Users />
            </div>
            <div className="flex flex-col gap-y-1">
              <span className="text-sm text-muted-foreground">Processing</span>
              <span className="text-2xl font-semibold">{processingOrders}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-6">
            <div className="size-12 rounded-full grid place-items-center [&>svg]:size-5 text-emerald-600 bg-emerald-100">
              <DollarSign />
            </div>
            <div className="flex flex-col gap-y-1">
              <span className="text-sm text-muted-foreground">Delivered</span>
              <span className="text-2xl font-semibold">{deliveredOrders}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sales Overview */}
      <div className="grid md:grid-cols-2 xl:grid-cols-5 gap-2">
        <div className="p-6 rounded-lg flex flex-col items-center justify-center space-y-3 text-white text-center bg-teal-600">
          <div className="[&>svg]:size-8"><FileText /></div>
          <span className="text-base">Today Orders</span>
          <span className="text-2xl font-semibold">${salesData.today.toFixed(2)}</span>
        </div>
        <div className="p-6 rounded-lg flex flex-col items-center justify-center space-y-3 text-white text-center bg-orange-400">
          <div className="[&>svg]:size-8"><FileText /></div>
          <span className="text-base">Yesterday Orders</span>
          <span className="text-2xl font-semibold">${salesData.yesterday.toFixed(2)}</span>
        </div>
        <div className="p-6 rounded-lg flex flex-col items-center justify-center space-y-3 text-white text-center bg-blue-500">
          <div className="[&>svg]:size-8"><DollarSign /></div>
          <span className="text-base">This Month</span>
          <span className="text-2xl font-semibold">${salesData.thisMonth.toFixed(2)}</span>
        </div>
        <div className="p-6 rounded-lg flex flex-col items-center justify-center space-y-3 text-white text-center bg-cyan-600">
          <div className="[&>svg]:size-8"><DollarSign /></div>
          <span className="text-base">Last Month</span>
          <span className="text-2xl font-semibold">${salesData.lastMonth.toFixed(2)}</span>
        </div>
        <div className="p-6 rounded-lg flex flex-col items-center justify-center space-y-3 text-white text-center bg-emerald-600">
          <div className="[&>svg]:size-8"><DollarSign /></div>
          <span className="text-base">All-Time Sales</span>
          <span className="text-2xl font-semibold">${salesData.allTime.toFixed(2)}</span>
        </div>
      </div>

      {orders && <AdminCharts orders={orders} />}
    </div>
  );
}
