import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-01-27.acacia', // Use latest API version or a fixed one
});

export async function POST(request: Request) {
    try {
        const { items, orderId, customerEmail } = await request.json();

        if (!items || items.length === 0) {
            return NextResponse.json({ error: 'No items in cart' }, { status: 400 });
        }

        // Map cart items to Stripe line items
        const lineItems = items.map((item: any) => {
            // Create a description string from customizations
            let description = item.product.description || 'Stationery Item';
            if (item.customizations && Object.keys(item.customizations).length > 0) {
                const customString = Object.entries(item.customizations)
                    .map(([key, value]) => `${key}: ${value}`)
                    .join(', ');
                description = `Customizations: ${customString}`;
            }

            return {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: item.product.name,
                        description: description.substring(0, 1000), // Stripe limit
                        images: item.product.image ? [item.product.image] : [],
                    },
                    unit_amount: Math.round(item.product.price * 100), // Amount in cents
                },
                quantity: item.quantity,
            };
        });

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: `${request.headers.get('origin')}/checkout/success?session_id={CHECKOUT_SESSION_ID}&order_id=${orderId}`,
            cancel_url: `${request.headers.get('origin')}/checkout`,
            customer_email: customerEmail,
            metadata: {
                orderId: orderId,
            },
        });

        return NextResponse.json({ sessionId: session.id });
    } catch (err: any) {
        console.error('Stripe error:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
