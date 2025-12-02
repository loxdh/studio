import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { Resend } from 'resend';
import { OrderConfirmationEmail } from '@/emails/QuoteEmail';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy', {
    apiVersion: '2025-01-27.acacia' as any,
});

const resend = new Resend(process.env.RESEND_API_KEY || 're_123456789');

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
        return NextResponse.json({ error: 'Missing session_id' }, { status: 400 });
    }

    try {
        const session = await stripe.checkout.sessions.retrieve(sessionId, {
            expand: ['line_items']
        });

        if (session.payment_status === 'paid') {
            // Send email confirmation
            const customerEmail = session.customer_details?.email;
            const orderId = session.metadata?.orderId || 'Unknown';
            const total = (session.amount_total || 0) / 100;

            if (customerEmail && process.env.RESEND_API_KEY) {
                await resend.emails.send({
                    from: 'Studio <onboarding@resend.dev>',
                    to: [customerEmail],
                    subject: `Order Confirmed: #${orderId.slice(0, 8).toUpperCase()}`,
                    react: OrderConfirmationEmail({ orderId, customerEmail, total }),
                });

                // Admin Alert
                await resend.emails.send({
                    from: 'Studio <onboarding@resend.dev>',
                    to: ['admin@example.com'], // Replace with actual admin email
                    subject: `New Order: #${orderId.slice(0, 8).toUpperCase()}`,
                    html: `<p>New order received for $${total.toFixed(2)}. <a href="http://localhost:9002/admin/orders/${orderId}">View Order</a></p>`
                });
            }

            return NextResponse.json({ status: 'paid', orderId: session.metadata?.orderId });
        } else {
            return NextResponse.json({ status: session.payment_status });
        }
    } catch (err: any) {
        console.error("Verification error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
