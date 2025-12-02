import * as React from 'react';

interface QuoteEmailProps {
    customerName: string;
    quoteId: string;
    details: any;
}

export const QuoteEmail: React.FC<QuoteEmailProps> = ({
    customerName,
    quoteId,
    details,
}) => (
    <div style={{ fontFamily: 'sans-serif', color: '#333' }}>
        <h1 style={{ color: '#000' }}>Your Custom Design Quote Saved!</h1>
        <p>Hi {customerName},</p>
        <p>
            Thanks for starting your custom design journey with us. We've saved your quote
            (<strong>#{quoteId.slice(0, 8).toUpperCase()}</strong>) to your account.
        </p>

        <div style={{ border: '1px solid #eee', padding: '20px', borderRadius: '8px', margin: '20px 0' }}>
            <h3 style={{ marginTop: 0 }}>Quote Details</h3>
            <p><strong>Type:</strong> {details.invitationType}</p>
            <p><strong>Quantity:</strong> {details.quantity}</p>
            <p><strong>Material:</strong> {details.material}</p>
            <p><strong>Shape:</strong> {details.shape}</p>
        </div>

        <p>
            You can view your full quote and proceed to booking by logging into your account
            and visiting the "Quotes" tab.
        </p>

        <p>Best,<br />The Studio Team</p>
    </div>
);

export const AdminQuoteEmail: React.FC<QuoteEmailProps> = ({
    customerName,
    quoteId,
    details,
}) => (
    <div style={{ fontFamily: 'sans-serif', color: '#333' }}>
        <h1 style={{ color: '#000' }}>New Quote Received</h1>
        <p>A new custom design quote has been saved.</p>

        <div style={{ border: '1px solid #eee', padding: '20px', borderRadius: '8px', margin: '20px 0' }}>
            <p><strong>Customer ID:</strong> {customerName}</p>
            <p><strong>Quote ID:</strong> {quoteId}</p>
            <hr style={{ borderColor: '#eee', margin: '10px 0' }} />
            <p><strong>Type:</strong> {details.invitationType}</p>
            <p><strong>Quantity:</strong> {details.quantity}</p>
            <p><strong>Est. Total:</strong> ${details.estimatedTotal?.toFixed(2) || 'N/A'}</p>
        </div>

        <a href={`http://localhost:9002/admin/quotes/${quoteId}`} style={{ display: 'inline-block', background: '#000', color: '#fff', padding: '10px 20px', textDecoration: 'none', borderRadius: '4px' }}>
            View in Admin Panel
        </a>
    </div>
);

export const OrderConfirmationEmail: React.FC<{ orderId: string, customerEmail: string, total: number }> = ({
    orderId,
    customerEmail,
    total
}) => (
    <div style={{ fontFamily: 'sans-serif', color: '#333' }}>
        <h1 style={{ color: '#000' }}>Order Confirmed!</h1>
        <p>Hi there,</p>
        <p>
            Thank you for your purchase! Your order <strong>#{orderId.slice(0, 8).toUpperCase()}</strong> has been confirmed.
        </p>

        <div style={{ border: '1px solid #eee', padding: '20px', borderRadius: '8px', margin: '20px 0' }}>
            <p><strong>Order ID:</strong> {orderId}</p>
            <p><strong>Total Paid:</strong> ${total.toFixed(2)}</p>
        </div>

        <p>
            We will notify you when your order ships.
        </p>

        <p>Best,<br />The Studio Team</p>
    </div>
);
