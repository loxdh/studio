export type PricingTier = {
    [key: number]: number; // e.g., { 25: 5.00, 50: 4.50 }
};

export type PricingOption = {
    id: string;
    name: string;
    description?: string;
    price: number; // Base price (per unit)
    type?: 'flat' | 'per_unit'; // 'flat' = one-time fee, 'per_unit' = multiplied by quantity
    baseFee?: number; // Optional base fee added to calculated price
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
    { id: 'hexagon', name: 'Hexagon', price: 100.00, type: 'flat' },
    { id: 'rounded', name: 'Rounded', price: 100.00, type: 'flat' },
    { id: 'arch', name: 'Arch', price: 1.00, type: 'per_unit' },
    { id: 'circle', name: 'Circle', price: 100.00, type: 'flat' },
    { id: 'custom', name: 'Custom Shape', price: 175.00, type: 'flat', description: 'Max dim. rules apply' },
];

// --- 2. MATERIALS ---
export const ACRYLIC_OPTIONS: PricingOption[] = [
    { id: '0.5mm', name: '0.5mm - Basic Acrylics', price: 1.35, type: 'per_unit' },
    { id: '0.75mm', name: '0.75mm - Premium Acrylics', price: 1.65, type: 'per_unit' },
    { id: '1mm', name: '1mm - Deluxe Acrylics', price: 1.90, type: 'per_unit' },
    { id: '2mm', name: '2mm - Exquisite Acrylics', price: 2.50, type: 'per_unit' },
];

