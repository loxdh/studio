export interface OrderItem {
    product: {
        id: string;
        name: string;
        price: number;
        image: string;
    };
    quantity: number;
    customizations?: Record<string, any>;
}

export interface Order {
    id: string;
    userId: string;
    createdAt: { seconds: number; nanoseconds: number } | any; // Firestore Timestamp
    total: number;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    items: OrderItem[];
    shippingAddress?: {
        line1: string;
        line2?: string;
        city: string;
        state: string;
        postal_code: string;
        country: string;
    };
}
