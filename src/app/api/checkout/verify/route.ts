import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-01-27.acacia',
});

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
        return NextResponse.json({ error: 'Missing session_id' }, { status: 400 });
    }

    try {
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        if (session.payment_status === 'paid') {
            return NextResponse.json({ status: 'paid', orderId: session.metadata?.orderId });
        } else {
            return NextResponse.json({ status: session.payment_status });
        }
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