export const ACRYLIC_COLORS: PricingOption[] = [
    { id: 'clear', name: 'Clear', price: 0.00, type: 'per_unit', hex: '#FFFFFF' },
    { id: 'matte', name: 'Matte', price: 1.25, type: 'per_unit', hex: '#F5F5F5' },
    { id: 'frosted', name: 'Frosted', price: 1.25, type: 'per_unit', hex: '#E5E7EB' },
    { id: 'black', name: 'Black', price: 1.75, type: 'per_unit', hex: '#000000' },
    { id: 'colored', name: 'Colored', price: 2.00, type: 'per_unit', hex: '#9CA3AF', description: 'Specify in notes' },
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
export const ADDITIONAL_FOIL_COLOR_PRICE = 100.00;

export const PRINT_COLORS: PricingOption[] = [
    { id: 'gold', name: 'Gold Foil', price: 125.00, type: 'flat', tiers: { 0: 125, 201: 150 }, bgClass: 'bg-gradient-to-br from-[#BF953F] via-[#FCF6BA] to-[#B38728]' },
    { id: 'rose_gold', name: 'Rose Gold Foil', price: 125.00, type: 'flat', tiers: { 0: 125, 201: 150 }, bgClass: 'bg-gradient-to-br from-[#E6C2B6] via-[#F0D6CE] to-[#C9988C]' },
    { id: 'silver', name: 'Silver Foil', price: 125.00, type: 'flat', tiers: { 0: 125, 201: 150 }, bgClass: 'bg-gradient-to-br from-[#C0C0C0] via-[#E8E8E8] to-[#A0A0A0]' },
    { id: 'copper', name: 'Copper Foil', price: 125.00, type: 'flat', tiers: { 0: 125, 201: 150 }, bgClass: 'bg-gradient-to-br from-[#B87333] via-[#E6A67C] to-[#8B4513]' },
    { id: 'white', name: 'White Foil', price: 125.00, type: 'flat', tiers: { 0: 125, 201: 150 }, bgClass: 'bg-gradient-to-br from-[#F5F5F5] via-[#FFFFFF] to-[#E0E0E0] border border-gray-100' },
    { id: 'black', name: 'Black Foil', price: 125.00, type: 'flat', tiers: { 0: 125, 201: 150 }, bgClass: 'bg-gradient-to-br from-[#2b2b2b] via-[#4a4a4a] to-[#000000]' },
    { id: 'other', name: 'Unique Foil Color', price: 150.00, type: 'flat', tiers: { 0: 150, 201: 175 }, bgClass: 'bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200', description: '(Check availability first)' },
    { id: 'uv', name: 'UV Color Print', price: 2.00, type: 'per_unit', bgClass: 'bg-[url("https://www.transparenttextures.com/patterns/diagmonds-light.png")] bg-pink-100', textClass: 'text-black' },
    { id: 'blind_emboss', name: 'Blind Emboss', price: 125.00, type: 'flat', bgClass: 'bg-gray-100 shadow-inner' },
    { id: 'foil_emboss', name: 'Foiled Emboss', price: 150.00, type: 'flat', bgClass: 'bg-gray-200 shadow-xl' },
];

// --- 4. INSERTS ---
export const SUITE_INSERTS_FOIL: PricingOption[] = [
    { id: 'rsvp_foil', name: 'Foil-Pressed RSVP Cards', price: 1.25, baseFee: 100.00, description: '3.5x4.75" (9x12cm) - Response cards.', type: 'per_unit' },
    { id: 'rsvp_envelopes_foil', name: 'Premium RSVP Envelopes', price: 1.50, baseFee: 100.00, description: '3.5x4.75" (9x12cm) - With Foil Return Address.', type: 'per_unit' },
    { id: 'thank_you_foil', name: 'Foil-Pressed Thank You Cards', price: 1.25, baseFee: 100.00, description: '4.25x5.5" (11x14cm) - Foldable.', type: 'per_unit' },
    { id: 'details_foil', name: 'Foil-Pressed Details Cards', price: 1.25, baseFee: 100.00, description: '4.25x5.5" (11x14cm) - Event specifics.', type: 'per_unit' },
    { id: 'direction_foil', name: 'Foil-Pressed Direction Cards', price: 1.25, baseFee: 100.00, description: '4.25x5.5" (11x14cm) - Maps and directions.', type: 'per_unit' },
    { id: 'accommodation_foil', name: 'Foil-Pressed Accommodation Cards', price: 1.25, baseFee: 100.00, description: '4.25x5.5" (11x14cm) - Hotel info.', type: 'per_unit' },
    { id: 'reception_foil', name: 'Foil-Pressed Reception Cards', price: 1.25, baseFee: 100.00, description: '4.25x5.5" (11x14cm) - Party details.', type: 'per_unit' },
    { id: 'menu_foil', name: 'Foil-Pressed Menu Cards', price: 1.50, baseFee: 100.00, description: '6x9" (15x23cm) - Dinner menu.', type: 'per_unit' },
    { id: 'belly_bands_foil', name: 'Foil-Pressed Belly Bands', price: 1.15, baseFee: 100.00, description: '12x1.5" (30x4cm) - Wrap your suite.', type: 'per_unit' },
];

export const SUITE_INSERTS_DIGITAL: PricingOption[] = [
    { id: 'rsvp', name: 'RSVP Cards', price: 1.00, description: '3.5x4.75" (9x12cm) - Response cards.', type: 'per_unit' },
    { id: 'rsvp_envelopes', name: 'Premium RSVP Envelopes', price: 1.50, description: '3.5x4.75" (9x12cm) - Plain.', type: 'per_unit' },
    { id: 'thank_you', name: 'Foldable Thank You Cards', price: 1.25, description: '4.25x5.5" (11x14cm) - Express gratitude.', type: 'per_unit' },
    { id: 'details', name: 'Details Cards', price: 1.25, description: '4.25x5.5" (11x14cm) - Event specifics.', type: 'per_unit' },
    { id: 'direction', name: 'Direction Cards', price: 1.25, description: '4.25x5.5" (11x14cm) - Maps.', type: 'per_unit' },
    { id: 'accommodation', name: 'Accommodation Cards', price: 1.25, description: '4.25x5.5" (11x14cm) - Lodging info.', type: 'per_unit' },
    { id: 'reception', name: 'Reception Cards', price: 1.25, description: '4.25x5.5" (11x14cm) - Reception details.', type: 'per_unit' },
    { id: 'menu', name: 'Menu Cards', price: 1.50, description: '6x9" (15x23cm) - Dinner menu.', type: 'per_unit' },
    { id: 'belly_bands', name: 'Belly Bands', price: 1.15, description: '12x1.5" (30x4cm) - Wrap your suite.', type: 'per_unit' },
];

// --- 5. SERVICES ---
export const SERVICE_ADD_ONS: PricingOption[] = [
    { id: 'assembly', name: 'Assembly', price: 1.00, type: 'per_unit' },
    { id: 'rush', name: 'Rush Order', price: 75.00, type: 'flat', description: 'Priority processing (Double for Folios)' },
    { id: 'scratch_design', name: 'Design From Scratch', price: 75.00, type: 'flat' },
    { id: 'custom_sketch', name: 'Custom Sketch', price: 245.00, type: 'flat' },
    { id: 'mailing', name: 'Mailing Service', price: 1.50, type: 'per_unit', description: '($1.50/ea + Stamp Cost)' },
];

// --- 6. ENVELOPES ---
export const ENVELOPE_MATERIALS: PricingOption[] = [
    { id: 'matte', name: 'Premium Matte Paper', price: 2.25, type: 'per_unit', tiers: { 101: 2.14 } },
    { id: 'shimmer', name: 'Premium Shimmery Paper', price: 2.50, type: 'per_unit', tiers: { 101: 2.38 } },
    { id: 'vellum', name: 'Vellum', price: 2.00, type: 'per_unit', tiers: { 101: 1.90 } },
    { id: 'velvet', name: 'Velvet', price: 4.00, type: 'per_unit', tiers: { 101: 3.80 } },
];

const C_WHITE: PricingOption = { id: 'white', name: 'White', price: 0, hex: '#FFFFFF', type: 'per_unit' };
const C_CREAM: PricingOption = { id: 'cream', name: 'Cream', price: 0, hex: '#FFFDD0', type: 'per_unit' };
const C_IVORY: PricingOption = { id: 'ivory', name: 'Ivory', price: 0, hex: '#F5F5DC', type: 'per_unit' };
const C_BLACK: PricingOption = { id: 'black', name: 'Black', price: 0, hex: '#000000', type: 'per_unit' };
const C_BURGUNDY: PricingOption = { id: 'burgundy', name: 'Burgundy', price: 0, hex: '#800020', type: 'per_unit' };
const C_GREEN: PricingOption = { id: 'green', name: 'Green', price: 0, hex: '#2E8B57', type: 'per_unit' };
const C_NAVY: PricingOption = { id: 'navy', name: 'Navy', price: 0, hex: '#000080', type: 'per_unit' };
const C_PINK: PricingOption = { id: 'pink', name: 'Pink', price: 0, hex: '#FFC0CB', type: 'per_unit' };
const C_PURPLE: PricingOption = { id: 'purple', name: 'Purple', price: 0, hex: '#800080', type: 'per_unit' };
const C_RED: PricingOption = { id: 'red', name: 'Red', price: 0, hex: '#FF0000', type: 'per_unit' };
const C_YELLOW: PricingOption = { id: 'yellow', name: 'Yellow', price: 0, hex: '#FFD700', type: 'per_unit' };
const C_LIME: PricingOption = { id: 'lime', name: 'Lime', price: 0, hex: '#32CD32', type: 'per_unit' };
const C_VELLUM_OPT: PricingOption = { id: 'vellum', name: 'Vellum', price: 0, hex: '#FFFFFF', type: 'per_unit' }; // Display as white/translucent
const C_OTHER: PricingOption = { id: 'other', name: 'Other', price: 0, bgClass: 'bg-gradient-to-br from-gray-100 to-gray-300', type: 'per_unit', description: 'Check Availability' };

export const COLORS_BY_MATERIAL: Record<string, PricingOption[]> = {
    matte: [C_WHITE, C_CREAM, C_BLACK, C_BURGUNDY, C_GREEN, C_NAVY, C_OTHER],
    shimmer: [C_WHITE, C_IVORY, C_CREAM, C_BLACK, C_BURGUNDY, C_GREEN, C_NAVY, C_PINK, C_PURPLE, C_OTHER],
    velvet: [C_BLACK, C_GREEN, C_BURGUNDY, C_NAVY, C_RED, C_YELLOW, C_LIME, C_CREAM, C_PURPLE],
    vellum: [C_VELLUM_OPT],
    // Folio Mappings
    thick_matte: [C_WHITE, C_CREAM, C_BLACK, C_BURGUNDY, C_GREEN, C_NAVY, C_OTHER],
    thick_shimmer: [C_WHITE, C_IVORY, C_CREAM, C_BLACK, C_BURGUNDY, C_GREEN, C_NAVY, C_PINK, C_PURPLE, C_OTHER],
};

// Legacy support if needed (can be removed if page.tsx is fully updated)
export const ENVELOPE_COLORS = COLORS_BY_MATERIAL.matte;
export const POCKET_COLORS = COLORS_BY_MATERIAL.matte;

export const ENVELOPE_EMBELLISHMENTS: PricingOption[] = [
    { id: 'monogram_foil', name: 'Monogram Foil-Pressed (Flap)', price: 100.00, type: 'flat' },
    { id: 'monogram_color', name: 'Monogram Color Printed (Flap)', price: 75.00, type: 'flat' },
    { id: 'outer_foil', name: 'Outer Envelope Foil Design', price: 125.00, type: 'flat' },
    { id: 'outer_print', name: 'Outer Envelope Color Printed Design', price: 100.00, type: 'flat' },
    { id: 'return_foil', name: 'Return Address Foil-Pressed', price: 100.00, type: 'flat' },
    { id: 'return_print', name: 'Return Address Color Printed', price: 75.00, type: 'flat' },
];

export const ENVELOPE_LINERS: PricingOption[] = [
    { id: 'plain', name: 'Liner Plain White', price: 1.00, type: 'per_unit' },
    { id: 'digital', name: 'Liner Digital Color Printed', price: 1.50, type: 'per_unit' },
    { id: 'foil', name: 'Liner Foil-Pressed', price: 1.00, baseFee: 100.00, type: 'per_unit' },
    { id: 'velvet', name: 'Velvet Liner Plain', price: 1.75, type: 'per_unit' },
    { id: 'velvet_foil', name: 'Velvet Liner Foil-Pressed', price: 1.75, baseFee: 100.00, type: 'per_unit' },
    { id: 'direct_foil', name: 'Directly Foil-Pressed Inside', price: 100.00, type: 'flat' },
];

export const ENVELOPE_SEALS: PricingOption[] = [
    { id: 'wax_custom', name: 'Custom Wax Seals', price: 1.25, type: 'per_unit', tiers: { 0: 1.75, 50: 1.25 } },
    { id: 'clear_foil', name: 'Clear Seals with Standard Foil', price: 0.75, type: 'per_unit' },
    { id: 'clear_black', name: 'Clear Seals with Black Ink', price: 0.50, type: 'per_unit' },
];

export const ENVELOPE_ADDRESSING: PricingOption[] = [
    { id: 'guest_foil', name: 'Guest Addressing - Clear Labels (Gold/Silver Foil)', price: 1.15, type: 'per_unit', tiers: { 0: 1.50, 50: 1.15 } },
    { id: 'guest_black', name: 'Guest Addressing - Clear Labels (Black Ink)', price: 0.75, type: 'per_unit' },
];

// --- 7. POCKETS ---
export const POCKET_MATERIALS: PricingOption[] = [
    { id: 'matte', name: 'Premium Matte Paper', price: 1.90, type: 'per_unit' },
    { id: 'shimmer', name: 'Premium Shimmery Paper', price: 2.10, type: 'per_unit' },
    { id: 'velvet', name: 'Velvet', price: 3.60, type: 'per_unit' },
];

// Pockets use same color logic


export const POCKET_EMBELLISHMENTS: PricingOption[] = [
    { id: 'monogram_foil', name: 'Monogram Foil-Pressed', price: 100.00, type: 'flat' },
    { id: 'monogram_digital', name: 'Monogram Digital Printed', price: 75.00, type: 'flat' },
    { id: 'wax_custom', name: 'Custom Wax Seals', price: 1.25, type: 'per_unit', tiers: { 0: 1.75, 50: 1.25 } },
    { id: 'tassels', name: 'Tassels', price: 1.00, type: 'per_unit', description: 'Gold or Silver (Contact for others)' },
];

// --- 8. FOLIOS ---
export const FOLIO_STYLES: PricingOption[] = [
    { id: 'foldable', name: 'Gatefold Cover', price: 0.00, type: 'per_unit' },
    { id: 'trifold', name: 'Trifold', price: 0.00, type: 'per_unit' },
    { id: 'hardcover', name: 'Hardcover Folio', price: 0.00, type: 'per_unit' },
];

export const FOLIO_MATERIALS: Record<string, PricingOption[]> = {
    foldable: [
        { id: 'vellum', name: 'Vellum', price: 2.00, type: 'per_unit' },
        { id: 'matte', name: 'Premium Matte Paper', price: 2.25, type: 'per_unit' },
        { id: 'shimmer', name: 'Premium Shimmery Paper', price: 2.50, type: 'per_unit' },
    ],
    trifold: [
        { id: 'matte', name: 'Premium Matte Paper', price: 2.50, type: 'per_unit', tiers: { 0: 3.00, 51: 2.50 } },
        { id: 'shimmer', name: 'Premium Shimmery Paper', price: 2.75, type: 'per_unit', tiers: { 0: 3.25, 51: 2.75 } },
    ],
    hardcover: [
        { id: 'thick_matte', name: 'Premium Thick Matte Paper', price: 7.10, type: 'per_unit' },
        { id: 'thick_shimmer', name: 'Premium Thick Shimmery Paper', price: 7.55, type: 'per_unit' },
        { id: 'velvet', name: 'Velvet', price: 10.55, type: 'per_unit' },
    ],
};

export const FOLIO_EMBELLISHMENTS_BY_STYLE: Record<string, PricingOption[]> = {
    foldable: [
        { id: 'cover_foil', name: 'Cover Monogram Foil-Pressed', price: 100.00, type: 'flat' },
        { id: 'cover_digital', name: 'Cover Monogram Digital Printed', price: 75.00, type: 'flat' },
        { id: 'inner_foil', name: 'Inner Pocket Foil Design', price: 100.00, type: 'flat' },
        { id: 'inner_digital', name: 'Inner Pocket Design Digital Printed', price: 75.00, type: 'flat' },
        { id: 'belly_band_digital', name: 'Belly Band (Digital)', price: 1.15, type: 'per_unit' },
        { id: 'belly_band_foil', name: 'Belly Band (Foil-Pressed)', price: 1.15, baseFee: 100.00, type: 'per_unit' },
        { id: 'wax_custom', name: 'Custom Wax Seals', price: 1.25, type: 'per_unit', tiers: { 0: 1.75, 50: 1.25 } },
        { id: 'dried_flowers', name: 'Dried Flowers', price: 1.00, type: 'per_unit', tiers: { 0: 1.50, 51: 1.00 } },
        { id: 'ribbons', name: 'Ribbons', price: 1.50, type: 'per_unit' },
    ],
    trifold: [
        { id: 'flap_foil', name: 'Flap Monogram Foil-Stamped', price: 100.00, type: 'flat' },
        { id: 'inner_foil', name: 'Inner Pocket Foil-Stamped', price: 100.00, type: 'flat' },
        { id: 'wax_custom', name: 'Custom Wax Seals', price: 1.25, type: 'per_unit', tiers: { 0: 1.75, 50: 1.25 } },
        { id: 'belly_band_vellum_digital', name: 'Vellum Belly Band (Digital)', price: 1.15, type: 'per_unit' },
        { id: 'belly_band_vellum_foil', name: 'Vellum Belly Band (Foil-Pressed)', price: 1.15, baseFee: 100.00, type: 'per_unit' },
        { id: 'ribbons', name: 'Ribbons', price: 1.50, type: 'per_unit' },
    ],
    hardcover: [
        { id: 'cover_foil', name: 'Cover Monogram Foil-Pressed', price: 100.00, type: 'flat' },
        { id: 'inner_foil', name: 'Inner Pocket Foil Design', price: 100.00, type: 'flat' },
        { id: 'ribbons', name: 'Ribbons', price: 1.50, type: 'per_unit' },
    ]
};

export const FOLIO_EMBELLISHMENTS = FOLIO_EMBELLISHMENTS_BY_STYLE.foldable;

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
