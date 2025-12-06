import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatsCard } from '@/components/ui/Card';
import { ContentTable } from '@/components/tables/ContentTable';
import { AnalyticsChart } from '@/components/charts/AnalyticsChart';
import { RecentActivity } from '@/components/activity/RecentActivity';
import {
  DocumentTextIcon,
  EyeIcon,
  UsersIcon,
  ArrowTrendingUpIcon,
} from '@heroicons/react/24/outline';
import { Suspense } from 'react';
import { DashboardMetrics } from '@/types';

interface DashboardPageProps {
  metrics: DashboardMetrics;
}

// Mock data for demonstration - in real app, this would come from API
const mockMetrics: DashboardMetrics = {
  totalContent: 248,
  publishedContent: 186,
  draftContent: 42,
  totalViews: 125420,
  uniqueVisitors: 23450,
  topContent: [],
  recentActivity: [],
  performance: {
    averageLoadTime: 1.2,
    uptime: 99.9,
    errorRate: 0.1,
  },
};

const mockTopContent = [
  {
    id: '1',
    title: 'Getting Started with AI-Powered Content Management',
    views: 12420,
    author: { name: 'John Doe' },
    status: 'published' as const,
    publishedAt: new Date('2024-01-15'),
    createdAt: new Date('2024-01-10'),
  },
  {
    id: '2',
    title: 'Advanced SEO Optimization Techniques',
    views: 9876,
    author: { name: 'Jane Smith' },
    status: 'published' as const,
    publishedAt: new Date('2024-01-12'),
    createdAt: new Date('2024-01-08'),
  },
  {
    id: '3',
    title: 'Real-time Collaboration in Modern CMS',
    views: 8234,
    author: { name: 'Mike Johnson' },
    status: 'published' as const,
    publishedAt: new Date('2024-01-10'),
    createdAt: new Date('2024-01-05'),
  },
];

const mockRecentActivity = [
  {
    id: '1',
    user: { name: 'John Doe', avatar: '/avatars/john.jpg' },
    action: 'published',
    resource: 'Getting Started with AI-Powered Content Management',
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
  },
  {
    id: '2',
    user: { name: 'Jane Smith', avatar: '/avatars/jane.jpg' },
    action: 'updated',
    resource: 'Advanced SEO Optimization Techniques',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
  },
  {
    id: '3',
    user: { name: 'Mike Johnson', avatar: '/avatars/mike.jpg' },
    action: 'created',
    resource: 'New content draft',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
  },
];

export default function DashboardPage() {
  return (
    <DashboardLayout
      title="Dashboard"
      description="Welcome to your AI-powered content management system"
      breadcrumbs={[
        { name: 'Dashboard' },
      ]}
    >
      <div className="container-main py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Content"
            value={mockMetrics.totalContent}
            change={{ value: 12, type: 'increase' }}
            icon={<DocumentTextIcon className="w-8 h-8" />}
          />
          <StatsCard
            title="Total Views"
            value={mockMetrics.totalViews}
            change={{ value: 8, type: 'increase' }}
            icon={<EyeIcon className="w-8 h-8" />}
          />
          <StatsCard
            title="Unique Visitors"
            value={mockMetrics.uniqueVisitors}
            change={{ value: 15, type: 'increase' }}
            icon={<UsersIcon className="w-8 h-8" />}
          />
          <StatsCard
            title="Performance Score"
            value={`${mockMetrics.performance.uptime}%`}
            change={{ value: 2, type: 'increase' }}
            icon={<ArrowTrendingUpIcon className="w-8 h-8" />}
          />
        </div>

        {/* Charts and Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Analytics Chart */}
          <div className="lg:col-span-2">
            <div className="card-glass">
              <h3 className="text-xl font-semibold text-neutral-100 mb-6">
                Traffic Analytics
              </h3>
              <Suspense fallback={<div className="h-80 bg-neutral-800/50 rounded-primary animate-pulse" />}>
                <AnalyticsChart />
              </Suspense>
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <div className="card-glass">
              <h3 className="text-xl font-semibold text-neutral-100 mb-6">
                Recent Activity
              </h3>
              <Suspense fallback={<div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-neutral-800 rounded-full animate-pulse" />
                    <div className="flex-1">
                      <div className="h-4 bg-neutral-800 rounded animate-pulse mb-2" />
                      <div className="h-3 bg-neutral-800/50 rounded animate-pulse w-2/3" />
                    </div>
                  </div>
                ))}
              </div>}>
                <RecentActivity activities={mockRecentActivity} />
              </Suspense>
            </div>
          </div>
        </div>

        {/* Top Content */}
        <div className="card-glass">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-neutral-100">
              Top Performing Content
            </h3>
            <button className="btn-primary">
              View All
            </button>
          </div>
          <Suspense fallback={<div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-neutral-800/50 rounded-primary animate-pulse" />
            ))}
          </div>}>
            <ContentTable 
              contents={mockTopContent} 
              showActions={false}
              compact
            />
          </Suspense>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="card-glass text-center">
            <div className="w-12 h-12 bg-primary-500/20 rounded-primary flex items-center justify-center mx-auto mb-4">
              <DocumentTextIcon className="w-6 h-6 text-primary-500" />
            </div>
            <h4 className="text-lg font-semibold text-neutral-100 mb-2">
              Create Content
            </h4>
            <p className="text-neutral-400 mb-4">
              Start writing with AI assistance
            </p>
            <button className="btn-primary w-full">
              New Article
            </button>
          </div>

          <div className="card-glass text-center">
            <div className="w-12 h-12 bg-secondary-500/20 rounded-primary flex items-center justify-center mx-auto mb-4">
              <ArrowTrendingUpIcon className="w-6 h-6 text-secondary-500" />
            </div>
            <h4 className="text-lg font-semibold text-neutral-100 mb-2">
              View Analytics
            </h4>
            <p className="text-neutral-400 mb-4">
              Check your content performance
            </p>
            <button className="btn-primary w-full">
              Analytics
            </button>
          </div>

          <div className="card-glass text-center">
            <div className="w-12 h-12 bg-success/20 rounded-primary flex items-center justify-center mx-auto mb-4">
              <UsersIcon className="w-6 h-6 text-success" />
            </div>
            <h4 className="text-lg font-semibold text-neutral-100 mb-2">
              Manage Users
            </h4>
            <p className="text-neutral-400 mb-4">
              Invite team members
            </p>
            <button className="btn-primary w-full">
              Invite Users
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}