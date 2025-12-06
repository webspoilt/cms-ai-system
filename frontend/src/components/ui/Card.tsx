'use client';

import { ReactNode } from 'react';
import { cn } from '@/utils';

interface CardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  description?: string;
  icon?: ReactNode;
  footer?: ReactNode;
  onClick?: () => void;
  hover?: boolean;
}

export function Card({ 
  children, 
  className, 
  title, 
  description, 
  icon, 
  footer,
  onClick,
  hover = true 
}: CardProps) {
  const Component = onClick ? 'button' : 'div';
  
  return (
    <Component
      className={cn(
        'card-glass text-left w-full',
        hover && 'hover:border-neutral-600/50 hover:shadow-glow-primary',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {(title || icon || description) && (
        <div className="mb-4">
          <div className="flex items-center space-x-3 mb-2">
            {icon && (
              <div className="text-primary-500">
                {icon}
              </div>
            )}
            {title && (
              <h3 className="text-card-title text-neutral-100">
                {title}
              </h3>
            )}
          </div>
          
          {description && (
            <p className="text-sm text-neutral-400">
              {description}
            </p>
          )}
        </div>
      )}
      
      <div className="mb-4">
        {children}
      </div>
      
      {footer && (
        <div className="border-t border-neutral-800/50 pt-4">
          {footer}
        </div>
      )}
    </Component>
  );
}

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
  };
  icon?: ReactNode;
  loading?: boolean;
}

export function StatsCard({ title, value, change, icon, loading }: StatsCardProps) {
  return (
    <Card className="relative overflow-hidden">
      {loading && (
        <div className="absolute inset-0 bg-neutral-900/50 backdrop-blur-sm flex items-center justify-center">
          <div className="loading-dots">
            <div style={{ '--delay': '0ms' } as React.CSSProperties} />
            <div style={{ '--delay': '150ms' } as React.CSSProperties} />
            <div style={{ '--delay': '300ms' } as React.CSSProperties} />
          </div>
        </div>
      )}
      
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-neutral-400 mb-1">
            {title}
          </p>
          <p className="text-3xl font-bold text-neutral-100">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
          
          {change && (
            <div className="flex items-center mt-2">
              <span
                className={cn(
                  'text-sm font-medium',
                  change.type === 'increase' 
                    ? 'text-success' 
                    : 'text-error'
                )}
              >
                {change.type === 'increase' ? '+' : '-'}
                {Math.abs(change.value)}%
              </span>
              <span className="text-sm text-neutral-400 ml-1">
                vs last month
              </span>
            </div>
          )}
        </div>
        
        {icon && (
          <div className="text-4xl text-primary-500/20">
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
}