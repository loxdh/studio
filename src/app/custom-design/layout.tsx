import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Custom Order Studio',
    description: 'Create your own bespoke wedding invitations. Choose from acrylic, vellum, or premium paper, and customize every detail from shape to foil color.',
    openGraph: {
        title: 'Custom Order Studio | United Love Luxe',
        description: 'Design your dream wedding stationery with our interactive custom order tool.',
    },
};

export default function CustomDesignLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
