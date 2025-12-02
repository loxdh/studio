'use client';

import { QuoteEmail, AdminQuoteEmail, OrderConfirmationEmail } from '@/emails/QuoteEmail';

export default function TestEmailPage() {
    const mockQuoteDetails = {
        invitationType: 'Acrylic',
        quantity: 100,
        material: '0.5mm - Basic Acrylics',
        shape: 'Arch',
        estimatedTotal: 450.00
    };

    return (
        <div className="p-8 space-y-8 bg-gray-100 min-h-screen">
            <h1 className="text-2xl font-bold">Email Template Previews</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-4 rounded shadow">
                    <h2 className="text-xl font-semibold mb-4 border-b pb-2">Customer: Quote Saved</h2>
                    <QuoteEmail
                        customerName="John"
                        quoteId="12345678-abcd"
                        details={mockQuoteDetails}
                    />
                </div>

                <div className="bg-white p-4 rounded shadow">
                    <h2 className="text-xl font-semibold mb-4 border-b pb-2">Admin: New Quote</h2>
                    <AdminQuoteEmail
                        customerName="user_123"
                        quoteId="12345678-abcd"
                        details={mockQuoteDetails}
                    />
                </div>

                <div className="bg-white p-4 rounded shadow">
                    <h2 className="text-xl font-semibold mb-4 border-b pb-2">Customer: Order Confirmed</h2>
                    <OrderConfirmationEmail
                        orderId="order_987654321"
                        customerEmail="john@example.com"
                        total={520.50}
                    />
                </div>
            </div>
        </div>
    );
}
