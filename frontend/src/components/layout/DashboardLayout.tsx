'use client';

import { ReactNode, useState } from 'react';
import { Sidebar } from './Sidebar';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { SearchModal } from '@/components/modals/SearchModal';
import { NotificationPanel } from '@/components/ui/NotificationPanel';
import { cn } from '@/utils';

interface DashboardLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
  breadcrumbs?: Array<{ name: string; href?: string }>;
  actions?: ReactNode;
  className?: string;
}

export function DashboardLayout({ 
  children, 
  title, 
  description, 
  breadcrumbs,
  actions,
  className 
}: DashboardLayoutProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-neutral-950">
      <Sidebar />
      
      {/* Main Content */}
      <div className={cn('transition-all duration-300', 'ml-60')}>
        {/* Header */}
        <header className="sticky top-0 z-40 bg-neutral-950/80 backdrop-blur-sm border-b border-neutral-800">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                {breadcrumbs ? (
                  <Breadcrumbs items={breadcrumbs} />
                ) : (
                  <div>
                    {title && (
                      <h1 className="text-page-title text-neutral-100">{title}</h1>
                    )}
                    {description && (
                      <p className="mt-1 text-neutral-400">{description}</p>
                    )}
                  </div>
                )}
              </div>
              
              {actions && (
                <div className="flex items-center space-x-3 ml-6">
                  {actions}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className={cn('flex-1', className)}>
          {children}
        </main>
      </div>

      {/* Modals */}
      <SearchModal 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
      />
      
      <NotificationPanel 
        isOpen={isNotificationsOpen} 
        onClose={() => setIsNotificationsOpen(false)} 
      />
    </div>
  );
}