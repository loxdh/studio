export type PricingTier = {
    [key: number]: number; // e.g., { 25: 5.00, 50: 4.50 }
};

export type PricingOption = {
    id: string;
    name: string;
    description?: string;
    price: number; // Base price (per unit)
    type?: 'flat' | 'per_unit'; // 'flat' = one-time fee, 'per_unit' = multiplied by quantity
    tiers?: PricingTier; // Optional: Override price based on quantity
    hex?: string; // For colors
    bgClass?: string; // For styling
    textClass?: string; // For styling
};

export const QUANTITY_OPTIONS = [25, 35, 50, 60, 70, 80, 90, 100, 115, 125, 150, 175, 200];

// --- 1. SHAPES ---
export const SHAPES: PricingOption[] = [
    { id: 'rectangle', name: 'Rectangle', price: 0.00, type: 'per_unit' },
    { id: 'square', name: 'Square', price: 0.00, type: 'per_unit' },
    { id: 'tall', name: 'Tall', price: 1.25, type: 'per_unit' },
    { id: 'hexagon', name: 'Hexagon', price: 0.75, type: 'per_unit' },
    { id: 'rounded', name: 'Rounded', price: 1.00, type: 'per_unit' },
    { id: 'arch', name: 'Arch', price: 1.00, type: 'per_unit' },
    { id: 'circle', name: 'Circle', price: 1.00, type: 'per_unit' },
    { id: 'custom', name: 'Custom Shape', price: 175.00, type: 'flat' },
];

// --- 2. MATERIALS ---
export const ACRYLIC_OPTIONS: PricingOption[] = [
    { id: '0.5mm', name: '0.5mm - Basic Acrylics', price: 1.35, type: 'per_unit' },
    { id: '0.75mm', name: '0.75mm - Premium Acrylics', price: 1.65, type: 'per_unit' },
    { id: '1mm', name: '1mm - Deluxe Acrylics', price: 1.90, type: 'per_unit' },
    { id: '2mm', name: '2mm - Exquisite Acrylics', price: 2.50, type: 'per_unit' },
];

export const VELLUM_OPTIONS: PricingOption[] = [
    { id: 'only_vellum', name: 'Only Vellum', price: 1.25, type: 'per_unit' },
    { id: 'vellum_matte', name: 'Vellum + Matte Paper', price: 2.95, type: 'per_unit' },
    { id: 'vellum_shimmer', name: 'Vellum + Shimmery Paper', price: 3.15, type: 'per_unit' },
    { id: 'vellum_double_matte', name: 'Vellum + Double Thick Matte', price: 4.25, type: 'per_unit' },
    { id: 'vellum_double_shimmer', name: 'Vellum + Double Thick Shimmer', price: 4.75, type: 'per_unit' },
];

export const PAPER_OPTIONS: PricingOption[] = [
    { id: 'premium_matte', name: 'Premium Matte Paper', price: 1.35, type: 'per_unit' },
    { id: 'premium_shimmer', name: 'Premium Shimmery Paper', price: 1.45, type: 'per_unit' },
    { id: 'double_matte', name: 'Double Thick Matte Paper', price: 1.65, type: 'per_unit' },
    { id: 'double_shimmer', name: 'Double Thick Shimmery Paper', price: 1.85, type: 'per_unit' },
    { id: 'extra_thick', name: 'Extra Thick Block Paper', price: 2.35, type: 'per_unit' },
    { id: 'velvet', name: 'Velvet', price: 2.30, type: 'per_unit' },
];

