import { BookHeart, Twitter, Instagram, Facebook } from 'lucide-react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
          <div className="flex items-center space-x-2 justify-center md:justify-start">
            <BookHeart className="h-6 w-6 text-primary" />
            <span className="font-headline text-lg font-bold">
              United Love Luxe
            </span>
          </div>
          <div className="text-sm text-muted-foreground flex flex-col justify-center items-center">
            <p>&copy; {new Date().getFullYear()} United by Love Invitations. All rights reserved.</p>
            <Link href="/admin" className="text-xs hover:text-primary transition-colors mt-1">Admin</Link>
          </div>
          <div className="flex items-center justify-center md:justify-end space-x-4">
            <Link href="#" aria-label="Twitter">
              <Twitter className="h-5 w-5 transition-colors hover:text-primary" />
            </Link>
            <Link href="#" aria-label="Instagram">
              <Instagram className="h-5 w-5 transition-colors hover:text-primary" />
            </Link>
            <Link href="#" aria-label="Facebook">
              <Facebook className="h-5 w-5 transition-colors hover:text-primary" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
