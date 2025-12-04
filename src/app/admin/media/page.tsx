'use client';

import { MediaLibrary } from '@/components/admin/MediaLibrary';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminMediaPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Media Library</h1>
            <Card>
                <CardHeader>
                    <CardTitle>Manage Images</CardTitle>
                </CardHeader>
                <CardContent>
                    <MediaLibrary onSelect={() => {}} />
                </CardContent>
            </Card>
        </div>
    );
}
