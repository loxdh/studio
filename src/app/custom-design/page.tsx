'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';
import FadeIn from '@/components/ui/fade-in';
import { Check, Info, HelpCircle, Upload, ChevronRight, ChevronLeft, Sparkles, Mail, BookOpen } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

// --- Constants & Data ---

const QUANTITY_TIERS = [25, 50, 75, 100, 125, 150, 175, 200, 250, 300];

type InvitationType = 'acrylic' | 'vellum' | 'paper';

interface Option {
    id: string;
    name: string;
    price: number; // Price per unit
    description?: string;
    type?: 'flat' | 'per_unit';
}

interface ServiceOption {
    id: string;
    name: string;
    price: number;
    type: 'flat' | 'per_unit';
}

const INVITATION_TYPES: { id: InvitationType; name: string; description: string }[] = [
    { id: 'acrylic', name: 'Acrylic', description: 'Modern, sleek, and rigid. The ultimate statement.' },
    { id: 'vellum', name: 'Vellum', description: 'Soft, translucent, and romantic. Ethereal beauty.' },
    { id: 'paper', name: 'Premium Paper', description: 'Classic luxury. Thick, textured, and timeless.' },
];

const SHAPES: Option[] = [
    { id: 'rectangle', name: 'Rectangle', price: 0.00 },
    { id: 'square', name: 'Square', price: 0.00 },
    { id: 'tall', name: 'Tall', price: 1.25 },
    { id: 'hexagon', name: 'Hexagon', price: 0.75 },
    { id: 'rounded', name: 'Rounded', price: 1.00 },
    { id: 'arch', name: 'Arch', price: 1.00 },
    { id: 'circle', name: 'Circle', price: 1.00 },
    { id: 'custom', name: 'Custom Shape', price: 175.00, type: 'flat' },
];

const ACRYLIC_OPTIONS: Option[] = [
    { id: '0.5mm', name: '0.5mm - Basic Acrylics', price: 1.35 },
    { id: '0.75mm', name: '0.75mm - Premium Acrylics', price: 1.65 },
    { id: '1mm', name: '1mm - Deluxe Acrylics', price: 1.90 },
    { id: '2mm', name: '2mm - Exquisite Acrylics', price: 2.50 },
];

const VELLUM_OPTIONS: Option[] = [
    { id: 'only_vellum', name: 'Only Vellum', price: 1.25 },
    { id: 'vellum_matte', name: 'Vellum + Matte Paper', price: 2.95 },
    { id: 'vellum_shimmer', name: 'Vellum + Shimmery Paper', price: 3.15 },
    { id: 'vellum_double_matte', name: 'Vellum + Double Thick Matte', price: 4.25 },
    { id: 'vellum_double_shimmer', name: 'Vellum + Double Thick Shimmer', price: 4.75 },
];

const PAPER_OPTIONS: Option[] = [
    { id: 'premium_matte', name: 'Premium Matte Paper', price: 1.35 },
    { id: 'premium_shimmer', name: 'Premium Shimmery Paper', price: 1.45 },
    { id: 'double_matte', name: 'Double Thick Matte Paper', price: 1.65 },
    { id: 'double_shimmer', name: 'Double Thick Shimmery Paper', price: 1.85 },
    { id: 'extra_thick', name: 'Extra Thick Block Paper', price: 2.35 },
    { id: 'velvet', name: 'Velvet', price: 2.30 },
];

const PRINT_COLORS: (Option & { bgClass: string, textClass?: string })[] = [
    { id: 'gold', name: 'Gold Foil', price: 4.85, bgClass: 'bg-gradient-to-br from-[#BF953F] via-[#FCF6BA] to-[#B38728]' },
    { id: 'rose_gold', name: 'Rose Gold Foil', price: 4.85, bgClass: 'bg-gradient-to-br from-[#E6C2B6] via-[#F0D6CE] to-[#C9988C]' },
    { id: 'silver', name: 'Silver Foil', price: 4.85, bgClass: 'bg-gradient-to-br from-[#C0C0C0] via-[#E8E8E8] to-[#A0A0A0]' },
    { id: 'copper', name: 'Copper Foil', price: 4.85, bgClass: 'bg-gradient-to-br from-[#B87333] via-[#E6A67C] to-[#8B4513]' },
    { id: 'white', name: 'White Foil', price: 4.85, bgClass: 'bg-gradient-to-br from-[#F5F5F5] via-[#FFFFFF] to-[#E0E0E0] border border-gray-100' },
    { id: 'black', name: 'Black Foil', price: 4.85, bgClass: 'bg-gradient-to-br from-[#2b2b2b] via-[#4a4a4a] to-[#000000]' },
    { id: 'other', name: 'Other Foil Color', price: 5.85, bgClass: 'bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200' },
    { id: 'uv', name: 'UV Print', price: 1.30, bgClass: 'bg-[url("https://www.transparenttextures.com/patterns/diagmonds-light.png")] bg-pink-100', textClass: 'text-black' },
    { id: 'deboss', name: 'Letterpress / Deboss', price: 3.85, bgClass: 'bg-gray-200 shadow-inner' },
    { id: 'emboss', name: 'Emboss', price: 3.85, bgClass: 'bg-gray-100 shadow-lg' },
];

// Inserts with Foil-Pressed Pricing
const SUITE_INSERTS_FOIL: Option[] = [
    { id: 'rsvp', name: 'Foil-Pressed RSVP Cards', price: 106.25, description: 'Response cards for your guests.' },
    { id: 'rsvp_envelopes', name: 'Premium RSVP Envelopes', price: 88.75, description: 'Matching envelopes for RSVP cards.' },
    { id: 'thank_you', name: 'Foil-Pressed Thank You Cards', price: 108.75, description: 'Express your gratitude in style.' },
    { id: 'details', name: 'Foil-Pressed Details Cards', price: 106.25, description: 'Event specifics and timelines.' },
    { id: 'direction', name: 'Foil-Pressed Direction Cards', price: 106.25, description: 'Maps and directions to venue.' },
    { id: 'accommodation', name: 'Foil-Pressed Accommodation Cards', price: 106.25, description: 'Hotel and lodging information.' },
    { id: 'reception', name: 'Foil-Pressed Reception Cards', price: 106.25, description: 'Details for the reception party.' },
    { id: 'belly_bands', name: 'Foil-Pressed Belly Bands', price: 82.50, description: 'Wrap your suite together elegantly.' },
];

// Inserts with Digital Printing Pricing
const SUITE_INSERTS_DIGITAL: Option[] = [
    { id: 'rsvp', name: 'RSVP Cards', price: 37.00, description: 'Response cards for your guests.' },
    { id: 'rsvp_envelopes', name: 'Premium RSVP Envelopes', price: 38.25, description: 'Matching envelopes for RSVP cards.' },
    { id: 'thank_you', name: 'Foldable Thank You Cards', price: 38.25, description: 'Express your gratitude in style.' },
    { id: 'details', name: 'Details Cards', price: 35.75, description: 'Event specifics and timelines.' },
    { id: 'direction', name: 'Direction Cards', price: 35.75, description: 'Maps and directions to venue.' },
    { id: 'accommodation', name: 'Accommodation Cards', price: 35.75, description: 'Hotel and lodging information.' },
    { id: 'reception', name: 'Reception Cards', price: 35.75, description: 'Details for the reception party.' },
    { id: 'belly_bands', name: 'Belly Bands', price: 32.00, description: 'Wrap your suite together elegantly.' },
];

const SERVICE_ADD_ONS: ServiceOption[] = [
    { id: 'assembly', name: 'Assembly', price: 39.13, type: 'per_unit' },
    { id: 'rush', name: 'Rush Order', price: 92.50, type: 'flat' },
    { id: 'minor_custom', name: 'Minor Customization', price: 45.80, type: 'flat' },
    { id: 'scratch_design', name: 'Design From Scratch', price: 89.00, type: 'flat' },
    { id: 'custom_sketch', name: 'Custom Sketch', price: 245.00, type: 'flat' },
    { id: 'mailing', name: 'Mailing Service', price: 256.00, type: 'flat' },
];

