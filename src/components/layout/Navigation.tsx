'use client';
import React from 'react';
import Link from 'next/link';
import { BookHeart, Menu, ShoppingBag } from 'lucide-react';
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

const weddingInvitations = [
  { title: 'Acrylic Invitations', href: '/products/wedding-invitations/acrylic' },
  { title: 'Velvet Invitations', href: '/products/wedding-invitations/velvet' },
  { title: 'Vellum Invitations', href: '/products/wedding-invitations/vellum' },
  { title: 'Paper Invitations', href: '/products/wedding-invitations/paper' },
  { title: 'Thick Block Invitations', href: '/products/wedding-invitations/thick-block' },
];

const saveTheDates = [
  { title: 'Passport Save the Dates', href: '/products/save-the-dates/passport' },
  { title: 'Ticket Save the Dates', href: '/products/save-the-dates/ticket' },
  { title: 'Paper Save the Dates', href: '/products/save-the-dates/paper' },
  { title: 'Embossed Save the Dates', href: '/products/save-the-dates/embossed' },
  { title: 'Interactive Save the Dates', href: '/products/save-the-dates/interactive' },
  { title: 'Gatefold Save the Dates', href: '/products/save-the-dates/gatefold' },
  { title: 'Vellum Save the Dates', href: '/products/save-the-dates/vellum' },
  { title: 'Arc Save the Dates', href: '/products/save-the-dates/arc' },
  { title: 'Kraft Save the Dates', href: '/products/save-the-dates/kraft' },
];

const boxAndFolio = [
    { title: 'Velvet Boxed Invitations', href: '/products/box-folio/velvet-boxed' },
    { title: 'Paper Boxed Invitations', href: '/products/box-folio/paper-boxed' },
    { title: 'Velvet Folios', href: '/products/box-folio/velvet-folios' },
    { title: 'Paper Folios', href: '/products/box-folio/paper-folios' },
]

const insertsAndAddons = [
    { title: 'RSVP Cards', href: '/products/inserts-addons/rsvp' },
    { title: 'Return Envelopes', href: '/products/inserts-addons/envelopes' },
    { title: 'Details Cards', href: '/products/inserts-addons/details' },
    { title: 'Menu Cards', href: '/products/inserts-addons/menu' },
    { title: 'Place Cards', href: '/products/inserts-addons/place-cards' },
    { title: 'Table Cards', href: '/products/inserts-addons/table-cards' },
    { title: 'Guest Addressing Labels', href: '/products/inserts-addons/labels' },
    { title: 'Clear/White/Kraft Seals', href: '/products/inserts-addons/seals' },
]

const Navigation = () => {
  const { cartItems } = useCart();
  const totalItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <BookHeart className="h-6 w-6 text-primary" />
          <span className="hidden font-bold sm:inline-block font-headline text-lg">
            United Love Luxe
          </span>
        </Link>
        
        {/* Desktop Nav */}
        <div className="mr-4 hidden md:flex">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link href="/" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Home
                  </NavigationMenuLink>
                </Link>
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
                <NavigationMenuTrigger>Box & Folio Invitations</NavigationMenuTrigger>
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
                <NavigationMenuTrigger>Inserts & Add-Ons</NavigationMenuTrigger>
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
                <Link href="/blog" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Blog
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/my-account" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    My Account
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Mobile Nav */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
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

              <Link href="/blog" className="py-2" onClick={() => setMobileMenuOpen(false)}>Blog</Link>
              <Link href="/my-account" className="py-2" onClick={() => setMobileMenuOpen(false)}>My Account</Link>
              <Link href="/admin" className="py-2" onClick={() => setMobileMenuOpen(false)}>Admin</Link>
            </div>
          </SheetContent>
        </Sheet>
        
        <div className="flex flex-1 items-center justify-end space-x-2">
          <Sheet>
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
            <CartSheet />
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
