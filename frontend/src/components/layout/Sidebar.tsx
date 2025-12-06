'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HomeIcon,
  DocumentTextIcon,
  PhotoIcon,
  ChartBarIcon,
  UsersIcon,
  Cog6ToothIcon,
  SparklesIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  BellIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';
import { cn } from '@/utils';
import { useAuth } from '@/components/providers/AuthProvider';
import { useTheme } from '@/components/providers/ThemeProvider';

const navigation = [
  { name: 'Dashboard', href: '/', icon: HomeIcon, badge: null },
  { name: 'Content', href: '/content', icon: DocumentTextIcon, badge: '12' },
  { name: 'Media', href: '/media', icon: PhotoIcon, badge: null },
  { name: 'AI Studio', href: '/ai', icon: SparklesIcon, badge: 'NEW' },
  { name: 'Analytics', href: '/analytics', icon: ChartBarIcon, badge: null },
  { name: 'Users', href: '/users', icon: UsersIcon, badge: null },
  { name: 'Settings', href: '/settings', icon: Cog6ToothIcon, badge: null },
];

const contentNavigation = [
  { name: 'All Content', href: '/content' },
  { name: 'Published', href: '/content?status=published' },
  { name: 'Drafts', href: '/content?status=draft' },
  { name: 'Scheduled', href: '/content?status=scheduled' },
  { name: 'Archived', href: '/content?status=archived' },
];

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isContentExpanded, setIsContentExpanded] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <div className={cn(
      'fixed inset-y-0 left-0 z-50 flex flex-col bg-neutral-900 border-r border-neutral-800 transition-all duration-300',
      isCollapsed ? 'w-16' : 'w-60'
    )}>
      {/* Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-neutral-800">
        {!isCollapsed && (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
              <SparklesIcon className="w-5 h-5 text-neutral-950" />
            </div>
            <h1 className="text-xl font-bold text-gradient">AI CMS</h1>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 transition-colors"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <svg 
            className={cn('w-5 h-5 transition-transform', isCollapsed ? 'rotate-180' : '')}
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      {/* Quick Actions */}
      {!isCollapsed && (
        <div className="p-4">
          <Link
            href="/content/new"
            className="flex items-center justify-center w-full h-10 px-4 bg-primary-500 text-neutral-950 font-semibold rounded-secondary hover:bg-primary-50 transition-colors"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Create Content
          </Link>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navigation.map((item) => {
          const active = isActive(item.href);
          
          if (item.name === 'Content') {
            return (
              <div key={item.name}>
                <button
                  onClick={() => setIsContentExpanded(!isContentExpanded)}
                  className={cn(
                    'nav-link w-full',
                    active && 'active'
                  )}
                  title={item.name}
                >
                  <item.icon className="w-5 h-5 mr-3 flex-shrink-0" />
                  {!isCollapsed && (
                    <>
                      <span className="flex-1 text-left">{item.name}</span>
                      {item.badge && (
                        <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-secondary-500 text-white rounded-full">
                          {item.badge}
                        </span>
                      )}
                      <svg
                        className={cn(
                          'w-4 h-4 transition-transform',
                          isContentExpanded ? 'rotate-90' : ''
                        )}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </>
                  )}
                </button>
                
                {isContentExpanded && !isCollapsed && (
                  <div className="ml-8 mt-2 space-y-1">
                    {contentNavigation.map((subItem) => (
                      <Link
                        key={subItem.name}
                        href={subItem.href}
                        className={cn(
                          'block px-3 py-2 text-sm text-neutral-400 hover:text-neutral-200 rounded-secondary transition-colors',
                          isActive(subItem.href) && 'text-primary-500 bg-primary-500/10'
                        )}
                      >
                        {subItem.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'nav-link',
                active && 'active'
              )}
              title={isCollapsed ? item.name : undefined}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && (
                <>
                  <span className="flex-1">{item.name}</span>
                  {item.badge && (
                    <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-secondary-500 text-white rounded-full">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="border-t border-neutral-800 p-4">
        {!isCollapsed && (
          <div className="flex items-center space-x-3 mb-4">
            <UserCircleIcon className="w-10 h-10 text-neutral-400" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-neutral-200 truncate">
                {user?.name || 'User'}
              </p>
              <p className="text-xs text-neutral-400 truncate">
                {user?.email}
              </p>
            </div>
          </div>
        )}

        <div className="flex space-x-1">
          <button
            onClick={toggleTheme}
            className="flex-1 p-2 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 rounded-secondary transition-colors"
            title="Toggle theme"
          >
            {theme === 'dark' ? '🌙' : '☀️'}
          </button>
          
          <Link
            href="/search"
            className="flex-1 p-2 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 rounded-secondary transition-colors"
            title="Search"
          >
            <MagnifyingGlassIcon className="w-4 h-4" />
          </Link>
          
          <button
            className="flex-1 p-2 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 rounded-secondary transition-colors"
            title="Notifications"
          >
            <BellIcon className="w-4 h-4" />
          </button>
          
          <button
            onClick={logout}
            className="flex-1 p-2 text-neutral-400 hover:text-red-400 hover:bg-neutral-800 rounded-secondary transition-colors"
            title="Logout"
          >
            <ArrowRightOnRectangleIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}