// --- New Envelope Data ---

const ENVELOPE_MATERIALS: Option[] = [
    { id: 'basic_white', name: 'Basic White Mailing Envelope', price: 2.10 },
    { id: 'vellum', name: 'Vellum', price: 2.20 },
    { id: 'matte', name: 'Premium Matte Paper', price: 2.29 },
    { id: 'shimmer', name: 'Premium Shimmery Paper', price: 2.35 },
    { id: 'velvet', name: 'Velvet', price: 3.10 },
];

const ENVELOPE_COLORS: (Option & { hex: string })[] = [
    { id: 'white', name: 'White', price: 0.00, hex: '#FFFFFF' },
    { id: 'ivory', name: 'Ivory', price: 0.00, hex: '#F5F5DC' },
    { id: 'black', name: 'Black', price: 0.00, hex: '#000000' },
    { id: 'grey', name: 'Grey', price: 1.40, hex: '#808080' },
    { id: 'sage', name: 'Sage', price: 1.40, hex: '#8A9A5B' },
    { id: 'navy', name: 'Navy', price: 1.40, hex: '#000080' },
    { id: 'burgundy', name: 'Burgundy', price: 1.40, hex: '#800020' },
    { id: 'dusty_blue', name: 'Dusty Blue', price: 1.80, hex: '#779ECB' },
    { id: 'emerald', name: 'Emerald', price: 1.80, hex: '#50C878' },
    { id: 'terracotta', name: 'Terracotta', price: 1.80, hex: '#E2725B' },
];

const ENVELOPE_EMBELLISHMENTS: Option[] = [
    { id: 'monogram_foil', name: 'Monogram Foil-Pressed', price: 3.45 },
    { id: 'monogram_black', name: 'Monogram Printed (Black Ink)', price: 1.86 },
    { id: 'monogram_color', name: 'Monogram Printed (Color Ink)', price: 1.90 },
    { id: 'monogram_white', name: 'Monogram Printed (White Ink)', price: 2.05 },
    { id: 'outer_foil', name: 'Outer Envelope Foil Design', price: 3.85 },
    { id: 'outer_print', name: 'Outer Envelope Printed Design', price: 1.85 },
    { id: 'return_foil', name: 'Return Address Foil-Pressed', price: 3.05 },
    { id: 'return_black', name: 'Return Address Printed (Black Ink)', price: 1.06 },
    { id: 'return_color', name: 'Return Address Printed (Color Ink)', price: 1.10 },
    { id: 'return_white', name: 'Return Address Printed (White Ink)', price: 1.20 },
];

const ENVELOPE_LINERS: Option[] = [
    { id: 'plain', name: 'Liner Plain', price: 0.80 },
    { id: 'digital', name: 'Liner Digital Printed', price: 1.24 },
    { id: 'foil', name: 'Liner Foil-Pressed', price: 5.05 },
    { id: 'direct_foil', name: 'Directly Foil-Pressed Inside', price: 4.85 },
    { id: 'velvet', name: 'Velvet Liner', price: 1.12 },
    { id: 'velvet_foil', name: 'Velvet Liner Foil-Pressed', price: 5.42 },
];

const ENVELOPE_SEALS: Option[] = [
    { id: 'wax_standard', name: 'Standard Wax Seals', price: 0.84 },
    { id: 'wax_custom', name: 'Custom Wax Seals', price: 1.68 },
    { id: 'clear_foil', name: 'Clear Seals with Standard Foil', price: 0.45 },
    { id: 'clear_custom', name: 'Clear Seals with Custom Foil', price: 1.07 },
];

const ENVELOPE_ADDRESSING: Option[] = [
    { id: 'guest_foil_gold', name: 'Guest Addressing - Clear Labels (Gold Foil)', price: 0.80 },
    { id: 'guest_foil_silver', name: 'Guest Addressing - Clear Labels (Silver Foil)', price: 0.80 },
    { id: 'guest_digital', name: 'Guest Addressing - Labels (Digital Color)', price: 0.70 },
    { id: 'guest_print_black', name: 'Guest Address Printing (Black Ink)', price: 1.18 },
    { id: 'guest_print_color', name: 'Guest Address Printing (Color Ink)', price: 1.25 },
    { id: 'guest_print_white', name: 'Guest Address Printing (White Ink)', price: 1.30 },
];

const POCKET_MATERIALS: Option[] = [
    { id: 'matte', name: 'Premium Matte Paper', price: 1.90 },
    { id: 'shimmer', name: 'Premium Shimmery Paper', price: 2.10 },
    { id: 'velvet', name: 'Velvet', price: 3.60 },
];

const POCKET_COLORS: (Option & { hex: string })[] = [
    { id: 'white', name: 'White', price: 0.00, hex: '#FFFFFF' },
    { id: 'ivory', name: 'Ivory', price: 0.00, hex: '#F5F5DC' },
    { id: 'black', name: 'Black', price: 0.00, hex: '#000000' },
    { id: 'grey', name: 'Grey', price: 1.40, hex: '#808080' },
    { id: 'sage', name: 'Sage', price: 1.40, hex: '#8A9A5B' },
    { id: 'navy', name: 'Navy', price: 1.40, hex: '#000080' },
    { id: 'burgundy', name: 'Burgundy', price: 1.40, hex: '#800020' },
    { id: 'dusty_blue', name: 'Dusty Blue', price: 1.80, hex: '#779ECB' },
    { id: 'emerald', name: 'Emerald', price: 1.80, hex: '#50C878' },
    { id: 'terracotta', name: 'Terracotta', price: 1.80, hex: '#E2725B' },
];

const POCKET_EMBELLISHMENTS: Option[] = [
    { id: 'monogram_foil', name: 'Monogram Foil-Pressed', price: 3.90 },
    { id: 'monogram_digital', name: 'Monogram Digital Printed', price: 1.46 },
    { id: 'wax_standard', name: 'Standard Wax Seals', price: 1.50 },
    { id: 'wax_custom', name: 'Custom Wax Seals', price: 2.45 },
    { id: 'strings', name: 'Strings', price: 1.06 },
    { id: 'tassels', name: 'Tassels', price: 1.18 },
];

const FOLIO_STYLES: Option[] = [
    { id: 'foldable', name: 'Foldable Invitation', price: 0.00 },
    { id: 'trifold', name: 'Trifold', price: 0.00 },
    { id: 'hardcover', name: 'Hardcover Folio', price: 0.00 },
];

const FOLIO_MATERIALS: Record<string, Option[]> = {
    foldable: [
        { id: 'matte', name: 'Premium Matte Paper', price: 4.10 },
        { id: 'shimmer', name: 'Premium Shimmery Paper', price: 4.55 },
    ],
    trifold: [
        { id: 'matte', name: 'Premium Matte Paper', price: 4.25 },
        { id: 'shimmer', name: 'Premium Shimmery Paper', price: 4.85 },
        { id: 'velvet', name: 'Velvet', price: 9.35 },
    ],
    hardcover: [
        { id: 'thick_matte', name: 'Premium Thick Matte Paper', price: 7.10 },
        { id: 'thick_shimmer', name: 'Premium Thick Shimmery Paper', price: 7.55 },
        { id: 'velvet', name: 'Velvet', price: 10.55 },
    ],
};

const FOLIO_EMBELLISHMENTS: Option[] = [
    { id: 'cover_foil', name: 'Cover Monogram Foil-Pressed', price: 4.01 },
    { id: 'inner_foil', name: 'Inner Pocket Foil Design', price: 3.15 },
    { id: 'cover_digital', name: 'Cover Monogram Digital Printed', price: 1.49 },
    { id: 'inner_digital', name: 'Inner Pocket Design Digital Printed', price: 1.09 },
    { id: 'strings', name: 'Strings', price: 1.36 },
    { id: 'ribbons', name: 'Ribbons', price: 2.99 },
    { id: 'wax_standard', name: 'Standard Wax Seals', price: 1.90 },
    { id: 'wax_custom', name: 'Custom Wax Seals', price: 2.93 },
];

