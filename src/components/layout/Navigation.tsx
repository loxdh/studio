'use client';
import React from 'react';
import Link from 'next/link';
import { BookHeart, Menu, ShoppingBag, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useCart } from '@/hooks/useCart';
import CartSheet from '@/components/cart/CartSheet';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import SearchBar from './SearchBar';
import { useWishlist } from '@/hooks/useWishlist';

const weddingInvitations = [
  { title: 'Acrylic Invitations', href: '/products?category=Wedding Invitations' },
  { title: 'Velvet Invitations', href: '/products?category=Wedding Invitations' },
  { title: 'Vellum Invitations', href: '/products?category=Wedding Invitations' },
  { title: 'Paper Invitations', href: '/products?category=Wedding Invitations' },
  { title: 'Thick Block Invitations', href: '/products?category=Wedding Invitations' },
];

const saveTheDates = [
  { title: 'Passport Save the Dates', href: '/products?category=Save the Dates' },
  { title: 'Ticket Save the Dates', href: '/products?category=Save the Dates' },
  { title: 'Paper Save the Dates', href: '/products?category=Save the Dates' },
  { title: 'Embossed Save the Dates', href: '/products?category=Save the Dates' },
  { title: 'Interactive Save the Dates', href: '/products?category=Save the Dates' },
  { title: 'Gatefold Save the Dates', href: '/products?category=Save the Dates' },
  { title: 'Vellum Save the Dates', href: '/products?category=Save the Dates' },
  { title: 'Arc Save the Dates', href: '/products?category=Save the Dates' },
  { title: 'Kraft Save the Dates', href: '/products?category=Save the Dates' },
];

const boxAndFolio = [
  { title: 'Velvet Boxed Invitations', href: '/products?category=Box & Folio Invitations' },
  { title: 'Paper Boxed Invitations', href: '/products?category=Box & Folio Invitations' },
  { title: 'Velvet Folios', href: '/products?category=Box & Folio Invitations' },
  { title: 'Paper Folios', href: '/products?category=Box & Folio Invitations' },
]

const insertsAndAddons = [
  { title: 'RSVP Cards', href: '/products?category=Inserts & Add-Ons' },
  { title: 'Return Envelopes', href: '/products?category=Inserts & Add-Ons' },
  { title: 'Details Cards', href: '/products?category=Inserts & Add-Ons' },
  { title: 'Menu Cards', href: '/products?category=Inserts & Add-Ons' },
  { title: 'Place Cards', href: '/products?category=Inserts & Add-Ons' },
  { title: 'Table Cards', href: '/products?category=Inserts & Add-Ons' },
  { title: 'Guest Addressing Labels', href: '/products?category=Inserts & Add-Ons' },
  { title: 'Clear/White/Kraft Seals', href: '/products?category=Inserts & Add-Ons' },
]