// --- 3. PRINTING ---
export const PRINT_COLORS: PricingOption[] = [
    { id: 'gold', name: 'Gold Foil', price: 4.85, type: 'per_unit', bgClass: 'bg-gradient-to-br from-[#BF953F] via-[#FCF6BA] to-[#B38728]' },
    { id: 'rose_gold', name: 'Rose Gold Foil', price: 4.85, type: 'per_unit', bgClass: 'bg-gradient-to-br from-[#E6C2B6] via-[#F0D6CE] to-[#C9988C]' },
    { id: 'silver', name: 'Silver Foil', price: 4.85, type: 'per_unit', bgClass: 'bg-gradient-to-br from-[#C0C0C0] via-[#E8E8E8] to-[#A0A0A0]' },
    { id: 'copper', name: 'Copper Foil', price: 4.85, type: 'per_unit', bgClass: 'bg-gradient-to-br from-[#B87333] via-[#E6A67C] to-[#8B4513]' },
    { id: 'white', name: 'White Foil', price: 4.85, type: 'per_unit', bgClass: 'bg-gradient-to-br from-[#F5F5F5] via-[#FFFFFF] to-[#E0E0E0] border border-gray-100' },
    { id: 'black', name: 'Black Foil', price: 4.85, type: 'per_unit', bgClass: 'bg-gradient-to-br from-[#2b2b2b] via-[#4a4a4a] to-[#000000]' },
    { id: 'other', name: 'Other Foil Color', price: 5.85, type: 'per_unit', bgClass: 'bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200' },
    { id: 'uv', name: 'UV Print', price: 1.30, type: 'per_unit', bgClass: 'bg-[url("https://www.transparenttextures.com/patterns/diagmonds-light.png")] bg-pink-100', textClass: 'text-black' },
    { id: 'deboss', name: 'Letterpress / Deboss', price: 3.85, type: 'per_unit', bgClass: 'bg-gray-200 shadow-inner' },
    { id: 'emboss', name: 'Emboss', price: 3.85, type: 'per_unit', bgClass: 'bg-gray-100 shadow-lg' },
];

// --- 4. INSERTS ---
export const SUITE_INSERTS_FOIL: PricingOption[] = [
    { id: 'rsvp', name: 'Foil-Pressed RSVP Cards', price: 106.25, description: 'Response cards for your guests.', type: 'per_unit' },
    { id: 'rsvp_envelopes', name: 'Premium RSVP Envelopes', price: 88.75, description: 'Matching envelopes for RSVP cards.', type: 'per_unit' },
    { id: 'thank_you', name: 'Foil-Pressed Thank You Cards', price: 108.75, description: 'Express your gratitude in style.', type: 'per_unit' },
    { id: 'details', name: 'Foil-Pressed Details Cards', price: 106.25, description: 'Event specifics and timelines.', type: 'per_unit' },
    { id: 'direction', name: 'Foil-Pressed Direction Cards', price: 106.25, description: 'Maps and directions to venue.', type: 'per_unit' },
    { id: 'accommodation', name: 'Foil-Pressed Accommodation Cards', price: 106.25, description: 'Hotel and lodging information.', type: 'per_unit' },
    { id: 'reception', name: 'Foil-Pressed Reception Cards', price: 106.25, description: 'Details for the reception party.', type: 'per_unit' },
    { id: 'belly_bands', name: 'Foil-Pressed Belly Bands', price: 82.50, description: 'Wrap your suite together elegantly.', type: 'per_unit' },
];

export const SUITE_INSERTS_DIGITAL: PricingOption[] = [
    { id: 'rsvp', name: 'RSVP Cards', price: 37.00, description: 'Response cards for your guests.', type: 'per_unit' },
    { id: 'rsvp_envelopes', name: 'Premium RSVP Envelopes', price: 38.25, description: 'Matching envelopes for RSVP cards.', type: 'per_unit' },
    { id: 'thank_you', name: 'Foldable Thank You Cards', price: 38.25, description: 'Express your gratitude in style.', type: 'per_unit' },
    { id: 'details', name: 'Details Cards', price: 35.75, description: 'Event specifics and timelines.', type: 'per_unit' },
    { id: 'direction', name: 'Direction Cards', price: 35.75, description: 'Maps and directions to venue.', type: 'per_unit' },
    { id: 'accommodation', name: 'Accommodation Cards', price: 35.75, description: 'Hotel and lodging information.', type: 'per_unit' },
    { id: 'reception', name: 'Reception Cards', price: 35.75, description: 'Details for the reception party.', type: 'per_unit' },
    { id: 'belly_bands', name: 'Belly Bands', price: 32.00, description: 'Wrap your suite together elegantly.', type: 'per_unit' },
];

