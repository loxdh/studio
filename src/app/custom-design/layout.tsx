import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Custom Design Studio',
    description: 'Create your own bespoke wedding invitations. Choose from acrylic, vellum, or premium paper, and customize every detail from shape to foil color.',
    openGraph: {
        title: 'Custom Design Studio | United Love Luxe',
        description: 'Design your dream wedding stationery with our interactive custom design tool.',
    },
};

export default function CustomDesignLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
