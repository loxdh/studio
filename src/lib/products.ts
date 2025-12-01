
export type Product = {
  id: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  description: string;
  image: string; // Corresponds to id in placeholder-images.json
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
};

const productCategories = [
    "Wedding Invitations",
    "Save the Dates",
    "Box & Folio Invitations",
    "Inserts & Add-Ons"
]

export const categoriesForSelect = productCategories.map(c => ({ label: c, value: c}));


export const products: Product[] = [
  {
    id: '1',
    name: 'Classic Monogram Wedding Invitation',
    slug: 'classic-monogram-invitation',
    category: 'Wedding Invitations',
    price: 4.5,
    description: 'Timeless elegance meets modern design. Our classic monogram invitations are printed on thick, luxurious cardstock with your choice of gold, silver, or rose gold foil.',
    image: 'prod-1',
    metaTitle: 'Classic Monogram Wedding Invitation | United Love Luxe',
    metaDescription: 'Timeless and elegant classic monogram wedding invitations printed on luxurious cardstock with foil options.'
  },
  {
    id: '2',
    name: 'Floral Watercolor Wedding Suite',
    slug: 'floral-watercolor-suite',
    category: 'Wedding Invitations',
    price: 5.75,
    description: 'A romantic and artistic choice, this suite features a delicate watercolor floral design. Fully customizable with your event details.',
    image: 'prod-2',
    metaTitle: 'Floral Watercolor Wedding Suite | United Love Luxe',
    metaDescription: 'Romantic and artistic floral watercolor wedding invitation suite, fully customizable.'
  },
  {
    id: '3',
    name: 'Minimalist Gold Foil Invitation',
    slug: 'minimalist-gold-foil-invitation',
    category: 'Wedding Invitations',
    price: 5.0,
    description: 'For the modern couple, this invitation features clean typography and a touch of stunning gold foil on premium cotton paper.',
    image: 'prod-3',
    metaTitle: 'Minimalist Gold Foil Invitation | United Love Luxe',
    metaDescription: 'Modern and minimalist wedding invitation with clean typography and stunning gold foil.'
  },
  {
    id: '4',
    name: 'Elegant Calligraphy Place Cards',
    slug: 'elegant-calligraphy-place-cards',
    category: 'Inserts & Add-Ons',
    price: 2.25,
    description: 'Guide your guests to their seats with these beautifully lettered place cards. Available in a variety of ink and paper colors.',
    image: 'prod-4',
    metaTitle: 'Elegant Calligraphy Place Cards | United Love Luxe',
    metaDescription: 'Beautifully lettered calligraphy place cards to guide your guests to their seats.'
  },
  {
    id: '5',
    name: 'Luxury Vellum Wrap Invitations',
    slug: 'luxury-vellum-wrap-invitations',
    category: 'Wedding Invitations',
    price: 6.5,
    description: 'Add a layer of sophistication with a translucent vellum wrap, secured with a wax seal or silk ribbon. A truly memorable first impression.',
    image: 'prod-5',
    metaTitle: 'Luxury Vellum Wrap Invitations | United Love Luxe',
    metaDescription: 'Sophisticated and luxurious vellum wrap wedding invitations with wax seal or silk ribbon.'
  },
  {
    id: '6',
    name: 'Custom Wax Seal Stamps',
    slug: 'custom-wax-seal-stamps',
    category: 'Inserts & Add-Ons',
    price: 45.0,
    description: 'Personalize your stationery with a custom brass wax seal stamp featuring your initials, monogram, or custom artwork.',
    image: 'prod-6',
    metaTitle: 'Custom Wax Seal Stamps | United Love Luxe',
    metaDescription: 'Personalize your stationery with a custom brass wax seal stamp with your initials or artwork.'
  },
  {
    id: '7',
    name: 'Personalized Thank You Cards',
    slug: 'personalized-thank-you-cards',
    category: 'Inserts & Add-Ons',
    price: 3.0,
    description: 'Express your gratitude in style with these personalized thank you cards, foiled with your names or monogram.',
    image: 'prod-7',
    metaTitle: 'Personalized Thank You Cards | United Love Luxe',
    metaDescription: 'Express your gratitude with stylish personalized thank you cards with your monogram.'
  },
  {
    id: '8',
    name: 'Save the Date Magnets',
    slug: 'save-the-date-magnets',
    category: 'Save the Dates',
    price: 3.5,
    description: 'A fun and functional way to announce your date. Our save the date magnets are printed on high-quality material with a beautiful matte finish.',
    image: 'prod-8',
    metaTitle: 'Save the Date Magnets | United Love Luxe',
    metaDescription: 'Fun and functional save the date magnets printed on high-quality material.'
  },
];

export const categories = [
  ...new Set(products.map((p) => p.category)),
];
