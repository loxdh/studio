import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Shop Luxury Wedding Stationery',
    description: 'Browse our collection of premium wedding invitations, save the dates, and day-of stationery. Filter by style, material, and color.',
    openGraph: {
        title: 'Shop Luxury Wedding Stationery | United Love Luxe',
        description: 'Find the perfect stationery for your special day.',
    },
};

export default function ProductsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
