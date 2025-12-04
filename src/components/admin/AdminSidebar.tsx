'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  FileText,
  BookHeart,
  ShoppingBag,
  List,
  Image as ImageIcon,
  Users
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/orders', icon: ShoppingBag, label: 'Orders' },
  { href: '/admin/quotes', icon: FileText, label: 'Quotes' },
  { href: '/admin/products', icon: Package, label: 'Products' },
  { href: '/admin/categories', icon: List, label: 'Categories' },
  { href: '/admin/media', icon: ImageIcon, label: 'Media Library' },
  { href: '/admin/blog', icon: FileText, label: 'Blog Manager' },
  { href: '/admin/subscribers', icon: Users, label: 'Subscribers' },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-sidebar-border bg-sidebar p-4 text-sidebar-foreground">
      <div className="flex items-center space-x-2 pb-6 border-b border-sidebar-border mb-6">
        <BookHeart className="h-8 w-8 text-sidebar-primary" />
        <span className="font-headline text-xl font-bold">Admin Panel</span>
      </div>
      <nav className="flex flex-col gap-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                isActive ? 'bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90 hover:text-sidebar-primary-foreground' : 'text-sidebar-foreground'
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