const STEPS = [
    { id: 1, title: 'The Basics', description: 'Quantity & Type' },
    { id: 2, title: 'Materials', description: 'Finish & Shape' },
    { id: 3, title: 'Design', description: 'Color & Inserts' },
    { id: 4, title: 'Finishing', description: 'Envelopes & Services' },
    { id: 5, title: 'Review', description: 'Notes & Finalize' },
];

export default function CustomDesignPage() {
    const { addToCart } = useCart();
    const { toast } = useToast();

    // Navigation State
    const [currentStep, setCurrentStep] = useState(1);
    const progress = (currentStep / STEPS.length) * 100;

    // Data State
    const [quantity, setQuantity] = useState(25);
    const [invitationType, setInvitationType] = useState<InvitationType>('acrylic');
    const [shape, setShape] = useState(SHAPES[0]);

    const [acrylicOption, setAcrylicOption] = useState(ACRYLIC_OPTIONS[1]);
    const [vellumOption, setVellumOption] = useState(VELLUM_OPTIONS[0]);
    const [paperOption, setPaperOption] = useState(PAPER_OPTIONS[0]);

    const [printColor, setPrintColor] = useState(PRINT_COLORS[0]);

    // Envelope State
    const [includeEnvelopes, setIncludeEnvelopes] = useState(false);
    const [envMaterial, setEnvMaterial] = useState(ENVELOPE_MATERIALS[0]);
    const [envColor, setEnvColor] = useState(ENVELOPE_COLORS[0]);
    const [selectedEmbellishments, setSelectedEmbellishments] = useState<string[]>([]);
    const [selectedLiner, setSelectedLiner] = useState<string | null>(null);
    const [selectedSeals, setSelectedSeals] = useState<string[]>([]);
    const [selectedAddressing, setSelectedAddressing] = useState<string[]>([]);

    // Pocket State
    const [includePockets, setIncludePockets] = useState(false);
    const [pocketMaterial, setPocketMaterial] = useState(POCKET_MATERIALS[0]);
    const [pocketColor, setPocketColor] = useState(POCKET_COLORS[0]);
    const [selectedPocketEmbellishments, setSelectedPocketEmbellishments] = useState<string[]>([]);

    // Folio State
    const [includeFolios, setIncludeFolios] = useState(false);
    const [folioStyle, setFolioStyle] = useState(FOLIO_STYLES[0]);
    const [folioMaterial, setFolioMaterial] = useState(FOLIO_MATERIALS['foldable'][0]);
    const [folioColor, setFolioColor] = useState(POCKET_COLORS[0]);
    const [selectedFolioEmbellishments, setSelectedFolioEmbellishments] = useState<string[]>([]);

    const [insertPrintType, setInsertPrintType] = useState<'foil' | 'digital'>('digital');
    const [selectedInserts, setSelectedInserts] = useState<string[]>([]);
    const [selectedServices, setSelectedServices] = useState<string[]>([]);
    const [designNotes, setDesignNotes] = useState('');

    const [total, setTotal] = useState(0);

    // Calculate Total
    useEffect(() => {
        let calculatedTotal = 0;

        // 1. Base Unit Price (Shape + Material + Print)
        let unitPrice = printColor.price;

        if (shape.type !== 'flat') {
            unitPrice += shape.price;
        }

        if (invitationType === 'acrylic') unitPrice += acrylicOption.price;
        if (invitationType === 'vellum') unitPrice += vellumOption.price;
        if (invitationType === 'paper') unitPrice += paperOption.price;

        // 2. Envelopes (Per Unit)
        if (includeEnvelopes) {
            unitPrice += envMaterial.price;
            unitPrice += envColor.price;
        }

        // 3. Pockets (Per Unit)
        if (includePockets) {
            unitPrice += pocketMaterial.price;
            unitPrice += pocketColor.price;

            selectedPocketEmbellishments.forEach(id => {
                const opt = POCKET_EMBELLISHMENTS.find(o => o.id === id);
                if (opt) unitPrice += opt.price;
            });
        }

        // 4. Folios (Per Unit)
        if (includeFolios) {
            unitPrice += folioMaterial.price;
            unitPrice += folioColor.price;

            selectedFolioEmbellishments.forEach(id => {
                const opt = FOLIO_EMBELLISHMENTS.find(o => o.id === id);
                if (opt) unitPrice += opt.price;
            });
        }

        // 5. Inserts (Flat Fee - per set, not per unit)
        const currentInsertList = insertPrintType === 'foil' ? SUITE_INSERTS_FOIL : SUITE_INSERTS_DIGITAL;
        selectedInserts.forEach(id => {
            const option = currentInsertList.find(o => o.id === id);
            if (option) {
                calculatedTotal += option.price; // These are flat fees per set
            }
        });

        // 6. Services (Per Unit)
        selectedServices.forEach(id => {
            const service = SERVICE_ADD_ONS.find(s => s.id === id);
            if (service && service.type === 'per_unit') {
                unitPrice += service.price;
            }
        });

        calculatedTotal = unitPrice * quantity;

        // 7. Flat Fee Services
        if (shape.type === 'flat') {
            calculatedTotal += shape.price;
        }

        selectedServices.forEach(id => {
            const service = SERVICE_ADD_ONS.find(s => s.id === id);
            if (service && service.type === 'flat') {
                calculatedTotal += service.price;
            }
        });

        setTotal(calculatedTotal);
    }, [
        quantity, invitationType, shape, acrylicOption, vellumOption, paperOption, printColor,
        includeEnvelopes, envMaterial, envColor, selectedEmbellishments, selectedLiner, selectedSeals, selectedAddressing,
        includePockets, pocketMaterial, pocketColor, selectedPocketEmbellishments,
        includeFolios, folioStyle, folioMaterial, folioColor, selectedFolioEmbellishments,
        insertPrintType, selectedInserts, selectedServices
    ]);

    const toggleSelection = (id: string, currentList: string[], setList: (l: string[]) => void) => {
        if (currentList.includes(id)) {
            setList(currentList.filter(item => item !== id));
        } else {
            setList([...currentList, id]);
        }
    };

    const handleNext = () => {
        if (currentStep < STEPS.length) {
            setCurrentStep(prev => prev + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(prev => prev - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleBookNow = () => {
        const depositAmount = 200;

        const customProduct = {
            id: 'bespoke-design-deposit',
            name: 'Bespoke Design Deposit',
            slug: 'bespoke-design-deposit',
            price: depositAmount,
            description: 'Deposit to begin your bespoke stationery design process.',
            image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=1000',
            category: 'Custom Services',
            productType: 'service' as const,
        };

        let materialDetails = '';
        if (invitationType === 'acrylic') materialDetails = acrylicOption.name;
        if (invitationType === 'vellum') materialDetails = vellumOption.name;
        if (invitationType === 'paper') materialDetails = paperOption.name;

        const customizationDetails = {
            'Estimated Total': `$${total.toFixed(2)}`,
            'Quantity': quantity.toString(),
            'Type': invitationType.charAt(0).toUpperCase() + invitationType.slice(1),
            'Shape': shape.name,
            'Material': materialDetails,
            'Print/Foil': printColor.name,
            'Envelopes': includeEnvelopes ? `${envMaterial.name} (${envColor.name})` : 'None',
            'Pockets': includePockets ? `${pocketMaterial.name} (${pocketColor.name})` : 'None',
            'Folios': includeFolios ? `${folioStyle.name} - ${folioMaterial.name} (${folioColor.name})` : 'None',
            'Inserts': selectedInserts.length > 0
                ? `${selectedInserts.map(id => {
                    const currentInsertList = insertPrintType === 'foil' ? SUITE_INSERTS_FOIL : SUITE_INSERTS_DIGITAL;
                    return currentInsertList.find(o => o.id === id)?.name;
                }).filter(Boolean).join(', ')} (${insertPrintType === 'foil' ? 'Foil-Pressed' : 'Digital'})`
                : 'None',
            'Services': selectedServices.map(id => SERVICE_ADD_ONS.find(o => o.id === id)?.name).join(', '),
            'Notes': designNotes
        };

        addToCart(customProduct, 1, customizationDetails);

        toast({
            title: "Deposit Added to Cart",
            description: "Your bespoke design configuration has been saved. Please complete checkout to book your spot.",
        });
    };

    return (
        <div className="min-h-screen bg-background pb-24">
            {/* Hero */}
            <section className="relative h-[25vh] w-full flex items-center justify-center bg-muted overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1586075010923-2dd4570fb338?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-30" />
                <div className="relative z-10 text-center space-y-2 p-4">
                    <h1 className="font-headline text-4xl md:text-5xl flex items-center justify-center gap-3">
                        <Sparkles className="h-8 w-8 text-primary" />
                        Bespoke Design Suite
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                        Craft your perfect invitation suite, step by step.
                    </p>
                </div>
            </section>

            {/* Progress Bar */}
            <div className="sticky top-16 z-40 bg-background/95 backdrop-blur border-b py-4">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="flex justify-between mb-2 text-xs md:text-sm font-medium text-muted-foreground">
                        {STEPS.map((step) => (
                            <span key={step.id} className={cn(currentStep >= step.id && "text-primary font-bold")}>
                                {step.id}. {step.title}
                            </span>
                        ))}
                    </div>
                    <Progress value={progress} className="h-2" />
                </div>
            </div>    <div className="container mx-auto px-4 py-8 max-w-6xl">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">

                    {/* Main Content Area */}
                    <div className="lg:col-span-2">
                        <FadeIn key={currentStep} duration={0.4}>
                            <div className="space-y-8 min-h-[400px]">

                                {/* Step 1: Basics */}
                                {currentStep === 1 && (
                                    <div className="space-y-8">
                                        <div className="space-y-2">
                                            <h2 className="text-2xl font-headline">Let's start with the basics.</h2>
                                            <p className="text-muted-foreground">How many guests are you expecting, and what's your preferred style?</p>
                                        </div>

                                        <div className="space-y-4">
                                            <Label className="text-base">Quantity</Label>
                                            <Select value={quantity.toString()} onValueChange={(val) => setQuantity(parseInt(val))}>
                                                <SelectTrigger className="w-full md:w-[200px] h-12 text-lg">
                                                    <SelectValue placeholder="Select Quantity" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {QUANTITY_TIERS.map(q => (
                                                        <SelectItem key={q} value={q.toString()}>{q} Sets</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <p className="text-sm text-muted-foreground flex items-center gap-2">
                                                <Info className="h-4 w-4" /> We recommend ordering 10-15 extras for keepsakes and last-minute guests.
                                            </p>
                                        </div>

                                        <div className="space-y-4">
                                            <Label className="text-base">Invitation Base Material</Label>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                {INVITATION_TYPES.map((type) => (
                                                    <div
                                                        key={type.id}
                                                        className={cn(
                                                            "cursor-pointer p-6 rounded-xl border-2 transition-all hover:shadow-md",
                                                            invitationType === type.id ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border hover:border-primary/50"
                                                        )}
                                                        onClick={() => setInvitationType(type.id)}
                                                    >
                                                        <div className="flex justify-between items-start mb-3">
                                                            <h3 className="font-bold text-lg">{type.name}</h3>
                                                            {invitationType === type.id && <Check className="h-5 w-5 text-primary" />}
                                                        </div>
                                                        <p className="text-sm text-muted-foreground leading-relaxed">{type.description}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Step 2: Materials */}
                                {currentStep === 2 && (
                                    <div className="space-y-8">
                                        <div className="space-y-2">
                                            <h2 className="text-2xl font-headline">Refine your material & shape.</h2>
                                            <p className="text-muted-foreground">Choose the specific weight, finish, and silhouette of your invitations.</p>
                                        </div>

                                        <div className="space-y-4">
                                            <Label className="text-base">
                                                {invitationType === 'acrylic' && 'Acrylic Thickness'}
                                                {invitationType === 'vellum' && 'Vellum Configuration'}
                                                {invitationType === 'paper' && 'Paper Finish & Weight'}
                                            </Label>
                                            <div className="grid grid-cols-1 gap-3">
                                                {invitationType === 'acrylic' && ACRYLIC_OPTIONS.map((opt) => (
                                                    <MaterialOptionRow
                                                        key={opt.id}
                                                        option={opt}
                                                        selected={acrylicOption.id === opt.id}
                                                        onSelect={() => setAcrylicOption(opt)}
                                                        quantity={quantity}
                                                    />
                                                ))}
                                                {invitationType === 'vellum' && VELLUM_OPTIONS.map((opt) => (
                                                    <MaterialOptionRow
                                                        key={opt.id}
                                                        option={opt}
                                                        selected={vellumOption.id === opt.id}
                                                        onSelect={() => setVellumOption(opt)}
                                                        quantity={quantity}
                                                    />
                                                ))}
                                                {invitationType === 'paper' && PAPER_OPTIONS.map((opt) => (
                                                    <MaterialOptionRow
                                                        key={opt.id}
                                                        option={opt}
                                                        selected={paperOption.id === opt.id}
                                                        onSelect={() => setPaperOption(opt)}
                                                        quantity={quantity}
                                                    />
                                                ))}
                                            </div>
                                        </div>

                                        <Separator />

                                        <div className="space-y-4">
                                            <div className="flex items-center gap-2">
                                                <Label className="text-base">Invitation Shape</Label>
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger><HelpCircle className="h-4 w-4 text-muted-foreground" /></TooltipTrigger>
                                                        <TooltipContent>Some shapes may require special envelopes.</TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            </div>
                                            <div className="grid grid-cols-4 md:grid-cols-4 gap-6">
                                                {SHAPES.map((s) => (
                                                    <div
                                                        key={s.id}
                                                        className="flex flex-col items-center gap-3 cursor-pointer group"
                                                        onClick={() => setShape(s)}
                                                    >
                                                        <div className={cn(
                                                            "w-full aspect-[3/4] flex items-center justify-center p-2 transition-all",
                                                            shape.id === s.id ? "scale-105" : ""
                                                        )}>
                                                            <ShapeVisual id={s.id} isSelected={shape.id === s.id} />
                                                        </div>
                                                        <div className="text-center">
                                                            <p className={cn("text-xs font-medium", shape.id === s.id ? "text-primary" : "text-muted-foreground")}>{s.name}</p>
                                                            <p className="text-[10px] text-muted-foreground">
                                                                (${s.price.toFixed(2)}{s.type === 'flat' ? ' flat' : ''})
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Step 3: Design */}
                                {currentStep === 3 && (
                                    <div className="space-y-8">
                                        <div className="space-y-2">
                                            <h2 className="text-2xl font-headline">Set the tone.</h2>
                                            <p className="text-muted-foreground">Select your printing method and add matching inserts.</p>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex items-center gap-2">
                                                <Label className="text-base">Print / Foil Color</Label>
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger><HelpCircle className="h-4 w-4 text-muted-foreground" /></TooltipTrigger>
                                                        <TooltipContent className="max-w-xs">
                                                            <p className="font-semibold mb-1">Printing Methods:</p>
                                                            <ul className="list-disc pl-4 space-y-1 text-xs">
                                                                <li><strong>Foil Stamping:</strong> Premium metallic finish for a luxurious shine.</li>
                                                                <li><strong>Digital Color:</strong> High-quality flat printing, perfect for paper.</li>
                                                                <li><strong>UV Printing:</strong> Vibrant, raised ink ideal for Acrylic materials.</li>
                                                            </ul>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            </div>

                                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-6">
                                                {PRINT_COLORS.map((c) => (
                                                    <div
                                                        key={c.id}
                                                        className="flex flex-col items-center gap-2 cursor-pointer group"
                                                        onClick={() => setPrintColor(c)}
                                                    >
                                                        <div className={cn(
                                                            "w-14 h-14 rounded-full shadow-sm transition-all relative",
                                                            c.bgClass,
                                                            printColor.id === c.id ? "ring-4 ring-primary ring-offset-2 scale-110" : "group-hover:scale-105"
                                                        )}>
                                                            {printColor.id === c.id && (
                                                                <div className="absolute inset-0 flex items-center justify-center">
                                                                    <Check className={cn("h-6 w-6 drop-shadow-md", c.textClass || "text-white")} />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="text-center">
                                                            <p className={cn("text-xs font-medium", printColor.id === c.id ? "text-primary" : "text-muted-foreground")}>{c.name}</p>
                                                            <p className="text-[10px] text-muted-foreground">(${(c.price * quantity).toFixed(2)})</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <Separator />

                                        <div className="space-y-6">
                                            <Label className="text-base uppercase tracking-wide text-muted-foreground text-sm font-semibold">
                                                Select {insertPrintType === 'foil' ? 'Foil-Pressed' : 'Digital'} Matching Inserts
                                            </Label>

                                            <div className="bg-muted/30 p-4 rounded-lg border">
                                                <Label className="mb-3 block text-sm font-medium text-muted-foreground">Insert Printing Method</Label>
                                                <RadioGroup value={insertPrintType} onValueChange={(v: 'foil' | 'digital') => setInsertPrintType(v)} className="flex gap-6">
                                                    <div className="flex items-center space-x-2">
                                                        <RadioGroupItem value="digital" id="digital-insert" />
                                                        <Label htmlFor="digital-insert">Digital Color Printing <span className="text-xs text-muted-foreground">(Standard)</span></Label>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <RadioGroupItem value="foil" id="foil-insert" />
                                                        <Label htmlFor="foil-insert">Foil-Pressed <span className="text-xs text-primary font-medium">(Premium)</span></Label>
                                                    </div>
                                                </RadioGroup>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                {(insertPrintType === 'foil' ? SUITE_INSERTS_FOIL : SUITE_INSERTS_DIGITAL).map((insert) => {
                                                    return (
                                                        <div key={insert.id}
                                                            className={cn(
                                                                "flex items-center space-x-3 p-4 border rounded-lg transition-colors cursor-pointer",
                                                                selectedInserts.includes(insert.id) ? "bg-primary/5 border-primary" : "hover:bg-muted/50"
                                                            )}
                                                            onClick={() => toggleSelection(insert.id, selectedInserts, setSelectedInserts)}
                                                        >
                                                            <Checkbox
                                                                id={`insert-${insert.id}`}
                                                                checked={selectedInserts.includes(insert.id)}
                                                                onCheckedChange={() => toggleSelection(insert.id, selectedInserts, setSelectedInserts)}
                                                            />
                                                            <div className="flex-1">
                                                                <Label htmlFor={`insert-${insert.id}`} className="font-medium cursor-pointer">
                                                                    {insert.name}
                                                                </Label>
                                                                {insert.description && (
                                                                    <p className="text-xs text-muted-foreground mt-0.5">{insert.description}</p>
                                                                )}
                                                            </div>
                                                            <div className="text-right">
                                                                <span className="text-sm font-medium block">
                                                                    ${insert.price.toFixed(2)}
                                                                </span>
                                                                <span className="text-[10px] text-muted-foreground">
                                                                    (per set of {quantity})
                                                                </span>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Step 4: Finishing */}
                                {currentStep === 4 && (
                                    <div className="space-y-8">
                                        <div className="space-y-2">
                                            <h2 className="text-2xl font-headline">The Finishing Touches.</h2>
                                            <p className="text-muted-foreground">Elevate your suite with premium packaging and services.</p>
                                        </div>

                                        {/* Envelopes Section */}
                                        <div className="space-y-6 border p-6 rounded-xl bg-muted/10">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-primary/10 rounded-full">
                                                        <Mail className="h-6 w-6 text-primary" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-lg font-bold">Envelopes & Packaging</h3>
                                                        <p className="text-sm text-muted-foreground">Customize your mailing experience.</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Label htmlFor="include-envelopes" className="cursor-pointer">Include Envelopes?</Label>
                                                    <Checkbox
                                                        id="include-envelopes"
                                                        checked={includeEnvelopes}
                                                        onCheckedChange={(c) => setIncludeEnvelopes(!!c)}
                                                    />
                                                </div>
                                            </div>

                                            {includeEnvelopes && (
                                                <div className="space-y-8 pt-4 animate-in fade-in slide-in-from-top-4">

                                                    {/* Material */}
                                                    <div className="space-y-3">
                                                        <Label className="text-base">Choose Envelope Material</Label>
                                                        <Select value={envMaterial.id} onValueChange={(val) => setEnvMaterial(ENVELOPE_MATERIALS.find(m => m.id === val) || ENVELOPE_MATERIALS[0])}>
                                                            <SelectTrigger className="w-full h-12">
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {ENVELOPE_MATERIALS.map(m => (
                                                                    <SelectItem key={m.id} value={m.id}>
                                                                        {m.name} (+${m.price.toFixed(2)}/ea)
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>

                                                    {/* Color */}
                                                    <div className="space-y-3">
                                                        <Label className="text-base">Choose Envelope Color</Label>
                                                        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-4">
                                                            {ENVELOPE_COLORS.map(c => (
                                                                <div
                                                                    key={c.id}
                                                                    className="flex flex-col items-center gap-2 cursor-pointer group"
                                                                    onClick={() => setEnvColor(c)}
                                                                >
                                                                    <div
                                                                        className={cn(
                                                                            "w-10 h-10 rounded-full border shadow-sm transition-all relative",
                                                                            envColor.id === c.id ? "ring-2 ring-primary ring-offset-2 scale-110" : "group-hover:scale-105"
                                                                        )}
                                                                        style={{ backgroundColor: c.hex }}
                                                                    >
                                                                        {envColor.id === c.id && (
                                                                            <div className="absolute inset-0 flex items-center justify-center">
                                                                                <Check className={cn("h-4 w-4 drop-shadow-md", c.id === 'white' || c.id === 'ivory' ? "text-black" : "text-white")} />
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                    <div className="text-center">
                                                                        <p className="text-[10px] font-medium truncate w-full">{c.name}</p>
                                                                        <p className="text-[10px] text-muted-foreground">{c.price > 0 ? `+$${c.price.toFixed(2)}` : 'Free'}</p>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    <Separator />

                                                    {/* Embellishments */}
                                                    <div className="space-y-3">
                                                        <Label className="text-base uppercase tracking-wide text-muted-foreground text-xs font-bold">Envelope Embellishments</Label>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                            {ENVELOPE_EMBELLISHMENTS.map(opt => (
                                                                <div key={opt.id} className="flex items-center space-x-2">
                                                                    <Checkbox
                                                                        id={`emb-${opt.id}`}
                                                                        checked={selectedEmbellishments.includes(opt.id)}
                                                                        onCheckedChange={() => toggleSelection(opt.id, selectedEmbellishments, setSelectedEmbellishments)}
                                                                    />
                                                                    <Label htmlFor={`emb-${opt.id}`} className="text-sm font-normal cursor-pointer flex-1">
                                                                        {opt.name}
                                                                    </Label>
                                                                    <span className="text-xs text-muted-foreground">+${opt.price.toFixed(2)}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {/* Liners */}
                                                    <div className="space-y-3">
                                                        <Label className="text-base uppercase tracking-wide text-muted-foreground text-xs font-bold">Decorate the Interior (Liners)</Label>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                            {ENVELOPE_LINERS.map(opt => (
                                                                <div key={opt.id} className="flex items-center space-x-2">
                                                                    <Checkbox
                                                                        id={`liner-${opt.id}`}
                                                                        checked={selectedLiner === opt.id}
                                                                        onCheckedChange={(c) => setSelectedLiner(c ? opt.id : null)}
                                                                    />
                                                                    <Label htmlFor={`liner-${opt.id}`} className="text-sm font-normal cursor-pointer flex-1">
                                                                        {opt.name}
                                                                    </Label>
                                                                    <span className="text-xs text-muted-foreground">+${opt.price.toFixed(2)}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {/* Seals */}
                                                    <div className="space-y-3">
                                                        <Label className="text-base uppercase tracking-wide text-muted-foreground text-xs font-bold">Seal with Elegance</Label>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                            {ENVELOPE_SEALS.map(opt => (
                                                                <div key={opt.id} className="flex items-center space-x-2">
                                                                    <Checkbox
                                                                        id={`seal-${opt.id}`}
                                                                        checked={selectedSeals.includes(opt.id)}
                                                                        onCheckedChange={() => toggleSelection(opt.id, selectedSeals, setSelectedSeals)}
                                                                    />
                                                                    <Label htmlFor={`seal-${opt.id}`} className="text-sm font-normal cursor-pointer flex-1">
                                                                        {opt.name}
                                                                    </Label>
                                                                    <span className="text-xs text-muted-foreground">+${opt.price.toFixed(2)}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {/* Addressing */}
                                                    <div className="space-y-3">
                                                        <Label className="text-base uppercase tracking-wide text-muted-foreground text-xs font-bold">Addressing Services</Label>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                            {ENVELOPE_ADDRESSING.map(opt => (
                                                                <div key={opt.id} className="flex items-center space-x-2">
                                                                    <Checkbox
                                                                        id={`addr-${opt.id}`}
                                                                        checked={selectedAddressing.includes(opt.id)}
                                                                        onCheckedChange={() => toggleSelection(opt.id, selectedAddressing, setSelectedAddressing)}
                                                                    />
                                                                    <Label htmlFor={`addr-${opt.id}`} className="text-sm font-normal cursor-pointer flex-1">
                                                                        {opt.name}
                                                                    </Label>
                                                                    <span className="text-xs text-muted-foreground">+${opt.price.toFixed(2)}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Pockets Section */}
                                        <div className="space-y-6 border p-6 rounded-xl bg-muted/10">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-primary/10 rounded-full">
                                                        <Sparkles className="h-6 w-6 text-primary" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-lg font-bold">Pockets & Holders</h3>
                                                        <p className="text-sm text-muted-foreground">Add a luxurious pocket to hold your inserts.</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Label htmlFor="include-pockets" className="cursor-pointer">Include Pockets?</Label>
                                                    <Checkbox
                                                        id="include-pockets"
                                                        checked={includePockets}
                                                        onCheckedChange={(c) => setIncludePockets(!!c)}
                                                    />
                                                </div>
                                            </div>

                                            {includePockets && (
                                                <div className="space-y-8 pt-4 animate-in fade-in slide-in-from-top-4">

                                                    {/* Material */}
                                                    <div className="space-y-3">
                                                        <Label className="text-base">Choose Pocket Material</Label>
                                                        <Select value={pocketMaterial.id} onValueChange={(val) => setPocketMaterial(POCKET_MATERIALS.find(m => m.id === val) || POCKET_MATERIALS[0])}>
                                                            <SelectTrigger className="w-full h-12">
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {POCKET_MATERIALS.map(m => (
                                                                    <SelectItem key={m.id} value={m.id}>
                                                                        {m.name} (+${m.price.toFixed(2)}/ea)
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>

                                                    {/* Color */}
                                                    <div className="space-y-3">
                                                        <Label className="text-base">Choose Pocket Color</Label>
                                                        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-4">
                                                            {POCKET_COLORS.map(c => (
                                                                <div
                                                                    key={c.id}
                                                                    className="flex flex-col items-center gap-2 cursor-pointer group"
                                                                    onClick={() => setPocketColor(c)}
                                                                >
                                                                    <div
                                                                        className={cn(
                                                                            "w-10 h-10 rounded-full border shadow-sm transition-all relative",
                                                                            pocketColor.id === c.id ? "ring-2 ring-primary ring-offset-2 scale-110" : "group-hover:scale-105"
                                                                        )}
                                                                        style={{ backgroundColor: c.hex }}
                                                                    >
                                                                        {pocketColor.id === c.id && (
                                                                            <div className="absolute inset-0 flex items-center justify-center">
                                                                                <Check className={cn("h-4 w-4 drop-shadow-md", c.id === 'white' || c.id === 'ivory' ? "text-black" : "text-white")} />
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                    <div className="text-center">
                                                                        <p className="text-[10px] font-medium truncate w-full">{c.name}</p>
                                                                        <p className="text-[10px] text-muted-foreground">{c.price > 0 ? `+$${c.price.toFixed(2)}` : 'Free'}</p>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    <Separator />

                                                    {/* Embellishments */}
                                                    <div className="space-y-3">
                                                        <Label className="text-base uppercase tracking-wide text-muted-foreground text-xs font-bold">Pocket Embellishments</Label>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                            {POCKET_EMBELLISHMENTS.map(opt => (
                                                                <div key={opt.id} className="flex items-center space-x-2">
                                                                    <Checkbox
                                                                        id={`pocket-emb-${opt.id}`}
                                                                        checked={selectedPocketEmbellishments.includes(opt.id)}
                                                                        onCheckedChange={() => toggleSelection(opt.id, selectedPocketEmbellishments, setSelectedPocketEmbellishments)}
                                                                    />
                                                                    <Label htmlFor={`pocket-emb-${opt.id}`} className="text-sm font-normal cursor-pointer flex-1">
                                                                        {opt.name}
                                                                    </Label>
                                                                    <span className="text-xs text-muted-foreground">+${opt.price.toFixed(2)}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>

                                                </div>
                                            )}
                                        </div>



                                        {/* Folios Section */}
                                        <div className="space-y-6 border p-6 rounded-xl bg-muted/10">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-primary/10 rounded-full">
                                                        <BookOpen className="h-6 w-6 text-primary" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-lg font-bold">Folios</h3>
                                                        <p className="text-sm text-muted-foreground">Present your invitation in a stunning folio.</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Label htmlFor="include-folios" className="cursor-pointer">Include Folios?</Label>
                                                    <Checkbox
                                                        id="include-folios"
                                                        checked={includeFolios}
                                                        onCheckedChange={(c) => setIncludeFolios(!!c)}
                                                    />
                                                </div>
                                            </div>

                                            {includeFolios && (
                                                <div className="space-y-8 pt-4 animate-in fade-in slide-in-from-top-4">

                                                    {/* Style */}
                                                    <div className="space-y-3">
                                                        <Label className="text-base">Choose Folio Style</Label>
                                                        <Select value={folioStyle.id} onValueChange={(val) => {
                                                            const style = FOLIO_STYLES.find(s => s.id === val) || FOLIO_STYLES[0];
                                                            setFolioStyle(style);
                                                            // Reset material when style changes as materials are style-specific
                                                            setFolioMaterial(FOLIO_MATERIALS[style.id][0]);
                                                        }}>
                                                            <SelectTrigger className="w-full h-12">
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {FOLIO_STYLES.map(s => (
                                                                    <SelectItem key={s.id} value={s.id}>
                                                                        {s.name}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>

                                                    {/* Material */}
                                                    <div className="space-y-3">
                                                        <Label className="text-base">Choose Folio Material</Label>
                                                        <Select value={folioMaterial.id} onValueChange={(val) => setFolioMaterial(FOLIO_MATERIALS[folioStyle.id].find(m => m.id === val) || FOLIO_MATERIALS[folioStyle.id][0])}>
                                                            <SelectTrigger className="w-full h-12">
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {FOLIO_MATERIALS[folioStyle.id].map(m => (
                                                                    <SelectItem key={m.id} value={m.id}>
                                                                        {m.name} (+${m.price.toFixed(2)}/ea)
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>

                                                    {/* Color */}
                                                    <div className="space-y-3">
                                                        <Label className="text-base">Choose Folio Color</Label>
                                                        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-4">
                                                            {POCKET_COLORS.map(c => (
                                                                <div
                                                                    key={c.id}
                                                                    className="flex flex-col items-center gap-2 cursor-pointer group"
                                                                    onClick={() => setFolioColor(c)}
                                                                >
                                                                    <div
                                                                        className={cn(
                                                                            "w-10 h-10 rounded-full border shadow-sm transition-all relative",
                                                                            folioColor.id === c.id ? "ring-2 ring-primary ring-offset-2 scale-110" : "group-hover:scale-105"
                                                                        )}
                                                                        style={{ backgroundColor: c.hex }}
                                                                    >
                                                                        {folioColor.id === c.id && (
                                                                            <div className="absolute inset-0 flex items-center justify-center">
                                                                                <Check className={cn("h-4 w-4 drop-shadow-md", c.id === 'white' || c.id === 'ivory' ? "text-black" : "text-white")} />
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                    <div className="text-center">
                                                                        <p className="text-[10px] font-medium truncate w-full">{c.name}</p>
                                                                        <p className="text-[10px] text-muted-foreground">{c.price > 0 ? `+$${c.price.toFixed(2)}` : 'Free'}</p>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    <Separator />

                                                    {/* Embellishments */}
                                                    <div className="space-y-3">
                                                        <Label className="text-base uppercase tracking-wide text-muted-foreground text-xs font-bold">Folio Embellishments</Label>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                            {FOLIO_EMBELLISHMENTS.map(opt => (
                                                                <div key={opt.id} className="flex items-center space-x-2">
                                                                    <Checkbox
                                                                        id={`folio-emb-${opt.id}`}
                                                                        checked={selectedFolioEmbellishments.includes(opt.id)}
                                                                        onCheckedChange={() => toggleSelection(opt.id, selectedFolioEmbellishments, setSelectedFolioEmbellishments)}
                                                                    />
                                                                    <Label htmlFor={`folio-emb-${opt.id}`} className="text-sm font-normal cursor-pointer flex-1">
                                                                        {opt.name}
                                                                    </Label>
                                                                    <span className="text-xs text-muted-foreground">+${opt.price.toFixed(2)}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>

                                                </div>
                                            )}
                                        </div>

                                        <Separator />

                                        <div className="space-y-4">
                                            <Label className="text-base">Professional Services</Label>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                {SERVICE_ADD_ONS.map((service) => (
                                                    <div key={service.id}
                                                        className={cn(
                                                            "flex items-center space-x-3 p-4 border rounded-lg transition-colors cursor-pointer",
                                                            selectedServices.includes(service.id) ? "bg-primary/5 border-primary" : "hover:bg-muted/50"
                                                        )}
                                                        onClick={() => toggleSelection(service.id, selectedServices, setSelectedServices)}
                                                    >
                                                        <Checkbox
                                                            id={`svc-${service.id}`}
                                                            checked={selectedServices.includes(service.id)}
                                                            onCheckedChange={() => toggleSelection(service.id, selectedServices, setSelectedServices)}
                                                        />
                                                        <div className="flex-1">
                                                            <Label htmlFor={`svc-${service.id}`} className="font-medium cursor-pointer">{service.name}</Label>
                                                        </div>
                                                        <span className="text-sm font-medium">
                                                            +${service.price.toFixed(2)} {service.type === 'per_unit' ? '/ea' : 'flat'}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Step 5: Review */}
                                {currentStep === 5 && (
                                    <div className="space-y-8">
                                        <div className="space-y-2">
                                            <h2 className="text-2xl font-headline">Final Details.</h2>
                                            <p className="text-muted-foreground">Add your wording, upload inspiration, and review your order.</p>
                                        </div>

                                        <div className="space-y-6">
                                            <div className="space-y-2">
                                                <Label className="text-base">Wording & Design Notes</Label>
                                                <Textarea
                                                    placeholder="Enter your invitation wording, special requests, or any design notes here..."
                                                    className="min-h-[150px] text-base"
                                                    value={designNotes}
                                                    onChange={(e) => setDesignNotes(e.target.value)}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label className="text-base">File Upload</Label>
                                                <p className="text-sm text-muted-foreground mb-2">Attach inspirations, guest lists, fonts, or sketches.</p>
                                                <div className="flex gap-2 items-center">
                                                    <Input type="file" className="cursor-pointer max-w-md" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                            </div>
                        </FadeIn>

                        {/* Navigation Buttons */}
                        <div className="flex justify-between mt-12 pt-6 border-t">
                            <Button
                                variant="outline"
                                onClick={handleBack}
                                disabled={currentStep === 1}
                                className="w-32"
                            >
                                <ChevronLeft className="mr-2 h-4 w-4" /> Back
                            </Button>

                            {currentStep < STEPS.length ? (
                                <Button onClick={handleNext} className="w-32">
                                    Next <ChevronRight className="ml-2 h-4 w-4" />
                                </Button>
                            ) : (
                                <Button onClick={handleBookNow} size="lg" className="w-full md:w-auto px-8 bg-primary text-primary-foreground hover:bg-primary/90">
                                    Book Design Spot ($200)
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Sticky Summary Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-32">
                            <Card className="shadow-xl border-primary/20 overflow-hidden">
                                <div className="h-2 bg-primary w-full" />
                                <CardHeader className="bg-muted/30 pb-4">
                                    <CardTitle className="font-headline text-2xl">Your Estimate</CardTitle>
                                    <CardDescription>Based on {quantity} sets</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4 pt-6 max-h-[60vh] overflow-y-auto custom-scrollbar">

                                    <SummaryRow
                                        label="Shape"
                                        value={shape.name}
                                        price={shape.type === 'flat' ? shape.price : shape.price * quantity}
                                    />

                                    {invitationType === 'acrylic' && <SummaryRow label="Acrylic" value={acrylicOption.name} price={acrylicOption.price * quantity} />}
                                    {invitationType === 'vellum' && <SummaryRow label="Vellum" value={vellumOption.name} price={vellumOption.price * quantity} />}
                                    {invitationType === 'paper' && <SummaryRow label="Paper" value={paperOption.name} price={paperOption.price * quantity} />}

                                    <SummaryRow label="Print/Foil" value={printColor.name} price={printColor.price * quantity} />

                                    {includeEnvelopes && (
                                        <>
                                            <Separator className="my-2" />
                                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Envelopes</span>
                                            <SummaryRow label="Material" value={envMaterial.name} price={envMaterial.price * quantity} />
                                            <SummaryRow label="Color" value={envColor.name} price={envColor.price * quantity} />

                                            {selectedEmbellishments.map(id => {
                                                const opt = ENVELOPE_EMBELLISHMENTS.find(o => o.id === id)!;
                                                return <SummaryRow key={id} label={opt.name} value="" price={opt.price * quantity} />
                                            })}

                                            {selectedLiner && (
                                                <SummaryRow label="Liner" value={ENVELOPE_LINERS.find(o => o.id === selectedLiner)!.name} price={ENVELOPE_LINERS.find(o => o.id === selectedLiner)!.price * quantity} />
                                            )}

                                            {selectedSeals.map(id => {
                                                const opt = ENVELOPE_SEALS.find(o => o.id === id)!;
                                                return <SummaryRow key={id} label={opt.name} value="" price={opt.price * quantity} />
                                            })}

                                            {selectedAddressing.map(id => {
                                                const opt = ENVELOPE_ADDRESSING.find(o => o.id === id)!;
                                                return <SummaryRow key={id} label={opt.name} value="" price={opt.price * quantity} />
                                            })}
                                        </>
                                    )}

                                    {includePockets && (
                                        <>
                                            <Separator className="my-2" />
                                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Pockets</span>
                                            <SummaryRow label="Material" value={pocketMaterial.name} price={pocketMaterial.price * quantity} />
                                            <SummaryRow label="Color" value={pocketColor.name} price={pocketColor.price * quantity} />

                                            {selectedPocketEmbellishments.map(id => {
                                                const opt = POCKET_EMBELLISHMENTS.find(o => o.id === id)!;
                                                return <SummaryRow key={id} label={opt.name} value="" price={opt.price * quantity} />
                                            })}
                                        </>
                                    )}

                                    {includeFolios && (
                                        <>
                                            <Separator className="my-2" />
                                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Folios</span>
                                            <SummaryRow label="Style" value={folioStyle.name} price={0} />
                                            <SummaryRow label="Material" value={folioMaterial.name} price={folioMaterial.price * quantity} />
                                            <SummaryRow label="Color" value={folioColor.name} price={folioColor.price * quantity} />

                                            {selectedFolioEmbellishments.map(id => {
                                                const opt = FOLIO_EMBELLISHMENTS.find(o => o.id === id)!;
                                                return <SummaryRow key={id} label={opt.name} value="" price={opt.price * quantity} />
                                            })}
                                        </>
                                    )}

                                    {selectedInserts.length > 0 && (
                                        <>
                                            <Separator className="my-2" />
                                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                                Inserts ({insertPrintType === 'foil' ? 'Foil-Pressed' : 'Digital'})
                                            </span>
                                            {selectedInserts.map(id => {
                                                const currentInsertList = insertPrintType === 'foil' ? SUITE_INSERTS_FOIL : SUITE_INSERTS_DIGITAL;
                                                const opt = currentInsertList.find(o => o.id === id)!;
                                                return <SummaryRow key={id} label={opt.name} value="" price={opt.price} />
                                            })}
                                        </>
                                    )}

                                    {selectedServices.length > 0 && (
                                        <>
                                            <Separator className="my-2" />
                                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Services</span>
                                            {selectedServices.map(id => {
                                                const opt = SERVICE_ADD_ONS.find(o => o.id === id)!;
                                                const price = opt.type === 'per_unit' ? opt.price * quantity : opt.price;
                                                return <SummaryRow key={id} label={opt.name} value={opt.type === 'flat' ? 'Flat Fee' : ''} price={price} />
                                            })}
                                        </>
                                    )}

                                    <Separator className="my-4" />

                                    <div className="flex justify-between items-end">
                                        <span className="font-bold text-lg">Estimated Total</span>
                                        <div className="text-right">
                                            <span className="font-headline text-3xl text-primary">${total.toFixed(2)}</span>
                                            <p className="text-xs text-muted-foreground">approx. ${(total / quantity).toFixed(2)} per set</p>
                                        </div>
                                    </div>

                                    <div className="bg-blue-50 dark:bg-blue-950/30 p-3 rounded-md flex gap-2 text-xs text-blue-700 dark:text-blue-300">
                                        <Info className="h-4 w-4 shrink-0 mt-0.5" />
                                        <p>This is an estimate. Final pricing may vary based on specific design requirements.</p>
                                    </div>
                                </CardContent>
                                {currentStep === 5 && (
                                    <CardFooter className="bg-muted/30 pt-6">
                                        <p className="text-xs text-center text-muted-foreground w-full">
                                            The $200 deposit is credited towards your final invoice.
                                        </p>
                                    </CardFooter>
                                )}
                            </Card>
                        </div>
                    </div>

                </div >
            </div >
        </div >
    );
}

// --- Helper Components ---

function MaterialOptionRow({ option, selected, onSelect, quantity }: { option: Option, selected: boolean, onSelect: () => void, quantity: number }) {
    return (
        <div
            className={cn(
                "flex items-center gap-4 p-4 rounded-xl cursor-pointer border-2 transition-all",
                selected ? "border-primary bg-primary/5 shadow-sm" : "border-transparent bg-muted/30 hover:bg-muted"
            )}
            onClick={onSelect}
        >
            <div className={cn(
                "w-6 h-6 rounded-full border-2 border-primary flex items-center justify-center shrink-0 transition-colors",
                selected ? "bg-primary" : "bg-transparent"
            )}>
                {selected && <Check className="h-3.5 w-3.5 text-primary-foreground" />}
            </div>
            <div className="flex-grow">
                <span className="text-base font-medium">{option.name}</span>
            </div>
            <div className="text-sm font-medium text-muted-foreground">
                ${(option.price * quantity).toFixed(2)}
            </div>
        </div>
    );
}

function SummaryRow({ label, value, price }: { label: string, value: string, price: number }) {
    if (price === 0) return null;
    return (
        <div className="flex justify-between text-sm group">
            <div className="flex flex-col">
                <span className="text-muted-foreground group-hover:text-foreground transition-colors">{label}</span>
                {value && <span className="font-medium text-xs truncate max-w-[150px]">{value}</span>}
            </div>
            <span className="font-medium">${price.toFixed(2)}</span>
        </div>
    );
}

function ShapeVisual({ id, isSelected }: { id: string, isSelected: boolean }) {
    const strokeClass = isSelected ? "stroke-primary stroke-[2px]" : "stroke-muted-foreground/40 group-hover:stroke-primary/50 stroke-[1.5px]";
    const fillClass = isSelected ? "fill-primary/5" : "fill-transparent group-hover:fill-muted/20";

    const svgProps = {
        className: `w-full h-full transition-all duration-300 ${strokeClass} ${fillClass}`,
        xmlns: "http://www.w3.org/2000/svg",
    };

    switch (id) {
        case 'rectangle':
            return (
                <svg viewBox="0 0 100 140" {...svgProps}>
                    <rect x="2" y="2" width="96" height="136" rx="2" vectorEffect="non-scaling-stroke" />
                </svg>
            );
        case 'square':
            return (
                <svg viewBox="0 0 100 100" {...svgProps}>
                    <rect x="2" y="2" width="96" height="96" rx="2" vectorEffect="non-scaling-stroke" />
                </svg>
            );
        case 'tall':
            return (
                <svg viewBox="0 0 70 140" {...svgProps}>
                    <rect x="2" y="2" width="66" height="136" rx="2" vectorEffect="non-scaling-stroke" />
                </svg>
            );
        case 'hexagon':
            return (
                <svg viewBox="0 0 100 100" {...svgProps}>
                    <path d="M50 2 L98 26.5 L98 73.5 L50 98 L2 73.5 L2 26.5 Z" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
                </svg>
            );
        case 'rounded':
            return (
                <svg viewBox="0 0 100 140" {...svgProps}>
                    <rect x="2" y="2" width="96" height="136" rx="15" vectorEffect="non-scaling-stroke" />
                </svg>
            );
        case 'arch':
            return (
                <svg viewBox="0 0 100 140" {...svgProps}>
                    <path d="M2,50 L2,138 L98,138 L98,50 A48,48 0 0 0 2,50 Z" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
                </svg>
            );
        case 'circle':
            return (
                <svg viewBox="0 0 100 100" {...svgProps}>
                    <circle cx="50" cy="50" r="48" vectorEffect="non-scaling-stroke" />
                </svg>
            );
        case 'custom':
            return (
                <svg viewBox="0 0 100 140" {...svgProps}>
                    <rect x="2" y="2" width="96" height="136" rx="2" strokeDasharray="6 4" vectorEffect="non-scaling-stroke" />
                    <path d="M50 40 L53 60 L73 63 L53 66 L50 86 L47 66 L27 63 L47 60 Z" className="fill-current opacity-20" />
                </svg>
            );
        default:
            return null;
    }
}
