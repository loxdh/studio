'use client';

import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useParams } from 'next/navigation';
import { Loader2, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';

type Order = {
    id: string;
    total: number;
    status: string;
    createdAt: any;
    shippingDetails: {
        firstName: string;
        lastName: string;
        email: string;
        address: string;
        city: string;
        zipCode: string;
    };
    items: any[];
};

export default function PackingSlipPage() {
    const params = useParams();
    const id = params?.id as string;
    const firestore = useFirestore();
    const [isPrinting, setIsPrinting] = useState(false);

    const docRef = useMemoFirebase(() => {
        if (!firestore || !id) return null;
        return doc(firestore, 'orders', id);
    }, [firestore, id]);

    const { data: order, isLoading } = useDoc<Order>(docRef);

    useEffect(() => {
        if (isPrinting) {
            window.print();
            setIsPrinting(false);
        }
    }, [isPrinting]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (!order) {
        return <div className="p-8">Order not found</div>;
    }

    return (
        <div className="min-h-screen bg-white text-black p-8 max-w-[210mm] mx-auto">
            {/* Print Controls - Hidden when printing */}
            <div className="print:hidden mb-8 flex justify-end">
                <Button onClick={() => setIsPrinting(true)} className="gap-2">
                    <Printer className="h-4 w-4" />
                    Print Packing Slip
                </Button>
            </div>

            {/* Header */}
            <div className="flex justify-between items-start border-b pb-8 mb-8">
                <div>
                    <h1 className="text-3xl font-serif font-bold mb-2">United Love Luxe</h1>
                    <p className="text-sm text-gray-600">Luxury Wedding Stationery</p>
                    <p className="text-sm text-gray-600">123 Design Avenue</p>
                    <p className="text-sm text-gray-600">New York, NY 10001</p>
                    <p className="text-sm text-gray-600">support@unitedloveluxe.com</p>
                </div>
                <div className="text-right">
                    <h2 className="text-2xl font-bold mb-2">PACKING SLIP</h2>
                    <p className="text-sm font-medium">Order #: {order.id.slice(0, 8).toUpperCase()}</p>
                    <p className="text-sm text-gray-600">
                        Date: {order.createdAt?.seconds ? format(new Date(order.createdAt.seconds * 1000), 'MMMM d, yyyy') : 'N/A'}
                    </p>
                </div>
            </div>

            {/* Shipping Info */}
            <div className="mb-12">
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-4">Ship To:</h3>
                <div className="text-lg">
                    <p className="font-bold">{order.shippingDetails.firstName} {order.shippingDetails.lastName}</p>
                    <p>{order.shippingDetails.address}</p>
                    <p>{order.shippingDetails.city}, {order.shippingDetails.zipCode}</p>
                    <p className="text-sm text-gray-600 mt-2">{order.shippingDetails.email}</p>
                </div>
            </div>

            {/* Items Table */}
            <table className="w-full mb-8">
                <thead>
                    <tr className="border-b-2 border-black">
                        <th className="text-left py-3 font-bold uppercase text-sm">Item</th>
                        <th className="text-left py-3 font-bold uppercase text-sm">Description / Customization</th>
                        <th className="text-right py-3 font-bold uppercase text-sm">Qty</th>
                    </tr>
                </thead>
                <tbody>
                    {order.items.map((item: any, index: number) => (
                        <tr key={index} className="border-b border-gray-200">
                            <td className="py-4 align-top font-medium w-1/4">
                                {item.product.name}
                            </td>
                            <td className="py-4 align-top text-sm text-gray-600">
                                {item.customizations && Object.keys(item.customizations).length > 0 ? (
                                    <div className="space-y-1">
                                        {Object.entries(item.customizations).map(([key, value]) => (
                                            <div key={key}>
                                                <span className="font-medium text-black">{key}:</span> {value as string}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <span className="italic text-gray-400">Standard Item</span>
                                )}
                            </td>
                            <td className="py-4 align-top text-right font-medium">
                                {item.quantity}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Footer */}
            <div className="mt-16 text-center text-sm text-gray-500 border-t pt-8">
                <p>Thank you for choosing United Love Luxe for your special day.</p>
                <p>If you have any questions about your order, please contact us at support@unitedloveluxe.com</p>
            </div>

            {/* Print Styles */}
            <style jsx global>{`
                @media print {
                    @page { margin: 0; }
                    body { margin: 1.6cm; }
                    .print\\:hidden { display: none; }
                }
            `}</style>
        </div>
    );
}
