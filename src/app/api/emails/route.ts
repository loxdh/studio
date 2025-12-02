import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { QuoteEmail, AdminQuoteEmail, OrderConfirmationEmail } from '@/emails/QuoteEmail';

const resend = new Resend(process.env.RESEND_API_KEY || 're_123456789');

export async function POST(request: Request) {
    const { type, data } = await request.json();

    if (!process.env.RESEND_API_KEY) {
        console.warn("RESEND_API_KEY is missing. Email sending skipped.");
        return NextResponse.json({ success: false, error: "Missing API Key" }, { status: 500 });
    }

    try {
        if (type === 'QUOTE_SAVED') {
            const { userEmail, userId, quoteId, details } = data;

            // 1. Send to Customer
            // Note: In dev/test mode without a domain, Resend only sends to the account email.
            // We'll try to send to the user, but catch errors if domain isn't verified.
            if (userEmail) {
                await resend.emails.send({
                    from: 'Studio <onboarding@resend.dev>', // Default Resend testing email
                    to: [userEmail],
                    subject: 'Your Custom Design Quote Saved',
                    react: QuoteEmail({ customerName: userEmail.split('@')[0], quoteId, details }),
                });
            }

            // 2. Send to Admin
            // Replace with your actual admin email
            const adminEmail = 'admin@example.com';
            await resend.emails.send({
                from: 'Studio <onboarding@resend.dev>',
                to: [adminEmail],
                subject: `New Quote Alert: #${quoteId.slice(0, 8)}`,
                react: AdminQuoteEmail({ customerName: userId, quoteId, details }),
            });

            return NextResponse.json({ success: true });
        }

        if (type === 'ORDER_CONFIRMED') {
            const { orderId, customerEmail, total } = data;

            if (customerEmail) {
                await resend.emails.send({
                    from: 'Studio <onboarding@resend.dev>',
                    to: [customerEmail],
                    subject: `Order Confirmed: #${orderId.slice(0, 8).toUpperCase()}`,
                    react: OrderConfirmationEmail({ orderId, customerEmail, total }),
                });
            }

            // Admin Alert for Order
            const adminEmail = 'admin@example.com';
            await resend.emails.send({
                from: 'Studio <onboarding@resend.dev>',
                to: [adminEmail],
                subject: `New Order: #${orderId.slice(0, 8).toUpperCase()}`,
                html: `<p>New order received for $${total.toFixed(2)}. <a href="http://localhost:9002/admin/orders/${orderId}">View Order</a></p>`
            });

            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ success: false, error: "Invalid email type" }, { status: 400 });

    } catch (error) {
        console.error("Email sending failed:", error);
        return NextResponse.json({ success: false, error }, { status: 500 });
    }
}
