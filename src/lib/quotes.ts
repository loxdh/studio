export interface Quote {
    id: string;
    userId: string;
    createdAt: { seconds: number; nanoseconds: number } | any; // Firestore Timestamp
    totalPrice: number;
    status: 'saved' | 'ordered';
    configuration: any; // Detailed configuration object
    displayDetails: Record<string, string | number>;
}