// --- 5. SERVICES ---
export const SERVICE_ADD_ONS: PricingOption[] = [
    { id: 'assembly', name: 'Assembly', price: 39.13, type: 'per_unit' },
    { id: 'rush', name: 'Rush Order', price: 92.50, type: 'flat' },
    { id: 'minor_custom', name: 'Minor Customization', price: 45.80, type: 'flat' },
    { id: 'scratch_design', name: 'Design From Scratch', price: 89.00, type: 'flat' },
    { id: 'custom_sketch', name: 'Custom Sketch', price: 245.00, type: 'flat' },
    { id: 'mailing', name: 'Mailing Service', price: 256.00, type: 'flat' },
];

// --- 6. ENVELOPES ---
export const ENVELOPE_MATERIALS: PricingOption[] = [
    { id: 'basic_white', name: 'Basic White Mailing Envelope', price: 2.10, type: 'per_unit' },
    { id: 'vellum', name: 'Vellum', price: 2.20, type: 'per_unit' },
    { id: 'matte', name: 'Premium Matte Paper', price: 2.29, type: 'per_unit' },
    { id: 'shimmer', name: 'Premium Shimmery Paper', price: 2.35, type: 'per_unit' },
    { id: 'velvet', name: 'Velvet', price: 3.10, type: 'per_unit' },
];

export const ENVELOPE_COLORS: PricingOption[] = [
    { id: 'white', name: 'White', price: 0.00, hex: '#FFFFFF', type: 'per_unit' },
    { id: 'ivory', name: 'Ivory', price: 0.00, hex: '#F5F5DC', type: 'per_unit' },
    { id: 'black', name: 'Black', price: 0.00, hex: '#000000', type: 'per_unit' },
    { id: 'grey', name: 'Grey', price: 1.40, hex: '#808080', type: 'per_unit' },
    { id: 'sage', name: 'Sage', price: 1.40, hex: '#8A9A5B', type: 'per_unit' },
    { id: 'navy', name: 'Navy', price: 1.40, hex: '#000080', type: 'per_unit' },
    { id: 'burgundy', name: 'Burgundy', price: 1.40, hex: '#800020', type: 'per_unit' },
    { id: 'dusty_blue', name: 'Dusty Blue', price: 1.80, hex: '#779ECB', type: 'per_unit' },
    { id: 'emerald', name: 'Emerald', price: 1.80, hex: '#50C878', type: 'per_unit' },
    { id: 'terracotta', name: 'Terracotta', price: 1.80, hex: '#E2725B', type: 'per_unit' },
];

export const ENVELOPE_EMBELLISHMENTS: PricingOption[] = [
    { id: 'monogram_foil', name: 'Monogram Foil-Pressed', price: 3.45, type: 'per_unit' },
    { id: 'monogram_black', name: 'Monogram Printed (Black Ink)', price: 1.86, type: 'per_unit' },
    { id: 'monogram_color', name: 'Monogram Printed (Color Ink)', price: 1.90, type: 'per_unit' },
    { id: 'monogram_white', name: 'Monogram Printed (White Ink)', price: 2.05, type: 'per_unit' },
    { id: 'outer_foil', name: 'Outer Envelope Foil Design', price: 3.85, type: 'per_unit' },
    { id: 'outer_print', name: 'Outer Envelope Printed Design', price: 1.85, type: 'per_unit' },
    { id: 'return_foil', name: 'Return Address Foil-Pressed', price: 3.05, type: 'per_unit' },
    { id: 'return_black', name: 'Return Address Printed (Black Ink)', price: 1.06, type: 'per_unit' },
    { id: 'return_color', name: 'Return Address Printed (Color Ink)', price: 1.10, type: 'per_unit' },
    { id: 'return_white', name: 'Return Address Printed (White Ink)', price: 1.20, type: 'per_unit' },
];

