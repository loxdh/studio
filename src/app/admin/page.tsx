import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Package, FileText, Users } from 'lucide-react';

export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="font-headline text-4xl mb-8">Admin Dashboard</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              Currently in the catalog
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Blog Posts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Ready to be generated
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">
              You! (Authentication not implemented)
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
                <p>Use the navigation on the left to manage products and generate blog content using AI. This dashboard provides a central hub for all your e-commerce management needs.</p>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