const Navigation = () => {
  const { cartItems } = useCart();
  const { wishlistItems } = useWishlist();
  const totalItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [cartOpen, setCartOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-300 border-b",
        isScrolled
          ? "bg-background/80 backdrop-blur-md border-border shadow-sm"
          : "bg-transparent border-transparent"
      )}
    >
      <div className="container flex h-16 items-center">


        {/* Desktop Nav */}
        <div className="mr-4 hidden lg:flex">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                  <Link href="/">Home</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Wedding Invitations</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                    {weddingInvitations.map((component) => (
                      <ListItem
                        key={component.title}
                        title={component.title}
                        href={component.href}
                      />
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Save the Dates</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                    {saveTheDates.map((component) => (
                      <ListItem
                        key={component.title}
                        title={component.title}
                        href={component.href}
                      />
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Box & Folio</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                    {boxAndFolio.map((component) => (
                      <ListItem
                        key={component.title}
                        title={component.title}
                        href={component.href}
                      />
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Add-Ons</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                    {insertsAndAddons.map((component) => (
                      <ListItem
                        key={component.title}
                        title={component.title}
                        href={component.href}
                      />
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                  <Link href="/custom-order">Custom Order</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                  <Link href="/blog">Blog</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                  <Link href="/contact">Contact</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Mobile Nav */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle>
                <Link href="/" className="flex items-center space-x-2" onClick={() => setMobileMenuOpen(false)}>
                  <BookHeart className="h-6 w-6 text-primary" />
                  <span className="font-bold font-headline text-lg">
                    United Love Luxe
                  </span>
                </Link>
              </SheetTitle>
            </SheetHeader>
            <div className="mt-8 flex flex-col space-y-4">
              <Link href="/" className="py-2" onClick={() => setMobileMenuOpen(false)}>Home</Link>

              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="wedding-invites">
                  <AccordionTrigger className="py-2">Wedding Invitations</AccordionTrigger>
                  <AccordionContent className="pl-4">
                    <div className='flex flex-col space-y-2 mt-2'>
                      {weddingInvitations.map(item => (
                        <Link key={item.href} href={item.href} className="py-1 text-muted-foreground" onClick={() => setMobileMenuOpen(false)}>{item.title}</Link>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="save-the-dates">
                  <AccordionTrigger className="py-2">Save the Dates</AccordionTrigger>
                  <AccordionContent className="pl-4">
                    <div className='flex flex-col space-y-2 mt-2'>
                      {saveTheDates.map(item => (
                        <Link key={item.href} href={item.href} className="py-1 text-muted-foreground" onClick={() => setMobileMenuOpen(false)}>{item.title}</Link>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="box-folio">
                  <AccordionTrigger className="py-2">Box & Folio Invitations</AccordionTrigger>
                  <AccordionContent className="pl-4">
                    <div className='flex flex-col space-y-2 mt-2'>
                      {boxAndFolio.map(item => (
                        <Link key={item.href} href={item.href} className="py-1 text-muted-foreground" onClick={() => setMobileMenuOpen(false)}>{item.title}</Link>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="inserts-addons">
                  <AccordionTrigger className="py-2">Inserts & Add-Ons</AccordionTrigger>
                  <AccordionContent className="pl-4">
                    <div className='flex flex-col space-y-2 mt-2'>
                      {insertsAndAddons.map(item => (
                        <Link key={item.href} href={item.href} className="py-1 text-muted-foreground" onClick={() => setMobileMenuOpen(false)}>{item.title}</Link>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <Link href="/custom-order" className="py-2" onClick={() => setMobileMenuOpen(false)}>Custom Order</Link>
              <Link href="/blog" className="py-2" onClick={() => setMobileMenuOpen(false)}>Blog</Link>
              <Link href="/contact" className="py-2" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
              <Link href="/account" className="py-2" onClick={() => setMobileMenuOpen(false)}>My Account</Link>
              <Link href="/wishlist" className="py-2" onClick={() => setMobileMenuOpen(false)}>Wishlist</Link>
            </div>
          </SheetContent>
        </Sheet>

        <div className="flex flex-1 items-center justify-end space-x-2">
          <div className="hidden md:block mr-2">
            <SearchBar />
          </div>
          <Button asChild variant="ghost" size="icon" className="hidden lg:flex relative">
            <Link href="/wishlist">
              <Heart className="h-5 w-5" />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                  {wishlistItems.length}
                </span>
              )}
              <span className="sr-only">Wishlist</span>
            </Link>
          </Button>
          <Button asChild variant="ghost" className="hidden lg:flex">
            <Link href="/account">My Account</Link>
          </Button>
          <Sheet open={cartOpen} onOpenChange={setCartOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingBag className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                    {totalItems}
                  </span>
                )}
                <span className="sr-only">Shopping Cart</span>
              </Button>
            </SheetTrigger>
            <CartSheet onClose={() => setCartOpen(false)} />
          </Sheet>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

const ListItem = React.forwardRef<
  React.ElementRef<'a'>,
  React.ComponentPropsWithoutRef<'a'>
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = 'ListItem';

export default Navigation;