export const ENVELOPE_LINERS: PricingOption[] = [
    { id: 'plain', name: 'Liner Plain', price: 0.80, type: 'per_unit' },
    { id: 'digital', name: 'Liner Digital Printed', price: 1.24, type: 'per_unit' },
    { id: 'foil', name: 'Liner Foil-Pressed', price: 5.05, type: 'per_unit' },
    { id: 'direct_foil', name: 'Directly Foil-Pressed Inside', price: 4.85, type: 'per_unit' },
    { id: 'velvet', name: 'Velvet Liner', price: 1.12, type: 'per_unit' },
    { id: 'velvet_foil', name: 'Velvet Liner Foil-Pressed', price: 5.42, type: 'per_unit' },
];

export const ENVELOPE_SEALS: PricingOption[] = [
    { id: 'wax_standard', name: 'Standard Wax Seals', price: 0.84, type: 'per_unit' },
    { id: 'wax_custom', name: 'Custom Wax Seals', price: 1.68, type: 'per_unit' },
    { id: 'clear_foil', name: 'Clear Seals with Standard Foil', price: 0.45, type: 'per_unit' },
    { id: 'clear_custom', name: 'Clear Seals with Custom Foil', price: 1.07, type: 'per_unit' },
];

export const ENVELOPE_ADDRESSING: PricingOption[] = [
    { id: 'guest_foil_gold', name: 'Guest Addressing - Clear Labels (Gold Foil)', price: 0.80, type: 'per_unit' },
    { id: 'guest_foil_silver', name: 'Guest Addressing - Clear Labels (Silver Foil)', price: 0.80, type: 'per_unit' },
    { id: 'guest_digital', name: 'Guest Addressing - Labels (Digital Color)', price: 0.70, type: 'per_unit' },
    { id: 'guest_print_black', name: 'Guest Address Printing (Black Ink)', price: 1.18, type: 'per_unit' },
    { id: 'guest_print_color', name: 'Guest Address Printing (Color Ink)', price: 1.25, type: 'per_unit' },
    { id: 'guest_print_white', name: 'Guest Address Printing (White Ink)', price: 1.30, type: 'per_unit' },
];

// --- 7. POCKETS ---
export const POCKET_MATERIALS: PricingOption[] = [
    { id: 'matte', name: 'Premium Matte Paper', price: 1.90, type: 'per_unit' },
    { id: 'shimmer', name: 'Premium Shimmery Paper', price: 2.10, type: 'per_unit' },
    { id: 'velvet', name: 'Velvet', price: 3.60, type: 'per_unit' },
];

export const POCKET_COLORS: PricingOption[] = [
    { id: 'white', name: 'White', price: 0.00, hex: '#FFFFFF', type: 'per_unit' },
    { id: 'ivory', name: 'Ivory', price: 0.00, hex: '#F5F5DC', type: 'per_unit' },
    { id: 'black', name: 'Black', price: 0.00, hex: '#000000', type: 'per_unit' },
    { id: 'grey', name: 'Grey', price: 1.40, hex: '#808080', type: 'per_unit' },
    { id: 'sage', name: 'Sage', price: 1.40, hex: '#8A9A5B', type: 'per_unit' },
    { id: 'navy', name: 'Navy', price: 1.40, hex: '#000080', type: 'per_unit' },
    { id: 'burgundy', name: 'Burgundy', price: 1.40, hex: '#800020', type: 'per_unit' },
    { id: 'dusty_blue', name: 'Dusty Blue', price: 1.80, hex: '#779ECB', type: 'per_unit' },
    { id: 'emerald', name: 'Emerald', price: 1.80, hex: '#50C878', type: 'per_unit' },
    { id: 'terracotta', name: 'Terracotta', price: 1.80, hex: '#E2725B', type: 'per_unit' },
];

