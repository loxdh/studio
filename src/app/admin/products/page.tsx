import ProductManager from '@/components/admin/ProductManager';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function AdminProductsPage() {
  return (
    <div>
      <h1 className="font-headline text-4xl mb-8">Product Management</h1>
      <Card>
        <CardHeader>
          <CardTitle>Product Catalog</CardTitle>
        </CardHeader>
        <CardContent>
            <ProductManager />
        </CardContent>
      </Card>
    </div>
  );
}
