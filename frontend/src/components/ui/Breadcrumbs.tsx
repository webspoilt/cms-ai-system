'use client';

import Link from 'next/link';
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/24/outline';
import { cn } from '@/utils';

interface BreadcrumbItem {
  name: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <nav 
      aria-label="Breadcrumb" 
      className={cn('flex items-center space-x-2 text-sm', className)}
    >
      <Link
        href="/"
        className="flex items-center text-neutral-400 hover:text-neutral-200 transition-colors"
        title="Home"
      >
        <HomeIcon className="w-4 h-4" />
      </Link>
      
      {items.map((item, index) => (
        <div key={index} className="flex items-center space-x-2">
          <ChevronRightIcon className="w-4 h-4 text-neutral-600" />
          
          {item.href ? (
            <Link
              href={item.href}
              className="text-neutral-400 hover:text-neutral-200 transition-colors max-w-xs truncate"
            >
              {item.name}
            </Link>
          ) : (
            <span className="text-neutral-200 max-w-xs truncate" aria-current="page">
              {item.name}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
}