export const POCKET_EMBELLISHMENTS: PricingOption[] = [
    { id: 'monogram_foil', name: 'Monogram Foil-Pressed', price: 3.90, type: 'per_unit' },
    { id: 'monogram_digital', name: 'Monogram Digital Printed', price: 1.46, type: 'per_unit' },
    { id: 'wax_standard', name: 'Standard Wax Seals', price: 1.50, type: 'per_unit' },
    { id: 'wax_custom', name: 'Custom Wax Seals', price: 2.45, type: 'per_unit' },
    { id: 'strings', name: 'Strings', price: 1.06, type: 'per_unit' },
    { id: 'tassels', name: 'Tassels', price: 1.18, type: 'per_unit' },
];

// --- 8. FOLIOS ---
export const FOLIO_STYLES: PricingOption[] = [
    { id: 'foldable', name: 'Foldable Invitation', price: 0.00, type: 'per_unit' },
    { id: 'trifold', name: 'Trifold', price: 0.00, type: 'per_unit' },
    { id: 'hardcover', name: 'Hardcover Folio', price: 0.00, type: 'per_unit' },
];

export const FOLIO_MATERIALS: Record<string, PricingOption[]> = {
    foldable: [
        { id: 'matte', name: 'Premium Matte Paper', price: 4.10, type: 'per_unit' },
        { id: 'shimmer', name: 'Premium Shimmery Paper', price: 4.55, type: 'per_unit' },
    ],
    trifold: [
        { id: 'matte', name: 'Premium Matte Paper', price: 4.25, type: 'per_unit' },
        { id: 'shimmer', name: 'Premium Shimmery Paper', price: 4.85, type: 'per_unit' },
        { id: 'velvet', name: 'Velvet', price: 9.35, type: 'per_unit' },
    ],
    hardcover: [
        { id: 'thick_matte', name: 'Premium Thick Matte Paper', price: 7.10, type: 'per_unit' },
        { id: 'thick_shimmer', name: 'Premium Thick Shimmery Paper', price: 7.55, type: 'per_unit' },
        { id: 'velvet', name: 'Velvet', price: 10.55, type: 'per_unit' },
    ],
};

export const FOLIO_EMBELLISHMENTS: PricingOption[] = [
    { id: 'cover_foil', name: 'Cover Monogram Foil-Pressed', price: 4.01, type: 'per_unit' },
    { id: 'inner_foil', name: 'Inner Pocket Foil Design', price: 3.15, type: 'per_unit' },
    { id: 'cover_digital', name: 'Cover Monogram Digital Printed', price: 1.49, type: 'per_unit' },
    { id: 'inner_digital', name: 'Inner Pocket Design Digital Printed', price: 1.09, type: 'per_unit' },
    { id: 'strings', name: 'Strings', price: 1.36, type: 'per_unit' },
    { id: 'ribbons', name: 'Ribbons', price: 2.99, type: 'per_unit' },
    { id: 'wax_standard', name: 'Standard Wax Seals', price: 1.90, type: 'per_unit' },
    { id: 'wax_custom', name: 'Custom Wax Seals', price: 2.93, type: 'per_unit' },
];

// --- HELPER FUNCTION ---
export function calculateItemPrice(option: PricingOption, quantity: number): number {
    // 1. Check for tiered pricing
    if (option.tiers) {
        // Find the highest tier that is <= quantity
        const tiers = Object.keys(option.tiers).map(Number).sort((a, b) => b - a);
        for (const tier of tiers) {
            if (quantity >= tier) {
                return option.tiers[tier];
            }
        }
    }
    // 2. Fallback to base price
    return option.price;
}
