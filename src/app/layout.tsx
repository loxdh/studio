import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { Toaster } from '@/components/ui/toaster';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import { CartProvider } from '@/components/cart/CartProvider';
import { WishlistProvider } from '@/components/wishlist/WishlistProvider';
import { FirebaseClientProvider } from '@/firebase';
import { NewsletterPopup } from '@/components/NewsletterPopup';
import { CookieConsent } from '@/components/CookieConsent';

export const metadata: Metadata = {
  metadataBase: new URL('https://unitedloveluxe.com'),
  title: {
    default: 'United Love Luxe | Luxury Wedding Stationery',
    template: '%s | United Love Luxe',
  },
  description: 'Bespoke and semi-custom wedding invitations, save the dates, and fine stationery for the modern romantic. Specializing in acrylic, vellum, and foil-pressed designs.',
  keywords: ['wedding invitations', 'luxury stationery', 'acrylic invitations', 'vellum invitations', 'foil pressed', 'custom wedding design', 'bespoke stationery', 'wedding invites'],
  authors: [{ name: 'United Love Luxe' }],
  creator: 'United Love Luxe',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://unitedloveluxe.com',
    siteName: 'United Love Luxe',
    title: 'United Love Luxe | Luxury Wedding Stationery',
    description: 'Bespoke and semi-custom wedding invitations, save the dates, and fine stationery for the modern romantic.',
    images: [
      {
        url: '/og-image.jpg', // We should ensure this image exists or use a placeholder
        width: 1200,
        height: 630,
        alt: 'United Love Luxe - Luxury Wedding Stationery',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'United Love Luxe | Luxury Wedding Stationery',
    description: 'Bespoke and semi-custom wedding invitations, save the dates, and fine stationery for the modern romantic.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;700&family=Montserrat:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased" suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <FirebaseClientProvider>
            <CartProvider>
              <WishlistProvider>
                <div className="flex min-h-screen flex-col">
                  <Navigation />
                  <main className="flex-grow">{children}</main>
                  <Footer />
                </div>
                <Toaster />
                <NewsletterPopup />
                <CookieConsent />
              </WishlistProvider>
            </CartProvider>
          </FirebaseClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
